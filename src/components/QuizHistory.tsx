import { useContent } from '../lib/content.tsx'
import { domainLabel, formatDateTime, formatDuration } from '../lib/format.ts'
import { accuracy, formatAccuracy } from '../lib/quiz.ts'
import type { Attempt } from '../lib/userData.ts'
import { Icon } from './Icon.tsx'
import { Sparkline } from './Sparkline.tsx'

// SPEC §4.6: last 5 attempts per category, comparable, with score trend and time.

export function QuizHistory({ attempts }: { attempts: Attempt[] }) {
  const { glossary } = useContent()
  if (!attempts.length) return <p className="meta">No saved attempts yet. Finish a quiz and it will show up here.</p>

  const categories = ['all', ...glossary.taxonomy.domains].filter(c => attempts.some(a => a.category === c))

  return (
    <div className="stack">
      {categories.map(cat => {
        const rows = attempts
          .filter(a => a.category === cat)
          .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        // Sparkline values: oldest → newest so the trend reads left-to-right
        const sparkValues = rows.slice().reverse().map(a => accuracy(a) ?? 0)
        const latest = accuracy(rows[0])
        return (
          <section key={cat} className="section" aria-labelledby={`history-${cat}`}>
            <div className="history-section__head">
              <h3 id={`history-${cat}`}>{cat === 'all' ? 'Mixed' : domainLabel(cat)}</h3>
              <div className="history-section__stats">
                <Sparkline values={sparkValues} />
                <span className="meta" aria-label={`Latest accuracy: ${formatAccuracy(latest)}`}>
                  {formatAccuracy(latest)}
                </span>
              </div>
            </div>
            <div className="table-scroll">
              <table className="history-table">
                <thead>
                  <tr>
                    <th scope="col">Finished</th>
                    <th scope="col">Correct</th>
                    <th scope="col">Incorrect</th>
                    <th scope="col">Skipped</th>
                    <th scope="col">Accuracy</th>
                    <th scope="col">Change</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a, i) => {
                    const acc = accuracy(a)
                    const prev = rows[i + 1] ? accuracy(rows[i + 1]) : null
                    return (
                      <tr key={a.id}>
                        <td>{formatDateTime(a.completedAt)}</td>
                        <td>{a.correct}</td>
                        <td>{a.incorrect}</td>
                        <td>{a.skipped}</td>
                        <td>{formatAccuracy(acc)}</td>
                        <td><Change now={acc} before={prev} /></td>
                        <td>{formatDuration(a.completedAt.getTime() - a.startedAt.getTime())}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function Change({ now, before }: { now: number | null; before: number | null }) {
  if (now === null || before === null) return <span className="meta">—</span>
  const points = Math.round((now - before) * 100)
  if (points === 0) return <span className="trend"><Icon name="steady" />Same</span>
  return (
    <span className="trend">
      <Icon name={points > 0 ? 'rising' : 'cooling'} />
      {points > 0 ? `Up ${points}` : `Down ${-points}`} pts
    </span>
  )
}
