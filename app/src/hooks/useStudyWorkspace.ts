import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReader } from '@/context/ReaderContext';
import { loadCrossReferencesForSource } from '@/services/crossReferenceService';
import {
  formatTagsForInput,
  passageKeyFromLocation,
  parseTagsInput,
} from '@/services/passageKeyService';
import {
  createNote,
  deleteNote,
  loadNotesForPassage,
  updateNote,
} from '@/services/studyNotesService';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import type { StudyNote, StudyNoteDraft, StudyNoteEditorMode } from '@/types/study';

const EMPTY_DRAFT: StudyNoteDraft = { title: '', body: '', tags: '' };

const STUDY_TABS: StudyWorkspaceTabId[] = [
  'study-notes',
  'cross-references',
  'concordance',
  'topics',
  'how-to-study',
  'charts',
];

function parseTab(value: string | null): StudyWorkspaceTabId | null {
  if (!value) return null;
  if (value === 'doctrine') return 'how-to-study';
  return STUDY_TABS.includes(value as StudyWorkspaceTabId)
    ? (value as StudyWorkspaceTabId)
    : null;
}

export function useStudyWorkspace() {
  const { location } = useReader();
  const [searchParams] = useSearchParams();
  const passageKey = passageKeyFromLocation(location);
  const requestedTab = parseTab(searchParams.get('tab'));
  const requestedNoteId = searchParams.get('note');

  const [activeTab, setActiveTab] = useState<StudyWorkspaceTabId>(
    requestedTab ?? 'study-notes',
  );
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [crossReferences, setCrossReferences] = useState(
    loadCrossReferencesForSource(passageKey),
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<StudyNoteEditorMode>('idle');
  const [draft, setDraft] = useState<StudyNoteDraft>(EMPTY_DRAFT);
  const [draftBaseline, setDraftBaseline] = useState<StudyNoteDraft>(EMPTY_DRAFT);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  const refreshNotes = useCallback(() => {
    setNotes(loadNotesForPassage(passageKey));
  }, [passageKey]);

  const refreshCrossReferences = useCallback(() => {
    setCrossReferences(loadCrossReferencesForSource(passageKey));
  }, [passageKey]);

  useEffect(() => {
    refreshNotes();
    refreshCrossReferences();
    setSelectedNoteId(null);
    setEditorMode('idle');
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, [passageKey, refreshNotes, refreshCrossReferences]);

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  useEffect(() => {
    if (!requestedNoteId) return;
    refreshNotes();
    setSelectedNoteId(requestedNoteId);
    setEditorMode('view');
    setActiveTab('study-notes');
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, [requestedNoteId, refreshNotes]);

  const hasDraftChanges = useMemo(
    () =>
      draft.title !== draftBaseline.title ||
      draft.body !== draftBaseline.body ||
      draft.tags !== draftBaseline.tags,
    [draft, draftBaseline],
  );

  const canSave =
    (editorMode === 'create' || editorMode === 'edit') &&
    hasDraftChanges &&
    draft.title.trim().length > 0;

  const canEdit =
    editorMode === 'view' && selectedNote !== null;

  const canDelete =
    selectedNote !== null && editorMode !== 'create';

  const canCancel = editorMode === 'create' || editorMode === 'edit';

  const startCreate = useCallback(() => {
    const empty = { ...EMPTY_DRAFT };
    setSelectedNoteId(null);
    setEditorMode('create');
    setDraft(empty);
    setDraftBaseline(empty);
  }, []);

  const startEdit = useCallback(() => {
    if (!selectedNote) return;
    const nextDraft: StudyNoteDraft = {
      title: selectedNote.title,
      body: selectedNote.body,
      tags: formatTagsForInput(selectedNote.tags),
    };
    setEditorMode('edit');
    setDraft(nextDraft);
    setDraftBaseline(nextDraft);
  }, [selectedNote]);

  const selectNote = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setEditorMode('view');
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, []);

  const cancelEditing = useCallback(() => {
    if (selectedNote) {
      setEditorMode('view');
    } else {
      setEditorMode('idle');
    }
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, [selectedNote]);

  const saveDraft = useCallback(() => {
    if (!canSave) return;

    const tags = parseTagsInput(draft.tags);
    const payload = {
      title: draft.title,
      body: draft.body,
      tags,
    };

    if (editorMode === 'create') {
      const created = createNote({ passageKey, ...payload });
      refreshNotes();
      setSelectedNoteId(created.id);
      setEditorMode('view');
      setDraft(EMPTY_DRAFT);
      setDraftBaseline(EMPTY_DRAFT);
      return;
    }

    if (editorMode === 'edit' && selectedNote) {
      updateNote(selectedNote.id, payload);
      refreshNotes();
      setEditorMode('view');
      setDraft(EMPTY_DRAFT);
      setDraftBaseline(EMPTY_DRAFT);
    }
  }, [
    canSave,
    draft,
    editorMode,
    passageKey,
    refreshNotes,
    selectedNote,
  ]);

  const removeSelected = useCallback(() => {
    if (!selectedNote || editorMode === 'create') return;
    deleteNote(selectedNote.id);
    refreshNotes();
    setSelectedNoteId(null);
    setEditorMode('idle');
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, [editorMode, refreshNotes, selectedNote]);

  const handleRefresh = useCallback(() => {
    refreshNotes();
    refreshCrossReferences();
  }, [refreshCrossReferences, refreshNotes]);

  const updateDraftField = useCallback(
    (field: keyof StudyNoteDraft, value: string) => {
      setDraft((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  return {
    activeTab,
    setActiveTab,
    passageKey,
    notes,
    crossReferences,
    selectedNote,
    selectedNoteId,
    editorMode,
    draft,
    canSave,
    canEdit,
    canDelete,
    canCancel,
    startCreate,
    startEdit,
    selectNote,
    cancelEditing,
    saveDraft,
    removeSelected,
    handleRefresh,
    updateDraftField,
  };
}
