import { BookOpen } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import type { StudyResourceKind } from '@/types/studyResources';

import type { StudyResourceLibrarySection } from '@/types/studyWorkspace';

import { EmptyState } from './EmptyState';

import { ReadingPanelChrome } from './ReadingPanelChrome';

import { StudyNoteDetail } from './StudyNoteDetail';

import { StudyNoteEditor } from './StudyNoteEditor';

import { StudyNotesList } from './StudyNotesList';

import { CrossReferencePanel } from './CrossReferencePanel';

import { ConcordancePanel } from './ConcordancePanel';

import { HowToStudyBiblePanel } from './HowToStudyBiblePanel';

import { HowToStudyMobilePanel } from './HowToStudyMobilePanel';

import { KjvWordGuidePanel } from './KjvWordGuidePanel';

import { ChartsPanel, TopicsPanel } from './studyResources/StudyResourcePanels';

import {

  RelatedResourcesPanel,

  usePassageResourceContext,

  type RelatedResourceNavigateKind,

} from './studyResources/RelatedResourcesPanel';

import { StudyResourcesLibraryPanel } from './studyResources/StudyResourcesLibraryPanel';

import {
  CATALOG_KIND_LIBRARY_SECTION,
  RESOURCE_KIND_LIBRARY_SECTION,
} from './studyResources/resourceFieldConfigs';

import type { useStudyWorkspace } from '@/hooks/useStudyWorkspace';

import './StudyTabContent.css';



type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;



interface StudyTabContentProps {

  workspace: StudyWorkspaceState;

  passageLabel: string;

  howToStudySectionId?: string | null;

  onHowToStudySectionChange?: (sectionId: string | null) => void;

}



export function StudyTabContent({

  workspace,

  passageLabel,

  howToStudySectionId = null,

  onHowToStudySectionChange,

}: StudyTabContentProps) {

  const isMobile = useMediaQuery('(max-width: 768px)');

  const [searchParams, setSearchParams] = useSearchParams();

  const {

    activeTab,

    notes,

    allNotes,

    crossReferences,

    selectedNote,

    selectedNoteId,

    editorMode,

    draft,

    startCreate,

    updateDraftField,

    viewNotesList,

    openNote,

    studyResourceSection,

  } = workspace;



  const resourceContext = usePassageResourceContext(workspace.passageKey);



  const setLibrarySection = (section: StudyResourceLibrarySection) => {

    const next = new URLSearchParams(searchParams);

    next.set('tab', 'study-resources');

    next.set('resource', section);

    setSearchParams(next, { replace: true });

  };



  const handleNavigateResource = (kind: RelatedResourceNavigateKind) => {

    const librarySection =
      CATALOG_KIND_LIBRARY_SECTION[kind as keyof typeof CATALOG_KIND_LIBRARY_SECTION] ??
      RESOURCE_KIND_LIBRARY_SECTION[kind as StudyResourceKind];

    if (librarySection) {

      workspace.setActiveTab('study-resources');

      setLibrarySection(librarySection);

      return;

    }

    if (kind === 'topic') {

      workspace.setActiveTab('study-resources');

      setLibrarySection('topics');

      return;

    }

    if (kind === 'chart') {

      workspace.setActiveTab('study-resources');

      setLibrarySection('charts');

      return;

    }

    workspace.setActiveTab('study-resources');

    setLibrarySection('overview');

  };



  switch (activeTab) {

    case 'study-notes':

      if (editorMode === 'create' || editorMode === 'edit') {

        return (

          <div className="study-tab-content__body nm-fade-in">

            <StudyNoteEditor

              draft={draft}

              mode={editorMode}

              onChange={updateDraftField}

              remountKey={selectedNoteId ?? 'create'}

              savedNoteCount={allNotes.length}

              onViewNotesList={viewNotesList}

            />

          </div>

        );

      }



      if (notes.length === 0) {

        if (allNotes.length > 0) {

          return (

            <div className="study-tab-content__notes nm-fade-in">

              <div className="study-tab-content__all-notes-intro">

                <p>

                  No notes for {passageLabel}, but you have {allNotes.length} saved

                  note{allNotes.length === 1 ? '' : 's'} on other passages.

                </p>

              </div>

              <StudyNotesList

                notes={allNotes}

                selectedNoteId={selectedNoteId}

                onSelect={openNote}

                showPassage

              />

              {editorMode === 'view' && selectedNote && (

                <StudyNoteDetail note={selectedNote} />

              )}

            </div>

          );

        }

        return (

          <div className="study-tab-content__body nm-fade-in">

            <RelatedResourcesPanel

              context={resourceContext}

              onNavigate={handleNavigateResource}

            />

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

          <div className="study-tab-content__related-wrap">

            <RelatedResourcesPanel

              context={resourceContext}

              onNavigate={handleNavigateResource}

            />

          </div>

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

            notes={notes}

            selectedNoteId={selectedNoteId}

            onRefresh={workspace.handleRefresh}

            onSelectNote={workspace.selectNote}

            onStartCreateNote={() => {

              workspace.startCreate();

              workspace.setActiveTab('study-notes');

            }}

            onNavigateResource={handleNavigateResource}

          />

        </div>

      );



    case 'study-resources':

      return (

        <div className="study-tab-content__body nm-fade-in">

          <StudyResourcesLibraryPanel

            passageKey={workspace.passageKey}

            passageLabel={passageLabel}

            activeSection={studyResourceSection}

            onSectionChange={(section) => {

              workspace.setActiveTab('study-resources');

              setLibrarySection(section);

            }}

            onNavigateResource={handleNavigateResource}

            onOpenStudyNotes={() => workspace.setActiveTab('study-notes')}

            onSelectNote={(noteId) => {
              openNote(noteId);
            }}

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

          <ReadingPanelChrome focusId="topics" title="Topics" />

          <TopicsPanel

            passageKey={workspace.passageKey}

            passageLabel={passageLabel}

            headerSlot={

              <RelatedResourcesPanel

                context={resourceContext}

                onNavigate={handleNavigateResource}

              />

            }

          />

        </div>

      );



    case 'how-to-study':

      return (

        <div

          className={

            isMobile

              ? 'study-tab-content__body study-tab-content__body--how-to-study study-tab-content__body--how-to-study-mobile nm-fade-in'

              : 'study-tab-content__body study-tab-content__body--how-to-study nm-fade-in'

          }

        >

          {isMobile ? (

            <HowToStudyMobilePanel

              selectedSectionId={howToStudySectionId}

              onSelectSection={onHowToStudySectionChange ?? (() => undefined)}

            />

          ) : (

            <HowToStudyBiblePanel />

          )}

        </div>

      );

    case 'kjv-word-guide':

      return (

        <div className="study-tab-content__body nm-fade-in">

          <KjvWordGuidePanel />

        </div>

      );

    case 'charts':

      return (

        <div className="study-tab-content__body nm-fade-in">

          <ReadingPanelChrome focusId="charts" title="Charts" />

          <ChartsPanel

            passageKey={workspace.passageKey}

            passageLabel={passageLabel}

            headerSlot={

              <RelatedResourcesPanel

                context={resourceContext}

                onNavigate={handleNavigateResource}

              />

            }

          />

        </div>

      );



    default:

      return null;

  }

}


