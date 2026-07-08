import { getSupabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type { BibleHighlight, HighlightColor, VerseRef } from '@/types/scriptureInteraction';
import { verseKey } from '@/types/scriptureInteraction';

const LOCAL_STORAGE_PREFIX = 'nomomartyria-bible-highlights-v1';

interface HighlightRow {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  created_at: string;
  updated_at: string;
}

function rowToHighlight(row: HighlightRow): BibleHighlight {
  return {
    id: row.id,
    userId: row.user_id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    color: row.color as HighlightColor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function localStorageKey(userId: string): string {
  return `${LOCAL_STORAGE_PREFIX}:${userId}`;
}

function loadLocalHighlights(userId: string): BibleHighlight[] {
  try {
    const raw = localStorage.getItem(localStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BibleHighlight[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalHighlights(userId: string, highlights: BibleHighlight[]): void {
  localStorage.setItem(localStorageKey(userId), JSON.stringify(highlights));
}

export async function loadHighlightsForChapter(
  userId: string,
  book: string,
  chapter: number,
): Promise<Map<string, HighlightColor>> {
  const map = new Map<string, HighlightColor>();

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bible_highlights')
        .select('*')
        .eq('user_id', userId)
        .eq('book', book)
        .eq('chapter', chapter);

      if (!error && data) {
        for (const row of data as HighlightRow[]) {
          const highlight = rowToHighlight(row);
          map.set(verseKey(highlight), highlight.color);
        }
        return map;
      }
    }
  }

  const local = loadLocalHighlights(userId);
  for (const highlight of local) {
    if (highlight.book === book && highlight.chapter === chapter) {
      map.set(verseKey(highlight), highlight.color);
    }
  }
  return map;
}

export async function upsertHighlight(
  userId: string,
  ref: VerseRef,
  color: HighlightColor,
): Promise<BibleHighlight | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bible_highlights')
        .upsert(
          {
            user_id: userId,
            book: ref.book,
            chapter: ref.chapter,
            verse: ref.verse,
            color,
            updated_at: now,
          },
          { onConflict: 'user_id,book,chapter,verse' },
        )
        .select()
        .single();

      if (!error && data) {
        return rowToHighlight(data as HighlightRow);
      }
    }
  }

  const local = loadLocalHighlights(userId);
  const key = verseKey(ref);
  const existingIndex = local.findIndex((h) => verseKey(h) === key);
  const record: BibleHighlight = {
    id:
      existingIndex >= 0
        ? local[existingIndex].id
        : `local-${crypto.randomUUID()}`,
    userId,
    book: ref.book,
    chapter: ref.chapter,
    verse: ref.verse,
    color,
    createdAt: existingIndex >= 0 ? local[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    local[existingIndex] = record;
  } else {
    local.push(record);
  }
  saveLocalHighlights(userId, local);
  return record;
}

export async function deleteHighlight(
  userId: string,
  ref: VerseRef,
): Promise<boolean> {
  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('bible_highlights')
        .delete()
        .eq('user_id', userId)
        .eq('book', ref.book)
        .eq('chapter', ref.chapter)
        .eq('verse', ref.verse);

      if (!error) return true;
    }
  }

  const local = loadLocalHighlights(userId);
  const key = verseKey(ref);
  const next = local.filter((h) => verseKey(h) !== key);
  if (next.length === local.length) return false;
  saveLocalHighlights(userId, next);
  return true;
}

export async function deleteHighlights(
  userId: string,
  refs: VerseRef[],
): Promise<void> {
  await Promise.all(refs.map((ref) => deleteHighlight(userId, ref)));
}
