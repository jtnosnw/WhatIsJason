import { Link } from 'react-router'
import { useContent } from '../lib/content.tsx'
import { AUDIENCE_LABEL } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'
import { useProgress } from '../lib/user.tsx'

export function PathsPage() {
  const { paths } = useContent()
  const progress = useProgress()
  useDocumentTitle('Learning paths')

  return (
    <div className="stack">
      <header className="page-intro">
        <h1>Learning paths</h1>
        <p className="lead">Short routes through the glossary, in an order where each term builds on the last.</p>
      </header>

      {paths.length === 0 ? (
        <p className="notice">No learning paths have been published yet.</p>
      ) : (
        <div className="card-grid">
          {paths.map(p => {
            const prog = progress?.paths.get(p.id)
            const done = (prog?.completedStepIndex ?? -1) + 1
            return (
              <article key={p.id} className="card card--link">
                <h2 className="card__title">
                  <Link className="card__stretched" to={`/path/${p.id}`}>{p.title}</Link>
                </h2>
                <p className="card__summary">{p.description}</p>
                <div className="badge-row">
                  <span className="badge">{AUDIENCE_LABEL[p.audience]}</span>
                  <span className="badge">{p.estimatedMinutes} min</span>
                  <span className="badge">{p.steps.length} steps</span>
                </div>
                {prog && (
                  <p className="meta">
                    {prog.completedAt ? 'Completed' : `${done} of ${p.steps.length} steps done`}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
