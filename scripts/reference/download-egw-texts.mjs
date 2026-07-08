#!/usr/bin/env node
/**
 * Download and normalize public-domain Ellen G. White book texts for onboard reading.
 *
 * Sources:
 * - CCEL (Christian Classics Ethereal Library) — Trustees of Ellen G. White Publications PD etexts
 * - Internet Archive (ellen-g.-white-books collection) — djvu.txt OCR for books not on CCEL
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../../app/public/resources/egw');

const ARCHIVE_BASE = 'https://archive.org/download/ellen-g.-white-books/';

/** @type {Array<{ filename: string; url: string; format: 'ccel' | 'archive' }>} */
const BOOKS = [
  {
    filename: 'great-controversy.txt',
    url: 'https://ccel.org/ccel/white/controversy/cache/controversy.txt',
    format: 'ccel',
  },
  {
    filename: 'steps-to-christ.txt',
    url: 'https://ccel.org/ccel/white/steps/cache/steps.txt',
    format: 'ccel',
  },
  {
    filename: 'desire-of-ages.txt',
    url: 'https://ccel.org/ccel/white/desire/cache/desire.txt',
    format: 'ccel',
  },
  {
    filename: 'prophets-and-kings.txt',
    url: 'https://ccel.org/ccel/white/prophets/cache/prophets.txt',
    format: 'ccel',
  },
  {
    filename: 'acts-of-apostles.txt',
    url: 'https://ccel.org/ccel/white/acts/cache/acts.txt',
    format: 'ccel',
  },
  {
    filename: 'patriarchs-and-prophets.txt',
    url: `${ARCHIVE_BASE}${encodeURIComponent('PP - Patriarchs and Prophets_djvu.txt')}`,
    format: 'archive',
  },
  {
    filename: 'early-writings.txt',
    url: `${ARCHIVE_BASE}${encodeURIComponent('EW - Early Writings_djvu.txt')}`,
    format: 'archive',
  },
  {
    filename: 'christs-object-lessons.txt',
    url: `${ARCHIVE_BASE}COL%20-%20Christ%E2%80%99s%20Object%20Lessons_djvu.txt`,
    format: 'archive',
  },
  {
    filename: 'thoughts-from-mount-of-blessing.txt',
    url: `${ARCHIVE_BASE}MB%20-%20Thoughts%20From%20the%20Mount%20of%20Blessing_djvu.txt`,
    format: 'archive',
  },
];

function trimCcelText(raw) {
  let text = raw.replace(/\r\n/g, '\n');

  const footnoteStart = text.search(/^\s*\d+\.\s+file:\/\//m);
  if (footnoteStart > 0) {
    text = text.slice(0, footnoteStart);
  }

  const tocRule = text.lastIndexOf('__________________________________________________________________');
  if (tocRule >= 0) {
    const afterToc = text.slice(tocRule);
    const chapterStart = afterToc.search(/^\s*Chapter\s+1\b/m);
    if (chapterStart >= 0) {
      text = afterToc.slice(chapterStart);
    }
  } else {
    const chapterStart = text.search(/^\s*Chapter\s+1\b/m);
    if (chapterStart >= 0) {
      text = text.slice(chapterStart);
    }
  }

  return normalizeParagraphs(text);
}

function stripLeadingToc(text) {
  const markers = [...text.matchAll(/^Chapter\s+\d+/gm)];
  for (let i = 0; i < markers.length; i += 1) {
    const start = markers[i].index;
    const end = markers[i + 1]?.index ?? text.length;
    if (end - start > 500) {
      return text.slice(start);
    }
  }
  return text;
}

function trimArchiveText(raw) {
  let text = raw.replace(/\r\n/g, '\n');

  const tocMarker = 'Table of Contents';
  const lastToc = text.lastIndexOf(tocMarker);
  if (lastToc >= 0) {
    const afterToc = text.slice(lastToc);
    const chapterStart = afterToc.search(/^Chapter\s+1[\s.—–-]/m);
    if (chapterStart >= 0) {
      text = afterToc.slice(chapterStart);
    }
  } else {
    text = text.replace(/^\d+\s*$/gm, '');
    const chapterStart = text.search(/^Chapter\s+1[\s.—–-]/m);
    if (chapterStart >= 0) {
      text = text.slice(chapterStart);
    }
  }

  const normalized = normalizeParagraphs(text);
  return stripLeadingToc(normalized);
}

function normalizeParagraphs(text) {
  const lines = text.split('\n');
  const paragraphs = [];
  let current = [];

  const flush = () => {
    if (current.length === 0) return;
    paragraphs.push(current.join(' ').replace(/\s+/g, ' ').trim());
    current = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (/^\d+$/.test(trimmed)) {
      continue;
    }
    if (/^Chapter\s+\d+/i.test(trimmed)) {
      flush();
      paragraphs.push(trimmed);
      continue;
    }
    if (/^[A-Z][A-Za-z' ,\-–—]{2,}$/.test(trimmed) && current.length === 0 && paragraphs.length > 0) {
      const last = paragraphs[paragraphs.length - 1];
      if (/^Chapter\s+\d+\s*$/i.test(last)) {
        paragraphs[paragraphs.length - 1] = `${last} — ${trimmed}`;
        continue;
      }
    }
    current.push(trimmed);
  }
  flush();

  return `${paragraphs.join('\n\n')}\n`;
}

async function downloadBook({ filename, url, format }) {
  console.log(`Downloading ${filename} …`);
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (response.ok) break;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === 3) throw error;
      console.log(`  retry ${attempt}/3 …`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  const raw = await response.text();
  const cleaned = format === 'ccel' ? trimCcelText(raw) : trimArchiveText(raw);
  if (cleaned.length < 10_000) {
    throw new Error(`${filename}: cleaned text too short (${cleaned.length} chars)`);
  }
  const outPath = join(OUT_DIR, filename);
  await writeFile(outPath, cleaned, 'utf8');
  console.log(`  → ${outPath} (${(cleaned.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const book of BOOKS) {
    await downloadBook(book);
  }
  console.log(`Done. ${BOOKS.length} EGW books written to ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
