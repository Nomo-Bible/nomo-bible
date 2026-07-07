import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import './ResizableSplitPane.css';

const HANDLE_HEIGHT = 20;
const MIN_WORKSPACE_PX = 108;
const MIN_READER_PX = 120;

interface ResizableSplitPaneProps {
  workspaceRatio: number;
  minRatio: number;
  maxRatio: number;
  onRatioChange: (ratio: number) => void;
  onRatioCommit: (ratio: number) => void;
  top: ReactNode;
  bottom: ReactNode;
}

export function ResizableSplitPane({
  workspaceRatio,
  minRatio,
  maxRatio,
  onRatioChange,
  onRatioCommit,
  top,
  bottom,
}: ResizableSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const ratioRef = useRef(workspaceRatio);
  ratioRef.current = workspaceRatio;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height ?? 0;
      setContainerHeight(height);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const clampRatio = useCallback(
    (ratio: number) => {
      if (containerHeight <= HANDLE_HEIGHT + MIN_WORKSPACE_PX + MIN_READER_PX) {
        return boundRatio(ratio, minRatio, maxRatio);
      }

      const minByPixels = MIN_WORKSPACE_PX / containerHeight;
      const maxByPixels =
        (containerHeight - HANDLE_HEIGHT - MIN_READER_PX) / containerHeight;

      return boundRatio(
        ratio,
        Math.max(minRatio, minByPixels),
        Math.min(maxRatio, maxByPixels),
      );
    },
    [containerHeight, minRatio, maxRatio],
  );

  const workspaceHeight =
    containerHeight > 0
      ? Math.round(
          Math.min(
            containerHeight - HANDLE_HEIGHT - MIN_READER_PX,
            Math.max(MIN_WORKSPACE_PX, containerHeight * workspaceRatio),
          ),
        )
      : 0;

  const readerHeight =
    containerHeight > 0
      ? Math.max(MIN_READER_PX, containerHeight - HANDLE_HEIGHT - workspaceHeight)
      : 0;

  const updateFromPointer = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container || containerHeight <= 0) return;

      const rect = container.getBoundingClientRect();
      const nextRatio = clampRatio((clientY - rect.top) / containerHeight);
      onRatioChange(nextRatio);
    },
    [clampRatio, containerHeight, onRatioChange],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateFromPointer(event.clientY);
    };

    const endDrag = () => {
      setIsDragging(false);
      onRatioCommit(ratioRef.current);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [isDragging, onRatioCommit, updateFromPointer]);

  const onHandlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={
        isDragging ? 'mobile-split mobile-split--dragging' : 'mobile-split'
      }
    >
      <div
        className="mobile-split__workspace"
        style={workspaceHeight > 0 ? { height: workspaceHeight } : undefined}
      >
        {top}
      </div>

      <div
        className="mobile-split__handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize workspace and Bible reader"
        aria-valuenow={Math.round(workspaceRatio * 100)}
        aria-valuemin={Math.round(minRatio * 100)}
        aria-valuemax={Math.round(maxRatio * 100)}
        onPointerDown={onHandlePointerDown}
      >
        <span className="mobile-split__handle-grip" aria-hidden="true" />
      </div>

      <div
        className="mobile-split__reader"
        style={readerHeight > 0 ? { height: readerHeight } : undefined}
      >
        {bottom}
      </div>
    </div>
  );
}

function boundRatio(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
