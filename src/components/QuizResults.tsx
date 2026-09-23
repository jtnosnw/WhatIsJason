import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useContent } from '../lib/content.tsx'
import { formatDuration } from '../lib/format.ts'
import { accuracy, formatAccuracy, tally, type Outcome } from '../lib/quiz.ts'
import { OutcomeLabel } from './Outcome.tsx'
import type { SessionResult } from './QuizSession.tsx'

// Score shows correct / incorrect / skipped separately. Skipped never counts
// against accuracy; it feeds the gaps list (SPEC §4.6).

export function QuizResults({ result, status, actions }: { result: SessionResult; status?: ReactNode; actions: ReactNode }) {
  const { questionById, entryById } = useContent()
  const t = tally(result.answers)
  const acc = accuracy(t)
  const total = result.completedAt.getTime() - result.startedAt.getTime()

  const entriesFor = (outcome: Outcome) => {
    const ids = new Set(result.answers.filter(a => a.outcome === outcome).map(a => questionById.get(a.questionId)?.entry))
    return [...ids].flatMap(id => (id && entryById.get(id)) || [])
  }
  const gaps = entriesFor('skipped')
  const misses = entriesFor('incorrect')

  return (
    <section className="stack" aria-labelledby="results-heading">
      <header className="section">
        <h2 id="results-heading" tabIndex={-1}>Your results</h2>
        {status}
      </header>

      <dl className="tally">
        {(['correct', 'incorrect', 'skipped'] as const).map(o => (
          <div key={o} className={`tally__item tally__item--${o}`}>
            <dt><OutcomeLabel outcome={o} /></dt>
            <dd className="tally__value">{t[o]}</dd>
          </div>
        ))}
      </dl>

      <div className="section">
        <p>
          <strong>Accuracy {formatAccuracy(acc)}</strong>{' '}
          <span className="meta">
            {acc === null
              ? 'You skipped every question, so there is no accuracy yet. Everything went on your gaps list.'
              : `${t.correct} of the ${t.correct + t.incorrect} you answered. Skipped questions don't count against you.`}
          </span>
        </p>
        <p className="meta">Time taken {formatDuration(total)}</p>
      </div>

      {gaps.length > 0 && (
        <section className="section" aria-labelledby="gaps-heading">
          <h3 id="gaps-heading">Your gaps</h3>
          <p className="meta">You said you didn't know these. They're worth reading first.</p>
          <ul className="link-list">
            {gaps.map(e => <li key={e.id}><Link to={`/term/${e.id}`}>{e.term}</Link> <span className="meta">{e.summary}</span></li>)}
          </ul>
        </section>
      )}

      {misses.length > 0 && (
        <section className="section" aria-labelledby="misses-heading">
          <h3 id="misses-heading">Worth another look</h3>
          <p className="meta">You answered these, but not correctly.</p>
          <ul className="link-list">
            {misses.map(e => <li key={e.id}><Link to={`/term/${e.id}`}>{e.term}</Link> <span className="meta">{e.summary}</span></li>)}
          </ul>
        </section>
      )}

      <div className="btn-row">{actions}</div>
    </section>
  )
}
