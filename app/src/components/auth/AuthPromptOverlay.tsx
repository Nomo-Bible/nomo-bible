import { useAuth } from '@/auth/useAuth';
import { AuthGate } from '@/components/auth/AuthGate';
import './AuthGate.css';

/** Modal overlay when a signed-out user triggers a protected study action. */
export function AuthPromptOverlay() {
  const { authPromptOpen, closeAuthPrompt } = useAuth();

  if (!authPromptOpen) return null;

  return (
    <div
      className="auth-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in required"
      onClick={closeAuthPrompt}
    >
      <div
        className="auth-prompt-overlay__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <AuthGate compact onDismiss={closeAuthPrompt} />
      </div>
    </div>
  );
}
