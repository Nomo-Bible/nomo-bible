import { useState } from 'react';
import type { PassageKey } from '@/types/study';
import type { CatalogTopicEntry } from '@/types/resourceCatalog';
import {
  getCatalogCharts,
  getCatalogMaps,
  getCatalogTopicById,
  getCatalogTopics,
  getEgwBookById,
} from '@/services/studyResources/catalogService';
import { CatalogResourceCard } from './CatalogResourceCard';
import { TopicsPanel } from './StudyResourcePanels';
import { formatListInput } from '@/services/studyResources/referenceMatching';
import './studyResources.css';

interface TopicsCatalogSectionProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

function TopicDetailView({ topic }: { topic: CatalogTopicEntry }) {
  const relatedBooks = topic.relatedEgwBookIds
    .map((id) => getEgwBookById(id))
    .filter((book): book is NonNullable<typeof book> => book !== undefined);
  const charts = getCatalogCharts().filter(
    (c) => topic.relatedChartIds.includes(c.id) || c.relatedTopics.includes(topic.title),
  );
  const maps = getCatalogMaps().filter((m) => topic.relatedMapIds.includes(m.id));

  return (
    <article className="catalog-topic-detail">
      <h4 className="catalog-topic-detail__title">{topic.title}</h4>
      <p className="catalog-topic-detail__description">{topic.description}</p>
      {topic.relatedBibleRefs.length > 0 ? (
        <p className="catalog-topic-detail__refs">
          <strong>Bible references:</strong> {formatListInput(topic.relatedBibleRefs)}
        </p>
      ) : null}
      {relatedBooks.length > 0 ? (
        <div className="catalog-topic-detail__related">
          <p className="catalog-topic-detail__refs">
            <strong>Related Ellen White works</strong>
          </p>
          <ul className="catalog-library-section__list">
            {relatedBooks.map((book) => (
              <li key={book.id}>
                <CatalogResourceCard
                  title={book.title}
                  description={book.description}
                  sourceName={book.sourceName}
                  licenseNotes={book.licenseNotes}
                  readOnlineUrl={book.readOnlineUrl}
                  localTextAvailable={book.localTextAvailable}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {charts.length > 0 ? (
        <p className="catalog-topic-detail__refs">
          <strong>Related charts:</strong> {charts.map((c) => c.title).join(', ')}
        </p>
      ) : null}
      {maps.length > 0 ? (
        <p className="catalog-topic-detail__refs">
          <strong>Related maps:</strong> {maps.map((m) => m.title).join(', ')}
        </p>
      ) : null}
    </article>
  );
}

export function TopicsCatalogSection({
  passageKey,
  passageLabel,
  headerSlot,
}: TopicsCatalogSectionProps) {
  const topics = getCatalogTopics();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? getCatalogTopicById(selectedId) : null;

  return (
    <div className="catalog-library-section">
      {headerSlot}
      <section aria-label="Built-in study topics">
        <h3 className="catalog-library-section__heading">Study Topics</h3>
        <p className="catalog-library-section__intro">
          Doctrine and theme hubs connecting Scripture, Ellen White writings, charts, and maps.
        </p>
        <ul className="catalog-library-section__list catalog-library-section__list--topics">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className={
                  selectedId === topic.id
                    ? 'catalog-library-section__topic-btn catalog-library-section__topic-btn--active'
                    : 'catalog-library-section__topic-btn'
                }
                onClick={() => setSelectedId(topic.id === selectedId ? null : topic.id)}
              >
                <span className="catalog-library-section__topic-title">{topic.title}</span>
                <span className="catalog-library-section__topic-summary">{topic.description}</span>
              </button>
            </li>
          ))}
        </ul>
        {selected ? <TopicDetailView topic={selected} /> : null}
      </section>

      <section aria-label="My custom topics">
        <TopicsPanel passageKey={passageKey} passageLabel={passageLabel} libraryMode />
      </section>
    </div>
  );
}
