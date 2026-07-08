import { useWorkspaceResize } from '@/context/WorkspaceResizeContext';import { usePointerDragResize } from '@/hooks/usePointerDragResize';
import './WorkspaceResizeHandle.css';

interface WorkspaceResizeHandleProps {
  axis: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  label: string;
  className?: string;
}

export function WorkspaceResizeHandle({
  axis,
  onResize,
  label,
  className = '',
}: WorkspaceResizeHandleProps) {
  const { isResizable } = useWorkspaceResize();
  const { onPointerDown } = usePointerDragResize({
    axis,
    enabled: isResizable,
    onResize,
  });

  if (!isResizable) return null;

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
