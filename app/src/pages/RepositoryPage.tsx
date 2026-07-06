import articleMarkdown from '@knowledge-base/study/nomomartyria-repository-edition-1-0.md?raw';
import { ArticlePageLayout } from '@/components/content/ArticlePageLayout';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import '@/components/workspace/HowToStudyBiblePanel.css';

export function RepositoryPage() {
  return (
    <ArticlePageLayout>
      {renderArticleMarkdown(articleMarkdown)}
    </ArticlePageLayout>
  );
}
