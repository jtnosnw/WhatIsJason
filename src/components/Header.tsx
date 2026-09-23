import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { useContentState } from '../lib/content.tsx'
import { useProgress } from '../lib/user.tsx'
import { Search } from './Search.tsx'

export function Header({ account }: { account?: ReactNode }) {
  const state = useContentState()
  const progress = useProgress()
  const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">WhatIsJason</Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className={navClass}>Browse</NavLink>
          <NavLink to="/quiz" className={navClass}>Quiz</NavLink>
          <NavLink to="/paths" className={navClass}>Paths</NavLink>
          {progress && <NavLink to="/review" className={navClass}>Review</NavLink>}
        </nav>
        {state.status === 'ready' && <Search />}
        {account && <div className="site-header__account">{account}</div>}
      </div>
    </header>
  )
}
