import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import { VerticallyResizable } from '@/components/workspace/VerticallyResizable';
import { getEgwBookById } from '@/data/resources/catalog/egwBooks';
import {
  loadEgwBookText,
  type EgwBookText,
} from '@/services/studyResources/egwTextService';
import { renderPlainText } from '@/utils/renderPlainText';
import './EgwBookReader.css';

interface EgwBookReaderProps {
  bookId: string;
  onClose: () => void;
}

export function EgwBookReader({ bookId, onClose }: EgwBookReaderProps) {
  const book = getEgwBookById(bookId);
  const [bookText, setBookText] = useState<EgwBookText | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setBookText(null);
    setActiveChapterId(null);

    loadEgwBookText(bookId)
      .then((text) => {
        if (cancelled) return;
        if (!text) {
          setLoadFailed(true);
          return;
        }
        setBookText(text);
        setActiveChapterId(text.chapters[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  if (!book) {
    return null;
  }

  const activeChapter =
    bookText?.chapters.find((chapter) => chapter.id === activeChapterId) ??
    bookText?.chapters[0] ??
    null;

  const missingText = !loading && (loadFailed || !bookText || !activeChapter);

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

      {loading ? (
        <div className="egw-book-reader__loading" role="status">
          Loading local text…
        </div>
      ) : null}

      {missingText ? (
        <div className="egw-book-reader__missing" role="status">
          <p className="egw-book-reader__missing-title">Full text not available</p>
          <p className="egw-book-reader__missing-body">
            Full local text has not been imported yet.
          </p>
        </div>
      ) : null}

      {!loading && bookText && activeChapter ? (
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
              {renderPlainText(activeChapter.content)}
            </article>
          </VerticallyResizable>
        </>
      ) : null}
    </div>
  );
}
