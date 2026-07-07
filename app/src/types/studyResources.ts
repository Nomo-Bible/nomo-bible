/** Shared study resource types — designed for future Supabase migration. */

export interface ResourceTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface CommentaryNote extends ResourceTimestamps {
  id: string;
  title: string;
  body: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
}

export interface CommentaryNoteInput {
  title: string;
  body: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
}

export interface EGWReference extends ResourceTimestamps {
  id: string;
  title: string;
  sourceWork: string;
  citation: string;
  excerpt: string;
  fullTextLink: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
  source: string;
  licenseInfo: string;
}

export interface EGWReferenceInput {
  title: string;
  sourceWork: string;
  citation: string;
  excerpt: string;
  fullTextLink: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
  source: string;
  licenseInfo: string;
}

export interface Topic extends ResourceTimestamps {
  id: string;
  title: string;
  description: string;
  relatedBibleRefs: string[];
  relatedCommentaryNotes: string[];
  relatedEGWRefs: string[];
  relatedCharts: string[];
  relatedMaps: string[];
  relatedTimelines: string[];
  relatedStudyGuides: string[];
}

export interface TopicInput {
  title: string;
  description: string;
  relatedBibleRefs: string[];
  relatedCommentaryNotes: string[];
  relatedEGWRefs: string[];
  relatedCharts: string[];
  relatedMaps: string[];
  relatedTimelines: string[];
  relatedStudyGuides: string[];
}

export interface ChartResource extends ResourceTimestamps {
  id: string;
  title: string;
  description: string;
  type: string;
  imagePath: string;
  chartData: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
  source: string;
  licenseInfo: string;
}

export interface ChartResourceInput {
  title: string;
  description: string;
  type: string;
  imagePath: string;
  chartData: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
  source: string;
  licenseInfo: string;
}

/** Phase 2 placeholders — types only for relationship wiring. */
export interface MapResource extends ResourceTimestamps {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  source: string;
  licenseInfo: string;
}

export interface TimelineResource extends ResourceTimestamps {
  id: string;
  title: string;
  description: string;
  events: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedStudyGuides: string[];
  source: string;
  licenseInfo: string;
}

export interface StudyGuideLink extends ResourceTimestamps {
  id: string;
  title: string;
  guideId: string;
  sectionId: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
}

export type StudyResourceKind =
  | 'commentary'
  | 'egw'
  | 'topic'
  | 'chart'
  | 'study-guide';

export interface RelatedResourceItem {
  kind: StudyResourceKind;
  id: string;
  title: string;
  subtitle?: string;
}

export interface RelatedResourcesContext {
  passageKey?: string;
  topicId?: string;
  studyGuideSectionId?: string;
}
