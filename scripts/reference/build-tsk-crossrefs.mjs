/**
 * Build per-book TSK cross-reference JSON from OpenBible.info cross-reference export.
 *
 * Prerequisites:
 * 1. Download cross-reference data from https://www.openbible.info/labs/cross-references/
 *    (CC BY 3.0 — attribution required).
 * 2. Place the extracted TSV/JSON at knowledge-base/reference/openbible-crossrefs.tsv
 *
 * Usage:
 *   node scripts/reference/build-tsk-crossrefs.mjs [input-file]
 *
 * Output: app/src/data/reference/crossrefs/{book-slug}.json
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_INPUT = join(ROOT, 'knowledge-base/reference/openbible-crossrefs.tsv');
const OUTPUT_DIR = join(ROOT, 'app/src/data/reference/crossrefs');

const META = {
  sourceId: 'tsk-openbible',
  sourceName: 'Treasury of Scripture Knowledge (OpenBible.info derivative)',
  sourceUrl: 'https://www.openbible.info/labs/cross-references/',
  license: 'CC BY 3.0 (derivative); underlying TSK public domain',
  redistributionAllowed: true,
  attributionRequired: true,
  attribution:
    'Cross-reference data derived from the Treasury of Scripture Knowledge via OpenBible.info (CC BY).',
  dateChecked: new Date().toISOString().slice(0, 10),
};

const inputPath = process.argv[2] ?? DEFAULT_INPUT;

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  console.error(
    'Download OpenBible cross-reference data (CC BY) and place it at the path above, then re-run.',
  );
  process.exit(1);
}

console.log(
  'TSK build script scaffold ready. Implement TSV/JSON parsing for your OpenBible export format.',
);
console.log(`Input: ${inputPath}`);
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log('Place OpenBible export at input path and extend this script to parse it.');
