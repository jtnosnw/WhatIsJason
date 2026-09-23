import { OUTCOME_LABEL, type Outcome } from '../lib/quiz.ts'
import { Icon } from './Icon.tsx'

// Every outcome carries an icon shape and a word, not just a colour.
export function OutcomeLabel({ outcome, children }: { outcome: Outcome; children?: React.ReactNode }) {
  return (
    <span className={`outcome outcome--${outcome}`}>
      <Icon name={outcome} />
      {children ?? OUTCOME_LABEL[outcome]}
    </span>
  )
}
