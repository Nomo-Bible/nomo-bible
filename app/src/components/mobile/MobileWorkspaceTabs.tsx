import { useEffect, useRef, useState } from 'react';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { STUDY_WORKSPACE_TABS } from '@/types/studyWorkspace';
import { STUDY_TAB_ICONS } from '@/components/ui/studyTabIcons';
import './mobile-v3.css';

interface MobileWorkspaceTabsProps {
  activeTab: StudyWorkspaceTabId;
  onTabChange: (tabId: StudyWorkspaceTabId) => void;
}

export function MobileWorkspaceTabs({ activeTab, onTabChange }: MobileWorkspaceTabsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [activeTab]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateHint = () => {
      const hasOverflow = scroller.scrollWidth > scroller.clientWidth + 8;
      const atEnd =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;
      setShowScrollHint(hasOverflow && !atEnd);
    };

    updateHint();
    scroller.addEventListener('scroll', updateHint, { passive: true });
    window.addEventListener('resize', updateHint);

    return () => {
      scroller.removeEventListener('scroll', updateHint);
      window.removeEventListener('resize', updateHint);
    };
  }, [activeTab]);

  return (
    <div
      className={
        showScrollHint
          ? 'mobile-v3-tabs-wrap mobile-v3-tabs-wrap--more'
          : 'mobile-v3-tabs-wrap'
      }
    >
      <div
        ref={scrollerRef}
        className="mobile-v3-tabs"
        role="tablist"
        aria-label="Study workspace tools"
      >
        {STUDY_WORKSPACE_TABS.map((tab) => {
          const Icon = STUDY_TAB_ICONS[tab.id];
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              ref={isActive ? activeRef : undefined}
              id={`mobile-study-tab-${tab.id}`}
              className={
                isActive
                  ? 'mobile-v3-tabs__card mobile-v3-tabs__card--active'
                  : 'mobile-v3-tabs__card'
              }
              aria-selected={isActive}
              aria-controls={`study-panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="mobile-v3-tabs__icon" aria-hidden="true" size={20} strokeWidth={1.75} />
              <span className="mobile-v3-tabs__label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mobile-v3-tabs__hint" aria-hidden="true">
        Swipe for more study tools
      </p>
    </div>
  );
}
