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
import type { ReaderLocation } from '@/types/bible';

interface ReaderContextValue {
  location: ReaderLocation;
  setBook: (book: string) => void;
  setChapter: (chapter: number) => void;
  setVerse: (verse: number | null) => void;
  goToPassage: (location: ReaderLocation) => void;
  goToPreviousChapter: () => void;
  goToNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const ReaderContext = createContext<ReaderContextValue | null>(null);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<ReaderLocation>(getDefaultLocation);

  const updateLocation = useCallback((next: ReaderLocation) => {
    setLocation(normalizeLocation(next));
  }, []);

  const setBook = useCallback(
    (book: string) => {
      const chapters = getChaptersForBook(book);
      const chapter = chapters[0] ?? 1;
      updateLocation({ book, chapter, verse: null });
    },
    [updateLocation],
  );

  const setChapter = useCallback(
    (chapter: number) => {
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

  const goToPreviousChapter = useCallback(() => {
    const prev = getPreviousChapter(location.book, location.chapter);
    if (!prev) return;
    updateLocation({ ...prev, verse: null });
  }, [location, updateLocation]);

  const goToNextChapter = useCallback(() => {
    const next = getNextChapter(location.book, location.chapter);
    if (!next) return;
    updateLocation({ ...next, verse: null });
  }, [location, updateLocation]);

  const value = useMemo(
    () => ({
      location,
      setBook,
      setChapter,
      setVerse,
      goToPassage,
      goToPreviousChapter,
      goToNextChapter,
      canGoPrevious: getPreviousChapter(location.book, location.chapter) !== null,
      canGoNext: getNextChapter(location.book, location.chapter) !== null,
    }),
    [
      location,
      setBook,
      setChapter,
      setVerse,
      goToPassage,
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
