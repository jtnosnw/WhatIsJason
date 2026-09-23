import type { ReactNode } from 'react'
import { useContentState } from '../lib/content.tsx'

export function ContentGate({ children }: { children: ReactNode }) {
  const state = useContentState()
  if (state.status === 'loading') {
    return <p className="status" role="status">Loading the glossary…</p>
  }
  if (state.status === 'error') {
    return (
      <div className="notice notice--error" role="alert">
        <h1>The glossary couldn't load</h1>
        <p>{state.message}. Check your connection and reload the page.</p>
      </div>
    )
  }
  return <>{children}</>
}
