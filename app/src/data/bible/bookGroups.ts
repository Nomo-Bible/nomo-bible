import {
  NEW_TESTAMENT_START_BOOK,
} from '@/data/bible/canonicalBooks';
import { getAvailableBooks } from '@/services/bibleService';

export interface BibleBookGroup {
  id: 'ot' | 'nt';
  label: string;
  books: string[];
}

/** Canonical KJV books grouped into Old and New Testament. */
export function getBibleBookGroups(): BibleBookGroup[] {
  const books = getAvailableBooks();
  const ntIndex = books.indexOf(NEW_TESTAMENT_START_BOOK);

  if (ntIndex <= 0) {
    return [{ id: 'ot', label: 'Bible', books }];
  }

  return [
    { id: 'ot', label: 'Old Testament', books: books.slice(0, ntIndex) },
    { id: 'nt', label: 'New Testament', books: books.slice(ntIndex) },
  ];
}

/** Filtered groups for mobile navigator search — preserves canonical order. */
export function getFilteredBibleBookGroups(query: string): BibleBookGroup[] {
  const normalized = query.trim().toLowerCase();
  const groups = getBibleBookGroups();

  if (!normalized) return groups;

  return groups
    .map((group) => ({
      ...group,
      books: group.books.filter((book) => book.toLowerCase().includes(normalized)),
    }))
    .filter((group) => group.books.length > 0);
}
