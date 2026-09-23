import type { Outcome } from './quiz.ts'

// Spaced-repetition rules (SPEC §4.6, SCHEMA §3.3). Incorrect and skipped
// answers enter the queue; skipped comes back sooner because it's a gap, not
// a slip. Two consecutive correct answers take a question out of the queue.

export const REVIEW_INTERVAL_DAYS: Record<Outcome, number> = {
  skipped: 1,    // short: a gap, resurface soon
  incorrect: 3,  // medium: known but confused
  correct: 7,    // long: on its way out of the queue
}
export const GRADUATE_AFTER_STREAK = 2

/** SCHEMA §5 users/{uid}/review/{questionId} */
export interface ReviewItem {
  outcome: Outcome
  dueAt: Date
  streak: number
  lastSeenAt: Date
}

export type ReviewUpdate =
  | { action: 'set'; item: ReviewItem }
  | { action: 'delete' }
  | { action: 'none' }

const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86_400_000)

export function nextReview(prev: ReviewItem | undefined, outcome: Outcome, now: Date): ReviewUpdate {
  if (outcome === 'correct') {
    // A correct answer to a question that isn't queued has nothing to review.
    if (!prev) return { action: 'none' }
    const streak = prev.streak + 1
    if (streak >= GRADUATE_AFTER_STREAK) return { action: 'delete' }
    return { action: 'set', item: { outcome, streak, dueAt: addDays(now, REVIEW_INTERVAL_DAYS.correct), lastSeenAt: now } }
  }
  return { action: 'set', item: { outcome, streak: 0, dueAt: addDays(now, REVIEW_INTERVAL_DAYS[outcome]), lastSeenAt: now } }
}

/** Gaps first (skipped), then incorrect, then correct-but-not-graduated; oldest due first. */
export function reviewOrder(a: ReviewItem, b: ReviewItem) {
  const rank: Record<Outcome, number> = { skipped: 0, incorrect: 1, correct: 2 }
  return rank[a.outcome] - rank[b.outcome] || a.dueAt.getTime() - b.dueAt.getTime()
}
