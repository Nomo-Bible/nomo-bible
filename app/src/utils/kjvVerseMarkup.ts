/** Translator-supplied words: \+add … +add* */
export const KJV_SUPPLIED_WORD_PATTERN = /\\?\+add\s*([\s\S]*?)\\?\+add\*/g;

/** Divine-name variants in marginal notes: \+nd … +nd* */
export const KJV_DIVINE_NAME_NOTE_PATTERN = /\\?\+nd\s*([\s\S]*?)\\?\+nd\*/g;

/**
 * Embedded source cross-reference markers (e.g. " + 23.11"), not user cross-refs.
 * Often duplicated or followed by marginal note text — truncate at the first marker.
 */
export const KJV_EMBEDDED_XREF_PATTERN = /\s+\+\s+\d+(?:\.\d+)?/;

/** Divine-name source markers: LORD*, LORD's*, GOD*, JEHOVAH*, etc. */
export const KJV_DIVINE_NAME_MARKER_PATTERN =
  /\b(LORD|GOD|JEHOVAH)([\u2019']s)?\*/g;

/** Inline tokens rendered in the Scripture reader (after xref truncation). */
export const KJV_VERSE_RENDER_PATTERN =
  /\\?\+add\s*([\s\S]*?)\\?\+add\*|\\?\+nd\s*([\s\S]*?)\\?\+nd\*|\b(LORD|GOD|JEHOVAH)([\u2019']s)?\*/g;

/** Remove embedded xref markers and any trailing marginal note text. */
export function truncateAtEmbeddedXref(text: string): string {
  const match = KJV_EMBEDDED_XREF_PATTERN.exec(text);
  if (match && match.index !== undefined) {
    return text.slice(0, match.index);
  }
  return text;
}

function stripDivineNameMarkers(text: string): string {
  return text.replace(
    KJV_DIVINE_NAME_MARKER_PATTERN,
    (_match, name: string, possessive = '') => `${name}${possessive}`,
  );
}

function applyInlineMarkupReplacements(text: string): string {
  return stripDivineNameMarkers(
    text
      .replace(KJV_SUPPLIED_WORD_PATTERN, '$1')
      .replace(KJV_DIVINE_NAME_NOTE_PATTERN, '$1'),
  );
}

/**
 * Plain-text cleanup for Scripture snippets (search/concordance display).
 * Does not alter source data or search matching indexes.
 */
export function stripKjvEditorialMarkup(text: string): string {
  return applyInlineMarkupReplacements(truncateAtEmbeddedXref(text));
}

/** Verse body used by the Scripture reader before React markup is applied. */
export function prepareKjvVerseDisplayText(text: string): string {
  return truncateAtEmbeddedXref(text);
}

export function formatDivineNameDisplay(name: string, possessive = ''): string {
  return `${name}${possessive}`;
}
