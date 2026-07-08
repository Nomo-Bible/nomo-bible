export interface ParsedEgwChapter {
  id: string;
  title: string;
  content: string;
}

const CHAPTER_HEADER =
  /^(Chapter\s+(\d+)(?:[\s.—–-]+(.+))?)\s*$/i;

export function parseEgwChapters(text: string): ParsedEgwChapter[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const lines = normalized.split('\n');
  const markers: Array<{ index: number; lineIndex: number; number: string; title: string }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    const match = trimmed.match(CHAPTER_HEADER);
    if (!match) continue;

    let title = match[3]?.trim() ?? '';
    if (!title && lines[i + 1]?.trim() && !CHAPTER_HEADER.test(lines[i + 1].trim())) {
      const next = lines[i + 1].trim();
      if (next.length < 80 && !next.endsWith('.')) {
        title = next;
      }
    }

    const lineStart = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
    markers.push({
      index: lineStart,
      lineIndex: i,
      number: match[2],
      title: title ? `Chapter ${match[2]} — ${title}` : `Chapter ${match[2]}`,
    });
  }

  if (markers.length === 0) {
    return [{ id: 'full-text', title: 'Full text', content: normalized }];
  }

  const contentMarkers = markers.filter((marker, idx) => {
    const next = markers[idx + 1];
    const end = next?.index ?? normalized.length;
    const block = normalized.slice(marker.index, end).trim();
    return block.length > 500;
  });

  const chapters = (contentMarkers.length > 0 ? contentMarkers : markers).map((marker, idx) => {
    const next = (contentMarkers.length > 0 ? contentMarkers : markers)[idx + 1];
    const end = next?.index ?? normalized.length;
    const content = normalized.slice(marker.index, end).trim();
    return {
      id: `chapter-${marker.number}`,
      title: marker.title,
      content,
    };
  });

  return chapters.filter((chapter) => chapter.content.length > 80);
}

export function splitEgwParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
