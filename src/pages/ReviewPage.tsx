import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ProgressGate } from '../components/Account.tsx'
import { Breadcrumb } from '../components/Breadcrumb.tsx'
import { OutcomeLabel } from '../components/Outcome.tsx'
import { QuizResults } from '../components/QuizResults.tsx'
import { QuizSession, type SessionResult } from '../components/QuizSession.tsx'
import { SaveStatus } from '../components/SaveStatus.tsx'
import { useContent } from '../lib/content.tsx'
import { formatDateTime } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'
import { prepare, type PreparedQuestion } from '../lib/quiz.ts'
import { REVIEW_INTERVAL_DAYS, reviewOrder, type ReviewItem } from '../lib/review.ts'
import { useProgress, useUser, type UserCache } from '../lib/user.tsx'

const MAX_PER_SESSION = 20

type Phase =
  | { name: 'overview' }
  | { name: 'playing'; questions: PreparedQuestion[] }
  | { name: 'done'; result: SessionResult }

export function ReviewPage() {
  const progress = useProgress()
  useDocumentTitle('Review your gaps')

  return (
    <div className="stack quiz-page">
      <Breadcrumb items={[{ label: 'Quiz', to: '/quiz' }, { label: 'Review your gaps' }]} />
      <header className="page-intro">
        <h1>Review your gaps</h1>
        <p className="lead">
          Questions you skipped come back after {REVIEW_INTERVAL_DAYS.skipped} day, and ones you got wrong
          after {REVIEW_INTERVAL_DAYS.incorrect}. Get one right twice in a row and it leaves the queue.
        </p>
      </header>
      {progress ? <Review data={progress} /> : <ProgressGate what="build a review queue from your quiz answers" />}
    </div>
  )
}

function Review({ data }: { data: UserCache }) {
  const { questionById, entryById } = useContent()
  const { saveReview } = useUser()
  const [phase, setPhase] = useState<Phase>({ name: 'overview' })
  // Captured once per visit so the due list doesn't shift while you look at it.
  const [now] = useState(() => new Date())

  const { due, upcoming } = useMemo(() => {
    const items = [...data.review.entries()]
      .filter(([id]) => questionById.has(id)) // ignore questions no longer in the content
      .map(([id, item]) => ({ id, item }))
    return {
      due: items.filter(x => x.item.dueAt <= now).sort((a, b) => reviewOrder(a.item, b.item)),
      upcoming: items.filter(x => x.item.dueAt > now).sort((a, b) => a.item.dueAt.getTime() - b.item.dueAt.getTime()),
    }
  }, [data.review, questionById, now])

  const done = phase.name === 'done' ? phase : null
  const save = useCallback(() => (done ? saveReview(done.result.answers) : Promise.resolve()), [done, saveReview])

  if (phase.name === 'playing') {
    return <QuizSession questions={phase.questions} onDone={result => setPhase({ name: 'done', result })} />
  }
  if (phase.name === 'done') {
    return (
      <QuizResults
        result={phase.result}
        status={<SaveStatus save={save} what="update your review queue" />}
        actions={<Link className="btn" to="/quiz">Back to quizzes</Link>}
      />
    )
  }

  const gaps = due.filter(d => d.item.outcome === 'skipped').length
  const listItem = ({ id, item }: { id: string; item: ReviewItem }, when?: string) => {
    const q = questionById.get(id)!
    const entry = entryById.get(q.entry)
    return (
      <li key={id} className="review-item">
        <OutcomeLabel outcome={item.outcome}>{item.outcome === 'skipped' ? 'Gap' : item.outcome === 'incorrect' ? 'Missed' : 'Right once'}</OutcomeLabel>
        <span>{entry ? <Link to={`/term/${entry.id}`}>{entry.term}</Link> : q.prompt}</span>
        {when && <span className="meta">{when}</span>}
      </li>
    )
  }

  if (!data.review.size) {
    return <p className="notice">Your queue is empty. Questions you skip or get wrong in a <Link to="/quiz">quiz</Link> will show up here.</p>
  }

  return (
    <div className="stack">
      <section className="section" aria-labelledby="due-heading">
        <h2 id="due-heading">Due now: {due.length}</h2>
        {due.length > 0 ? (
          <>
            <p className="meta">{gaps} of these are gaps you said you didn't know. They come first.</p>
            <div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setPhase({ name: 'playing', questions: due.slice(0, MAX_PER_SESSION).map(d => prepare(questionById.get(d.id)!)) })}
              >
                Start review{due.length > MAX_PER_SESSION ? ` (first ${MAX_PER_SESSION})` : ''}
              </button>
            </div>
            <ul className="review-list">{due.map(d => listItem(d))}</ul>
          </>
        ) : (
          <p>Nothing is due yet. Come back later, or take another <Link to="/quiz">quiz</Link>.</p>
        )}
      </section>

      {upcoming.length > 0 && (
        <section className="section" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading">Coming up</h2>
          <ul className="review-list">{upcoming.map(u => listItem(u, `Due ${formatDateTime(u.item.dueAt)}`))}</ul>
        </section>
      )}
    </div>
  )
}
