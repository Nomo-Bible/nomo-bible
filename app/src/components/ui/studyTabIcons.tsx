import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Link2,
  Search,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';

export const STUDY_TAB_ICONS: Record<StudyWorkspaceTabId, LucideIcon> = {
  'study-notes': BookOpen,
  'cross-references': Link2,
  concordance: Search,
  topics: Tags,
  'how-to-study': GraduationCap,
  charts: BarChart3,
};

export const STUDY_TAB_ICON_SIZE = 14;
