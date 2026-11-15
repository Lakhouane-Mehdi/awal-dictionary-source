// Runs vitest from the project folder's real path casing.
//
// On Windows a terminal can report the folder as "c:\..." instead of
// "C:\...". vitest then loads two copies of itself, one per spelling, and
// every suite fails with "Cannot read properties of undefined (reading
// 'config')". Fixing it in vite.config.ts is too late, because vitest is
// already loaded by then, so this starts it in a child process from the
// correctly cased folder. Everywhere else it is a plain pass-through.
//
// It also turns off Node's own localStorage (Node 25+). Without a storage
// file that global is undefined, and because it already exists jsdom does
// not install its own, so every test touching localStorage would crash.
import { realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const cwd = realpathSync.native(process.cwd());
const vitest = path.join(cwd, 'node_modules', 'vitest', 'vitest.mjs');
// NODE_OPTIONS rather than a flag, so vitest's worker processes get it too
const WEBSTORAGE_OFF = '--no-experimental-webstorage';
const env = { ...process.env };
if (process.allowedNodeEnvironmentFlags.has(WEBSTORAGE_OFF)) {
    env.NODE_OPTIONS = [env.NODE_OPTIONS, WEBSTORAGE_OFF].filter(Boolean).join(' ');
}
const { status, error } = spawnSync(process.execPath, [vitest, ...process.argv.slice(2)], { cwd, env, stdio: 'inherit' });
if (error) throw error;
process.exit(status ?? 1);
