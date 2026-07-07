import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import type { StudyResourceKind } from '@/types/studyResources';

export const RESOURCE_KIND_LABELS: Record<StudyResourceKind, string> = {
  commentary: 'Commentary',
  egw: 'Ellen White',
  topic: 'Topic',
  chart: 'Chart',
  'study-guide': 'Study Guide',
};

export const RESOURCE_KIND_TAB: Partial<Record<StudyResourceKind, StudyWorkspaceTabId>> = {
  commentary: 'study-resources',
  egw: 'study-resources',
  topic: 'topics',
  chart: 'charts',
  'study-guide': 'how-to-study',
};

export const RESOURCE_KIND_LIBRARY_SECTION: Partial<
  Record<StudyResourceKind, import('@/types/studyWorkspace').StudyResourceLibrarySection>
> = {
  commentary: 'commentary',
  egw: 'egw',
  topic: 'topics',
  chart: 'charts',
};

export const CATALOG_KIND_LABELS: Record<
  import('@/types/resourceCatalog').CatalogRelatedItem['kind'],
  string
> = {
  'egw-book': 'Ellen White',
  'egw-note': 'EGW Note',
  topic: 'Topic',
  map: 'Map',
  chart: 'Chart',
  commentary: 'Commentary',
};

export const CATALOG_KIND_LIBRARY_SECTION: Partial<
  Record<
    import('@/types/resourceCatalog').CatalogRelatedItem['kind'],
    import('@/types/studyWorkspace').StudyResourceLibrarySection
  >
> = {
  'egw-book': 'egw',
  'egw-note': 'egw',
  topic: 'topics',
  map: 'maps',
  chart: 'charts',
  commentary: 'commentary',
};

export const COMMENTARY_NOTE_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Commentary title' },
  { key: 'body', label: 'Body', type: 'textarea' as const, rows: 8, placeholder: 'Your commentary notes…' },
  {
    key: 'relatedBibleRefs',
    label: 'Related Bible References',
    type: 'text' as const,
    placeholder: 'Genesis 3:15, Romans 8:28',
    hint: 'Separate references with commas',
  },
  {
    key: 'relatedTopics',
    label: 'Related Topics',
    type: 'text' as const,
    placeholder: 'Sabbath, Sanctuary',
    hint: 'Topic titles, separated by commas',
  },
  {
    key: 'relatedStudyGuides',
    label: 'Related Study Guides',
    type: 'text' as const,
    placeholder: 'how-to-study:chapter-1',
    hint: 'Guide section IDs, separated by commas',
  },
];

export const EGW_REFERENCE_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Reference title' },
  { key: 'sourceWork', label: 'Source Work', type: 'text' as const, placeholder: 'The Desire of Ages' },
  { key: 'citation', label: 'Citation', type: 'text' as const, placeholder: 'Chapter 1, page 1' },
  { key: 'excerpt', label: 'Excerpt / Notes', type: 'textarea' as const, rows: 5, placeholder: 'Brief excerpt or your notes (do not paste unlicensed text)' },
  { key: 'fullTextLink', label: 'Full Text Link', type: 'text' as const, placeholder: 'https://…' },
  {
    key: 'relatedBibleRefs',
    label: 'Related Bible References',
    type: 'text' as const,
    placeholder: 'John 3:16',
    hint: 'Separate references with commas',
  },
  {
    key: 'relatedTopics',
    label: 'Related Topics',
    type: 'text' as const,
    placeholder: 'Second Coming',
    hint: 'Topic titles, separated by commas',
  },
  {
    key: 'relatedStudyGuides',
    label: 'Related Study Guides',
    type: 'text' as const,
    placeholder: 'how-to-study:introduction',
  },
  { key: 'source', label: 'Source', type: 'text' as const, placeholder: 'User entry / public domain index' },
  {
    key: 'licenseInfo',
    label: 'License Notes',
    type: 'text' as const,
    placeholder: 'User-added reference; verify license before importing full text',
  },
];

export const TOPIC_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Sabbath' },
  { key: 'description', label: 'Description', type: 'textarea' as const, rows: 5, placeholder: 'Doctrine summary and study focus…' },
  {
    key: 'relatedBibleRefs',
    label: 'Related Bible References',
    type: 'text' as const,
    placeholder: 'Exodus 20:8-11, Hebrews 4:9',
    hint: 'Separate references with commas',
  },
  {
    key: 'relatedCommentaryNotes',
    label: 'Related Commentary Note IDs',
    type: 'text' as const,
    hint: 'Optional resource IDs, separated by commas',
  },
  {
    key: 'relatedEGWRefs',
    label: 'Related EGW Reference IDs',
    type: 'text' as const,
    hint: 'Optional resource IDs, separated by commas',
  },
  {
    key: 'relatedCharts',
    label: 'Related Chart IDs',
    type: 'text' as const,
    hint: 'Optional resource IDs, separated by commas',
  },
  {
    key: 'relatedMaps',
    label: 'Related Map IDs (future)',
    type: 'text' as const,
    hint: 'Reserved for Phase 2 maps',
  },
  {
    key: 'relatedTimelines',
    label: 'Related Timeline IDs (future)',
    type: 'text' as const,
    hint: 'Reserved for Phase 2 timelines',
  },
  {
    key: 'relatedStudyGuides',
    label: 'Related Study Guides',
    type: 'text' as const,
    placeholder: 'how-to-study:chapter-3',
  },
];

export const CHART_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Daniel 2 Prophecy Chart' },
  { key: 'description', label: 'Description', type: 'textarea' as const, rows: 4 },
  { key: 'type', label: 'Chart Type', type: 'text' as const, placeholder: 'prophecy, sanctuary, doctrine, timeline' },
  {
    key: 'imagePath',
    label: 'Image Path',
    type: 'text' as const,
    placeholder: '/assets/charts/daniel-2.png',
    hint: 'Local app path only — do not hotlink external images',
  },
  {
    key: 'chartData',
    label: 'Chart Data / Notes',
    type: 'textarea' as const,
    rows: 4,
    placeholder: 'Optional structured notes or JSON placeholder',
  },
  {
    key: 'relatedBibleRefs',
    label: 'Related Bible References',
    type: 'text' as const,
    placeholder: 'Daniel 2, Revelation 13',
  },
  {
    key: 'relatedTopics',
    label: 'Related Topics',
    type: 'text' as const,
    placeholder: 'Prophecy, Antichrist',
  },
  {
    key: 'relatedStudyGuides',
    label: 'Related Study Guides',
    type: 'text' as const,
    placeholder: 'how-to-study:prophecy',
  },
  { key: 'source', label: 'Source', type: 'text' as const, placeholder: 'User-created / public domain' },
  { key: 'licenseInfo', label: 'License Notes', type: 'text' as const, placeholder: 'Verify license before importing chart images' },
];
