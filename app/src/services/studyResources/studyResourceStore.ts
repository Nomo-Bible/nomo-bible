import type {
  ChartResource,
  CommentaryNote,
  EGWReference,
  Topic,
} from '@/types/studyResources';

const STORAGE_KEY = 'nomomartyria-study-resources-v1';

export interface StudyResourcesStore {
  version: 1;
  commentaryNotes: CommentaryNote[];
  egwReferences: EGWReference[];
  topics: Topic[];
  charts: ChartResource[];
}

const EMPTY_STORE: StudyResourcesStore = {
  version: 1,
  commentaryNotes: [],
  egwReferences: [],
  topics: [],
  charts: [],
};

export interface StudyResourcesRepository {
  load(): StudyResourcesStore;
  save(store: StudyResourcesStore): void;
}

class LocalStorageStudyResourcesRepository implements StudyResourcesRepository {
  load(): StudyResourcesStore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...EMPTY_STORE };
      const parsed = JSON.parse(raw) as StudyResourcesStore;
      if (parsed.version !== 1) return { ...EMPTY_STORE };
      return {
        version: 1,
        commentaryNotes: Array.isArray(parsed.commentaryNotes)
          ? parsed.commentaryNotes
          : [],
        egwReferences: Array.isArray(parsed.egwReferences) ? parsed.egwReferences : [],
        topics: Array.isArray(parsed.topics) ? parsed.topics : [],
        charts: Array.isArray(parsed.charts) ? parsed.charts : [],
      };
    } catch {
      return { ...EMPTY_STORE };
    }
  }

  save(store: StudyResourcesStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

let repository: StudyResourcesRepository = new LocalStorageStudyResourcesRepository();

export function setStudyResourcesRepository(next: StudyResourcesRepository): void {
  repository = next;
}

export function readStudyResourcesStore(): StudyResourcesStore {
  return repository.load();
}

export function writeStudyResourcesStore(store: StudyResourcesStore): void {
  repository.save(store);
}

export function generateResourceId(): string {
  return crypto.randomUUID();
}
