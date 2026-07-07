import { Home, BookOpen, Library, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './mobile-v3.css';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  { to: '/', end: true, label: 'Home', Icon: Home },
  { to: '/reader', label: 'Scripture', Icon: BookOpen },
  { to: '/repository', label: 'Repository', Icon: Library },
  { to: '/about', label: 'About', Icon: Users },
] as const;

type NavLinkItem = (typeof LINKS)[number];

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  if (!open) return null;

  return (
    <div className="mobile-v3-drawer" role="presentation">
      <button
        type="button"
        className="mobile-v3-drawer__backdrop"
        onClick={onClose}
        aria-label="Close navigation menu"
      />
      <nav className="mobile-v3-drawer__panel" aria-label="Main navigation">
        <div className="mobile-v3-drawer__head">
          <span className="mobile-v3-drawer__title">Navigate</span>
          <button
            type="button"
            className="mobile-v3-drawer__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <ul className="mobile-v3-drawer__list">
          {LINKS.map((link: NavLinkItem) => {
            const Icon = link.Icon;
            return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={'end' in link ? link.end : false}
                className={({ isActive }) =>
                  isActive
                    ? 'mobile-v3-drawer__link mobile-v3-drawer__link--active'
                    : 'mobile-v3-drawer__link'
                }
                onClick={onClose}
              >
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                {link.label}
              </NavLink>
            </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
