import { getEgwBookById } from '@/data/resources/catalog/egwBooks';
import {
  EGW_TEXT_MANIFEST,
  getEgwLocalTextPath,
  hasBundledEgwText,
} from '@/data/resources/egw/manifest';
import { parseEgwChapters } from '@/utils/parseEgwPlainText';

export interface EgwBookChapter {
  id: string;
  title: string;
  content: string;
}

export interface EgwBookText {
  bookId: string;
  title: string;
  author: string;
  sourceName: string;
  sourceUrl: string;
  chapters: EgwBookChapter[];
}

const textCache = new Map<string, string>();
const bookCache = new Map<string, EgwBookText | null>();

async function fetchLocalText(path: string): Promise<string | null> {
  if (textCache.has(path)) {
    return textCache.get(path) ?? null;
  }

  const response = await fetch(path);
  if (!response.ok) {
    return null;
  }

  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  textCache.set(path, text);
  return text;
}

export function isEgwTextConfigured(bookId: string): boolean {
  return hasBundledEgwText(bookId);
}

export async function isEgwTextImported(bookId: string): Promise<boolean> {
  const path = getEgwLocalTextPath(bookId);
  if (!path) return false;

  if (textCache.has(path)) {
    return Boolean(textCache.get(path)?.trim());
  }

  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function loadEgwBookText(bookId: string): Promise<EgwBookText | null> {
  if (bookCache.has(bookId)) {
    return bookCache.get(bookId) ?? null;
  }

  const book = getEgwBookById(bookId);
  const manifest = EGW_TEXT_MANIFEST[bookId];
  const path = manifest?.localTextPath;
  if (!book || !path) {
    bookCache.set(bookId, null);
    return null;
  }

  const rawText = await fetchLocalText(path);
  if (!rawText) {
    bookCache.set(bookId, null);
    return null;
  }

  const chapters = parseEgwChapters(rawText);
  if (chapters.length === 0) {
    bookCache.set(bookId, null);
    return null;
  }

  const bookText: EgwBookText = {
    bookId,
    title: book.title,
    author: book.author,
    sourceName: book.sourceName,
    sourceUrl: book.sourceUrl,
    chapters,
  };

  bookCache.set(bookId, bookText);
  return bookText;
}

export { hasBundledEgwText, getEgwLocalTextPath };
