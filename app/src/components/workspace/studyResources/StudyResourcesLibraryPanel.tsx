import {
  BarChart3,
  BookMarked,
  BookOpen,
  Library,
  Map,
  ScrollText,
  Tags,
} from 'lucide-react';
import type { PassageKey } from '@/types/study';
import type { StudyResourceLibrarySection } from '@/types/studyWorkspace';
import { getStudyResourceCounts } from '@/services/studyResources/studyResourceService';
import { getCatalogCounts } from '@/services/studyResources/catalogService';
import { CommentaryNotesPanel } from './StudyResourcePanels';
import {
  RelatedResourcesPanel,
  usePassageResourceContext,
  type RelatedResourceNavigateKind,
} from './RelatedResourcesPanel';
import { EgwLibrarySection } from './EgwLibrarySection';
import { TopicsCatalogSection } from './TopicsCatalogSection';
import { ChartsCatalogSection } from './ChartsCatalogSection';
import { MapsLibrarySection } from './MapsLibrarySection';
import { MyNotesLibrarySection } from './MyNotesLibrarySection';
import './studyResources.css';

const LIBRARY_SECTIONS: Array<{
  id: StudyResourceLibrarySection;
  label: string;
  icon: typeof Library;
}> = [
  { id: 'overview', label: 'Overview', icon: Library },
  { id: 'topics', label: 'Topics', icon: Tags },
  { id: 'egw', label: 'Ellen White', icon: ScrollText },
  { id: 'commentary', label: 'Commentary', icon: BookMarked },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'maps', label: 'Maps', icon: Map },
  { id: 'my-notes', label: 'My Notes', icon: BookOpen },
];

interface StudyResourcesLibraryPanelProps {
  passageKey: PassageKey;
  passageLabel: string;
  activeSection: StudyResourceLibrarySection;
  onSectionChange: (section: StudyResourceLibrarySection) => void;
  onNavigateResource?: (kind: RelatedResourceNavigateKind) => void;
  onOpenStudyNotes?: () => void;
  onSelectNote?: (noteId: string) => void;
}

export function StudyResourcesLibraryPanel({
  passageKey,
  passageLabel,
  activeSection,
  onSectionChange,
  onNavigateResource,
  onOpenStudyNotes,
  onSelectNote,
}: StudyResourcesLibraryPanelProps) {
  const resourceContext = usePassageResourceContext(passageKey);
  const counts = getStudyResourceCounts();
  const catalogCounts = getCatalogCounts();

  const relatedHeader = (
    <RelatedResourcesPanel
      context={resourceContext}
      onNavigate={(kind) => onNavigateResource?.(kind)}
    />
  );

  return (
    <div className="study-resources-library">
      <header className="study-resources-library__header">
        <h2 className="study-resources-library__title">Study Resource Library</h2>
        <p className="study-resources-library__subtitle">
          Browse built-in topics, Ellen White writings, maps, and charts — plus your personal
          commentary and linked notes for {passageLabel}.
        </p>
      </header>

      <div
        className="study-resources-library__tabs"
        role="tablist"
        aria-label="Study resource library sections"
      >
        {LIBRARY_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeSection === id}
            className={
              activeSection === id
                ? 'study-resources-library__tab study-resources-library__tab--active'
                : 'study-resources-library__tab'
            }
            onClick={() => onSectionChange(id)}
          >
            <Icon size={15} strokeWidth={2} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="study-resources-library__body">
        {activeSection === 'overview' && (
          <div role="tabpanel" className="study-resources-library__overview">
            {relatedHeader}

            <p className="study-resource-panel__section-title">Built-in Library</p>
            <ul className="study-resources-library__cards">
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('topics')}
                >
                  <Tags size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">Topics</span>
                    <span className="study-resources-library__card-meta">
                      {catalogCounts.topics} built-in · {counts.topics} custom
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('egw')}
                >
                  <ScrollText size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">Ellen White</span>
                    <span className="study-resources-library__card-meta">
                      {catalogCounts.egwBooks} books · Read online + linked notes
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('maps')}
                >
                  <Map size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">Maps</span>
                    <span className="study-resources-library__card-meta">
                      {catalogCounts.maps} linked sources · Public domain &amp; licensed
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('charts')}
                >
                  <BarChart3 size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">Charts</span>
                    <span className="study-resources-library__card-meta">
                      {catalogCounts.charts} starter charts · {counts.charts} custom
                    </span>
                  </span>
                </button>
              </li>
            </ul>

            <p className="study-resource-panel__section-title">Your Library</p>
            <ul className="study-resources-library__cards">
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('commentary')}
                >
                  <BookMarked size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">Commentary Notes</span>
                    <span className="study-resources-library__card-meta">
                      {counts.commentary} saved · Personal Bible commentary
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="study-resources-library__card"
                  onClick={() => onSectionChange('my-notes')}
                >
                  <BookOpen size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="study-resources-library__card-text">
                    <span className="study-resources-library__card-title">My Notes</span>
                    <span className="study-resources-library__card-meta">
                      Passage study notes for {passageLabel}
                    </span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        )}

        {activeSection === 'commentary' && (
          <div role="tabpanel">
            <CommentaryNotesPanel
              passageKey={passageKey}
              passageLabel={passageLabel}
              filterByPassage={false}
              libraryMode
              headerSlot={relatedHeader}
            />
          </div>
        )}

        {activeSection === 'egw' && (
          <div role="tabpanel">
            <EgwLibrarySection
              passageKey={passageKey}
              passageLabel={passageLabel}
              headerSlot={relatedHeader}
            />
          </div>
        )}

        {activeSection === 'topics' && (
          <div role="tabpanel">
            <TopicsCatalogSection
              passageKey={passageKey}
              passageLabel={passageLabel}
              headerSlot={relatedHeader}
            />
          </div>
        )}

        {activeSection === 'charts' && (
          <div role="tabpanel">
            <ChartsCatalogSection
              passageKey={passageKey}
              passageLabel={passageLabel}
              headerSlot={relatedHeader}
            />
          </div>
        )}

        {activeSection === 'maps' && (
          <div role="tabpanel">
            <MapsLibrarySection passageKey={passageKey} headerSlot={relatedHeader} />
          </div>
        )}

        {activeSection === 'my-notes' && (
          <div role="tabpanel">
            <MyNotesLibrarySection
              passageKey={passageKey}
              passageLabel={passageLabel}
              headerSlot={relatedHeader}
              onOpenStudyNotes={onOpenStudyNotes}
              onSelectNote={onSelectNote}
            />
          </div>
        )}
      </div>
    </div>
  );
}
