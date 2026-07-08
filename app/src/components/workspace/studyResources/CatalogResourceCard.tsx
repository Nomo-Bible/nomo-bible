import { BookOpen, Link2, Plus } from 'lucide-react';
import './studyResources.css';

interface CatalogResourceCardProps {
  title: string;
  description: string;
  sourceName: string;
  licenseNotes: string;
  sourceUrl?: string;
  openSourceUrl?: string;
  imagePath?: string;
  meta?: string;
  onRead?: () => void;
  onOpenSource?: () => void;
  onAddLinkedNote?: () => void;
}

export function CatalogResourceCard({
  title,
  description,
  sourceName,
  licenseNotes,
  sourceUrl,
  openSourceUrl,
  imagePath,
  meta,
  onRead,
  onOpenSource,
  onAddLinkedNote,
}: CatalogResourceCardProps) {
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
          {onRead ? (
            <button
              type="button"
              className="catalog-resource-card__btn catalog-resource-card__btn--primary"
              onClick={onRead}
            >
              <BookOpen size={14} strokeWidth={2} aria-hidden="true" />
              Read
            </button>
          ) : null}
          {onAddLinkedNote ? (
            <button type="button" className="catalog-resource-card__btn" onClick={onAddLinkedNote}>
              <Plus size={14} strokeWidth={2} aria-hidden="true" />
              Add Linked Note
            </button>
          ) : null}
          {openSourceUrl ? (
            <button type="button" className="catalog-resource-card__btn" onClick={handleOpenSource}>
              <Link2 size={14} strokeWidth={2} aria-hidden="true" />
              Open Source
            </button>
          ) : null}
        </div>
        {sourceUrl ? (
          <p className="catalog-resource-card__ref">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              Official source (reference only)
            </a>
          </p>
        ) : null}
      </div>
    </article>
  );
}
