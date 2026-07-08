import { BookMarked, BookOpen, Link2, ScrollText } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useReader } from '@/context/ReaderContext';
import { useVerseReferences } from '@/hooks/useVerseReferences';
import {
  createCrossReference,
  deleteCrossReference,
} from '@/services/crossReferenceService';
import { parseScriptureReference } from '@/services/passageKeyService';
import {
  formatCommentaryForNote,
  formatCrossReferenceForNote,
  formatEllenWhiteReferenceForNote,
  insertReferenceAsNewNote,
} from '@/services/referenceImportService';
import type { CrossReference } from '@/types/crossReferences';
import type {
  CommentaryEntry,
  EllenWhiteReferenceEntry,
  PublicCrossReference,
  ReferencePanelTabId,
} from '@/types/referenceProviders';
import type { PassageKey, StudyNote } from '@/types/study';
import { isVerseLevelPassage } from '@/services/providers/referenceUtils';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import { CrossReferenceEditor } from './CrossReferenceEditor';
import {
  CrossReferenceSearch,
  type CrossReferenceSearchResult,
} from './CrossReferenceSearch';
import {
  PublicCrossReferenceSection,
  UserCrossReferenceSection,
} from './PublicCrossReferenceSection';
import { ReferenceResourceCard } from './ReferenceResourceCard';
import { StudyNoteDetail } from './StudyNoteDetail';
import { StudyNotesList } from './StudyNotesList';
import { EmptyState } from './EmptyState';
import {
  CommentaryNotesPanel,
  EgwReferencesPanel,
} from './studyResources/StudyResourcePanels';
import {
  RelatedResourcesPanel,
  usePassageResourceContext,
  type RelatedResourceNavigateKind,
} from './studyResources/RelatedResourcesPanel';
import './CrossReferencePanel.css';
import './ReferenceResourceCard.css';
import './PublicCrossReferenceSection.css';
import './studyResources/studyResources.css';

interface CrossReferencePanelProps {
  sourceReference: PassageKey;
  passageLabel: string;
  references: CrossReference[];
  notes: StudyNote[];
  selectedNoteId: string | null;
  onRefresh: () => void;
  onSelectNote: (noteId: string) => void;
  onStartCreateNote: () => void;
  onNavigateResource?: (kind: RelatedResourceNavigateKind) => void;
}

const TABS: {
  id: ReferencePanelTabId;
  label: string;
  icon: typeof Link2;
}[] = [
  { id: 'cross-references', label: 'Cross References', icon: Link2 },
  { id: 'commentary', label: 'Commentary', icon: BookMarked },
  { id: 'ellen-white', label: 'Ellen White', icon: ScrollText },
  { id: 'my-notes', label: 'My Notes', icon: BookOpen },
];

