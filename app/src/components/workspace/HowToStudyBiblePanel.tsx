import { useCallback, useMemo, useRef, useState } from 'react';
import { HOW_TO_STUDY_ARTICLE_MARKDOWN as articleMarkdown } from '@/data/study/howToStudyContent';
import { HowToStudyNav } from '@/components/workspace/HowToStudyNav';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import { PanelResizeHandle } from '@/components/workspace/PanelResizeHandle';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { buildArticleHeadingIdMap } from '@/utils/articleSlug';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import './HowToStudyBiblePanel.css';

const SIDEBAR_MIN = 140;
const SIDEBAR_MAX = 320;

export function HowToStudyBiblePanel() {
  const articleRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarWidth, setSidebarWidth] = useState(200);
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
      <ReadingPanelChrome focusId="how-to-study" title="How to Study the Bible" />
      <div className="how-to-study-panel__body">
        <aside
          className="how-to-study-panel__sidebar"
          style={isMobile ? undefined : { flexBasis: `${sidebarWidth}px` }}
        >
          <HowToStudyNav headingIds={headingIds} onNavigate={scrollToAnchor} />
        </aside>

        {!isMobile ? (
          <PanelResizeHandle
            axis="horizontal"
            className="how-to-study-panel__resize"
            label="Resize table of contents"
            onResize={(delta) => {
              setSidebarWidth((current) =>
                Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, current + delta)),
              );
            }}
          />
        ) : null}

        <div ref={articleRef} className="how-to-study-panel__article study-article">
          {renderArticleMarkdown(articleMarkdown)}
        </div>
      </div>
    </article>
  );
}
