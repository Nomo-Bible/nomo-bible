import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import './AuthGate.css';

export function AuthNav() {
  const { user, loading, isAuthenticated, signOut } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-nav">
        <Link to="/login" className="auth-nav__link">
          Sign in
        </Link>
        <Link to="/signup" className="auth-nav__link auth-nav__link--primary">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-nav">
      <span className="auth-nav__user" title={user?.email ?? undefined}>
        {user?.email}
      </span>
      <Link to="/account" className="auth-nav__link" aria-label="Account">
        <User size={15} strokeWidth={2} aria-hidden="true" />
        Account
      </Link>
      <button
        type="button"
        className="auth-nav__link auth-nav__btn"
        onClick={() => void signOut()}
      >
        <LogOut size={15} strokeWidth={2} aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}
