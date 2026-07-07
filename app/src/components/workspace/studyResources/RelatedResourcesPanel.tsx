import { useMemo } from 'react';
import type { PassageKey } from '@/types/study';
import type { RelatedResourcesContext, StudyResourceKind } from '@/types/studyResources';
import type { StudyWorkspaceTabId } from '@/types/studyWorkspace';
import { getRelatedResources } from '@/services/studyResources/studyResourceService';
import { RESOURCE_KIND_LABELS } from './resourceFieldConfigs';
import './studyResources.css';

interface RelatedResourcesPanelProps {
  context: RelatedResourcesContext;
  onNavigate?: (kind: StudyResourceKind, id: string, tab?: StudyWorkspaceTabId) => void;
}

export function RelatedResourcesPanel({ context, onNavigate }: RelatedResourcesPanelProps) {
  const items = useMemo(() => getRelatedResources(context), [context]);

  if (items.length === 0) {
    return (
      <section className="related-resources" aria-label="Related resources">
        <h3 className="related-resources__title">Related Resources</h3>
        <p className="related-resources__empty">
          No related resources tagged for this context yet. Add Bible references and topics to your
          study resources to connect them here.
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
              <span className="related-resources__kind">{RESOURCE_KIND_LABELS[item.kind]}</span>
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
