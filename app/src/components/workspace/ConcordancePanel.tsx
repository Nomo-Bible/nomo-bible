import { BookOpen, Library, Search, StickyNote } from 'lucide-react';
import {
  searchConcordance,
  splitTextHighlight,
} from '@/services/concordanceService';
import { passageKeyFromLocation } from '@/services/passageKeyService';
import { insertStrongsIntoStudyNotes } from '@/services/strongsNoteService';
import {
  isStrongsDataInstalled,
  looksLikeStrongsQuery,
  searchStrongs,
} from '@/services/strongsService';
import { useReader } from '@/context/ReaderContext';
import { useWordStudy } from '@/context/WordStudyContext';
import { wordStudyStatusMessage } from '@/services/wordStudyService';
import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';
import type { StrongsEntry, StrongsSearchResponse } from '@/types/strongs';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import './ConcordancePanel.css';

function StrongsResultCard({
  entry,
  onInsert,
}: {
  entry: StrongsEntry;
  onInsert: (entry: StrongsEntry) => void;
}) {
  return (
    <article className="concordance-panel__strongs-card">
      <header className="concordance-panel__strongs-header">
        <span className="concordance-panel__strongs-number">{entry.strongsNumber}</span>
        <span className="concordance-panel__strongs-lang">{entry.language}</span>
      </header>
      {entry.originalWord && (
        <p className="concordance-panel__strongs-original">{entry.originalWord}</p>
      )}
      {entry.transliteration && (
        <p className="concordance-panel__strongs-translit">{entry.transliteration}</p>
      )}
      {entry.pronunciation && entry.pronunciation !== entry.transliteration && (
        <p className="concordance-panel__strongs-pron">
          Pronunciation: {entry.pronunciation}
        </p>
      )}
      <p className="concordance-panel__strongs-def">{entry.definition}</p>
      {entry.kjvUsage && (
        <p className="concordance-panel__strongs-kjv">
          <span className="concordance-panel__strongs-label">KJV usage:</span>{' '}
          {entry.kjvUsage}
        </p>
      )}
      {entry.rootWord && (
        <p className="concordance-panel__strongs-root">
          <span className="concordance-panel__strongs-label">Root:</span> {entry.rootWord}
        </p>
      )}
      <button
        type="button"
        className="concordance-panel__strongs-insert"
        onClick={() => onInsert(entry)}
      >
        <StickyNote size={14} strokeWidth={2} aria-hidden="true" />
        Insert into Study Notes
      </button>
    </article>
  );
}

