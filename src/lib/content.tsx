import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Entry, Glossary, LearningPath, Paths, Quiz, QuizQuestion } from './content-types.ts'

// Loads the generated JSON from public/data/ (CLAUDE.md "Generated data").
// Content never comes from Firestore.

export interface Content {
  glossary: Glossary
  entries: Entry[]
  entryById: Map<string, Entry>
  questions: QuizQuestion[]
  questionById: Map<string, QuizQuestion>
  paths: LearningPath[]
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; content: Content }

const ContentContext = createContext<State>({ status: 'loading' })

async function fetchJson<T>(name: string): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${name}.json`)
  if (!res.ok) throw new Error(`Couldn't load ${name}.json (HTTP ${res.status})`)
  return res.json() as Promise<T>
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchJson<Glossary>('glossary'), fetchJson<Quiz>('quiz'), fetchJson<Paths>('paths')])
      .then(([glossary, quiz, paths]) => {
        if (cancelled) return
        setState({
          status: 'ready',
          content: {
            glossary,
            entries: glossary.entries,
            entryById: new Map(glossary.entries.map(e => [e.id, e])),
            questions: quiz.questions,
            questionById: new Map(quiz.questions.map(q => [q.id, q])),
            paths: paths.paths,
          },
        })
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: 'error', message: err.message })
      })
    return () => { cancelled = true }
  }, [])

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}

export function useContentState(): State {
  return useContext(ContentContext)
}

/** For components rendered inside <ContentGate>, where content is guaranteed loaded. */
export function useContent(): Content {
  const state = useContext(ContentContext)
  if (state.status !== 'ready') throw new Error('useContent() used outside a loaded <ContentGate>')
  return state.content
}
