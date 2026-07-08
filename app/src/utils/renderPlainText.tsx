import { splitEgwParagraphs } from '@/utils/parseEgwPlainText';

interface RenderPlainTextOptions {
  chapterIds?: Set<string>;
  activeChapterId?: string | null;
  onChapterLinkClick?: (chapterId: string) => void;
}

function getChapterIdFromParagraph(paragraph: string): string | null {
  const match = paragraph.match(/^Chapter\s+(\d+)/i);
  if (!match) return null;
  return `chapter-${match[1]}`;
}

export function renderPlainText(
  content: string,
  { chapterIds, activeChapterId, onChapterLinkClick }: RenderPlainTextOptions = {},
) {
  const paragraphs = splitEgwParagraphs(content);

  return paragraphs.map((paragraph, index) => {
    const chapterId = getChapterIdFromParagraph(paragraph);
    if (chapterId) {
      const chapterExists = chapterIds?.has(chapterId) ?? false;
      const isActive = activeChapterId === chapterId;

      if (chapterExists && onChapterLinkClick && !isActive) {
        return (
          <p key={index}>
            <button
              type="button"
              className="egw-book-reader__index-link"
              onClick={() => onChapterLinkClick(chapterId)}
            >
              {paragraph}
            </button>
          </p>
        );
      }

      return (
        <h3 key={index} className="study-article__h3">
          {paragraph}
        </h3>
      );
    }
    return <p key={index}>{paragraph}</p>;
  });
}
