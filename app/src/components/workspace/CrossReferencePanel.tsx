import { useReader } from '@/context/ReaderContext';
import { parseScriptureReference } from '@/services/passageKeyService';
import type { CrossReference } from '@/types/study';
import { EmptyState } from './EmptyState';
import './CrossReferencePanel.css';

interface CrossReferencePanelProps {
  references: CrossReference[];
  passageLabel: string;
}

export function CrossReferencePanel({
  references,
  passageLabel,
}: CrossReferencePanelProps) {
  const { goToPassage } = useReader();

  if (references.length === 0) {
    return (
      <EmptyState
        icon="🔗"
        title="No Cross References"
        message={`Cross references have not been connected to ${passageLabel} yet. Related passages from the Knowledge Base will appear here.`}
      />
    );
  }

  return (
    <ul className="cross-ref-panel" aria-label="Cross references">
      {references.map((ref) => (
        <li key={ref.id} className="cross-ref-panel__item">
          <button
            type="button"
            className="cross-ref-panel__link"
            onClick={() => {
              const location = parseScriptureReference(ref.targetReference);
              if (location) goToPassage(location);
            }}
          >
            <span className="cross-ref-panel__ref">{ref.targetReference}</span>
            {ref.description && (
              <span className="cross-ref-panel__desc">{ref.description}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
