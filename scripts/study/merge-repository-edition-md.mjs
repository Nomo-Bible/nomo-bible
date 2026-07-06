import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = join(ROOT, 'knowledge-base/study');

const main = readFileSync(join(dir, 'nomomartyria-repository-edition-1-0.md'), 'utf8')
  .replace('<!-- REPOSITORY_BODY_PART_2 -->', '')
  .trimEnd();

const chunks = [2, 3, 4, 5, 6, 7].map((n) =>
  readFileSync(join(dir, `_repo-chunk-${n}.md`), 'utf8')
    .trim()
    .replace(/<!-- REPOSITORY_BODY_PART_\d+ -->\s*/g, ''),
);

const out = `${main}\n\n${chunks.join('\n\n')}\n`;
writeFileSync(join(dir, 'nomomartyria-repository-edition-1-0.md'), out, 'utf8');
console.log(`Merged ${out.length} characters, ${out.split('\n').length} lines`);