export function CrossReferencePanel({
  sourceReference,
  passageLabel,
  references,
  notes,
  selectedNoteId,
  onRefresh,
  onSelectNote,
  onStartCreateNote,
  onNavigateResource,
}: CrossReferencePanelProps) {
  const { goToPassage } = useReader();
  const verseRefs = useVerseReferences(sourceReference);
  const [activeTab, setActiveTab] =
    useState<ReferencePanelTabId>('cross-references');
  const [showSearch, setShowSearch] = useState(false);
  const [pendingTarget, setPendingTarget] =
    useState<CrossReferenceSearchResult | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

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

  const handleNavigateCrossRef = (reference: CrossReference) => {
    goToPassage({
      book: reference.targetBook,
      chapter: reference.targetChapter,
      verse: reference.targetVerse,
    });
  };

  const handleNavigateReference = useCallback(
    (targetReference: string) => {
      const location = parseScriptureReference(targetReference);
      if (!location) return;
      goToPassage(location);
    },
    [goToPassage],
  );

  const handleImport = useCallback(
    (title: string, body: string) => {
      const note = insertReferenceAsNewNote(sourceReference, title, body);
      onRefresh();
      onSelectNote(note.id);
      setImportMessage('Added to My Notes.');
      setActiveTab('my-notes');
      window.setTimeout(() => setImportMessage(null), 3000);
    },
    [onRefresh, onSelectNote, sourceReference],
  );

  const handleInsertPublicCrossRef = (entry: PublicCrossReference) => {
    handleImport(
      `Cross Reference — ${entry.targetReference}`,
      formatCrossReferenceForNote(entry, sourceReference),
    );
  };

  const handleInsertCommentary = (entry: CommentaryEntry) => {
    handleImport(
      `${entry.sourceName} — ${entry.reference}`,
      formatCommentaryForNote(entry),
    );
  };

  const handleInsertEgw = (entry: EllenWhiteReferenceEntry) => {
    handleImport(
      `EGW — ${entry.egwReference}`,
      formatEllenWhiteReferenceForNote(entry),
    );
  };

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? null;

  const verseLevel = isVerseLevelPassage(sourceReference);
  const resourceContext = usePassageResourceContext(sourceReference);

  const handleNavigateRelated = (kind: RelatedResourceNavigateKind) => {
    onNavigateResource?.(kind);
  };

  return (
    <div className="cross-ref-panel">
      <ReadingPanelChrome focusId="cross-references" title="Cross References & Resources" />
      <div
        className="cross-ref-panel__tabs"
        role="tablist"
        aria-label="Reference resources"
      >
        {TABS.map(({ id, label: tabLabel, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={
              activeTab === id
                ? 'cross-ref-panel__tab cross-ref-panel__tab--active'
                : 'cross-ref-panel__tab'
            }
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} strokeWidth={2} aria-hidden="true" />
            {tabLabel}
          </button>
        ))}
      </div>

      {importMessage && (
        <p className="cross-ref-panel__toast" role="status">
          {importMessage}
        </p>
      )}

      <div className="cross-ref-panel__scroll">
        <RelatedResourcesPanel
          context={resourceContext}
          onNavigate={(kind) => handleNavigateRelated(kind)}
        />

        {activeTab === 'cross-references' && (
          <div role="tabpanel">
            {!verseLevel && (
              <p className="cross-ref-panel__hint">
                Select a verse to view Treasury of Scripture Knowledge references.
                Chapter-level selections show your personal cross references only.
              </p>
            )}

            {verseRefs.loading && verseLevel && (
              <p className="cross-ref-panel__hint">Loading cross references…</p>
            )}

            {verseRefs.error && (
              <p className="cross-ref-panel__error">{verseRefs.error}</p>
            )}

            <UserCrossReferenceSection
              references={references}
              passageLabel={passageLabel}
              showSearch={showSearch}
              pendingTarget={Boolean(pendingTarget)}
              onNavigate={handleNavigateCrossRef}
              onDelete={handleDelete}
              onAdd={() => {
                setShowSearch(true);
                setPendingTarget(null);
                setError(null);
              }}
            >
              {showSearch && <CrossReferenceSearch onSelect={handleSelect} />}

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
            </UserCrossReferenceSection>

            {verseLevel && !verseRefs.loading && (
              <PublicCrossReferenceSection
                references={verseRefs.publicCrossReferences}
                attribution={verseRefs.tskAttribution}
                onNavigate={handleNavigateReference}
                onInsert={handleInsertPublicCrossRef}
              />
            )}
          </div>
        )}

        {activeTab === 'commentary' && (
          <div role="tabpanel">
            {!verseLevel ? (
              <p className="cross-ref-panel__hint">
                Select a verse to view public-domain commentary. You can still add personal
                commentary notes below.
              </p>
            ) : verseRefs.loading ? (
              <p className="cross-ref-panel__hint">Loading commentary…</p>
            ) : verseRefs.commentary.length > 0 ? (
              <>
                <p className="study-resource-panel__section-title">Public Commentary</p>
                {verseRefs.commentary.map((entry) => (
                  <ReferenceResourceCard
                    key={entry.id}
                    sourceLabel={entry.sourceName}
                    title={entry.reference}
                    summary={entry.summary}
                    excerpt={entry.excerpt}
                    showExcerpt={entry.textEmbedded}
                    attribution={
                      entry.attributionRequired
                        ? entry.attribution
                        : `${entry.attribution} · ${entry.license}`
                    }
                    externalUrl={entry.externalUrl}
                    externalLabel="Open full commentary"
                    onInsert={() => handleInsertCommentary(entry)}
                  />
                ))}
              </>
            ) : (
              <EmptyState
                icon={<BookMarked size={22} strokeWidth={1.75} />}
                title="No Public Commentary"
                message={`No public-domain commentary is bundled for ${passageLabel} yet. Add your own notes below.`}
              />
            )}

            <CommentaryNotesPanel
              passageKey={sourceReference}
              passageLabel={passageLabel}
            />
          </div>
        )}

        {activeTab === 'ellen-white' && (
          <div role="tabpanel">
            {!verseLevel ? (
              <p className="cross-ref-panel__hint">
                Select a verse to view Ellen G. White reference links. You can still add personal
                references below.
              </p>
            ) : verseRefs.loading ? (
              <p className="cross-ref-panel__hint">Loading references…</p>
            ) : verseRefs.ellenWhite.length > 0 ? (
              <>
                <p className="study-resource-panel__section-title">Indexed EGW Links</p>
                {verseRefs.ellenWhite.map((entry) => (
                  <ReferenceResourceCard
                    key={entry.id}
                    sourceLabel="Ellen G. White Reference"
                    title={entry.egwReference}
                    summary={entry.summary}
                    licenseNote={entry.licenseNote}
                    attribution={entry.attribution}
                    externalUrl={entry.externalUrl}
                    externalLabel="Open at EGW Writings"
                    onInsert={() => handleInsertEgw(entry)}
                  />
                ))}
              </>
            ) : (
              <EmptyState
                icon={<ScrollText size={22} strokeWidth={1.75} />}
                title="No Indexed EGW Links"
                message={`No Ellen G. White reference links are indexed for ${passageLabel} yet. Add your own references below.`}
              />
            )}

            <EgwReferencesPanel passageKey={sourceReference} passageLabel={passageLabel} />
          </div>
        )}

        {activeTab === 'my-notes' && (
          <div role="tabpanel" className="cross-ref-panel__notes">
            <div className="cross-ref-panel__notes-toolbar">
              <button
                type="button"
                className="cross-ref-panel__add-btn"
                onClick={onStartCreateNote}
              >
                + New Note
              </button>
            </div>

            {notes.length > 0 ? (
              <>
                <StudyNotesList
                  notes={notes}
                  selectedNoteId={selectedNoteId}
                  onSelect={onSelectNote}
                />
                {selectedNote && <StudyNoteDetail note={selectedNote} />}
              </>
            ) : (
              <EmptyState
                icon={<BookOpen size={22} strokeWidth={1.75} />}
                title="No Notes for This Passage"
                message={`Create a note for ${passageLabel}, or insert commentary and references from the other tabs.`}
                actionLabel="New Note"
                onAction={onStartCreateNote}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
