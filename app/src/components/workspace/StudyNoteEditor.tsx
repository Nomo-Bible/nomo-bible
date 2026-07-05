import type { StudyNoteDraft } from '@/types/study';
import './StudyNoteEditor.css';

interface StudyNoteEditorProps {
  draft: StudyNoteDraft;
  mode: 'create' | 'edit';
  onChange: (field: keyof StudyNoteDraft, value: string) => void;
}

export function StudyNoteEditor({ draft, mode, onChange }: StudyNoteEditorProps) {
  return (
    <form
      className="study-note-editor"
      aria-label={mode === 'create' ? 'Create study note' : 'Edit study note'}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="study-note-editor__field">
        <label htmlFor="study-note-title" className="study-note-editor__label">
          Title
        </label>
        <input
          id="study-note-title"
          type="text"
          className="study-note-editor__input"
          value={draft.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Note title"
          maxLength={200}
        />
      </div>

      <div className="study-note-editor__field">
        <label htmlFor="study-note-body" className="study-note-editor__label">
          Body
        </label>
        <textarea
          id="study-note-body"
          className="study-note-editor__textarea"
          value={draft.body}
          onChange={(e) => onChange('body', e.target.value)}
          placeholder="Write your study notes here…"
          rows={8}
        />
      </div>

      <div className="study-note-editor__field">
        <label htmlFor="study-note-tags" className="study-note-editor__label">
          Tags
        </label>
        <input
          id="study-note-tags"
          type="text"
          className="study-note-editor__input"
          value={draft.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          placeholder="creation, ex nihilo, theology"
        />
        <span className="study-note-editor__hint">Separate tags with commas</span>
      </div>
    </form>
  );
}
