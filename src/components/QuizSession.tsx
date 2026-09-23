import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useContent } from '../lib/content.tsx'
import type { AnswerRecord, Outcome, PreparedQuestion } from '../lib/quiz.ts'
import { DomainBadge } from './Badges.tsx'
import { Icon } from './Icon.tsx'
import { OutcomeLabel } from './Outcome.tsx'

export interface SessionResult {
  startedAt: Date
  completedAt: Date
  answers: AnswerRecord[]
}

interface Answered {
  outcome: Outcome
  /** Index into shuffled options; null when skipped */
  chosen: number | null
}

export function QuizSession({ questions, onDone }: { questions: PreparedQuestion[]; onDone: (r: SessionResult) => void }) {
  const { entryById } = useContent()
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Answered | null>(null)
  const [clueOpen, setClueOpen] = useState(false)
  const answers = useRef<AnswerRecord[]>([])
  const startedAt = useRef<Date | null>(null)
  const shownAt = useRef(0)
  const feedbackRef = useRef<HTMLHeadingElement>(null)
  const promptRef = useRef<HTMLHeadingElement>(null)

  const q = questions[index]
  const clueEntry = entryById.get(q.entry)
  const isLast = index === questions.length - 1

  // Time each question from when it's shown; the session from its first question.
  useEffect(() => {
    startedAt.current ??= new Date()
    shownAt.current = performance.now()
  }, [index])

  useEffect(() => {
    if (answered) feedbackRef.current?.focus()
  }, [answered])

  function answer(outcome: Outcome, chosen: number | null) {
    if (answered) return
    answers.current.push({ questionId: q.id, outcome, timeMs: Math.round(performance.now() - shownAt.current) })
    setAnswered({ outcome, chosen })
  }

  function next() {
    if (isLast) {
      onDone({ startedAt: startedAt.current ?? new Date(), completedAt: new Date(), answers: answers.current })
      return
    }
    setIndex(i => i + 1)
    setAnswered(null)
    setClueOpen(false)
    requestAnimationFrame(() => promptRef.current?.focus())
  }

  const correctIndex = q.shuffled.findIndex(o => o.correct)

  return (
    <section className="quiz-card" aria-labelledby="quiz-prompt">
      <div className="quiz-card__meta">
        <span className="meta">Question {index + 1} of {questions.length}</span>
        <DomainBadge domain={q.category} link={false} />
      </div>
      <progress className="quiz-progress" max={questions.length} value={index + (answered ? 1 : 0)} aria-label="Quiz progress" />

      <h2 id="quiz-prompt" ref={promptRef} tabIndex={-1} className="quiz-card__prompt">{q.prompt}</h2>

      <ul className="quiz-options">
        {q.shuffled.map((o, i) => {
          const state = !answered ? '' : i === correctIndex ? 'correct' : i === answered.chosen ? 'incorrect' : 'dim'
          return (
            <li key={o.text}>
              <button
                type="button"
                className={`quiz-option${state ? ` quiz-option--${state}` : ''}`}
                disabled={answered !== null}
                onClick={() => answer(o.correct ? 'correct' : 'incorrect', i)}
              >
                <span className="quiz-option__text">{o.text}</span>
                {state === 'correct' && <OutcomeLabel outcome="correct">{answered?.chosen === i ? 'Your answer' : 'Correct answer'}</OutcomeLabel>}
                {state === 'incorrect' && <OutcomeLabel outcome="incorrect">Your answer</OutcomeLabel>}
              </button>
            </li>
          )
        })}
      </ul>

      {!answered && (
        <div className="quiz-card__actions">
          {/* A first-class answer, not a wrong one (SPEC §4.6). */}
          <button type="button" className="btn" onClick={() => answer('skipped', null)}>
            <Icon name="skipped" />I don't know
          </button>
          {clueEntry && (
            <button type="button" className="btn btn--ghost" aria-expanded={clueOpen} aria-controls="quiz-clue" onClick={() => setClueOpen(o => !o)}>
              <Icon name="clue" />{clueOpen ? 'Hide clue' : 'Show clue'}
            </button>
          )}
        </div>
      )}

      {clueEntry && clueOpen && !answered && (
        <div id="quiz-clue" className="quiz-clue">
          <p><strong>{clueEntry.term}:</strong> {clueEntry.summary}</p>
          <Link to={`/term/${clueEntry.id}`} target="_blank" rel="noopener">
            Read the full entry<span className="visually-hidden"> (opens in a new tab)</span>
          </Link>
        </div>
      )}

      {answered && (
        <div className={`quiz-feedback quiz-feedback--${answered.outcome}`}>
          <h3 ref={feedbackRef} tabIndex={-1} className="quiz-feedback__title">
            <OutcomeLabel outcome={answered.outcome}>
              {answered.outcome === 'correct' && 'Correct'}
              {answered.outcome === 'incorrect' && 'Incorrect'}
              {answered.outcome === 'skipped' && 'Skipped: added to your gaps'}
            </OutcomeLabel>
          </h3>
          <p>{q.explanation}</p>
          {clueEntry && (
            <p><Link to={`/term/${clueEntry.id}`} target="_blank" rel="noopener">
              Read about {clueEntry.term}<span className="visually-hidden"> (opens in a new tab)</span>
            </Link></p>
          )}
          <div>
            <button type="button" className="btn btn--primary" onClick={next}>
              {isLast ? 'See results' : 'Next question'}<Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
