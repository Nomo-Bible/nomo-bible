export type StudyWorkspaceTabId =
  | 'study-notes'
  | 'cross-references'
  | 'concordance'
  | 'topics'
  | 'how-to-study'
  | 'charts';

export interface StudyWorkspaceTab {
  id: StudyWorkspaceTabId;
  label: string;
}

export const STUDY_WORKSPACE_TABS: StudyWorkspaceTab[] = [
  { id: 'study-notes', label: 'Study Notes' },
  { id: 'cross-references', label: 'Cross References' },
  { id: 'concordance', label: 'Concordance' },
  { id: 'topics', label: 'Topics' },
  { id: 'how-to-study', label: 'How to Study the Bible' },
  { id: 'charts', label: 'Charts' },
];
