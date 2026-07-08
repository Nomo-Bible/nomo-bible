import type { PassageKey, StudyNote, StudyNoteInput } from '@/types/study';
import { noteMatchesPassage } from '@/services/passageKeyService';

const STORAGE_KEY = 'nomomartyria-study-notes-v1';

function normalizeNoteBody(body: string): string {
  const trimmed = body.trim();
  if (!trimmed || trimmed === '<p></p>') return '';
  return trimmed;
}

interface StudyNotesStore {
  version: 1;
  notes: StudyNote[];
}

/** Persistence boundary — swap implementation for SQLite / Netlify DB later. */
export interface StudyNotesRepository {
  loadAll(): StudyNote[];
  saveAll(notes: StudyNote[]): void;
}

class LocalStorageStudyNotesRepository implements StudyNotesRepository {
  loadAll(): StudyNote[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StudyNotesStore;
      if (parsed.version !== 1 || !Array.isArray(parsed.notes)) return [];
      return parsed.notes;
    } catch {
      return [];
    }
  }

  saveAll(notes: StudyNote[]): void {
    const store: StudyNotesStore = { version: 1, notes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

let repository: StudyNotesRepository = new LocalStorageStudyNotesRepository();

/** Test hook — inject an alternate repository without touching UI code. */
export function setStudyNotesRepository(next: StudyNotesRepository): void {
  repository = next;
}

function readAll(): StudyNote[] {
  return repository.loadAll();
}

function writeAll(notes: StudyNote[]): void {
  repository.saveAll(notes);
}

function generateId(): string {
  return crypto.randomUUID();
}

export function loadNotesForPassage(passageKey: PassageKey): StudyNote[] {
  return readAll()
    .filter((note) => noteMatchesPassage(note.passageKey, passageKey))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function getNoteById(id: string): StudyNote | undefined {
  return readAll().find((note) => note.id === id);
}

export function createNote(input: StudyNoteInput): StudyNote {
  const now = new Date().toISOString();
  const note: StudyNote = {
    id: generateId(),
    passageKey: input.passageKey,
    title: input.title.trim(),
    body: normalizeNoteBody(input.body),
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
  };

  const notes = readAll();
  notes.push(note);
  writeAll(notes);
  return note;
}

export function updateNote(
  id: string,
  input: Omit<StudyNoteInput, 'passageKey'>,
): StudyNote {
  const notes = readAll();
  const index = notes.findIndex((note) => note.id === id);
  if (index < 0) {
    throw new Error(`Study note not found: ${id}`);
  }

  const updated: StudyNote = {
    ...notes[index],
    title: input.title.trim(),
    body: normalizeNoteBody(input.body),
    tags: input.tags,
    updatedAt: new Date().toISOString(),
  };

  notes[index] = updated;
  writeAll(notes);
  return updated;
}

export function deleteNote(id: string): void {
  writeAll(readAll().filter((note) => note.id !== id));
}
