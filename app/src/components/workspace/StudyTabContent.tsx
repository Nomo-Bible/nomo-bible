import { EmptyState } from './EmptyState';
import { StudyNoteDetail } from './StudyNoteDetail';
import { StudyNoteEditor } from './StudyNoteEditor';
import { StudyNotesList } from './StudyNotesList';
import { CrossReferencePanel } from './CrossReferencePanel';
import { ConcordancePanel } from './ConcordancePanel';
import { KnowledgeBaseEmptyPanel } from './KnowledgeBaseEmptyPanel';
import type { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import './StudyTabContent.css';

type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;

interface StudyTabContentProps {
  workspace: StudyWorkspaceState;
  passageLabel: string;
}

export function StudyTabContent({ workspace, passageLabel }: StudyTabContentProps) {
  const {
    activeTab,
    notes,
    crossReferences,
    selectedNote,
    selectedNoteId,
    editorMode,
    draft,
    startCreate,
    updateDraftField,
  } = workspace;

  switch (activeTab) {
    case 'study-notes':
      if (editorMode === 'create' || editorMode === 'edit') {
        return (
          <div className="study-tab-content__scroll">
            <StudyNoteEditor
              draft={draft}
              mode={editorMode}
              onChange={updateDraftField}
            />
          </div>
        );
      }

      if (notes.length === 0) {
        return (
          <div className="study-tab-content__scroll">
            <EmptyState
              icon="📖"
              title="No Study Notes"
              message={`There are currently no study notes for ${passageLabel}. Click below to begin building your study library.`}
              actionLabel="+ New Note"
              onAction={startCreate}
            />
          </div>
        );
      }

      return (
        <div className="study-tab-content__notes">
          <StudyNotesList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelect={workspace.selectNote}
          />
          {editorMode === 'view' && selectedNote && (
            <StudyNoteDetail note={selectedNote} />
          )}
        </div>
      );

    case 'cross-references':
      return (
        <div className="study-tab-content__panel">
          <CrossReferencePanel
            sourceReference={workspace.passageKey}
            passageLabel={passageLabel}
            references={crossReferences}
            onRefresh={workspace.handleRefresh}
          />
        </div>
      );

    case 'concordance':
      return (
        <div className="study-tab-content__panel">
          <ConcordancePanel />
        </div>
      );

    case 'topics':
      return (
        <div className="study-tab-content__scroll">
          <KnowledgeBaseEmptyPanel
            icon="🏷"
            title="No Topics"
            message={`No topics have yet been connected to ${passageLabel}. Topics will become part of the Knowledge Base.`}
          />
        </div>
      );

    case 'doctrine':
      return (
        <div className="study-tab-content__scroll">
          <KnowledgeBaseEmptyPanel
            icon="📜"
            title="No Doctrine Articles"
            message={`No doctrine articles have been linked to ${passageLabel}. Doctrinal studies will be drawn from the Knowledge Base.`}
          />
        </div>
      );

    case 'charts':
      return (
        <div className="study-tab-content__scroll">
          <KnowledgeBaseEmptyPanel
            icon="📊"
            title="No Charts"
            message={`No charts have been connected to ${passageLabel}. Visual study resources will appear here from the Knowledge Base.`}
          />
        </div>
      );

    default:
      return null;
  }
}
