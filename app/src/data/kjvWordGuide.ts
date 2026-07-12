import type {
  KjvGrammarBlock,
  KjvPronounComparisonRow,
  KjvScriptureExample,
  KjvWordEntry,
} from '@/types/kjvWordGuide';

export const KJV_PRONOUN_COMPARISON_SINGULAR: KjvPronounComparisonRow[] = [
  { label: 'Singular subject', value: 'thou' },
  { label: 'Singular object', value: 'thee' },
  { label: 'Singular possessive', value: 'thy or thine' },
];

export const KJV_PRONOUN_COMPARISON_PLURAL: KjvPronounComparisonRow[] = [
  { label: 'Plural subject', value: 'ye' },
  { label: 'Plural object', value: 'you' },
  { label: 'Plural possessive', value: 'your or yours' },
];

export const KJV_WORD_GUIDE_ENTRIES: KjvWordEntry[] = [
  // Pronouns
  {
    word: 'thou',
    meaning: 'you, singular subject',
    category: 'pronouns',
    aliases: ['you singular', 'you singular subject'],
  },
  {
    word: 'thee',
    meaning: 'you, singular object',
    category: 'pronouns',
    aliases: ['you singular', 'you singular object'],
  },
  {
    word: 'thy',
    meaning: 'your, singular',
    category: 'pronouns',
    aliases: ['your singular'],
  },
  {
    word: 'thine',
    meaning: 'yours, or your before a vowel',
    category: 'pronouns',
    aliases: ['yours singular', 'your singular'],
  },
  {
    word: 'thyself',
    meaning: 'yourself, singular',
    category: 'pronouns',
  },
  {
    word: 'ye',
    meaning: 'you, plural subject',
    category: 'pronouns',
    aliases: ['you plural', 'you plural subject'],
  },
  {
    word: 'you',
    meaning: 'you, usually plural object in KJV usage',
    category: 'pronouns',
    aliases: ['you plural', 'you plural object'],
  },
  {
    word: 'your',
    meaning: 'belonging to more than one person',
    category: 'pronouns',
  },
  {
    word: 'yourselves',
    meaning: 'more than one person',
    category: 'pronouns',
  },

  // Common verb forms
  { word: 'art', meaning: 'are', category: 'common-verb-forms' },
  { word: 'wast', meaning: 'were', category: 'common-verb-forms' },
  { word: 'wert', meaning: 'were', category: 'common-verb-forms' },
  { word: 'beest', meaning: 'be', category: 'common-verb-forms' },
  { word: 'hast', meaning: 'have', category: 'common-verb-forms' },
  { word: 'hadst', meaning: 'had', category: 'common-verb-forms' },
  { word: 'dost', meaning: 'do', category: 'common-verb-forms' },
  { word: 'doest', meaning: 'do', category: 'common-verb-forms' },
  { word: 'didst', meaning: 'did', category: 'common-verb-forms' },
  { word: 'doth', meaning: 'does', category: 'common-verb-forms' },
  { word: 'shalt', meaning: 'shall', category: 'common-verb-forms' },
  { word: 'shouldest', meaning: 'should', category: 'common-verb-forms' },
  { word: 'wilt', meaning: 'will', category: 'common-verb-forms' },
  { word: 'wouldest', meaning: 'would', category: 'common-verb-forms' },
  { word: 'canst', meaning: 'can', category: 'common-verb-forms' },
  { word: 'couldest', meaning: 'could', category: 'common-verb-forms' },
  { word: 'mayest', meaning: 'may', category: 'common-verb-forms' },
  { word: 'mightest', meaning: 'might', category: 'common-verb-forms' },

  // -est forms
  {
    word: 'comest',
    meaning: 'come',
    category: 'est-forms',
    note: 'The ending “-est” is usually used with thou and refers to one person.',
  },
  { word: 'camest', meaning: 'came', category: 'est-forms' },
  { word: 'goest', meaning: 'go', category: 'est-forms' },
  { word: 'gavest', meaning: 'gave', category: 'est-forms' },
  { word: 'knowest', meaning: 'know', category: 'est-forms' },
  { word: 'seest', meaning: 'see', category: 'est-forms' },
  { word: 'hearest', meaning: 'hear', category: 'est-forms' },
  { word: 'speakest', meaning: 'speak', category: 'est-forms' },
  { word: 'sayest', meaning: 'say', category: 'est-forms' },
  { word: 'makest', meaning: 'make', category: 'est-forms' },
  { word: 'bringest', meaning: 'bring', category: 'est-forms' },
  { word: 'findest', meaning: 'find', category: 'est-forms' },

  // -eth forms
  {
    word: 'liveth',
    meaning: 'lives',
    category: 'eth-forms',
    note: 'The ending “-eth” is normally used with he, she, it, God, Christ, the Lord, or another singular subject.',
  },
  { word: 'dwelleth', meaning: 'dwells', category: 'eth-forms' },
  { word: 'loveth', meaning: 'loves', category: 'eth-forms' },
  { word: 'believeth', meaning: 'believes', category: 'eth-forms' },
  { word: 'speaketh', meaning: 'speaks', category: 'eth-forms' },
  { word: 'cometh', meaning: 'comes', category: 'eth-forms' },
  { word: 'goeth', meaning: 'goes', category: 'eth-forms' },
  { word: 'saith', meaning: 'says', category: 'eth-forms' },
  { word: 'giveth', meaning: 'gives', category: 'eth-forms' },
  { word: 'maketh', meaning: 'makes', category: 'eth-forms' },
  { word: 'knoweth', meaning: 'knows', category: 'eth-forms' },
  { word: 'hath', meaning: 'has', category: 'eth-forms' },

  // Direction and location
  { word: 'whence', meaning: 'from where', category: 'direction-location' },
  { word: 'whither', meaning: 'to where', category: 'direction-location' },
  { word: 'hence', meaning: 'from here', category: 'direction-location' },
  { word: 'hither', meaning: 'to here', category: 'direction-location' },
  { word: 'thence', meaning: 'from there', category: 'direction-location' },
  { word: 'thither', meaning: 'to there', category: 'direction-location' },
  { word: 'wherein', meaning: 'in which', category: 'direction-location' },
  { word: 'whereof', meaning: 'of which', category: 'direction-location' },
  { word: 'whereby', meaning: 'by which', category: 'direction-location' },
  {
    word: 'wherefore',
    meaning: 'why, or for what reason',
    category: 'direction-location',
  },
  {
    word: 'therein',
    meaning: 'in it or in that place',
    category: 'direction-location',
  },
  { word: 'thereof', meaning: 'of it', category: 'direction-location' },
  {
    word: 'thereby',
    meaning: 'by it or by that means',
    category: 'direction-location',
  },

  // Older vocabulary
  { word: 'albeit', meaning: 'although', category: 'older-vocabulary' },
  { word: 'anon', meaning: 'immediately or soon', category: 'older-vocabulary' },
  { word: 'afore', meaning: 'before', category: 'older-vocabulary' },
  { word: 'behold', meaning: 'look, pay attention', category: 'older-vocabulary' },
  { word: 'betwixt', meaning: 'between', category: 'older-vocabulary' },
  { word: 'ere', meaning: 'before', category: 'older-vocabulary' },
  {
    word: 'froward',
    meaning: 'stubborn, contrary, or perverse',
    category: 'older-vocabulary',
  },
  {
    word: 'lest',
    meaning: 'so that something does not happen',
    category: 'older-vocabulary',
  },
  { word: 'lo', meaning: 'look, behold', category: 'older-vocabulary' },
  { word: 'nigh', meaning: 'near', category: 'older-vocabulary' },
  { word: 'nay', meaning: 'no', category: 'older-vocabulary' },
  { word: 'oft', meaning: 'often', category: 'older-vocabulary' },
  {
    word: 'peradventure',
    meaning: 'perhaps',
    category: 'older-vocabulary',
    aliases: ['perhaps', 'maybe'],
  },
  {
    word: 'raiment',
    meaning: 'clothing',
    category: 'older-vocabulary',
    aliases: ['clothing', 'clothes', 'garments'],
  },
  { word: 'twain', meaning: 'two', category: 'older-vocabulary' },
  { word: 'verily', meaning: 'truly', category: 'older-vocabulary' },
  {
    word: 'victuals',
    meaning: 'food or provisions',
    category: 'older-vocabulary',
  },
  { word: 'whilst', meaning: 'while', category: 'older-vocabulary' },
  { word: 'wot', meaning: 'know', category: 'older-vocabulary' },
  { word: 'yea', meaning: 'yes', category: 'older-vocabulary' },
  { word: 'kine', meaning: 'cattle or cows', category: 'older-vocabulary' },
  { word: 'ass', meaning: 'donkey', category: 'older-vocabulary' },
  { word: 'asses', meaning: 'donkeys', category: 'older-vocabulary' },
  {
    word: 'husbandman',
    meaning: 'farmer or keeper of land',
    category: 'older-vocabulary',
  },
  {
    word: 'publican',
    meaning: 'tax collector',
    category: 'older-vocabulary',
  },
  {
    word: 'conversation',
    meaning: 'conduct or manner of life, depending on context',
    category: 'older-vocabulary',
  },
  {
    word: 'charity',
    meaning: 'love, especially selfless Christian love',
    category: 'older-vocabulary',
  },
  {
    word: 'quick',
    meaning: 'living or alive',
    category: 'older-vocabulary',
  },
  {
    word: 'suffer',
    meaning: 'allow or permit, depending on context',
    category: 'older-vocabulary',
  },
  {
    word: 'prevent',
    meaning: 'go before or come before, in older usage',
    category: 'older-vocabulary',
  },
  {
    word: 'peculiar',
    meaning: 'specially belonging to someone',
    category: 'older-vocabulary',
  },
  {
    word: 'meat',
    meaning: 'food in general, not always animal flesh',
    category: 'older-vocabulary',
  },
  {
    word: 'corn',
    meaning: 'grain, not necessarily modern maize',
    category: 'older-vocabulary',
  },
  {
    word: 'leasing',
    meaning: 'falsehood or lying',
    category: 'older-vocabulary',
  },
  {
    word: 'superfluity',
    meaning: 'excess or abundance',
    category: 'older-vocabulary',
  },
  {
    word: 'concupiscence',
    meaning: 'sinful desire or lust',
    category: 'older-vocabulary',
  },
  {
    word: 'iniquity',
    meaning: 'lawlessness, wickedness, or sin',
    category: 'older-vocabulary',
  },
  {
    word: 'vanity',
    meaning: 'emptiness, worthlessness, or futility',
    category: 'older-vocabulary',
  },
  {
    word: 'filthiness',
    meaning: 'moral uncleanness or shameful conduct',
    category: 'older-vocabulary',
  },
  {
    word: 'reins',
    meaning: 'inner thoughts, emotions, or affections',
    category: 'older-vocabulary',
  },
  {
    word: 'bowels',
    meaning: 'deep compassion or inward affection',
    category: 'older-vocabulary',
  },
  { word: 'ghost', meaning: 'spirit', category: 'older-vocabulary' },
  { word: 'shew', meaning: 'show', category: 'older-vocabulary' },
  { word: 'sheweth', meaning: 'shows', category: 'older-vocabulary' },
  { word: 'durst', meaning: 'dared', category: 'older-vocabulary' },
  {
    word: 'trow',
    meaning: 'suppose or think',
    category: 'older-vocabulary',
  },
  {
    word: 'haply',
    meaning: 'perhaps or possibly',
    category: 'older-vocabulary',
    aliases: ['perhaps', 'possibly'],
  },
  {
    word: 'straightway',
    meaning: 'immediately',
    category: 'older-vocabulary',
  },
  { word: 'wax', meaning: 'become or grow', category: 'older-vocabulary' },
  {
    word: 'waxed',
    meaning: 'became or grew',
    category: 'older-vocabulary',
  },
  {
    word: 'abode',
    meaning: 'remained or stayed',
    category: 'older-vocabulary',
  },
  { word: 'abideth', meaning: 'remains', category: 'older-vocabulary' },
  {
    word: 'graven',
    meaning: 'carved or engraved',
    category: 'older-vocabulary',
  },
  {
    word: 'molten',
    meaning: 'melted and formed',
    category: 'older-vocabulary',
  },
  {
    word: 'sackbut',
    meaning: 'an ancient musical instrument',
    category: 'older-vocabulary',
  },
  {
    word: 'tabret',
    meaning: 'a small drum or tambourine',
    category: 'older-vocabulary',
  },
  { word: 'timbrel', meaning: 'tambourine', category: 'older-vocabulary' },
  {
    word: 'ouches',
    meaning: 'ornamental settings or sockets',
    category: 'older-vocabulary',
  },
  {
    word: 'chapiter',
    meaning: 'the top portion of a column',
    category: 'older-vocabulary',
  },

  // Older past-tense forms
  { word: 'began', meaning: 'began', category: 'older-past-tense' },
  { word: 'begat', meaning: 'fathered', category: 'older-past-tense' },
  {
    word: 'bare',
    meaning: 'carried, bore, or gave birth, depending on context',
    category: 'older-past-tense',
  },
  { word: 'brake', meaning: 'broke', category: 'older-past-tense' },
  { word: 'came', meaning: 'came', category: 'older-past-tense' },
  {
    word: 'clave',
    meaning: 'clung or remained attached',
    category: 'older-past-tense',
  },
  { word: 'drave', meaning: 'drove', category: 'older-past-tense' },
  { word: 'fell', meaning: 'fell', category: 'older-past-tense' },
  { word: 'gat', meaning: 'got', category: 'older-past-tense' },
  { word: 'gave', meaning: 'gave', category: 'older-past-tense' },
  { word: 'holpen', meaning: 'helped', category: 'older-past-tense' },
  { word: 'slew', meaning: 'killed', category: 'older-past-tense' },
  { word: 'smote', meaning: 'struck', category: 'older-past-tense' },
  { word: 'spake', meaning: 'spoke', category: 'older-past-tense' },
  { word: 'sprang', meaning: 'sprang', category: 'older-past-tense' },
  { word: 'strove', meaning: 'struggled', category: 'older-past-tense' },
  { word: 'ware', meaning: 'were aware', category: 'older-past-tense' },
  { word: 'wist', meaning: 'knew', category: 'older-past-tense' },
  { word: 'wrote', meaning: 'wrote', category: 'older-past-tense' },

  // Numbers and measurements
  {
    word: 'score',
    meaning: 'twenty',
    category: 'numbers-measurements',
    note: '“threescore and ten” means seventy.',
  },
  {
    word: 'threescore',
    meaning: 'sixty',
    category: 'numbers-measurements',
    note: '“threescore and ten” means seventy.',
  },
  { word: 'fourscore', meaning: 'eighty', category: 'numbers-measurements' },
  {
    word: 'five score',
    meaning: 'one hundred',
    category: 'numbers-measurements',
    aliases: ['fivescore', 'five-score'],
  },
  {
    word: 'cubits',
    meaning: 'an ancient measurement based roughly on the forearm',
    category: 'numbers-measurements',
    aliases: ['cubit'],
  },
  {
    word: 'firkin',
    meaning: 'an old liquid measure',
    category: 'numbers-measurements',
  },
  {
    word: 'omer',
    meaning: 'an ancient dry measure',
    category: 'numbers-measurements',
  },
  {
    word: 'ephah',
    meaning: 'an ancient dry measure',
    category: 'numbers-measurements',
  },
  {
    word: 'bath',
    meaning: 'an ancient liquid measure',
    category: 'numbers-measurements',
  },
  {
    word: 'talent',
    meaning: 'a large unit of weight or money, depending on context',
    category: 'numbers-measurements',
  },
  {
    word: 'penny',
    meaning: 'a Roman coin, often translating denarius',
    category: 'numbers-measurements',
  },
  {
    word: 'farthing',
    meaning: 'a very small coin',
    category: 'numbers-measurements',
  },
  {
    word: 'mite',
    meaning: 'a very small-value coin',
    category: 'numbers-measurements',
  },
];

