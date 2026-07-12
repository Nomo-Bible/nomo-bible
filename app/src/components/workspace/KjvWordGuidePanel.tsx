import {
  BookText,
  ClipboardCopy,
  Pin,
  PinOff,
  Search,
  StickyNote,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { ReadingPanelChrome } from '@/components/workspace/ReadingPanelChrome';
import {
  KJV_EST_EXAMPLES,
  KJV_ETH_EXAMPLES,
  KJV_GRAMMAR_BLOCKS,
  KJV_SCRIPTURE_EXAMPLES,
  KJV_WORD_GUIDE_ENTRIES,
} from '@/data/kjvWordGuide';
import {
  filterKjvWordGuideByLetter,
  formatKjvWordEntryNoteHtml,
  formatKjvWordEntryPlain,
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

const RECENT_SEARCHES_KEY = 'nomomartyria-kjv-guide-recent-searches-v1';
const RECENT_COPIED_KEY = 'nomomartyria-kjv-guide-recent-copied-v1';
const PINNED_WORDS_KEY = 'nomomartyria-kjv-guide-pinned-v1';

const QUICK_JUMP: { id: string; label: string; category?: KjvWordCategoryId }[] = [
  { id: 'kjv-guide-pronouns', label: 'Pronouns', category: 'pronouns' },
  { id: 'kjv-guide-verbs', label: 'Verb forms', category: 'common-verb-forms' },
  { id: 'kjv-guide-est', label: '“-est” forms', category: 'est-forms' },
  { id: 'kjv-guide-eth', label: '“-eth” forms', category: 'eth-forms' },
  { id: 'kjv-guide-direction', label: 'Direction', category: 'direction-location' },
  { id: 'kjv-guide-vocab', label: 'Vocabulary', category: 'older-vocabulary' },
  { id: 'kjv-guide-past', label: 'Past tense', category: 'older-past-tense' },
  { id: 'kjv-guide-numbers', label: 'Numbers', category: 'numbers-measurements' },
  { id: 'kjv-guide-grammar', label: 'Grammar' },
  { id: 'kjv-guide-examples', label: 'Scripture' },
];

function readJsonList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeJsonList(key: string, values: string[]): void {
  localStorage.setItem(key, JSON.stringify(values.slice(0, 8)));
}

function pushUnique(list: string[], value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return list;
  return [trimmed, ...list.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    8,
  );
}

function highlightText(text: string, query: string): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const tokens = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (tokens.length === 0) return text;

  const pattern = new RegExp(`(${tokens.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="kjv-word-guide__mark">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function EntryCard({
  entry,
  query,
  pinned,
  onCopyClipboard,
  onAddToNotes,
  onTogglePin,
  notesNeedsAuth,
}: {
  entry: KjvWordEntry;
  query: string;
  pinned: boolean;
  onCopyClipboard: (entry: KjvWordEntry) => void;
  onAddToNotes: (entry: KjvWordEntry) => void;
  onTogglePin: (word: string) => void;
  notesNeedsAuth: boolean;
}) {
  return (
    <article className="kjv-word-guide__card">
      <header className="kjv-word-guide__card-header">
        <h4 className="kjv-word-guide__word">{highlightText(entry.word, query)}</h4>
        <span className="kjv-word-guide__category-pill">
          {categoryTitle(entry.category)}
        </span>
      </header>
      <p className="kjv-word-guide__meaning">{highlightText(entry.meaning, query)}</p>
      {entry.note ? (
        <p className="kjv-word-guide__note">{highlightText(entry.note, query)}</p>
      ) : null}
      <div className="kjv-word-guide__card-actions">
        <button
          type="button"
          className="kjv-word-guide__icon-btn"
          onClick={() => onCopyClipboard(entry)}
          title="Copy definition"
          aria-label={`Copy ${entry.word}`}
        >
          <ClipboardCopy size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="kjv-word-guide__icon-btn"
          onClick={() => onAddToNotes(entry)}
          title={notesNeedsAuth ? 'Sign in to add to notes' : 'Add to Study Notes'}
          aria-label={`Add ${entry.word} to notes`}
        >
          <StickyNote size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={
            pinned
              ? 'kjv-word-guide__icon-btn kjv-word-guide__icon-btn--active'
              : 'kjv-word-guide__icon-btn'
          }
          onClick={() => onTogglePin(entry.word)}
          title={pinned ? 'Unpin word' : 'Pin word'}
          aria-label={pinned ? `Unpin ${entry.word}` : `Pin ${entry.word}`}
          aria-pressed={pinned}
        >
          {pinned ? (
            <PinOff size={14} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Pin size={14} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
}

export function KjvWordGuidePanel() {
  const { isAuthenticated, isConfigured, openAuthPrompt } = useAuth();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [lookupMiss, setLookupMiss] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readJsonList(RECENT_SEARCHES_KEY),
  );
  const [recentCopied, setRecentCopied] = useState<string[]>(() =>
    readJsonList(RECENT_COPIED_KEY),
  );
  const [pinnedWords, setPinnedWords] = useState<string[]>(() =>
    readJsonList(PINNED_WORDS_KEY),
  );

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

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const handle = window.setTimeout(() => {
      setRecentSearches((current) => {
        const next = pushUnique(current, trimmed);
        writeJsonList(RECENT_SEARCHES_KEY, next);
        return next;
      });
    }, 700);
    return () => window.clearTimeout(handle);
  }, [query]);

  const filtered = useMemo(() => {
    const searched = searchKjvWordGuide(query);
    return filterKjvWordGuideByLetter(searched, letter);
  }, [query, letter]);

  const grouped = useMemo(() => groupKjvWordGuideByCategory(filtered), [filtered]);
  const isSearching = query.trim().length > 0 || letter !== null;
  const notesNeedsAuth = isConfigured && !isAuthenticated;

  const dominantCategory = useMemo(() => {
    let best: KjvWordCategoryId | null = null;
    let bestCount = 0;
    for (const meta of KJV_WORD_CATEGORY_META) {
      const count = grouped[meta.id]?.length ?? 0;
      if (count > bestCount) {
        best = meta.id;
        bestCount = count;
      }
    }
    return best;
  }, [grouped]);

  const rememberCopied = (word: string) => {
    setRecentCopied((current) => {
      const next = pushUnique(current, word);
      writeJsonList(RECENT_COPIED_KEY, next);
      return next;
    });
  };

  const handleCopyClipboard = (entry: KjvWordEntry) => {
    void navigator.clipboard.writeText(formatKjvWordEntryPlain(entry)).catch(() => undefined);
    rememberCopied(entry.word);
    setCopyFeedback(`Copied “${entry.word}”`);
    window.setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleAddToNotes = (entry: KjvWordEntry) => {
    if (notesNeedsAuth) {
      openAuthPrompt();
      return;
    }

    const html = formatKjvWordEntryNoteHtml(entry);
    window.dispatchEvent(
      new CustomEvent(KJV_WORD_GUIDE_INSERT_EVENT, { detail: { html } }),
    );
    rememberCopied(entry.word);
    setCopyFeedback(`Added “${entry.word}” to Study Notes`);
    window.setTimeout(() => setCopyFeedback(null), 2400);
  };

  const handleTogglePin = (word: string) => {
    setPinnedWords((current) => {
      const exists = current.some((item) => item.toLowerCase() === word.toLowerCase());
      const next = exists
        ? current.filter((item) => item.toLowerCase() !== word.toLowerCase())
        : pushUnique(current, word);
      writeJsonList(PINNED_WORDS_KEY, next);
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    const container = mainRef.current;
    const target = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applySearch = (value: string) => {
    setQuery(value);
    setLetter(null);
    setLookupMiss(null);
    searchInputRef.current?.focus();
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
            query={query}
            pinned={pinnedWords.some(
              (item) => item.toLowerCase() === entry.word.toLowerCase(),
            )}
            onCopyClipboard={handleCopyClipboard}
            onAddToNotes={handleAddToNotes}
            onTogglePin={handleTogglePin}
            notesNeedsAuth={notesNeedsAuth}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="kjv-word-guide">
      <ReadingPanelChrome focusId="kjv-word-guide" title="KJV Word Guide" />

      <div className="kjv-word-guide__chrome">
        <form
          className="kjv-word-guide__search"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <label className="visually-hidden" htmlFor="kjv-word-guide-search">
            Search KJV words or modern meanings
          </label>
          <div className="kjv-word-guide__search-row">
            <Search
              className="kjv-word-guide__search-icon"
              size={15}
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
            {copyFeedback}
          </p>
        ) : null}
        {lookupMiss ? (
          <p className="kjv-word-guide__miss" role="status">
            {lookupMiss}
          </p>
        ) : null}
      </div>

      <div className="kjv-word-guide__workspace">
        <aside className="kjv-word-guide__sidebar kjv-word-guide__sidebar--left">
          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">
              <BookText size={14} strokeWidth={2} aria-hidden="true" />
              Pronouns
            </h3>
            <div className="kjv-word-guide__pronoun-grid">
              <div>
                <p className="kjv-word-guide__pronoun-label">Singular</p>
                <ul className="kjv-word-guide__pronoun-list">
                  <li>thou</li>
                  <li>thee</li>
                  <li>thy</li>
                  <li>thine</li>
                </ul>
              </div>
              <div>
                <p className="kjv-word-guide__pronoun-label">Plural</p>
                <ul className="kjv-word-guide__pronoun-list">
                  <li>ye</li>
                  <li>you</li>
                  <li>your</li>
                  <li>yours</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Quick tips</h3>
            <ul className="kjv-word-guide__tip-list">
              <li>
                <strong>-est</strong> usually with <em>thou</em>
              </li>
              <li>
                <strong>-eth</strong> with he / she / it / God
              </li>
              <li>
                <strong>threescore and ten</strong> = seventy
              </li>
            </ul>
          </div>
        </aside>

        <main ref={mainRef} className="kjv-word-guide__main">
          <div className="kjv-word-guide__main-meta">
            <span>
              {filtered.length} of {KJV_WORD_GUIDE_ENTRIES.length}
              {isSearching ? ' matches' : ' entries'}
            </span>
            {dominantCategory ? (
              <span className="kjv-word-guide__main-meta-cat">
                {categoryTitle(dominantCategory)}
              </span>
            ) : null}
          </div>

          {!isSearching ? (
            <>
              <section className="kjv-word-guide__section" id="kjv-guide-pronouns">
                <h3 className="kjv-word-guide__section-title">Pronouns</h3>
                {renderSectionEntries('pronouns')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-verbs">
                <h3 className="kjv-word-guide__section-title">Common verb forms</h3>
                {renderSectionEntries('common-verb-forms')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-est">
                <h3 className="kjv-word-guide__section-title">Common “-est” forms</h3>
                <p className="kjv-word-guide__section-desc">
                  Usually used with thou (one person).
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
                  Normally used with he, she, it, God, Christ, or the Lord.
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
                  Direction and location
                </h3>
                {renderSectionEntries('direction-location')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-vocab">
                <h3 className="kjv-word-guide__section-title">Older vocabulary</h3>
                {renderSectionEntries('older-vocabulary')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-past">
                <h3 className="kjv-word-guide__section-title">Older past-tense forms</h3>
                {renderSectionEntries('older-past-tense')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-numbers">
                <h3 className="kjv-word-guide__section-title">
                  Numbers and measurements
                </h3>
                <p className="kjv-word-guide__section-desc">
                  “threescore and ten” means seventy.
                </p>
                {renderSectionEntries('numbers-measurements')}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-grammar">
                <h3 className="kjv-word-guide__section-title">Grammar</h3>
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
                            <strong>{example.kjv}</strong> — {example.meaning}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </section>

              <section className="kjv-word-guide__section" id="kjv-guide-examples">
                <h3 className="kjv-word-guide__section-title">Scripture examples</h3>
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
        </main>

        <aside className="kjv-word-guide__sidebar kjv-word-guide__sidebar--right">
          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Current view</h3>
            <dl className="kjv-word-guide__stats">
              <div>
                <dt>Entries</dt>
                <dd>{filtered.length}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{dominantCategory ? categoryTitle(dominantCategory) : 'All'}</dd>
              </div>
            </dl>
          </div>

          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Quick jump</h3>
            <div className="kjv-word-guide__jump-list">
              {QUICK_JUMP.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="kjv-word-guide__jump-btn"
                  onClick={() => {
                    if (isSearching) {
                      setQuery('');
                      setLetter(null);
                      window.setTimeout(() => scrollToSection(item.id), 40);
                      return;
                    }
                    scrollToSection(item.id);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Recent searches</h3>
            {recentSearches.length === 0 ? (
              <p className="kjv-word-guide__tool-empty">No recent searches</p>
            ) : (
              <ul className="kjv-word-guide__chip-list">
                {recentSearches.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="kjv-word-guide__chip"
                      onClick={() => applySearch(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Pinned words</h3>
            {pinnedWords.length === 0 ? (
              <p className="kjv-word-guide__tool-empty">Pin words while you study</p>
            ) : (
              <ul className="kjv-word-guide__chip-list">
                {pinnedWords.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="kjv-word-guide__chip"
                      onClick={() => applySearch(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="kjv-word-guide__tool-card">
            <h3 className="kjv-word-guide__tool-title">Recently copied</h3>
            {recentCopied.length === 0 ? (
              <p className="kjv-word-guide__tool-empty">Nothing copied yet</p>
            ) : (
              <ul className="kjv-word-guide__chip-list">
                {recentCopied.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="kjv-word-guide__chip"
                      onClick={() => applySearch(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
