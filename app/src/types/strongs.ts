export type StrongsLanguage = 'Hebrew' | 'Greek';

export interface StrongsEntry {
  strongsNumber: string;
  language: StrongsLanguage;
  originalWord: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  kjvUsage: string;
  rootWord?: string;
  source: string;
}

export type StrongsSearchMode = 'number' | 'word';

export interface StrongsSearchResponse {
  query: string;
  mode: StrongsSearchMode;
  totalCount: number;
  results: StrongsEntry[];
}

export interface StrongsDictionaryData {
  [strongsNumber: string]: StrongsEntry;
}
