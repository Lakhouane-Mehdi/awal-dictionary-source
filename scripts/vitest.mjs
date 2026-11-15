// Runs vitest from the project folder's real path casing.
//
// On Windows a terminal can report the folder as "c:\..." instead of
// "C:\...". vitest then loads two copies of itself, one per spelling, and
// every suite fails with "Cannot read properties of undefined (reading
// 'config')". Fixing it in vite.config.ts is too late, because vitest is
// already loaded by then, so this starts it in a child process from the
// correctly cased folder. Everywhere else it is a plain pass-through.
import { realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const cwd = realpathSync.native(process.cwd());
const vitest = path.join(cwd, 'node_modules', 'vitest', 'vitest.mjs');
const { status, error } = spawnSync(process.execPath, [vitest, ...process.argv.slice(2)], { cwd, stdio: 'inherit' });
if (error) throw error;
process.exit(status ?? 1);
