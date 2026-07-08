import { useCallback, useRef } from 'react';

interface UsePointerDragResizeOptions {
  axis: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  enabled?: boolean;
}

export function usePointerDragResize({
  axis,
  onResize,
  enabled = true,
}: UsePointerDragResizeOptions) {
  const draggingRef = useRef(false);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      event.preventDefault();
      draggingRef.current = true;

      const start = axis === 'horizontal' ? event.clientX : event.clientY;
      let last = start;
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);

      const handleMove = (moveEvent: PointerEvent) => {
        if (!draggingRef.current) return;
        const current =
          axis === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
        const delta = current - last;
        last = current;
        if (delta !== 0) onResize(delta);
      };

      const handleUp = (upEvent: PointerEvent) => {
        draggingRef.current = false;
        target.releasePointerCapture(upEvent.pointerId);
        target.removeEventListener('pointermove', handleMove);
        target.removeEventListener('pointerup', handleUp);
        target.removeEventListener('pointercancel', handleUp);
        document.body.classList.remove('workspace-resize-dragging');
      };

      document.body.classList.add('workspace-resize-dragging');
      target.addEventListener('pointermove', handleMove);
      target.addEventListener('pointerup', handleUp);
      target.addEventListener('pointercancel', handleUp);
    },
    [axis, enabled, onResize],
  );

  return { onPointerDown };
}
