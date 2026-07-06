export interface ScriptureReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface ReaderLocation {
  book: string;
  chapter: number;
  /** null = show full chapter; number = focus that verse */
  verse: number | null;
}

export interface ConcordanceHighlight {
  query: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface KjvVerse {
  translation: 'KJV';
  testament: 'Old Testament' | 'New Testament';
  book: string;
  bookOrder: number;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export interface BibleSearchResult {
  reference: ScriptureReference;
  text: string;
}

export interface BibleSearchResponse {
  query: string;
  results: BibleSearchResult[];
  totalCount: number;
}

export function formatReference(ref: ScriptureReference): string {
  return `${ref.book} ${ref.chapter}:${ref.verse}`;
}

export function formatReaderLocation(
  location: Pick<ReaderLocation, 'book' | 'chapter' | 'verse'>,
): string {
  if (location.verse !== null) {
    return `${location.book} ${location.chapter}:${location.verse}`;
  }
  return `${location.book} ${location.chapter}`;
}
