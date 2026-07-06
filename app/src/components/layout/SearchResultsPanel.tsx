import { X } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { formatReference } from '@/types/bible';
import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';
import './SearchResultsPanel.css';

interface SearchResultsPanelProps {
  onClose: () => void;
}

export function SearchResultsPanel({ onClose }: SearchResultsPanelProps) {
  const { response } = useSearch();

  if (!response) return null;

  return (
    <div className="search-results" role="dialog" aria-label="Bible search results">
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

      <p className="search-results__count">
        {response.totalCount} passage{response.totalCount !== 1 ? 's' : ''} found
        {response.totalCount > response.results.length && (
          <span className="search-results__truncated">
            {' '}
            (showing first {response.results.length})
          </span>
        )}
      </p>

      <ul className="search-results__list">
        {response.results.map((result) => (
          <li key={formatReference(result.reference)} className="search-results__item">
            <span className="search-results__ref">
              {formatReference(result.reference)}
            </span>
            <p className="search-results__text">
              {stripKjvEditorialMarkup(result.text)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
