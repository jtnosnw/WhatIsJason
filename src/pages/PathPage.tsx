import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ProgressGate } from '../components/Account.tsx'
import { DomainDot } from '../components/Badges.tsx'
import { Icon } from '../components/Icon.tsx'
import { useContent } from '../lib/content.tsx'
import type { LearningPath } from '../lib/content-types.ts'
import { AUDIENCE_LABEL, domainLabel } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'
import { useProgress, useUser } from '../lib/user.tsx'
import type { PathProgress } from '../lib/userData.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

export function PathPage() {
  const { id } = useParams()
  const { paths } = useContent()
  const path = paths.find(p => p.id === id)
  useDocumentTitle(path?.title ?? 'Path not found')
  if (!path) return <NotFoundPage what="learning path" />
  return <PathView key={path.id} path={path} />
}

function PathView({ path }: { path: LearningPath }) {
  const { entryById } = useContent()
  const progress = useProgress()
  const { savePath } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const prog = progress?.paths.get(path.id)
  // completedStepIndex = index of the furthest completed step (SCHEMA §5); absent = none yet.
  const lastDone = prog?.completedStepIndex ?? -1
  const current = prog ? lastDone + 1 : -1

  async function update(next: PathProgress) {
    setBusy(true)
    setError(null)
    try { await savePath(path.id, next) } catch (err) { setError((err as Error).message) }
    setBusy(false)
  }

  const start = () => update({ startedAt: new Date() })
  const completeStep = (i: number) => update({
    startedAt: prog?.startedAt ?? new Date(),
    completedStepIndex: i,
    ...(i === path.steps.length - 1 ? { completedAt: new Date() } : {}),
  })

  return (
    <div className="stack">
      <header className="page-intro">
        <p className="meta"><Link to="/paths">Learning paths</Link></p>
        <h1>{path.title}</h1>
        <p className="lead">{path.description}</p>
        <div className="badge-row">
          <span className="badge">{AUDIENCE_LABEL[path.audience]}</span>
          <span className="badge">{path.estimatedMinutes} min</span>
          <span className="badge">{path.steps.length} steps</span>
        </div>
        {path.assumesKnown.length > 0 && (
          <p className="meta">
            Assumes you know{' '}
            {path.assumesKnown.map((id, i) => (
              <span key={id}>{i > 0 && ', '}<Link to={`/term/${id}`}>{entryById.get(id)?.term ?? id}</Link></span>
            ))}
          </p>
        )}
      </header>

      {progress ? (
        <div className="section">
          {!prog && <div><button type="button" className="btn btn--primary" onClick={start} disabled={busy}>Start this path</button></div>}
          {prog?.completedAt && <p className="path-done"><Icon name="correct" />You've finished this path.</p>}
          {prog && !prog.completedAt && <p className="meta">{lastDone + 1} of {path.steps.length} steps done. Pick up at step {current + 1}.</p>}
          {error && <p className="notice notice--error" role="alert">Couldn't save your progress: {error}</p>}
        </div>
      ) : (
        <ProgressGate what="track your progress through this path" />
      )}

      <ol className="path-steps">
        {path.steps.map((step, i) => {
          const isDone = i <= lastDone
          const isCurrent = i === current && !prog?.completedAt
          return (
            <li key={i} className={`path-step${isDone ? ' path-step--done' : ''}${isCurrent ? ' path-step--current' : ''}`} aria-current={isCurrent ? 'step' : undefined}>
              <span className="path-step__marker" aria-hidden="true">{isDone ? <Icon name="correct" /> : i + 1}</span>
              <div className="path-step__body">
                {'entry' in step ? (
                  <>
                    <Link className="path-step__title" to={`/term/${step.entry}`}>{entryById.get(step.entry)?.term ?? step.entry}</Link>
                    <p className="meta">{entryById.get(step.entry)?.summary}</p>
                    {step.note && <p>{step.note}</p>}
                  </>
                ) : (
                  <>
                    <Link className="path-step__title" to={step.category ? `/quiz?category=${step.category}` : '/quiz'}>
                      Checkpoint quiz{step.category && <>: <DomainDot domain={step.category} /> {domainLabel(step.category)}</>}
                    </Link>
                    <p className="meta">Check what's stuck before moving on.</p>
                  </>
                )}
                {isDone && <span className="visually-hidden">(done)</span>}
                {isCurrent && progress && (
                  <div>
                    <button type="button" className="btn" onClick={() => completeStep(i)} disabled={busy}>
                      <Icon name="correct" />Mark as done
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
