import { useState } from 'react';
import { BibleSearch } from '@/components/layout/BibleSearch';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { useResizableSplit } from '@/hooks/useResizableSplit';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { MobileBibleReaderShell } from './MobileBibleReaderShell';
import { MobileBottomNav, MobileMoreSheet, type MobileBottomNavId } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileReaderHeader } from './MobileReaderHeader';
import { MobileSiteNav } from './MobileSiteNav';
import { MobileStudyPanel } from './MobileStudyPanel';
import { MobileWorkspaceTabs } from './MobileWorkspaceTabs';
import { ResizableSplitPane } from './ResizableSplitPane';
import './mobile-v3.css';
import './ResizableSplitPane.css';

export function MobileScriptureWorkspace() {
  const workspace = useStudyWorkspace();
  const { workspaceRatio, setWorkspaceRatio } = useResizableSplit();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [bottomNav, setBottomNav] = useState<MobileBottomNavId>('notes');

  const handleBottomNav = (id: MobileBottomNavId) => {
    setBottomNav(id);
    if (id === 'bible') {
      setWorkspaceRatio(0.32);
      return;
    }
    if (id === 'search') {
      document.getElementById('bible-search-input')?.focus();
      return;
    }
    if (id === 'notes') {
      workspace.setActiveTab('study-notes');
      setWorkspaceRatio(0.58);
      return;
    }
    if (id === 'bookmarks') {
      workspace.setActiveTab('cross-references');
      setWorkspaceRatio(0.58);
      return;
    }
    if (id === 'more') {
      setMoreOpen(true);
    }
  };

  const handleMoreTab = (tabId: StudyWorkspaceTabId) => {
    workspace.setActiveTab(tabId);
    setWorkspaceRatio(0.58);
    setBottomNav('more');
  };

  return (
    <div className="mobile-v3">
      <MobileReaderHeader onOpenMenu={() => setDrawerOpen(true)} />

      <div className="mobile-v3__search">
        <BibleSearch />
      </div>

      <MobileSiteNav />

      <div className="mobile-v3__workspace">
        <ResizableSplitPane
          workspaceRatio={workspaceRatio}
          onRatioChange={setWorkspaceRatio}
          top={
            <>
              <MobileWorkspaceTabs
                activeTab={workspace.activeTab}
                onTabChange={(tab) => {
                  workspace.setActiveTab(tab);
                  setBottomNav(
                    tab === 'study-notes'
                      ? 'notes'
                      : tab === 'cross-references'
                        ? 'bookmarks'
                        : 'more',
                  );
                }}
              />
              <div className="mobile-split__workspace-scroll">
                <MobileStudyPanel workspace={workspace} />
              </div>
            </>
          }
          bottom={<MobileBibleReaderShell />}
        />
      </div>

      <MobileBottomNav active={bottomNav} onSelect={handleBottomNav} />

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onSelectTab={handleMoreTab}
      />
    </div>
  );
}
