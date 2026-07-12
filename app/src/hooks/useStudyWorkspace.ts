import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReader } from '@/context/ReaderContext';
import { insertIntoStudyNoteEditor } from '@/services/studyNoteEditorBridge';
import { KJV_WORD_GUIDE_INSERT_EVENT } from '@/services/kjvWordGuideService';
import {
  SCRIPTURE_INSERT_EVENT,
  SCRIPTURE_STUDY_TAB_EVENT,
} from '@/types/scriptureInteraction';
import { formatScripturePlainToNoteHtml } from '@/utils/noteContent';
import { loadCrossReferencesForSource } from '@/services/crossReferenceService';
import {
  formatTagsForInput,
  passageKeyFromLocation,
  parseScriptureReference,
  parseTagsInput,
} from '@/services/passageKeyService';
import {
  createNote,
  deleteNote,
  getNoteById,
  loadAllNotes,
  loadNotesForPassage,
  updateNote,
} from '@/services/studyNotesService';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import type { StudyResourceLibrarySection } from '@/types/studyWorkspace';
import type { StudyNote, StudyNoteDraft, StudyNoteEditorMode } from '@/types/study';

const EMPTY_DRAFT: StudyNoteDraft = { title: '', body: '', tags: '' };

const STUDY_TABS: StudyWorkspaceTabId[] = [
  'study-notes',
  'cross-references',
  'study-resources',
  'concordance',
  'topics',
  'how-to-study',
  'kjv-word-guide',
  'charts',
];

function parseResourceSection(value: string | null): StudyResourceLibrarySection | null {
  if (
    value === 'overview' ||
    value === 'commentary' ||
    value === 'egw' ||
    value === 'topics' ||
    value === 'charts' ||
    value === 'maps' ||
    value === 'my-notes'
  ) {
    return value;
  }
  return null;
}

function parseTab(value: string | null): StudyWorkspaceTabId | null {
  if (!value) return null;
  if (value === 'doctrine') return 'how-to-study';
  return STUDY_TABS.includes(value as StudyWorkspaceTabId)
    ? (value as StudyWorkspaceTabId)
    : null;
}

export function useStudyWorkspace() {
  const { location, goToPassage } = useReader();
  const [searchParams, setSearchParams] = useSearchParams();
  const passageKey = passageKeyFromLocation(location);
  const requestedTab = parseTab(searchParams.get('tab'));
  const requestedNoteId = searchParams.get('note');
  const studyResourceSection =
    parseResourceSection(searchParams.get('resource')) ?? 'overview';

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
  const editorModeRef = useRef(editorMode);

  useEffect(() => {
    editorModeRef.current = editorMode;
  }, [editorMode]);

  const allNotes = useMemo(() => loadAllNotes(), [notes]);

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    const fromPassage = notes.find((note) => note.id === selectedNoteId);
    if (fromPassage) return fromPassage;
    return getNoteById(selectedNoteId) ?? null;
  }, [notes, selectedNoteId]);

  const refreshNotes = useCallback(() => {
    setNotes(loadNotesForPassage(passageKey));
  }, [passageKey]);

  const refreshCrossReferences = useCallback(() => {
    setCrossReferences(loadCrossReferencesForSource(passageKey));
  }, [passageKey]);

  useEffect(() => {
    refreshNotes();
    refreshCrossReferences();
    if (!requestedNoteId) {
      setSelectedNoteId(null);
      setEditorMode('idle');
      setDraft(EMPTY_DRAFT);
      setDraftBaseline(EMPTY_DRAFT);
    }
  }, [passageKey, refreshNotes, refreshCrossReferences, requestedNoteId]);

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

  useEffect(() => {
    const handleInsertScripture = (event: Event) => {
      const detail = (event as CustomEvent<{ text: string }>).detail;
      if (!detail?.text) return;

      const scriptureHtml = formatScripturePlainToNoteHtml(detail.text);
      setActiveTab('study-notes');

      if (
        editorModeRef.current === 'create' ||
        editorModeRef.current === 'edit'
      ) {
        if (insertIntoStudyNoteEditor(scriptureHtml)) {
          return;
        }

        setDraft((current) => ({
          ...current,
          body: current.body.trim()
            ? `${current.body}<p></p>${scriptureHtml}`
            : scriptureHtml,
        }));
        return;
      }

      const nextDraft = { title: '', body: scriptureHtml, tags: '' };
      setSelectedNoteId(null);
      setEditorMode('create');
      setDraft(nextDraft);
      setDraftBaseline(nextDraft);
    };

    const handleStudyTab = (event: Event) => {
      const detail = (event as CustomEvent<{ tab: StudyWorkspaceTabId }>).detail;
      if (!detail?.tab) return;
      setActiveTab(detail.tab);
    };

    const handleInsertKjvWordGuide = (event: Event) => {
      const detail = (event as CustomEvent<{ html: string }>).detail;
      if (!detail?.html) return;

      setActiveTab('study-notes');

      if (
        editorModeRef.current === 'create' ||
        editorModeRef.current === 'edit'
      ) {
        if (insertIntoStudyNoteEditor(detail.html)) {
          return;
        }

        setDraft((current) => ({
          ...current,
          body: current.body.trim()
            ? `${current.body}<p></p>${detail.html}`
            : detail.html,
        }));
        return;
      }

      const nextDraft = { title: '', body: detail.html, tags: 'kjv-word-guide' };
      setSelectedNoteId(null);
      setEditorMode('create');
      setDraft(nextDraft);
      setDraftBaseline(nextDraft);
    };

    window.addEventListener(SCRIPTURE_INSERT_EVENT, handleInsertScripture);
    window.addEventListener(SCRIPTURE_STUDY_TAB_EVENT, handleStudyTab);
    window.addEventListener(KJV_WORD_GUIDE_INSERT_EVENT, handleInsertKjvWordGuide);
    return () => {
      window.removeEventListener(SCRIPTURE_INSERT_EVENT, handleInsertScripture);
      window.removeEventListener(SCRIPTURE_STUDY_TAB_EVENT, handleStudyTab);
      window.removeEventListener(
        KJV_WORD_GUIDE_INSERT_EVENT,
        handleInsertKjvWordGuide,
      );
    };
  }, []);

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

  const viewNotesList = useCallback(() => {
    setEditorMode('idle');
    setDraft(EMPTY_DRAFT);
    setDraftBaseline(EMPTY_DRAFT);
  }, []);

  const openNote = useCallback(
    (noteId: string) => {
      const note = getNoteById(noteId);
      if (!note) return;

      const target = parseScriptureReference(note.passageKey);
      if (target) {
        goToPassage(target);
      }

      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set('tab', 'study-notes');
          next.set('note', noteId);
          return next;
        },
        { replace: true },
      );
    },
    [goToPassage, setSearchParams],
  );

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
    allNotes,
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
    openNote,
    viewNotesList,
    cancelEditing,
    saveDraft,
    removeSelected,
    handleRefresh,
    updateDraftField,
    studyResourceSection,
  };
}
