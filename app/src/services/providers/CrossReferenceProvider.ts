import type {
  CrossReferenceBookFile,
  CrossReferenceProvider,
  PublicCrossReference,
  ReferenceSourceMeta,
} from '@/types/referenceProviders';
import type { PassageKey } from '@/types/study';
import {
  bookSlugFromPassage,
  isVerseLevelPassage,
  verseKeyFromPassage,
} from '@/services/providers/referenceUtils';

const TSK_META: ReferenceSourceMeta = {
  sourceId: 'tsk-openbible',
  sourceName: 'Treasury of Scripture Knowledge (OpenBible.info derivative)',
  sourceUrl: 'https://www.openbible.info/labs/cross-references/',
  license: 'CC BY 3.0 (derivative); underlying TSK public domain',
  redistributionAllowed: true,
  attributionRequired: true,
  attribution:
    'Cross-reference data derived from the Treasury of Scripture Knowledge via OpenBible.info (CC BY).',
  dateChecked: '2026-07-06',
  notes:
    'Bundled per-book JSON. Full corpus can be rebuilt with scripts/reference/build-tsk-crossrefs.mjs.',
};

const bookModules = import.meta.glob<CrossReferenceBookFile>(
  '../../data/reference/crossrefs/*.json',
);

const bookCache = new Map<string, CrossReferenceBookFile>();

async function loadBookFile(slug: string): Promise<CrossReferenceBookFile | null> {
  if (bookCache.has(slug)) {
    return bookCache.get(slug)!;
  }

  const path = `../../data/reference/crossrefs/${slug}.json`;
  const loader = bookModules[path];
  if (!loader) return null;

  const module = await loader();
  const data = 'default' in module ? (module as { default: CrossReferenceBookFile }).default : module;
  bookCache.set(slug, data);
  return data;
}

export class TreasuryCrossReferenceProvider implements CrossReferenceProvider {
  readonly source = TSK_META;

  async getCrossReferences(
    verseReference: PassageKey,
  ): Promise<PublicCrossReference[]> {
    if (!isVerseLevelPassage(verseReference)) return [];

    const slug = bookSlugFromPassage(verseReference);
    const verseKey = verseKeyFromPassage(verseReference);
    if (!slug || !verseKey) return [];

    const bookFile = await loadBookFile(slug);
    if (!bookFile) return [];

    return (bookFile.verses[verseKey] ?? []).map((entry) => ({
      ...entry,
      sourceId: entry.sourceId || this.source.sourceId,
      sourceName: entry.sourceName || this.source.sourceName,
    }));
  }
}

export const crossReferenceProvider = new TreasuryCrossReferenceProvider();
