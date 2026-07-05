import { kjvIndex } from '@/data/kjvData';
import type { BibleChapter, ReaderLocation } from '@/types/bible';

const DEFAULT_LOCATION: ReaderLocation = {
  book: 'Genesis',
  chapter: 1,
  verse: null,
};

const { books, chaptersByBook, chapterMap, orderedChapters } = kjvIndex;

export function getDefaultLocation(): ReaderLocation {
  return { ...DEFAULT_LOCATION };
}

export function getAvailableBooks(): string[] {
  return books;
}

export function getChaptersForBook(book: string): number[] {
  return chaptersByBook.get(book) ?? [];
}

export function getChapter(book: string, chapter: number): BibleChapter | undefined {
  return chapterMap.get(`${book}:${chapter}`);
}

export function getVerseNumbers(book: string, chapter: number): number[] {
  return getChapter(book, chapter)?.verses.map((v) => v.number) ?? [];
}

export function normalizeLocation(location: ReaderLocation): ReaderLocation {
  const chapters = getChaptersForBook(location.book);
  if (chapters.length === 0) {
    return getDefaultLocation();
  }

  const chapter = chapters.includes(location.chapter)
    ? location.chapter
    : chapters[0];

  const verseNumbers = getVerseNumbers(location.book, chapter);
  const verse =
    location.verse !== null && verseNumbers.includes(location.verse)
      ? location.verse
      : null;

  return { book: location.book, chapter, verse };
}

export function getPreviousChapter(
  book: string,
  chapter: number,
): Pick<ReaderLocation, 'book' | 'chapter'> | null {
  const index = orderedChapters.findIndex(
    (ch) => ch.book === book && ch.chapter === chapter,
  );
  if (index <= 0) return null;
  const prev = orderedChapters[index - 1];
  return { book: prev.book, chapter: prev.chapter };
}

export function getNextChapter(
  book: string,
  chapter: number,
): Pick<ReaderLocation, 'book' | 'chapter'> | null {
  const index = orderedChapters.findIndex(
    (ch) => ch.book === book && ch.chapter === chapter,
  );
  if (index < 0 || index >= orderedChapters.length - 1) return null;
  const next = orderedChapters[index + 1];
  return { book: next.book, chapter: next.chapter };
}
