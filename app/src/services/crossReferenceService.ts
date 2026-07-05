import type {
  CrossReference,
  CrossReferenceInput,
} from '@/types/crossReferences';
import type { PassageKey } from '@/types/study';

const STORAGE_KEY = 'nomomartyria-cross-references-v1';

interface CrossReferenceStore {
  version: 1;
  references: CrossReference[];
}

export interface CrossReferenceRepository {
  loadAll(): CrossReference[];
  saveAll(references: CrossReference[]): void;
}

class LocalStorageCrossReferenceRepository implements CrossReferenceRepository {
  loadAll(): CrossReference[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CrossReferenceStore;
      if (parsed.version !== 1 || !Array.isArray(parsed.references)) return [];
      return parsed.references;
    } catch {
      return [];
    }
  }

  saveAll(references: CrossReference[]): void {
    const store: CrossReferenceStore = { version: 1, references };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

let repository: CrossReferenceRepository =
  new LocalStorageCrossReferenceRepository();

export function setCrossReferenceRepository(
  next: CrossReferenceRepository,
): void {
  repository = next;
}

function readAll(): CrossReference[] {
  return repository.loadAll();
}

function writeAll(references: CrossReference[]): void {
  repository.saveAll(references);
}

function generateId(): string {
  return crypto.randomUUID();
}

export function formatTargetReference(
  book: string,
  chapter: number,
  verse: number | null,
): string {
  if (verse !== null) {
    return `${book} ${chapter}:${verse}`;
  }
  return `${book} ${chapter}`;
}

export function loadCrossReferencesForSource(
  sourceReference: PassageKey,
): CrossReference[] {
  return readAll()
    .filter((ref) => ref.sourceReference === sourceReference)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function createCrossReference(
  input: CrossReferenceInput,
): CrossReference {
  const targetReference = formatTargetReference(
    input.targetBook,
    input.targetChapter,
    input.targetVerse,
  );

  const duplicate = readAll().some(
    (ref) =>
      ref.sourceReference === input.sourceReference &&
      ref.targetReference === targetReference,
  );
  if (duplicate) {
    throw new Error(
      `Cross reference already exists: ${input.sourceReference} → ${targetReference}`,
    );
  }

  const now = new Date().toISOString();
  const reference: CrossReference = {
    id: generateId(),
    sourceReference: input.sourceReference,
    targetReference,
    targetBook: input.targetBook,
    targetChapter: input.targetChapter,
    targetVerse: input.targetVerse,
    label: input.label?.trim() ?? '',
    createdAt: now,
    updatedAt: now,
  };

  const references = readAll();
  references.push(reference);
  writeAll(references);
  return reference;
}

export function deleteCrossReference(id: string): void {
  writeAll(readAll().filter((ref) => ref.id !== id));
}
