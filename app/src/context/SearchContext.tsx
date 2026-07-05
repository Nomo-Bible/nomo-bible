import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BibleSearchResponse } from '@/types/bible';

interface SearchContextValue {
  isOpen: boolean;
  isLoading: boolean;
  response: BibleSearchResponse | null;
  openResults: (response: BibleSearchResponse) => void;
  closeResults: () => void;
  setLoading: (loading: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BibleSearchResponse | null>(null);

  const openResults = (data: BibleSearchResponse) => {
    setResponse(data);
    setIsOpen(true);
    setIsLoading(false);
  };

  const closeResults = () => {
    setIsOpen(false);
    setResponse(null);
  };

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        isLoading,
        response,
        openResults,
        closeResults,
        setLoading: setIsLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
