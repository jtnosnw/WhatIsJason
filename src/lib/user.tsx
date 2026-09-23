import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePrefs } from './prefs.tsx'
import type { AnswerRecord } from './quiz.ts'
import type { ReviewItem } from './review.ts'
import type { Attempt, PathProgress } from './userData.ts'

// Soft gate (SPEC §2.1, as decided for v1): the glossary and quizzes are open to
// everyone. Signing in with an allowlisted Google account unlocks saved
// progress: attempts, review queue, path progress and synced prefs.

type UserData = typeof import('./userData.ts')

export interface SignedInUser {
  uid: string
  email: string | null
  name: string | null
}

export type UserState =
  | { status: 'loading' }
  | { status: 'unavailable'; message: string }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: SignedInUser; allowed: false }
  | { status: 'signed-in'; user: SignedInUser; allowed: true; data: UserCache | null; loadError?: string }

export interface UserCache {
  attempts: Attempt[]
  review: Map<string, ReviewItem>
  paths: Map<string, PathProgress>
}

interface UserContextValue {
  state: UserState
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  signInError: string | null
  /** Resolve when saved. Only callable when signed in and allowed. */
  saveQuiz: (category: string, result: { startedAt: Date; completedAt: Date; answers: AnswerRecord[] }) => Promise<void>
  saveReview: (answers: AnswerRecord[]) => Promise<void>
  savePath: (pathId: string, progress: PathProgress) => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

const POPUP_CLOSED = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request']

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>({ status: 'loading' })
  const [signInError, setSignInError] = useState<string | null>(null)
  const api = useRef<UserData | null>(null)
  const { prefs, setPrefs } = usePrefs()
  const syncedPrefs = useRef<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    import('./userData.ts')
      .then(mod => {
        if (cancelled) return
        api.current = mod
        unsubscribe = mod.watchAuth(async fbUser => {
          syncedPrefs.current = null
          if (!fbUser) { setState({ status: 'signed-out' }); return }
          const user = { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName }
          setState({ status: 'loading' })
          let allowed = false
          try { allowed = await mod.isAllowlisted(fbUser.email) } catch { allowed = false }
          if (!allowed) { setState({ status: 'signed-in', user, allowed: false }); return }

          setState({ status: 'signed-in', user, allowed: true, data: null })
          try {
            const [stored, attempts, review, paths] = await Promise.all([
              mod.touchUser(fbUser), mod.loadAttempts(user.uid), mod.loadReview(user.uid), mod.loadPathProgress(user.uid),
            ])
            // Stored prefs win on sign-in; after that, local changes are synced up.
            if (stored) setPrefs({ ...(stored.depth ? { depth: stored.depth } : {}), ...(stored.theme ? { theme: stored.theme } : {}) })
            // Same key order as the sync effect below, so an unchanged value isn't re-written.
            syncedPrefs.current = JSON.stringify({ depth: stored?.depth, theme: stored?.theme })
            setState({ status: 'signed-in', user, allowed: true, data: { attempts, review, paths } })
          } catch (err) {
            setState({ status: 'signed-in', user, allowed: true, data: null, loadError: (err as Error).message })
          }
        })
      })
      .catch((err: Error) => {
        // Missing config or a failed chunk load: progress is unavailable, the glossary is not.
        if (!cancelled) setState({ status: 'unavailable', message: err.message })
      })

    return () => { cancelled = true; unsubscribe?.() }
  }, [setPrefs])

  // Sync prefs changes up while signed in and allowed.
  const allowedUid = state.status === 'signed-in' && state.allowed && state.data ? state.user.uid : null
  useEffect(() => {
    if (!allowedUid || !api.current || syncedPrefs.current === null) return
    const serialised = JSON.stringify({ depth: prefs.depth, theme: prefs.theme })
    if (serialised === syncedPrefs.current) return
    syncedPrefs.current = serialised
    api.current.savePrefs(allowedUid, prefs).catch(() => { syncedPrefs.current = null })
  }, [allowedUid, prefs])

  const signIn = useCallback(async () => {
    setSignInError(null)
    if (!api.current) return
    try {
      await api.current.signInWithGoogle()
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (POPUP_CLOSED.includes(code)) return
      setSignInError(code === 'auth/popup-blocked'
        ? 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.'
        : `Sign-in failed (${code || (err as Error).message}).`)
    }
  }, [])

  const signOut = useCallback(async () => { await api.current?.signOutUser() }, [])

  const requireAllowed = useCallback(() => {
    if (state.status !== 'signed-in' || !state.allowed || !state.data || !api.current) {
      throw new Error('Progress can only be saved when signed in with an allowlisted account.')
    }
    return { mod: api.current, uid: state.user.uid, data: state.data }
  }, [state])

  const updateData = useCallback((fn: (d: UserCache) => UserCache) => {
    setState(s => (s.status === 'signed-in' && s.allowed && s.data ? { ...s, data: fn(s.data) } : s))
  }, [])

  const saveQuiz = useCallback<UserContextValue['saveQuiz']>(async (category, result) => {
    const { mod, uid, data } = requireAllowed()
    const saved = await mod.saveQuizAttempt(uid, category, result, data.review)
    updateData(d => ({
      ...d,
      review: saved.review,
      attempts: [...d.attempts.filter(a => !saved.pruned.includes(a.id)), saved.attempt],
    }))
  }, [requireAllowed, updateData])

  const saveReview = useCallback<UserContextValue['saveReview']>(async answers => {
    const { mod, uid, data } = requireAllowed()
    const review = await mod.saveReviewSession(uid, answers, data.review, new Date())
    updateData(d => ({ ...d, review }))
  }, [requireAllowed, updateData])

  const savePath = useCallback<UserContextValue['savePath']>(async (pathId, progress) => {
    const { mod, uid } = requireAllowed()
    await mod.savePathProgress(uid, pathId, progress)
    updateData(d => ({ ...d, paths: new Map(d.paths).set(pathId, progress) }))
  }, [requireAllowed, updateData])

  const value = useMemo(
    () => ({ state, signIn, signOut, signInError, saveQuiz, saveReview, savePath }),
    [state, signIn, signOut, signInError, saveQuiz, saveReview, savePath],
  )
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser() outside <UserProvider>')
  return ctx
}

/** The cached user data when progress is available, else null. */
export function useProgress(): UserCache | null {
  const { state } = useUser()
  return state.status === 'signed-in' && state.allowed ? state.data : null
}
