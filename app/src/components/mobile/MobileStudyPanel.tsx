import { useReader } from '@/context/ReaderContext';
import type { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { formatReaderLocation } from '@/types/bible';
import { STUDY_WORKSPACE_TABS } from '@/types/studyWorkspace';
import { StudyWorkspaceBody } from '@/components/workspace/StudyWorkspaceBody';
import './mobile-v3.css';

type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;

interface MobileStudyPanelProps {
  workspace: StudyWorkspaceState;
}

export function MobileStudyPanel({ workspace }: MobileStudyPanelProps) {
  const { location } = useReader();
  const passageLabel = formatReaderLocation(location);
  const tabMeta = STUDY_WORKSPACE_TABS.find((t) => t.id === workspace.activeTab);

  return (
    <div className="mobile-v3-study">
      <header className="mobile-v3-study__header">
        <div className="mobile-v3-study__heading">
          <h2 className="mobile-v3-study__title">{tabMeta?.label ?? 'Study'}</h2>
          <p className="mobile-v3-study__context">Passage: {passageLabel}</p>
        </div>
      </header>
      <div className="mobile-v3-study__body study-workspace study-workspace--mobile">
        <StudyWorkspaceBody workspace={workspace} passageLabel={passageLabel} />
      </div>
    </div>
  );
}
