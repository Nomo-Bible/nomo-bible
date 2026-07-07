import { useState } from 'react';
import type { PassageKey } from '@/types/study';
import {
  EGW_CCEL_STEPS_URL,
  EGW_WHITE_ESTATE_LEGAL_URL,
} from '@/data/resources/catalog/egwBooks';
import {
  getEgwBookCatalog,
  getLocalTextContent,
} from '@/services/studyResources/catalogService';
import { CatalogResourceCard, LocalTextViewer } from './CatalogResourceCard';
import { EgwReferencesPanel } from './StudyResourcePanels';
import './studyResources.css';

interface EgwLibrarySectionProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function EgwLibrarySection({
  passageKey,
  passageLabel,
  headerSlot,
}: EgwLibrarySectionProps) {
  const books = getEgwBookCatalog();
  const [localTextBookId, setLocalTextBookId] = useState<string | null>(null);
  const [linkedNoteSeed, setLinkedNoteSeed] = useState<{
    bookTitle: string;
    key: number;
  } | null>(null);

  const localTextBook = localTextBookId
    ? books.find((book) => book.id === localTextBookId) ?? null
    : null;
  const localContent =
    localTextBook?.localTextPath
      ? getLocalTextContent(localTextBook.localTextPath)
      : null;

  return (
    <div className="catalog-library-section">
      {headerSlot}

      <section aria-label="Ellen White book library">
        <h3 className="catalog-library-section__heading">Ellen White Library</h3>
        <p className="catalog-library-section__intro">
          Built-in links to Ellen G. White writings via the Ellen G. White Estate. Read online
          freely; local full-text import requires verified licensing.{' '}
          <a href={EGW_WHITE_ESTATE_LEGAL_URL} target="_blank" rel="noopener noreferrer">
            White Estate legal notice
          </a>
        </p>
        <ul className="catalog-library-section__list">
          {books.map((book) => (
            <li key={book.id}>
              <CatalogResourceCard
                title={book.title}
                description={book.description}
                sourceName={book.sourceName}
                licenseNotes={book.licenseNotes}
                readOnlineUrl={book.readOnlineUrl}
                localTextAvailable={book.localTextAvailable}
                meta={`Author: ${book.author} · Topics: ${book.relatedTopics.join(', ') || '—'}`}
                onViewLocalText={
                  book.localTextAvailable ? () => setLocalTextBookId(book.id) : undefined
                }
                onAddLinkedNote={() =>
                  setLinkedNoteSeed({ bookTitle: book.title, key: Date.now() })
                }
              />
            </li>
          ))}
        </ul>
        <p className="catalog-library-section__footnote">
          Public-domain edition of <em>Steps to Christ</em> also at{' '}
          <a href={EGW_CCEL_STEPS_URL} target="_blank" rel="noopener noreferrer">
            CCEL
          </a>
          . App includes a short PD starter excerpt only.
        </p>
      </section>

      {localTextBook && localContent ? (
        <LocalTextViewer
          title={localTextBook.title}
          content={localContent}
          onClose={() => setLocalTextBookId(null)}
        />
      ) : null}

      <section aria-label="My Ellen White linked notes">
        <EgwReferencesPanel
          passageKey={passageKey}
          passageLabel={passageLabel}
          filterByPassage={false}
          libraryMode
          sectionTitle="My Linked EGW Notes"
          seedSourceWork={linkedNoteSeed?.bookTitle}
          autoStartCreateKey={linkedNoteSeed?.key}
        />
      </section>
    </div>
  );
}
