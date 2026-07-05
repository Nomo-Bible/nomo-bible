import { useState, type FormEvent } from 'react';
import { CONCORDANCE_PICKER_LIMIT, searchConcordance } from '@/services/concordanceService';
import { stripKjvEditorialMarkup } from '@/utils/kjvVerseMarkup';
import { parseScriptureReference } from '@/services/passageKeyService';
import { getChapter } from '@/services/bibleService';
import type { CrossReferenceTarget } from '@/types/crossReferences';
import './CrossReferenceSearch.css';

export interface CrossReferenceSearchResult {
  target: CrossReferenceTarget;
  previewText?: string;
}

interface CrossReferenceSearchProps {
  onSelect: (result: CrossReferenceSearchResult) => void;
}

function targetFromReference(
  book: string,
  chapter: number,
  verse: number | null,
): CrossReferenceTarget {
  return {
    targetBook: book,
    targetChapter: chapter,
    targetVerse: verse,
    targetReference:
      verse !== null ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`,
  };
}

function searchByReference(query: string): CrossReferenceSearchResult[] {
  const location = parseScriptureReference(query);
  if (!location) return [];

  if (location.verse !== null) {
    const chapter = getChapter(location.book, location.chapter);
    const verse = chapter?.verses.find((v) => v.number === location.verse);
    return [
      {
        target: targetFromReference(
          location.book,
          location.chapter,
          location.verse,
        ),
        previewText: verse?.text ? stripKjvEditorialMarkup(verse.text) : undefined,
      },
    ];
  }

  return [
    {
      target: targetFromReference(location.book, location.chapter, null),
    },
  ];
}

function searchByText(query: string): CrossReferenceSearchResult[] {
  const response = searchConcordance(query);
  return response.results.slice(0, CONCORDANCE_PICKER_LIMIT).map((result) => ({
    target: targetFromReference(
      result.reference.book,
      result.reference.chapter,
      result.reference.verse,
    ),
    previewText: stripKjvEditorialMarkup(result.text),
  }));
}

export function CrossReferenceSearch({ onSelect }: CrossReferenceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CrossReferenceSearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const referenceResults = searchByReference(trimmed);
    const nextResults =
      referenceResults.length > 0 ? referenceResults : searchByText(trimmed);

    setResults(nextResults);
    setSearched(true);

    if (nextResults.length === 1) {
      onSelect(nextResults[0]);
    }
  };

  return (
    <div className="cross-ref-search">
      <form className="cross-ref-search__form" onSubmit={handleSubmit}>
        <label htmlFor="cross-ref-search-input" className="cross-ref-search__label">
          Search by reference or text
        </label>
        <div className="cross-ref-search__row">
          <input
            id="cross-ref-search-input"
            type="search"
            className="cross-ref-search__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(false);
            }}
            placeholder="John 3:16 or love"
          />
          <button type="submit" className="cross-ref-search__btn">
            Search
          </button>
        </div>
      </form>

      {searched && results.length === 0 && (
        <p className="cross-ref-search__empty">No matching passages found.</p>
      )}

      {results.length > 1 && (
        <ul className="cross-ref-search__results" aria-label="Search results">
          {results.map((result) => (
            <li key={result.target.targetReference}>
              <button
                type="button"
                className="cross-ref-search__result"
                onClick={() => onSelect(result)}
              >
                <span className="cross-ref-search__ref">
                  {result.target.targetReference}
                </span>
                {result.previewText && (
                  <span className="cross-ref-search__preview">
                    {result.previewText.length > 100
                      ? `${result.previewText.slice(0, 100)}…`
                      : result.previewText}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
