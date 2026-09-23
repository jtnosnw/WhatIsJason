import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { AccountControl } from './components/Account.tsx'
import { ContentGate } from './components/ContentGate.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { ReviewCallout } from './components/ReviewCallout.tsx'
import { BrowsePage } from './pages/BrowsePage.tsx'
import { EntryPage } from './pages/EntryPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { PathPage } from './pages/PathPage.tsx'
import { PathsPage } from './pages/PathsPage.tsx'
import { QuizPage } from './pages/QuizPage.tsx'
import { ReviewPage } from './pages/ReviewPage.tsx'

export default function App() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  // On navigation: start at the top, and move focus to the new page for screen readers.
  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header account={<AccountControl />} />
      <main id="main" ref={mainRef} tabIndex={-1} className="page">
        {/* The glossary never waits on sign-in: only progress features read the user. */}
        <ContentGate>
          <Routes>
            <Route path="/" element={<BrowsePage><ReviewCallout /></BrowsePage>} />
            <Route path="/term/:id" element={<EntryPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/paths" element={<PathsPage />} />
            <Route path="/path/:id" element={<PathPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ContentGate>
      </main>
      <Footer />
    </>
  )
}
