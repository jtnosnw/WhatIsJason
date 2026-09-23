import { Link } from 'react-router'
import type { Entry } from '../lib/content-types.ts'
import { AdoptionBadge, DomainBadge, TypeBadge } from './Badges.tsx'

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="card card--link">
      <h3 className="card__title">
        <Link className="card__stretched" to={`/term/${entry.id}`}>{entry.term}</Link>
      </h3>
      <p className="card__summary">{entry.summary}</p>
      <div className="badge-row">
        <TypeBadge type={entry.type} />
        {entry.domains.map(d => <DomainBadge key={d} domain={d} link={false} />)}
        <AdoptionBadge adoption={entry.adoption} />
      </div>
    </article>
  )
}
