import { useEffect, type ReactNode } from 'react';
import type { PassageKey } from '@/types/study';
import type { StudyResourceFieldConfig } from '@/hooks/useStudyResourcePanel';
import { useStudyResourcePanel } from '@/hooks/useStudyResourcePanel';
import { EmptyState } from '@/components/workspace/EmptyState';
import {
  StudyResourceDetail,
  StudyResourceForm,
  StudyResourceList,
  StudyResourceToolbar,
} from './StudyResourceUi';
import './studyResources.css';

interface StudyResourcePanelProps<TItem extends { id: string; title: string; updatedAt: string }, TInput> {
  title: string;
  hint?: string;
  passageKey?: PassageKey;
  filterByPassage?: boolean;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyMessage: string;
  newLabel?: string;
  fields: StudyResourceFieldConfig[];
  listFields: string[];
  loadAll: () => TItem[];
  loadForPassage: (passageKey: PassageKey) => TItem[];
  getById: (id: string) => TItem | undefined;
  create: (input: TInput) => TItem;
  update: (id: string, input: TInput) => TItem;
  remove: (id: string) => void;
  toDraft: (item: TItem) => Record<string, string>;
  fromDraft: (draft: Record<string, string>) => TInput;
  toDetailRows: (item: TItem) => Array<{ label: string; value: string }>;
  seedDraft?: (passageKey: PassageKey) => Record<string, string>;
  headerSlot?: ReactNode;
  autoStartCreateKey?: number;
}

export function StudyResourcePanel<TItem extends { id: string; title: string; updatedAt: string }, TInput>({
  title,
  hint,
  passageKey,
  filterByPassage = false,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  newLabel,
  fields,
  listFields,
  loadAll,
  loadForPassage,
  getById,
  create,
  update,
  remove,
  toDraft,
  fromDraft,
  toDetailRows,
  seedDraft,
  headerSlot,
  autoStartCreateKey,
}: StudyResourcePanelProps<TItem, TInput>) {
  const panel = useStudyResourcePanel({
    passageKey,
    filterByPassage,
    loadAll,
    loadForPassage,
    getById,
    create,
    update,
    remove,
    fields,
    listFields,
    toDraft,
    fromDraft,
    seedDraft,
  });

  useEffect(() => {
    if (autoStartCreateKey) {
      panel.startCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trigger only on explicit key change
  }, [autoStartCreateKey]);

  return (
    <div className="study-resource-panel">
      <h2 className="study-resource-panel__header">{title}</h2>
      {hint ? <p className="study-resource-panel__hint">{hint}</p> : null}
      {headerSlot}

      <StudyResourceToolbar
        canSave={panel.canSave}
        canEdit={panel.canEdit}
        canDelete={panel.canDelete}
        canCancel={panel.canCancel}
        onNew={panel.startCreate}
        onSave={panel.saveDraft}
        onEdit={panel.startEdit}
        onDelete={panel.removeSelected}
        onCancel={panel.cancelEditing}
        newLabel={newLabel}
      />

      {panel.mode === 'create' || panel.mode === 'edit' ? (
        <StudyResourceForm
          fields={fields}
          values={panel.draft}
          mode={panel.mode}
          onChange={panel.updateField}
        />
      ) : null}

      {panel.mode === 'view' && panel.selectedItem ? (
        <StudyResourceDetail
          title={panel.selectedItem.title}
          rows={toDetailRows(panel.selectedItem)}
        />
      ) : null}

      {panel.mode !== 'create' && panel.mode !== 'edit' ? (
        panel.items.length > 0 ? (
          <StudyResourceList
            items={panel.items}
            selectedId={panel.selectedId}
            onSelect={panel.selectItem}
            getExcerpt={panel.getListExcerpt}
            ariaLabel={`${title} list`}
          />
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            message={emptyMessage}
            actionLabel={newLabel ?? 'Add'}
            onAction={panel.startCreate}
          />
        )
      ) : null}
    </div>
  );
}
