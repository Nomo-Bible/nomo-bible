import { BarChart3, BookOpen, ScrollText, Tags } from 'lucide-react';
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
          <div className="study-tab-content__body nm-fade-in">
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
          <div className="study-tab-content__body nm-fade-in">
            <EmptyState
              icon={<BookOpen size={22} strokeWidth={1.75} />}
              title="No Study Notes"
              message={`There are currently no study notes for ${passageLabel}. Click below to begin building your study library.`}
              actionLabel="New Note"
              onAction={startCreate}
            />
          </div>
        );
      }

      return (
        <div className="study-tab-content__notes nm-fade-in">
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
        <div className="study-tab-content__body nm-fade-in">
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
        <div className="study-tab-content__body nm-fade-in">
          <ConcordancePanel />
        </div>
      );

    case 'topics':
      return (
        <div className="study-tab-content__body nm-fade-in">
          <KnowledgeBaseEmptyPanel
            icon={<Tags size={22} strokeWidth={1.75} />}
            title="No Topics"
            message={`No topics have yet been connected to ${passageLabel}. Topics will become part of the Knowledge Base.`}
          />
        </div>
      );

    case 'doctrine':
      return (
        <div className="study-tab-content__body nm-fade-in">
          <KnowledgeBaseEmptyPanel
            icon={<ScrollText size={22} strokeWidth={1.75} />}
            title="No Doctrine Articles"
            message={`No doctrine articles have been linked to ${passageLabel}. Doctrinal studies will be drawn from the Knowledge Base.`}
          />
        </div>
      );

    case 'charts':
      return (
        <div className="study-tab-content__body nm-fade-in">
          <KnowledgeBaseEmptyPanel
            icon={<BarChart3 size={22} strokeWidth={1.75} />}
            title="No Charts"
            message={`No charts have been connected to ${passageLabel}. Visual study resources will appear here from the Knowledge Base.`}
          />
        </div>
      );

    default:
      return null;
  }
}
