import type { StudyNote } from '@/types/study';
import {
  isNoteHtml,
  sanitizeNoteHtml,
} from '@/utils/noteContent';
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

function renderNoteBody(body: string) {
  if (!body.trim()) return null;

  if (isNoteHtml(body)) {
    const html = sanitizeNoteHtml(body);
    return (
      <div
        className="study-note-detail__body study-note-detail__body--rich"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="study-note-detail__body">
      {body.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export function StudyNoteDetail({ note }: StudyNoteDetailProps) {
  const bodyContent = renderNoteBody(note.body);

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

      {bodyContent ?? <p className="study-note-detail__empty">No body text.</p>}
    </article>
  );
}

export function noteExcerpt(body: string, maxLength = 90): string {
  if (!body) return '';
  const plain = isNoteHtml(body)
    ? body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : body.replace(/\s+/g, ' ').trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
}
