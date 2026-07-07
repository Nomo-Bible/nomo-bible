import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthNav } from '@/components/auth/AuthNav';
import './mobile-v3.css';

interface MobileReaderHeaderProps {
  onOpenMenu: () => void;
}

export function MobileReaderHeader({ onOpenMenu }: MobileReaderHeaderProps) {
  return (
    <header className="mobile-v3-header">
      <button
        type="button"
        className="mobile-v3-header__menu-btn"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
      >
        <Menu size={22} strokeWidth={2} aria-hidden="true" />
      </button>
      <Link to="/" className="mobile-v3-header__brand">
        <span className="mobile-v3-header__mark" aria-hidden="true">
          N
        </span>
        <span className="mobile-v3-header__title">Nomomartyria</span>
      </Link>
      <div className="mobile-v3-header__account">
        <AuthNav />
      </div>
    </header>
  );
}
