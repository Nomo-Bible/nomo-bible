import type { ScriptureReference } from '@/types/bible';
import type { StrongsEntry } from '@/types/strongs';

export type WordStudyLookupStatus = 'untagged' | 'found' | 'missing-definition';

export interface WordStudyAnchor {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface WordStudySelection {
  word: string;
  normalizedText: string;
  reference: ScriptureReference;
  referenceLabel: string;
  tokenIndex: number;
  tokenId: string;
  strongsNumber: string | null;
  normalizedStrongsNumber: string | null;
  status: WordStudyLookupStatus;
}

export interface SyncedWordStudy {
  selection: WordStudySelection;
  entry: StrongsEntry | null;
}
