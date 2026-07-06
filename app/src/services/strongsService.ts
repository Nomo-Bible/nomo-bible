import greekData from '@/data/reference/strongs-greek.json';
import hebrewData from '@/data/reference/strongs-hebrew.json';
import type {
  StrongsDictionaryData,
  StrongsEntry,
  StrongsSearchResponse,
} from '@/types/strongs';

const GREEK = greekData as StrongsDictionaryData;
const HEBREW = hebrewData as StrongsDictionaryData;

const STRONGS_NUMBER_PATTERN = /^([HG])\s*0*(\d+)$/i;
const BARE_STRONGS_NUMBER_PATTERN = /^\d+$/;
const STRONGS_EMBEDDED_PATTERN = /(?:^|\b)(?:strong:)?([HG])\s*0*(\d+)\b/i;
const STRONGS_SEARCH_LIMIT = 50;

const LOOKUP_INDEX = new Map<string, StrongsEntry>();

function registerLookupKey(key: string, entry: StrongsEntry): void {
  LOOKUP_INDEX.set(key.toUpperCase(), entry);
}

function indexDictionary(dictionary: StrongsDictionaryData): void {
  for (const entry of Object.values(dictionary)) {
    registerLookupKey(entry.strongsNumber, entry);
    const canonical = normalizeStrongsNumber(entry.strongsNumber);
    if (canonical) {
      registerLookupKey(canonical, entry);
    }
  }
}

indexDictionary(HEBREW);
indexDictionary(GREEK);

export interface StrongsLookupResult {
  raw: string | null;
  canonical: string | null;
  entry: StrongsEntry | null;
}

export function looksLikeStrongsQuery(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  return (
    STRONGS_NUMBER_PATTERN.test(trimmed) ||
    BARE_STRONGS_NUMBER_PATTERN.test(trimmed) ||
    STRONGS_EMBEDDED_PATTERN.test(trimmed)
  );
}

export function isStrongsDataInstalled(): boolean {
  return Object.keys(GREEK).length > 0 && Object.keys(HEBREW).length > 0;
}

export function normalizeStrongsNumber(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const direct = trimmed.match(STRONGS_NUMBER_PATTERN);
  if (direct) {
    return `${direct[1].toUpperCase()}${direct[2]}`;
  }

  const embedded = trimmed.match(STRONGS_EMBEDDED_PATTERN);
  if (embedded) {
    return `${embedded[1].toUpperCase()}${embedded[2]}`;
  }

  return null;
}

function lookupByCanonical(canonical: string): StrongsEntry | null {
  return LOOKUP_INDEX.get(canonical.toUpperCase()) ?? null;
}

function lookupBareStrongsNumber(digits: string, hint?: 'H' | 'G'): StrongsEntry | null {
  if (hint === 'H') {
    return lookupByCanonical(`H${digits}`);
  }
  if (hint === 'G') {
    return lookupByCanonical(`G${digits}`);
  }
  return lookupByCanonical(`H${digits}`) ?? lookupByCanonical(`G${digits}`);
}

export function lookupStrongsTag(
  raw: string | null | undefined,
  languageHint?: 'H' | 'G',
): StrongsLookupResult {
  if (!raw) {
    return { raw: null, canonical: null, entry: null };
  }

  const trimmed = raw.trim();
  const canonical = normalizeStrongsNumber(trimmed);
  if (canonical) {
    return {
      raw: trimmed,
      canonical,
      entry: lookupByCanonical(canonical),
    };
  }

  if (BARE_STRONGS_NUMBER_PATTERN.test(trimmed)) {
    const entry = lookupBareStrongsNumber(trimmed, languageHint);
    const prefix = entry?.strongsNumber.charAt(0) as 'H' | 'G' | undefined;
    return {
      raw: trimmed,
      canonical: prefix ? `${prefix}${trimmed}` : null,
      entry,
    };
  }

  return { raw: trimmed, canonical: null, entry: null };
}

export function lookupStrongsNumber(
  raw: string,
  languageHint?: 'H' | 'G',
): StrongsEntry | null {
  return lookupStrongsTag(raw, languageHint).entry;
}

function normalizeEnglishTerm(term: string): string {
  return term.trim().toLowerCase();
}

function kjvUsageTokens(kjvUsage: string): string[] {
  return kjvUsage
    .toLowerCase()
    .split(/[,;]+/)
    .map((token) => token.replace(/^\[[^\]]+\]\s*/, '').trim())
    .filter(Boolean);
}

function entryMatchesEnglishWord(entry: StrongsEntry, term: string): boolean {
  const normalized = normalizeEnglishTerm(term);
  if (!normalized) return false;

  if (entry.strongsNumber.toLowerCase() === normalized) {
    return true;
  }

  if (entry.transliteration.toLowerCase().includes(normalized)) {
    return true;
  }

  if (entry.definition.toLowerCase().includes(normalized)) {
    return true;
  }

  return kjvUsageTokens(entry.kjvUsage).some(
    (token) => token === normalized || token.includes(normalized),
  );
}

function searchDictionary(
  dictionary: StrongsDictionaryData,
  term: string,
): StrongsEntry[] {
  const matches: StrongsEntry[] = [];
  for (const entry of Object.values(dictionary)) {
    if (entryMatchesEnglishWord(entry, term)) {
      matches.push(entry);
      if (matches.length >= STRONGS_SEARCH_LIMIT) {
        break;
      }
    }
  }
  return matches;
}

export const WORD_STUDY_MATCH_LIMIT = 8;

export function searchPossibleStrongsMatchesForEnglishWord(
  term: string,
): StrongsEntry[] {
  const normalized = normalizeEnglishTerm(term);
  if (!normalized) return [];

  const all = searchStrongsByEnglishWord(term);
  const exact: StrongsEntry[] = [];
  const rest: StrongsEntry[] = [];

  for (const entry of all) {
    const isExact = kjvUsageTokens(entry.kjvUsage).some((token) => token === normalized);
    if (isExact) {
      exact.push(entry);
    } else {
      rest.push(entry);
    }
  }

  return [...exact, ...rest].slice(0, WORD_STUDY_MATCH_LIMIT);
}

export function searchStrongsByEnglishWord(term: string): StrongsEntry[] {
  const normalized = normalizeEnglishTerm(term);
  if (!normalized) return [];

  const greekMatches = searchDictionary(GREEK, normalized);
  if (greekMatches.length >= STRONGS_SEARCH_LIMIT) {
    return greekMatches;
  }

  const hebrewMatches = searchDictionary(HEBREW, normalized);
  const combined = [...greekMatches];
  for (const entry of hebrewMatches) {
    if (combined.length >= STRONGS_SEARCH_LIMIT) break;
    combined.push(entry);
  }
  return combined;
}

export function searchStrongs(query: string): StrongsSearchResponse {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query: '', mode: 'word', totalCount: 0, results: [] };
  }

  if (looksLikeStrongsQuery(trimmed)) {
    const lookup = lookupStrongsTag(trimmed);
    if (lookup.canonical) {
      return {
        query: lookup.canonical,
        mode: 'number',
        totalCount: lookup.entry ? 1 : 0,
        results: lookup.entry ? [lookup.entry] : [],
      };
    }

    const bareMatches = lookupBareStrongsNumber(trimmed);
    return {
      query: trimmed,
      mode: 'number',
      totalCount: bareMatches ? 1 : 0,
      results: bareMatches ? [bareMatches] : [],
    };
  }

  const results = searchStrongsByEnglishWord(trimmed);
  return {
    query: trimmed,
    mode: 'word',
    totalCount: results.length,
    results,
  };
}
