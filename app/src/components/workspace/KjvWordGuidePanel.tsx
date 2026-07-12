import { BookText, Copy, Search, StickyNote } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import {
  KJV_EST_EXAMPLES,
  KJV_ETH_EXAMPLES,
  KJV_GRAMMAR_BLOCKS,
  KJV_PRONOUN_COMPARISON_PLURAL,
  KJV_PRONOUN_COMPARISON_SINGULAR,
  KJV_SCRIPTURE_EXAMPLES,
  KJV_WORD_GUIDE_ENTRIES,
} from '@/data/kjvWordGuide';
import {
  filterKjvWordGuideByLetter,
  formatKjvWordEntryNoteHtml,
  groupKjvWordGuideByCategory,
  hasKjvWordGuideEntry,
  KJV_WORD_GUIDE_ALPHABET,
  KJV_WORD_GUIDE_INSERT_EVENT,
  searchKjvWordGuide,
} from '@/services/kjvWordGuideService';
import {
  KJV_WORD_CATEGORY_META,
  categoryTitle,
  type KjvWordCategoryId,
  type KjvWordEntry,
} from '@/types/kjvWordGuide';
import './KjvWordGuidePanel.css';

function EntryCard({
  entry,
  onCopy,
  copyLabel,
}: {
  entry: KjvWordEntry;
  onCopy: (entry: KjvWordEntry) => void;
  copyLabel: string;
}) {
  return (
    <article className="kjv-word-guide__card">
      <header className="kjv-word-guide__card-header">
        <h4 className="kjv-word-guide__word">{entry.word}</h4>
        <span className="kjv-word-guide__category-pill">
          {categoryTitle(entry.category)}
        </span>
      </header>
      <p className="kjv-word-guide__meaning">{entry.meaning}</p>
      {entry.note ? <p className="kjv-word-guide__note">{entry.note}</p> : null}
      <button
        type="button"
        className="kjv-word-guide__copy-btn"
        onClick={() => onCopy(entry)}
      >
        <StickyNote size={14} strokeWidth={2} aria-hidden="true" />
        {copyLabel}
      </button>
    </article>
  );
}

