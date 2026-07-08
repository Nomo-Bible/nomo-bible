/** Maps catalog book IDs to onboard public text files under /resources/egw/. */

export interface EgwBookTextManifest {
  bookId: string;
  /** Public URL path served from app/public/resources/egw/ */
  localTextPath: string;
}

export const EGW_TEXT_MANIFEST: Record<string, EgwBookTextManifest> = {
  'egw-great-controversy': {
    bookId: 'egw-great-controversy',
    localTextPath: '/resources/egw/great-controversy.txt',
  },
  'egw-steps-to-christ': {
    bookId: 'egw-steps-to-christ',
    localTextPath: '/resources/egw/steps-to-christ.txt',
  },
  'egw-desire-of-ages': {
    bookId: 'egw-desire-of-ages',
    localTextPath: '/resources/egw/desire-of-ages.txt',
  },
  'egw-patriarchs-and-prophets': {
    bookId: 'egw-patriarchs-and-prophets',
    localTextPath: '/resources/egw/patriarchs-and-prophets.txt',
  },
  'egw-prophets-and-kings': {
    bookId: 'egw-prophets-and-kings',
    localTextPath: '/resources/egw/prophets-and-kings.txt',
  },
  'egw-acts-of-apostles': {
    bookId: 'egw-acts-of-apostles',
    localTextPath: '/resources/egw/acts-of-apostles.txt',
  },
  'egw-christs-object-lessons': {
    bookId: 'egw-christs-object-lessons',
    localTextPath: '/resources/egw/christs-object-lessons.txt',
  },
  'egw-thoughts-from-mount-of-blessing': {
    bookId: 'egw-thoughts-from-mount-of-blessing',
    localTextPath: '/resources/egw/thoughts-from-mount-of-blessing.txt',
  },
  'egw-early-writings': {
    bookId: 'egw-early-writings',
    localTextPath: '/resources/egw/early-writings.txt',
  },
};

export function hasBundledEgwText(bookId: string): boolean {
  return Boolean(EGW_TEXT_MANIFEST[bookId]?.localTextPath);
}

export function getEgwLocalTextPath(bookId: string): string | null {
  return EGW_TEXT_MANIFEST[bookId]?.localTextPath ?? null;
}
