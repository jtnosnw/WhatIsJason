import { useEffect, useRef, useState } from 'react'
import { useProgress } from '../lib/user.tsx'
import { ProgressGate } from './Account.tsx'

type Status = 'saving' | 'saved' | { error: string }

// Runs `save` once progress is available (including if the user signs in from
// this screen), and reports how it went.
export function SaveStatus({ save, what }: { save: () => Promise<void>; what: string }) {
  const progress = useProgress()
  const [status, setStatus] = useState<Status>('saving')
  const [attempt, setAttempt] = useState(0)
  const started = useRef(-1) // which attempt has been started; guards StrictMode's double effect
  const canSave = progress !== null

  useEffect(() => {
    if (!canSave || started.current === attempt) return
    started.current = attempt
    save().then(() => setStatus('saved'), (err: Error) => setStatus({ error: err.message }))
  }, [canSave, save, attempt])

  if (!canSave) return <ProgressGate what={what} />
  if (status === 'saving') return <p className="meta" role="status">Saving…</p>
  if (status === 'saved') return <p className="meta" role="status">Saved to your progress.</p>
  return (
    <div className="notice notice--error" role="alert">
      <p>Couldn't save this: {status.error}</p>
      <div>
        <button type="button" className="btn" onClick={() => { setStatus('saving'); setAttempt(a => a + 1) }}>Try again</button>
      </div>
    </div>
  )
}
