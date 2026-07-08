import { BookMarked, ChevronDown, Hash, ListOrdered, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useReader } from '@/context/ReaderContext';
import { WorkspaceExpandButton } from '@/components/workspace/WorkspaceExpandButton';
import { BibleBookSelect } from '@/components/workspace/BibleBookSelect';
import {
  getChaptersForBook,
  getVerseNumbers,
} from '@/services/bibleService';
import { formatReaderLocation } from '@/types/bible';
import './BibleBookSelect.css';
import './ScriptureNavigationPanel.css';

export function ScriptureNavigationPanel() {
  const {
    location,
    setBook,
    setChapter,
    setVerse,
  } = useReader();
  const [mobileOpen, setMobileOpen] = useState(false);

  const chapters = getChaptersForBook(location.book);
  const verses = getVerseNumbers(location.book, location.chapter);
  const reference = formatReaderLocation(location);
  const verseSelectValue =
    location.verse === null ? 'chapter' : String(location.verse);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.book, location.chapter, location.verse]);

  return (
    <nav
      className={`scripture-nav${mobileOpen ? ' scripture-nav--open' : ''}`}
      aria-label="Scripture navigation"
    >
      <header className="scripture-nav__header">
        <button
          type="button"
          className="scripture-nav__mobile-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="scripture-nav-controls"
        >
          <Compass className="scripture-nav__header-icon" aria-hidden="true" size={16} strokeWidth={2} />
          <span className="scripture-nav__mobile-toggle-text">
            <span className="scripture-nav__title">Navigate</span>
            <span className="scripture-nav__mobile-ref">{reference}</span>
          </span>
          <ChevronDown
            className="scripture-nav__mobile-chevron"
            aria-hidden="true"
            size={16}
            strokeWidth={2}
          />
        </button>
        <div className="scripture-nav__header-desktop">
          <Compass className="scripture-nav__header-icon" aria-hidden="true" size={16} strokeWidth={2} />
          <h2 className="scripture-nav__title">Navigate</h2>
        </div>
        <WorkspaceExpandButton panelId="nav" label="Navigation" />
      </header>

      <div className="scripture-nav__reference" aria-live="polite">
        <span className="scripture-nav__reference-label">Current passage</span>
        <span className="scripture-nav__reference-value">{reference}</span>
        <span className="scripture-nav__translation">King James Version</span>
      </div>

      <div className="scripture-nav__controls" id="scripture-nav-controls">
        <div className="scripture-nav__group">
          <label htmlFor="workspace-book-select" className="scripture-nav__label">
            <BookMarked className="scripture-nav__label-icon" aria-hidden="true" size={13} strokeWidth={2} />
            Book
          </label>
          <BibleBookSelect
            id="workspace-book-select"
            className="scripture-nav__select"
            value={location.book}
            onChange={setBook}
          />
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
