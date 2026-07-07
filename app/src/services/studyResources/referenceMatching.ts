import type { PassageKey } from '@/types/study';

/** Parse comma- or newline-separated reference/topic lists from form input. */
export function parseListInput(input: string): string[] {
  return input
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatListInput(items: string[]): string {
  return items.join(', ');
}

function normalizeRef(ref: string): string {
  return ref.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Whether a stored Bible reference tag relates to the active passage.
 * Supports verse, chapter, and book-level tags.
 */
export function bibleRefMatchesPassage(
  storedRef: string,
  activePassageKey: PassageKey,
): boolean {
  const stored = normalizeRef(storedRef);
  const active = normalizeRef(activePassageKey);
  if (!stored || !active) return false;
  if (stored === active) return true;
  if (active.startsWith(`${stored}:`)) return true;
  if (active.startsWith(`${stored} `)) return true;
  return false;
}

export function passageMatchesAnyRef(
  passageKey: PassageKey,
  refs: string[],
): boolean {
  return refs.some((ref) => bibleRefMatchesPassage(ref, passageKey));
}

export function topicTagMatches(topic: { id: string; title: string }, tag: string): boolean {
  const normalized = tag.trim().toLowerCase();
  return (
    topic.id === tag ||
    topic.title.toLowerCase() === normalized ||
    topic.title.toLowerCase().includes(normalized)
  );
}

export function matchesTopicTag(
  tags: string[],
  topic: { id: string; title: string },
): boolean {
  return tags.some((tag) => topicTagMatches(topic, tag));
}
