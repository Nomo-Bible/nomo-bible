import type { PassageKey } from '@/types/study';

export interface CrossReference {
  id: string;
  sourceReference: PassageKey;
  targetReference: string;
  targetBook: string;
  targetChapter: number;
  targetVerse: number | null;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrossReferenceInput {
  sourceReference: PassageKey;
  targetBook: string;
  targetChapter: number;
  targetVerse: number | null;
  label?: string;
}

export interface CrossReferenceTarget {
  targetReference: string;
  targetBook: string;
  targetChapter: number;
  targetVerse: number | null;
}
