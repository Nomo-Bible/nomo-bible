import { BookText, ChevronLeft, ChevronRight, Square, SquareCheck } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { BibleSearch } from '@/components/layout/BibleSearch';
import { useReader } from '@/context/ReaderContext';
import { useScriptureInteraction } from '@/context/ScriptureInteractionContext';
import { useWorkspaceExpand } from '@/context/WorkspaceExpandContext';
import { useWordStudy } from '@/context/WordStudyContext';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { VerseSelectionToolbar } from '@/components/workspace/VerseSelectionToolbar';
import { getChapter } from '@/services/bibleService';
import { getConcordanceHighlightTokenIndexes } from '@/services/concordanceService';
import { getVerseWordTokens } from '@/services/kjvStrongsTokenService';
import { formatReaderLocation, formatReference } from '@/types/bible';
import { renderVerseContent, buildDisplayWordTokens } from '@/utils/formatVerseText';
import './ScriptureReaderPanel.css';

interface ScriptureReaderPanelProps {
  variant?: 'default' | 'mobile';
  hideChrome?: boolean;
  showSelectionToolbar?: boolean;
}

interface ContextMenuState {
  verse: number;
  x: number;
  y: number;
}

export function ScriptureReaderPanel({
  variant = 'default',
  hideChrome = false,
  showSelectionToolbar = true,
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
  const { isExpanded, collapsePanel } = useWorkspaceExpand();
  const scriptureExpanded = isExpanded('scripture');
  const { isAuthenticated, openAuthPrompt } = useAuth();
  const [, setSearchParams] = useSearchParams();
  const {
    isVerseSelected,
    getVerseHighlightColor,
    toggleVerseSelection,
    flashingVerse,
    copySelectedVerses,
    addSelectedToStudyNote,
    highlightSelectedVerses,
    openCrossReferencesTab,
    shareSelectedVerses,
  } = useScriptureInteraction();
  const activeVerseRef = useRef<HTMLParagraphElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
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
        `#scripture-verse-${location.verse} .scripture-reader__word--search-match`,
      );
      match?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [concordanceHighlight, location.book, location.chapter, location.verse]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = (event: MouseEvent | TouchEvent) => {
      if (contextMenuRef.current?.contains(event.target as Node)) return;
      setContextMenu(null);
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('touchstart', close);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('touchstart', close);
    };
  }, [contextMenu]);

  const openContextMenu = useCallback((verse: number, x: number, y: number) => {
    setContextMenu({ verse, x, y });
  }, []);

  const runContextAction = useCallback(
    (verse: number, action: () => void | Promise<unknown>) => {
      if (!isVerseSelected(verse)) {
        toggleVerseSelection(verse);
      }
      void action();
      setContextMenu(null);
    },
    [isVerseSelected, toggleVerseSelection],
  );

  const buildVerseClassName = (number: number, isActive: boolean) => {
    const classes = ['scripture-reader__verse'];
    if (isActive) classes.push('scripture-reader__verse--active');
    if (isVerseSelected(number)) classes.push('scripture-reader__verse--selected');
    if (flashingVerse === number) classes.push('scripture-reader__verse--flash');
    const highlightColor = getVerseHighlightColor(number);
    if (highlightColor) {
      classes.push('scripture-reader__verse--highlighted');
    }
    return classes.join(' ');
  };

  const header = (
    <>
      {scriptureExpanded ? (
        <div className="scripture-reader__return">
          <button
            type="button"
            className="scripture-reader__return-link"
            onClick={collapsePanel}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back to workspace
          </button>
        </div>
      ) : null}
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

      <div className="scripture-reader__header-tools">
        <div className="scripture-reader__header-search">
          <BibleSearch variant="embedded" />
        </div>
        <div className="scripture-reader__header-meta">
          <button
            type="button"
            className="scripture-reader__guide-btn"
            onClick={() =>
              setSearchParams(
                (current) => {
                  const next = new URLSearchParams(current);
                  next.set('tab', 'kjv-word-guide');
                  next.delete('q');
                  next.delete('lookup');
                  next.set('run', Date.now().toString());
                  return next;
                },
                { replace: false },
              )
            }
            title="Open KJV Word Guide"
          >
            <BookText size={14} strokeWidth={2} aria-hidden="true" />
            <span>KJV Word Guide</span>
          </button>
          <WorkspaceExpandButton
            panelId="scripture"
            label="Scripture reader"
            readingFocusId="scripture-reader"
            compact
          />
          <span className="scripture-reader__badge">KJV</span>
        </div>
      </div>
    </header>
    </>
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

  const toolbar =
    showSelectionToolbar ? (
      <VerseSelectionToolbar variant={variant === 'mobile' ? 'mobile' : 'desktop'} />
    ) : null;

  const verseContent = (
    <div className="scripture-reader__text">
      {chapter.verses.map(({ number, text }) => {
        const isActive = location.verse === number;
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
        const referenceLabel = formatReference({
          book: location.book,
          chapter: location.chapter,
          verse: number,
        });
        const highlightColor = getVerseHighlightColor(number);
        const selected = isVerseSelected(number);

        return (
          <p
            key={number}
            ref={isActive ? activeVerseRef : undefined}
            className={buildVerseClassName(number, isActive)}
            id={`scripture-verse-${number}`}
            data-active={isActive ? 'true' : undefined}
            data-highlight-color={highlightColor ?? undefined}
            onContextMenu={(event) => {
              event.preventDefault();
              openContextMenu(number, event.clientX, event.clientY);
            }}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (!touch) return;
              longPressRef.current = setTimeout(() => {
                openContextMenu(number, touch.clientX, touch.clientY);
              }, 500);
            }}
            onTouchEnd={() => {
              if (longPressRef.current) {
                clearTimeout(longPressRef.current);
                longPressRef.current = null;
              }
            }}
            onTouchMove={() => {
              if (longPressRef.current) {
                clearTimeout(longPressRef.current);
                longPressRef.current = null;
              }
            }}
          >
            <button
              type="button"
              className="scripture-reader__verse-select"
              aria-label={`${selected ? 'Deselect' : 'Select'} ${referenceLabel}`}
              aria-pressed={selected}
              onClick={(event) => {
                event.stopPropagation();
                toggleVerseSelection(number, event.shiftKey);
              }}
            >
              {selected ? (
                <SquareCheck size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Square size={14} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
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
                  referenceLabel,
                  event,
                );
              },
            })}
          </p>
        );
      })}

      {contextMenu ? (
        <div
          ref={contextMenuRef}
          className="verse-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          role="menu"
          aria-label="Verse actions"
        >
          <button
            type="button"
            className="verse-context-menu__item"
            onClick={() => runContextAction(contextMenu.verse, copySelectedVerses)}
          >
            Copy
          </button>
          <button
            type="button"
            className="verse-context-menu__item"
            onClick={() => runContextAction(contextMenu.verse, addSelectedToStudyNote)}
          >
            Add Note
          </button>
          <button
            type="button"
            className="verse-context-menu__item"
            onClick={() =>
              runContextAction(contextMenu.verse, () => highlightSelectedVerses())
            }
          >
            Highlight
          </button>
          <button
            type="button"
            className="verse-context-menu__item"
            onClick={() => runContextAction(contextMenu.verse, openCrossReferencesTab)}
          >
            Cross Reference
          </button>
          <button
            type="button"
            className="verse-context-menu__item"
            onClick={() => runContextAction(contextMenu.verse, shareSelectedVerses)}
          >
            Share
          </button>
        </div>
      ) : null}
    </div>
  );

  if (hideChrome) {
    return (
      <>
        {toolbar}
        {verseContent}
      </>
    );
  }

  return (
    <article className={readerClass} aria-label="Scripture text">
      {header}
      {toolbar}
      {verseContent}
    </article>
  );
}
