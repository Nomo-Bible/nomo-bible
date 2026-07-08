import kjvVersesJson from '@knowledge-base/bible/kjv/processed/kjv-verses.json';
import { sortBooksCanonically } from '@/data/bible/canonicalBooks';
import type { BibleChapter, KjvVerse } from '@/types/bible';
export const KJV_VERSES = kjvVersesJson as KjvVerse[];

function chapterKey(book: string, chapter: number): string {
  return `${book}:${chapter}`;
}

function buildIndexes(verses: KjvVerse[]) {
  const books: string[] = [];
  const chaptersByBook = new Map<string, number[]>();
  const chapterMap = new Map<string, BibleChapter>();
  const orderedChapters: Pick<BibleChapter, 'book' | 'chapter'>[] = [];
  let lastChapterKey = '';

  for (const entry of verses) {
    if (!chaptersByBook.has(entry.book)) {
      books.push(entry.book);
      chaptersByBook.set(entry.book, []);
    }

    const key = chapterKey(entry.book, entry.chapter);
    let chapter = chapterMap.get(key);

    if (!chapter) {
      chapter = { book: entry.book, chapter: entry.chapter, verses: [] };
      chapterMap.set(key, chapter);
      chaptersByBook.get(entry.book)!.push(entry.chapter);

      if (key !== lastChapterKey) {
        orderedChapters.push({ book: entry.book, chapter: entry.chapter });
        lastChapterKey = key;
      }
    }

    chapter.verses.push({ number: entry.verse, text: entry.text });
  }

  return {
    books: sortBooksCanonically(books),
    chaptersByBook,
    chapterMap,
    orderedChapters,
  };}

export const kjvIndex = buildIndexes(KJV_VERSES);

