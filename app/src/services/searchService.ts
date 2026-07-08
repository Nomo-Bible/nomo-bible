import { KJV_VERSES } from '@/data/kjvData';
import type { BibleSearchResponse } from '@/types/bible';

/**
 * Full-text search over the local KJV verse corpus.
 * Returns the complete match set; UI paginates for display.
 */
export async function searchBible(query: string): Promise<BibleSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query: '', results: [], totalCount: 0 };
  }

  const normalized = trimmed.toLowerCase();
  const matches = KJV_VERSES.filter(
    (verse) =>
      verse.text.toLowerCase().includes(normalized) ||
      verse.reference.toLowerCase().includes(normalized),
  );

  return {
    query: trimmed,
    totalCount: matches.length,
    results: matches.map((verse) => ({
      reference: {
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
      },
      text: verse.text,
    })),
  };
}