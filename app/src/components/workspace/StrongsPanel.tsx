import { EmptyState } from './EmptyState';
import './StudyStatusPanel.css';

export function StrongsPanel() {
  return (
    <div className="study-status-panel">
      <EmptyState
        icon="🔤"
        title="Strong's Integration"
        message="Strong's data has not yet been installed. This section will display original Hebrew and Greek words, definitions, usage, and concordance information."
      />
      <div className="study-status-panel__status">
        <span className="study-status-panel__status-label">Status</span>
        <span className="study-status-panel__status-value">
          Awaiting Phase 2D — Original Languages &amp; Concordance Engine
        </span>
      </div>
    </div>
  );
}
