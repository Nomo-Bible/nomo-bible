import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { WorkspacePanelId } from '@/types/workspaceExpand';

interface WorkspaceExpandContextValue {
  expandedPanel: WorkspacePanelId | null;
  expandPanel: (panelId: WorkspacePanelId) => void;
  collapsePanel: () => void;
  togglePanel: (panelId: WorkspacePanelId) => void;
  isExpanded: (panelId: WorkspacePanelId) => boolean;
}

const WorkspaceExpandContext = createContext<WorkspaceExpandContextValue | null>(null);

export function WorkspaceExpandProvider({ children }: { children: ReactNode }) {
  const [expandedPanel, setExpandedPanel] = useState<WorkspacePanelId | null>(null);

  const expandPanel = useCallback((panelId: WorkspacePanelId) => {
    setExpandedPanel(panelId);
  }, []);

  const collapsePanel = useCallback(() => {
    setExpandedPanel(null);
  }, []);

  const togglePanel = useCallback((panelId: WorkspacePanelId) => {
    setExpandedPanel((current) => (current === panelId ? null : panelId));
  }, []);

  const isExpanded = useCallback(
    (panelId: WorkspacePanelId) => expandedPanel === panelId,
    [expandedPanel],
  );

  useEffect(() => {
    if (!expandedPanel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedPanel(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expandedPanel]);

  const value = useMemo(
    () => ({
      expandedPanel,
      expandPanel,
      collapsePanel,
      togglePanel,
      isExpanded,
    }),
    [collapsePanel, expandPanel, expandedPanel, isExpanded, togglePanel],
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
