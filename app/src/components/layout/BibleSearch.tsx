import { Search, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useSearch } from '@/context/SearchContext';
import { searchBible } from '@/services/searchService';
import { SearchResultsPanel } from './SearchResultsPanel';
import './BibleSearch.css';

const VIEWPORT_PADDING = 16;
const PANEL_GAP = 4;
const MIN_PANEL_HEIGHT = 240;

interface BibleSearchProps {
  /** Compact sizing for placement inside the Scripture reader header. */
  variant?: 'default' | 'embedded';
}

export function BibleSearch({ variant = 'default' }: BibleSearchProps) {
  const [query, setQuery] = useState('');
  const { isOpen, isLoading, openResults, closeResults, setLoading } = useSearch();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const updatePanelPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= 768;
    const panelWidth = isMobile
      ? viewportWidth - VIEWPORT_PADDING * 2
      : Math.min(24 * 16, viewportWidth - VIEWPORT_PADDING * 2);

    let left = isMobile
      ? VIEWPORT_PADDING
      : rect.right - panelWidth;
    if (!isMobile) {
      left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - panelWidth - VIEWPORT_PADDING));
    }

    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const openAbove = spaceBelow < MIN_PANEL_HEIGHT && spaceAbove > spaceBelow;

    const maxHeight = Math.max(
      MIN_PANEL_HEIGHT,
      openAbove ? spaceAbove - PANEL_GAP : spaceBelow - PANEL_GAP,
    );

    if (openAbove) {
      setPanelStyle({
        position: 'fixed',
        left: `${left}px`,
        width: `${panelWidth}px`,
        bottom: `${viewportHeight - rect.top + PANEL_GAP}px`,
        top: 'auto',
        maxHeight: `${maxHeight}px`,
      });
      return;
    }

    setPanelStyle({
      position: 'fixed',
      left: `${left}px`,
      width: `${panelWidth}px`,
      top: `${rect.bottom + PANEL_GAP}px`,
      bottom: 'auto',
      maxHeight: `${maxHeight}px`,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();

    const handleLayoutChange = () => updatePanelPosition();
    window.addEventListener('resize', handleLayoutChange);
    window.addEventListener('scroll', handleLayoutChange, true);

    return () => {
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('scroll', handleLayoutChange, true);
    };
  }, [isOpen, updatePanelPosition]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    const results = await searchBible(trimmed);
    openResults(results);
  };

  return (
    <div
      ref={anchorRef}
      className={
        variant === 'embedded' ? 'bible-search bible-search--embedded' : 'bible-search'
      }
    >
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

      {isOpen &&
        createPortal(
          <SearchResultsPanel onClose={closeResults} style={panelStyle} />,
          document.body,
        )}
    </div>
  );
}
