import { Link } from 'react-router'
import { useContent } from '../lib/content.tsx'
import { useProgress } from '../lib/user.tsx'
import { Icon } from './Icon.tsx'

// SPEC §4.6: a "Review your gaps" entry point on the dashboard (browse page).
export function ReviewCallout() {
  const progress = useProgress()
  const { questionById } = useContent()
  if (!progress) return null

  const now = new Date()
  const due = [...progress.review.entries()].filter(([id, r]) => questionById.has(id) && r.dueAt <= now)
  if (!due.length) return null
  const gaps = due.filter(([, r]) => r.outcome === 'skipped').length

  return (
    <aside className="callout" aria-label="Review">
      <p>
        <strong>{due.length} {due.length === 1 ? 'question is' : 'questions are'} ready to review</strong>
        {gaps > 0 && <>, including {gaps} {gaps === 1 ? 'gap' : 'gaps'}</>}.
      </p>
      <Link className="btn btn--primary" to="/review">Review your gaps<Icon name="arrow" /></Link>
    </aside>
  )
}
