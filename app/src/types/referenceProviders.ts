import type { PassageKey } from '@/types/study';

/** Shared metadata for a licensed reference dataset. */
export interface ReferenceSourceMeta {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  redistributionAllowed: boolean;
  attributionRequired: boolean;
  attribution?: string;
  dateChecked: string;
  notes?: string;
}

/** Public-domain or user cross-reference from Treasury of Scripture Knowledge, etc. */
export interface PublicCrossReference {
  targetReference: string;
  note?: string;
  sourceId: string;
  sourceName: string;
}

/** Commentary entry — excerpt only when license permits embedding. */
export interface CommentaryEntry {
  id: string;
  verseReference: PassageKey;
  sourceId: string;
  sourceName: string;
  reference: string;
  summary: string;
  excerpt?: string;
  textEmbedded: boolean;
  externalUrl: string;
  license: string;
  attribution: string;
  attributionRequired: boolean;
  redistributionAllowed: boolean;
}

/** Ellen G. White reference link — no embedded book text unless licensed. */
export interface EllenWhiteReferenceEntry {
  id: string;
  verseReference: PassageKey;
  egwReference: string;
  summary: string;
  sourceType: 'EGW Reference';
  externalUrl: string;
  attribution: string;
  licenseNote: string;
  textEmbedded: false;
}

export type ReferencePanelTabId =
  | 'cross-references'
  | 'commentary'
  | 'ellen-white'
  | 'my-notes';

export interface CrossReferenceProvider {
  readonly source: ReferenceSourceMeta;
  getCrossReferences(verseReference: PassageKey): Promise<PublicCrossReference[]>;
}

export interface CommentaryProvider {
  getCommentary(verseReference: PassageKey): Promise<CommentaryEntry[]>;
}

export interface EllenWhiteReferenceProvider {
  getReferences(verseReference: PassageKey): Promise<EllenWhiteReferenceEntry[]>;
}

/** On-disk shape for per-book TSK cross-reference bundles. */
export interface CrossReferenceBookFile {
  meta: ReferenceSourceMeta;
  verses: Record<string, PublicCrossReference[]>;
}

/** On-disk shape for commentary source bundles keyed by full verse reference. */
export interface CommentarySourceFile {
  meta: ReferenceSourceMeta;
  entries: Record<PassageKey, Omit<CommentaryEntry, 'verseReference'>[]>;
}

/** On-disk shape for EGW reference index. */
export interface EllenWhiteReferenceFile {
  meta: ReferenceSourceMeta;
  entries: Record<PassageKey, Omit<EllenWhiteReferenceEntry, 'verseReference'>[]>;
}
