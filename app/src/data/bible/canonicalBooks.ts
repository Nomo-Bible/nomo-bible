/** Standard KJV canonical order — 66 books. Single source of truth for book lists. */
export const KJV_CANONICAL_BOOKS = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
] as const;

export type KjvCanonicalBook = (typeof KJV_CANONICAL_BOOKS)[number];

const CANONICAL_BOOK_ORDER = new Map<string, number>(
  KJV_CANONICAL_BOOKS.map((book, index) => [book, index]),
);

/** Return books in canonical order, optionally limited to those present in the corpus. */
export function getCanonicalBooks(available?: Iterable<string>): string[] {
  if (!available) {
    return [...KJV_CANONICAL_BOOKS];
  }

  const availableSet = new Set(available);
  return KJV_CANONICAL_BOOKS.filter((book) => availableSet.has(book));
}

/** Sort any book list into canonical order (unknown books trail in stable order). */
export function sortBooksCanonically(books: Iterable<string>): string[] {
  const unique = [...new Set(books)];
  return unique.sort((a, b) => {
    const aIndex = CANONICAL_BOOK_ORDER.get(a);
    const bIndex = CANONICAL_BOOK_ORDER.get(b);
    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex;
    }
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Filter books by search text while preserving canonical order.
 * Does not alphabetize results.
 */
export function filterCanonicalBooks(
  query: string,
  books: readonly string[] = KJV_CANONICAL_BOOKS,
): string[] {
  const ordered = sortBooksCanonically(books);
  const normalized = query.trim().toLowerCase();
  if (!normalized) return ordered;
  return ordered.filter((book) => book.toLowerCase().includes(normalized));
}

export const NEW_TESTAMENT_START_BOOK: KjvCanonicalBook = 'Matthew';
