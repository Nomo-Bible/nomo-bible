import {
  BookOpen,
  BookText,
  ChevronLeft,
  ChevronRight,
  Compass,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { BibleSearch } from '@/components/layout/BibleSearch';
import { useReader } from '@/context/ReaderContext';
import { ScriptureReaderPanel } from '@/components/workspace/ScriptureReaderPanel';
import './mobile-v3.css';

interface MobileBibleReaderShellProps {
  onOpenNavigator: () => void;
  onOpenKjvWordGuide?: () => void;
  expanded?: boolean;
  onExpand?: () => void;
}

export function MobileBibleReaderShell({
  onOpenNavigator,
  onOpenKjvWordGuide,
  expanded = false,
  onExpand,
}: MobileBibleReaderShellProps) {
  const {
    location,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
  } = useReader();

  const reference = `${location.book} ${location.chapter}`;

  return (
    <div className="mobile-v3-reader">
      <header className="mobile-v3-reader__chrome">
        <div className="mobile-v3-reader__toolbar">
          <div className="mobile-v3-reader__ref">
            <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
            <span className="mobile-v3-reader__ref-text">{reference}</span>
            <span className="mobile-v3-reader__badge">KJV</span>
          </div>

          <div className="mobile-v3-reader__actions">
            {onExpand ? (
              <button
                type="button"
                className="mobile-v3-reader__action-btn"
                onClick={onExpand}
                aria-label={expanded ? 'Restore Scripture layout' : 'Expand Bible reader'}
              >
                {expanded ? (
                  <Minimize2 size={14} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Maximize2 size={14} strokeWidth={2} aria-hidden="true" />
                )}
                {expanded ? 'Restore' : 'Expand'}
              </button>
            ) : null}
            {onOpenKjvWordGuide ? (
              <button
                type="button"
                className="mobile-v3-reader__action-btn"
                onClick={onOpenKjvWordGuide}
                title="Open KJV Word Guide"
              >
                <BookText size={14} strokeWidth={2} aria-hidden="true" />
                KJV Word Guide
              </button>
            ) : null}
            <button
              type="button"
              className="mobile-v3-reader__action-btn mobile-v3-reader__action-btn--accent"
              onClick={onOpenNavigator}
            >
              <Compass size={14} strokeWidth={2} aria-hidden="true" />
              Browse Books &amp; Chapters
            </button>
          </div>
        </div>

        <div className="mobile-v3-reader__chapter-nav">
          <button
            type="button"
            className="mobile-v3-reader__nav-btn"
            onClick={goToPreviousChapter}
            disabled={!canGoPrevious}
            aria-label="Previous chapter"
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
            Previous
          </button>
          <button
            type="button"
            className="mobile-v3-reader__nav-btn"
            onClick={goToNextChapter}
            disabled={!canGoNext}
            aria-label="Next chapter"
          >
            Next
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="mobile-v3-reader__search">
          <BibleSearch variant="embedded" />
        </div>
      </header>

      <div className="mobile-v3-reader__text">
        <ScriptureReaderPanel variant="mobile" hideChrome />
      </div>
    </div>
  );
}
