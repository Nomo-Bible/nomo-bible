import {
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
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
    <div className="study-toolbar nm-toolbar" role="toolbar" aria-label="Study workspace tools">
      {showNoteActions && (
        <>
          <button
            type="button"
            className="study-toolbar__btn nm-btn nm-btn--primary nm-btn--toolbar"
            onClick={onNewNote}
            title="Create a new study note"
          >
            <Plus className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
            New Note
          </button>
          <button
            type="button"
            className="study-toolbar__btn nm-btn nm-btn--toolbar"
            onClick={onSave}
            disabled={!canSave}
            title="Save note"
          >
            <Save className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
            Save
          </button>
          <button
            type="button"
            className="study-toolbar__btn nm-btn nm-btn--toolbar"
            onClick={onEdit}
            disabled={!canEdit}
            title="Edit selected note"
          >
            <Pencil className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
            Edit
          </button>
          <button
            type="button"
            className="study-toolbar__btn nm-btn nm-btn--toolbar nm-btn--danger"
            onClick={onDelete}
            disabled={!canDelete}
            title="Delete selected note"
          >
            <Trash2 className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
            Delete
          </button>
          {canCancel && (
            <button
              type="button"
              className="study-toolbar__btn nm-btn nm-btn--toolbar"
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
        className="study-toolbar__btn nm-btn nm-btn--toolbar"
        onClick={onRefresh}
        title="Refresh workspace data"
      >
        <RefreshCw className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
        Refresh
      </button>
      <button
        type="button"
        className="study-toolbar__btn study-toolbar__btn--more nm-btn nm-btn--ghost nm-btn--toolbar"
        disabled
        title="More options (coming soon)"
      >
        <MoreHorizontal className="study-toolbar__icon nm-btn__icon" aria-hidden="true" size={14} strokeWidth={2} />
        More
      </button>
    </div>
  );
}
