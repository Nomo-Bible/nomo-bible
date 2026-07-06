import type { ReactNode } from 'react';
import { Link2 } from 'lucide-react';
import type { PublicCrossReference } from '@/types/referenceProviders';
import type { CrossReference } from '@/types/crossReferences';
import { CrossReferenceList } from './CrossReferenceList';
import { EmptyState } from './EmptyState';
import './PublicCrossReferenceSection.css';

interface PublicCrossReferenceSectionProps {
  references: PublicCrossReference[];
  attribution: string | null;
  onNavigate: (targetReference: string) => void;
  onInsert: (entry: PublicCrossReference) => void;
}

export function PublicCrossReferenceSection({
  references,
  attribution,
  onNavigate,
  onInsert,
}: PublicCrossReferenceSectionProps) {
  if (references.length === 0) return null;

  return (
    <section className="public-cross-ref-section" aria-label="Treasury of Scripture Knowledge">
      <header className="public-cross-ref-section__header">
        <h3 className="public-cross-ref-section__title">
          Treasury of Scripture Knowledge
        </h3>
        {attribution && (
          <p className="public-cross-ref-section__attribution">{attribution}</p>
        )}
      </header>

      <ul className="public-cross-ref-section__list">
        {references.map((ref) => (
          <li key={`${ref.targetReference}-${ref.note ?? ''}`} className="public-cross-ref-section__item">
            <button
              type="button"
              className="public-cross-ref-section__link"
              onClick={() => onNavigate(ref.targetReference)}
            >
              <span className="public-cross-ref-section__ref">{ref.targetReference}</span>
              {ref.note && (
                <span className="public-cross-ref-section__note">{ref.note}</span>
              )}
            </button>
            <button
              type="button"
              className="public-cross-ref-section__insert"
              onClick={() => onInsert(ref)}
            >
              Insert
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface UserCrossReferenceSectionProps {
  references: CrossReference[];
  passageLabel: string;
  showSearch: boolean;
  pendingTarget: boolean;
  onNavigate: (reference: CrossReference) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  children?: ReactNode;
}

export function UserCrossReferenceSection({
  references,
  passageLabel,
  showSearch,
  pendingTarget,
  onNavigate,
  onDelete,
  onAdd,
  children,
}: UserCrossReferenceSectionProps) {
  return (
    <section className="public-cross-ref-section" aria-label="Your cross references">
      <header className="public-cross-ref-section__header">
        <h3 className="public-cross-ref-section__title">Your Cross References</h3>
      </header>

      <div className="public-cross-ref-section__toolbar">
        <button type="button" className="cross-ref-panel__add-btn" onClick={onAdd}>
          + Add Cross Reference
        </button>
      </div>

      {children}

      {references.length > 0 ? (
        <CrossReferenceList
          references={references}
          onNavigate={onNavigate}
          onDelete={onDelete}
        />
      ) : (
        !showSearch &&
        !pendingTarget && (
          <EmptyState
            icon={<Link2 size={22} strokeWidth={1.75} />}
            title="No Personal Cross References"
            message={`You have not added cross references for ${passageLabel} yet.`}
            actionLabel="Add Cross Reference"
            onAction={onAdd}
          />
        )
      )}
    </section>
  );
}
