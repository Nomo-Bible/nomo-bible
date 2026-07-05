import type { StudyNote } from '@/types/study';
import './StudyNoteDetail.css';

interface StudyNoteDetailProps {
  note: StudyNote;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function StudyNoteDetail({ note }: StudyNoteDetailProps) {
  return (
    <article className="study-note-detail" aria-label={`Study note: ${note.title}`}>
      <header className="study-note-detail__header">
        <h3 className="study-note-detail__title">{note.title}</h3>
        <time className="study-note-detail__date" dateTime={note.updatedAt}>
          Updated {formatDate(note.updatedAt)}
        </time>
      </header>

      {note.tags.length > 0 && (
        <ul className="study-note-detail__tags" aria-label="Tags">
          {note.tags.map((tag) => (
            <li key={tag} className="study-note-detail__tag">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {note.body ? (
        <div className="study-note-detail__body">
          {note.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="study-note-detail__empty">No body text.</p>
      )}
    </article>
  );
}
