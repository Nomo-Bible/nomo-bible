export type StudyWorkspaceTabId =
  | 'study-notes'
  | 'cross-references'
  | 'concordance'
  | 'topics'
  | 'how-to-study'
  | 'kjv-word-guide'
  | 'charts'
  | 'study-resources';

export type StudyResourceLibrarySection =
  | 'overview'
  | 'topics'
  | 'egw'
  | 'commentary'
  | 'charts'
  | 'maps'
  | 'my-notes';

export interface StudyWorkspaceTab {
  id: StudyWorkspaceTabId;
  label: string;
}

export const STUDY_WORKSPACE_TABS: StudyWorkspaceTab[] = [
  { id: 'study-notes', label: 'Study Notes' },
  { id: 'cross-references', label: 'Cross References' },
  { id: 'study-resources', label: 'Study Resources' },
  { id: 'concordance', label: 'Concordance' },
  { id: 'topics', label: 'Topics' },
  { id: 'how-to-study', label: 'How to Study the Bible' },
  { id: 'kjv-word-guide', label: 'KJV Word Guide' },
  { id: 'charts', label: 'Charts' },
];
