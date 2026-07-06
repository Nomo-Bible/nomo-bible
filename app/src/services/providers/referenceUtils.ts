import { parseScriptureReference } from '@/services/passageKeyService';
import type { PassageKey } from '@/types/study';

export function verseKeyFromPassage(passageKey: PassageKey): string | null {
  const parsed = parseScriptureReference(passageKey);
  if (!parsed || parsed.verse === null) return null;
  return `${parsed.chapter}:${parsed.verse}`;
}

export function bookSlugFromPassage(passageKey: PassageKey): string | null {
  const parsed = parseScriptureReference(passageKey);
  if (!parsed) return null;
  return parsed.book.toLowerCase().replace(/\s+/g, '-');
}

export function isVerseLevelPassage(passageKey: PassageKey): boolean {
  return verseKeyFromPassage(passageKey) !== null;
}
