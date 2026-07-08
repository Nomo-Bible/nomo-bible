import { usePointerDragResize } from '@/hooks/usePointerDragResize';
import './WorkspaceResizeHandle.css';

interface PanelResizeHandleProps {
  axis: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  label: string;
  className?: string;
}

export function PanelResizeHandle({
  axis,
  onResize,
  label,
  className = '',
}: PanelResizeHandleProps) {
  const { onPointerDown } = usePointerDragResize({
    axis,
    onResize,
  });

  return (
    <div
      className={`${
        axis === 'horizontal'
          ? 'workspace-resize-handle workspace-resize-handle--horizontal'
          : 'workspace-resize-handle workspace-resize-handle--vertical'
      } ${className}`.trim()}
      role="separator"
      aria-orientation={axis === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-label={label}
      onPointerDown={onPointerDown}
    />
  );
}
