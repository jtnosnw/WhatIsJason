import { Link, useParams } from 'react-router'
import { AdoptionBadge, DomainBadge, TrendBadge, TypeBadge } from '../components/Badges.tsx'
import { Icon } from '../components/Icon.tsx'
import { RichText } from '../components/RichText.tsx'
import { useContent } from '../lib/content.tsx'
import type { Entry } from '../lib/content-types.ts'
import { RELATION_GROUPS, formatDate, isStale } from '../lib/format.ts'
import { useDocumentTitle } from '../lib/hooks.ts'
import { usePrefs, type Depth } from '../lib/prefs.tsx'
import { NotFoundPage } from './NotFoundPage.tsx'

export function EntryPage() {
  const { id } = useParams()
  const { entryById } = useContent()
  const entry = id ? entryById.get(id) : undefined
  useDocumentTitle(entry?.term ?? 'Term not found')
  if (!entry) return <NotFoundPage what="term" />
  // key: reset per-entry state (e.g. failed thumbnails) when navigating between entries
  return <EntryView key={entry.id} entry={entry} />
}

function EntryView({ entry }: { entry: Entry }) {
  const { prefs, setPrefs } = usePrefs()
  const depth = prefs.depth

  return (
    <article className="entry stack">
      <header className="entry__header">
        <h1 className="entry__term">{entry.term}</h1>
        {entry.aliases.length > 0 && (
          <p className="entry__aliases">Also called {entry.aliases.join(', ')}</p>
        )}
        <div className="badge-row">
          <TypeBadge type={entry.type} />
          {entry.domains.map(d => <DomainBadge key={d} domain={d} />)}
          <AdoptionBadge adoption={entry.adoption} />
          <TrendBadge trend={entry.trend} />
        </div>
        <p className="lead">{entry.summary}</p>
        {entry.trendNote && <p className="meta">{entry.trendNote}</p>}
      </header>

      <section className="entry__explanation" aria-labelledby="explanation-heading">
        <div className="entry__explanation-head">
          <h2 id="explanation-heading" className="visually-hidden">Explanation</h2>
          <DepthToggle value={depth} onChange={d => setPrefs({ depth: d })} />
        </div>
        {/* Both depths are always present (CLAUDE.md rule 5); the toggle picks which one shows. */}
        <div id="explanation-body" aria-live="polite">
          <RichText html={depth === 'plain' ? entry.plain : entry.technical} />
        </div>
      </section>

      {entry.diagram && (
        <figure className="diagram">
          {/* Inlined so it inherits tokens and switches with the theme (DESIGN §5). */}
          <div className="diagram__svg" dangerouslySetInnerHTML={{ __html: entry.diagram }} />
        </figure>
      )}

      {entry.examples && (
        <section className="section" aria-labelledby="examples-heading">
          <h2 id="examples-heading">Examples</h2>
          <RichText html={entry.examples} />
        </section>
      )}

      {(entry.industries.length > 0 || entry.workflows.length > 0) && (
        <section className="section" aria-labelledby="where-heading">
          <h2 id="where-heading">Where it's used</h2>
          <dl className="facts">
            {entry.industries.length > 0 && <><dt>Industries</dt><dd>{entry.industries.join(', ')}</dd></>}
            {entry.workflows.length > 0 && <><dt>Workflows</dt><dd>{entry.workflows.join(', ')}</dd></>}
          </dl>
        </section>
      )}

      <RelatedTerms entry={entry} />

      {entry.videos.length > 0 && <Videos entry={entry} />}

      <footer className="entry__meta meta">
        <span>Last reviewed <time dateTime={entry.lastReviewed}>{formatDate(entry.lastReviewed)}</time></span>
        {isStale(entry.lastReviewed) && (
          <span className="stale-marker">
            <Icon name="clock" /> May be out of date: not reviewed in over six months
          </span>
        )}
      </footer>
    </article>
  )
}

function DepthToggle({ value, onChange }: { value: Depth; onChange: (d: Depth) => void }) {
  const options: { depth: Depth; label: string }[] = [
    { depth: 'plain', label: 'Plain' },
    { depth: 'technical', label: 'Technical' },
  ]
  return (
    <div className="segmented" role="group" aria-label="Explanation depth">
      {options.map(o => (
        <button
          key={o.depth}
          type="button"
          className="segmented__option"
          aria-pressed={value === o.depth}
          aria-controls="explanation-body"
          onClick={() => onChange(o.depth)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function RelatedTerms({ entry }: { entry: Entry }) {
  const { entryById } = useContent()
  const groups = RELATION_GROUPS
    .map(g => ({ ...g, items: entry.relations.filter(r => r.kind === g.kind) }))
    .filter(g => g.items.length)

  if (!groups.length) return null

  return (
    <section className="related" aria-labelledby="related-heading">
      <h2 id="related-heading">How it connects</h2>
      <div className="related__groups">
        {groups.map(g => (
          <section key={g.kind} className="related__group" aria-label={g.label}>
            <h3 className="related__label">{g.label}</h3>
            <ul className="related__list">
              {g.items.map(r => {
                const target = entryById.get(r.target)
                if (!target) return null
                return (
                  <li key={`${r.kind}-${r.target}`} className="related__item">
                    <Link to={`/term/${target.id}`} className="related__link">
                      <Icon name={target.type} />
                      {target.term}
                    </Link>
                    {r.note && <p className="related__note">{r.note}</p>}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

function Videos({ entry }: { entry: Entry }) {
  return (
    <section className="section" aria-labelledby="videos-heading">
      <h2 id="videos-heading">Watch</h2>
      <ul className="video-grid">
        {entry.videos.map(v => (
          <li key={v.id}>
            {/* SPEC §4.7: thumbnail only, opens YouTube in a new tab. The title and
                channel are text, so a dead thumbnail still leaves a readable link. */}
            <a className="video" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
              <img
                className="video__thumb"
                src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={e => { e.currentTarget.hidden = true }}
              />
              <span className="video__title">{v.title}<Icon name="external" /></span>
              <span className="video__channel meta">{v.channel}<span className="visually-hidden"> (opens YouTube in a new tab)</span></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
