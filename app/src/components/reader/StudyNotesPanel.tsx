import './StudyNotesPanel.css';

export function StudyNotesPanel() {
  return (
    <section className="study-notes-panel" aria-label="Study notes">
      <header className="panel-header">
        <h3>Study Notes</h3>
        <span className="panel-header__badge">Placeholder</span>
      </header>
      <div className="study-notes-panel__content">
        <p className="panel-placeholder">
          Verse-by-verse study notes will appear here, connected to the selected
          passage. Study notes are supplemental material and remain visually
          distinct from Scripture.
        </p>
      </div>
    </section>
  );
}
