/** Maps catalog book IDs to bundled local markdown chapters. */

export interface EgwTextChapterRef {
  id: string;
  title: string;
  /** Key into the chapter content registry in egwTextService. */
  contentKey: string;
}

export interface EgwBookTextManifest {
  bookId: string;
  chapters: EgwTextChapterRef[];
}

export const EGW_TEXT_MANIFEST: Record<string, EgwBookTextManifest> = {
  'egw-steps-to-christ': {
    bookId: 'egw-steps-to-christ',
    chapters: [
      {
        id: 'chapter-01',
        title: "Chapter 1 — God's Love for Man",
        contentKey: 'steps-to-christ/chapter-01',
      },
    ],
  },
};

export function hasBundledEgwText(bookId: string): boolean {
  const manifest = EGW_TEXT_MANIFEST[bookId];
  return Boolean(manifest && manifest.chapters.length > 0);
}
