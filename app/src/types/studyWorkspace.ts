export type StudyWorkspaceTabId =
  | 'study-notes'
  | 'cross-references'
  | 'strongs'
  | 'topics'
  | 'doctrine'
  | 'charts';

export interface StudyWorkspaceTab {
  id: StudyWorkspaceTabId;
  label: string;
}

export const STUDY_WORKSPACE_TABS: StudyWorkspaceTab[] = [
  { id: 'study-notes', label: 'Study Notes' },
  { id: 'cross-references', label: 'Cross References' },
  { id: 'strongs', label: "Strong's" },
  { id: 'topics', label: 'Topics' },
  { id: 'doctrine', label: 'Doctrine' },
  { id: 'charts', label: 'Charts' },
];
