import Fuse from 'fuse.js'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { useContent } from '../lib/content.tsx'
import type { Entry } from '../lib/content-types.ts'
import { TYPE_LABEL } from '../lib/format.ts'
import { Icon } from './Icon.tsx'

// SPEC §4.2: instant, client-side, fuzzy. Weighted term > aliases > text.
// Keyboard: "/" focuses, arrows move, Enter opens, Escape closes.

const MAX_RESULTS = 8

export function Search() {
  const { entries } = useContent()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const fuse = useMemo(() => new Fuse(entries, {
    keys: [
      { name: 'term', weight: 4 },
      { name: 'aliases', weight: 3 },
      { name: 'summary', weight: 1.5 },
      { name: 'text', weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), [entries])

  const results: Entry[] = useMemo(
    () => (query.trim().length < 1 ? [] : fuse.search(query.trim(), { limit: MAX_RESULTS }).map(r => r.item)),
    [fuse, query],
  )

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const target = e.target as HTMLElement
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function go(entry: Entry | undefined) {
    if (!entry) return
    navigate(`/term/${entry.id}`)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]) }
    else if (e.key === 'Escape') { setOpen(false); if (!open) setQuery('') }
  }

  const showList = open && query.trim().length > 0
  const optionId = (i: number) => `${listId}-opt-${i}`

  return (
    <div className="search" role="search">
      <label className="visually-hidden" htmlFor={`${listId}-input`}>Search the glossary</label>
      <div className="search__field">
        <Icon name="search" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          className="search__input"
          type="search"
          placeholder="Search terms…"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results.length ? optionId(active) : undefined}
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(0); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <kbd className="search__hint" aria-hidden="true">/</kbd>
      </div>
      {showList && (
        <ul className="search__results" id={listId} role="listbox" aria-label="Matching terms">
          {results.length === 0 && <li className="search__empty">No matching terms</li>}
          {results.map((entry, i) => (
            <li
              key={entry.id}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              className="search__option"
              // mousedown, not click: fires before the input's blur closes the list
              onMouseDown={e => { e.preventDefault(); go(entry) }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="search__term">
                <Icon name={entry.type} />
                {entry.term}
                <span className="visually-hidden">, {TYPE_LABEL[entry.type]}</span>
              </span>
              <span className="search__summary">{entry.summary}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
