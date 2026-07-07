import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import './AuthGate.css';

export function LoginPage() {
  const { signIn, isAuthenticated, loading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/reader';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Sign in</h1>
      <p className="auth-page__subtitle">
        Access the study workspace — notes, Strong&apos;s, concordance, and more.
      </p>

      {!isConfigured && (
        <p className="auth-page__warn">
          Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> (or <code>VITE_SUPABASE_ANON_KEY</code>).
        </p>
      )}

      <form className="auth-page__form" onSubmit={handleSubmit}>
        {error && <p className="auth-page__error">{error}</p>}

        <div className="auth-page__field">
          <label htmlFor="login-email" className="auth-page__label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="auth-page__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={submitting}
          />
        </div>

        <div className="auth-page__field">
          <label htmlFor="login-password" className="auth-page__label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="auth-page__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={submitting}
          />
        </div>

        <button type="submit" className="auth-page__submit" disabled={submitting || !isConfigured}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-page__footer">
        No account yet? <Link to="/signup">Create a free account</Link>
      </p>
    </div>
  );
}
