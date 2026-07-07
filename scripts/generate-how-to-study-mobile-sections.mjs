/**
 * Validates that every mobile section extracts complete content from the app-bundled manuscript.
 * Run after syncing knowledge-base/study/how-to-study-the-bible.md into app/src.
 *
 * Usage: node scripts/generate-how-to-study-mobile-sections.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const markdownPath = path.join(root, 'app/src/data/study/how-to-study-the-bible.md');

const SECTION_CONFIG = [
  { id: 'law-and-testimony', targetHeading: 'The Sola Scriptura Mandate', minChars: 500 },
  { id: 'introduction', targetHeading: 'Why Method Matters', minChars: 200 },
  { id: 'how-to-read-scripture', targetHeading: 'Chapter 1: The Sovereign Key — Christ-Centered Interpretation', minChars: 1500, needsImage: true },
  { id: 'word-study', targetHeading: 'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms', minChars: 1200, needsImage: true },
  { id: 'chapter-3', targetHeading: 'Chapter 3: Line Upon Line — The “Repeat and Enlarge” Pattern', minChars: 1200, needsImage: true },
  { id: 'prophecy', targetHeading: 'Chapter 4: Unfolding Light — Understanding Progressive Revelation', minChars: 1200 },
  { id: 'chapter-5', targetHeading: 'Chapter 5: Sacred Echoes — Navigating Biblical Parallelism', minChars: 1200 },
  { id: 'chapter-6', targetHeading: 'Chapter 6: The Divine Pivot — Unlocking Chiastic Structures', minChars: 2000, needsImage: true },
  { id: 'cross-references', targetHeading: 'Chapter 7: The Council of Truth — Comparing Scripture with Scripture', minChars: 1200, needsImage: true },
  { id: 'context', targetHeading: 'Chapter 8: Setting the Stage — Historical and Prophetic Context', minChars: 1200 },
  { id: 'practical-application', targetHeading: 'Chapter 9: Living Truth — The Transforming Power of the Word', minChars: 1200, needsImage: true },
  { id: 'conclusion', targetHeading: 'Taking Up the Sword', minChars: 300 },
  { id: 'appendix-a', targetHeading: 'Symbol Study Cheat Sheet', minChars: 5000 },
  { id: 'appendix-b', targetHeading: 'Print Expansion Blueprint', minChars: 50 },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function headingLevel(line) {
  const match = line.match(/^(#{1,6})\s+/);
  return match ? match[1].length : null;
}

function headingText(line) {
  const match = line.match(/^#{1,6}\s+(.+)$/);
  return match ? match[1].trim() : null;
}

function headingsMatch(a, b) {
  return a === b || slugify(a) === slugify(b) || a.includes(b) || b.includes(a);
}

function extractArticleSection(markdown, targetHeading) {
  const lines = markdown.split('\n');
  let startIndex = -1;
  let startLevel = 0;
  let inTableOfContents = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## TABLE OF CONTENTS')) {
      inTableOfContents = true;
      continue;
    }
    if (inTableOfContents) {
      if (line.startsWith('## ') && !line.startsWith('## TABLE OF CONTENTS')) {
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

  const sectionLines = [];
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

const markdown = fs.readFileSync(markdownPath, 'utf8');
let failed = false;

for (const section of SECTION_CONFIG) {
  const content = extractArticleSection(markdown, section.targetHeading);
  if (!content || content.length < section.minChars) {
    console.error(`FAIL ${section.id}: ${content?.length ?? 0} chars (need ${section.minChars})`);
    failed = true;
    continue;
  }
  if (section.needsImage && !content.includes('/assets/study-guides/how-to-study-the-bible/')) {
    console.error(`FAIL ${section.id}: missing local image path`);
    failed = true;
    continue;
  }
  console.log(`OK ${section.id} (${content.length} chars)`);
}

if (failed) process.exit(1);
console.log(`All ${SECTION_CONFIG.length} mobile sections validated against app manuscript.`);
