import { slugifyArticleHeading } from '@/utils/articleSlug';

export interface HowToStudyNavLink {
  label: string;
  targetHeading: string;
}

export interface HowToStudyNavGroup {
  id: string;
  label: string;
  items: HowToStudyNavLink[];
}

export const HOW_TO_STUDY_NAV: HowToStudyNavGroup[] = [
  {
    id: 'preface',
    label: 'Preface',
    items: [{ label: 'The Sola Scriptura Mandate', targetHeading: 'The Sola Scriptura Mandate' }],
  },
  {
    id: 'part-1',
    label: 'Part I',
    items: [
      { label: 'Introduction: Why Method Matters', targetHeading: 'Why Method Matters' },
      {
        label: 'Chapter 1: Christ-Centered Interpretation',
        targetHeading: 'Chapter 1: The Sovereign Key — Christ-Centered Interpretation',
      },
      {
        label: 'Chapter 2: Scripture Defines Its Terms',
        targetHeading: 'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms',
      },
    ],
  },
  {
    id: 'part-2',
    label: 'Part II',
    items: [
      {
        label: 'Chapter 3: Repeat and Enlarge',
        targetHeading: 'Chapter 3: Line Upon Line — The “Repeat and Enlarge” Pattern',
      },
      {
        label: 'Chapter 4: Progressive Revelation',
        targetHeading: 'Chapter 4: Unfolding Light — Understanding Progressive Revelation',
      },
    ],
  },
  {
    id: 'part-3',
    label: 'Part III',
    items: [
      {
        label: 'Chapter 5: Biblical Parallelism',
        targetHeading: 'Chapter 5: Sacred Echoes — Navigating Biblical Parallelism',
      },
      {
        label: 'Chapter 6: Chiastic Structures',
        targetHeading: 'Chapter 6: The Divine Pivot — Unlocking Chiastic Structures',
      },
    ],
  },
  {
    id: 'part-4',
    label: 'Part IV',
    items: [
      {
        label: 'Chapter 7: Compare Scripture with Scripture',
        targetHeading: 'Chapter 7: The Council of Truth — Comparing Scripture with Scripture',
      },
      {
        label: 'Chapter 8: Historical Context',
        targetHeading: 'Chapter 8: Setting the Stage — Historical and Prophetic Context',
      },
    ],
  },
  {
    id: 'part-5',
    label: 'Part V',
    items: [
      {
        label: 'Chapter 9: The Transforming Power of the Word',
        targetHeading: 'Chapter 9: Living Truth — The Transforming Power of the Word',
      },
    ],
  },
  {
    id: 'conclusion',
    label: 'Conclusion',
    items: [{ label: 'Taking Up the Sword', targetHeading: 'Taking Up the Sword' }],
  },
  {
    id: 'appendix',
    label: 'Appendix',
    items: [
      {
        label: 'Symbol Study Cheat Sheet',
        targetHeading: 'Symbol Study Cheat Sheet',
      },
    ],
  },
];

export function findArticleAnchorId(
  targetHeading: string,
  headingIds: Map<string, string>,
): string {
  const direct = headingIds.get(targetHeading);
  if (direct) return direct;

  const targetSlug = slugifyArticleHeading(targetHeading);
  for (const [text, id] of headingIds) {
    if (slugifyArticleHeading(text) === targetSlug) {
      return id;
    }
  }

  return targetSlug;
}
