import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PanelResizeHandle } from './PanelResizeHandle';
import './WorkspaceResizeHandle.css';

const STORAGE_PREFIX = 'nomomartyria-panel-height-v1';

interface VerticallyResizableProps {
  children: ReactNode;
  storageKey: string;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
  className?: string;
}

function loadHeight(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!raw) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function VerticallyResizable({
  children,
  storageKey,
  minHeight = 192,
  maxHeight = 720,
  defaultHeight = 320,
  className = '',
}: VerticallyResizableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [height, setHeight] = useState(() =>
    loadHeight(storageKey, defaultHeight),
  );

  useEffect(() => {
    if (isMobile) return;
    localStorage.setItem(`${STORAGE_PREFIX}:${storageKey}`, String(height));
  }, [height, isMobile, storageKey]);

  const clampedHeight = useMemo(
    () => Math.min(maxHeight, Math.max(minHeight, height)),
    [height, maxHeight, minHeight],
  );

  if (isMobile) {
    return (
      <div className={`vertically-resizable vertically-resizable--auto ${className}`.trim()}>
        <div className="vertically-resizable__content">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`vertically-resizable ${className}`.trim()}
      style={{ height: clampedHeight }}
    >
      <div className="vertically-resizable__content">{children}</div>
      <PanelResizeHandle
        axis="vertical"
        label="Resize panel height"
        onResize={(delta) => {
          setHeight((current) =>
            Math.min(maxHeight, Math.max(minHeight, current + delta)),
          );
        }}
      />
    </div>
  );
}
