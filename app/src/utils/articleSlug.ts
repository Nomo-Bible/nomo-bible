const usedSlugs = new Set<string>();

export function resetArticleSlugRegistry(): void {
  usedSlugs.clear();
}

export function slugifyArticleHeading(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u2018\u2019\u201C\u201D"“”]/g, '')
    .replace(/\s*—\s*/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function registerArticleHeadingId(text: string): string {
  const base = slugifyArticleHeading(text);
  if (!base) return 'section';

  let candidate = base;
  let counter = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

/** Map table-of-contents labels to heading text in the document body. */
export function resolveTocTargetHeading(label: string): string {
  const trimmed = label.trim();
  if (trimmed.startsWith('### ')) {
    return trimmed.slice(4);
  }
  if (trimmed.startsWith('Chapter ')) {
    return trimmed;
  }
  if (trimmed.startsWith('Preface:')) {
    return trimmed.slice('Preface:'.length).trim();
  }
  if (trimmed.startsWith('Introduction:')) {
    return trimmed.slice('Introduction:'.length).trim();
  }
  if (trimmed.startsWith('Conclusion:')) {
    return trimmed.slice('Conclusion:'.length).trim();
  }
  if (trimmed.startsWith('Appendix ')) {
    const afterLabel = trimmed.split(':').slice(1).join(':').trim();
    return afterLabel || trimmed;
  }
  if (trimmed === 'Appendices') {
    return 'Symbol Study Cheat Sheet';
  }
  return trimmed;
}

export function isTocEntryLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('### Chapter ')) return true;
  if (trimmed.startsWith('Part ')) return true;
  if (
    trimmed.startsWith('Preface:') ||
    trimmed.startsWith('Introduction:') ||
    trimmed.startsWith('Conclusion:') ||
    trimmed.startsWith('Appendix ')
  ) {
    return true;
  }
  if (trimmed === 'Appendices') return true;
  return false;
}

export function tocEntryLabel(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('### ')) {
    return trimmed.slice(4);
  }
  return trimmed;
}

/** Pre-register heading ids so the table of contents can link before body render. */
export function buildArticleHeadingIdMap(markdown: string): Map<string, string> {
  resetArticleSlugRegistry();
  const headingIds = new Map<string, string>();

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();
    if (line.startsWith('# ')) {
      headingIdForMap(line.slice(2), headingIds);
    } else if (line.startsWith('## ')) {
      headingIdForMap(line.slice(3), headingIds);
    } else if (line.startsWith('### ')) {
      headingIdForMap(line.slice(4), headingIds);
    } else if (line.startsWith('#### ')) {
      headingIdForMap(line.slice(5), headingIds);
    }
  }

  return headingIds;
}

function headingIdForMap(text: string, headingIds: Map<string, string>): string {
  const existing = headingIds.get(text);
  if (existing) return existing;
  const id = registerArticleHeadingId(text);
  headingIds.set(text, id);
  return id;
}
