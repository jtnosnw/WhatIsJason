// Everything that touches Firebase. Loaded lazily (dynamic import) so the
// glossary never waits on, or breaks because of, the Firebase SDK.
// Firestore holds user data only, shaped exactly as SCHEMA §5.

import {
  GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User,
} from 'firebase/auth'
import {
  Timestamp, collection, deleteField, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where, writeBatch,
} from 'firebase/firestore'
import { auth, db } from './firebase.ts'
import type { Prefs } from './prefs.tsx'
import type { AnswerRecord } from './quiz.ts'
import { tally } from './quiz.ts'
import { nextReview, type ReviewItem } from './review.ts'

export const ATTEMPTS_KEPT_PER_CATEGORY = 5 // SCHEMA §5.2

export interface Attempt {
  id: string
  category: string
  startedAt: Date
  completedAt: Date
  questionCount: number
  correct: number
  incorrect: number
  skipped: number
  answers: AnswerRecord[]
}

export interface PathProgress {
  startedAt: Date
  completedStepIndex?: number
  completedAt?: Date
}

const toDate = (v: unknown) => (v instanceof Timestamp ? v.toDate() : new Date(NaN))

// ── Auth ───────────────────────────────────────────────────────────────────

export const watchAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb)

// signInWithPopup only, never signInWithRedirect (CLAUDE.md rule 4).
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())

export const signOutUser = () => signOut(auth)

/** allowlist/{email}: readable by signed-in users, written only from the console. */
export async function isAllowlisted(email: string | null): Promise<boolean> {
  if (!email) return false
  const snap = await getDoc(doc(db, 'allowlist', email))
  return snap.exists()
}

// ── users/{uid} ────────────────────────────────────────────────────────────

/** Records the visit and returns stored prefs, if any. createdAt is set once. */
export async function touchUser(user: User): Promise<Partial<Prefs> | undefined> {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  await setDoc(ref, {
    ...(user.email ? { email: user.email } : {}),
    ...(user.displayName ? { displayName: user.displayName } : {}),
    lastSeenAt: serverTimestamp(),
    ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
  }, { merge: true })
  return snap.data()?.prefs as Partial<Prefs> | undefined
}

export async function savePrefs(uid: string, prefs: Prefs) {
  await setDoc(doc(db, 'users', uid), { prefs: { depth: prefs.depth, theme: prefs.theme } }, { merge: true })
}

// ── users/{uid}/attempts ───────────────────────────────────────────────────

export async function loadAttempts(uid: string): Promise<Attempt[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'attempts'))
  return snap.docs.map(d => {
    const a = d.data()
    return {
      id: d.id,
      category: a.category,
      startedAt: toDate(a.startedAt),
      completedAt: toDate(a.completedAt),
      questionCount: a.questionCount,
      correct: a.correct,
      incorrect: a.incorrect,
      skipped: a.skipped,
      answers: a.answers ?? [],
    }
  })
}

export async function loadReview(uid: string): Promise<Map<string, ReviewItem>> {
  const snap = await getDocs(collection(db, 'users', uid, 'review'))
  return new Map(snap.docs.map(d => {
    const r = d.data()
    return [d.id, { outcome: r.outcome, streak: r.streak, dueAt: toDate(r.dueAt), lastSeenAt: toDate(r.lastSeenAt) }]
  }))
}

/**
 * Applies each answer to the review queue (SCHEMA §3.3) inside `batch`, and
 * returns the queue as it will be after the batch commits.
 */
function queueReviewUpdates(
  batch: ReturnType<typeof writeBatch>, uid: string, answers: AnswerRecord[],
  review: Map<string, ReviewItem>, now: Date,
) {
  const next = new Map(review)
  for (const a of answers) {
    const update = nextReview(review.get(a.questionId), a.outcome, now)
    const ref = doc(db, 'users', uid, 'review', a.questionId)
    if (update.action === 'set') {
      batch.set(ref, update.item)
      next.set(a.questionId, update.item)
    } else if (update.action === 'delete') {
      batch.delete(ref)
      next.delete(a.questionId)
    }
  }
  return next
}

/**
 * Saves a completed quiz: the attempt, the review-queue changes, and pruning to
 * the last 5 attempts in this category, all in one batch.
 */
export async function saveQuizAttempt(
  uid: string, category: string, result: { startedAt: Date; completedAt: Date; answers: AnswerRecord[] },
  review: Map<string, ReviewItem>,
) {
  const t = tally(result.answers)
  const attemptsCol = collection(db, 'users', uid, 'attempts')
  const ref = doc(attemptsCol)
  // Field names exactly as SCHEMA §5 users/{uid}/attempts/{attemptId}.
  const data = {
    category,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    questionCount: result.answers.length,
    correct: t.correct,
    incorrect: t.incorrect,
    skipped: t.skipped,
    answers: result.answers,
  }
  const attempt: Attempt = { id: ref.id, ...data }

  const batch = writeBatch(db)
  batch.set(ref, data)

  const sameCategory = (await getDocs(query(attemptsCol, where('category', '==', category))))
    .docs.map(d => ({ id: d.id, completedAt: toDate(d.data().completedAt) }))
  const stale = sameCategory
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(ATTEMPTS_KEPT_PER_CATEGORY - 1)
  for (const s of stale) batch.delete(doc(attemptsCol, s.id))

  const nextQueue = queueReviewUpdates(batch, uid, result.answers, review, result.completedAt)
  await batch.commit()
  return { attempt, pruned: stale.map(s => s.id), review: nextQueue }
}

/** A review session updates the queue only; it isn't a category attempt. */
export async function saveReviewSession(uid: string, answers: AnswerRecord[], review: Map<string, ReviewItem>, now: Date) {
  const batch = writeBatch(db)
  const next = queueReviewUpdates(batch, uid, answers, review, now)
  await batch.commit()
  return next
}

// ── users/{uid}/paths ──────────────────────────────────────────────────────

export async function loadPathProgress(uid: string): Promise<Map<string, PathProgress>> {
  const snap = await getDocs(collection(db, 'users', uid, 'paths'))
  return new Map(snap.docs.map(d => {
    const p = d.data()
    return [d.id, {
      startedAt: toDate(p.startedAt),
      ...(typeof p.completedStepIndex === 'number' ? { completedStepIndex: p.completedStepIndex } : {}),
      ...(p.completedAt ? { completedAt: toDate(p.completedAt) } : {}),
    }]
  }))
}

export async function savePathProgress(uid: string, pathId: string, progress: PathProgress) {
  await setDoc(doc(db, 'users', uid, 'paths', pathId), {
    startedAt: progress.startedAt,
    completedStepIndex: progress.completedStepIndex ?? deleteField(),
    completedAt: progress.completedAt ?? deleteField(),
  }, { merge: true })
}
