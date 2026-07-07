import { BookOpen } from 'lucide-react';
import type { PassageKey } from '@/types/study';
import type { StudyNote } from '@/types/study';
import { loadNotesForPassage } from '@/services/studyNotesService';
import { EmptyState } from '@/components/workspace/EmptyState';
import './studyResources.css';

interface MyNotesLibrarySectionProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
  onOpenStudyNotes?: () => void;
  onSelectNote?: (noteId: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MyNotesLibrarySection({
  passageKey,
  passageLabel,
  headerSlot,
  onOpenStudyNotes,
  onSelectNote,
}: MyNotesLibrarySectionProps) {
  const notes = loadNotesForPassage(passageKey);

  return (
    <div className="catalog-library-section">
      {headerSlot}
      <section aria-label="Study notes for this passage">
        <div className="catalog-library-section__toolbar">
          <h3 className="catalog-library-section__heading">My Notes</h3>
          {onOpenStudyNotes ? (
            <button type="button" className="catalog-resource-card__btn" onClick={onOpenStudyNotes}>
              Open Study Notes Tab
            </button>
          ) : null}
        </div>
        <p className="catalog-library-section__intro">
          Personal study notes for {passageLabel}. Notes created from commentary, Ellen White
          references, and cross references appear here.
        </p>
        {notes.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={22} strokeWidth={1.75} />}
            title="No Notes for This Passage"
            message={`Create notes in the Study Notes tab, or insert references from Commentary and Ellen White sections.`}
            actionLabel={onOpenStudyNotes ? 'Go to Study Notes' : undefined}
            onAction={onOpenStudyNotes}
          />
        ) : (
          <ul className="study-resource-list" aria-label="Notes for this passage">
            {notes.map((note: StudyNote) => (
              <li key={note.id}>
                <button
                  type="button"
                  className="study-resource-list__item"
                  onClick={() => onSelectNote?.(note.id)}
                >
                  <span className="study-resource-list__title">{note.title}</span>
                  {note.body ? (
                    <span className="study-resource-list__excerpt">
                      {note.body.length > 100 ? `${note.body.slice(0, 100)}…` : note.body}
                    </span>
                  ) : null}
                  <span className="study-resource-list__meta">{formatDate(note.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
