import { BookMarked, ScrollText, Tags, BarChart3 } from 'lucide-react';
import type { PassageKey } from '@/types/study';
import type {
  ChartResource,
  ChartResourceInput,
  CommentaryNote,
  CommentaryNoteInput,
  EGWReference,
  EGWReferenceInput,
  Topic,
  TopicInput,
} from '@/types/studyResources';
import {
  createChart,
  createCommentaryNote,
  createEgwReference,
  createTopic,
  deleteChart,
  deleteCommentaryNote,
  deleteEgwReference,
  deleteTopic,
  getChartById,
  getCommentaryNoteById,
  getEgwReferenceById,
  getTopicById,
  loadAllCharts,
  loadAllCommentaryNotes,
  loadAllEgwReferences,
  loadAllTopics,
  loadChartsForPassage,
  loadCommentaryNotesForPassage,
  loadEgwReferencesForPassage,
  loadTopicsForPassage,
  updateChart,
  updateCommentaryNote,
  updateEgwReference,
  updateTopic,
} from '@/services/studyResources/studyResourceService';
import {
  formatListInput,
  parseListInput,
} from '@/services/studyResources/referenceMatching';
import {
  CHART_FIELDS,
  COMMENTARY_NOTE_FIELDS,
  EGW_REFERENCE_FIELDS,
  TOPIC_FIELDS,
} from './resourceFieldConfigs';
import { StudyResourcePanel } from './StudyResourcePanel';

function listToDraft(values: string[]): string {
  return formatListInput(values);
}

function draftToList(value: string): string[] {
  return parseListInput(value);
}

const commentaryDraftHelpers = {
  toDraft: (item: CommentaryNote) => ({
    title: item.title,
    body: item.body,
    relatedBibleRefs: listToDraft(item.relatedBibleRefs),
    relatedTopics: listToDraft(item.relatedTopics),
    relatedStudyGuides: listToDraft(item.relatedStudyGuides),
  }),
  fromDraft: (draft: Record<string, string>): CommentaryNoteInput => ({
    title: draft.title,
    body: draft.body,
    relatedBibleRefs: draftToList(draft.relatedBibleRefs),
    relatedTopics: draftToList(draft.relatedTopics),
    relatedStudyGuides: draftToList(draft.relatedStudyGuides),
  }),
  toDetailRows: (item: CommentaryNote) => [
    { label: 'Body', value: item.body },
    { label: 'Bible References', value: listToDraft(item.relatedBibleRefs) },
    { label: 'Topics', value: listToDraft(item.relatedTopics) },
    { label: 'Study Guides', value: listToDraft(item.relatedStudyGuides) },
  ],
  seedDraft: (passageKey: PassageKey) => ({
    title: '',
    body: '',
    relatedBibleRefs: passageKey,
    relatedTopics: '',
    relatedStudyGuides: '',
  }),
};

const egwDraftHelpers = {
  toDraft: (item: EGWReference) => ({
    title: item.title,
    sourceWork: item.sourceWork,
    citation: item.citation,
    excerpt: item.excerpt,
    fullTextLink: item.fullTextLink,
    relatedBibleRefs: listToDraft(item.relatedBibleRefs),
    relatedTopics: listToDraft(item.relatedTopics),
    relatedStudyGuides: listToDraft(item.relatedStudyGuides),
    source: item.source,
    licenseInfo: item.licenseInfo,
  }),
  fromDraft: (draft: Record<string, string>): EGWReferenceInput => ({
    title: draft.title,
    sourceWork: draft.sourceWork,
    citation: draft.citation,
    excerpt: draft.excerpt,
    fullTextLink: draft.fullTextLink,
    relatedBibleRefs: draftToList(draft.relatedBibleRefs),
    relatedTopics: draftToList(draft.relatedTopics),
    relatedStudyGuides: draftToList(draft.relatedStudyGuides),
    source: draft.source,
    licenseInfo: draft.licenseInfo,
  }),
  toDetailRows: (item: EGWReference) => [
    { label: 'Source Work', value: item.sourceWork },
    { label: 'Citation', value: item.citation },
    { label: 'Excerpt / Notes', value: item.excerpt },
    { label: 'Full Text Link', value: item.fullTextLink },
    { label: 'Bible References', value: listToDraft(item.relatedBibleRefs) },
    { label: 'Topics', value: listToDraft(item.relatedTopics) },
    { label: 'Study Guides', value: listToDraft(item.relatedStudyGuides) },
    { label: 'Source', value: item.source },
    { label: 'License', value: item.licenseInfo },
  ],
  seedDraft: (passageKey: PassageKey) => ({
    title: '',
    sourceWork: '',
    citation: '',
    excerpt: '',
    fullTextLink: '',
    relatedBibleRefs: passageKey,
    relatedTopics: '',
    relatedStudyGuides: '',
    source: 'User entry',
    licenseInfo: 'Verify license before importing copyrighted text',
  }),
};

