import { Home, BookOpen, Library, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AuthNav } from '@/components/auth/AuthNav';
import { BibleSearch } from './BibleSearch';
import './GlobalLayout.css';
export function GlobalLayout() {
  const isReaderRoute = useLocation().pathname.startsWith('/reader');

  return (
    <div className={`global-layout${isReaderRoute ? ' global-layout--reader' : ''}`}>
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
            <NavLink to="/repository" className="site-header__link">
              <Library className="site-header__link-icon" aria-hidden="true" size={16} strokeWidth={2} />
              Repository
            </NavLink>
            <NavLink to="/about" className="site-header__link">
              <Users className="site-header__link-icon" aria-hidden="true" size={16} strokeWidth={2} />
              About
            </NavLink>
          </nav>

          <div className="site-header__utilities">
            <AuthNav />
            <BibleSearch />
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      {!isReaderRoute && (
        <footer className="site-footer">
          <p>Nomomartyria Bible Platform · Version 2.0</p>
        </footer>
      )}
    </div>
  );
}
