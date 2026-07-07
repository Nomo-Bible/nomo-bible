import type { StudyResourceFieldConfig } from '@/hooks/useStudyResourcePanel';
import './studyResources.css';

interface StudyResourceFormProps {
  fields: StudyResourceFieldConfig[];
  values: Record<string, string>;
  mode: 'create' | 'edit';
  onChange: (key: string, value: string) => void;
}

export function StudyResourceForm({
  fields,
  values,
  mode,
  onChange,
}: StudyResourceFormProps) {
  return (
    <form
      className="study-resource-form"
      aria-label={mode === 'create' ? 'Create resource' : 'Edit resource'}
      onSubmit={(e) => e.preventDefault()}
    >
      {fields.map((field) => {
        const id = `study-resource-${field.key}`;
        return (
          <div key={field.key} className="study-resource-form__field">
            <label htmlFor={id} className="study-resource-form__label">
              {field.label}
              {field.required ? ' *' : ''}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={id}
                className="study-resource-form__textarea"
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows ?? 5}
              />
            ) : (
              <input
                id={id}
                type="text"
                className="study-resource-form__input"
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
            {field.hint ? (
              <span className="study-resource-form__hint">{field.hint}</span>
            ) : null}
          </div>
        );
      })}
    </form>
  );
}

interface StudyResourceListProps<T extends { id: string; title: string; updatedAt?: string }> {
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  getExcerpt: (item: T) => string;
  ariaLabel: string;
}

export function StudyResourceList<T extends { id: string; title: string; updatedAt?: string }>({
  items,
  selectedId,
  onSelect,
  getExcerpt,
  ariaLabel,
}: StudyResourceListProps<T>) {
  return (
    <ul className="study-resource-list" aria-label={ariaLabel}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const excerpt = getExcerpt(item);
        return (
          <li key={item.id}>
            <button
              type="button"
              className={
                isSelected
                  ? 'study-resource-list__item study-resource-list__item--selected'
                  : 'study-resource-list__item'
              }
              onClick={() => onSelect(item.id)}
              aria-current={isSelected ? 'true' : undefined}
            >
              <span className="study-resource-list__title">{item.title}</span>
              {excerpt ? (
                <span className="study-resource-list__excerpt">
                  {excerpt.length > 100 ? `${excerpt.slice(0, 100)}…` : excerpt}
                </span>
              ) : null}
              {item.updatedAt ? (
                <span className="study-resource-list__meta">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface StudyResourceDetailProps {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

export function StudyResourceDetail({ title, rows }: StudyResourceDetailProps) {
  return (
    <article className="study-resource-detail">
      <h3 className="study-resource-detail__title">{title}</h3>
      <dl className="study-resource-detail__rows">
        {rows
          .filter((row) => row.value.trim())
          .map((row) => (
            <div key={row.label} className="study-resource-detail__row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
      </dl>
    </article>
  );
}

interface StudyResourceToolbarProps {
  canSave: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCancel: boolean;
  onNew: () => void;
  onSave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  newLabel?: string;
}

export function StudyResourceToolbar({
  canSave,
  canEdit,
  canDelete,
  canCancel,
  onNew,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  newLabel = 'Add',
}: StudyResourceToolbarProps) {
  return (
    <div className="study-resource-toolbar">
      <button type="button" className="study-resource-toolbar__btn" onClick={onNew}>
        + {newLabel}
      </button>
      <div className="study-resource-toolbar__actions">
        {canSave ? (
          <button
            type="button"
            className="study-resource-toolbar__btn study-resource-toolbar__btn--primary"
            onClick={onSave}
          >
            Save
          </button>
        ) : null}
        {canEdit ? (
          <button type="button" className="study-resource-toolbar__btn" onClick={onEdit}>
            Edit
          </button>
        ) : null}
        {canDelete ? (
          <button
            type="button"
            className="study-resource-toolbar__btn study-resource-toolbar__btn--danger"
            onClick={onDelete}
          >
            Delete
          </button>
        ) : null}
        {canCancel ? (
          <button type="button" className="study-resource-toolbar__btn" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
