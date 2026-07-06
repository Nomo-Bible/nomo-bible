import { lookupStrongsTag } from '@/services/strongsService';
import type { StrongsEntry } from '@/types/strongs';
import type { VerseWordToken } from '@/types/verseTokens';
import type { ScriptureReference } from '@/types/bible';
import type { WordStudyLookupStatus } from '@/types/wordStudy';

export interface ResolvedWordStudy {
  token: VerseWordToken;
  tokenIndex: number;
  reference: ScriptureReference;
  referenceLabel: string;
  displayedText: string;
  normalizedText: string;
  strongsNumber: string | null;
  normalizedStrongsNumber: string | null;
  entry: StrongsEntry | null;
  status: WordStudyLookupStatus;
}

export function normalizeTokenText(text: string): string {
  return text
    .replace(/^[^A-Za-z\u2019']+|[^A-Za-z\u2019']+$/g, '')
    .toLowerCase();
}

function languageHintForBook(book: string): 'H' | 'G' | undefined {
  const ot = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
    'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles',
    '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  ]);
  if (ot.has(book)) return 'H';
  return 'G';
}

export function resolveWordStudyFromToken(
  token: VerseWordToken,
  tokenIndex: number,
  reference: ScriptureReference,
  referenceLabel: string,
): ResolvedWordStudy {
  const displayedText = token.text;
  const normalizedText = normalizeTokenText(token.text);
  const languageHint = languageHintForBook(reference.book);
  const lookup = lookupStrongsTag(token.strongs, languageHint);

  const status: WordStudyLookupStatus = !lookup.canonical
    ? 'untagged'
    : lookup.entry
      ? 'found'
      : 'missing-definition';

  const resolved: ResolvedWordStudy = {
    token,
    tokenIndex,
    reference,
    referenceLabel,
    displayedText,
    normalizedText,
    strongsNumber: token.strongs,
    normalizedStrongsNumber: lookup.canonical,
    entry: lookup.entry,
    status,
  };

  if (import.meta.env.DEV) {
    console.debug('[word-study]', {
      clickedWord: displayedText,
      normalizedText,
      reference: referenceLabel,
      tokenIndex,
      strongsNumber: token.strongs,
      normalizedStrongsNumber: lookup.canonical,
      definitionFound: Boolean(lookup.entry),
      status,
    });
  }

  return resolved;
}

export function wordStudyStatusMessage(resolved: ResolvedWordStudy): string | null {
  if (resolved.status === 'untagged') {
    return 'No Strong\u2019s tag is linked to this word yet.';
  }
  if (resolved.status === 'missing-definition') {
    return `This word is tagged as ${resolved.normalizedStrongsNumber ?? resolved.strongsNumber}, but no definition was found in the installed Strong\u2019s data.`;
  }
  return null;
}
