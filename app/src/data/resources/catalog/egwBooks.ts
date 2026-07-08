import type { EgwBookCatalogEntry } from '@/types/resourceCatalog';

const WHITE_ESTATE_LEGAL = 'https://whiteestate.org/legal-notice/';
const EGW_WRITINGS = 'https://whiteestate.org/resources/apps/web/';
const PD_NOTE =
  'Full public-domain text bundled for in-app reading (CCEL / Internet Archive). Official source link provided for reference only.';

/** Official EGW Writings permalinks (Ellen G. White Estate) — reference only. */
export const EGW_BOOK_CATALOG: EgwBookCatalogEntry[] = [
  {
    id: 'egw-great-controversy',
    title: 'The Great Controversy',
    author: 'Ellen G. White',
    description:
      'The conflict between Christ and Satan through history, prophecy, and the final triumph of God’s kingdom.',
    readOnlineUrl: 'https://egwwritings.org/book/43',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/great-controversy.txt',
    relatedTopics: ['Great Controversy', 'Second Coming', 'Three Angels\' Messages'],
    relatedBibleRefs: ['Revelation 12:7-9', 'Daniel 7', 'Revelation 14'],
  },
  {
    id: 'egw-steps-to-christ',
    title: 'Steps to Christ',
    author: 'Ellen G. White',
    description:
      'A concise introduction to the Christian life — the nature of God, repentance, faith, and growing in Christ.',
    readOnlineUrl: 'https://egwwritings.org/book/70',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/steps-to-christ.txt',
    relatedTopics: ['Law and Gospel', 'Spirit of Prophecy'],
    relatedBibleRefs: ['John 3:16', 'Romans 8:28'],
  },
  {
    id: 'egw-desire-of-ages',
    title: 'The Desire of Ages',
    author: 'Ellen G. White',
    description:
      'The life of Christ — His incarnation, ministry, death, and resurrection as the center of Scripture.',
    readOnlineUrl: 'https://egwwritings.org/book/42',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/desire-of-ages.txt',
    relatedTopics: ['Sanctuary', 'Law and Gospel', 'Second Coming'],
    relatedBibleRefs: ['John 1:14', 'Hebrews 9:11-12'],
  },
  {
    id: 'egw-patriarchs-and-prophets',
    title: 'Patriarchs and Prophets',
    author: 'Ellen G. White',
    description:
      'From creation through the kingdom of Israel — the opening volume of the Conflict of the Ages series.',
    readOnlineUrl: 'https://egwwritings.org/book/36',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/patriarchs-and-prophets.txt',
    relatedTopics: ['Sanctuary', 'Sabbath', 'Law and Gospel'],
    relatedBibleRefs: ['Genesis 1', 'Exodus 25', 'Hebrews 11'],
  },
  {
    id: 'egw-prophets-and-kings',
    title: 'Prophets and Kings',
    author: 'Ellen G. White',
    description:
      'Israel’s monarchy, exile, and return — prophets, kings, and the preparation for the Messiah.',
    readOnlineUrl: 'https://egwwritings.org/book/37',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/prophets-and-kings.txt',
    relatedTopics: ['Spirit of Prophecy', 'Second Coming'],
    relatedBibleRefs: ['1 Kings 8', 'Daniel 2', 'Isaiah 53'],
  },
  {
    id: 'egw-acts-of-apostles',
    title: 'The Acts of the Apostles',
    author: 'Ellen G. White',
    description:
      'The early church, Pentecost, missionary expansion, and lessons for God’s people today.',
    readOnlineUrl: 'https://egwwritings.org/book/38',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/acts-of-apostles.txt',
    relatedTopics: ['Three Angels\' Messages', 'Testimony of Jesus'],
    relatedBibleRefs: ['Acts 2', 'Acts 8', 'Revelation 14'],
  },
  {
    id: 'egw-christs-object-lessons',
    title: 'Christ’s Object Lessons',
    author: 'Ellen G. White',
    description:
      'Parables of Christ explained for practical Christian living and spiritual growth.',
    readOnlineUrl: 'https://egwwritings.org/book/40',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/christs-object-lessons.txt',
    relatedTopics: ['Law and Gospel', 'Spirit of Prophecy'],
    relatedBibleRefs: ['Matthew 13', 'Luke 15'],
  },
  {
    id: 'egw-thoughts-from-mount-of-blessing',
    title: 'Thoughts from the Mount of Blessing',
    author: 'Ellen G. White',
    description:
      'A study of the Sermon on the Mount — the character and kingdom Christ taught.',
    readOnlineUrl: 'https://egwwritings.org/book/39',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/thoughts-from-mount-of-blessing.txt',
    relatedTopics: ['Law and Gospel', 'Sanctuary'],
    relatedBibleRefs: ['Matthew 5', 'Matthew 6', 'Matthew 7'],
  },
  {
    id: 'egw-early-writings',
    title: 'Early Writings',
    author: 'Ellen G. White',
    description:
      'Early visions and counsel on the Advent movement, sanctuary, Sabbath, and end-time prophecy.',
    readOnlineUrl: 'https://egwwritings.org/book/41',
    sourceName: 'Ellen G. White Estate — EGW Writings',
    sourceUrl: EGW_WRITINGS,
    licenseNotes: PD_NOTE,
    localTextAvailable: true,
    localTextPath: '/resources/egw/early-writings.txt',
    relatedTopics: ['Second Coming', 'Sanctuary', 'Spirit of Prophecy'],
    relatedBibleRefs: ['Daniel 8:14', 'Revelation 14:12'],
  },
];

export const EGW_CCEL_STEPS_URL = 'https://ccel.org/ccel/white/steps.i.html';
export const EGW_WHITE_ESTATE_LEGAL_URL = WHITE_ESTATE_LEGAL;

export function getEgwBookById(id: string): EgwBookCatalogEntry | undefined {
  return EGW_BOOK_CATALOG.find((book) => book.id === id);
}
