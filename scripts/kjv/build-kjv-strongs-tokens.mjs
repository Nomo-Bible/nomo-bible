#!/usr/bin/env node
/**
 * Build per-verse KJV word tokens with Strong's numbers from CrossWire KJV data,
 * aligned to the local KJV verse text.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import {
  alignCrosswireToKjv,
  BOOK_CODE_TO_NAME,
  extractStrongsFromCrosswireWord,
  isAlignmentAcceptable,
  prepareKjvVerseDisplayText,
  verseKey,
} from './kjv-strongs-alignment.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SOURCE_DIR = join(ROOT, 'knowledge-base/bible/kjv/source');
const ZIP_PATH = join(SOURCE_DIR, 'crosswire-kjv-tokens.zip');
const EXTRACT_DIR = join(SOURCE_DIR, 'crosswire-kjv-tokens');
const KJV_VERSES_PATH = join(ROOT, 'knowledge-base/bible/kjv/processed/kjv-verses.json');
const OUTPUT_PATH = join(ROOT, 'knowledge-base/bible/kjv/processed/kjv-strongs-tokens.json');
const DOWNLOAD_URL =
  'https://github.com/metaxiamultimedia/scriptures-js-source-crosswire-kjv/archive/refs/heads/main.zip';

async function ensureSourceData() {
  const dataRoot = join(
    EXTRACT_DIR,
    'scriptures-js-source-crosswire-kjv-main',
    'data',
    'crosswire-KJV',
  );
  if (existsSync(dataRoot)) {
    return dataRoot;
  }

  await mkdir(SOURCE_DIR, { recursive: true });

  if (!existsSync(ZIP_PATH)) {
    console.log('Downloading CrossWire KJV token source …');
    const response = await fetch(DOWNLOAD_URL);
    if (!response.ok) {
      throw new Error(`Failed to download ${DOWNLOAD_URL}: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(ZIP_PATH, buffer);
  }

  if (existsSync(EXTRACT_DIR)) {
    await rm(EXTRACT_DIR, { recursive: true, force: true });
  }
  await mkdir(EXTRACT_DIR, { recursive: true });

  console.log(`Extracting ${ZIP_PATH} …`);
  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -Path '${ZIP_PATH.replace(/'/g, "''")}' -DestinationPath '${EXTRACT_DIR.replace(/'/g, "''")}' -Force"`,
      { stdio: 'inherit' },
    );
  } else {
    execSync(`unzip -o "${ZIP_PATH}" -d "${EXTRACT_DIR}"`, { stdio: 'inherit' });
  }

  return dataRoot;
}

async function walkVerseFiles(dir) {
  const files = [];
  const bookCodes = await readdir(dir, { withFileTypes: true });
  for (const bookEntry of bookCodes) {
    if (!bookEntry.isDirectory()) continue;
    const bookDir = join(dir, bookEntry.name);
    const chapters = await readdir(bookDir, { withFileTypes: true });
    for (const chapterEntry of chapters) {
      if (!chapterEntry.isDirectory()) continue;
      const chapterDir = join(bookDir, chapterEntry.name);
      const verses = await readdir(chapterDir, { withFileTypes: true });
      for (const verseEntry of verses) {
        if (!verseEntry.isFile() || !verseEntry.name.endsWith('.json')) continue;
        files.push(join(chapterDir, verseEntry.name));
      }
    }
  }
  return files;
}

export async function buildKjvStrongsTokens({ log = console.log } = {}) {
  const dataRoot = await ensureSourceData();
  const kjvVerses = JSON.parse(await readFile(KJV_VERSES_PATH, 'utf8'));
  const kjvTextByKey = new Map(
    kjvVerses.map((verse) => [
      verseKey(verse.book, verse.chapter, verse.verse),
      prepareKjvVerseDisplayText(verse.text),
    ]),
  );

  const verseFiles = await walkVerseFiles(dataRoot);
  const tokensByVerse = {};
  let exactMatch = 0;
  let aligned = 0;
  let rejected = 0;
  const rejectedSamples = [];

  for (const filePath of verseFiles) {
    const parts = filePath.split(/[/\\]/);
    const verseFile = parts.at(-1);
    const chapter = Number(parts.at(-2));
    const bookCode = parts.at(-3);
    const verse = Number(verseFile.replace('.json', ''));
    const book = BOOK_CODE_TO_NAME[bookCode];
    if (!book) continue;

    const raw = JSON.parse(await readFile(filePath, 'utf8'));
    const crossWords = (raw.words ?? []).map((word) => ({
      text: word.text,
      strongs: word.strongs,
      lemma: word.lemma,
      source: word.source,
    }));

    const key = verseKey(book, chapter, verse);
    const kjvDisplay = kjvTextByKey.get(key);
    if (!kjvDisplay) continue;

    const joined = crossWords.map((word) => word.text).join(' ');
    if (joined === kjvDisplay) {
      tokensByVerse[key] = crossWords.map((word) => ({
        text: word.text,
        strongs: extractStrongsFromCrosswireWord(word),
      }));
      exactMatch += 1;
      continue;
    }

    const result = alignCrosswireToKjv(crossWords, kjvDisplay);
    if (isAlignmentAcceptable(result)) {
      tokensByVerse[key] = result.tokens;
      aligned += 1;
    } else {
      rejected += 1;
      if (rejectedSamples.length < 10) {
        rejectedSamples.push({
          key,
          ratio: result.alignmentRatio,
          kjvWords: result.kjvWordCount,
          crossWords: result.crossWordCount,
        });
      }
    }
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(tokensByVerse), 'utf8');

  const stats = {
    taggedVerses: Object.keys(tokensByVerse).length,
    exactMatch,
    aligned,
    rejected,
    totalKjvVerses: kjvVerses.length,
    rejectedSamples,
    outputPath: OUTPUT_PATH,
  };

  log(`Wrote ${stats.taggedVerses} tagged verses to ${OUTPUT_PATH}`);
  log(`Exact text match: ${exactMatch}; aligned: ${aligned}; rejected: ${rejected}`);
  if (rejectedSamples.length > 0) {
    log('Rejected samples:', rejectedSamples);
  }

  return stats;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  buildKjvStrongsTokens().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
