import aboutMarkdown from '@knowledge-base/about/about-us.md?raw';
import { ArticlePageLayout } from '@/components/content/ArticlePageLayout';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import '@/components/workspace/HowToStudyBiblePanel.css';

export function AboutPage() {
  return (
    <ArticlePageLayout>{renderArticleMarkdown(aboutMarkdown)}</ArticlePageLayout>
  );
}
