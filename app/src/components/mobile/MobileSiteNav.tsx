import { Home, BookOpen, Library, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './mobile-v3.css';

const LINKS = [
  { to: '/', end: true, label: 'Home', Icon: Home },
  { to: '/reader', label: 'Scripture', Icon: BookOpen },
  { to: '/repository', label: 'Repository', Icon: Library },
  { to: '/about', label: 'About', Icon: Users },
] as const;

type NavLinkItem = (typeof LINKS)[number];

export function MobileSiteNav() {
  return (
    <nav className="mobile-v3-site-nav" aria-label="Site sections">
      {LINKS.map((link: NavLinkItem) => {
        const Icon = link.Icon;
        return (
        <NavLink
          key={link.to}
          to={link.to}
          end={'end' in link ? link.end : false}
          className={({ isActive }) =>
            isActive
              ? 'mobile-v3-site-nav__link mobile-v3-site-nav__link--active'
              : 'mobile-v3-site-nav__link'
          }
        >
          <Icon size={16} strokeWidth={2} aria-hidden="true" />
          <span>{link.label}</span>
        </NavLink>
        );
      })}
    </nav>
  );
}
