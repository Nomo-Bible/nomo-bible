import { useEffect, useRef } from 'react';
import { useReader } from '@/context/ReaderContext';
import { getChapter } from '@/services/bibleService';
import { formatReaderLocation } from '@/types/bible';
import { formatVerseText } from '@/utils/formatVerseText';
import './ScriptureReaderPanel.css';

export function ScriptureReaderPanel() {
  const {
    location,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
  } = useReader();
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
          ← Previous
        </button>
        <button
          type="button"
          className="scripture-reader__chapter-btn"
          onClick={goToNextChapter}
          disabled={!canGoNext}
          aria-label="Next chapter"
        >
          Next →
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
              {formatVerseText(text)}
            </p>
          );
        })}
      </div>
    </article>
  );
}
