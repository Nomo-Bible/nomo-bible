import { useState } from 'react';
import { useReader } from '@/context/ReaderContext';
import {
  createCrossReference,
  deleteCrossReference,
} from '@/services/crossReferenceService';
import type { CrossReference } from '@/types/crossReferences';
import type { PassageKey } from '@/types/study';
import { CrossReferenceEditor } from './CrossReferenceEditor';
import {
  CrossReferenceSearch,
  type CrossReferenceSearchResult,
} from './CrossReferenceSearch';
import { CrossReferenceList } from './CrossReferenceList';
import { EmptyState } from './EmptyState';
import './CrossReferencePanel.css';

interface CrossReferencePanelProps {
  sourceReference: PassageKey;
  passageLabel: string;
  references: CrossReference[];
  onRefresh: () => void;
}

export function CrossReferencePanel({
  sourceReference,
  passageLabel,
  references,
  onRefresh,
}: CrossReferencePanelProps) {
  const { goToPassage } = useReader();
  const [showSearch, setShowSearch] = useState(false);
  const [pendingTarget, setPendingTarget] =
    useState<CrossReferenceSearchResult | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetAddFlow = () => {
    setShowSearch(false);
    setPendingTarget(null);
    setLabel('');
    setError(null);
  };

  const handleSelect = (result: CrossReferenceSearchResult) => {
    setPendingTarget(result);
    setShowSearch(false);
    setError(null);
  };

  const handleSave = () => {
    if (!pendingTarget) return;

    try {
      createCrossReference({
        sourceReference,
        targetBook: pendingTarget.target.targetBook,
        targetChapter: pendingTarget.target.targetChapter,
        targetVerse: pendingTarget.target.targetVerse,
        label,
      });
      resetAddFlow();
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not add cross reference.',
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteCrossReference(id);
    onRefresh();
  };

  const handleNavigate = (reference: CrossReference) => {
    goToPassage({
      book: reference.targetBook,
      chapter: reference.targetChapter,
      verse: reference.targetVerse,
    });
  };

  return (
    <div className="cross-ref-panel">
      <div className="cross-ref-panel__toolbar">
        <button
          type="button"
          className="cross-ref-panel__add-btn"
          onClick={() => {
            setShowSearch(true);
            setPendingTarget(null);
            setError(null);
          }}
        >
          + Add Cross Reference
        </button>
      </div>

      <div className="cross-ref-panel__scroll">
        {showSearch && (
          <CrossReferenceSearch onSelect={handleSelect} />
        )}

        {pendingTarget && (
          <CrossReferenceEditor
            target={pendingTarget.target}
            label={label}
            error={error}
            onLabelChange={setLabel}
            onSave={handleSave}
            onCancel={resetAddFlow}
          />
        )}

        {references.length > 0 ? (
          <CrossReferenceList
            references={references}
            onNavigate={handleNavigate}
            onDelete={handleDelete}
          />
        ) : (
          !showSearch &&
          !pendingTarget && (
            <EmptyState
              icon="🔗"
              title="No Cross References"
              message={`There are no cross references connected to ${passageLabel} yet. Search for a related passage and add your first connection.`}
              actionLabel="+ Add Cross Reference"
              onAction={() => setShowSearch(true)}
            />
          )
        )}
      </div>
    </div>
  );
}
