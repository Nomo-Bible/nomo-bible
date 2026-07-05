import type { CrossReference, PassageKey } from '@/types/study';

/**
 * Cross-reference data will be supplied by the Knowledge Base in a future phase.
 * This service defines the retrieval boundary for passage-scoped references.
 */
export function loadCrossReferencesForPassage(
  _passageKey: PassageKey,
): CrossReference[] {
  return [];
}
