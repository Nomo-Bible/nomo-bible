import { Maximize2, Minimize2 } from 'lucide-react';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import type { WorkspacePanelId } from '@/types/workspaceExpand';
import './WorkspaceExpandButton.css';

interface WorkspaceExpandButtonProps {
  panelId: WorkspacePanelId;
  label: string;
  compact?: boolean;
}

export function WorkspaceExpandButton({
  panelId,
  label,
  compact = false,
}: WorkspaceExpandButtonProps) {
  const { isExpanded, togglePanel } = useWorkspaceExpand();
  const expanded = isExpanded(panelId);

  return (
    <button
      type="button"
      className={
        compact
          ? 'workspace-expand-btn workspace-expand-btn--compact'
          : 'workspace-expand-btn'
      }
      onClick={() => togglePanel(panelId)}
      aria-pressed={expanded}
      aria-label={expanded ? `Restore layout from ${label}` : `Expand ${label} to full workspace`}
      title={expanded ? 'Restore layout' : `Expand ${label}`}
    >
      {expanded ? (
        <Minimize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Maximize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      )}
      {!compact && (
        <span className="workspace-expand-btn__label">
          {expanded ? 'Restore layout' : 'Expand'}
        </span>
      )}
    </button>
  );
}
