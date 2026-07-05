#!/usr/bin/env node
/**
 * Convert eBible eng-kjv2006 USFM files to normalized kjv-verses.json.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SOURCE_DIR = join(ROOT, 'knowledge-base/bible/kjv/source');
const ZIP_PATH = join(SOURCE_DIR, 'eng-kjv2006_usfm.zip');
const EXTRACT_DIR = join(SOURCE_DIR, 'eng-kjv2006_usfm');
const OUTPUT_DIR = join(ROOT, 'knowledge-base/bible/kjv/processed');
const OUTPUT_PATH = join(OUTPUT_DIR, 'kjv-verses.json');

function stripUsfmMarkup(text) {
  let result = text;
  result = result.replace(/\\f[^\\]*?\\f\*/g, '');
  result = result.replace(/\\w\s+([^|]+)\|[^\\]*\\w\*/g, '$1');
  result = result.replace(/\\\+w\s+([^|]+)\|[^\\]*\\\+w\*/g, '$1');
  result = result.replace(/\\add\s+/g, '');
  result = result.replace(/\\add\*/g, '');
  result = result.replace(/\\wj\s*/g, '');
  result = result.replace(/\\wj\*/g, '');
  result = result.replace(/\\\*+/g, '');
  result = result.replace(/\*+$/g, '');
  result = result.replace(/\\nd[^\\]*?\\nd\*/g, (segment) =>
    segment
      .replace(/\\nd\s*/g, '')
      .replace(/\\nd\*/g, '')
      .replace(/\\\+w\s+/g, '')
      .replace(/\\\+w\*/g, '')
      .replace(/\\w\s+([^|]+)\|[^\\]*\\w\*/g, '$1'),
  );
  result = result.replace(/\\[a-z]+\d*\*?/gi, '');
  result = result.replace(/¶\s*/g, '');
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

function parseVerseLine(line) {
  const match = line.match(/^\\v\s+(\d+)(?:-\d+)?\s+(.*)$/);
  if (!match) return null;
  return {
    verse: Number(match[1]),
    text: stripUsfmMarkup(match[2]),
  };
}

function parseUsfmFile(content, bookOrder) {
  const lines = content.split(/\r?\n/);
  let book = '';
  let chapter = 0;
  const verses = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const headerMatch = line.match(/^\\h\s+(.+)$/);
    if (headerMatch) {
      book = headerMatch[1].trim();
      continue;
    }

    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      chapter = Number(chapterMatch[1]);
      continue;
    }

    const parsed = parseVerseLine(line);
    if (!parsed || !book || chapter === 0) continue;

    const testament = bookOrder <= 39 ? 'Old Testament' : 'New Testament';
    const reference = `${book} ${chapter}:${parsed.verse}`;

    verses.push({
      translation: 'KJV',
      testament,
      book,
      bookOrder,
      chapter,
      verse: parsed.verse,
      text: parsed.text,
      reference,
    });
  }

  return verses;
}

async function ensureExtracted() {
  const hasUsfm = existsSync(EXTRACT_DIR) &&
    (await readdir(EXTRACT_DIR)).some((name) => name.endsWith('.usfm'));

  if (hasUsfm) return;

  if (!existsSync(ZIP_PATH)) {
    throw new Error(
      `Missing ${ZIP_PATH}. Run: node scripts/kjv/download-kjv.mjs`,
    );
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
}

async function convert() {
  await ensureExtracted();

  const files = (await readdir(EXTRACT_DIR))
    .filter((name) => name.endsWith('.usfm'))
    .sort((a, b) => {
      const orderA = Number(a.split('-')[0]);
      const orderB = Number(b.split('-')[0]);
      return orderA - orderB;
    });

  if (files.length !== 66) {
    console.warn(`Expected 66 USFM books, found ${files.length}.`);
  }

  const allVerses = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const bookOrder = index + 1;
    const content = await readFile(join(EXTRACT_DIR, file), 'utf8');
    const verses = parseUsfmFile(content, bookOrder);
    allVerses.push(...verses);
    console.log(`  ${file}: ${verses.length} verses`);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(allVerses, null, 2), 'utf8');
  console.log(`\nWrote ${allVerses.length} verses to ${OUTPUT_PATH}`);
}

convert().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
