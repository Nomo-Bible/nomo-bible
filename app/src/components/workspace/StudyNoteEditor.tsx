import type { StudyNoteDraft } from '@/types/study';
import { ReadingPanelChrome } from './ReadingPanelChrome';
import { RichTextNoteEditor } from './RichTextNoteEditor';
import { VerticallyResizable } from './VerticallyResizable';
import './StudyNoteEditor.css';

interface StudyNoteEditorProps {
  draft: StudyNoteDraft;
  mode: 'create' | 'edit';
  onChange: (field: keyof StudyNoteDraft, value: string) => void;
  remountKey?: string;
  savedNoteCount?: number;
  onViewNotesList?: () => void;
}

export function StudyNoteEditor({
  draft,
  mode,
  onChange,
  remountKey,
  savedNoteCount = 0,
  onViewNotesList,
}: StudyNoteEditorProps) {
  return (
    <form
      className="study-note-editor"
      aria-label={mode === 'create' ? 'Create study note' : 'Edit study note'}
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      <ReadingPanelChrome
        focusId="study-notes"
        title={mode === 'create' ? 'New Study Note' : 'Edit Study Note'}
        actions={
          savedNoteCount > 0 && onViewNotesList ? (
            <button
              type="button"
              className="study-note-editor__back-btn"
              onClick={onViewNotesList}
            >
              View saved notes ({savedNoteCount})
            </button>
          ) : null
        }
      />

      <div className="study-note-editor__field">
        <label htmlFor="study-note-title" className="study-note-editor__label">
          Title
        </label>
        <input
          id="study-note-title"
          name="study-note-title"
          type="text"
          className="study-note-editor__input"
          value={draft.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Note title"
          maxLength={200}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore
        />
      </div>

      <div className="study-note-editor__field study-note-editor__field--body">
        <span className="study-note-editor__label" id="study-note-body-label">
          Body
        </span>
        <VerticallyResizable
          storageKey="study-notes-editor"
          defaultHeight={360}
          minHeight={220}
          maxHeight={900}
          className="study-note-editor__resizable"
        >
          <RichTextNoteEditor
            key={remountKey}
            remountKey={remountKey ?? mode}
            value={draft.body}
            onChange={(html) => onChange('body', html)}
            ariaLabel="Study note body"
          />
        </VerticallyResizable>
      </div>

      <div className="study-note-editor__field">
        <label htmlFor="study-note-tags" className="study-note-editor__label">
          Tags
        </label>
        <input
          id="study-note-tags"
          name="study-note-tags"
          type="text"
          className="study-note-editor__input"
          value={draft.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          placeholder="creation, ex nihilo, theology"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore
        />
        <span className="study-note-editor__hint">Separate tags with commas</span>
      </div>
    </form>
  );
}
