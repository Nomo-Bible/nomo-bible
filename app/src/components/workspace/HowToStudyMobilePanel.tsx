import { ArrowLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { useMemo, useState } from 'react';
import articleMarkdown from '@knowledge-base/study/how-to-study-the-bible.md?raw';
import {
  HOW_TO_STUDY_MOBILE_SECTIONS,
  getHowToStudyMobileSection,
} from '@/data/study/howToStudyMobileSections';
import { extractArticleSection } from '@/utils/extractArticleSection';
import { renderArticleMarkdown } from '@/utils/renderArticleMarkdown';
import './HowToStudyMobilePanel.css';

function resolveSectionMarkdown(sectionId: string): string {
  const section = getHowToStudyMobileSection(sectionId);
  if (!section) {
    return `## Section unavailable\n\nThis study section could not be found. Return to the index and choose another topic.`;
  }

  const extracted = extractArticleSection(articleMarkdown, section.targetHeading);
  if (extracted && hasReadableBody(extracted)) return extracted;

  if (section.placeholderMarkdown) return section.placeholderMarkdown;

  return `## ${section.label}

${section.summary}

This section is being prepared for the mobile study guide. In the meantime, open the full **How to Study the Bible** material on desktop, or explore related workspace tools such as **Cross References**, **Concordance**, and **Study Notes** alongside your current passage.`;
}

function hasReadableBody(markdown: string): boolean {
  return markdown
    .split('\n')
    .some((line) => line.trim() && !line.trim().startsWith('#'));
}

export function HowToStudyMobilePanel() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sectionMarkdown = useMemo(
    () => (selectedSectionId ? resolveSectionMarkdown(selectedSectionId) : null),
    [selectedSectionId],
  );

  const selectedSection = selectedSectionId
    ? getHowToStudyMobileSection(selectedSectionId)
    : undefined;

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
                onClick={() => setSelectedSectionId(section.id)}
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
    <div className="how-to-study-mobile how-to-study-mobile--reading">
      <div className="how-to-study-mobile__toolbar">
        <button
          type="button"
          className="how-to-study-mobile__back"
          onClick={() => setSelectedSectionId(null)}
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to index
        </button>
        <p className="how-to-study-mobile__reading-label">{selectedSection.label}</p>
      </div>

      <div className="how-to-study-mobile__article study-article">
        {sectionMarkdown ? renderArticleMarkdown(sectionMarkdown) : null}
      </div>
    </div>
  );
}