export function KjvWordGuidePanel() {
  const { isAuthenticated, isConfigured, openAuthPrompt } = useAuth();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [lookupMiss, setLookupMiss] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab !== 'kjv-word-guide') return;

    const q = searchParams.get('q')?.trim() ?? '';
    const lookup = searchParams.get('lookup')?.trim() ?? '';

    if (q) {
      setQuery(q);
      setLetter(null);
      setLookupMiss(
        lookup && !hasKjvWordGuideEntry(lookup)
          ? `No KJV glossary entry found for “${lookup}”.`
          : null,
      );
      requestAnimationFrame(() => searchInputRef.current?.focus());
      return;
    }

    if (lookup) {
      setQuery(lookup);
      setLetter(null);
      setLookupMiss(
        hasKjvWordGuideEntry(lookup)
          ? null
          : `No KJV glossary entry found for “${lookup}”.`,
      );
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const searched = searchKjvWordGuide(query);
    return filterKjvWordGuideByLetter(searched, letter);
  }, [query, letter]);

  const grouped = useMemo(() => groupKjvWordGuideByCategory(filtered), [filtered]);
  const isSearching = query.trim().length > 0 || letter !== null;

  const copyLabel =
    isAuthenticated || !isConfigured ? 'Copy to Notes' : 'Copy to Notes (sign in)';

  const handleCopy = (entry: KjvWordEntry) => {
    if (isConfigured && !isAuthenticated) {
      openAuthPrompt();
      return;
    }

    const html = formatKjvWordEntryNoteHtml(entry);
    window.dispatchEvent(
      new CustomEvent(KJV_WORD_GUIDE_INSERT_EVENT, { detail: { html } }),
    );
    setCopyFeedback(`Copied “${entry.word}” to Study Notes`);
    window.setTimeout(() => setCopyFeedback(null), 2400);
  };

  const renderSectionEntries = (categoryId: KjvWordCategoryId) => {
    const entries = grouped[categoryId];
    if (!entries || entries.length === 0) return null;
    return (
      <div className="kjv-word-guide__cards">
        {entries.map((entry) => (
          <EntryCard
            key={`${entry.category}:${entry.word}`}
            entry={entry}
            onCopy={handleCopy}
            copyLabel={copyLabel}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="kjv-word-guide">
      <ReadingPanelChrome focusId="kjv-word-guide" title="KJV Word Guide" />

      <div className="kjv-word-guide__intro">
        <div className="kjv-word-guide__intro-icon" aria-hidden="true">
          <BookText size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="kjv-word-guide__title">KJV Word Guide</h3>
          <p className="kjv-word-guide__subtitle">
            Look up older King James words, grammar forms, and modern meanings
            without leaving Scripture.
          </p>
        </div>
      </div>

      <form
        className="kjv-word-guide__search"
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <label className="kjv-word-guide__search-label" htmlFor="kjv-word-guide-search">
          Search KJV words or modern meanings
        </label>
        <div className="kjv-word-guide__search-row">
          <Search
            className="kjv-word-guide__search-icon"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id="kjv-word-guide-search"
            className="kjv-word-guide__search-input"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLookupMiss(null);
            }}
            placeholder="Search word, meaning, or phrase…"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="kjv-word-guide__clear"
              onClick={() => {
                setQuery('');
                setLookupMiss(null);
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      <div className="kjv-word-guide__az" aria-label="Filter by letter">
        <button
          type="button"
          className={
            letter === null
              ? 'kjv-word-guide__az-btn kjv-word-guide__az-btn--active'
              : 'kjv-word-guide__az-btn'
          }
          onClick={() => setLetter(null)}
        >
          All
        </button>
        {KJV_WORD_GUIDE_ALPHABET.map((item) => (
          <button
            key={item}
            type="button"
            className={
              letter === item
                ? 'kjv-word-guide__az-btn kjv-word-guide__az-btn--active'
                : 'kjv-word-guide__az-btn'
            }
            onClick={() => setLetter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {copyFeedback ? (
        <p className="kjv-word-guide__feedback" role="status">
          <Copy size={14} strokeWidth={2} aria-hidden="true" />
          {copyFeedback}
        </p>
      ) : null}

      {lookupMiss ? (
        <p className="kjv-word-guide__miss" role="status">
          {lookupMiss}
        </p>
      ) : null}

      <p className="kjv-word-guide__count">
        {filtered.length} of {KJV_WORD_GUIDE_ENTRIES.length} entries
        {isSearching ? ' matching your filters' : ''}
      </p>

      <div className="kjv-word-guide__body">
        {!isSearching ? (
          <>
            <section className="kjv-word-guide__section" id="kjv-guide-pronouns">
              <h3 className="kjv-word-guide__section-title">1. Pronouns</h3>
              <p className="kjv-word-guide__section-desc">
                Singular and plural forms preserved in the KJV.
              </p>
              <div className="kjv-word-guide__compare">
                <div className="kjv-word-guide__compare-col">
                  {KJV_PRONOUN_COMPARISON_SINGULAR.map((row) => (
                    <div key={row.label} className="kjv-word-guide__compare-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="kjv-word-guide__compare-col">
                  {KJV_PRONOUN_COMPARISON_PLURAL.map((row) => (
                    <div key={row.label} className="kjv-word-guide__compare-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
              {renderSectionEntries('pronouns')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-verbs">
              <h3 className="kjv-word-guide__section-title">2. Common verb forms</h3>
              {renderSectionEntries('common-verb-forms')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-est">
              <h3 className="kjv-word-guide__section-title">Common “-est” forms</h3>
              <p className="kjv-word-guide__section-desc">
                The ending “-est” is usually used with thou and refers to one person.
              </p>
              <ul className="kjv-word-guide__examples">
                {KJV_EST_EXAMPLES.map((example) => (
                  <li key={example.kjv}>
                    <strong>{example.kjv}</strong> — {example.meaning}
                  </li>
                ))}
              </ul>
              {renderSectionEntries('est-forms')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-eth">
              <h3 className="kjv-word-guide__section-title">Common “-eth” forms</h3>
              <p className="kjv-word-guide__section-desc">
                The ending “-eth” is normally used with he, she, it, God, Christ, the
                Lord, or another singular subject.
              </p>
              <ul className="kjv-word-guide__examples">
                {KJV_ETH_EXAMPLES.map((example) => (
                  <li key={example.kjv}>
                    <strong>{example.kjv}</strong> — {example.meaning}
                  </li>
                ))}
              </ul>
              {renderSectionEntries('eth-forms')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-direction">
              <h3 className="kjv-word-guide__section-title">
                3. Direction and location words
              </h3>
              {renderSectionEntries('direction-location')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-vocab">
              <h3 className="kjv-word-guide__section-title">
                4. Common older vocabulary
              </h3>
              {renderSectionEntries('older-vocabulary')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-past">
              <h3 className="kjv-word-guide__section-title">5. Older past-tense forms</h3>
              {renderSectionEntries('older-past-tense')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-numbers">
              <h3 className="kjv-word-guide__section-title">
                6. Numbers and measurements
              </h3>
              <p className="kjv-word-guide__section-desc">
                Example: “threescore and ten” means seventy.
              </p>
              {renderSectionEntries('numbers-measurements')}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-grammar">
              <h3 className="kjv-word-guide__section-title">7. Grammar explanations</h3>
              {KJV_GRAMMAR_BLOCKS.map((block) => (
                <div key={block.id} className="kjv-word-guide__grammar">
                  <h4 className="kjv-word-guide__grammar-title">{block.title}</h4>
                  {block.body.map((paragraph) => (
                    <p key={paragraph} className="kjv-word-guide__grammar-body">
                      {paragraph}
                    </p>
                  ))}
                  {block.examples ? (
                    <ul className="kjv-word-guide__examples">
                      {block.examples.map((example) => (
                        <li key={example.kjv}>
                          <strong>{example.kjv}</strong>
                          <br />
                          Meaning: {example.meaning}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="kjv-word-guide__section" id="kjv-guide-examples">
              <h3 className="kjv-word-guide__section-title">
                8. Important examples from Scripture
              </h3>
              {KJV_SCRIPTURE_EXAMPLES.map((example) => (
                <div key={example.id} className="kjv-word-guide__scripture">
                  <h4 className="kjv-word-guide__scripture-ref">{example.reference}</h4>
                  {example.passages.map((passage) => (
                    <blockquote key={passage.quote} className="kjv-word-guide__quote">
                      <p>“{passage.quote}”</p>
                      <footer>{passage.explanation}</footer>
                    </blockquote>
                  ))}
                </div>
              ))}
            </section>
          </>
        ) : filtered.length === 0 ? (
          <div className="kjv-word-guide__empty">
            <p>No matching KJV glossary entries.</p>
            <button
              type="button"
              className="nm-btn nm-btn--secondary"
              onClick={() => {
                setQuery('');
                setLetter(null);
                setLookupMiss(null);
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          KJV_WORD_CATEGORY_META.map((meta) => {
            const entries = grouped[meta.id];
            if (!entries?.length) return null;
            return (
              <section
                key={meta.id}
                className="kjv-word-guide__section"
                id={`kjv-guide-search-${meta.id}`}
              >
                <h3 className="kjv-word-guide__section-title">{meta.title}</h3>
                {renderSectionEntries(meta.id)}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
