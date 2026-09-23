import type { QuizOption, QuizQuestion } from './content-types.ts'

// Three outcomes, never two (CLAUDE.md rule 6, SCHEMA §3.3).
export type Outcome = 'correct' | 'incorrect' | 'skipped'

export const OUTCOME_LABEL: Record<Outcome, string> = {
  correct: 'Correct',
  incorrect: 'Incorrect',
  skipped: 'Skipped',
}

/** SCHEMA §5 users/{uid}/attempts answers[] item */
export interface AnswerRecord {
  questionId: string
  outcome: Outcome
  timeMs: number
}

export interface Tally {
  correct: number
  incorrect: number
  skipped: number
}

export function tally(answers: { outcome: Outcome }[]): Tally {
  const t: Tally = { correct: 0, incorrect: 0, skipped: 0 }
  for (const a of answers) t[a.outcome]++
  return t
}

/** correct / (correct + incorrect). Skipped counts toward neither; null when nothing was attempted. */
export function accuracy(t: Tally): number | null {
  const attempted = t.correct + t.incorrect
  return attempted === 0 ? null : t.correct / attempted
}

export const formatAccuracy = (a: number | null) => (a === null ? '—' : `${Math.round(a * 100)}%`)

export const QUESTIONS_PER_QUIZ = 10

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface PreparedQuestion extends QuizQuestion {
  /** Options in display order for this session */
  shuffled: QuizOption[]
}

export const prepare = (q: QuizQuestion): PreparedQuestion => ({ ...q, shuffled: shuffle(q.options) })

/** category is "all" or a domain id (SCHEMA §5 attempts.category). */
export function pickQuestions(pool: QuizQuestion[], category: string, count = QUESTIONS_PER_QUIZ) {
  const eligible = category === 'all' ? pool : pool.filter(q => q.category === category)
  return shuffle(eligible).slice(0, count).map(prepare)
}
