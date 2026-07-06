#!/usr/bin/env node
/**
 * Validate Strong's word-level tagging across the entire installed KJV.
 * Optionally auto-repairs by rebuilding aligned token data.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  NAME_TO_BOOK_CODE,
  normalizeStrongsNumber,
  prepareKjvVerseDisplayText,
  verseKey,
} from './kjv-strongs-alignment.mjs';
import { buildKjvStrongsTokens } from './build-kjv-strongs-tokens.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const KJV_VERSES_PATH = join(ROOT, 'knowledge-base/bible/kjv/processed/kjv-verses.json');
const TOKENS_PATH = join(ROOT, 'knowledge-base/bible/kjv/processed/kjv-strongs-tokens.json');
const HEBREW_PATH = join(ROOT, 'app/src/data/reference/strongs-hebrew.json');
const GREEK_PATH = join(ROOT, 'app/src/data/reference/strongs-greek.json');

const OT_BOOKS = new Set([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
  'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles',
  '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
]);

function languageHint(book) {
  return OT_BOOKS.has(book) ? 'H' : 'G';
}

function buildStrongsLookupIndex(hebrew, greek) {
  const index = new Map();
  for (const dictionary of [hebrew, greek]) {
    for (const entry of Object.values(dictionary)) {
      index.set(entry.strongsNumber.toUpperCase(), entry);
      const canonical = normalizeStrongsNumber(entry.strongsNumber);
      if (canonical) index.set(canonical, entry);
    }
  }
  return index;
}

function lookupEntry(index, raw, hint) {
  const canonical = normalizeStrongsNumber(raw ?? '');
  if (canonical && index.has(canonical)) {
    return { canonical, entry: index.get(canonical) };
  }
  if (raw && /^\d+$/.test(String(raw).trim())) {
    const digits = String(raw).trim();
    const h = `H${digits}`;
    const g = `G${digits}`;
    if (hint === 'H' && index.has(h)) return { canonical: h, entry: index.get(h) };
    if (hint === 'G' && index.has(g)) return { canonical: g, entry: index.get(g) };
    if (index.has(h)) return { canonical: h, entry: index.get(h) };
    if (index.has(g)) return { canonical: g, entry: index.get(g) };
  }
  return { canonical, entry: null };
}

async function loadTokens() {
  return JSON.parse(await readFile(TOKENS_PATH, 'utf8'));
}

async function validate({ autoRepair = false, maxRepairPasses = 3, log = console.log } = {}) {
  let repairPasses = 0;
  let repairedMappings = 0;

  for (let pass = 0; pass <= maxRepairPasses; pass += 1) {
    const [verses, tokens, hebrew, greek] = await Promise.all([
      readFile(KJV_VERSES_PATH, 'utf8').then(JSON.parse),
      loadTokens(),
      readFile(HEBREW_PATH, 'utf8').then(JSON.parse),
      readFile(GREEK_PATH, 'utf8').then(JSON.parse),
    ]);

    const strongsIndex = buildStrongsLookupIndex(hebrew, greek);
    const booksChecked = new Set();
    const chaptersChecked = new Set();

    let totalWordTokens = 0;
    let totalTaggedWords = 0;
    let successfulLookups = 0;
    let missingTags = 0;
    let lookupFailures = 0;
    let missingStrongsEntries = 0;
    let alignmentFailures = 0;

    const lookupFailureSamples = [];
    const alignmentFailureSamples = [];
    const spotChecks = {};

    for (const verse of verses) {
      booksChecked.add(verse.book);
      chaptersChecked.add(`${verse.book}:${verse.chapter}`);
      const key = verseKey(verse.book, verse.chapter, verse.verse);
      const verseTokens = tokens[key];

      if (!verseTokens || verseTokens.length === 0) {
        alignmentFailures += 1;
        if (alignmentFailureSamples.length < 15) {
          alignmentFailureSamples.push(key);
        }
        continue;
      }

      const hint = languageHint(verse.book);
      for (const token of verseTokens) {
        totalWordTokens += 1;
        if (!token.strongs) {
          missingTags += 1;
          continue;
        }
        totalTaggedWords += 1;
        const { canonical, entry } = lookupEntry(strongsIndex, token.strongs, hint);
        if (!canonical) {
          lookupFailures += 1;
          if (lookupFailureSamples.length < 10) {
            lookupFailureSamples.push({ key, text: token.text, strongs: token.strongs });
          }
          continue;
        }
        if (!entry) {
          missingStrongsEntries += 1;
          if (lookupFailureSamples.length < 10) {
            lookupFailureSamples.push({ key, text: token.text, strongs: token.strongs, canonical });
          }
          continue;
        }
        successfulLookups += 1;
      }

      for (const [book, chapter, v, word, expected] of [
        ['Genesis', 1, 2, 'Spirit', 'H7307'],
        ['John', 1, 1, 'Word', 'G3056'],
        ['Hebrews', 4, 9, 'rest', 'G4520'],
      ]) {
        const checkKey = verseKey(book, chapter, v);
        if (key !== checkKey) continue;
        const match = verseTokens.find(
          (t) => t.text.replace(/[^A-Za-z]/g, '').toLowerCase() === word.toLowerCase(),
        );
        spotChecks[checkKey] = {
          word,
          expected,
          found: match?.strongs ?? null,
          ok: normalizeStrongsNumber(match?.strongs ?? '') === expected,
        };
      }
    }

    const report = {
      pass: pass + 1,
      booksChecked: booksChecked.size,
      chaptersChecked: chaptersChecked.size,
      versesChecked: verses.length,
      totalWordTokens,
      totalTaggedWords,
      successfulLookups,
      missingTags,
      lookupFailures,
      missingStrongsEntries,
      alignmentFailures,
      repairedMappings,
      repairPasses,
      taggedVerseCount: Object.keys(tokens).length,
      untaggedVerseCount: verses.length - Object.keys(tokens).length,
      spotChecks,
      lookupFailureSamples,
      alignmentFailureSamples,
      completeTagging:
        lookupFailures === 0 &&
        missingStrongsEntries === 0 &&
        alignmentFailures === 0,
      allTaggedWordsResolve:
        lookupFailures === 0 && missingStrongsEntries === 0,
    };

    const repairable =
      alignmentFailures > 0 || lookupFailures > 0 || missingStrongsEntries > 0;

    if (!autoRepair || !repairable || pass === maxRepairPasses) {
      return report;
    }

    log(`\nAuto-repair pass ${pass + 1}: rebuilding aligned token data …`);
    const beforeCount = Object.keys(tokens).length;
    const buildStats = await buildKjvStrongsTokens({ log });
    const afterCount = buildStats.taggedVerses;
    repairedMappings += Math.max(0, afterCount - beforeCount);
    repairPasses += 1;
  }

  throw new Error('validate: exceeded repair passes');
}

function printReport(report) {
  console.log('\n=== Strong\'s Tagging Validation Report ===\n');
  console.log(`Books checked:              ${report.booksChecked}`);
  console.log(`Chapters checked:           ${report.chaptersChecked}`);
  console.log(`Verses checked:             ${report.versesChecked}`);
  console.log(`Tagged verses:              ${report.taggedVerseCount}`);
  console.log(`Untagged verses:            ${report.untaggedVerseCount}`);
  console.log(`Total word tokens:          ${report.totalWordTokens}`);
  console.log(`Total tagged words:         ${report.totalTaggedWords}`);
  console.log(`Successful lookups:         ${report.successfulLookups}`);
  console.log(`Missing tags (untagged):    ${report.missingTags}`);
  console.log(`Lookup normalization fails: ${report.lookupFailures}`);
  console.log(`Missing Strong's entries:   ${report.missingStrongsEntries}`);
  console.log(`Alignment failures:         ${report.alignmentFailures}`);
  console.log(`Repaired mappings:          ${report.repairedMappings}`);
  console.log(`Repair passes:              ${report.repairPasses}`);
  console.log(`Complete verse tagging:     ${report.completeTagging ? 'YES' : 'NO'}`);
  console.log(`All tagged words resolve:   ${report.allTaggedWordsResolve ? 'YES' : 'NO'}`);

  console.log('\nSpot checks:');
  for (const [key, check] of Object.entries(report.spotChecks)) {
    console.log(
      `  ${key} "${check.word}" → ${check.found ?? 'null'} (expected ${check.expected}) ${check.ok ? 'OK' : 'FAIL'}`,
    );
  }

  if (report.alignmentFailureSamples.length > 0) {
    console.log('\nAlignment failure samples:', report.alignmentFailureSamples.slice(0, 10));
  }
  if (report.lookupFailureSamples.length > 0) {
    console.log('\nLookup failure samples:', report.lookupFailureSamples);
  }

  if (!report.completeTagging) {
    console.log(
      '\nNOTE: The installed CrossWire KJV Strong\'s source does not provide word-level tags for every English word.',
    );
    console.log(
      'Untagged function words are expected. Verses listed under alignment failures lack usable CrossWire alignment.',
    );
    console.log(
      'Source: https://github.com/metaxiamultimedia/scriptures-js-source-crosswire-kjv (CrossWire KJV, MIT)',
    );
  }
}

const autoRepair = process.argv.includes('--repair');

validate({ autoRepair })
  .then((report) => {
    printReport(report);
    if (!report.allTaggedWordsResolve) {
      process.exitCode = 1;
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
