import {
  BarChart3,
  BookOpen,
  BookText,
  GraduationCap,
  Library,
  Link2,
  Search,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';

export const STUDY_TAB_ICONS: Record<StudyWorkspaceTabId, LucideIcon> = {
  'study-notes': BookOpen,
  'cross-references': Link2,
  'study-resources': Library,
  concordance: Search,
  topics: Tags,
  'how-to-study': GraduationCap,
  'kjv-word-guide': BookText,
  charts: BarChart3,
};

export const STUDY_TAB_ICON_SIZE = 14;
