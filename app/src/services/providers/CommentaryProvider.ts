import type {
  CommentaryEntry,
  CommentaryProvider,
  CommentarySourceFile,
} from '@/types/referenceProviders';
import type { PassageKey } from '@/types/study';
import { isVerseLevelPassage } from '@/services/providers/referenceUtils';

const sourceModules = import.meta.glob<CommentarySourceFile>(
  '../../data/reference/commentary/*.json',
);

const sourceCache = new Map<string, CommentarySourceFile>();

async function loadSourceFile(sourceId: string): Promise<CommentarySourceFile | null> {
  if (sourceCache.has(sourceId)) {
    return sourceCache.get(sourceId)!;
  }

  const path = `../../data/reference/commentary/${sourceId}.json`;
  const loader = sourceModules[path];
  if (!loader) return null;

  const module = await loader();
  const data =
    'default' in module ? (module as { default: CommentarySourceFile }).default : module;
  sourceCache.set(sourceId, data);
  return data;
}

const SOURCE_IDS = ['matthew-henry', 'jfb'] as const;

export class PublicDomainCommentaryProvider implements CommentaryProvider {
  async getCommentary(verseReference: PassageKey): Promise<CommentaryEntry[]> {
    if (!isVerseLevelPassage(verseReference)) return [];

    const results: CommentaryEntry[] = [];

    for (const sourceId of SOURCE_IDS) {
      const file = await loadSourceFile(sourceId);
      if (!file) continue;

      const rows = file.entries[verseReference] ?? [];
      for (const row of rows) {
        results.push({
          ...row,
          verseReference,
          sourceId: row.sourceId || file.meta.sourceId,
          sourceName: row.sourceName || file.meta.sourceName,
        });
      }
    }

    return results;
  }
}

export const commentaryProvider = new PublicDomainCommentaryProvider();
