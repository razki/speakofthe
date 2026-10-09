import { cp, mkdir, readdir, rm, stat, symlink, chmod } from 'node:fs/promises';
import { basename, join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const output = resolve(root, '.deploy');
const functionRoot = join(output, 'function');
const assetsRoot = join(output, 'assets');
const stageOnly = process.argv.includes('--stage-only');
if (!stageOnly && process.platform !== 'linux') {
  throw new Error('Build Lambda ZIPs on Linux so native dependencies and permissions match AWS. Use --stage-only for local smoke testing.');
}
await stat(join(root, '.next/standalone/server.js'));
await mkdir(output, { recursive: true });
for (const directory of [functionRoot, assetsRoot]) {
  if (!directory.startsWith(output + sep)) {
    throw new Error('Unexpected package directory');
  }
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
}
const filter = (path) => !basename(path).startsWith('.env');
await cp(join(root, '.next/standalone'), functionRoot, { recursive: true, dereference: true, filter });
await cp(join(root, 'public'), join(functionRoot, 'public'), { recursive: true, filter });
await cp(join(root, '.next/static'), join(functionRoot, '.next/static'), { recursive: true });
await cp(join(root, 'public'), assetsRoot, { recursive: true, filter });
await cp(join(root, '.next/static'), join(assetsRoot, '_next/static'), { recursive: true });
await cp(join(root, 'scripts/lambda-run.sh'), join(functionRoot, 'run.sh'));
await chmod(join(functionRoot, 'run.sh'), 0o755);

// Lambda's code volume is read-only. Next's optional image cache uses /tmp.
const cachePath = join(functionRoot, '.next/cache');
await rm(cachePath, { recursive: true, force: true });
if (process.platform === 'linux') await symlink('/tmp/next-cache', cachePath);

async function sizeOf(directory) {
  let bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) bytes += await sizeOf(path);
    else if (entry.isFile()) bytes += (await stat(path)).size;
  }
  return bytes;
}
const bytes = await sizeOf(functionRoot);
if (bytes > 220 * 1024 * 1024) throw new Error('Lambda package is too large; leave room for the adapter layer under the 250 MiB limit.');
if (!stageOnly) {
  const zipPath = join(output, 'function.zip');
  await rm(zipPath, { force: true });
  const zip = spawnSync('zip', ['-qry', zipPath, '.'], { cwd: functionRoot, stdio: 'inherit' });
  if (zip.status !== 0) throw new Error('Lambda ZIP creation failed');
  const tar = spawnSync('tar', ['-czf', join(output, 'assets.tar.gz'), '-C', assetsRoot, '.'], { stdio: 'inherit' });
  if (tar.status !== 0) throw new Error('Static asset archive creation failed');
}
console.log(`Prepared standalone runtime (${Math.ceil(bytes / 1024 / 1024)} MiB) and public CDN assets. No environment files included.`);
