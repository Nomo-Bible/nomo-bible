import { KJV_VERSES } from '@/data/kjvData';
import type { ScriptureReference } from '@/types/bible';

/** Default page size for concordance UI pagination */
export const CONCORDANCE_PAGE_SIZE = 50;

/** Limit for compact pickers (e.g. cross-reference search) */
export const CONCORDANCE_PICKER_LIMIT = 50;

export interface ConcordanceResult {
  reference: ScriptureReference;
  referenceLabel: string;
  text: string;
  matchStart: number;
  matchLength: number;
}

export interface ConcordanceResponse {
  query: string;
  totalCount: number;
  results: ConcordanceResult[];
}

export interface TextHighlight {
  before: string;
  match: string;
  after: string;
}

export function splitTextHighlight(
  text: string,
  query: string,
): TextHighlight | null {
  const normalized = query.trim();
  if (!normalized) return null;

  const index = text.toLowerCase().indexOf(normalized.toLowerCase());
  if (index < 0) return null;

  return {
    before: text.slice(0, index),
    match: text.slice(index, index + normalized.length),
    after: text.slice(index + normalized.length),
  };
}

/**
 * KJV word/phrase concordance over the local verse corpus.
 * Original-language Strong's lookup is a future layer.
 */
export function searchConcordance(query: string): ConcordanceResponse {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query: '', totalCount: 0, results: [] };
  }

  const normalized = trimmed.toLowerCase();
  const allMatches: ConcordanceResult[] = [];

  for (const verse of KJV_VERSES) {
    const textLower = verse.text.toLowerCase();
    const refLower = verse.reference.toLowerCase();
    const textIndex = textLower.indexOf(normalized);

    if (textIndex >= 0) {
      allMatches.push({
        reference: {
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
        },
        referenceLabel: verse.reference,
        text: verse.text,
        matchStart: textIndex,
        matchLength: normalized.length,
      });
    } else if (refLower.includes(normalized)) {
      allMatches.push({
        reference: {
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
        },
        referenceLabel: verse.reference,
        text: verse.text,
        matchStart: 0,
        matchLength: 0,
      });
    }
  }

  return {
    query: trimmed,
    totalCount: allMatches.length,
    results: allMatches,
  };
}
