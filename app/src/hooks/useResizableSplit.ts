import { useCallback, useState } from 'react';

const STORAGE_KEY = 'nomomartyria-mobile-split-ratio';
const DEFAULT_RATIO = 0.52;
const MIN_RATIO = 0.28;
const MAX_RATIO = 0.72;

function readStoredRatio(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RATIO;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return DEFAULT_RATIO;
    return Math.min(MAX_RATIO, Math.max(MIN_RATIO, value));
  } catch {
    return DEFAULT_RATIO;
  }
}

/** Top (workspace) fraction of the mobile split pane; persisted in localStorage. */
export function useResizableSplit() {
  const [workspaceRatio, setWorkspaceRatioState] = useState(readStoredRatio);

  const setWorkspaceRatio = useCallback((ratio: number) => {
    const clamped = Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
    setWorkspaceRatioState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  return { workspaceRatio, setWorkspaceRatio, minRatio: MIN_RATIO, maxRatio: MAX_RATIO };
}
