export interface HowToStudyMobileSection {
  id: string;
  label: string;
  summary: string;
  /** Heading text in how-to-study-the-bible.md */
  targetHeading: string;
  /** Used when the article section cannot be extracted */
  placeholderMarkdown?: string;
}

export const HOW_TO_STUDY_MOBILE_SECTIONS: HowToStudyMobileSection[] = [
  {
    id: 'law-and-testimony',
    label: 'Preface: The Sola Scriptura Mandate',
    summary: 'Scripture is its own best interpreter — the foundation of sound Bible study.',
    targetHeading: 'The Sola Scriptura Mandate',
  },
  {
    id: 'introduction',
    label: 'Introduction: Why Method Matters',
    summary: 'Why a deliberate study method matters for every believer.',
    targetHeading: 'Why Method Matters',
  },
  {
    id: 'how-to-read-scripture',
    label: 'Chapter 1: The Sovereign Key — Christ-Centered Interpretation',
    summary: 'Christ-centered interpretation — the sovereign key to every page.',
    targetHeading: 'Chapter 1: The Sovereign Key — Christ-Centered Interpretation',
  },
  {
    id: 'word-study',
    label: 'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms',
    summary: 'Let the Bible define its own terms from within.',
    targetHeading: 'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms',
  },
  {
    id: 'chapter-3',
    label: 'Chapter 3: Line Upon Line — The “Repeat and Enlarge” Pattern',
    summary: 'How God repeats and enlarges prophetic truth throughout Scripture.',
    targetHeading: 'Chapter 3: Line Upon Line — The “Repeat and Enlarge” Pattern',
  },
  {
    id: 'prophecy',
    label: 'Chapter 4: Unfolding Light — Understanding Progressive Revelation',
    summary: 'Understanding progressive revelation and prophetic patterns.',
    targetHeading: 'Chapter 4: Unfolding Light — Understanding Progressive Revelation',
  },
  {
    id: 'chapter-5',
    label: 'Chapter 5: Sacred Echoes — Navigating Biblical Parallelism',
    summary: 'Recognize Hebrew parallel structure for immediate clarity within the text.',
    targetHeading: 'Chapter 5: Sacred Echoes — Navigating Biblical Parallelism',
  },
  {
    id: 'chapter-6',
    label: 'Chapter 6: The Divine Pivot — Unlocking Chiastic Structures',
    summary: 'Find the center of chiastic passages where the author’s main emphasis lies.',
    targetHeading: 'Chapter 6: The Divine Pivot — Unlocking Chiastic Structures',
  },
  {
    id: 'cross-references',
    label: 'Chapter 7: The Council of Truth — Comparing Scripture with Scripture',
    summary: 'Let Scripture interpret Scripture through careful comparison.',
    targetHeading: 'Chapter 7: The Council of Truth — Comparing Scripture with Scripture',
  },
  {
    id: 'context',
    label: 'Chapter 8: Setting the Stage — Historical and Prophetic Context',
    summary: 'Historical and prophetic background that sets the stage for sound study.',
    targetHeading: 'Chapter 8: Setting the Stage — Historical and Prophetic Context',
  },
  {
    id: 'practical-application',
    label: 'Chapter 9: Living Truth — The Transforming Power of the Word',
    summary: 'Living the truth — transformation through the Word.',
    targetHeading: 'Chapter 9: Living Truth — The Transforming Power of the Word',
  },
  {
    id: 'conclusion',
    label: 'Conclusion: Taking Up the Sword',
    summary: 'Put the tools to work — let Scripture interpret Scripture and shape your life.',
    targetHeading: 'Taking Up the Sword',
  },
  {
    id: 'appendix-a',
    label: 'Appendix A: Symbol Study Cheat Sheet',
    summary: 'Biblical symbol and prophetic language reference tables.',
    targetHeading: 'Symbol Study Cheat Sheet',
  },
  {
    id: 'appendix-b',
    label: 'Appendix B: Print Expansion Blueprint',
    summary: 'Print expansion blueprint for study guide distribution.',
    targetHeading: 'Print Expansion Blueprint',
    placeholderMarkdown: `### Print Expansion Blueprint

<!-- TODO: Print expansion blueprint content forthcoming. -->`,
  },
];

export function getHowToStudyMobileSection(id: string): HowToStudyMobileSection | undefined {
  return HOW_TO_STUDY_MOBILE_SECTIONS.find((section) => section.id === id);
}
