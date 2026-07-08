import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useReader } from '@/context/ReaderContext';
import { useSearch } from '@/context/SearchContext';
import type { BibleSearchResult } from '@/types/bible';
import { formatReference } from '@/types/bible';
import { SCRIPTURE_FLASH_EVENT } from '@/types/scriptureInteraction';
import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';
import './SearchResultsPanel.css';

const RESULTS_PER_PAGE = 50;

interface SearchResultsPanelProps {
  onClose: () => void;
  style?: CSSProperties;
}

export function SearchResultsPanel({ onClose, style }: SearchResultsPanelProps) {
  const { response } = useSearch();
  const { goToConcordanceResult } = useReader();
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allSearchResults = response?.results ?? [];
  const totalCount = response?.totalCount ?? allSearchResults.length;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allSearchResults.length / RESULTS_PER_PAGE)),
    [allSearchResults.length],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [response?.query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (!response) return null;

  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const pagedResults = allSearchResults.slice(startIndex, endIndex);

  const showingStart = totalCount === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, totalCount);

  const handleResultClick = (result: BibleSearchResult) => {
    goToConcordanceResult(result.reference, response.query);
    onClose();

    window.dispatchEvent(
      new CustomEvent(SCRIPTURE_FLASH_EVENT, {
        detail: { verse: result.reference.verse },
      }),
    );

    requestAnimationFrame(() => {
      document
        .querySelector('.mobile-stable__bible, .scripture-reader__text')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById(`scripture-verse-${result.reference.verse}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <div
      className="search-results"
      role="dialog"
      aria-label="Bible search results"
      style={style}
    >
      <div className="search-results__header">
        <span className="search-results__title">
          Results for &ldquo;{response.query}&rdquo;
        </span>
        <button
          type="button"
          className="search-results__close"
          onClick={onClose}
          aria-label="Close search results"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="search-results__status" aria-live="polite">
        <p className="search-results__count">
          {totalCount === 0
            ? 'No passages found'
            : `Showing ${showingStart}–${showingEnd} of ${totalCount} result${totalCount !== 1 ? 's' : ''}`}
        </p>
        {totalCount > 0 ? (
          <p className="search-results__page-label">
            Page {currentPage} of {totalPages}
          </p>
        ) : null}
      </div>

      {totalCount > 0 ? (
        <>
          <div ref={scrollRef} className="search-results__scroll">
            <ul className="search-results__list">
              {pagedResults.map((result) => (
                <li key={formatReference(result.reference)}>
                  <button
                    type="button"
                    className="search-results__item"
                    onClick={() => handleResultClick(result)}
                  >
                    <span className="search-results__ref">
                      {formatReference(result.reference)}
                    </span>
                    <p className="search-results__text">
                      {stripKjvEditorialMarkup(result.text)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <footer className="search-results__pagination">
            <p className="search-results__pagination-status">
              Page {currentPage} of {totalPages}
            </p>
            <div className="search-results__pagination-nav">
              <button
                type="button"
                className="search-results__page-btn"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                className="search-results__page-btn"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <label className="search-results__page-select">
              <span className="search-results__page-select-label">Go to page</span>
              <select
                className="search-results__page-dropdown"
                value={currentPage}
                onChange={(event) => setCurrentPage(Number(event.target.value))}
                aria-label="Select results page"
              >
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <option key={page} value={page}>
                      {page} of {totalPages}
                    </option>
                  );
                })}
              </select>
            </label>
          </footer>
        </>
      ) : null}
    </div>
  );
}
