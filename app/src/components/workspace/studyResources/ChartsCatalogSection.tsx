import type { PassageKey } from '@/types/study';
import { getCatalogCharts } from '@/services/studyResources/catalogService';
import { CatalogResourceCard } from './CatalogResourceCard';
import { ChartsPanel } from './StudyResourcePanels';
import './studyResources.css';

interface ChartsCatalogSectionProps {
  passageKey: PassageKey;
  passageLabel: string;
  headerSlot?: React.ReactNode;
}

export function ChartsCatalogSection({
  passageKey,
  passageLabel,
  headerSlot,
}: ChartsCatalogSectionProps) {
  const charts = getCatalogCharts();

  return (
    <div className="catalog-library-section">
      {headerSlot}
      <section aria-label="Starter study charts">
        <h3 className="catalog-library-section__heading">Study Charts</h3>
        <p className="catalog-library-section__intro">
          Nomomartyria starter chart outlines for prophecy and sanctuary study. Add your own
          charts with local image paths below.
        </p>
        <ul className="catalog-library-section__list">
          {charts.map((chart) => (
            <li key={chart.id}>
              <CatalogResourceCard
                title={chart.title}
                description={chart.description}
                sourceName={chart.sourceName || 'Nomomartyria'}
                licenseNotes={chart.licenseNotes}
                meta={`Type: ${chart.type} · Passages: ${chart.relatedBibleRefs.join(', ')}`}
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="My custom charts">
        <ChartsPanel passageKey={passageKey} passageLabel={passageLabel} libraryMode />
      </section>
    </div>
  );
}
