import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { STUDY_WORKSPACE_TABS } from '@/types/studyWorkspace';
import './StudyWorkspaceTabs.css';

interface StudyWorkspaceTabsProps {
  activeTab: StudyWorkspaceTabId;
  onTabChange: (tabId: StudyWorkspaceTabId) => void;
}

export function StudyWorkspaceTabs({
  activeTab,
  onTabChange,
}: StudyWorkspaceTabsProps) {
  return (
    <div
      className="study-tabs"
      role="tablist"
      aria-label="Study workspace sections"
    >
      {STUDY_WORKSPACE_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
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
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
