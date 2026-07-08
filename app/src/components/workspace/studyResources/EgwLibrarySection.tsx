import { useState } from 'react';
import type { PassageKey } from '@/types/study';
import {
  EGW_CCEL_STEPS_URL,
  EGW_WHITE_ESTATE_LEGAL_URL,
} from '@/data/resources/catalog/egwBooks';
import { getEgwBookCatalog } from '@/services/studyResources/catalogService';
import { CatalogResourceCard } from './CatalogResourceCard';
import { EgwBookReader } from './EgwBookReader';
import { EgwReferencesPanel } from './StudyResourcePanels';
import './studyResources.css';

interface EgwLibrarySectionProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
  activeBookId?: string | null;
  onActiveBookChange?: (bookId: string | null) => void;
}

export function EgwLibrarySection({
  passageKey,
  passageLabel,
  headerSlot,
  activeBookId: controlledBookId,
  onActiveBookChange,
}: EgwLibrarySectionProps) {
  const books = getEgwBookCatalog();
  const [localBookId, setLocalBookId] = useState<string | null>(null);
  const activeBookId = controlledBookId !== undefined ? controlledBookId : localBookId;

  const setActiveBookId = (bookId: string | null) => {
    if (onActiveBookChange) onActiveBookChange(bookId);
    else setLocalBookId(bookId);
  };

  const [linkedNoteSeed, setLinkedNoteSeed] = useState<{
    bookTitle: string;
    key: number;
  } | null>(null);

  if (activeBookId) {
    return (
      <div className="catalog-library-section">
        {headerSlot}
        <EgwBookReader bookId={activeBookId} onClose={() => setActiveBookId(null)} />
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

  return (
    <div className="catalog-library-section">
      {headerSlot}

      <section aria-label="Ellen White book library">
        <h3 className="catalog-library-section__heading">Ellen White Library</h3>
        <p className="catalog-library-section__intro">
          Read Ellen G. White books in the app when local text is imported. Official estate links
          are provided for reference only.{' '}
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
                sourceUrl={book.readOnlineUrl}
                meta={`Author: ${book.author} · Topics: ${book.relatedTopics.join(', ') || '—'}`}
                onRead={() => setActiveBookId(book.id)}
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
          . The app includes a starter chapter bundled for in-app reading.
        </p>
      </section>

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
