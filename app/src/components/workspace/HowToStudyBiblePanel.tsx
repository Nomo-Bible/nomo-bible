import { useCallback, useMemo, useRef } from 'react';
import { HOW_TO_STUDY_ARTICLE_MARKDOWN as articleMarkdown } from '@/data/study/howToStudyContent';
import { HowToStudyNav } from '@/components/workspace/HowToStudyNav';
import { buildArticleHeadingIdMap } from '@/utils/articleSlug';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import './HowToStudyBiblePanel.css';

export function HowToStudyBiblePanel() {
  const articleRef = useRef<HTMLDivElement>(null);
  const headingIds = useMemo(() => buildArticleHeadingIdMap(articleMarkdown), []);

  const scrollToAnchor = useCallback((anchorId: string) => {
    const container = articleRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${CSS.escape(anchorId)}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', `#${anchorId}`);
    }
  }, []);

  return (
    <article className="how-to-study-panel" aria-label="How to Study the Bible">
      <aside className="how-to-study-panel__sidebar">
        <HowToStudyNav headingIds={headingIds} onNavigate={scrollToAnchor} />
      </aside>
      <div ref={articleRef} className="how-to-study-panel__article study-article">
        {renderArticleMarkdown(articleMarkdown)}
      </div>
    </article>
  );
}
