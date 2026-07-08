import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  READING_FOCUS_PANEL,
  type ReadingFocusId,
  type WorkspacePanelId,
} from '@/types/workspaceExpand';

interface WorkspaceExpandContextValue {
  expandedPanel: WorkspacePanelId | null;
  readingFocus: ReadingFocusId | null;
  expandPanel: (panelId: WorkspacePanelId) => void;
  expandReading: (focusId: ReadingFocusId) => void;
  collapsePanel: () => void;
  togglePanel: (panelId: WorkspacePanelId, readingFocusId?: ReadingFocusId) => void;
  isExpanded: (panelId: WorkspacePanelId) => boolean;
  isReadingFocus: (focusId: ReadingFocusId) => boolean;
}

const WorkspaceExpandContext = createContext<WorkspaceExpandContextValue | null>(null);

export function WorkspaceExpandProvider({ children }: { children: ReactNode }) {
  const [expandedPanel, setExpandedPanel] = useState<WorkspacePanelId | null>(null);
  const [readingFocus, setReadingFocus] = useState<ReadingFocusId | null>(null);

  const expandPanel = useCallback((panelId: WorkspacePanelId) => {
    setExpandedPanel(panelId);
  }, []);

  const expandReading = useCallback((focusId: ReadingFocusId) => {
    setReadingFocus(focusId);
    setExpandedPanel(READING_FOCUS_PANEL[focusId]);
  }, []);

  const collapsePanel = useCallback(() => {
    setExpandedPanel(null);
    setReadingFocus(null);
  }, []);

  const togglePanel = useCallback(
    (panelId: WorkspacePanelId, readingFocusId?: ReadingFocusId) => {
      setExpandedPanel((current) => {
        if (current === panelId) {
          setReadingFocus(null);
          return null;
        }
        if (readingFocusId) {
          setReadingFocus(readingFocusId);
        } else {
          setReadingFocus(null);
        }
        return panelId;
      });
    },
    [],
  );

  const isExpanded = useCallback(
    (panelId: WorkspacePanelId) => expandedPanel === panelId,
    [expandedPanel],
  );

  const isReadingFocus = useCallback(
    (focusId: ReadingFocusId) => readingFocus === focusId,
    [readingFocus],
  );

  useEffect(() => {
    if (!expandedPanel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedPanel(null);
        setReadingFocus(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expandedPanel]);

  const value = useMemo(
    () => ({
      expandedPanel,
      readingFocus,
      expandPanel,
      expandReading,
      collapsePanel,
      togglePanel,
      isExpanded,
      isReadingFocus,
    }),
    [
      collapsePanel,
      expandPanel,
      expandReading,
      expandedPanel,
      isExpanded,
      isReadingFocus,
      readingFocus,
      togglePanel,
    ],
  );

  return (
    <WorkspaceExpandContext.Provider value={value}>{children}</WorkspaceExpandContext.Provider>
  );
}

export function useWorkspaceExpand() {
  const context = useContext(WorkspaceExpandContext);
  if (!context) {
    throw new Error('useWorkspaceExpand must be used within WorkspaceExpandProvider');
  }
  return context;
}
