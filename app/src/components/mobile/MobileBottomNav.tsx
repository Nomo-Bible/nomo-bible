import { BookOpen, Bookmark, MoreHorizontal, NotebookPen, Search } from 'lucide-react';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import './mobile-v3.css';

export type MobileBottomNavId = 'bible' | 'search' | 'notes' | 'bookmarks' | 'more';

interface MobileBottomNavProps {
  active: MobileBottomNavId;
  onSelect: (id: MobileBottomNavId) => void;
}

const ITEMS: { id: MobileBottomNavId; label: string; Icon: typeof BookOpen }[] = [
  { id: 'bible', label: 'Bible', Icon: BookOpen },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'notes', label: 'Notes', Icon: NotebookPen },
  { id: 'bookmarks', label: 'Bookmarks', Icon: Bookmark },
  { id: 'more', label: 'More', Icon: MoreHorizontal },
];

export function MobileBottomNav({ active, onSelect }: MobileBottomNavProps) {
  return (
    <nav className="mobile-v3-bottom-nav" aria-label="Workspace navigation">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={
            active === id
              ? 'mobile-v3-bottom-nav__btn mobile-v3-bottom-nav__btn--active'
              : 'mobile-v3-bottom-nav__btn'
          }
          onClick={() => onSelect(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export const MORE_TAB_OPTIONS: { id: StudyWorkspaceTabId; label: string }[] = [
  { id: 'topics', label: 'Topics' },
  { id: 'how-to-study', label: 'How to Study' },
  { id: 'charts', label: 'Charts' },
];

interface MobileMoreSheetProps {
  open: boolean;
  onClose: () => void;
  onSelectTab: (tabId: StudyWorkspaceTabId) => void;
}

export function MobileMoreSheet({ open, onClose, onSelectTab }: MobileMoreSheetProps) {
  if (!open) return null;

  return (
    <div className="mobile-v3-more" role="presentation">
      <button
        type="button"
        className="mobile-v3-more__backdrop"
        onClick={onClose}
        aria-label="Close more menu"
      />
      <div className="mobile-v3-more__panel" role="dialog" aria-label="More study tools">
        <p className="mobile-v3-more__title">More tools</p>
        <ul className="mobile-v3-more__list">
          {MORE_TAB_OPTIONS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="mobile-v3-more__item"
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
