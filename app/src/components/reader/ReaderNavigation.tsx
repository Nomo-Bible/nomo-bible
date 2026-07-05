import { useReader } from '@/context/ReaderContext';
import {
  getAvailableBooks,
  getChaptersForBook,
  getVerseNumbers,
} from '@/services/bibleService';
import './ReaderNavigation.css';

export function ReaderNavigation() {
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
  const verseSelectValue =
    location.verse === null ? 'chapter' : String(location.verse);

  return (
    <nav className="reader-nav" aria-label="Scripture navigation">
      <div className="reader-nav__group">
        <label htmlFor="book-select" className="reader-nav__label">
          Book
        </label>
        <select
          id="book-select"
          className="reader-nav__select"
          value={location.book}
          onChange={(e) => setBook(e.target.value)}
        >
          {books.map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>
      </div>

      <div className="reader-nav__group">
        <label htmlFor="chapter-select" className="reader-nav__label">
          Chapter
        </label>
        <select
          id="chapter-select"
          className="reader-nav__select"
          value={location.chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
        >
          {chapters.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="reader-nav__group">
        <label htmlFor="verse-select" className="reader-nav__label">
          Verse
        </label>
        <select
          id="verse-select"
          className="reader-nav__select"
          value={verseSelectValue}
          onChange={(e) => {
            const value = e.target.value;
            setVerse(value === 'chapter' ? null : Number(value));
          }}
        >
          <option value="chapter">Full chapter</option>
          {verses.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="reader-nav__chapter-buttons">
        <button
          type="button"
          className="reader-nav__chapter-btn"
          onClick={goToPreviousChapter}
          disabled={!canGoPrevious}
        >
          ← Previous Chapter
        </button>
        <button
          type="button"
          className="reader-nav__chapter-btn"
          onClick={goToNextChapter}
          disabled={!canGoNext}
        >
          Next Chapter →
        </button>
      </div>
    </nav>
  );
}
