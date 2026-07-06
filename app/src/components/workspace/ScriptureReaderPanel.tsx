import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useReader } from '@/context/ReaderContext';
import { useWordStudy } from '@/context/WordStudyContext';
import { getChapter } from '@/services/bibleService';
import { getVerseWordTokens } from '@/services/kjvStrongsTokenService';
import { formatReaderLocation, formatReference } from '@/types/bible';
import { renderVerseContent } from '@/utils/formatVerseText';
import './ScriptureReaderPanel.css';

export function ScriptureReaderPanel() {
  const {
    location,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
  } = useReader();
  const { openWordStudy, activeTokenId } = useWordStudy();
  const activeVerseRef = useRef<HTMLParagraphElement>(null);
  const chapter = getChapter(location.book, location.chapter);
  const heading = formatReaderLocation(location);

  useEffect(() => {
    if (location.verse !== null && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.book, location.chapter, location.verse]);

  const header = (
    <header className="scripture-reader__header">
      <div className="scripture-reader__chapter-nav">
        <button
          type="button"
          className="scripture-reader__chapter-btn"
          onClick={goToPreviousChapter}
          disabled={!canGoPrevious}
          aria-label="Previous chapter"
        >
          <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          className="scripture-reader__chapter-btn"
          onClick={goToNextChapter}
          disabled={!canGoNext}
          aria-label="Next chapter"
        >
          Next
          <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <h2 className="scripture-reader__heading">{heading}</h2>

      <span className="scripture-reader__badge">KJV</span>
    </header>
  );

  if (!chapter) {
    return (
      <article className="scripture-reader" aria-label="Scripture text">
        {header}
        <p className="scripture-reader__empty">
          This passage could not be loaded.
        </p>
      </article>
    );
  }

  return (
    <article className="scripture-reader" aria-label="Scripture text">
      {header}

      <div className="scripture-reader__text">
        {chapter.verses.map(({ number, text }) => {
          const isActive = location.verse === number;
          const tokenIdPrefix = `${location.book}:${location.chapter}:${number}`;
          const tokens = getVerseWordTokens(location.book, location.chapter, number);
          return (
            <p
              key={number}
              ref={isActive ? activeVerseRef : undefined}
              className={
                isActive
                  ? 'scripture-reader__verse scripture-reader__verse--active'
                  : 'scripture-reader__verse'
              }
              id={isActive ? 'scripture-active-verse' : undefined}
            >
              <sup className="scripture-reader__verse-num">{number}</sup>
              {renderVerseContent(text, tokens, {
                tokenIdPrefix,
                activeTokenId,
                onWordClick: (token, tokenIndex, event) => {
                  openWordStudy(
                    token,
                    tokenIndex,
                    {
                      book: location.book,
                      chapter: location.chapter,
                      verse: number,
                    },
                    formatReference({
                      book: location.book,
                      chapter: location.chapter,
                      verse: number,
                    }),
                    event,
                  );
                },
              })}
            </p>
          );
        })}
      </div>
    </article>
  );
}
