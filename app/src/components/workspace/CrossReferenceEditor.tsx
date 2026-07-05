import type { CrossReferenceTarget } from '@/types/crossReferences';
import './CrossReferenceEditor.css';

interface CrossReferenceEditorProps {
  target: CrossReferenceTarget;
  label: string;
  error?: string | null;
  onLabelChange: (label: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CrossReferenceEditor({
  target,
  label,
  error,
  onLabelChange,
  onSave,
  onCancel,
}: CrossReferenceEditorProps) {
  return (
    <div className="cross-ref-editor">
      <p className="cross-ref-editor__target">
        Adding cross reference to{' '}
        <strong>{target.targetReference}</strong>
      </p>

      <div className="cross-ref-editor__field">
        <label htmlFor="cross-ref-label" className="cross-ref-editor__label">
          Connection label (optional)
        </label>
        <input
          id="cross-ref-label"
          type="text"
          className="cross-ref-editor__input"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="e.g. Parallel creation account"
          maxLength={200}
        />
      </div>

      {error && <p className="cross-ref-editor__error">{error}</p>}

      <div className="cross-ref-editor__actions">
        <button
          type="button"
          className="cross-ref-editor__btn cross-ref-editor__btn--primary"
          onClick={onSave}
        >
          Add Reference
        </button>
        <button
          type="button"
          className="cross-ref-editor__btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
