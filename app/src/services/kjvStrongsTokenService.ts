import tokenData from '@knowledge-base/bible/kjv/processed/kjv-strongs-tokens.json';
import type { VerseTokensMap, VerseWordToken } from '@/types/verseTokens';

const TOKENS = tokenData as VerseTokensMap;

export function verseTokenKey(book: string, chapter: number, verse: number): string {
  return `${book}:${chapter}:${verse}`;
}

export function getVerseWordTokens(
  book: string,
  chapter: number,
  verse: number,
): VerseWordToken[] | null {
  const tokens = TOKENS[verseTokenKey(book, chapter, verse)];
  return tokens ?? null;
}

export function isVerseTokenDataInstalled(): boolean {
  return Object.keys(TOKENS).length > 0;
}

export function getTaggedVerseCount(): number {
  return Object.keys(TOKENS).length;
}
