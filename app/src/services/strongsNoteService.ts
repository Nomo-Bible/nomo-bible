import { createNote } from '@/services/studyNotesService';
import type { PassageKey, StudyNote } from '@/types/study';
import type { StrongsEntry } from '@/types/strongs';

export function formatWordStudyNoteBody(
  word: string,
  referenceLabel: string,
  entry: StrongsEntry | null,
): string {
  const timestamp = new Date().toLocaleString();
  const lines = [
    "Strong's Word Study",
    `Word: ${word}`,
    `Reference: ${referenceLabel}`,
  ];

  if (entry) {
    lines.push(`Strong's Number: ${entry.strongsNumber}`);
    if (entry.originalWord) {
      lines.push(`Original Word: ${entry.originalWord}`);
    }
    if (entry.transliteration) {
      lines.push(`Transliteration: ${entry.transliteration}`);
    }
    lines.push(`Definition: ${entry.definition}`);
    lines.push(`Source: ${entry.source}`);
  } else {
    lines.push("Strong's Number: —");
    lines.push('Definition: —');
    lines.push('Source: —');
  }

  lines.push(`Added: ${timestamp}`);
  return lines.join('\n');
}

export function insertWordStudyIntoStudyNotes(
  passageKey: PassageKey,
  word: string,
  referenceLabel: string,
  entry: StrongsEntry | null,
): StudyNote {
  const title = entry
    ? `${word} — ${entry.strongsNumber}`
    : `${word} — ${referenceLabel}`;

  return createNote({
    passageKey,
    title,
    body: formatWordStudyNoteBody(word, referenceLabel, entry),
    tags: entry ? ['strongs', 'word-study'] : ['word-study'],
  });
}

export function formatStrongsNoteBody(entry: StrongsEntry): string {
  const timestamp = new Date().toLocaleString();
  return [
    "Strong's Word Study",
    `Strong's Number: ${entry.strongsNumber}`,
    `Original Word: ${entry.originalWord}`,
    `Transliteration: ${entry.transliteration}`,
    `Definition: ${entry.definition}`,
    `KJV Usage: ${entry.kjvUsage}`,
    `Source: ${entry.source}`,
    `Added: ${timestamp}`,
  ].join('\n');
}

export function insertStrongsIntoStudyNotes(
  passageKey: PassageKey,
  entry: StrongsEntry,
): StudyNote {
  return createNote({
    passageKey,
    title: `${entry.strongsNumber} — ${entry.transliteration || entry.originalWord}`,
    body: formatStrongsNoteBody(entry),
    tags: ['strongs', 'word-study'],
  });
}
