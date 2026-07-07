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

function isTableOfContentsHeading(line: string): boolean {
  return line.startsWith('## TABLE OF CONTENTS');
}

/**
 * Extract markdown from a heading through the next heading of equal or higher level.
 * Uses the last matching heading so table-of-contents entries are not mistaken for body content.
 */
export function extractArticleSection(markdown: string, targetHeading: string): string | null {
  const lines = markdown.split('\n');
  let startIndex = -1;
  let startLevel = 0;
  let inTableOfContents = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isTableOfContentsHeading(line)) {
      inTableOfContents = true;
      continue;
    }

    if (inTableOfContents) {
      if (line.startsWith('## ') && !isTableOfContentsHeading(line)) {
        inTableOfContents = false;
      } else {
        continue;
      }
    }

    const level = headingLevel(line);
    const text = headingText(line);
    if (!level || !text) continue;
    if (headingsMatch(text, targetHeading)) {
      startIndex = i;
      startLevel = level;
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
