import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, Maximize2 } from 'lucide-react';
import { useReader } from '@/context/ReaderContext';
import type { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { formatReaderLocation } from '@/types/bible';
import { STUDY_WORKSPACE_TABS } from '@/types/studyWorkspace';
import { getHowToStudyMobileSection } from '@/data/study/howToStudyMobileSections';
import { StudyWorkspaceBody } from '@/components/workspace/StudyWorkspaceBody';
import '@/components/workspace/HowToStudyMobilePanel.css';
import './mobile-v3.css';

type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;

interface MobileStudyPanelProps {
  workspace: StudyWorkspaceState;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export function MobileStudyPanel({
  workspace,
  expanded,
  onExpand,
  onCollapse,
}: MobileStudyPanelProps) {
  const { location } = useReader();
  const passageLabel = formatReaderLocation(location);
  const tabMeta = STUDY_WORKSPACE_TABS.find((t) => t.id === workspace.activeTab);
  const toolLabel = tabMeta?.label ?? 'Study';
  const [howToStudySectionId, setHowToStudySectionId] = useState<string | null>(null);

  useEffect(() => {
    if (workspace.activeTab !== 'how-to-study') {
      setHowToStudySectionId(null);
    }
  }, [workspace.activeTab]);

  const readingSection = howToStudySectionId
    ? getHowToStudyMobileSection(howToStudySectionId)
    : undefined;

  return (
    <div className={expanded ? 'mobile-v3-study mobile-v3-study--expanded' : 'mobile-v3-study'}>
      <header className="mobile-v3-study__header">
        {expanded ? (
          <button
            type="button"
            className="mobile-v3-study__collapse-btn"
            onClick={onCollapse}
            aria-label={`Back to Scripture layout from ${toolLabel}`}
          >
            <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
            Back to Scripture
          </button>
        ) : null}

        <div className="mobile-v3-study__heading">
          <h2 className="mobile-v3-study__title">{toolLabel}</h2>
          <p className="mobile-v3-study__context">Passage: {passageLabel}</p>
        </div>

        {!expanded ? (
          <button
            type="button"
            className="mobile-v3-study__expand-btn"
            onClick={onExpand}
            aria-label={`Open ${toolLabel} full screen`}
          >
            <Maximize2 size={16} strokeWidth={2} aria-hidden="true" />
            Full Screen
          </button>
        ) : null}
      </header>

      {workspace.activeTab === 'how-to-study' && readingSection ? (
        <div className="how-to-study-mobile__toolbar how-to-study-mobile__toolbar--docked">
          <button
            type="button"
            className="how-to-study-mobile__back"
            onClick={() => setHowToStudySectionId(null)}
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back to Index
          </button>
          <p className="how-to-study-mobile__reading-label">{readingSection.label}</p>
        </div>
      ) : null}

      <div className="mobile-v3-study__body study-workspace study-workspace--mobile">
        <StudyWorkspaceBody
          workspace={workspace}
          passageLabel={passageLabel}
          howToStudySectionId={howToStudySectionId}
          onHowToStudySectionChange={setHowToStudySectionId}
        />
      </div>
    </div>
  );
}
