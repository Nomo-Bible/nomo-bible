import { ExternalLink, FileText, Link2, Plus } from 'lucide-react';
import './studyResources.css';

interface CatalogResourceCardProps {
  title: string;
  description: string;
  sourceName: string;
  licenseNotes: string;
  readOnlineUrl?: string;
  openSourceUrl?: string;
  localTextAvailable?: boolean;
  imagePath?: string;
  meta?: string;
  onReadOnline?: () => void;
  onOpenSource?: () => void;
  onViewLocalText?: () => void;
  onAddLinkedNote?: () => void;
}

export function CatalogResourceCard({
  title,
  description,
  sourceName,
  licenseNotes,
  readOnlineUrl,
  openSourceUrl,
  localTextAvailable,
  imagePath,
  meta,
  onReadOnline,
  onOpenSource,
  onViewLocalText,
  onAddLinkedNote,
}: CatalogResourceCardProps) {
  const handleReadOnline = () => {
    if (onReadOnline) onReadOnline();
    else if (readOnlineUrl) window.open(readOnlineUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenSource = () => {
    if (onOpenSource) onOpenSource();
    else if (openSourceUrl) window.open(openSourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="catalog-resource-card">
      {imagePath ? (
        <img src={imagePath} alt="" className="catalog-resource-card__image" loading="lazy" />
      ) : null}
      <div className="catalog-resource-card__body">
        <h3 className="catalog-resource-card__title">{title}</h3>
        {meta ? <p className="catalog-resource-card__meta">{meta}</p> : null}
        <p className="catalog-resource-card__description">{description}</p>
        <p className="catalog-resource-card__source">
          <strong>Source:</strong> {sourceName}
        </p>
        <p className="catalog-resource-card__license">{licenseNotes}</p>
        <div className="catalog-resource-card__actions">
          {readOnlineUrl ? (
            <button type="button" className="catalog-resource-card__btn catalog-resource-card__btn--primary" onClick={handleReadOnline}>
              <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
              Read Online
            </button>
          ) : null}
          {openSourceUrl ? (
            <button type="button" className="catalog-resource-card__btn" onClick={handleOpenSource}>
              <Link2 size={14} strokeWidth={2} aria-hidden="true" />
              Open Source
            </button>
          ) : null}
          {localTextAvailable && onViewLocalText ? (
            <button type="button" className="catalog-resource-card__btn" onClick={onViewLocalText}>
              <FileText size={14} strokeWidth={2} aria-hidden="true" />
              View Local Text
            </button>
          ) : null}
          {onAddLinkedNote ? (
            <button type="button" className="catalog-resource-card__btn" onClick={onAddLinkedNote}>
              <Plus size={14} strokeWidth={2} aria-hidden="true" />
              Add Linked Note
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface LocalTextViewerProps {
  title: string;
  content: string;
  onClose: () => void;
}

export function LocalTextViewer({ title, content, onClose }: LocalTextViewerProps) {
  return (
    <div className="local-text-viewer" role="dialog" aria-label={`Local text: ${title}`}>
      <header className="local-text-viewer__header">
        <h3 className="local-text-viewer__title">{title}</h3>
        <button type="button" className="local-text-viewer__close" onClick={onClose}>
          Close
        </button>
      </header>
      <div className="local-text-viewer__body study-article">
        {content.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return (
              <h2 key={index} className="study-article__h2">
                {line.slice(2)}
              </h2>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={index} className="study-article__h3">
                {line.slice(3)}
              </h3>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={index} className="study-article__quote">
                {line.slice(2)}
              </blockquote>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={index}>
                <strong>{line.slice(2, -2)}</strong>
              </p>
            );
          }
          if (!line.trim()) return <br key={index} />;
          if (line.startsWith('---')) return null;
          return <p key={index}>{line}</p>;
        })}
      </div>
    </div>
  );
}
