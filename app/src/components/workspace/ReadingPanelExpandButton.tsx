import { Maximize2, Minimize2 } from 'lucide-react';
import { useStudyWorkspaceContext } from '@/context/StudyWorkspaceContext';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import type { ReadingFocusId } from '@/types/workspaceExpand';
import { READING_FOCUS_PANEL } from '@/types/workspaceExpand';
import './ReadingPanelExpandButton.css';

interface ReadingPanelExpandButtonProps {
  focusId: ReadingFocusId;
  label: string;
  compact?: boolean;
  restoreLabel?: string;
}

export function ReadingPanelExpandButton({
  focusId,
  label,
  compact = false,
  restoreLabel = 'Back',
}: ReadingPanelExpandButtonProps) {
  const { isReadingFocus, expandReading, collapsePanel } = useWorkspaceExpand();
  const { closeStudyPanel, openStudyPanel } = useStudyWorkspaceContext();
  const expanded = isReadingFocus(focusId);
  const focusesStudy = READING_FOCUS_PANEL[focusId] === 'study';

  return (
    <button
      type="button"
      className={
        compact
          ? 'reading-panel-expand-btn reading-panel-expand-btn--compact'
          : 'reading-panel-expand-btn'
      }
      onClick={() => {
        if (expanded) {
          collapsePanel();
          if (focusesStudy) {
            closeStudyPanel();
          }
          return;
        }
        if (focusesStudy) {
          openStudyPanel();
        }
        expandReading(focusId);
      }}
      aria-pressed={expanded}
      aria-label={
        expanded ? `${restoreLabel} from ${label}` : `Expand ${label} to full workspace`
      }
      title={expanded ? restoreLabel : `Expand ${label}`}
    >
      {expanded ? (
        <Minimize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Maximize2 size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      )}
      {!compact && (
        <span className="reading-panel-expand-btn__label">
          {expanded ? restoreLabel : 'Expand'}
        </span>
      )}
    </button>
  );
}
