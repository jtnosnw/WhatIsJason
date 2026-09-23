import { useUser } from '../lib/user.tsx'

/** Header control: sign in / who's signed in / sign out. */
export function AccountControl() {
  const { state, signIn, signOut, signInError } = useUser()
  if (state.status === 'loading' || state.status === 'unavailable') return null
  if (state.status === 'signed-out') {
    return (
      <div className="account">
        <button type="button" className="btn" onClick={signIn}>Sign in</button>
        {signInError && <span className="meta" role="alert">{signInError}</span>}
      </div>
    )
  }
  return (
    <div className="account">
      <span className="account__name meta">{state.user.name ?? state.user.email}</span>
      <button type="button" className="btn btn--ghost" onClick={signOut}>Sign out</button>
    </div>
  )
}

/**
 * Explains, where progress would appear, why it isn't there. Renders nothing
 * when progress is available. `what` completes "Sign in to …".
 */
export function ProgressGate({ what }: { what: string }) {
  const { state, signIn, signInError } = useUser()

  if (state.status === 'loading') return <p className="meta" role="status">Checking your sign-in…</p>
  if (state.status === 'unavailable') {
    return <p className="notice meta">Saved progress isn't available right now ({state.message}). Everything else still works.</p>
  }
  if (state.status === 'signed-out') {
    return (
      <div className="notice">
        <p>Sign in to {what}.</p>
        <div><button type="button" className="btn btn--primary" onClick={signIn}>Sign in with Google</button></div>
        {signInError && <p className="meta" role="alert">{signInError}</p>}
      </div>
    )
  }
  if (!state.allowed) {
    return (
      <p className="notice">
        You're signed in as {state.user.email}, but this account isn't on the access list, so progress
        isn't saved. You can still use the whole glossary and take quizzes.
      </p>
    )
  }
  if (state.loadError) return <p className="notice notice--error" role="alert">Couldn't load your progress: {state.loadError}</p>
  if (!state.data) return <p className="meta" role="status">Loading your progress…</p>
  return null
}
