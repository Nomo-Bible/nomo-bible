import type { ReactNode } from 'react';
import { ReadingPanelExpandButton } from './ReadingPanelExpandButton';
import type { ReadingFocusId } from '@/types/workspaceExpand';
import './ReadingPanelExpandButton.css';

interface ReadingPanelChromeProps {
  focusId: ReadingFocusId;
  title: string;
  actions?: ReactNode;
}

export function ReadingPanelChrome({
  focusId,
  title,
  actions,
}: ReadingPanelChromeProps) {
  return (
    <header className="reading-panel-chrome">
      <h3 className="reading-panel-chrome__title">{title}</h3>
      <div className="reading-panel-chrome__actions">
        {actions}
        <ReadingPanelExpandButton focusId={focusId} label={title} compact />
      </div>
    </header>
  );
}
