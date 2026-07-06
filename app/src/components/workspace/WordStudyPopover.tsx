import { Search, StickyNote, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useWordStudy } from '@/context/WordStudyContext';
import { useWordStudyPopoverPosition } from '@/hooks/useWordStudyPopoverPosition';
import { isStrongsDataInstalled } from '@/services/strongsService';
import { wordStudyStatusMessage } from '@/services/wordStudyService';
import './WordStudyPopover.css';

function StrongsEntryDetail({
  entry,
}: {
  entry: NonNullable<ReturnType<typeof useWordStudy>['entry']>;
}) {
  return (
    <div className="word-study-popover__entry">
      <p className="word-study-popover__entry-header">
        <span className="word-study-popover__entry-number">{entry.strongsNumber}</span>
        <span className="word-study-popover__entry-lang">{entry.language}</span>
      </p>
      {entry.originalWord && (
        <p className="word-study-popover__entry-original">{entry.originalWord}</p>
      )}
      {entry.transliteration && (
        <p className="word-study-popover__entry-line">
          <span className="word-study-popover__label">Transliteration:</span>{' '}
          {entry.transliteration}
        </p>
      )}
      {entry.pronunciation && entry.pronunciation !== entry.transliteration && (
        <p className="word-study-popover__entry-line">
          <span className="word-study-popover__label">Pronunciation:</span>{' '}
          {entry.pronunciation}
        </p>
      )}
      <p className="word-study-popover__entry-def">{entry.definition}</p>
      {entry.kjvUsage && (
        <p className="word-study-popover__entry-line">
          <span className="word-study-popover__label">KJV usage:</span> {entry.kjvUsage}
        </p>
      )}
      {entry.rootWord && (
        <p className="word-study-popover__entry-line">
          <span className="word-study-popover__label">Root:</span> {entry.rootWord}
        </p>
      )}
      <p className="word-study-popover__entry-source">{entry.source}</p>
    </div>
  );
}

export function WordStudyPopover() {
  const {
    selection,
    anchor,
    entry,
    closeWordStudy,
    searchWordInConcordance,
    searchPossibleMatches,
    insertWordStudyNote,
  } = useWordStudy();
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOpen = Boolean(selection && anchor);

  const contentKey = selection
    ? `${selection.tokenId}:${selection.status}:${entry?.strongsNumber ?? 'none'}`
    : '';

  const { style, placement, isMobile, isReady } = useWordStudyPopoverPosition({
    popoverRef,
    tokenId: selection?.tokenId ?? null,
    anchor,
    open: isOpen,
    contentKey,
  });

  useEffect(() => {
    if (!selection) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeWordStudy();
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (popoverRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('.scripture-reader__word')) {
        return;
      }
      closeWordStudy();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [closeWordStudy, selection]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      popoverRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, selection?.tokenId]);

  if (!selection || !anchor) {
    return null;
  }

  const statusMessage =
    selection && isStrongsDataInstalled()
      ? wordStudyStatusMessage({
          token: { text: selection.word, strongs: selection.strongsNumber },
          tokenIndex: selection.tokenIndex,
          reference: selection.reference,
          referenceLabel: selection.referenceLabel,
          displayedText: selection.word,
          normalizedText: selection.normalizedText,
          strongsNumber: selection.strongsNumber,
          normalizedStrongsNumber: selection.normalizedStrongsNumber,
          entry,
          status: selection.status,
        })
      : null;

  const showPrimaryEntry = selection.status === 'found' && entry;

  const popoverClassName = [
    'word-study-popover',
    `word-study-popover--${placement}`,
    isMobile ? 'word-study-popover--sheet' : '',
    isReady ? 'word-study-popover--ready' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle = {
    ...style,
    maxHeight:
      typeof style.maxHeight === 'number' ? `${style.maxHeight}px` : style.maxHeight,
    width: typeof style.width === 'number' ? `${style.width}px` : style.width,
    left: typeof style.left === 'number' ? `${style.left}px` : style.left,
    right: typeof style.right === 'number' ? `${style.right}px` : style.right,
    top: typeof style.top === 'number' ? `${style.top}px` : style.top,
    bottom: typeof style.bottom === 'number' ? `${style.bottom}px` : style.bottom,
  };

  return (
    <>
      <div
        className={
          isMobile
            ? 'word-study-popover__backdrop word-study-popover__backdrop--dimmed'
            : 'word-study-popover__backdrop'
        }
        aria-hidden="true"
        onClick={isMobile ? closeWordStudy : undefined}
      />
      <div
        ref={popoverRef}
        className={popoverClassName}
        style={inlineStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-study-title"
        tabIndex={-1}
      >
        <header className="word-study-popover__header">
          <div className="word-study-popover__heading">
            <h3 id="word-study-title" className="word-study-popover__title">
              {selection.word}
            </h3>
            <p className="word-study-popover__ref">{selection.referenceLabel}</p>
          </div>
          <button
            type="button"
            className="word-study-popover__close"
            onClick={closeWordStudy}
            aria-label="Close word study"
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="word-study-popover__body">
          {!isStrongsDataInstalled() && (
            <p className="word-study-popover__empty">
              Strong&apos;s dictionary data is not installed yet.
            </p>
          )}

          {isStrongsDataInstalled() && statusMessage && (
            <p className="word-study-popover__empty">{statusMessage}</p>
          )}

          {showPrimaryEntry && <StrongsEntryDetail entry={entry} />}
        </div>

        <footer className="word-study-popover__actions">
          <button
            type="button"
            className="word-study-popover__btn word-study-popover__btn--secondary"
            onClick={() => searchWordInConcordance(selection.word)}
          >
            <Search size={14} strokeWidth={2} aria-hidden="true" />
            Search in Concordance
          </button>
          {selection.status === 'untagged' && (
            <button
              type="button"
              className="word-study-popover__btn word-study-popover__btn--secondary"
              onClick={searchPossibleMatches}
            >
              Search possible matches
            </button>
          )}
          <button
            type="button"
            className="word-study-popover__btn word-study-popover__btn--primary"
            onClick={() => insertWordStudyNote(entry)}
          >
            <StickyNote size={14} strokeWidth={2} aria-hidden="true" />
            Insert into Study Notes
          </button>
          <button
            type="button"
            className="word-study-popover__btn word-study-popover__btn--ghost"
            onClick={closeWordStudy}
          >
            Close
          </button>
        </footer>
      </div>
    </>
  );
}
