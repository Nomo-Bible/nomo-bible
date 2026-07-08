/** Built-in onboard catalog entries — read-only, bundled with the app. */

export interface CatalogLicenseInfo {
  sourceName: string;
  sourceUrl: string;
  licenseNotes: string;
}

export interface EgwBookCatalogEntry {
  id: string;
  title: string;
  author: 'Ellen G. White';
  description: string;
  readOnlineUrl: string;
  sourceName: string;
  sourceUrl: string;
  licenseNotes: string;
  /** Whether bundled local text has been imported for in-app reading. */
  localTextAvailable: boolean;
  relatedTopics: string[];
  relatedBibleRefs: string[];
}

export interface CatalogTopicEntry {
  id: string;
  title: string;
  description: string;
  relatedBibleRefs: string[];
  relatedEgwBookIds: string[];
  relatedChartIds: string[];
  relatedMapIds: string[];
  relatedStudyGuides: string[];
}

export interface CatalogMapEntry {
  id: string;
  title: string;
  description: string;
  /** Local image under /assets/... — empty if not stored locally. */
  imagePath: string;
  openSourceUrl: string;
  sourceName: string;
  sourceUrl: string;
  licenseNotes: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
}

export interface CatalogChartEntry {
  id: string;
  title: string;
  description: string;
  type: string;
  imagePath: string;
  relatedBibleRefs: string[];
  relatedTopics: string[];
  relatedEgwBookIds: string[];
  sourceName: string;
  sourceUrl: string;
  licenseNotes: string;
}

export type CatalogResourceKind = 'egw-book' | 'topic' | 'map' | 'chart';

export interface CatalogRelatedItem {
  kind: CatalogResourceKind | 'commentary' | 'egw-note';
  id: string;
  title: string;
  subtitle?: string;
  catalog: boolean;
}
