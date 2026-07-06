import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface KnowledgeBaseEmptyPanelProps {
  icon: ReactNode;
  title: string;
  message: string;
}

export function KnowledgeBaseEmptyPanel({
  icon,
  title,
  message,
}: KnowledgeBaseEmptyPanelProps) {
  return (
    <EmptyState icon={icon} title={title} message={message} />
  );
}
