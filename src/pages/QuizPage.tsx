import { useCallback, useId, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ProgressGate } from '../components/Account.tsx'
import { DomainDot } from '../components/Badges.tsx'
import { QuizHistory } from '../components/QuizHistory.tsx'
import { SaveStatus } from '../components/SaveStatus.tsx'
import { useProgress, useUser } from '../lib/user.tsx'
import { QuizResults } from '../components/QuizResults.tsx'
import { QuizSession, type SessionResult } from '../components/QuizSession.tsx'
import { useContent } from '../lib/content.tsx'
import { domainLabel } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'
import { QUESTIONS_PER_QUIZ, pickQuestions, type PreparedQuestion } from '../lib/quiz.ts'

type Phase =
  | { name: 'setup' }
  | { name: 'playing'; category: string; questions: PreparedQuestion[] }
  | { name: 'done'; category: string; result: SessionResult }

export function QuizPage() {
  const { questions, glossary } = useContent()
  const [params] = useSearchParams()
  const [phase, setPhase] = useState<Phase>({ name: 'setup' })
  const { saveQuiz } = useUser()
  const progress = useProgress()
  const initial = params.get('category')
  const [category, setCategory] = useState(initial && glossary.taxonomy.domains.includes(initial) ? initial : 'all')
  const groupId = useId()
  useDocumentTitle('Quiz')

  const counts = useMemo(() => {
    const c = new Map<string, number>()
    for (const q of questions) c.set(q.category, (c.get(q.category) ?? 0) + 1)
    return c
  }, [questions])

  const start = (cat: string) => setPhase({ name: 'playing', category: cat, questions: pickQuestions(questions, cat) })

  const done = phase.name === 'done' ? phase : null
  const saveResult = useCallback(
    () => (done ? saveQuiz(done.category, done.result) : Promise.resolve()),
    [done, saveQuiz],
  )

  if (phase.name === 'playing') {
    return (
      <div className="stack quiz-page">
        <h1>{phase.category === 'all' ? 'Mixed quiz' : `${domainLabel(phase.category)} quiz`}</h1>
        <QuizSession
          key={phase.questions.map(q => q.id).join()}
          questions={phase.questions}
          onDone={result => setPhase({ name: 'done', category: phase.category, result })}
        />
      </div>
    )
  }

  if (phase.name === 'done') {
    return (
      <div className="stack quiz-page">
        <h1>{phase.category === 'all' ? 'Mixed quiz' : `${domainLabel(phase.category)} quiz`}</h1>
        <QuizResults
          result={phase.result}
          status={<SaveStatus save={saveResult} what="save this result and add your gaps to a review queue" />}
          actions={<>
            <button type="button" className="btn btn--primary" onClick={() => start(phase.category)}>Another round</button>
            <button type="button" className="btn" onClick={() => setPhase({ name: 'setup' })}>Choose a different quiz</button>
          </>}
        />
      </div>
    )
  }

  return (
    <div className="stack quiz-page">
      <header className="page-intro">
        <h1>Quiz</h1>
        <p className="lead">
          Up to {QUESTIONS_PER_QUIZ} questions. If you don't know an answer, say so: "I don't know" isn't
          marked wrong. It adds the term to your gaps, so you can come back to it.
        </p>
      </header>

      <form className="section" onSubmit={e => { e.preventDefault(); start(category) }}>
        <fieldset className="choice-list" aria-describedby={`${groupId}-hint`}>
          <legend className="choice-list__legend">What should it cover?</legend>
          <p id={`${groupId}-hint`} className="meta">Questions come from the terms and how they connect.</p>
          <label className="choice">
            <input type="radio" name="category" value="all" checked={category === 'all'} onChange={() => setCategory('all')} />
            <span className="choice__label">Mixed: every category</span>
            <span className="meta">{questions.length} questions</span>
          </label>
          {glossary.taxonomy.domains.map(d => (
            <label key={d} className="choice">
              <input type="radio" name="category" value={d} checked={category === d} onChange={() => setCategory(d)} disabled={!counts.get(d)} />
              <span className="choice__label"><DomainDot domain={d} />{domainLabel(d)}</span>
              <span className="meta">{counts.get(d) ?? 0} questions</span>
            </label>
          ))}
        </fieldset>
        <div>
          <button type="submit" className="btn btn--primary" disabled={!questions.length}>Start quiz</button>
        </div>
      </form>

      <section className="section" aria-labelledby="history-heading">
        <h2 id="history-heading">Your history</h2>
        {progress ? <QuizHistory attempts={progress.attempts} /> : <ProgressGate what="keep a history of your last five attempts in each category" />}
      </section>
    </div>
  )
}
