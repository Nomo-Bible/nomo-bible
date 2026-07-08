import type { StudyNote } from '@/types/study';
import { noteExcerpt } from './StudyNoteDetail';
import './StudyNotesList.css';

interface StudyNotesListProps {
  notes: StudyNote[];
  selectedNoteId: string | null;
  onSelect: (noteId: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function StudyNotesList({
  notes,
  selectedNoteId,
  onSelect,
}: StudyNotesListProps) {
  return (
    <ul className="study-notes-list" aria-label="Study notes for this passage">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;
        return (
          <li key={note.id}>
            <button
              type="button"
              className={
                isSelected
                  ? 'study-notes-list__item study-notes-list__item--selected'
                  : 'study-notes-list__item'
              }
              onClick={() => onSelect(note.id)}
              aria-current={isSelected ? 'true' : undefined}
            >
              <span className="study-notes-list__title">{note.title}</span>
              {note.body && (
                <span className="study-notes-list__excerpt">
                  {noteExcerpt(note.body)}
                </span>
              )}
              <span className="study-notes-list__meta">
                {formatDate(note.updatedAt)}
                {note.tags.length > 0 && (
                  <span className="study-notes-list__tags">
                    {note.tags.join(' · ')}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
