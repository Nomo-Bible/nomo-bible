import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import './AuthGate.css';

export function SignupPage() {
  const { signUp, isAuthenticated, loading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/reader" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(
      'Account created. Check your email to confirm your address, then sign in.',
    );
  };

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Create account</h1>
      <p className="auth-page__subtitle">
        Free access to the Nomomartyria study workspace. Bible reading stays open to everyone.
      </p>

      {!isConfigured && (
        <p className="auth-page__warn">
          Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> (or <code>VITE_SUPABASE_ANON_KEY</code>).
        </p>
      )}

      <form className="auth-page__form" onSubmit={handleSubmit}>
        {error && <p className="auth-page__error">{error}</p>}
        {success && <p className="auth-page__success">{success}</p>}

        <div className="auth-page__field">
          <label htmlFor="signup-email" className="auth-page__label">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            className="auth-page__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={submitting || Boolean(success)}
          />
        </div>

        <div className="auth-page__field">
          <label htmlFor="signup-password" className="auth-page__label">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            className="auth-page__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={submitting || Boolean(success)}
          />
        </div>

        <div className="auth-page__field">
          <label htmlFor="signup-confirm" className="auth-page__label">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            className="auth-page__input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={submitting || Boolean(success)}
          />
        </div>

        <button
          type="submit"
          className="auth-page__submit"
          disabled={submitting || Boolean(success) || !isConfigured}
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-page__footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
