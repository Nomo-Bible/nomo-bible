#!/usr/bin/env node
/**
 * Download the public-domain eBible KJV 1769 USFM archive (eng-kjv2006).
 * Source: https://ebible.org/find/show.php?id=eng-kjv2006
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SOURCE_DIR = join(ROOT, 'knowledge-base/bible/kjv/source');
const ZIP_PATH = join(SOURCE_DIR, 'eng-kjv2006_usfm.zip');
const DOWNLOAD_URL = 'https://ebible.org/Scriptures/eng-kjv2006_usfm.zip';

async function download() {
  await mkdir(SOURCE_DIR, { recursive: true });

  console.log(`Downloading KJV USFM from ${DOWNLOAD_URL} …`);
  const response = await fetch(DOWNLOAD_URL);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(ZIP_PATH));
  console.log(`Saved ${ZIP_PATH}`);
}

download().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
