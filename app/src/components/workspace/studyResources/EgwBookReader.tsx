import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import { VerticallyResizable } from '@/components/workspace/VerticallyResizable';
import { getEgwBookById } from '@/data/resources/catalog/egwBooks';
import {
  isEgwTextImported,
  loadEgwBookText,
} from '@/services/studyResources/egwTextService';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import './EgwBookReader.css';

interface EgwBookReaderProps {
  bookId: string;
  onClose: () => void;
}

export function EgwBookReader({ bookId, onClose }: EgwBookReaderProps) {
  const book = getEgwBookById(bookId);
  const bookText = useMemo(() => loadEgwBookText(bookId), [bookId]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  useEffect(() => {
    setActiveChapterId(bookText?.chapters[0]?.id ?? null);
  }, [bookId, bookText]);

  if (!book) {
    return null;
  }

  const activeChapter =
    bookText?.chapters.find((chapter) => chapter.id === activeChapterId) ??
    bookText?.chapters[0] ??
    null;

  const hasImportedText = isEgwTextImported(bookId);

  return (
    <div className="egw-book-reader">
      <div className="egw-book-reader__toolbar">
        <button type="button" className="egw-book-reader__back" onClick={onClose}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to library
        </button>
      </div>

      <ReadingPanelChrome focusId="egw-reader" title={book.title} />

      <div className="egw-book-reader__meta">
        <p className="egw-book-reader__author">{book.author}</p>
        <p className="egw-book-reader__description">{book.description}</p>
        <p className="egw-book-reader__source">
          Source:{' '}
          <a href={book.sourceUrl} target="_blank" rel="noopener noreferrer">
            {book.sourceName}
          </a>
          <span className="egw-book-reader__source-note">
            {' '}
            (reference link only — reading stays in the app)
          </span>
        </p>
      </div>

      {!hasImportedText || !bookText || !activeChapter ? (
        <div className="egw-book-reader__missing" role="status">
          <p className="egw-book-reader__missing-title">Local text not available</p>
          <p className="egw-book-reader__missing-body">
            Local text for this resource has not been imported yet.
          </p>
        </div>
      ) : (
        <>
          {bookText.chapters.length > 1 ? (
            <div
              className="egw-book-reader__chapters"
              role="tablist"
              aria-label={`${book.title} chapters`}
            >
              {bookText.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={chapter.id === activeChapter.id}
                  className={
                    chapter.id === activeChapter.id
                      ? 'egw-book-reader__chapter-btn egw-book-reader__chapter-btn--active'
                      : 'egw-book-reader__chapter-btn'
                  }
                  onClick={() => setActiveChapterId(chapter.id)}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          ) : (
            <p className="egw-book-reader__chapter-label">{activeChapter.title}</p>
          )}

          <VerticallyResizable
            storageKey={`egw-reader-${bookId}`}
            defaultHeight={420}
            minHeight={240}
            maxHeight={900}
            className="egw-book-reader__resizable"
          >
            <article
              className="egw-book-reader__article study-article"
              aria-label={activeChapter.title}
            >
              {renderArticleMarkdown(activeChapter.content)}
            </article>
          </VerticallyResizable>
        </>
      )}
    </div>
  );
}
