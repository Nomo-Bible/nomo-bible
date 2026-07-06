import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__card">
        {icon && (
          <div className="empty-state__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className="empty-state__title">{title}</h3>
        <p className="empty-state__message">{message}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            className="empty-state__action nm-btn nm-btn--primary nm-btn--pill"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
