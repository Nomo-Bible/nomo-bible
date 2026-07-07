import type { PassageKey } from '@/types/study';
import type {
  ChartResource,
  ChartResourceInput,
  CommentaryNote,
  CommentaryNoteInput,
  EGWReference,
  EGWReferenceInput,
  RelatedResourceItem,
  RelatedResourcesContext,
  Topic,
  TopicInput,
} from '@/types/studyResources';
import {
  matchesTopicTag,
  passageMatchesAnyRef,
} from '@/services/studyResources/referenceMatching';
import {
  generateResourceId,
  readStudyResourcesStore,
  writeStudyResourcesStore,
} from '@/services/studyResources/studyResourceStore';

function nowIso(): string {
  return new Date().toISOString();
}

// — Commentary —

export function loadAllCommentaryNotes(): CommentaryNote[] {
  return readStudyResourcesStore().commentaryNotes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function loadCommentaryNotesForPassage(passageKey: PassageKey): CommentaryNote[] {
  return loadAllCommentaryNotes().filter((note) =>
    passageMatchesAnyRef(passageKey, note.relatedBibleRefs),
  );
}

export function getCommentaryNoteById(id: string): CommentaryNote | undefined {
  return readStudyResourcesStore().commentaryNotes.find((note) => note.id === id);
}

export function createCommentaryNote(input: CommentaryNoteInput): CommentaryNote {
  const store = readStudyResourcesStore();
  const timestamp = nowIso();
  const note: CommentaryNote = {
    id: generateResourceId(),
    ...input,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.commentaryNotes.push(note);
  writeStudyResourcesStore(store);
  return note;
}

export function updateCommentaryNote(
  id: string,
  input: CommentaryNoteInput,
): CommentaryNote {
  const store = readStudyResourcesStore();
  const index = store.commentaryNotes.findIndex((note) => note.id === id);
  if (index < 0) throw new Error(`Commentary note not found: ${id}`);
  const updated: CommentaryNote = {
    ...store.commentaryNotes[index],
    ...input,
    title: input.title.trim(),
    body: input.body.trim(),
    updatedAt: nowIso(),
  };
  store.commentaryNotes[index] = updated;
  writeStudyResourcesStore(store);
  return updated;
}

export function deleteCommentaryNote(id: string): void {
  const store = readStudyResourcesStore();
  store.commentaryNotes = store.commentaryNotes.filter((note) => note.id !== id);
  writeStudyResourcesStore(store);
}

// — EGW References —

export function loadAllEgwReferences(): EGWReference[] {
  return readStudyResourcesStore().egwReferences.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function loadEgwReferencesForPassage(passageKey: PassageKey): EGWReference[] {
  return loadAllEgwReferences().filter((ref) =>
    passageMatchesAnyRef(passageKey, ref.relatedBibleRefs),
  );
}

export function getEgwReferenceById(id: string): EGWReference | undefined {
  return readStudyResourcesStore().egwReferences.find((ref) => ref.id === id);
}

export function createEgwReference(input: EGWReferenceInput): EGWReference {
  const store = readStudyResourcesStore();
  const timestamp = nowIso();
  const ref: EGWReference = {
    id: generateResourceId(),
    ...input,
    title: input.title.trim(),
    sourceWork: input.sourceWork.trim(),
    citation: input.citation.trim(),
    excerpt: input.excerpt.trim(),
    fullTextLink: input.fullTextLink.trim(),
    source: input.source.trim(),
    licenseInfo: input.licenseInfo.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.egwReferences.push(ref);
  writeStudyResourcesStore(store);
  return ref;
}

export function updateEgwReference(id: string, input: EGWReferenceInput): EGWReference {
  const store = readStudyResourcesStore();
  const index = store.egwReferences.findIndex((ref) => ref.id === id);
  if (index < 0) throw new Error(`EGW reference not found: ${id}`);
  const updated: EGWReference = {
    ...store.egwReferences[index],
    ...input,
    title: input.title.trim(),
    sourceWork: input.sourceWork.trim(),
    citation: input.citation.trim(),
    excerpt: input.excerpt.trim(),
    fullTextLink: input.fullTextLink.trim(),
    source: input.source.trim(),
    licenseInfo: input.licenseInfo.trim(),
    updatedAt: nowIso(),
  };
  store.egwReferences[index] = updated;
  writeStudyResourcesStore(store);
  return updated;
}

export function deleteEgwReference(id: string): void {
  const store = readStudyResourcesStore();
  store.egwReferences = store.egwReferences.filter((ref) => ref.id !== id);
  writeStudyResourcesStore(store);
}

// — Topics —

export function loadAllTopics(): Topic[] {
  return readStudyResourcesStore().topics.sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export function loadTopicsForPassage(passageKey: PassageKey): Topic[] {
  return loadAllTopics().filter((topic) =>
    passageMatchesAnyRef(passageKey, topic.relatedBibleRefs),
  );
}

export function getTopicById(id: string): Topic | undefined {
  return readStudyResourcesStore().topics.find((topic) => topic.id === id);
}

export function createTopic(input: TopicInput): Topic {
  const store = readStudyResourcesStore();
  const timestamp = nowIso();
  const topic: Topic = {
    id: generateResourceId(),
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.topics.push(topic);
  writeStudyResourcesStore(store);
  return topic;
}

export function updateTopic(id: string, input: TopicInput): Topic {
  const store = readStudyResourcesStore();
  const index = store.topics.findIndex((topic) => topic.id === id);
  if (index < 0) throw new Error(`Topic not found: ${id}`);
  const updated: Topic = {
    ...store.topics[index],
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    updatedAt: nowIso(),
  };
  store.topics[index] = updated;
  writeStudyResourcesStore(store);
  return updated;
}

export function deleteTopic(id: string): void {
  const store = readStudyResourcesStore();
  store.topics = store.topics.filter((topic) => topic.id !== id);
  writeStudyResourcesStore(store);
}

// — Charts —

export function loadAllCharts(): ChartResource[] {
  return readStudyResourcesStore().charts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function loadChartsForPassage(passageKey: PassageKey): ChartResource[] {
  return loadAllCharts().filter((chart) =>
    passageMatchesAnyRef(passageKey, chart.relatedBibleRefs),
  );
}

export function getChartById(id: string): ChartResource | undefined {
  return readStudyResourcesStore().charts.find((chart) => chart.id === id);
}

export function createChart(input: ChartResourceInput): ChartResource {
  const store = readStudyResourcesStore();
  const timestamp = nowIso();
  const chart: ChartResource = {
    id: generateResourceId(),
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type.trim(),
    imagePath: input.imagePath.trim(),
    chartData: input.chartData.trim(),
    source: input.source.trim(),
    licenseInfo: input.licenseInfo.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.charts.push(chart);
  writeStudyResourcesStore(store);
  return chart;
}

export function updateChart(id: string, input: ChartResourceInput): ChartResource {
  const store = readStudyResourcesStore();
  const index = store.charts.findIndex((chart) => chart.id === id);
  if (index < 0) throw new Error(`Chart not found: ${id}`);
  const updated: ChartResource = {
    ...store.charts[index],
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type.trim(),
    imagePath: input.imagePath.trim(),
    chartData: input.chartData.trim(),
    source: input.source.trim(),
    licenseInfo: input.licenseInfo.trim(),
    updatedAt: nowIso(),
  };
  store.charts[index] = updated;
  writeStudyResourcesStore(store);
  return updated;
}

export function deleteChart(id: string): void {
  const store = readStudyResourcesStore();
  store.charts = store.charts.filter((chart) => chart.id !== id);
  writeStudyResourcesStore(store);
}

// — Related resources —

export function getRelatedResources(
  context: RelatedResourcesContext,
): RelatedResourceItem[] {
  const items: RelatedResourceItem[] = [];
  const { passageKey, topicId } = context;
  const topic = topicId ? getTopicById(topicId) : undefined;

  const commentaryNotes = loadAllCommentaryNotes();
  const egwRefs = loadAllEgwReferences();
  const topics = loadAllTopics();
  const charts = loadAllCharts();

  if (passageKey) {
    for (const note of commentaryNotes) {
      if (passageMatchesAnyRef(passageKey, note.relatedBibleRefs)) {
        items.push({ kind: 'commentary', id: note.id, title: note.title });
      }
    }
    for (const ref of egwRefs) {
      if (passageMatchesAnyRef(passageKey, ref.relatedBibleRefs)) {
        items.push({
          kind: 'egw',
          id: ref.id,
          title: ref.title,
          subtitle: ref.citation,
        });
      }
    }
    for (const t of topics) {
      if (passageMatchesAnyRef(passageKey, t.relatedBibleRefs)) {
        items.push({ kind: 'topic', id: t.id, title: t.title });
      }
    }
    for (const chart of charts) {
      if (passageMatchesAnyRef(passageKey, chart.relatedBibleRefs)) {
        items.push({
          kind: 'chart',
          id: chart.id,
          title: chart.title,
          subtitle: chart.type,
        });
      }
    }
  }

  if (topic) {
    for (const note of commentaryNotes) {
      if (
        topic.relatedCommentaryNotes.includes(note.id) ||
        matchesTopicTag(note.relatedTopics, topic)
      ) {
        if (!items.some((i) => i.kind === 'commentary' && i.id === note.id)) {
          items.push({ kind: 'commentary', id: note.id, title: note.title });
        }
      }
    }
    for (const ref of egwRefs) {
      if (
        topic.relatedEGWRefs.includes(ref.id) ||
        matchesTopicTag(ref.relatedTopics, topic)
      ) {
        if (!items.some((i) => i.kind === 'egw' && i.id === ref.id)) {
          items.push({
            kind: 'egw',
            id: ref.id,
            title: ref.title,
            subtitle: ref.citation,
          });
        }
      }
    }
    for (const chart of charts) {
      if (
        topic.relatedCharts.includes(chart.id) ||
        matchesTopicTag(chart.relatedTopics, topic)
      ) {
        if (!items.some((i) => i.kind === 'chart' && i.id === chart.id)) {
          items.push({
            kind: 'chart',
            id: chart.id,
            title: chart.title,
            subtitle: chart.type,
          });
        }
      }
    }
    for (const t of topics) {
      if (t.id !== topic.id && matchesTopicTag([topic.title], t)) {
        if (!items.some((i) => i.kind === 'topic' && i.id === t.id)) {
          items.push({ kind: 'topic', id: t.id, title: t.title });
        }
      }
    }
  }

  return items;
}
