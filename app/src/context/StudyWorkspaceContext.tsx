import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudyWorkspace } from '@/hooks/useStudyWorkspace';
import { KJV_WORD_GUIDE_INSERT_EVENT } from '@/services/kjvWordGuideService';
import {
  SCRIPTURE_INSERT_EVENT,
  SCRIPTURE_STUDY_TAB_EVENT,
} from '@/types/scriptureInteraction';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';

type StudyWorkspaceState = ReturnType<typeof useStudyWorkspace>;

interface StudyWorkspaceContextValue extends StudyWorkspaceState {
  studyPanelOpen: boolean;
  openStudyPanel: () => void;
  closeStudyPanel: () => void;
  selectStudyTab: (tabId: StudyWorkspaceTabId) => void;
  openStudyTab: (tabId: StudyWorkspaceTabId) => void;
}

const StudyWorkspaceContext = createContext<StudyWorkspaceContextValue | null>(null);

export function StudyWorkspaceProvider({ children }: { children: ReactNode }) {
  const workspace = useStudyWorkspace();
  const [searchParams] = useSearchParams();
  const hasDeepLink =
    Boolean(searchParams.get('tab')) || Boolean(searchParams.get('note'));
  const [studyPanelOpen, setStudyPanelOpen] = useState(hasDeepLink);

  useEffect(() => {
    if (hasDeepLink) {
      setStudyPanelOpen(true);
    }
  }, [hasDeepLink]);

  const openStudyPanel = useCallback(() => {
    setStudyPanelOpen(true);
  }, []);

  const closeStudyPanel = useCallback(() => {
    setStudyPanelOpen(false);
  }, []);

  const selectStudyTab = useCallback(
    (tabId: StudyWorkspaceTabId) => {
      if (studyPanelOpen && workspace.activeTab === tabId) {
        setStudyPanelOpen(false);
        return;
      }
      workspace.setActiveTab(tabId);
      setStudyPanelOpen(true);
    },
    [studyPanelOpen, workspace.activeTab, workspace.setActiveTab],
  );

  const openStudyTab = useCallback(
    (tabId: StudyWorkspaceTabId) => {
      workspace.setActiveTab(tabId);
      setStudyPanelOpen(true);
    },
    [workspace.setActiveTab],
  );

  useEffect(() => {
    const openOnStudyRequest = () => {
      setStudyPanelOpen(true);
    };

    window.addEventListener(SCRIPTURE_STUDY_TAB_EVENT, openOnStudyRequest);
    window.addEventListener(SCRIPTURE_INSERT_EVENT, openOnStudyRequest);
    window.addEventListener(KJV_WORD_GUIDE_INSERT_EVENT, openOnStudyRequest);

    return () => {
      window.removeEventListener(SCRIPTURE_STUDY_TAB_EVENT, openOnStudyRequest);
      window.removeEventListener(SCRIPTURE_INSERT_EVENT, openOnStudyRequest);
      window.removeEventListener(KJV_WORD_GUIDE_INSERT_EVENT, openOnStudyRequest);
    };
  }, []);

  const value = useMemo(
    () => ({
      ...workspace,
      studyPanelOpen,
      openStudyPanel,
      closeStudyPanel,
      selectStudyTab,
      openStudyTab,
    }),
    [
      closeStudyPanel,
      openStudyPanel,
      openStudyTab,
      selectStudyTab,
      studyPanelOpen,
      workspace,
    ],
  );

  return (
    <StudyWorkspaceContext.Provider value={value}>
      {children}
    </StudyWorkspaceContext.Provider>
  );
}

export function useStudyWorkspaceContext() {
  const context = useContext(StudyWorkspaceContext);
  if (!context) {
    throw new Error(
      'useStudyWorkspaceContext must be used within StudyWorkspaceProvider',
    );
  }
  return context;
}
