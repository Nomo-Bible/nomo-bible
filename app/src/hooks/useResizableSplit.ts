import { useCallback, useRef, useState } from 'react';

const STORAGE_KEY = 'nomomartyria-mobile-split-ratio-v2';

/** Workspace share of the dock — default 45% workspace / 55% Bible reader. */
export const MOBILE_SPLIT_DEFAULT = 0.45;

/** Reading-focused split — ~16% workspace / ~84% Bible reader. */
export const MOBILE_SPLIT_READING = 0.16;

/** Study-focused split when a workspace tool is selected. */
export const MOBILE_SPLIT_STUDY = 0.58;

/** Workspace ratio bounds (reader can reach ~84% at the low end). */
export const MOBILE_SPLIT_MIN = 0.12;
export const MOBILE_SPLIT_MAX = 0.78;

function clampRatio(ratio: number): number {
  return Math.min(MOBILE_SPLIT_MAX, Math.max(MOBILE_SPLIT_MIN, ratio));
}

function readStoredRatio(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOBILE_SPLIT_DEFAULT;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return MOBILE_SPLIT_DEFAULT;
    return clampRatio(value);
  } catch {
    return MOBILE_SPLIT_DEFAULT;
  }
}

/** Mobile dock split ratio; persisted when the user releases the divider. */
export function useResizableSplit() {
  const [workspaceRatio, setWorkspaceRatioState] = useState(readStoredRatio);
  const ratioBeforeReadingRef = useRef<number | null>(null);

  const isReadingExpanded =
    workspaceRatio <= MOBILE_SPLIT_READING + 0.025;

  const setWorkspaceRatio = useCallback((ratio: number) => {
    setWorkspaceRatioState(clampRatio(ratio));
  }, []);

  const commitWorkspaceRatio = useCallback((ratio: number) => {
    const clamped = clampRatio(ratio);
    setWorkspaceRatioState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const expandReadingView = useCallback(() => {
    ratioBeforeReadingRef.current = workspaceRatio;
    commitWorkspaceRatio(MOBILE_SPLIT_READING);
  }, [commitWorkspaceRatio, workspaceRatio]);

  const restoreStudySplit = useCallback(() => {
    const restore = ratioBeforeReadingRef.current ?? MOBILE_SPLIT_DEFAULT;
    ratioBeforeReadingRef.current = null;
    commitWorkspaceRatio(restore);
  }, [commitWorkspaceRatio]);

  return {
    workspaceRatio,
    setWorkspaceRatio,
    commitWorkspaceRatio,
    expandReadingView,
    restoreStudySplit,
    isReadingExpanded,
    minRatio: MOBILE_SPLIT_MIN,
    maxRatio: MOBILE_SPLIT_MAX,
  };
}
