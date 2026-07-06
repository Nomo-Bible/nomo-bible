import { BookMarked, Hash, ListOrdered, Compass } from 'lucide-react';
import { useReader } from '@/context/ReaderContext';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import {
  getAvailableBooks,
  getChaptersForBook,
  getVerseNumbers,
} from '@/services/bibleService';
import { formatReaderLocation } from '@/types/bible';
import './ScriptureNavigationPanel.css';

export function ScriptureNavigationPanel() {
  const {
    location,
    setBook,
    setChapter,
    setVerse,
  } = useReader();

  const books = getAvailableBooks();
  const chapters = getChaptersForBook(location.book);
  const verses = getVerseNumbers(location.book, location.chapter);
  const reference = formatReaderLocation(location);
  const verseSelectValue =
    location.verse === null ? 'chapter' : String(location.verse);

  return (
    <nav className="scripture-nav" aria-label="Scripture navigation">
      <header className="scripture-nav__header">
        <Compass className="scripture-nav__header-icon" aria-hidden="true" size={16} strokeWidth={2} />
        <h2 className="scripture-nav__title">Navigate</h2>
        <WorkspaceExpandButton panelId="nav" label="Navigation" />
      </header>

      <div className="scripture-nav__reference" aria-live="polite">
        <span className="scripture-nav__reference-label">Current passage</span>
        <span className="scripture-nav__reference-value">{reference}</span>
        <span className="scripture-nav__translation">King James Version</span>
      </div>

      <div className="scripture-nav__controls">
        <div className="scripture-nav__group">
          <label htmlFor="workspace-book-select" className="scripture-nav__label">
            <BookMarked className="scripture-nav__label-icon" aria-hidden="true" size={13} strokeWidth={2} />
            Book
          </label>
          <select
            id="workspace-book-select"
            className="scripture-nav__select"
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

        <div className="scripture-nav__group">
          <label htmlFor="workspace-chapter-select" className="scripture-nav__label">
            <Hash className="scripture-nav__label-icon" aria-hidden="true" size={13} strokeWidth={2} />
            Chapter
          </label>
          <select
            id="workspace-chapter-select"
            className="scripture-nav__select"
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

        <div className="scripture-nav__group">
          <label htmlFor="workspace-verse-select" className="scripture-nav__label">
            <ListOrdered className="scripture-nav__label-icon" aria-hidden="true" size={13} strokeWidth={2} />
            Verse
          </label>
          <select
            id="workspace-verse-select"
            className="scripture-nav__select"
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
      </div>
    </nav>
  );
}
