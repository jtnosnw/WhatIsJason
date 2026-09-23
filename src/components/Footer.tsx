import { useId } from 'react'
import { useContentState } from '../lib/content.tsx'
import { formatDateTime } from '../lib/format.ts'
import { usePrefs, type Theme } from '../lib/prefs.tsx'

export function Footer() {
  const state = useContentState()
  const { prefs, setPrefs } = usePrefs()
  const themeId = useId()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {state.status === 'ready' && (
          <p>
            Database last updated{' '}
            <time dateTime={state.content.glossary.buildTime}>{formatDateTime(state.content.glossary.buildTime)}</time>
            {' · '}{state.content.glossary.entryCount} terms
          </p>
        )}
        <div className="field field--inline">
          <label htmlFor={themeId}>Theme</label>
          <select id={themeId} className="select" value={prefs.theme} onChange={e => setPrefs({ theme: e.target.value as Theme })}>
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </footer>
  )
}
