import { ArrowLeft, BookOpen, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReader } from '@/context/ReaderContext';
import { getFilteredBibleBookGroups } from '@/data/bible/bookGroups';
import { getChaptersForBook } from '@/services/bibleService';
import './MobileBibleNavigator.css';

interface MobileBibleNavigatorProps {
  open: boolean;
  onClose: () => void;
}

type NavigatorStep = 'books' | 'chapters';

export function MobileBibleNavigator({ open, onClose }: MobileBibleNavigatorProps) {
  const { location, goToPassage } = useReader();
  const [step, setStep] = useState<NavigatorStep>('books');
  const [selectedBook, setSelectedBook] = useState(location.book);
  const [bookQuery, setBookQuery] = useState('');
  const bookGroups = getFilteredBibleBookGroups(bookQuery);
  const chapters = getChaptersForBook(selectedBook);

  useEffect(() => {
    if (!open) return;
    setStep('books');
    setSelectedBook(location.book);
    setBookQuery('');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, location.book]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setStep('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    goToPassage({ book: selectedBook, chapter, verse: null });
    onClose();
  };

  return createPortal(
    <div className="mobile-bible-nav" role="presentation">
      <button
        type="button"
        className="mobile-bible-nav__backdrop"
        onClick={onClose}
        aria-label="Close Bible navigator"
      />
      <div
        className="mobile-bible-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Bible navigator"
      >
        <header className="mobile-bible-nav__header">
          {step === 'chapters' ? (
            <button
              type="button"
              className="mobile-bible-nav__back"
              onClick={() => setStep('books')}
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
              Books
            </button>
          ) : (
            <div className="mobile-bible-nav__brand">
              <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
              <span>Bible Navigator</span>
            </div>
          )}
          <button
            type="button"
            className="mobile-bible-nav__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        {step === 'books' ? (
          <div className="mobile-bible-nav__body">
            <p className="mobile-bible-nav__lead">
              Choose a book. You will pick the chapter next.
            </p>
            <label className="mobile-bible-nav__search-label" htmlFor="mobile-bible-nav-book-search">
              Search books
            </label>
            <div className="mobile-bible-nav__search-wrap">
              <Search size={16} strokeWidth={2} aria-hidden="true" />
              <input
                id="mobile-bible-nav-book-search"
                type="search"
                className="mobile-bible-nav__search"
                value={bookQuery}
                onChange={(event) => setBookQuery(event.target.value)}
                placeholder="Filter by book name…"
              />
            </div>
            {bookGroups.length === 0 ? (
              <p className="mobile-bible-nav__empty">No matching books.</p>
            ) : (
              bookGroups.map((group) => (
              <section key={group.id} className="mobile-bible-nav__section">
                <h2 className="mobile-bible-nav__section-title">{group.label}</h2>
                <ul className="mobile-bible-nav__book-list">
                  {group.books.map((book) => {
                    const isCurrent = book === location.book;
                    return (
                      <li key={book}>
                        <button
                          type="button"
                          className={
                            isCurrent
                              ? 'mobile-bible-nav__book mobile-bible-nav__book--current'
                              : 'mobile-bible-nav__book'
                          }
                          onClick={() => handleBookSelect(book)}
                        >
                          {book}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
            )}
          </div>
        ) : (
          <div className="mobile-bible-nav__body">
            <h2 className="mobile-bible-nav__chapter-title">{selectedBook}</h2>
            <p className="mobile-bible-nav__lead">Select a chapter</p>
            <div className="mobile-bible-nav__chapter-grid">
              {chapters.map((chapter) => {
                const isCurrent =
                  selectedBook === location.book && chapter === location.chapter;
                return (
                  <button
                    key={chapter}
                    type="button"
                    className={
                      isCurrent
                        ? 'mobile-bible-nav__chapter mobile-bible-nav__chapter--current'
                        : 'mobile-bible-nav__chapter'
                    }
                    onClick={() => handleChapterSelect(chapter)}
                  >
                    {chapter}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