export const KJV_EST_EXAMPLES: { kjv: string; meaning: string }[] = [
  { kjv: 'thou knowest', meaning: 'you know' },
  { kjv: 'thou speakest', meaning: 'you speak' },
  { kjv: 'thou hast', meaning: 'you have' },
  { kjv: 'thou canst', meaning: 'you can' },
  { kjv: 'thou wilt', meaning: 'you will' },
];

export const KJV_ETH_EXAMPLES: { kjv: string; meaning: string }[] = [
  { kjv: 'he speaketh', meaning: 'he speaks' },
  { kjv: 'God knoweth', meaning: 'God knows' },
  { kjv: 'Christ cometh', meaning: 'Christ comes' },
  { kjv: 'the Lord giveth', meaning: 'the Lord gives' },
];

export const KJV_GRAMMAR_BLOCKS: KjvGrammarBlock[] = [
  {
    id: 'singular-plural-you',
    title: 'Singular and plural “you”',
    body: [
      'Modern English uses “you” for both one person and several people. The KJV often preserves the distinction.',
      'Singular: thou, thee, thy, thine',
      'Plural: ye, you, your, yours',
    ],
    examples: [
      {
        kjv: 'Thou shalt not kill.',
        meaning: 'You, one person, shall not kill.',
      },
      {
        kjv: 'I have prayed for thee.',
        meaning: 'I have prayed for you, one person.',
      },
      {
        kjv: 'Thy faith hath made thee whole.',
        meaning: 'Your faith has made you well.',
      },
    ],
  },
];

export const KJV_SCRIPTURE_EXAMPLES: KjvScriptureExample[] = [
  {
    id: 'luke-22-31-32',
    reference: 'Luke 22:31–32',
    passages: [
      {
        quote: 'Satan hath desired to have you…',
        explanation: '“you” is plural and refers to the disciples.',
      },
      {
        quote: 'But I have prayed for thee…',
        explanation: '“thee” is singular and refers specifically to Peter.',
      },
    ],
  },
];
