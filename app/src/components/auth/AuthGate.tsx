import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import './AuthGate.css';

interface AuthGateProps {
  /** When true, renders as a compact overlay (word-study prompt). */
  compact?: boolean;
  onDismiss?: () => void;
}

export function AuthGate({ compact = false, onDismiss }: AuthGateProps) {
  return (
    <div
      className={compact ? 'auth-gate auth-gate--compact' : 'auth-gate'}
      role="region"
      aria-label="Sign in required"
    >
      <BookOpen
        className="auth-gate__icon"
        size={compact ? 28 : 36}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <p className="auth-gate__message">
        Create a free account to use the study workspace.
      </p>
      <p className="auth-gate__hint">
        Bible reading remains free. Sign in to unlock Strong&apos;s, Concordance,
        Study Notes, Cross References, and more.
      </p>
      <div className="auth-gate__actions">
        <Link to="/login" className="auth-gate__btn auth-gate__btn--primary">
          Sign in
        </Link>
        <Link to="/signup" className="auth-gate__btn auth-gate__btn--secondary">
          Create account
        </Link>
        {onDismiss && (
          <button type="button" className="auth-gate__btn auth-gate__btn--ghost" onClick={onDismiss}>
            Continue reading
          </button>
        )}
      </div>
    </div>
  );
}
