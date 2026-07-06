import egwReferencesJson from '@/data/reference/egw-references.json';
import type {
  EllenWhiteReferenceEntry,
  EllenWhiteReferenceFile,
  EllenWhiteReferenceProvider,
} from '@/types/referenceProviders';
import type { PassageKey } from '@/types/study';
import { isVerseLevelPassage } from '@/services/providers/referenceUtils';

const egwFile = egwReferencesJson as EllenWhiteReferenceFile;

export class EllenWhiteReferenceLinkProvider implements EllenWhiteReferenceProvider {
  async getReferences(
    verseReference: PassageKey,
  ): Promise<EllenWhiteReferenceEntry[]> {
    if (!isVerseLevelPassage(verseReference)) return [];

    const file = egwFile;
    const rows = file.entries[verseReference] ?? [];

    return rows.map((row) => ({
      ...row,
      verseReference,
      textEmbedded: false as const,
    }));
  }
}

export const ellenWhiteReferenceProvider = new EllenWhiteReferenceLinkProvider();
