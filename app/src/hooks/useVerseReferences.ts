import { useEffect, useState } from 'react';
import {
  commentaryProvider,
  crossReferenceProvider,
  ellenWhiteReferenceProvider,
} from '@/services/providers';
import type {
  CommentaryEntry,
  EllenWhiteReferenceEntry,
  PublicCrossReference,
} from '@/types/referenceProviders';
import type { PassageKey } from '@/types/study';
import { isVerseLevelPassage } from '@/services/providers/referenceUtils';

export interface VerseReferenceBundle {
  loading: boolean;
  error: string | null;
  publicCrossReferences: PublicCrossReference[];
  commentary: CommentaryEntry[];
  ellenWhite: EllenWhiteReferenceEntry[];
  tskAttribution: string | null;
}

const EMPTY: VerseReferenceBundle = {
  loading: false,
  error: null,
  publicCrossReferences: [],
  commentary: [],
  ellenWhite: [],
  tskAttribution: null,
};

export function useVerseReferences(passageKey: PassageKey): VerseReferenceBundle {
  const [state, setState] = useState<VerseReferenceBundle>({
    ...EMPTY,
    loading: true,
  });

  useEffect(() => {
    if (!isVerseLevelPassage(passageKey)) {
      setState({ ...EMPTY });
      return;
    }

    let cancelled = false;

    async function load() {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const [publicCrossReferences, commentary, ellenWhite] = await Promise.all([
          crossReferenceProvider.getCrossReferences(passageKey),
          commentaryProvider.getCommentary(passageKey),
          ellenWhiteReferenceProvider.getReferences(passageKey),
        ]);

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          publicCrossReferences,
          commentary,
          ellenWhite,
          tskAttribution: crossReferenceProvider.source.attribution ?? null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          ...EMPTY,
          error:
            err instanceof Error
              ? err.message
              : 'Could not load reference data for this verse.',
        });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [passageKey]);

  return state;
}
