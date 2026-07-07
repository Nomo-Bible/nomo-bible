import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useReader } from '@/context/ReaderContext';
import { ScriptureReaderPanel } from '@/components/workspace/ScriptureReaderPanel';
import './mobile-v3.css';

interface MobileBibleReaderShellProps {
  onOpenNavigator: () => void;
}

export function MobileBibleReaderShell({ onOpenNavigator }: MobileBibleReaderShellProps) {
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
      </header>

      <div className="mobile-v3-reader__text">
        <ScriptureReaderPanel variant="mobile" hideChrome />
      </div>
    </div>
  );
}
