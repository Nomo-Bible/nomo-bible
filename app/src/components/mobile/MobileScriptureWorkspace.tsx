import { useState } from 'react';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { MobileBibleNavigator } from './MobileBibleNavigator';
import { MobileBibleReaderShell } from './MobileBibleReaderShell';
import { MobileBottomNav, MobileMoreSheet, type MobileBottomNavId } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileReaderHeader } from './MobileReaderHeader';
import { MobileStudyPanel } from './MobileStudyPanel';
import { MobileWorkspaceTabs } from './MobileWorkspaceTabs';
import './mobile-v3.css';

export function MobileScriptureWorkspace() {
  const workspace = useStudyWorkspace();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [bottomNav, setBottomNav] = useState<MobileBottomNavId>('notes');
  const [studyExpanded, setStudyExpanded] = useState(false);
  const [bibleExpanded, setBibleExpanded] = useState(false);

  const handleBottomNav = (id: MobileBottomNavId) => {
    setBottomNav(id);
    if (id === 'bible') {
      setNavigatorOpen(true);
      document.querySelector('.mobile-stable__bible')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (id === 'search') {
      document.getElementById('bible-search-input')?.focus();
      return;
    }
    if (id === 'notes') {
      workspace.setActiveTab('study-notes');
      return;
    }
    if (id === 'bookmarks') {
      workspace.setActiveTab('cross-references');
      return;
    }
    if (id === 'more') {
      setMoreOpen(true);
    }
  };

  const handleMoreTab = (tabId: StudyWorkspaceTabId) => {
    workspace.setActiveTab(tabId);
    setBottomNav('more');
  };

  const handleTabChange = (tab: StudyWorkspaceTabId) => {
    workspace.setActiveTab(tab);
    setBottomNav(
      tab === 'study-notes' ? 'notes' : tab === 'cross-references' ? 'bookmarks' : 'more',
    );
  };

  const rootClassName = [
    'mobile-v3',
    'mobile-v3--stable',
    studyExpanded ? 'mobile-v3--study-expanded' : '',
    bibleExpanded ? 'mobile-v3--bible-expanded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <MobileReaderHeader onOpenMenu={() => setDrawerOpen(true)} />

      <section className="mobile-stable__bible" aria-label="Bible reader">
        <MobileBibleReaderShell
          onOpenNavigator={() => setNavigatorOpen(true)}
          onOpenKjvWordGuide={() => {
            workspace.setActiveTab('kjv-word-guide');
            setBibleExpanded(false);
            setBottomNav('more');
            document
              .querySelector('.mobile-stable__study')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          expanded={bibleExpanded}
          onExpand={() => {
            setBibleExpanded((current) => !current);
            if (!bibleExpanded) setStudyExpanded(false);
          }}
        />
      </section>

      <MobileWorkspaceTabs activeTab={workspace.activeTab} onTabChange={handleTabChange} />

      <section className="mobile-stable__study" aria-label="Study workspace">
        <MobileStudyPanel
          workspace={workspace}
          expanded={studyExpanded}
          onExpand={() => {
            setStudyExpanded(true);
            setBibleExpanded(false);
          }}
          onCollapse={() => setStudyExpanded(false)}
        />
      </section>

      {!studyExpanded && !bibleExpanded && (
        <MobileBottomNav active={bottomNav} onSelect={handleBottomNav} />
      )}

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
