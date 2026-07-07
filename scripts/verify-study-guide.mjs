import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const markdown = fs.readFileSync(
  path.resolve(__dirname, '../knowledge-base/study/how-to-study-the-bible.md'),
  'utf8',
);

function headingLevel(line) {
  const m = line.match(/^(#{1,6})\s+/);
  return m ? m[1].length : null;
}
function headingText(line) {
  const m = line.match(/^#{1,6}\s+(.+)$/);
  return m ? m[1].trim() : null;
}
function headingsMatch(a, b) {
  return a === b || a.includes(b) || b.includes(a);
}
function extractArticleSection(markdown, targetHeading) {
  const lines = markdown.split('\n');
  let startIndex = -1;
  let startLevel = 0;
  let inToc = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## TABLE OF CONTENTS')) {
      inToc = true;
      continue;
    }
    if (inToc) {
      if (line.startsWith('## ') && !line.startsWith('## TABLE OF CONTENTS')) inToc = false;
      else continue;
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
  return sectionLines.join('\n').trim();
}

const targets = [
  'The Sola Scriptura Mandate',
  'Why Method Matters',
  'Chapter 1: The Sovereign Key — Christ-Centered Interpretation',
  'Chapter 2: The Divine Lexicon — Letting Scripture Define Its Own Terms',
  'Chapter 3: Line Upon Line — The “Repeat and Enlarge” Pattern',
  'Chapter 4: Unfolding Light — Understanding Progressive Revelation',
  'Chapter 5: Sacred Echoes — Navigating Biblical Parallelism',
  'Chapter 6: The Divine Pivot — Unlocking Chiastic Structures',
  'Chapter 7: The Council of Truth — Comparing Scripture with Scripture',
  'Chapter 8: Setting the Stage — Historical and Prophetic Context',
  'Chapter 9: Living Truth — The Transforming Power of the Word',
  'Taking Up the Sword',
  'Symbol Study Cheat Sheet',
  'Print Expansion Blueprint',
];

let failed = [];
for (const t of targets) {
  const s = extractArticleSection(markdown, t);
  if (!s) failed.push(`${t}: missing`);
  else console.log(`OK ${t} (${s.length} chars)`);
}
const imageCount = (markdown.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
console.log(`Images in markdown: ${imageCount}`);
if (failed.length) {
  console.error('FAILED', failed);
  process.exit(1);
}
