import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/hooks.ts'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  useDocumentTitle('Not found')
  return (
    <div className="stack">
      <h1>That {what} doesn't exist</h1>
      <p>It may have been renamed. Try searching for it, or <Link to="/">browse all terms</Link>.</p>
    </div>
  )
}
