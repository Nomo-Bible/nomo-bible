import { Maximize2 } from 'lucide-react';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { STUDY_WORKSPACE_TABS } from '@/types/studyWorkspace';
import type { ReadingFocusId } from '@/types/workspaceExpand';
import { STUDY_TAB_ICONS, STUDY_TAB_ICON_SIZE } from '@/components/ui/studyTabIcons';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import './StudyWorkspaceTabs.css';

const TAB_READING_FOCUS: Partial<Record<StudyWorkspaceTabId, ReadingFocusId>> = {
  'study-notes': 'study-notes',
  'how-to-study': 'how-to-study',
  'study-resources': 'study-resources',
  concordance: 'concordance',
  'cross-references': 'cross-references',
  topics: 'topics',
  charts: 'charts',
};

interface StudyWorkspaceTabsProps {
  activeTab: StudyWorkspaceTabId;
  onTabChange: (tabId: StudyWorkspaceTabId) => void;
}

export function StudyWorkspaceTabs({
  activeTab,
  onTabChange,
}: StudyWorkspaceTabsProps) {
  const { expandReading } = useWorkspaceExpand();

  const handleExpandTab = (tabId: StudyWorkspaceTabId) => {
    onTabChange(tabId);
    const focusId = TAB_READING_FOCUS[tabId] ?? 'study-notes';
    expandReading(focusId);
  };

  return (
    <div
      className="study-tabs"
      role="tablist"
      aria-label="Study workspace sections"
    >
      {STUDY_WORKSPACE_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = STUDY_TAB_ICONS[tab.id];
        return (
          <div key={tab.id} className="study-tabs__item">
            <button
              type="button"
              role="tab"
              id={`study-tab-${tab.id}`}
              className={
                isActive ? 'study-tabs__tab study-tabs__tab--active' : 'study-tabs__tab'
              }
              aria-selected={isActive}
              aria-controls={`study-panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="study-tabs__icon" aria-hidden="true" size={STUDY_TAB_ICON_SIZE} strokeWidth={2} />
              <span className="study-tabs__label">{tab.label}</span>
            </button>
            <button
              type="button"
              className="study-tabs__expand-btn"
              onClick={() => handleExpandTab(tab.id)}
              aria-label={`Open and expand ${tab.label}`}
              title={`Expand ${tab.label}`}
            >
              <Maximize2 size={12} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
