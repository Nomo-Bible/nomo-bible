export type KjvWordCategoryId =
  | 'pronouns'
  | 'common-verb-forms'
  | 'est-forms'
  | 'eth-forms'
  | 'direction-location'
  | 'older-vocabulary'
  | 'older-past-tense'
  | 'numbers-measurements';

export type KjvWordEntry = {
  word: string;
  meaning: string;
  category: KjvWordCategoryId;
  note?: string;
  aliases?: string[];
};

export type KjvWordCategoryMeta = {
  id: KjvWordCategoryId;
  title: string;
  description?: string;
};

export type KjvPronounComparisonRow = {
  label: string;
  value: string;
};

export type KjvGrammarBlock = {
  id: string;
  title: string;
  body: string[];
  examples?: { kjv: string; meaning: string }[];
};

export type KjvScriptureExample = {
  id: string;
  reference: string;
  passages: { quote: string; explanation: string }[];
};

export const KJV_WORD_CATEGORY_META: KjvWordCategoryMeta[] = [
  {
    id: 'pronouns',
    title: 'Pronouns',
    description: 'Singular and plural forms preserved in the KJV.',
  },
  {
    id: 'common-verb-forms',
    title: 'Common verb forms',
    description: 'Older helping verbs and conjugations.',
  },
  {
    id: 'est-forms',
    title: 'Common “-est” forms',
    description: 'Usually used with thou and refers to one person.',
  },
  {
    id: 'eth-forms',
    title: 'Common “-eth” forms',
    description:
      'Normally used with he, she, it, God, Christ, the Lord, or another singular subject.',
  },
  {
    id: 'direction-location',
    title: 'Direction and location words',
  },
  {
    id: 'older-vocabulary',
    title: 'Common older vocabulary',
  },
  {
    id: 'older-past-tense',
    title: 'Older past-tense forms',
  },
  {
    id: 'numbers-measurements',
    title: 'Numbers and measurements',
  },
];

export function categoryTitle(id: KjvWordCategoryId): string {
  return KJV_WORD_CATEGORY_META.find((item) => item.id === id)?.title ?? id;
}
