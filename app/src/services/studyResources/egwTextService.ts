import {
  EGW_TEXT_MANIFEST,
  hasBundledEgwText,
  type EgwTextChapterRef,
} from '@/data/resources/egw/manifest';
import stepsToChristChapter01 from '@/data/resources/egw/steps-to-christ/chapter-01.md?raw';
import { getEgwBookById } from '@/data/resources/catalog/egwBooks';

const CHAPTER_CONTENT: Record<string, string> = {
  'steps-to-christ/chapter-01': stepsToChristChapter01,
};

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

function loadChapterContent(ref: EgwTextChapterRef): EgwBookChapter | null {
  const content = CHAPTER_CONTENT[ref.contentKey];
  if (!content) return null;
  return {
    id: ref.id,
    title: ref.title,
    content,
  };
}

export function isEgwTextImported(bookId: string): boolean {
  if (!hasBundledEgwText(bookId)) return false;
  const manifest = EGW_TEXT_MANIFEST[bookId];
  return manifest.chapters.some((chapter) => Boolean(CHAPTER_CONTENT[chapter.contentKey]));
}

export function loadEgwBookText(bookId: string): EgwBookText | null {
  const book = getEgwBookById(bookId);
  const manifest = EGW_TEXT_MANIFEST[bookId];
  if (!book || !manifest) return null;

  const chapters = manifest.chapters
    .map((ref) => loadChapterContent(ref))
    .filter((chapter): chapter is EgwBookChapter => chapter !== null);

  if (chapters.length === 0) return null;

  return {
    bookId,
    title: book.title,
    author: book.author,
    sourceName: book.sourceName,
    sourceUrl: book.sourceUrl,
    chapters,
  };
}

export { hasBundledEgwText };
