import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cdpPath =
  'C:/Users/gateh/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-07-06T19-56-45-061Z.json';

const cdp = JSON.parse(readFileSync(cdpPath, 'utf8'));
let text = cdp.result.value;
const cut = text.indexOf('\n\nGet started with a free account');
if (cut > 0) text = text.slice(0, cut);
text = text.replace(/^Skip to content\n/, '').replace(/⁠/g, '');

const lines = text.split('\n').map((l) => l.trim());
const body = [];
const skip = new Set(['How to Study the Bible', '']);

const sectionHeadings = new Set([
  'COPYRIGHT & LICENSING',
  'DEDICATION',
  'TABLE OF CONTENTS',
  'PREFACE',
  'INTRODUCTION',
  'CONCLUSION',
  'APPENDIX A',
  'APPENDIX B',
  'PURPOSE',
  'HOW THIS REFERENCE SHOULD BE USED',
  'PRINCIPLES OF INTERPRETATION',
  'BIBLICAL SYMBOLS',
  'FINAL OBSERVATIONS',
  'Reflection & Application Exercises',
  'Chapter Conclusion',
]);

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (skip.has(line)) continue;

  if (line.match(/^PART [IVX]+:/)) {
    body.push(`## ${line}`);
    continue;
  }
  if (line.match(/^CHAPTER \d+$/)) {
    const title = lines[i + 1] ?? '';
    body.push(`## Chapter ${line.replace('CHAPTER ', '')}: ${title}`);
    i += 1;
    continue;
  }
  if (sectionHeadings.has(line)) {
    body.push(`## ${line}`);
    continue;
  }
  if (line === 'Why Method Matters' || line === 'Taking Up the Sword' || line === 'Symbol Study Cheat Sheet') {
    body.push(`### ${line}`);
    continue;
  }
  if (line.match(/^[A-Z][a-z].+ — /) && line.length < 90) {
    body.push(`### ${line}`);
    continue;
  }
  if (line.match(/^(The |Unlocking |Reading |Macro |Inverted |Structural |Building |Every |Among |Delighting |When we |Progressive |Recognizing |For instance |By respecting |The world |One of |Consider |A striking |The book |God did |Hebrew |KEY TEXT |Read as |Statement |Western |A primary |In a chiasm |Chiasms |No individual |No single |While the |Every passage |The ultimate |Every principle |But a tool |Use this |According to)/)) {
    if (line.length < 80) {
      body.push(`#### ${line}`);
      continue;
    }
  }
  if (line.startsWith('\u201c') || line.startsWith('"')) {
    body.push(`> ${line}`);
    continue;
  }
  if (line.match(/^\d+\. /)) {
    body.push(line);
    continue;
  }
  if (line.startsWith('Daniel ')) {
    body.push(`- ${line}`);
    continue;
  }
  if (
    line.startsWith('Who is ') ||
    line.startsWith('To whom ') ||
    line.startsWith('When was ') ||
    line.startsWith('Under what ') ||
    line.startsWith('How does this passage')
  ) {
    body.push(`- ${line}`);
    continue;
  }
  const exerciseMatch = line.match(
    /^(Scripture Search|Personal Reflection|Symbol Tracking|Context Exercise|Comparative Study|Application Prompt|Seed to Harvest|Group Discussion Note|Parallelism Breakdown|Textual Exercise|Chiasm Blueprinting|Structural Discovery|Cross-Reference Mastery|Personal Assessment|Context Investigation|Context Charting|Heart Diagnostics|A Commitment to Action):/,
  );
  if (exerciseMatch) {
    body.push(`**${exerciseMatch[1]}:**${line.slice(exerciseMatch[0].length)}`);
    continue;
  }
  if (line.match(/^[🌎🌾👑🏛📖]/)) {
    body.push(`#### ${line}`);
    continue;
  }
  body.push(line);
}

const header = `# How to Study the Bible

## How to Let Scripture Interpret Itself

*A Lesson Guide for Adult Bible Study Classes, Discipleship Groups, and Personal Study*

**By Dennis Hardy**

> “The entrance of thy words giveth light; it giveth understanding unto the simple.” — Psalm 119:130

`;

const md = `${header}${body.join('\n\n')}\n`;
const outDir = join(ROOT, 'knowledge-base/study');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'how-to-study-the-bible.md'), md, 'utf8');
console.log(`Wrote ${md.length} characters to knowledge-base/study/how-to-study-the-bible.md`);
