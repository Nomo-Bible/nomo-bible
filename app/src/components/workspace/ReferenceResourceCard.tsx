import { ExternalLink, NotebookPen } from 'lucide-react';
import './ReferenceResourceCard.css';

interface ReferenceResourceCardProps {
  sourceLabel: string;
  title: string;
  summary?: string;
  excerpt?: string;
  showExcerpt?: boolean;
  licenseNote?: string;
  attribution?: string;
  externalUrl?: string;
  externalLabel?: string;
  onInsert?: () => void;
  insertLabel?: string;
}

export function ReferenceResourceCard({
  sourceLabel,
  title,
  summary,
  excerpt,
  showExcerpt = false,
  licenseNote,
  attribution,
  externalUrl,
  externalLabel = 'Open source',
  onInsert,
  insertLabel = 'Insert into Notes',
}: ReferenceResourceCardProps) {
  return (
    <article className="reference-resource-card">
      <header className="reference-resource-card__header">
        <span className="reference-resource-card__source">{sourceLabel}</span>
        <h4 className="reference-resource-card__title">{title}</h4>
      </header>

      {summary && (
        <p className="reference-resource-card__summary">{summary}</p>
      )}

      {showExcerpt && excerpt && (
        <blockquote className="reference-resource-card__excerpt">
          {excerpt}
        </blockquote>
      )}

      {licenseNote && (
        <p className="reference-resource-card__license">{licenseNote}</p>
      )}

      {attribution && (
        <p className="reference-resource-card__attribution">{attribution}</p>
      )}

      <div className="reference-resource-card__actions">
        {externalUrl && (
          <a
            className="reference-resource-card__link"
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
            {externalLabel}
          </a>
        )}
        {onInsert && (
          <button
            type="button"
            className="reference-resource-card__insert"
            onClick={onInsert}
          >
            <NotebookPen size={14} strokeWidth={2} aria-hidden="true" />
            {insertLabel}
          </button>
        )}
      </div>
    </article>
  );
}
