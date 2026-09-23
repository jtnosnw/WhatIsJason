import { Link } from 'react-router'
import type { Adoption, EntryType, Trend } from '../lib/content-types.ts'
import { ADOPTION_LABEL, TREND_LABEL, TYPE_LABEL, domainLabel } from '../lib/format.ts'
import { Icon } from './Icon.tsx'

// Domain is the only colour channel (CLAUDE.md). Every other badge is neutral.

export function DomainDot({ domain }: { domain: string }) {
  return <span className="domain-dot" style={{ '--dot-color': `var(--domain-${domain})` } as React.CSSProperties} aria-hidden="true" />
}

export function DomainBadge({ domain, link = true }: { domain: string; link?: boolean }) {
  const content = <><DomainDot domain={domain} />{domainLabel(domain)}</>
  return link
    ? <Link className="badge badge--domain" to={`/?domain=${domain}`}>{content}</Link>
    : <span className="badge badge--domain">{content}</span>
}

export function TypeBadge({ type }: { type: EntryType }) {
  return <span className="badge"><Icon name={type} />{TYPE_LABEL[type]}</span>
}

export function AdoptionBadge({ adoption }: { adoption: Adoption }) {
  return <span className="badge"><span className="visually-hidden">Adoption: </span>{ADOPTION_LABEL[adoption]}</span>
}

export function TrendBadge({ trend }: { trend: Trend }) {
  return <span className="badge"><Icon name={trend} /><span className="visually-hidden">Trend: </span>{TREND_LABEL[trend]}</span>
}
