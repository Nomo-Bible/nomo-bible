import {
  KJV_WORD_GUIDE_ENTRIES,
} from '@/data/kjvWordGuide';
import {
  categoryTitle,
  type KjvWordCategoryId,
  type KjvWordEntry,
} from '@/types/kjvWordGuide';

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function entrySearchBlob(entry: KjvWordEntry): string {
  const parts = [
    entry.word,
    entry.meaning,
    categoryTitle(entry.category),
    entry.note ?? '',
    ...(entry.aliases ?? []),
  ];
  return normalizeToken(parts.join(' '));
}

export function normalizeKjvGuideWord(word: string): string {
  return normalizeToken(word).replace(/\s+/g, ' ');
}

export function findKjvWordGuideMatches(word: string): KjvWordEntry[] {
  const normalized = normalizeKjvGuideWord(word);
  if (!normalized) return [];

  const exact = KJV_WORD_GUIDE_ENTRIES.filter(
    (entry) => normalizeKjvGuideWord(entry.word) === normalized,
  );
  if (exact.length > 0) return exact;

  const aliasHits = KJV_WORD_GUIDE_ENTRIES.filter((entry) =>
    (entry.aliases ?? []).some((alias) => normalizeKjvGuideWord(alias) === normalized),
  );
  if (aliasHits.length > 0) return aliasHits;

  return KJV_WORD_GUIDE_ENTRIES.filter((entry) => {
    const entryWord = normalizeKjvGuideWord(entry.word);
    return entryWord === normalized || entryWord.startsWith(`${normalized} `);
  });
}

export function hasKjvWordGuideEntry(word: string): boolean {
  return findKjvWordGuideMatches(word).length > 0;
}

export function searchKjvWordGuide(query: string): KjvWordEntry[] {
  const normalized = normalizeToken(query);
  if (!normalized) return [...KJV_WORD_GUIDE_ENTRIES];

  const tokens = normalized.split(' ').filter(Boolean);

  return KJV_WORD_GUIDE_ENTRIES.filter((entry) => {
    const blob = entrySearchBlob(entry);
    return tokens.every((token) => blob.includes(token));
  });
}

export function filterKjvWordGuideByLetter(
  entries: KjvWordEntry[],
  letter: string | null,
): KjvWordEntry[] {
  if (!letter) return entries;
  const upper = letter.toUpperCase();
  return entries.filter((entry) => entry.word.charAt(0).toUpperCase() === upper);
}

export function groupKjvWordGuideByCategory(
  entries: KjvWordEntry[],
): Partial<Record<KjvWordCategoryId, KjvWordEntry[]>> {
  const grouped: Partial<Record<KjvWordCategoryId, KjvWordEntry[]>> = {};
  for (const entry of entries) {
    const list = grouped[entry.category] ?? [];
    list.push(entry);
    grouped[entry.category] = list;
  }
  return grouped;
}

export function formatKjvWordEntryPlain(entry: KjvWordEntry): string {
  const lines = [
    capitalizeWord(entry.word),
    `Meaning: ${entry.meaning}`,
    `Category: ${categoryTitle(entry.category)}`,
  ];
  if (entry.note) {
    lines.push(`Note: ${entry.note}`);
  }
  return lines.join('\n');
}

export function formatKjvWordEntryNoteHtml(entry: KjvWordEntry): string {
  const title = capitalizeWord(entry.word);
  const lines = [
    `<p><strong>${escapeHtml(title)}</strong></p>`,
    `<p>Meaning: ${escapeHtml(entry.meaning)}</p>`,
    `<p>Category: ${escapeHtml(categoryTitle(entry.category))}</p>`,
  ];
  if (entry.note) {
    lines.push(`<p>Note: ${escapeHtml(entry.note)}</p>`);
  }
  return lines.join('');
}

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const KJV_WORD_GUIDE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const KJV_WORD_GUIDE_INSERT_EVENT = 'nomomartyria:insert-kjv-word-guide';
