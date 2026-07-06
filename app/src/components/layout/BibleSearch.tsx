import { Search, Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSearch } from '@/context/SearchContext';
import { searchBible } from '@/services/searchService';
import { SearchResultsPanel } from './SearchResultsPanel';
import './BibleSearch.css';

export function BibleSearch() {
  const [query, setQuery] = useState('');
  const { isOpen, isLoading, openResults, closeResults, setLoading } = useSearch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    const results = await searchBible(trimmed);
    openResults(results);
  };

  return (
    <div className="bible-search">
      <form className="bible-search__form" onSubmit={handleSubmit} role="search">
        <label htmlFor="bible-search-input" className="visually-hidden">
          Search the Bible
        </label>
        <div className="bible-search__field">
          <Search className="bible-search__field-icon" aria-hidden="true" size={16} strokeWidth={2} />
          <input
            id="bible-search-input"
            type="search"
            className="bible-search__input"
            placeholder="Search KJV…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the King James Bible"
          />
        </div>
        <button
          type="submit"
          className="bible-search__button nm-btn nm-btn--primary nm-btn--pill"
          disabled={isLoading}
          aria-label="Submit search"
        >
          {isLoading ? (
            <Loader2 className="bible-search__spinner" aria-hidden="true" size={16} strokeWidth={2} />
          ) : (
            'Search'
          )}
        </button>
      </form>

      {isOpen && <SearchResultsPanel onClose={closeResults} />}
    </div>
  );
}
