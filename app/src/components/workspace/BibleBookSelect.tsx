import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { filterCanonicalBooks } from '@/data/bible/canonicalBooks';
import { getAvailableBooks } from '@/services/bibleService';
import './BibleBookSelect.css';

interface BibleBookSelectProps {
  id?: string;
  value: string;
  onChange: (book: string) => void;
  className?: string;
}

export function BibleBookSelect({ id, value, onChange, className }: BibleBookSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const availableBooks = useMemo(() => getAvailableBooks(), []);
  const filteredBooks = useMemo(
    () => filterCanonicalBooks(query, availableBooks),
    [availableBooks, query],
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    searchRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`bible-book-select${open ? ' bible-book-select--open' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        id={id}
        className="bible-book-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="bible-book-select__value">{value}</span>
        <ChevronDown className="bible-book-select__chevron" size={14} strokeWidth={2} aria-hidden="true" />
      </button>

      {open ? (
        <div className="bible-book-select__popover">
          <input
            ref={searchRef}
            type="search"
            className="bible-book-select__search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books…"
            aria-label="Search Bible books"
          />
          <ul
            id={listId}
            className="bible-book-select__list"
            role="listbox"
            aria-label="Bible books"
          >
            {filteredBooks.length === 0 ? (
              <li className="bible-book-select__empty" role="presentation">
                No matching books
              </li>
            ) : (
              filteredBooks.map((book) => (
                <li key={book} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={book === value}
                    className={
                      book === value
                        ? 'bible-book-select__option bible-book-select__option--selected'
                        : 'bible-book-select__option'
                    }
                    onClick={() => {
                      onChange(book);
                      setOpen(false);
                    }}
                  >
                    {book}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
