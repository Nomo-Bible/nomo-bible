/**
 * App-bundled How to Study the Bible manuscript.
 *
 * Editorial source of truth: knowledge-base/study/how-to-study-the-bible.md
 * Keep in sync: npm run sync:how-to-study (runs automatically before build)
 */
import articleMarkdown from './how-to-study-the-bible.md?raw';
import { extractArticleSection } from '@/utils/extractArticleSection';

export const HOW_TO_STUDY_ARTICLE_MARKDOWN = articleMarkdown;

export function getHowToStudySectionMarkdown(targetHeading: string): string | null {
  return extractArticleSection(articleMarkdown, targetHeading);
}
