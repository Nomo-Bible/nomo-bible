import { Home, BookOpen } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BibleSearch } from './BibleSearch';
import './GlobalLayout.css';

export function GlobalLayout() {
  return (
    <div className="global-layout">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            <span className="site-header__mark" aria-hidden="true">
              N
            </span>
            <span className="site-header__brand-text">
              <span className="site-header__title">Nomomartyria</span>
              <span className="site-header__subtitle">Bible Platform</span>
            </span>
          </Link>

          <nav className="site-header__nav" aria-label="Main navigation">
            <NavLink to="/" end className="site-header__link">
              <Home className="site-header__link-icon" aria-hidden="true" size={16} strokeWidth={2} />
              Home
            </NavLink>
            <NavLink to="/reader" className="site-header__link">
              <BookOpen className="site-header__link-icon" aria-hidden="true" size={16} strokeWidth={2} />
              Scripture
            </NavLink>
          </nav>

          <BibleSearch />
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Nomomartyria Bible Platform · Version 0.1</p>
      </footer>
    </div>
  );
}
