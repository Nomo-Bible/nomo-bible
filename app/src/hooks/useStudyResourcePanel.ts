import { useCallback, useMemo, useState } from 'react';
import type { PassageKey } from '@/types/study';
import { formatListInput, parseListInput } from '@/services/studyResources/referenceMatching';

export type StudyResourceEditorMode = 'list' | 'view' | 'create' | 'edit';

export interface StudyResourceFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}

interface UseStudyResourcePanelOptions<TItem extends { id: string; title: string }, TInput> {
  passageKey?: PassageKey;
  filterByPassage: boolean;
  loadAll: () => TItem[];
  loadForPassage: (passageKey: PassageKey) => TItem[];
  getById: (id: string) => TItem | undefined;
  create: (input: TInput) => TItem;
  update: (id: string, input: TInput) => TItem;
  remove: (id: string) => void;
  fields: StudyResourceFieldConfig[];
  listFields: string[];
  toDraft: (item: TItem) => Record<string, string>;
  fromDraft: (draft: Record<string, string>) => TInput;
  seedDraft?: (passageKey: PassageKey) => Record<string, string>;
}

function emptyDraft(fields: StudyResourceFieldConfig[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, '']));
}

export function useStudyResourcePanel<TItem extends { id: string; title: string }, TInput>({
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
}: UseStudyResourcePanelOptions<TItem, TInput>) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyResourceEditorMode>('list');
  const [draft, setDraft] = useState<Record<string, string>>(() => emptyDraft(fields));
  const [baseline, setBaseline] = useState<Record<string, string>>(() => emptyDraft(fields));

  const items = useMemo(() => {
    void refreshKey;
    if (filterByPassage && passageKey) {
      return loadForPassage(passageKey);
    }
    return loadAll();
  }, [filterByPassage, passageKey, loadAll, loadForPassage, refreshKey]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return getById(selectedId) ?? items.find((item) => item.id === selectedId) ?? null;
  }, [getById, items, selectedId]);

  const hasChanges = useMemo(
    () => fields.some((field) => draft[field.key] !== baseline[field.key]),
    [baseline, draft, fields],
  );

  const canSave =
    (mode === 'create' || mode === 'edit') &&
    hasChanges &&
    fields.filter((f) => f.required).every((f) => draft[f.key]?.trim());

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const startCreate = useCallback(() => {
    const next = seedDraft && passageKey ? seedDraft(passageKey) : emptyDraft(fields);
    setSelectedId(null);
    setMode('create');
    setDraft(next);
    setBaseline(next);
  }, [fields, passageKey, seedDraft]);

  const startEdit = useCallback(() => {
    if (!selectedItem) return;
    const next = toDraft(selectedItem);
    setMode('edit');
    setDraft(next);
    setBaseline(next);
  }, [selectedItem, toDraft]);

  const selectItem = useCallback((id: string) => {
    setSelectedId(id);
    setMode('view');
    setDraft(emptyDraft(fields));
    setBaseline(emptyDraft(fields));
  }, [fields]);

  const cancelEditing = useCallback(() => {
    if (selectedItem) {
      setMode('view');
    } else {
      setMode('list');
      setSelectedId(null);
    }
    setDraft(emptyDraft(fields));
    setBaseline(emptyDraft(fields));
  }, [fields, selectedItem]);

  const saveDraft = useCallback(() => {
    if (!canSave) return;
    const input = fromDraft(draft);
    if (mode === 'create') {
      const created = create(input);
      refresh();
      setSelectedId(created.id);
      setMode('view');
    } else if (mode === 'edit' && selectedId) {
      update(selectedId, input);
      refresh();
      setMode('view');
    }
    setDraft(emptyDraft(fields));
    setBaseline(emptyDraft(fields));
  }, [canSave, create, draft, fields, fromDraft, mode, refresh, selectedId, update]);

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    remove(selectedId);
    refresh();
    setSelectedId(null);
    setMode('list');
    setDraft(emptyDraft(fields));
    setBaseline(emptyDraft(fields));
  }, [fields, refresh, remove, selectedId]);

  const updateField = useCallback((key: string, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const getListExcerpt = useCallback(
    (item: TItem) => {
      for (const key of listFields) {
        const value = (item as Record<string, unknown>)[key];
        if (typeof value === 'string' && value.trim()) {
          return value;
        }
      }
      return '';
    },
    [listFields],
  );

  return {
    items,
    selectedItem,
    selectedId,
    mode,
    draft,
    canSave,
    canEdit: mode === 'view' && selectedItem !== null,
    canDelete: selectedItem !== null && mode !== 'create',
    canCancel: mode === 'create' || mode === 'edit',
    startCreate,
    startEdit,
    selectItem,
    cancelEditing,
    saveDraft,
    removeSelected,
    updateField,
    getListExcerpt,
    parseListInput,
    formatListInput,
  };
}
