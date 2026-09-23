import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/quiz.css'
import App from './App.tsx'
import { ContentProvider } from './lib/content.tsx'
import { PrefsProvider } from './lib/prefs.tsx'
import { UserProvider } from './lib/user.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Basename comes from vite.config.ts `base` via BASE_URL — the single source of truth. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PrefsProvider>
        <ContentProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ContentProvider>
      </PrefsProvider>
    </BrowserRouter>
  </StrictMode>,
)
