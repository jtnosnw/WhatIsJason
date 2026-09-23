import { useId, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { DomainDot } from '../components/Badges.tsx'
import { EntryCard } from '../components/EntryCard.tsx'
import { useContent } from '../lib/content.tsx'
import type { Adoption, Entry, EntryType } from '../lib/content-types.ts'
import { ADOPTION_LABEL, TYPE_LABEL, domainLabel } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'

// Filters live in the URL so a filtered view is shareable, and so domain
// badges elsewhere can link here (/?domain=inference).

export function BrowsePage({ children }: { children?: ReactNode }) {
  const { entries, glossary } = useContent()
  const [params, setParams] = useSearchParams()
  const typeId = useId()
  const adoptionId = useId()
  useDocumentTitle(undefined)

  const domains = glossary.taxonomy.domains
  const domain = params.get('domain') ?? ''
  const type = params.get('type') ?? ''
  const adoption = params.get('adoption') ?? ''

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => entries.filter(e =>
    (!type || e.type === type) &&
    (!adoption || e.adoption === adoption) &&
    (!domain || e.domains.includes(domain))), [entries, type, adoption, domain])

  // Unfiltered by domain: group by primary domain, in the fixed ring order (DESIGN §2.3).
  const groups: { domain: string; entries: Entry[] }[] = domain
    ? [{ domain, entries: filtered }]
    : domains.map(d => ({ domain: d, entries: filtered.filter(e => e.domains[0] === d) })).filter(g => g.entries.length)

  const hasFilters = Boolean(domain || type || adoption)

  return (
    <div className="stack">
      <header className="page-intro">
        <h1>AI terms, explained at your level</h1>
        <p className="lead">
          {glossary.entryCount} terms, each with a plain-English and a technical explanation, and the
          connections between them. Press <kbd>/</kbd> to search.
        </p>
      </header>

      {children}

      <section className="filters" aria-label="Filter terms">
        <div className="chip-row" role="group" aria-label="Domain">
          {domains.map(d => (
            <button
              key={d}
              type="button"
              className="chip"
              aria-pressed={domain === d}
              onClick={() => setFilter('domain', domain === d ? '' : d)}
            >
              <DomainDot domain={d} />{domainLabel(d)}
            </button>
          ))}
        </div>
        <div className="filters__row">
          <div className="field field--inline">
            <label htmlFor={typeId}>Type</label>
            <select id={typeId} className="select" value={type} onChange={e => setFilter('type', e.target.value)}>
              <option value="">Any type</option>
              {(Object.keys(TYPE_LABEL) as EntryType[]).map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select>
          </div>
          <div className="field field--inline">
            <label htmlFor={adoptionId}>Adoption</label>
            <select id={adoptionId} className="select" value={adoption} onChange={e => setFilter('adoption', e.target.value)}>
              <option value="">Any adoption</option>
              {(Object.keys(ADOPTION_LABEL) as Adoption[]).map(a => <option key={a} value={a}>{ADOPTION_LABEL[a]}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button type="button" className="btn btn--ghost" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Clear filters
            </button>
          )}
        </div>
        <p className="meta" role="status">
          {filtered.length === entries.length ? `Showing all ${entries.length} terms` : `Showing ${filtered.length} of ${entries.length} terms`}
        </p>
      </section>

      {filtered.length === 0 && <p className="notice">No terms match these filters.</p>}

      {groups.map(g => (
        <section key={g.domain} className="domain-group" aria-labelledby={`group-${g.domain}`}>
          <h2 id={`group-${g.domain}`} className="domain-group__title">
            <DomainDot domain={g.domain} />
            {domainLabel(g.domain)}
            <span className="domain-group__count">{g.entries.length}</span>
          </h2>
          <div className="card-grid">
            {g.entries.map(e => <EntryCard key={e.id} entry={e} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
