export type WorkspacePanelId = 'nav' | 'scripture' | 'study';

export type ReadingFocusId =
  | 'scripture-reader'
  | 'study-notes'
  | 'how-to-study'
  | 'study-resources'
  | 'concordance'
  | 'cross-references'
  | 'topics'
  | 'charts';

export const READING_FOCUS_PANEL: Record<
  ReadingFocusId,
  WorkspacePanelId
> = {
  'scripture-reader': 'scripture',
  'study-notes': 'study',
  'how-to-study': 'study',
  'study-resources': 'study',
  concordance: 'study',
  'cross-references': 'study',
  topics: 'study',
  charts: 'study',
};
