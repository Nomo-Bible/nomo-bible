/**
 * Write app/.env.local from Supabase credentials (never committed).
 *
 * Usage:
 *   node scripts/configure-supabase-env.mjs <project-url> <publishable-key>
 *
 * Or with env vars:
 *   SUPABASE_URL=... SUPABASE_KEY=... node scripts/configure-supabase-env.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = join(ROOT, 'app/.env.local');

const url = process.argv[2] ?? process.env.SUPABASE_URL ?? '';
const key = process.argv[3] ?? process.env.SUPABASE_KEY ?? '';

if (!url || !key) {
  console.error('Usage: node scripts/configure-supabase-env.mjs <project-url> <publishable-key>');
  process.exit(1);
}

if (!url.startsWith('https://') || !url.includes('supabase.co')) {
  console.error('Project URL should look like: https://xxxxxxxx.supabase.co');
  process.exit(1);
}

const contents = `# Supabase — auto-generated ${new Date().toISOString()}
# Do not commit this file.

VITE_SUPABASE_URL=${url.trim()}
VITE_SUPABASE_PUBLISHABLE_KEY=${key.trim()}
VITE_SUPABASE_ANON_KEY=${key.trim()}
`;

writeFileSync(ENV_PATH, contents, 'utf8');
console.log(`Wrote ${ENV_PATH}`);
