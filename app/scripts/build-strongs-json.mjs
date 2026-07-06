/**
 * Download Open Scriptures Strong's dictionaries and normalize to Nomomartyria JSON.
 * Run: node scripts/build-strongs-json.mjs
 *
 * Source license: see knowledge-base/licenses/reference-sources.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GREEK_URL =
  'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js';
const HEBREW_URL =
  'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js';

const SOURCE_ATTRIBUTION =
  'Open Scriptures (CC BY-SA 3.0) / James Strong, Exhaustive Concordance (1890)';

async function fetchDictionary(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const text = await response.text();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) {
    throw new Error(`Could not parse dictionary object from ${url}`);
  }
  return JSON.parse(text.slice(start, end + 1));
}

function extractRootWord(derivation) {
  if (!derivation) return undefined;
  const match = derivation.match(/\b([HG]\d+)\b/);
  return match ? match[1] : undefined;
}

function normalizeGreek(strongsNumber, raw) {
  return {
    strongsNumber,
    language: 'Greek',
    originalWord: raw.lemma ?? '',
    transliteration: raw.translit ?? '',
    pronunciation: raw.translit ?? '',
    definition: (raw.strongs_def ?? '').trim(),
    kjvUsage: raw.kjv_def ?? '',
    rootWord: extractRootWord(raw.derivation),
    source: SOURCE_ATTRIBUTION,
  };
}

function normalizeHebrew(strongsNumber, raw) {
  return {
    strongsNumber,
    language: 'Hebrew',
    originalWord: raw.lemma ?? '',
    transliteration: raw.xlit ?? '',
    pronunciation: raw.pron ?? '',
    definition: (raw.strongs_def ?? '').trim(),
    kjvUsage: raw.kjv_def ?? '',
    rootWord: extractRootWord(raw.derivation),
    source: SOURCE_ATTRIBUTION,
  };
}

async function main() {
  const [greekRaw, hebrewRaw] = await Promise.all([
    fetchDictionary(GREEK_URL),
    fetchDictionary(HEBREW_URL),
  ]);

  const greek = {};
  for (const [key, value] of Object.entries(greekRaw)) {
    greek[key] = normalizeGreek(key, value);
  }

  const hebrew = {};
  for (const [key, value] of Object.entries(hebrewRaw)) {
    hebrew[key] = normalizeHebrew(key, value);
  }

  const outDir = path.join(__dirname, '../src/data/reference');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'strongs-greek.json'),
    JSON.stringify(greek, null, 0),
  );
  fs.writeFileSync(
    path.join(outDir, 'strongs-hebrew.json'),
    JSON.stringify(hebrew, null, 0),
  );

  console.log(
    `Wrote ${Object.keys(greek).length} Greek and ${Object.keys(hebrew).length} Hebrew entries.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
