import './StudyToolbar.css';

interface StudyToolbarProps {
  showNoteActions: boolean;
  canSave: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCancel: boolean;
  onNewNote: () => void;
  onSave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onCancel: () => void;
}

export function StudyToolbar({
  showNoteActions,
  canSave,
  canEdit,
  canDelete,
  canCancel,
  onNewNote,
  onSave,
  onEdit,
  onDelete,
  onRefresh,
  onCancel,
}: StudyToolbarProps) {
  return (
    <div className="study-toolbar" role="toolbar" aria-label="Study workspace tools">
      {showNoteActions && (
        <>
          <button
            type="button"
            className="study-toolbar__btn study-toolbar__btn--primary"
            onClick={onNewNote}
            title="Create a new study note"
          >
            <span className="study-toolbar__icon" aria-hidden="true">+</span>
            New Note
          </button>
          <button
            type="button"
            className="study-toolbar__btn"
            onClick={onSave}
            disabled={!canSave}
            title="Save note"
          >
            <span className="study-toolbar__icon" aria-hidden="true">💾</span>
            Save
          </button>
          <button
            type="button"
            className="study-toolbar__btn"
            onClick={onEdit}
            disabled={!canEdit}
            title="Edit selected note"
          >
            <span className="study-toolbar__icon" aria-hidden="true">✎</span>
            Edit
          </button>
          <button
            type="button"
            className="study-toolbar__btn study-toolbar__btn--danger"
            onClick={onDelete}
            disabled={!canDelete}
            title="Delete selected note"
          >
            <span className="study-toolbar__icon" aria-hidden="true">🗑</span>
            Delete
          </button>
          {canCancel && (
            <button
              type="button"
              className="study-toolbar__btn"
              onClick={onCancel}
              title="Cancel editing"
            >
              Cancel
            </button>
          )}
        </>
      )}
      <button
        type="button"
        className="study-toolbar__btn"
        onClick={onRefresh}
        title="Refresh workspace data"
      >
        <span className="study-toolbar__icon" aria-hidden="true">↻</span>
        Refresh
      </button>
      <button
        type="button"
        className="study-toolbar__btn study-toolbar__btn--more"
        disabled
        title="More options (coming soon)"
      >
        <span className="study-toolbar__icon" aria-hidden="true">⋯</span>
        More
      </button>
    </div>
  );
}
