/**
 * Copies the editorial manuscript into the app bundle so Vite always includes it.
 *
 * Source: knowledge-base/study/how-to-study-the-bible.md
 * Target: app/src/data/study/how-to-study-the-bible.md
 *
 * Usage: node scripts/sync-how-to-study-manuscript.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'knowledge-base/study/how-to-study-the-bible.md');
const target = path.join(root, 'app/src/data/study/how-to-study-the-bible.md');

if (!fs.existsSync(source)) {
  console.error(`Missing source manuscript: ${source}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
const content = fs.readFileSync(source, 'utf8');
fs.writeFileSync(target, content, 'utf8');
console.log(`Synced manuscript (${content.length} chars) -> app/src/data/study/how-to-study-the-bible.md`);