const topicDraftHelpers = {
  toDraft: (item: Topic) => ({
    title: item.title,
    description: item.description,
    relatedBibleRefs: listToDraft(item.relatedBibleRefs),
    relatedCommentaryNotes: listToDraft(item.relatedCommentaryNotes),
    relatedEGWRefs: listToDraft(item.relatedEGWRefs),
    relatedCharts: listToDraft(item.relatedCharts),
    relatedMaps: listToDraft(item.relatedMaps),
    relatedTimelines: listToDraft(item.relatedTimelines),
    relatedStudyGuides: listToDraft(item.relatedStudyGuides),
  }),
  fromDraft: (draft: Record<string, string>): TopicInput => ({
    title: draft.title,
    description: draft.description,
    relatedBibleRefs: draftToList(draft.relatedBibleRefs),
    relatedCommentaryNotes: draftToList(draft.relatedCommentaryNotes),
    relatedEGWRefs: draftToList(draft.relatedEGWRefs),
    relatedCharts: draftToList(draft.relatedCharts),
    relatedMaps: draftToList(draft.relatedMaps),
    relatedTimelines: draftToList(draft.relatedTimelines),
    relatedStudyGuides: draftToList(draft.relatedStudyGuides),
  }),
  toDetailRows: (item: Topic) => [
    { label: 'Description', value: item.description },
    { label: 'Bible References', value: listToDraft(item.relatedBibleRefs) },
    { label: 'Commentary Notes', value: listToDraft(item.relatedCommentaryNotes) },
    { label: 'EGW References', value: listToDraft(item.relatedEGWRefs) },
    { label: 'Charts', value: listToDraft(item.relatedCharts) },
    { label: 'Maps (future)', value: listToDraft(item.relatedMaps) },
    { label: 'Timelines (future)', value: listToDraft(item.relatedTimelines) },
    { label: 'Study Guides', value: listToDraft(item.relatedStudyGuides) },
  ],
  seedDraft: (passageKey: PassageKey) => ({
    title: '',
    description: '',
    relatedBibleRefs: passageKey,
    relatedCommentaryNotes: '',
    relatedEGWRefs: '',
    relatedCharts: '',
    relatedMaps: '',
    relatedTimelines: '',
    relatedStudyGuides: '',
  }),
};

const chartDraftHelpers = {
  toDraft: (item: ChartResource) => ({
    title: item.title,
    description: item.description,
    type: item.type,
    imagePath: item.imagePath,
    chartData: item.chartData,
    relatedBibleRefs: listToDraft(item.relatedBibleRefs),
    relatedTopics: listToDraft(item.relatedTopics),
    relatedStudyGuides: listToDraft(item.relatedStudyGuides),
    source: item.source,
    licenseInfo: item.licenseInfo,
  }),
  fromDraft: (draft: Record<string, string>): ChartResourceInput => ({
    title: draft.title,
    description: draft.description,
    type: draft.type,
    imagePath: draft.imagePath,
    chartData: draft.chartData,
    relatedBibleRefs: draftToList(draft.relatedBibleRefs),
    relatedTopics: draftToList(draft.relatedTopics),
    relatedStudyGuides: draftToList(draft.relatedStudyGuides),
    source: draft.source,
    licenseInfo: draft.licenseInfo,
  }),
  toDetailRows: (item: ChartResource) => [
    { label: 'Description', value: item.description },
    { label: 'Type', value: item.type },
    { label: 'Image Path', value: item.imagePath },
    { label: 'Chart Data', value: item.chartData },
    { label: 'Bible References', value: listToDraft(item.relatedBibleRefs) },
    { label: 'Topics', value: listToDraft(item.relatedTopics) },
    { label: 'Study Guides', value: listToDraft(item.relatedStudyGuides) },
    { label: 'Source', value: item.source },
    { label: 'License', value: item.licenseInfo },
  ],
  seedDraft: (passageKey: PassageKey) => ({
    title: '',
    description: '',
    type: '',
    imagePath: '',
    chartData: '',
    relatedBibleRefs: passageKey,
    relatedTopics: '',
    relatedStudyGuides: '',
    source: 'User-created',
    licenseInfo: 'Verify license before importing chart images',
  }),
};

