import type { ReaderLocation } from '@/types/bible';

/** Canonical passage identifier, e.g. "Genesis 1:1" or "Genesis 1". */
export type PassageKey = string;

export interface StudyNote {
  id: string;
  passageKey: PassageKey;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyNoteInput {
  passageKey: PassageKey;
  title: string;
  body: string;
  tags: string[];
}

export interface StudyNoteDraft {
  title: string;
  body: string;
  tags: string;
}

export type StudyNoteEditorMode = 'idle' | 'view' | 'create' | 'edit';

export interface CrossReference {
  id: string;
  sourcePassageKey: PassageKey;
  /** Display reference, e.g. "John 1:1". */
  targetReference: string;
  /** Optional descriptive note from the Knowledge Base. */
  description?: string;
}

export interface PassageContext {
  location: ReaderLocation;
  passageKey: PassageKey;
}
