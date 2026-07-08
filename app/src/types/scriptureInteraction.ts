export const HIGHLIGHT_COLORS = [
  'yellow',
  'green',
  'blue',
  'pink',
  'orange',
  'purple',
] as const;

export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

export const DEFAULT_HIGHLIGHT_COLOR: HighlightColor = 'yellow';

export interface VerseRef {
  book: string;
  chapter: number;
  verse: number;
}

export interface BibleHighlight {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  createdAt: string;
  updatedAt: string;
}

export function verseKey(ref: VerseRef): string {
  return `${ref.book}|${ref.chapter}|${ref.verse}`;
}

export function parseVerseKey(key: string): VerseRef | null {
  const parts = key.split('|');
  if (parts.length !== 3) return null;
  const chapter = Number(parts[1]);
  const verse = Number(parts[2]);
  if (!parts[0] || !Number.isFinite(chapter) || !Number.isFinite(verse)) {
    return null;
  }
  return { book: parts[0], chapter, verse };
}

export const SCRIPTURE_INSERT_EVENT = 'nomomartyria:insert-scripture';
export const SCRIPTURE_FLASH_EVENT = 'nomomartyria:flash-verse';
export const SCRIPTURE_STUDY_TAB_EVENT = 'nomomartyria:study-tab';
