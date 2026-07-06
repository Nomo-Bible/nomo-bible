import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { passageKeyFromLocation } from '@/services/passageKeyService';
import { insertWordStudyIntoStudyNotes } from '@/services/strongsNoteService';
import { resolveWordStudyFromToken } from '@/services/wordStudyService';
import type { StrongsEntry } from '@/types/strongs';
import type { VerseWordToken } from '@/types/verseTokens';
import type {
  SyncedWordStudy,
  WordStudyAnchor,
  WordStudySelection,
} from '@/types/wordStudy';
import type { ScriptureReference } from '@/types/bible';

interface WordStudyContextValue {
  selection: WordStudySelection | null;
  anchor: WordStudyAnchor | null;
  entry: StrongsEntry | null;
  activeTokenId: string | null;
  syncedWordStudy: SyncedWordStudy | null;
  openWordStudy: (
    token: VerseWordToken,
    tokenIndex: number,
    reference: ScriptureReference,
    referenceLabel: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  closeWordStudy: () => void;
  searchWordInConcordance: (word: string) => void;
  searchPossibleMatches: () => void;
  insertWordStudyNote: (entry: StrongsEntry | null) => void;
}

const WordStudyContext = createContext<WordStudyContextValue | null>(null);

export function WordStudyProvider({ children }: { children: ReactNode }) {
  const [, setSearchParams] = useSearchParams();
  const [selection, setSelection] = useState<WordStudySelection | null>(null);
  const [anchor, setAnchor] = useState<WordStudyAnchor | null>(null);
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [syncedWordStudy, setSyncedWordStudy] = useState<SyncedWordStudy | null>(null);

  const closeWordStudy = useCallback(() => {
    setAnchor(null);
  }, []);

  const openWordStudy = useCallback(
    (
      token: VerseWordToken,
      tokenIndex: number,
      reference: ScriptureReference,
      referenceLabel: string,
      event: MouseEvent<HTMLButtonElement>,
    ) => {
      const resolved = resolveWordStudyFromToken(
        token,
        tokenIndex,
        reference,
        referenceLabel,
      );
      const tokenId = `${reference.book}:${reference.chapter}:${reference.verse}:${tokenIndex}`;

      const nextSelection: WordStudySelection = {
        word: resolved.displayedText,
        normalizedText: resolved.normalizedText,
        reference,
        referenceLabel,
        tokenIndex,
        tokenId,
        strongsNumber: resolved.strongsNumber,
        normalizedStrongsNumber: resolved.normalizedStrongsNumber,
        status: resolved.status,
      };

      setSelection(nextSelection);
      setEntry(resolved.entry);
      setActiveTokenId(tokenId);
      setSyncedWordStudy({
        selection: nextSelection,
        entry: resolved.entry,
      });

      const rect = event.currentTarget.getBoundingClientRect();
      setAnchor({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    },
    [],
  );

  const searchWordInConcordance = useCallback(
    (word: string) => {
      const trimmed = word.trim();
      if (!trimmed) return;
      setSearchParams({
        tab: 'concordance',
        search: trimmed,
        run: Date.now().toString(),
      });
      closeWordStudy();
    },
    [closeWordStudy, setSearchParams],
  );

  const searchPossibleMatches = useCallback(() => {
    if (!selection) return;
    setSearchParams({
      tab: 'concordance',
      strongs: selection.normalizedText,
      run: Date.now().toString(),
    });
    closeWordStudy();
  }, [closeWordStudy, selection, setSearchParams]);

  const insertWordStudyNote = useCallback(
    (noteEntry: StrongsEntry | null) => {
      if (!selection) return;
      const note = insertWordStudyIntoStudyNotes(
        passageKeyFromLocation({
          book: selection.reference.book,
          chapter: selection.reference.chapter,
          verse: selection.reference.verse,
        }),
        selection.word,
        selection.referenceLabel,
        noteEntry ?? entry,
      );
      setSearchParams({ tab: 'study-notes', note: note.id });
      closeWordStudy();
    },
    [closeWordStudy, entry, selection, setSearchParams],
  );

  const value = useMemo(
    () => ({
      selection,
      anchor,
      entry,
      activeTokenId,
      syncedWordStudy,
      openWordStudy,
      closeWordStudy,
      searchWordInConcordance,
      searchPossibleMatches,
      insertWordStudyNote,
    }),
    [
      selection,
      anchor,
      entry,
      activeTokenId,
      syncedWordStudy,
      openWordStudy,
      closeWordStudy,
      searchWordInConcordance,
      searchPossibleMatches,
      insertWordStudyNote,
    ],
  );

  return (
    <WordStudyContext.Provider value={value}>{children}</WordStudyContext.Provider>
  );
}

export function useWordStudy(): WordStudyContextValue {
  const context = useContext(WordStudyContext);
  if (!context) {
    throw new Error('useWordStudy must be used within WordStudyProvider');
  }
  return context;
}
