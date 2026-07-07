import { getAvailableBooks } from '@/services/bibleService';

export interface BibleBookGroup {
  id: 'ot' | 'nt';
  label: string;
  books: string[];
}

const NEW_TESTAMENT_START = 'Matthew';

/** Canonical KJV books grouped into Old and New Testament. */
export function getBibleBookGroups(): BibleBookGroup[] {
  const books = getAvailableBooks();
  const ntIndex = books.indexOf(NEW_TESTAMENT_START);

  if (ntIndex <= 0) {
    return [{ id: 'ot', label: 'Bible', books }];
  }

  return [
    { id: 'ot', label: 'Old Testament', books: books.slice(0, ntIndex) },
    { id: 'nt', label: 'New Testament', books: books.slice(ntIndex) },
  ];
}