interface CommentaryNotesPanelProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function CommentaryNotesPanel({
  passageKey,
  passageLabel,
  headerSlot,
}: CommentaryNotesPanelProps) {
  return (
    <StudyResourcePanel<CommentaryNote, CommentaryNoteInput>
      title="My Commentary"
      hint={`Personal commentary notes for ${passageLabel} and related passages.`}
      passageKey={passageKey}
      filterByPassage
      emptyIcon={<BookMarked size={22} strokeWidth={1.75} />}
      emptyTitle="No Commentary Notes"
      emptyMessage={`Add your own commentary for ${passageLabel}. Tag Bible references to connect notes across passages.`}
      newLabel="Add Commentary"
      fields={COMMENTARY_NOTE_FIELDS}
      listFields={['body']}
      loadAll={loadAllCommentaryNotes}
      loadForPassage={loadCommentaryNotesForPassage}
      getById={getCommentaryNoteById}
      create={createCommentaryNote}
      update={updateCommentaryNote}
      remove={deleteCommentaryNote}
      headerSlot={headerSlot}
      {...commentaryDraftHelpers}
    />
  );
}

interface EgwReferencesPanelProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function EgwReferencesPanel({
  passageKey,
  passageLabel,
  headerSlot,
}: EgwReferencesPanelProps) {
  return (
    <StudyResourcePanel<EGWReference, EGWReferenceInput>
      title="My Ellen White References"
      hint={`Manually entered Ellen G. White references for ${passageLabel}. Do not import unlicensed text.`}
      passageKey={passageKey}
      filterByPassage
      emptyIcon={<ScrollText size={22} strokeWidth={1.75} />}
      emptyTitle="No EGW References"
      emptyMessage={`Add Ellen White references with citation, excerpt notes, and license information for ${passageLabel}.`}
      newLabel="Add Reference"
      fields={EGW_REFERENCE_FIELDS}
      listFields={['citation', 'excerpt']}
      loadAll={loadAllEgwReferences}
      loadForPassage={loadEgwReferencesForPassage}
      getById={getEgwReferenceById}
      create={createEgwReference}
      update={updateEgwReference}
      remove={deleteEgwReference}
      headerSlot={headerSlot}
      {...egwDraftHelpers}
    />
  );
}

interface TopicsPanelProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function TopicsPanel({
  passageKey,
  passageLabel,
  headerSlot,
}: TopicsPanelProps) {
  return (
    <StudyResourcePanel<Topic, TopicInput>
      title="Topics"
      hint="Doctrine and theme hubs that connect Bible references, commentary, Ellen White references, charts, and study guides."
      passageKey={passageKey}
      filterByPassage={false}
      emptyIcon={<Tags size={22} strokeWidth={1.75} />}
      emptyTitle="No Topics Yet"
      emptyMessage={`Create topics such as Sabbath, Sanctuary, or Second Coming. Tag ${passageLabel} to surface them in context.`}
      newLabel="Add Topic"
      fields={TOPIC_FIELDS}
      listFields={['description']}
      loadAll={loadAllTopics}
      loadForPassage={loadTopicsForPassage}
      getById={getTopicById}
      create={createTopic}
      update={updateTopic}
      remove={deleteTopic}
      headerSlot={headerSlot}
      {...topicDraftHelpers}
    />
  );
}

interface ChartsPanelProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function ChartsPanel({ passageKey, passageLabel, headerSlot }: ChartsPanelProps) {
  return (
    <StudyResourcePanel<ChartResource, ChartResourceInput>
      title="Charts"
      hint="Prophecy charts, sanctuary diagrams, and visual study aids. Use local image paths only."
      passageKey={passageKey}
      filterByPassage={false}
      emptyIcon={<BarChart3 size={22} strokeWidth={1.75} />}
      emptyTitle="No Charts Yet"
      emptyMessage={`Add charts and visual aids related to ${passageLabel}. Include source and license notes.`}
      newLabel="Add Chart"
      fields={CHART_FIELDS}
      listFields={['description', 'type']}
      loadAll={loadAllCharts}
      loadForPassage={loadChartsForPassage}
      getById={getChartById}
      create={createChart}
      update={updateChart}
      remove={deleteChart}
      headerSlot={headerSlot}
      {...chartDraftHelpers}
    />
  );
}
