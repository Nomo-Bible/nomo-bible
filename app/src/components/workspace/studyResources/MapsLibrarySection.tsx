import type { PassageKey } from '@/types/study';
import { getCatalogMaps } from '@/services/studyResources/catalogService';
import { CatalogResourceCard } from './CatalogResourceCard';
import './studyResources.css';

interface MapsLibrarySectionProps {
  passageKey: PassageKey;
  headerSlot?: React.ReactNode;
}

export function MapsLibrarySection({ headerSlot }: MapsLibrarySectionProps) {
  const maps = getCatalogMaps();

  return (
    <div className="catalog-library-section">
      {headerSlot}
      <section aria-label="Bible maps library">
        <h3 className="catalog-library-section__heading">Bible Maps</h3>
        <p className="catalog-library-section__intro">
          Linked map resources from public-domain and clearly licensed sources. Nomomartyria
          does not hotlink external images — use Open Source to view maps at the provider.
        </p>
        <ul className="catalog-library-section__list">
          {maps.map((map) => (
            <li key={map.id}>
              <CatalogResourceCard
                title={map.title}
                description={map.description}
                sourceName={map.sourceName}
                licenseNotes={map.licenseNotes}
                openSourceUrl={map.openSourceUrl}
                imagePath={map.imagePath || undefined}
                meta={
                  map.relatedBibleRefs.length > 0
                    ? `Passages: ${map.relatedBibleRefs.join(', ')}`
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
