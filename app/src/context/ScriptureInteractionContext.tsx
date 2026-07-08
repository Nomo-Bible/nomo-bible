import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/auth/useAuth';
import { useReader } from '@/context/ReaderContext';
import { getChapter } from '@/services/bibleService';
import {
  deleteHighlights,
  loadHighlightsForChapter,
  upsertHighlight,
} from '@/services/bibleHighlightsService';
import {
  copyTextToClipboard,
  formatVersesForClipboard,
} from '@/services/scriptureSelectionService';
import {
  DEFAULT_HIGHLIGHT_COLOR,
  SCRIPTURE_FLASH_EVENT,
  SCRIPTURE_INSERT_EVENT,
  SCRIPTURE_STUDY_TAB_EVENT,
  type HighlightColor,
  verseKey,
} from '@/types/scriptureInteraction';

interface ScriptureInteractionContextValue {
  selectedVerseKeys: Set<string>;
  highlightMap: Map<string, HighlightColor>;
  highlightColor: HighlightColor;
  setHighlightColor: (color: HighlightColor) => void;
  flashingVerse: number | null;
  selectionCount: number;
  hasSelection: boolean;
  isVerseSelected: (verse: number) => boolean;
  getVerseHighlightColor: (verse: number) => HighlightColor | null;
  toggleVerseSelection: (verse: number, shiftKey?: boolean) => void;
  clearSelection: () => void;
  copySelectedVerses: () => Promise<boolean>;
  addSelectedToStudyNote: () => void;
  highlightSelectedVerses: (color?: HighlightColor) => Promise<void>;
  removeHighlightFromSelected: () => Promise<void>;
  flashVerse: (verse: number) => void;
  openCrossReferencesTab: () => void;
  shareSelectedVerses: () => Promise<boolean>;
}

const ScriptureInteractionContext =
  createContext<ScriptureInteractionContextValue | null>(null);

