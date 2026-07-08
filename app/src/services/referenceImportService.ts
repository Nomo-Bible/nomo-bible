import { createNote, updateNote, getNoteById } from '@/services/studyNotesService';
import { isNoteHtml, plainTextToNoteHtml } from '@/utils/noteContent';
import type {
  CommentaryEntry,
  EllenWhiteReferenceEntry,
  PublicCrossReference,
} from '@/types/referenceProviders';
import type { PassageKey, StudyNote } from '@/types/study';

function block(title: string, lines: string[]): string {
  return [`## ${title}`, ...lines, ''].join('\n');
}

export function formatCrossReferenceForNote(
  entry: PublicCrossReference,
  sourcePassage: PassageKey,
): string {
  return block('Cross Reference', [
    `From: ${sourcePassage}`,
    `To: ${entry.targetReference}`,
    entry.note ? `Note: ${entry.note}` : '',
    `Source: ${entry.sourceName}`,
  ].filter(Boolean));
}

export function formatCommentaryForNote(entry: CommentaryEntry): string {
  const lines = [
    `Reference: ${entry.reference}`,
    `Source: ${entry.sourceName}`,
    entry.summary ? `Summary: ${entry.summary}` : '',
    entry.excerpt && entry.textEmbedded
      ? `Excerpt: ${entry.excerpt}`
      : '',
    `License: ${entry.license}`,
    entry.attribution ? `Attribution: ${entry.attribution}` : '',
    `Link: ${entry.externalUrl}`,
  ].filter(Boolean);

  return block(`${entry.sourceName} — ${entry.reference}`, lines);
}

export function formatEllenWhiteReferenceForNote(
  entry: EllenWhiteReferenceEntry,
): string {
  return block(`EGW Reference — ${entry.egwReference}`, [
    `Verse: ${entry.verseReference}`,
    `Summary: ${entry.summary}`,
    `Citation: ${entry.egwReference}`,
    entry.licenseNote,
    `Link: ${entry.externalUrl}`,
    `Attribution: ${entry.attribution}`,
  ]);
}

export function insertReferenceAsNewNote(
  passageKey: PassageKey,
  title: string,
  body: string,
  tags: string[] = ['reference-import'],
): StudyNote {
  return createNote({ passageKey, title, body, tags });
}

export function appendReferenceToNote(noteId: string, blockText: string): StudyNote {
  const existing = getNoteById(noteId);
  if (!existing) {
    throw new Error(`Study note not found: ${noteId}`);
  }

  const separator = existing.body.trim()
    ? isNoteHtml(existing.body)
      ? '<hr>'
      : '\n\n---\n\n'
    : '';
  const appended = isNoteHtml(existing.body)
    ? plainTextToNoteHtml(blockText)
    : blockText.trim();

  return updateNote(noteId, {
    title: existing.title,
    body: `${existing.body.trim()}${separator}${appended}`,
    tags: existing.tags,
  });
}
