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
        <input
          id="bible-search-input"
          type="search"
          className="bible-search__input"
          placeholder="Search KJV…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the King James Bible"
        />
        <button
          type="submit"
          className="bible-search__button"
          disabled={isLoading}
          aria-label="Submit search"
        >
          {isLoading ? '…' : 'Search'}
        </button>
      </form>

      {isOpen && <SearchResultsPanel onClose={closeResults} />}
    </div>
  );
}
