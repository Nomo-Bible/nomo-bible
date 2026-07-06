import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cleanCodaText,
  linesToMarkdownBody,
  parseCdpExport,
} from './coda-to-markdown.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cdpPath =
  process.argv[2] ??
  'C:/Users/gateh/.cursor/browser-logs/cdp-response-Runtime.evaluate-repository-edition.json';

const sectionHeadings = [
  'COPYRIGHT & LICENSING',
  'DEDICATION',
  'TABLE OF CONTENTS',
  'PREFACE',
  'INTRODUCTION',
  'CONCLUSION',
  'OVERVIEW',
  'PURPOSE',
  'SCOPE',
  'FINAL OBSERVATIONS',
  'APPENDIX A',
  'APPENDIX B',
  'REPOSITORY STRUCTURE',
  'KNOWLEDGE BASE',
  'BIBLE DATA',
  'STUDY MATERIALS',
  'LICENSING',
  'VERSION HISTORY',
];

const subsectionTitles = [
  'How This Repository Should Be Used',
  'Principles of Use',
  'Print Expansion Blueprint',
];

let exportData;
try {
  exportData = parseCdpExport(readFileSync(cdpPath, 'utf8'));
} catch (error) {
  console.error(`Failed to read CDP export at ${cdpPath}`);
  console.error(error.message);
  console.error(
    '\nExtract from a logged-in Coda tab with browser CDP Runtime.evaluate, then run:\n' +
      '  node scripts/study/build-repository-edition-md.mjs <path-to-cdp-json>',
  );
  process.exit(1);
}

const text = cleanCodaText(exportData.text);
const lines = text.split('\n').map((l) => l.trim());

const body = linesToMarkdownBody(lines, {
  skipTitles: ['Nomomartyria Repository Edition 1.0', ''],
  sectionHeadings,
  subsectionTitles,
});

const imageLines = [];
if (exportData.images.length > 0) {
  const assetsDir = join(ROOT, 'app/public/images/repository');
  mkdirSync(assetsDir, { recursive: true });
  let index = 0;
  for (const image of exportData.images) {
    if (!image.src || image.src.startsWith('data:')) continue;
    index += 1;
    const ext = extname(new URL(image.src).pathname) || '.png';
    const filename = `repository-${index}${ext}`;
    imageLines.push(`![${image.alt || `Repository figure ${index}`}](/images/repository/${filename})`);
    // Image download requires network — note in console for manual step if fetch fails
    try {
      const response = await fetch(image.src);
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        writeFileSync(join(assetsDir, filename), buffer);
      }
    } catch {
      console.warn(`Could not download image: ${image.src}`);
      imageLines.push(`<!-- source: ${image.src} -->`);
    }
  }
}

const header = `# Nomomartyria Repository Edition 1.0

*Nomomartyria Bible Platform — Repository Documentation*

`;

const md = `${header}${body}${imageLines.length ? `\n\n${imageLines.join('\n\n')}\n` : '\n'}`;
const outPath = join(ROOT, 'knowledge-base/study/nomomartyria-repository-edition-1-0.md');
writeFileSync(outPath, md, 'utf8');
console.log(`Wrote ${md.length} characters to ${outPath}`);
