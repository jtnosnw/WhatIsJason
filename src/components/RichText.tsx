import { useMemo, type MouseEvent } from 'react'
import { useNavigate } from 'react-router'

// Renders build-time HTML from repo content (trusted: it's authored in content/).
// Wiki-links arrive as href="/term/<id>"; they get the router base prefixed here,
// so the base path has one source of truth (vite.config.ts → BASE_URL), and
// plain clicks navigate client-side instead of reloading.

const BASE = import.meta.env.BASE_URL

export function RichText({ html, className }: { html: string; className?: string }) {
  const navigate = useNavigate()
  const resolved = useMemo(() => html.replace(/href="\/term\//g, `href="${BASE}term/`), [html])

  function onClick(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.wikilink')
    if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(`/term/${link.dataset.entry}`)
  }

  // Delegated handler: the links themselves stay keyboard-native.
  return <div className={className ? `prose ${className}` : 'prose'} onClick={onClick} dangerouslySetInnerHTML={{ __html: resolved }} />
}