export function ConcordancePanel() {
  const { goToConcordanceResult, location } = useReader();
  const { syncedWordStudy } = useWordStudy();
  const [searchParams, setSearchParams] = useSearchParams();
  const strongsResultsRef = useRef<HTMLDivElement>(null);
  const kjvResultsRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<ReturnType<typeof searchConcordance> | null>(
    null,
  );
  const [searched, setSearched] = useState(false);

  const [strongsQuery, setStrongsQuery] = useState('');
  const [strongsResponse, setStrongsResponse] = useState<StrongsSearchResponse | null>(
    null,
  );
  const [strongsSearched, setStrongsSearched] = useState(false);

  const scrollWithinWorkspace = (target: HTMLElement | null) => {
    requestAnimationFrame(() => {
      const content = document.querySelector('.study-workspace__content');
      if (!(content instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return;
      }
      const contentRect = content.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offset = targetRect.top - contentRect.top + content.scrollTop;
      content.scrollTo({ top: Math.max(0, offset - 8), behavior: 'smooth' });
    });
  };

  const scrollToStrongsResults = () => {
    scrollWithinWorkspace(strongsResultsRef.current);
  };

  const scrollToKjvResults = () => {
    scrollWithinWorkspace(kjvResultsRef.current);
  };

  const runStrongsSearch = (raw?: string) => {
    const trimmed = (raw ?? strongsQuery).trim();
    if (!trimmed || !isStrongsDataInstalled()) return;
    if (raw !== undefined) {
      setStrongsQuery(raw);
    }
    setStrongsResponse(searchStrongs(trimmed));
    setStrongsSearched(true);
    scrollToStrongsResults();
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (isStrongsDataInstalled() && looksLikeStrongsQuery(trimmed)) {
      runStrongsSearch(trimmed);
      return;
    }

    setResponse(searchConcordance(trimmed));
    setSearched(true);
    scrollToKjvResults();
  };

  const submitStrongsSearch = () => {
    runStrongsSearch();
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    const search = searchParams.get('search')?.trim();
    if (tab !== 'concordance' || !search) return;

    if (isStrongsDataInstalled() && looksLikeStrongsQuery(search)) {
      runStrongsSearch(search);
      return;
    }

    setQuery(search);
    setResponse(searchConcordance(search));
    setSearched(true);
    scrollToKjvResults();
  }, [searchParams]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const strongs = searchParams.get('strongs')?.trim();
    if (tab !== 'concordance' || !strongs) return;

    runStrongsSearch(strongs);
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  const handleStrongsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitStrongsSearch();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  const handleStrongsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitStrongsSearch();
    }
  };

  const handleInsertStrongs = (entry: StrongsEntry) => {
    const note = insertStrongsIntoStudyNotes(
      passageKeyFromLocation(location),
      entry,
    );
    setSearchParams({ tab: 'study-notes', note: note.id });
  };

  const results = response?.results ?? [];

  const strongsInstalled = isStrongsDataInstalled();

  useEffect(() => {
    if (!syncedWordStudy) return;
    if (syncedWordStudy.selection.normalizedStrongsNumber) {
      setStrongsQuery(syncedWordStudy.selection.normalizedStrongsNumber);
    }
    scrollToStrongsResults();
  }, [syncedWordStudy]);

  return (
    <div className="concordance-panel">
      <div className="concordance-panel__notice">
        <strong>Concordance</strong>
        <p>
          Look up Strong&apos;s Hebrew and Greek dictionary entries, or search the local
          King James Version by word or phrase.
        </p>
      </div>

      <section
        ref={strongsResultsRef}
        className="concordance-panel__strongs concordance-panel__strongs--primary"
        aria-labelledby="strongs-heading"
      >
        <div className="concordance-panel__strongs-intro">
          <h3 id="strongs-heading" className="concordance-panel__strongs-title">
            <BookOpen size={16} strokeWidth={2} aria-hidden="true" />
            Strong&apos;s Concordance
          </h3>
          <p className="concordance-panel__strongs-desc">
            {strongsInstalled
              ? 'Look up a Strong\'s number (H7225, G3056) or search English words in Strong\'s definitions and KJV usage notes.'
              : "Strong's data has not yet been installed. Run node app/scripts/build-strongs-json.mjs to generate the dictionary files."}
          </p>
        </div>

        {syncedWordStudy && (
          <div className="concordance-panel__synced">
            <p className="concordance-panel__synced-label">Selected Bible word</p>
            <p className="concordance-panel__synced-word">
              {syncedWordStudy.selection.word}{' '}
              <span className="concordance-panel__synced-ref">
                ({syncedWordStudy.selection.referenceLabel})
              </span>
            </p>

            {syncedWordStudy.selection.status !== 'found' && (
              <p className="concordance-panel__strongs-empty">
                {wordStudyStatusMessage({
                  token: {
                    text: syncedWordStudy.selection.word,
                    strongs: syncedWordStudy.selection.strongsNumber,
                  },
                  tokenIndex: syncedWordStudy.selection.tokenIndex,
                  reference: syncedWordStudy.selection.reference,
                  referenceLabel: syncedWordStudy.selection.referenceLabel,
                  displayedText: syncedWordStudy.selection.word,
                  normalizedText: syncedWordStudy.selection.normalizedText,
                  strongsNumber: syncedWordStudy.selection.strongsNumber,
                  normalizedStrongsNumber: syncedWordStudy.selection.normalizedStrongsNumber,
                  entry: syncedWordStudy.entry,
                  status: syncedWordStudy.selection.status,
                })}
              </p>
            )}

            {syncedWordStudy.entry && (
              <div className="concordance-panel__strongs-list">
                <StrongsResultCard
                  entry={syncedWordStudy.entry}
                  onInsert={handleInsertStrongs}
                />
              </div>
            )}
          </div>
        )}

        <form className="concordance-panel__form" onSubmit={handleStrongsSubmit}>
          <label htmlFor="strongs-search" className="concordance-panel__label">
            Strong&apos;s lookup
          </label>
          <div className="concordance-panel__row">
            <input
              id="strongs-search"
              type="text"
              className="concordance-panel__input"
              value={strongsQuery}
              onChange={(e) => {
                const next = e.target.value;
                setStrongsQuery(next);
                if (!next.trim()) {
                  setStrongsSearched(false);
                  setStrongsResponse(null);
                }
              }}
              onKeyDown={handleStrongsKeyDown}
              placeholder="e.g. H7225, G3056, beginning"
              autoComplete="off"
              enterKeyHint="search"
              disabled={!strongsInstalled}
            />
            <button
              type="submit"
              className="concordance-panel__btn"
              disabled={!strongsInstalled}
            >
              Lookup
            </button>
          </div>
        </form>

        {strongsSearched && strongsResponse && strongsResponse.totalCount === 0 && (
          <div className="concordance-panel__body">
            <p className="concordance-panel__strongs-empty">
              No Strong&apos;s entry found for &ldquo;{strongsResponse.query}&rdquo;.
            </p>
          </div>
        )}

        {strongsSearched && strongsResponse && strongsResponse.totalCount > 0 && (
          <div className="concordance-panel__strongs-results">
            <p className="concordance-panel__count">
              {strongsResponse.totalCount} Strong&apos;s entr
              {strongsResponse.totalCount !== 1 ? 'ies' : 'y'} found
              {strongsResponse.mode === 'word' && strongsResponse.totalCount >= 50
                ? ' (showing first 50)'
                : ''}
            </p>
            <div className="concordance-panel__strongs-list">
              {strongsResponse.results.map((entry) => (
                <StrongsResultCard
                  key={entry.strongsNumber}
                  entry={entry}
                  onInsert={handleInsertStrongs}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        ref={kjvResultsRef}
        className="concordance-panel__kjv"
        aria-labelledby="kjv-heading"
      >
        <div className="concordance-panel__kjv-intro">
          <h3 id="kjv-heading" className="concordance-panel__kjv-title">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            KJV Word Search
          </h3>
          <p className="concordance-panel__kjv-desc">
            Find every verse in the local King James Bible that contains a word or phrase.
          </p>
        </div>

        <form className="concordance-panel__form" onSubmit={handleSubmit}>
          <label htmlFor="concordance-search" className="concordance-panel__label">
            Search KJV word or phrase
          </label>
          <div className="concordance-panel__row">
            <input
              id="concordance-search"
              type="text"
              className="concordance-panel__input"
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                if (!next.trim()) {
                  setSearched(false);
                  setResponse(null);
                }
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="e.g. beginning, faith, light"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" className="concordance-panel__btn">
              Search
            </button>
          </div>
        </form>

        {!searched && !strongsSearched && (
          <div className="concordance-panel__body">
            <EmptyState
              icon={<Library size={22} strokeWidth={1.75} />}
              title="Concordance"
              message="Look up a Strong's number above, or search the King James Version for a word or phrase."
            />
          </div>
        )}

        {searched && response && response.totalCount === 0 && (
          <div className="concordance-panel__body">
            <EmptyState
              icon={<Search size={22} strokeWidth={1.75} />}
              title="No KJV Results"
              message={`No KJV verses matched "${response.query}". Try a different word or phrase.`}
            />
          </div>
        )}

        {searched && response && response.totalCount > 0 && (
          <div className="concordance-panel__results-pane">
            <div className="concordance-panel__count-row">
              <p className="concordance-panel__count">
                {response.totalCount} KJV passage{response.totalCount !== 1 ? 's' : ''}{' '}
                found · scroll to browse all results
              </p>
            </div>
            <ul className="concordance-panel__results" aria-label="KJV concordance results">
              {results.map((result) => {
                const displayText = stripKjvEditorialMarkup(result.text);
                const highlight = splitTextHighlight(displayText, response.query);
                const resultKey = `${result.reference.book}-${result.reference.chapter}-${result.reference.verse}`;
                return (
                  <li key={resultKey}>
                    <button
                      type="button"
                      className="concordance-panel__result"
                      onClick={() =>
                        goToConcordanceResult(result.reference, response.query)
                      }
                    >
                      <span className="concordance-panel__ref">
                        {result.referenceLabel}
                      </span>
                      <span className="concordance-panel__text">
                        {highlight ? (
                          <>
                            {highlight.before}
                            <mark className="concordance-panel__mark">
                              {highlight.match}
                            </mark>
                            {highlight.after}
                          </>
                        ) : (
                          displayText
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
