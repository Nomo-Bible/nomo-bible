import { Link, NavLink, Outlet } from 'react-router-dom';
import { BibleSearch } from './BibleSearch';
import './GlobalLayout.css';

export function GlobalLayout() {
  return (
    <div className="global-layout">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            <span className="site-header__title">Nomomartyria</span>
            <span className="site-header__subtitle">Bible Platform</span>
          </Link>

          <nav className="site-header__nav" aria-label="Main navigation">
            <NavLink to="/" end className="site-header__link">
              Home
            </NavLink>
            <NavLink to="/reader" className="site-header__link">
              Scripture Workspace
            </NavLink>
          </nav>

          <BibleSearch />
        </div>

        <p className="site-header__motto">
          Per Legem et Testimonium, Christus Revelatur
        </p>
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
