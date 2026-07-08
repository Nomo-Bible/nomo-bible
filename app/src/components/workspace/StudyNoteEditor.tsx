import type { StudyNoteDraft } from '@/types/study';
import { RichTextNoteEditor } from './RichTextNoteEditor';
import './StudyNoteEditor.css';

interface StudyNoteEditorProps {
  draft: StudyNoteDraft;
  mode: 'create' | 'edit';
  onChange: (field: keyof StudyNoteDraft, value: string) => void;
  remountKey?: string;
}

export function StudyNoteEditor({ draft, mode, onChange, remountKey }: StudyNoteEditorProps) {
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
        <span className="study-note-editor__label" id="study-note-body-label">
          Body
        </span>
        <RichTextNoteEditor
          key={remountKey}
          remountKey={remountKey ?? mode}
          value={draft.body}
          onChange={(html) => onChange('body', html)}
          ariaLabel="Study note body"
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
