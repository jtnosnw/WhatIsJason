import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// User preferences (SCHEMA §5 users/{uid}.prefs). Always kept in localStorage so
// they work signed out; the auth layer also syncs them to Firestore when allowed.

export type Depth = 'plain' | 'technical'
export type Theme = 'system' | 'light' | 'dark'
export interface Prefs { depth: Depth; theme: Theme }

const STORAGE_KEY = 'wij.prefs'
const DEFAULTS: Prefs = { depth: 'plain', theme: 'system' }

function load(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Prefs>
    return {
      depth: raw.depth === 'technical' ? 'technical' : 'plain',
      theme: raw.theme === 'light' || raw.theme === 'dark' ? raw.theme : 'system',
    }
  } catch {
    return DEFAULTS
  }
}

interface PrefsContextValue {
  prefs: Prefs
  setPrefs: (patch: Partial<Prefs>) => void
}

const PrefsContext = createContext<PrefsContextValue>({ prefs: DEFAULTS, setPrefs: () => {} })

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setState] = useState<Prefs>(load)

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setState(prev => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
      return next
    })
  }, [])

  // DESIGN.md §2.1: data-theme on <html> overrides the OS setting; absent = follow OS.
  useEffect(() => {
    const root = document.documentElement
    if (prefs.theme === 'system') delete root.dataset.theme
    else root.dataset.theme = prefs.theme
  }, [prefs.theme])

  const value = useMemo(() => ({ prefs, setPrefs }), [prefs, setPrefs])
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export const usePrefs = () => useContext(PrefsContext)
