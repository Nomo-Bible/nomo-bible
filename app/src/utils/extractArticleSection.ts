import { slugifyArticleHeading } from '@/utils/articleSlug';

function headingLevel(line: string): number | null {
  const match = line.match(/^(#{1,6})\s+/);
  return match ? match[1].length : null;
}

function headingText(line: string): string | null {
  const match = line.match(/^#{1,6}\s+(.+)$/);
  return match ? match[1].trim() : null;
}

function headingsMatch(a: string, b: string): boolean {
  return (
    a === b ||
    slugifyArticleHeading(a) === slugifyArticleHeading(b) ||
    a.includes(b) ||
    b.includes(a)
  );
}

/** Extract markdown from a heading through the next heading of equal or higher level. */
export function extractArticleSection(markdown: string, targetHeading: string): string | null {
  const lines = markdown.split('\n');
  let startIndex = -1;
  let startLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const level = headingLevel(lines[i]);
    const text = headingText(lines[i]);
    if (!level || !text) continue;
    if (headingsMatch(text, targetHeading)) {
      startIndex = i;
      startLevel = level;
      break;
    }
  }

  if (startIndex === -1) return null;

  const sectionLines: string[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    if (i > startIndex) {
      const level = headingLevel(lines[i]);
      if (level !== null && level <= startLevel) break;
    }
    sectionLines.push(lines[i]);
  }

  const content = sectionLines.join('\n').trim();
  return content.length > 0 ? content : null;
}
