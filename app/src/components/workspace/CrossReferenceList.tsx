import { Trash2 } from 'lucide-react';
import type { CrossReference } from '@/types/crossReferences';
import './CrossReferenceList.css';

interface CrossReferenceListProps {
  references: CrossReference[];
  onNavigate: (reference: CrossReference) => void;
  onDelete: (id: string) => void;
}

export function CrossReferenceList({
  references,
  onNavigate,
  onDelete,
}: CrossReferenceListProps) {
  return (
    <ul className="cross-ref-list" aria-label="Cross references">
      {references.map((ref) => (
        <li key={ref.id} className="cross-ref-list__item">
          <button
            type="button"
            className="cross-ref-list__link"
            onClick={() => onNavigate(ref)}
          >
            <span className="cross-ref-list__ref">{ref.targetReference}</span>
            {ref.label && (
              <span className="cross-ref-list__label">{ref.label}</span>
            )}
          </button>
          <button
            type="button"
            className="cross-ref-list__delete"
            onClick={() => onDelete(ref.id)}
            aria-label={`Delete cross reference to ${ref.targetReference}`}
            title="Delete cross reference"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
