import stepsToChristExcerpt from '@/data/resources/texts/steps-to-christ-excerpt.md?raw';
import { CATALOG_CHARTS } from '@/data/resources/catalog/chartsCatalog';
import { EGW_BOOK_CATALOG } from '@/data/resources/catalog/egwBooks';
import { CATALOG_MAPS } from '@/data/resources/catalog/mapsCatalog';
import { CATALOG_TOPICS } from '@/data/resources/catalog/topicsCatalog';
import type {
  CatalogChartEntry,
  CatalogMapEntry,
  CatalogRelatedItem,
  CatalogTopicEntry,
  EgwBookCatalogEntry,
} from '@/types/resourceCatalog';
import type { PassageKey } from '@/types/study';
import type { RelatedResourcesContext } from '@/types/studyResources';
import {
  passageMatchesAnyRef,
} from '@/services/studyResources/referenceMatching';
import {
  getTopicById,
  loadAllCharts,
  loadAllCommentaryNotes,
  loadAllEgwReferences,
  loadAllTopics,
} from '@/services/studyResources/studyResourceService';

export function getEgwBookCatalog(): EgwBookCatalogEntry[] {
  return EGW_BOOK_CATALOG;
}

export function getEgwBookById(id: string): EgwBookCatalogEntry | undefined {
  return EGW_BOOK_CATALOG.find((book) => book.id === id);
}

export function getCatalogTopics(): CatalogTopicEntry[] {
  return CATALOG_TOPICS;
}

export function getCatalogTopicById(id: string): CatalogTopicEntry | undefined {
  return CATALOG_TOPICS.find((topic) => topic.id === id);
}

export function getCatalogMaps(): CatalogMapEntry[] {
  return CATALOG_MAPS;
}

export function getCatalogMapById(id: string): CatalogMapEntry | undefined {
  return CATALOG_MAPS.find((map) => map.id === id);
}

export function getCatalogCharts(): CatalogChartEntry[] {
  return CATALOG_CHARTS;
}

export function getCatalogChartById(id: string): CatalogChartEntry | undefined {
  return CATALOG_CHARTS.find((chart) => chart.id === id);
}

export function getLocalTextContent(pathKey: string): string | null {
  if (pathKey === 'steps-to-christ-excerpt') return stepsToChristExcerpt;
  return null;
}

export function getCatalogCounts(): {
  egwBooks: number;
  topics: number;
  maps: number;
  charts: number;
} {
  return {
    egwBooks: EGW_BOOK_CATALOG.length,
    topics: CATALOG_TOPICS.length,
    maps: CATALOG_MAPS.length,
    charts: CATALOG_CHARTS.length,
  };
}

function topicTitleMatches(catalogTopic: CatalogTopicEntry, tag: string): boolean {
  return (
    catalogTopic.title.toLowerCase() === tag.trim().toLowerCase() ||
    catalogTopic.id === tag ||
    catalogTopic.title.toLowerCase().includes(tag.trim().toLowerCase())
  );
}

