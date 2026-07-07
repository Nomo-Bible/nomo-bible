import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { getHowToStudySectionMarkdown } from '@/data/study/howToStudyContent';
import {
  HOW_TO_STUDY_MOBILE_SECTIONS,
  getHowToStudyMobileSection,
  getHowToStudySectionNeighbors,
} from '@/data/study/howToStudyMobileSections';import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import './HowToStudyMobilePanel.css';
import './HowToStudyMobileArticle.css';

function resolveSectionMarkdown(sectionId: string): string {
  const section = getHowToStudyMobileSection(sectionId);
  if (!section) {
    return `## Section unavailable\n\nThis study section could not be found. Return to the index and choose another topic.`;
  }

  const content =
    section.contentMarkdown.trim() ||
    getHowToStudySectionMarkdown(section.targetHeading)?.trim() ||
    '';

  if (content) return content;

  return `## ${section.label}\n\n[Content unavailable: this section could not be loaded from the study guide manuscript.]`;
}

interface HowToStudyMobilePanelProps {
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
}

export function HowToStudyMobilePanel({
  selectedSectionId,
  onSelectSection,
}: HowToStudyMobilePanelProps) {
  const readingRef = useRef<HTMLDivElement>(null);

  const sectionMarkdown = useMemo(
    () => (selectedSectionId ? resolveSectionMarkdown(selectedSectionId) : null),
    [selectedSectionId],
  );

  const selectedSection = selectedSectionId
    ? getHowToStudyMobileSection(selectedSectionId)
    : undefined;

  const neighbors = selectedSectionId
    ? getHowToStudySectionNeighbors(selectedSectionId)
    : { previous: undefined, next: undefined };

  useEffect(() => {
    if (!selectedSectionId) return;
    readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedSectionId]);

  const handleSectionChange = (sectionId: string) => {
    onSelectSection(sectionId);
  };

  if (!selectedSectionId || !selectedSection) {
    return (
      <div className="how-to-study-mobile">
        <header className="how-to-study-mobile__intro">
          <GraduationCap size={20} strokeWidth={1.75} aria-hidden="true" />
          <div>
            <h3 className="how-to-study-mobile__intro-title">Study Guide Index</h3>
            <p className="how-to-study-mobile__intro-text">
              Choose a section to read. Each topic opens here in your workspace while
              Scripture stays anchored below.
            </p>
          </div>
        </header>

        <ul className="how-to-study-mobile__index" aria-label="How to Study the Bible sections">
          {HOW_TO_STUDY_MOBILE_SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className="how-to-study-mobile__card"
                onClick={() => onSelectSection(section.id)}
              >
                <span className="how-to-study-mobile__card-text">
                  <span className="how-to-study-mobile__card-title">{section.label}</span>
                  <span className="how-to-study-mobile__card-summary">{section.summary}</span>
                </span>
                <ChevronRight
                  className="how-to-study-mobile__card-chevron"
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={readingRef} className="how-to-study-mobile how-to-study-mobile--reading">
      <div className="how-to-study-mobile__article study-article">
        {sectionMarkdown ? renderArticleMarkdown(sectionMarkdown) : null}
      </div>

      {(neighbors.previous || neighbors.next) && (
        <nav className="how-to-study-mobile__chapter-nav" aria-label="Section navigation">
          {neighbors.previous ? (
            <button
              type="button"
              className="how-to-study-mobile__chapter-link how-to-study-mobile__chapter-link--prev"
              onClick={() => handleSectionChange(neighbors.previous!.id)}
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
              <span className="how-to-study-mobile__chapter-link-text">
                <span className="how-to-study-mobile__chapter-link-kicker">Previous</span>
                <span className="how-to-study-mobile__chapter-link-label">
                  {neighbors.previous.label}
                </span>
              </span>
            </button>
          ) : (
            <span className="how-to-study-mobile__chapter-spacer" aria-hidden="true" />
          )}

          {neighbors.next ? (
            <button
              type="button"
              className="how-to-study-mobile__chapter-link how-to-study-mobile__chapter-link--next"
              onClick={() => handleSectionChange(neighbors.next!.id)}
            >
              <span className="how-to-study-mobile__chapter-link-text">
                <span className="how-to-study-mobile__chapter-link-kicker">Next</span>
                <span className="how-to-study-mobile__chapter-link-label">
                  {neighbors.next.label}
                </span>
              </span>
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
        </nav>
      )}
    </div>
  );
}
