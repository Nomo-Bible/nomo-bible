import { useCallback, useRef, type ReactNode } from 'react';
import './ResizableSplitPane.css';

interface ResizableSplitPaneProps {
  workspaceRatio: number;
  onRatioChange: (ratio: number) => void;
  top: ReactNode;
  bottom: ReactNode;
}

export function ResizableSplitPane({
  workspaceRatio,
  onRatioChange,
  top,
  bottom,
}: ResizableSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateRatioFromPointer = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const next = (clientY - rect.top) / rect.height;
      onRatioChange(next);
    },
    [onRatioChange],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateRatioFromPointer(event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const workspacePercent = `${workspaceRatio * 100}%`;

  return (
    <div ref={containerRef} className="mobile-split">
      <div className="mobile-split__workspace" style={{ flexBasis: workspacePercent }}>
        {top}
      </div>
      <div
        className="mobile-split__handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize workspace and Bible reader"
        aria-valuenow={Math.round(workspaceRatio * 100)}
        aria-valuemin={28}
        aria-valuemax={72}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="mobile-split__handle-grip" aria-hidden="true" />
      </div>
      <div className="mobile-split__reader">{bottom}</div>
    </div>
  );
}
