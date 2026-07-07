import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/auth/useAuth';
import { useReader } from '@/context/ReaderContext';
import { useWordStudy } from '@/context/WordStudyContext';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { getChapter } from '@/services/bibleService';
import { getConcordanceHighlightTokenIndexes } from '@/services/concordanceService';
import { getVerseWordTokens } from '@/services/kjvStrongsTokenService';
import { formatReaderLocation, formatReference } from '@/types/bible';
import { renderVerseContent, buildDisplayWordTokens } from '@/utils/formatVerseText';
import './ScriptureReaderPanel.css';

interface ScriptureReaderPanelProps {
  variant?: 'default' | 'mobile';
  hideChrome?: boolean;
}

export function ScriptureReaderPanel({
  variant = 'default',
  hideChrome = false,
}: ScriptureReaderPanelProps) {
  const {
    location,
    concordanceHighlight,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
    setVerse,
  } = useReader();
  const { openWordStudy, activeTokenId } = useWordStudy();
  const { isAuthenticated, openAuthPrompt } = useAuth();
  const activeVerseRef = useRef<HTMLParagraphElement>(null);
  const chapter = getChapter(location.book, location.chapter);
  const heading = formatReaderLocation(location);
  const readerClass =
    variant === 'mobile'
      ? 'scripture-reader scripture-reader--mobile'
      : 'scripture-reader';
  useEffect(() => {
    if (location.verse !== null && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.book, location.chapter, location.verse]);

  useEffect(() => {
    if (!concordanceHighlight) return;
    if (
      location.book !== concordanceHighlight.book ||
      location.chapter !== concordanceHighlight.chapter ||
      location.verse !== concordanceHighlight.verse
    ) {
      return;
    }

    requestAnimationFrame(() => {
      const match = document.querySelector(
        '#scripture-active-verse .scripture-reader__word--search-match',
      );
      match?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [concordanceHighlight, location.book, location.chapter, location.verse]);

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

      <div className="scripture-reader__header-actions">
        <WorkspaceExpandButton panelId="scripture" label="Scripture reader" compact />
        <span className="scripture-reader__badge">KJV</span>
      </div>
    </header>
  );

  if (!chapter) {
    if (hideChrome) {
      return (
        <p className="scripture-reader__empty">This passage could not be loaded.</p>
      );
    }
    return (
      <article className={readerClass} aria-label="Scripture text">
        {header}
        <p className="scripture-reader__empty">This passage could not be loaded.</p>
      </article>
    );
  }

  const verseContent = (
    <div className="scripture-reader__text">
      {chapter.verses.map(({ number, text }) => {          const isActive = location.verse === number;
          const tokenIdPrefix = `${location.book}:${location.chapter}:${number}`;
          const tokens = getVerseWordTokens(location.book, location.chapter, number);
          const highlightedTokenIndexes =
            concordanceHighlight &&
            concordanceHighlight.book === location.book &&
            concordanceHighlight.chapter === location.chapter &&
            concordanceHighlight.verse === number
              ? getConcordanceHighlightTokenIndexes(
                  tokens ?? buildDisplayWordTokens(text),
                  concordanceHighlight.query,
                )
              : undefined;
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
                highlightedTokenIndexes,
                onWordClick: (token, tokenIndex, event) => {
                  if (!isAuthenticated) {
                    openAuthPrompt();
                    return;
                  }
                  setVerse(number);
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
  );

  if (hideChrome) {
    return verseContent;
  }

  return (
    <article className={readerClass} aria-label="Scripture text">
      {header}
      {verseContent}
    </article>
  );
}