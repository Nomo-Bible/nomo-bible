import { useMemo } from 'react';
import type { PassageKey } from '@/types/study';
import type { CatalogRelatedItem } from '@/types/resourceCatalog';
import type { RelatedResourcesContext, StudyResourceKind } from '@/types/studyResources';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { getMergedRelatedResources } from '@/services/studyResources/catalogService';
import {
  CATALOG_KIND_LABELS,
  CATALOG_KIND_LIBRARY_SECTION,
  RESOURCE_KIND_LABELS,
} from './resourceFieldConfigs';
import './studyResources.css';

export type RelatedResourceNavigateKind = StudyResourceKind | CatalogRelatedItem['kind'];

interface RelatedResourcesPanelProps {
  context: RelatedResourcesContext;
  onNavigate?: (kind: RelatedResourceNavigateKind, id: string, tab?: StudyWorkspaceTabId) => void;
}

function kindLabel(kind: RelatedResourceNavigateKind): string {
  if (kind in RESOURCE_KIND_LABELS) {
    return RESOURCE_KIND_LABELS[kind as StudyResourceKind];
  }
  return CATALOG_KIND_LABELS[kind as CatalogRelatedItem['kind']] ?? kind;
}

export function RelatedResourcesPanel({ context, onNavigate }: RelatedResourcesPanelProps) {
  const items = useMemo(() => getMergedRelatedResources(context), [context]);

  if (items.length === 0) {
    return (
      <section className="related-resources" aria-label="Related resources">
        <h3 className="related-resources__title">Related Resources</h3>
        <p className="related-resources__empty">
          No related resources tagged for this passage yet. Browse the Study Resource Library for
          built-in topics, Ellen White writings, maps, and charts — or add your own linked notes.
        </p>
      </section>
    );
  }

  return (
    <section className="related-resources" aria-label="Related resources">
      <h3 className="related-resources__title">Related Resources</h3>
      <ul className="related-resources__list">
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`}>
            <button
              type="button"
              className="related-resources__item"
              onClick={() => onNavigate?.(item.kind, item.id)}
            >
              <span className="related-resources__kind">
                {kindLabel(item.kind)}
                {item.catalog ? ' · Built-in' : ''}
              </span>
              <span className="related-resources__label">{item.title}</span>
              {item.subtitle ? (
                <span className="related-resources__subtitle">{item.subtitle}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function usePassageResourceContext(passageKey: PassageKey): RelatedResourcesContext {
  return useMemo(() => ({ passageKey }), [passageKey]);
}

export { CATALOG_KIND_LIBRARY_SECTION };
