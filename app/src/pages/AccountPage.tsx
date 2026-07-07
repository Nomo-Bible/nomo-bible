import { Link, Navigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import '@/components/auth/AuthGate.css';

export function AccountPage() {
  const { user, loading, isAuthenticated, signOut } = useAuth();

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  if (loading) {
    return (
      <div className="auth-page">
        <p className="auth-page__subtitle">Loading account…</p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Your account</h1>
      <p className="auth-page__subtitle">
        Study notes and cross references are saved locally in your browser for now.
        Cloud sync will be added in a future update.
      </p>

      <div className="auth-page__field">
        <span className="auth-page__label">
          <User size={14} strokeWidth={2} aria-hidden="true" /> Signed in as
        </span>
        <p className="auth-page__input" style={{ margin: 0 }}>
          {user?.email}
        </p>
      </div>

      <button type="button" className="auth-page__submit" onClick={() => void signOut()}>
        <LogOut size={16} strokeWidth={2} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
        Sign out
      </button>

      <p className="auth-page__footer">
        <Link to="/reader">Return to Bible reading</Link>
      </p>
    </div>
  );
}
