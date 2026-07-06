import { ChevronDown } from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import {
  HOW_TO_STUDY_NAV,
  findArticleAnchorId,
  type HowToStudyNavGroup,
} from '@/data/study/howToStudyNav';
import './HowToStudyNav.css';

interface HowToStudyNavProps {
  headingIds: Map<string, string>;
  onNavigate: (anchorId: string) => void;
}

function isSingleItemGroup(group: HowToStudyNavGroup): boolean {
  return group.items.length === 1;
}

export function HowToStudyNav({ headingIds, onNavigate }: HowToStudyNavProps) {
  const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(() => new Set(['part-1']));
  const baseId = useId();

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroupIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const handleNavigate = useCallback(
    (targetHeading: string) => {
      onNavigate(findArticleAnchorId(targetHeading, headingIds));
    },
    [headingIds, onNavigate],
  );

  return (
    <nav
      className="how-to-study-nav"
      aria-label="How to Study the Bible — section index"
    >
      <p className="how-to-study-nav__title">Index</p>
      <ul className="how-to-study-nav__list">
        {HOW_TO_STUDY_NAV.map((group) => {
          const isOpen = openGroupIds.has(group.id);
          const single = isSingleItemGroup(group);
          const sectionId = `${baseId}-${group.id}`;

          if (single) {
            const item = group.items[0];
            return (
              <li key={group.id} className="how-to-study-nav__item">
                <button
                  type="button"
                  className="how-to-study-nav__link"
                  onClick={() => handleNavigate(item.targetHeading)}
                >
                  {group.label}
                </button>
              </li>
            );
          }

          return (
            <li
              key={group.id}
              className={
                isOpen
                  ? 'how-to-study-nav__item how-to-study-nav__item--open'
                  : 'how-to-study-nav__item'
              }
            >
              <button
                type="button"
                className="how-to-study-nav__section"
                aria-expanded={isOpen}
                aria-controls={sectionId}
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.label}</span>
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="how-to-study-nav__chevron"
                />
              </button>
              <ul id={sectionId} className="how-to-study-nav__chapters">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="how-to-study-nav__chapter"
                      onClick={() => handleNavigate(item.targetHeading)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
