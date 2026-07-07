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
    id: 'introduction',
    label: 'Introduction',
    summary: 'Why a deliberate study method matters for every believer.',
    targetHeading: 'Why Method Matters',
  },
  {
    id: 'how-to-read-scripture',
    label: 'How to Read Scripture',
    summary: 'Christ-centered interpretation — the sovereign key to every page.',
    targetHeading: 'Chapter 1: The Sovereign Key — Christ-Centered Interpretation',
  },
  {
    id: 'context',
    label: 'Context',
    summary: 'Historical and prophetic background that sets the stage for sound study.',
    targetHeading: 'Chapter 8: Setting the Stage — Historical and Prophetic Context',
  },
  {
    id: 'cross-references',
    label: 'Cross References',
    summary: 'Let Scripture interpret Scripture through careful comparison.',
    targetHeading: 'Chapter 7: The Council of Truth — Comparing Scripture with Scripture',
  },
  {
    id: 'word-study',
    label: 'Word Study',
    summary: 'Let the Bible define its own terms from within.',
    targetHeading: 'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms',
  },
  {
    id: 'law-and-testimony',
    label: 'Law and Testimony',
    summary: 'Test every teaching against the written Word of God.',
    targetHeading: 'The Sola Scriptura Mandate',
    placeholderMarkdown: `## Law and Testimony

> "To the law and to the testimony: if they speak not according to this word, it is because there is no light in them." — Isaiah 8:20

Every doctrine, tradition, and spiritual impression must be measured against Scripture. The law and the testimony are the fixed standard — not culture, not emotion, and not the voice of popular teachers.

### Practical checkpoints

- Does this teaching align with the whole counsel of God?
- Is it confirmed by clear Scripture, compared with related passages?
- Does it exalt Christ and produce holiness, humility, and love?

When a section of this guide is still being expanded, use the **Cross References** and **Word Study** sections alongside your open Bible passage to practice these principles directly.`,
  },
  {
    id: 'prophecy',
    label: 'Prophecy',
    summary: 'Understanding progressive revelation and prophetic patterns.',
    targetHeading: 'Chapter 4: Unfolding Light — Understanding Progressive Revelation',
  },
  {
    id: 'practical-application',
    label: 'Practical Application',
    summary: 'Living the truth — transformation through the Word.',
    targetHeading: 'Chapter 9: Living Truth — The Transforming Power of the Word',
  },
];

export function getHowToStudyMobileSection(id: string): HowToStudyMobileSection | undefined {
  return HOW_TO_STUDY_MOBILE_SECTIONS.find((section) => section.id === id);
}