export function ScriptureInteractionProvider({ children }: { children: ReactNode }) {
  const { location } = useReader();
  const { user, isAuthenticated, openAuthPrompt } = useAuth();
  const [selectedVerseKeys, setSelectedVerseKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [highlightMap, setHighlightMap] = useState<Map<string, HighlightColor>>(
    () => new Map(),
  );
  const [highlightColor, setHighlightColor] =
    useState<HighlightColor>(DEFAULT_HIGHLIGHT_COLOR);
  const [flashingVerse, setFlashingVerse] = useState<number | null>(null);
  const selectionAnchorRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const makeKey = useCallback(
    (verse: number) =>
      verseKey({ book: location.book, chapter: location.chapter, verse }),
    [location.book, location.chapter],
  );

  const getVerseText = useCallback(
    (verse: number) => {
      const chapter = getChapter(location.book, location.chapter);
      return chapter?.verses.find((v) => v.number === verse)?.text;
    },
    [location.book, location.chapter],
  );

  const getSelectedVerseNumbers = useCallback(() => {
    return [...selectedVerseKeys]
      .map((key) => Number(key.split('|')[2]))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  }, [selectedVerseKeys]);

  const formatSelectedText = useCallback(() => {
    return formatVersesForClipboard(
      location.book,
      location.chapter,
      getSelectedVerseNumbers(),
      getVerseText,
    );
  }, [getSelectedVerseNumbers, getVerseText, location.book, location.chapter]);

  useEffect(() => {
    setSelectedVerseKeys(new Set());
    selectionAnchorRef.current = null;
  }, [location.book, location.chapter]);

  useEffect(() => {
    if (!user?.id || !isAuthenticated) {
      setHighlightMap(new Map());
      return;
    }

    let cancelled = false;
    loadHighlightsForChapter(user.id, location.book, location.chapter).then(
      (loaded) => {
        if (!cancelled) setHighlightMap(loaded);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [user?.id, isAuthenticated, location.book, location.chapter]);

  const flashVerse = useCallback((verse: number) => {
    setFlashingVerse(verse);
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = setTimeout(() => {
      setFlashingVerse(null);
      flashTimeoutRef.current = null;
    }, 2500);

    requestAnimationFrame(() => {
      document
        .getElementById(`scripture-verse-${verse}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  useEffect(() => {
    const handleFlash = (event: Event) => {
      const detail = (event as CustomEvent<{ verse: number }>).detail;
      if (detail?.verse) flashVerse(detail.verse);
    };
    window.addEventListener(SCRIPTURE_FLASH_EVENT, handleFlash);
    return () => window.removeEventListener(SCRIPTURE_FLASH_EVENT, handleFlash);
  }, [flashVerse]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const toggleVerseSelection = useCallback(
    (verse: number, shiftKey = false) => {
      const chapter = getChapter(location.book, location.chapter);
      if (!chapter) return;

      const verseNumbers = chapter.verses.map((v) => v.number);

      setSelectedVerseKeys((current) => {
        const next = new Set(current);

        if (shiftKey && selectionAnchorRef.current !== null) {
          const anchor = selectionAnchorRef.current;
          const start = Math.min(anchor, verse);
          const end = Math.max(anchor, verse);
          for (const n of verseNumbers) {
            if (n >= start && n <= end) {
              next.add(makeKey(n));
            }
          }
          return next;
        }

        const key = makeKey(verse);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        selectionAnchorRef.current = verse;
        return next;
      });
    },
    [location.book, location.chapter, makeKey],
  );

  const clearSelection = useCallback(() => {
    setSelectedVerseKeys(new Set());
    selectionAnchorRef.current = null;
  }, []);

  const copySelectedVerses = useCallback(async () => {
    if (selectedVerseKeys.size === 0) return false;
    return copyTextToClipboard(formatSelectedText());
  }, [formatSelectedText, selectedVerseKeys.size]);

  const addSelectedToStudyNote = useCallback(() => {
    if (selectedVerseKeys.size === 0) return;
    const text = formatSelectedText();
    window.dispatchEvent(
      new CustomEvent(SCRIPTURE_INSERT_EVENT, { detail: { text } }),
    );
  }, [formatSelectedText, selectedVerseKeys.size]);

  const highlightSelectedVerses = useCallback(
    async (color: HighlightColor = highlightColor) => {
      if (selectedVerseKeys.size === 0) return;
      if (!isAuthenticated || !user?.id) {
        openAuthPrompt();
        return;
      }

      const refs = getSelectedVerseNumbers().map((verse) => ({
        book: location.book,
        chapter: location.chapter,
        verse,
      }));

      const results = await Promise.all(
        refs.map((ref) => upsertHighlight(user.id, ref, color)),
      );

      setHighlightMap((current) => {
        const next = new Map(current);
        for (const ref of refs) {
          next.set(verseKey(ref), color);
        }
        return next;
      });

      void results;
    },
    [
      getSelectedVerseNumbers,
      highlightColor,
      isAuthenticated,
      location.book,
      location.chapter,
      openAuthPrompt,
      selectedVerseKeys.size,
      user?.id,
    ],
  );

  const removeHighlightFromSelected = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      openAuthPrompt();
      return;
    }

    const refs = getSelectedVerseNumbers()
      .filter((verse) => highlightMap.has(makeKey(verse)))
      .map((verse) => ({
        book: location.book,
        chapter: location.chapter,
        verse,
      }));

    if (refs.length === 0) return;
    await deleteHighlights(user.id, refs);

    setHighlightMap((current) => {
      const next = new Map(current);
      for (const ref of refs) {
        next.delete(verseKey(ref));
      }
      return next;
    });
  }, [
    getSelectedVerseNumbers,
    highlightMap,
    isAuthenticated,
    location.book,
    location.chapter,
    makeKey,
    openAuthPrompt,
    user?.id,
  ]);

  const openCrossReferencesTab = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(SCRIPTURE_STUDY_TAB_EVENT, {
        detail: { tab: 'cross-references' },
      }),
    );
  }, []);

  const shareSelectedVerses = useCallback(async () => {
    if (selectedVerseKeys.size === 0) return false;
    const text = formatSelectedText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return true;
      } catch {
        return false;
      }
    }
    return copyTextToClipboard(text);
  }, [formatSelectedText, selectedVerseKeys.size]);

  const isVerseSelected = useCallback(
    (verse: number) => selectedVerseKeys.has(makeKey(verse)),
    [makeKey, selectedVerseKeys],
  );

  const getVerseHighlightColor = useCallback(
    (verse: number) => highlightMap.get(makeKey(verse)) ?? null,
    [highlightMap, makeKey],
  );

  const value = useMemo(
    () => ({
      selectedVerseKeys,
      highlightMap,
      highlightColor,
      setHighlightColor,
      flashingVerse,
      selectionCount: selectedVerseKeys.size,
      hasSelection: selectedVerseKeys.size > 0,
      isVerseSelected,
      getVerseHighlightColor,
      toggleVerseSelection,
      clearSelection,
      copySelectedVerses,
      addSelectedToStudyNote,
      highlightSelectedVerses,
      removeHighlightFromSelected,
      flashVerse,
      openCrossReferencesTab,
      shareSelectedVerses,
    }),
    [
      selectedVerseKeys,
      highlightMap,
      highlightColor,
      flashingVerse,
      isVerseSelected,
      getVerseHighlightColor,
      toggleVerseSelection,
      clearSelection,
      copySelectedVerses,
      addSelectedToStudyNote,
      highlightSelectedVerses,
      removeHighlightFromSelected,
      flashVerse,
      openCrossReferencesTab,
      shareSelectedVerses,
    ],
  );

  return (
    <ScriptureInteractionContext.Provider value={value}>
      {children}
    </ScriptureInteractionContext.Provider>
  );
}

export function useScriptureInteraction() {
  const ctx = useContext(ScriptureInteractionContext);
  if (!ctx) {
    throw new Error(
      'useScriptureInteraction must be used within ScriptureInteractionProvider',
    );
  }
  return ctx;
}
