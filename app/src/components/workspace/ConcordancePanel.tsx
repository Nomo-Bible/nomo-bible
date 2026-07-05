import {
  CONCORDANCE_PAGE_SIZE,
  searchConcordance,
  splitTextHighlight,
} from '@/services/concordanceService';
import { useReader } from '@/context/ReaderContext';
import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { EmptyState } from './EmptyState';
import './ConcordancePanel.css';

export function ConcordancePanel() {
  const { goToPassage } = useReader();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<ReturnType<
    typeof searchConcordance
  > | null>(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(0);

  const scrollPanelToResults = () => {
    requestAnimationFrame(() => {
      const content = document.querySelector('.study-workspace__content');
      if (content instanceof HTMLElement) {
        content.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setResponse(searchConcordance(trimmed));
    setSearched(true);
    setPage(0);
    scrollPanelToResults();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  const totalCount = response?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / CONCORDANCE_PAGE_SIZE));
  const pageStart = page * CONCORDANCE_PAGE_SIZE;
  const pageEnd = Math.min(pageStart + CONCORDANCE_PAGE_SIZE, totalCount);
  const pageResults =
    response?.results.slice(pageStart, pageEnd) ?? [];

  const goToPage = (nextPage: number) => {
    const clamped = Math.max(0, Math.min(nextPage, totalPages - 1));
    setPage(clamped);
    scrollPanelToResults();
  };

  return (
    <div className="concordance-panel">
      <div className="concordance-panel__notice">
        <strong>KJV Concordance</strong>
        <p>
          Original-language Strong&apos;s data has not yet been installed. This
          concordance currently searches the local KJV text.
        </p>
      </div>

      <form className="concordance-panel__form" onSubmit={handleSubmit}>
        <label htmlFor="concordance-search" className="concordance-panel__label">
          Search word or phrase
        </label>
        <div className="concordance-panel__row">
          <input
            id="concordance-search"
            type="text"
            className="concordance-panel__input"
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              if (!next.trim()) {
                setSearched(false);
                setResponse(null);
                setPage(0);
              }
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="e.g. beginning, faith, light"
            autoComplete="off"
            enterKeyHint="search"
          />
          <button type="submit" className="concordance-panel__btn">
            Search
          </button>
        </div>
      </form>

      {!searched && (
        <div className="concordance-panel__body">
          <EmptyState
            icon="📚"
            title="KJV Concordance"
            message="Search the local King James Version for a word or phrase. Results will appear here with verse references."
          />
        </div>
      )}

      {searched && response && response.totalCount === 0 && (
        <div className="concordance-panel__body">
          <EmptyState
            icon="🔍"
            title="No Results"
            message={`No KJV verses matched "${response.query}". Try a different word or phrase.`}
          />
        </div>
      )}

      {searched && response && response.totalCount > 0 && (
        <div className="concordance-panel__results-pane">
          <div className="concordance-panel__count-row">
            <p className="concordance-panel__count">
              {response.totalCount} passage{response.totalCount !== 1 ? 's' : ''}{' '}
              found
              {totalPages > 1 && (
                <span className="concordance-panel__range">
                  {' '}
                  · showing {pageStart + 1}–{pageEnd}
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <nav
                className="concordance-panel__pager"
                aria-label="Concordance result pages"
              >
                <button
                  type="button"
                  className="concordance-panel__pager-btn"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                >
                  ‹ Prev
                </button>
                <span className="concordance-panel__pager-status">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  className="concordance-panel__pager-btn"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  aria-label="Next page"
                >
                  Next ›
                </button>
              </nav>
            )}
          </div>
          <ul className="concordance-panel__results" aria-label="Concordance results">
            {pageResults.map((result) => {
              const displayText = stripKjvEditorialMarkup(result.text);
              const highlight = splitTextHighlight(displayText, response.query);
              const resultKey = `${result.reference.book}-${result.reference.chapter}-${result.reference.verse}`;
              return (
                <li key={resultKey}>
                  <button
                    type="button"
                    className="concordance-panel__result"
                    onClick={() => goToPassage(result.reference)}
                  >
                    <span className="concordance-panel__ref">
                      {result.referenceLabel}
                    </span>
                    <span className="concordance-panel__text">
                      {highlight ? (
                        <>
                          {highlight.before}
                          <mark className="concordance-panel__mark">
                            {highlight.match}
                          </mark>
                          {highlight.after}
                        </>
                      ) : (
                        displayText
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && (
            <nav
              className="concordance-panel__pager concordance-panel__pager--footer"
              aria-label="Concordance result pages"
            >
              <button
                type="button"
                className="concordance-panel__pager-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                aria-label="Previous page"
              >
                ‹ Prev
              </button>
              <span className="concordance-panel__pager-status">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                className="concordance-panel__pager-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1}
                aria-label="Next page"
              >
                Next ›
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
