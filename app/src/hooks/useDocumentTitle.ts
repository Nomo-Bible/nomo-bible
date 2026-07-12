import { useEffect } from 'react';

const APP_TITLE = 'Nomomartyria Bible';

export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title?.trim() ? title.trim() : APP_TITLE;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export function formatPassageDocumentTitle(passageLabel: string): string {
  const trimmed = passageLabel.trim();
  if (!trimmed) return APP_TITLE;
  return `${trimmed} — ${APP_TITLE}`;
}

export { APP_TITLE };
