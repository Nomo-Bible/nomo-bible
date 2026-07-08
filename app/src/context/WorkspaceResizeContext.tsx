import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const STORAGE_KEY = 'nomomartyria-workspace-sizes-v1';

const LIMITS = {
  navMin: 96,
  navMax: 220,
  studyMin: 280,
  studyMax: 720,
  scriptureMin: 280,
  studyRowMin: 200,
  studyRowMax: 720,
} as const;

interface WorkspaceSizes {
  navWidth: number;
  studyWidth: number;
  studyRowHeight: number;
}

const DEFAULTS: WorkspaceSizes = {
  navWidth: 140,
  studyWidth: 544,
  studyRowHeight: 360,
};

function loadSizes(): WorkspaceSizes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<WorkspaceSizes>;
    return {
      navWidth: clamp(parsed.navWidth ?? DEFAULTS.navWidth, LIMITS.navMin, LIMITS.navMax),
      studyWidth: clamp(parsed.studyWidth ?? DEFAULTS.studyWidth, LIMITS.studyMin, LIMITS.studyMax),
      studyRowHeight: clamp(
        parsed.studyRowHeight ?? DEFAULTS.studyRowHeight,
        LIMITS.studyRowMin,
        LIMITS.studyRowMax,
      ),
    };
  } catch {
    return DEFAULTS;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface WorkspaceResizeContextValue {
  sizes: WorkspaceSizes;
  resizeNavBy: (delta: number) => void;
  resizeStudyBy: (delta: number) => void;
  resizeStudyRowBy: (delta: number) => void;
  style: CSSProperties;
  isResizable: boolean;
}

const WorkspaceResizeContext = createContext<WorkspaceResizeContextValue | null>(null);

export function WorkspaceResizeProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isStacked = useMediaQuery('(max-width: 1100px)');
  const [sizes, setSizes] = useState<WorkspaceSizes>(() => loadSizes());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
  }, [sizes]);

  const resizeNavBy = useCallback((delta: number) => {
    setSizes((current) => ({
      ...current,
      navWidth: clamp(current.navWidth + delta, LIMITS.navMin, LIMITS.navMax),
    }));
  }, []);

  const resizeStudyBy = useCallback((delta: number) => {
    setSizes((current) => ({
      ...current,
      studyWidth: clamp(current.studyWidth - delta, LIMITS.studyMin, LIMITS.studyMax),
    }));
  }, []);

  const resizeStudyRowBy = useCallback((delta: number) => {
    setSizes((current) => ({
      ...current,
      studyRowHeight: clamp(
        current.studyRowHeight + delta,
        LIMITS.studyRowMin,
        LIMITS.studyRowMax,
      ),
    }));
  }, []);

  const style = useMemo(
    () =>
      ({
        '--workspace-nav-width': `${sizes.navWidth}px`,
        '--workspace-study-width': `${sizes.studyWidth}px`,
        '--workspace-study-row-height': `${sizes.studyRowHeight}px`,
        '--workspace-scripture-min': `${LIMITS.scriptureMin}px`,
      }) as CSSProperties,
    [sizes],
  );

  const value = useMemo(
    () => ({
      sizes,
      resizeNavBy,
      resizeStudyBy,
      resizeStudyRowBy,
      style,
      isResizable: !isMobile,
    }),
    [isMobile, resizeNavBy, resizeStudyBy, resizeStudyRowBy, sizes, style],
  );

  void isStacked;

  return (
    <WorkspaceResizeContext.Provider value={value}>
      {children}
    </WorkspaceResizeContext.Provider>
  );
}

export function useWorkspaceResize() {
  const context = useContext(WorkspaceResizeContext);
  if (!context) {
    throw new Error('useWorkspaceResize must be used within WorkspaceResizeProvider');
  }
  return context;
}