export function getCatalogRelatedResources(
  context: RelatedResourcesContext,
): CatalogRelatedItem[] {
  const items: CatalogRelatedItem[] = [];
  const { passageKey, topicId } = context;

  const userTopic = topicId?.startsWith('catalog-')
    ? getCatalogTopicById(topicId)
    : topicId
      ? getTopicById(topicId)
      : undefined;
  const catalogTopic =
    topicId?.startsWith('catalog-') ? getCatalogTopicById(topicId) : undefined;

  if (passageKey) {
    for (const book of EGW_BOOK_CATALOG) {
      if (passageMatchesAnyRef(passageKey, book.relatedBibleRefs)) {
        items.push({
          kind: 'egw-book',
          id: book.id,
          title: book.title,
          subtitle: 'EGW Writings',
          catalog: true,
        });
      }
    }
    for (const topic of CATALOG_TOPICS) {
      if (passageMatchesAnyRef(passageKey, topic.relatedBibleRefs)) {
        items.push({
          kind: 'topic',
          id: topic.id,
          title: topic.title,
          catalog: true,
        });
      }
    }
    for (const map of CATALOG_MAPS) {
      if (passageMatchesAnyRef(passageKey, map.relatedBibleRefs)) {
        items.push({
          kind: 'map',
          id: map.id,
          title: map.title,
          catalog: true,
        });
      }
    }
    for (const chart of CATALOG_CHARTS) {
      if (passageMatchesAnyRef(passageKey, chart.relatedBibleRefs)) {
        items.push({
          kind: 'chart',
          id: chart.id,
          title: chart.title,
          subtitle: chart.type,
          catalog: true,
        });
      }
    }
  }

  const topicTitle = catalogTopic?.title ?? userTopic?.title;
  if (topicTitle || catalogTopic) {
    const matchTopic = (t: CatalogTopicEntry) =>
      catalogTopic
        ? t.id === catalogTopic.id
        : topicTitle
          ? topicTitleMatches(t, topicTitle)
          : false;

    for (const book of EGW_BOOK_CATALOG) {
      if (
        catalogTopic?.relatedEgwBookIds.includes(book.id) ||
        (topicTitle &&
          book.relatedTopics.some((t) => t.toLowerCase() === topicTitle.toLowerCase()))
      ) {
        if (!items.some((i) => i.kind === 'egw-book' && i.id === book.id)) {
          items.push({
            kind: 'egw-book',
            id: book.id,
            title: book.title,
            catalog: true,
          });
        }
      }
    }
    for (const chart of CATALOG_CHARTS) {
      if (
        catalogTopic?.relatedChartIds.includes(chart.id) ||
        (topicTitle && chart.relatedTopics.some((t) => t === topicTitle))
      ) {
        if (!items.some((i) => i.kind === 'chart' && i.id === chart.id)) {
          items.push({
            kind: 'chart',
            id: chart.id,
            title: chart.title,
            catalog: true,
          });
        }
      }
    }
    for (const topic of CATALOG_TOPICS) {
      if (catalogTopic && topic.id !== catalogTopic.id && matchTopic(topic)) {
        if (!items.some((i) => i.kind === 'topic' && i.id === topic.id)) {
          items.push({ kind: 'topic', id: topic.id, title: topic.title, catalog: true });
        }
      }
    }
  }

  return items;
}

export function getMergedRelatedResources(context: RelatedResourcesContext) {
  const userNotes = loadAllCommentaryNotes();
  const userEgw = loadAllEgwReferences();
  const userTopics = loadAllTopics();
  const userCharts = loadAllCharts();
  const catalogItems = getCatalogRelatedResources(context);
  const { passageKey } = context;

  const userItems: CatalogRelatedItem[] = [];
  if (passageKey) {
    for (const note of userNotes) {
      if (passageMatchesAnyRef(passageKey, note.relatedBibleRefs)) {
        userItems.push({
          kind: 'commentary',
          id: note.id,
          title: note.title,
          catalog: false,
        });
      }
    }
    for (const ref of userEgw) {
      if (passageMatchesAnyRef(passageKey, ref.relatedBibleRefs)) {
        userItems.push({
          kind: 'egw-note',
          id: ref.id,
          title: ref.title,
          subtitle: ref.citation,
          catalog: false,
        });
      }
    }
    for (const t of userTopics) {
      if (passageMatchesAnyRef(passageKey, t.relatedBibleRefs)) {
        userItems.push({ kind: 'topic', id: t.id, title: t.title, catalog: false });
      }
    }
    for (const chart of userCharts) {
      if (passageMatchesAnyRef(passageKey, chart.relatedBibleRefs)) {
        userItems.push({
          kind: 'chart',
          id: chart.id,
          title: chart.title,
          catalog: false,
        });
      }
    }
  }

  return [...catalogItems, ...userItems];
}

export function findCatalogTopicsForPassage(passageKey: PassageKey): CatalogTopicEntry[] {
  return CATALOG_TOPICS.filter((topic) =>
    passageMatchesAnyRef(passageKey, topic.relatedBibleRefs),
  );
}

export function findEgwBooksForTopicTitle(topicTitle: string): EgwBookCatalogEntry[] {
  const normalized = topicTitle.trim().toLowerCase();
  return EGW_BOOK_CATALOG.filter((book) =>
    book.relatedTopics.some((t) => t.toLowerCase() === normalized),
  );
}
