import { getAvailableBooks } from '@/services/bibleService';
import type { ReaderLocation } from '@/types/bible';
import type { PassageKey } from '@/types/study';

export function passageKeyFromLocation(
  location: Pick<ReaderLocation, 'book' | 'chapter' | 'verse'>,
): PassageKey {
  if (location.verse !== null) {
    return `${location.book} ${location.chapter}:${location.verse}`;
  }
  return `${location.book} ${location.chapter}`;
}

/**
 * Parse a human-readable reference into a reader location.
 * Supports book names with numeric prefixes (e.g. "1 John 4:8").
 */
export function parseScriptureReference(
  reference: string,
): ReaderLocation | null {
  const trimmed = reference.trim();
  if (!trimmed) return null;

  const books = getAvailableBooks().sort((a, b) => b.length - a.length);

  for (const book of books) {
    if (!trimmed.startsWith(book)) continue;

    const remainder = trimmed.slice(book.length).trim();
    const chapterOnly = remainder.match(/^(\d+)$/);
    if (chapterOnly) {
      return {
        book,
        chapter: Number(chapterOnly[1]),
        verse: null,
      };
    }

    const withVerse = remainder.match(/^(\d+):(\d+)$/);
    if (withVerse) {
      return {
        book,
        chapter: Number(withVerse[1]),
        verse: Number(withVerse[2]),
      };
    }
  }

  return null;
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(', ');
}
