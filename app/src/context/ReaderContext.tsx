import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getDefaultLocation,
  getChaptersForBook,
  getNextChapter,
  getPreviousChapter,
  normalizeLocation,
} from '@/services/bibleService';
import type { ReaderLocation, ConcordanceHighlight, ScriptureReference } from '@/types/bible';

interface ReaderContextValue {
  location: ReaderLocation;
  concordanceHighlight: ConcordanceHighlight | null;
  setBook: (book: string) => void;
  setChapter: (chapter: number) => void;
  setVerse: (verse: number | null) => void;
  goToPassage: (location: ReaderLocation) => void;
  goToConcordanceResult: (reference: ScriptureReference, query: string) => void;
  clearConcordanceHighlight: () => void;
  goToPreviousChapter: () => void;
  goToNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const ReaderContext = createContext<ReaderContextValue | null>(null);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<ReaderLocation>(getDefaultLocation);
  const [concordanceHighlight, setConcordanceHighlight] =
    useState<ConcordanceHighlight | null>(null);

  const updateLocation = useCallback((next: ReaderLocation) => {
    setLocation(normalizeLocation(next));
  }, []);

  const setBook = useCallback(
    (book: string) => {
      const chapters = getChaptersForBook(book);
      const chapter = chapters[0] ?? 1;
      setConcordanceHighlight(null);
      updateLocation({ book, chapter, verse: null });
    },
    [updateLocation],
  );

  const setChapter = useCallback(
    (chapter: number) => {
      setConcordanceHighlight(null);
      setLocation((current) =>
        normalizeLocation({ ...current, chapter, verse: null }),
      );
    },
    [],
  );

  const setVerse = useCallback((verse: number | null) => {
    setLocation((current) => normalizeLocation({ ...current, verse }));
  }, []);

  const goToPassage = useCallback(
    (target: ReaderLocation) => {
      updateLocation(target);
    },
    [updateLocation],
  );

  const goToConcordanceResult = useCallback(
    (reference: ScriptureReference, query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        goToPassage(reference);
        return;
      }

      setConcordanceHighlight({
        query: trimmed,
        book: reference.book,
        chapter: reference.chapter,
        verse: reference.verse,
      });
      updateLocation(reference);
    },
    [goToPassage, updateLocation],
  );

  const clearConcordanceHighlight = useCallback(() => {
    setConcordanceHighlight(null);
  }, []);

  const goToPreviousChapter = useCallback(() => {
    const prev = getPreviousChapter(location.book, location.chapter);
    if (!prev) return;
    setConcordanceHighlight(null);
    updateLocation({ ...prev, verse: null });
  }, [location, updateLocation]);

  const goToNextChapter = useCallback(() => {
    const next = getNextChapter(location.book, location.chapter);
    if (!next) return;
    setConcordanceHighlight(null);
    updateLocation({ ...next, verse: null });
  }, [location, updateLocation]);

  const value = useMemo(
    () => ({
      location,
      concordanceHighlight,
      setBook,
      setChapter,
      setVerse,
      goToPassage,
      goToConcordanceResult,
      clearConcordanceHighlight,
      goToPreviousChapter,
      goToNextChapter,
      canGoPrevious: getPreviousChapter(location.book, location.chapter) !== null,
      canGoNext: getNextChapter(location.book, location.chapter) !== null,
    }),
    [
      location,
      concordanceHighlight,
      setBook,
      setChapter,
      setVerse,
      goToPassage,
      goToConcordanceResult,
      clearConcordanceHighlight,
      goToPreviousChapter,
      goToNextChapter,
    ],
  );

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used within ReaderProvider');
  return ctx;
}
