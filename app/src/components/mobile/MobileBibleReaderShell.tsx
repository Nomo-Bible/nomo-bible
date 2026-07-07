import { BookMarked, ChevronLeft, ChevronRight, Hash, ListOrdered } from 'lucide-react';
import { useReader } from '@/context/ReaderContext';
import {
  getAvailableBooks,
  getChaptersForBook,
  getVerseNumbers,
} from '@/services/bibleService';
import { formatReaderLocation } from '@/types/bible';
import { ScriptureReaderPanel } from '@/components/workspace/ScriptureReaderPanel';
import './mobile-v3.css';

export function MobileBibleReaderShell() {
  const {
    location,
    setBook,
    setChapter,
    setVerse,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
  } = useReader();

  const books = getAvailableBooks();
  const chapters = getChaptersForBook(location.book);
  const verses = getVerseNumbers(location.book, location.chapter);
  const heading = formatReaderLocation(location);
  const verseSelectValue = location.verse === null ? 'chapter' : String(location.verse);

  return (
    <div className="mobile-v3-reader">
      <header className="mobile-v3-reader__chrome">
        <div className="mobile-v3-reader__title-row">
          <h2 className="mobile-v3-reader__heading">{heading}</h2>
          <span className="mobile-v3-reader__badge">KJV</span>
        </div>
        <div className="mobile-v3-reader__selects">
          <label className="mobile-v3-reader__field">
            <BookMarked size={14} strokeWidth={2} aria-hidden="true" />
            <select
              className="mobile-v3-reader__select"
              value={location.book}
              onChange={(e) => setBook(e.target.value)}
              aria-label="Book"
            >
              {books.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
          </label>
          <label className="mobile-v3-reader__field">
            <Hash size={14} strokeWidth={2} aria-hidden="true" />
            <select
              className="mobile-v3-reader__select"
              value={location.chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              aria-label="Chapter"
            >
              {chapters.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="mobile-v3-reader__field">
            <ListOrdered size={14} strokeWidth={2} aria-hidden="true" />
            <select
              className="mobile-v3-reader__select"
              value={verseSelectValue}
              onChange={(e) => {
                const value = e.target.value;
                setVerse(value === 'chapter' ? null : Number(value));
              }}
              aria-label="Verse"
            >
              <option value="chapter">All</option>
              {verses.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
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
