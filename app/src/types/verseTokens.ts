export interface VerseWordToken {
  text: string;
  strongs: string | null;
}

export type VerseTokensMap = Record<string, VerseWordToken[]>;
