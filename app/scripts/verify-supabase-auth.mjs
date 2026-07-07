/**
 * Verify Supabase Auth connectivity (reads app/.env.local).
 * Usage: npm run verify:supabase --prefix app
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = join(APP_ROOT, '.env.local');

function loadEnv(path) {
  const text = readFileSync(path, 'utf8');
  const env = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv(ENV_PATH);
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or key in app/.env.local');
  process.exit(1);
}

const supabase = createClient(url, key);
const testEmail = `nomomartyria.verify.${Date.now()}@yopmail.com`;
const testPassword = 'VerifyTestPass123!';

const results = [];
let signupSession = null;

async function step(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`OK  ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, ok: false, message });
    console.error(`FAIL ${name}: ${message}`);
  }
}

console.log('Supabase auth verification\n');

await step('Client connects (getSession)', async () => {
  const { error } = await supabase.auth.getSession();
  if (error) throw error;
});

await step('Sign up test user', async () => {
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  if (error) throw error;
  if (!data.user) throw new Error('No user returned from signUp');
  signupSession = data.session;
});

if (signupSession) {
  await step('Session persists (getSession after signUp)', async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) throw new Error('No active session after signUp');
  });

  await step('Sign out', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  });

  await step('Login test user', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error) throw error;
    if (!data.session) throw new Error('No session returned from signIn');
  });

  await step('Session persists (getSession after login)', async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) throw new Error('No active session after login');
  });
} else {
  console.log(
    'NOTE  SignUp succeeded without session (email confirmation likely required).',
  );
  console.log('      Login/session tests skipped — enable auto-confirm in Supabase or confirm email to test login.');
}

await step('Sign out (final)', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);

if (failed.length > 0) {
  console.error('\nFailed checks:');
  for (const f of failed) {
    console.error(`  - ${f.name}: ${f.message}`);
  }
  process.exit(1);
}
