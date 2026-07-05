import { EmptyState } from './EmptyState';
import { StudyNoteDetail } from './StudyNoteDetail';
import { StudyNoteEditor } from './StudyNoteEditor';
import { StudyNotesList } from './StudyNotesList';
import { CrossReferencePanel } from './CrossReferencePanel';
import { StrongsPanel } from './StrongsPanel';
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
          <StudyNoteEditor
            draft={draft}
            mode={editorMode}
            onChange={updateDraftField}
          />
        );
      }

      if (notes.length === 0) {
        return (
          <EmptyState
            icon="📖"
            title="No Study Notes"
            message={`There are currently no study notes for ${passageLabel}. Click below to begin building your study library.`}
            actionLabel="+ New Note"
            onAction={startCreate}
          />
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
        <CrossReferencePanel
          references={crossReferences}
          passageLabel={passageLabel}
        />
      );

    case 'strongs':
      return <StrongsPanel />;

    case 'topics':
      return (
        <KnowledgeBaseEmptyPanel
          icon="🏷"
          title="No Topics"
          message={`No topics have yet been connected to ${passageLabel}. Topics will become part of the Knowledge Base.`}
        />
      );

    case 'doctrine':
      return (
        <KnowledgeBaseEmptyPanel
          icon="📜"
          title="No Doctrine Articles"
          message={`No doctrine articles have been linked to ${passageLabel}. Doctrinal studies will be drawn from the Knowledge Base.`}
        />
      );

    case 'charts':
      return (
        <KnowledgeBaseEmptyPanel
          icon="📊"
          title="No Charts"
          message={`No charts have been connected to ${passageLabel}. Visual study resources will appear here from the Knowledge Base.`}
        />
      );

    default:
      return null;
  }
}
