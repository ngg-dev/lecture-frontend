import { readFile, access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const course = JSON.parse(await readFile(resolve(root, 'course.json'), 'utf8'));
const command = process.argv[2];
if (!['setup', 'check', 'build'].includes(command)) {
  console.error('Usage: node scripts/course.mjs setup|check|build');
  process.exit(1);
}
for (const lecture of course) {
  const cwd = resolve(root, 'packages', lecture.id);
  const run = args => {
    const result = spawnSync('npm', args, { cwd, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${lecture.id}: npm ${args.join(' ')} failed (${result.status})`);
  };
  console.log(`\n[${lecture.id}] ${command}`);
  if (command === 'setup') {
    try { await access(resolve(cwd, 'package-lock.json')); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    run(['ci', '--no-audit', '--no-fund']);
  } else if (command === 'check') {
    if (lecture.check) run(['run', 'check']);
    else run(['run', 'build']);
  } else {
    if (lecture.build) run(['run', 'build']);
    const destination = resolve(root, 'lectures', lecture.id);
    await rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });
    await cp(resolve(cwd, lecture.output), destination, { recursive: true });
    await writeFile(resolve(destination, 'README.md'), `# ${lecture.title}\n\n${lecture.summary}\n\n[Исходники](../../packages/${lecture.id}/) · [Все лекции](../../)\n\nИз корня репозитория: npm run setup && npm run build && npm run serve.\n`);
  }
}
