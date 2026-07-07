import { useState } from 'react';
import { BibleSearch } from '@/components/layout/BibleSearch';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import {
  MOBILE_SPLIT_STUDY,
  useResizableSplit,
} from '@/hooks/useResizableSplit';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { MobileBibleNavigator } from './MobileBibleNavigator';
import { MobileBibleReaderShell } from './MobileBibleReaderShell';
import { MobileBottomNav, MobileMoreSheet, type MobileBottomNavId } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileReaderHeader } from './MobileReaderHeader';
import { MobileStudyPanel } from './MobileStudyPanel';
import { MobileWorkspaceTabs } from './MobileWorkspaceTabs';
import { ResizableSplitPane } from './ResizableSplitPane';
import './mobile-v3.css';
import './ResizableSplitPane.css';

export function MobileScriptureWorkspace() {
  const workspace = useStudyWorkspace();
  const {
    workspaceRatio,
    setWorkspaceRatio,
    commitWorkspaceRatio,
    expandReadingView,
    restoreStudySplit,
    isReadingExpanded,
    minRatio,
    maxRatio,
  } = useResizableSplit();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [bottomNav, setBottomNav] = useState<MobileBottomNavId>('notes');

  const focusStudy = () => {
    commitWorkspaceRatio(MOBILE_SPLIT_STUDY);
  };

  const handleBottomNav = (id: MobileBottomNavId) => {
    setBottomNav(id);
    if (id === 'bible') {
      expandReadingView();
      setNavigatorOpen(true);
      return;
    }
    if (id === 'search') {
      document.getElementById('bible-search-input')?.focus();
      return;
    }
    if (id === 'notes') {
      workspace.setActiveTab('study-notes');
      focusStudy();
      return;
    }
    if (id === 'bookmarks') {
      workspace.setActiveTab('cross-references');
      focusStudy();
      return;
    }
    if (id === 'more') {
      setMoreOpen(true);
    }
  };

  const handleMoreTab = (tabId: StudyWorkspaceTabId) => {
    workspace.setActiveTab(tabId);
    focusStudy();
    setBottomNav('more');
  };

  const handleTabChange = (tab: StudyWorkspaceTabId) => {
    workspace.setActiveTab(tab);
    focusStudy();
    setBottomNav(
      tab === 'study-notes' ? 'notes' : tab === 'cross-references' ? 'bookmarks' : 'more',
    );
  };

  return (
    <div className="mobile-v3">
      <MobileReaderHeader onOpenMenu={() => setDrawerOpen(true)} />

      <div className="mobile-v3__search">
        <BibleSearch />
      </div>

      <div className="mobile-v3__dock">
        <ResizableSplitPane
          workspaceRatio={workspaceRatio}
          minRatio={minRatio}
          maxRatio={maxRatio}
          onRatioChange={setWorkspaceRatio}
          onRatioCommit={commitWorkspaceRatio}
          top={
            <>
              <MobileWorkspaceTabs
                activeTab={workspace.activeTab}
                onTabChange={handleTabChange}
              />
              <div className="mobile-split__workspace-scroll">
                <MobileStudyPanel workspace={workspace} />
              </div>
            </>
          }
          bottom={
            <MobileBibleReaderShell
              onOpenNavigator={() => setNavigatorOpen(true)}
              isReadingExpanded={isReadingExpanded}
              onExpandReading={expandReadingView}
              onRestoreSplit={restoreStudySplit}
            />
          }
        />
      </div>

      <MobileBottomNav active={bottomNav} onSelect={handleBottomNav} />

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onSelectTab={handleMoreTab}
      />

      <MobileBibleNavigator
        open={navigatorOpen}
        onClose={() => setNavigatorOpen(false)}
      />
    </div>
  );
}
