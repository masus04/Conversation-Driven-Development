import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const frameworkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const profiles = { core: [], issues: ['issues'], migrations: ['migrations'], full: ['issues', 'migrations'] };

function mergedProfile(first, second) {
  const modules = new Set([...profiles[first], ...profiles[second]]);
  return modules.size === 2 ? 'full' : [...modules][0] ?? 'core';
}

function pathExists(path) {
  try { lstatSync(path); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function regularFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Source must be project-owned, not a link: ${path}`);
    return entry.isDirectory() ? regularFiles(path) : [path];
  });
}

function checkParents(path, target) {
  for (let parent = dirname(path); parent !== dirname(target); parent = dirname(parent)) {
    if (pathExists(parent) && (!lstatSync(parent).isDirectory() || lstatSync(parent).isSymbolicLink())) {
      throw new Error(`Refusing non-directory or linked parent: ${parent}`);
    }
    if (parent === target) break;
  }
}

export function adopt({ target, profile = 'core', dryRun = false }) {
  if (!Object.hasOwn(profiles, profile)) throw new Error(`Unknown profile: ${profile}`);
  if (!target || !existsSync(target) || !lstatSync(realpathSync(target)).isDirectory()) {
    throw new Error('Target must be an existing directory');
  }
  const targetRoot = realpathSync(target);
  const configPath = join(targetRoot, '.github/cdd.json');
  checkParents(configPath, targetRoot);
  let config = { version: 1, profile };
  if (pathExists(configPath)) {
    if (!lstatSync(configPath).isFile() || lstatSync(configPath).isSymbolicLink()) throw new Error('Configuration must be a regular file');
    const existing = JSON.parse(readFileSync(configPath, 'utf8'));
    if (existing.version !== 1 || !Object.hasOwn(profiles, existing.profile)) {
      throw new Error('Existing configuration conflicts; reconcile it explicitly');
    }
    config = { ...existing, profile: mergedProfile(existing.profile, profile) };
  }
  const names = ['initialize-repository'];
  if (profiles[config.profile].includes('issues')) names.push('create-issue', 'implement-issue', 'close-issue');
  const actions = [];
  function addFile(destination, content) {
    checkParents(destination, targetRoot);
    if (pathExists(destination)) {
      if (lstatSync(destination).isSymbolicLink() || !lstatSync(destination).isFile() || !readFileSync(destination).equals(content)) {
        throw new Error(`Refusing to replace conflicting path: ${destination}`);
      }
      return;
    }
    actions.push({ destination, content });
  }
  for (const name of names) {
    const source = join(frameworkRoot, '.github/skills', name);
    if (!existsSync(join(source, 'SKILL.md')) || lstatSync(source).isSymbolicLink()) {
      throw new Error(`Source is missing a project-owned skill: ${name}`);
    }
    const destination = join(targetRoot, '.github/skills', name);
    checkParents(join(destination, 'SKILL.md'), targetRoot);
    for (const file of regularFiles(source)) addFile(join(destination, relative(source, file)), readFileSync(file));
  }
  if (!existsSync(join(frameworkRoot, '.github/skills/initialize-repository/references/baseline.md'))) {
    throw new Error('Source is missing the portable baseline');
  }
  const license = join(frameworkRoot, 'LICENSE');
  if (!existsSync(license)) throw new Error('Source is missing the framework license notice');
  addFile(join(targetRoot, '.github/cdd-LICENSE'), readFileSync(license));
  const configContent = Buffer.from(`${JSON.stringify(config, null, 2)}\n`);
  if (!existsSync(configPath) || !readFileSync(configPath).equals(configContent)) {
    actions.push({ destination: configPath, content: configContent, config: true });
  }
  if (!dryRun) {
    for (const action of actions) {
      mkdirSync(dirname(action.destination), { recursive: true });
      writeFileSync(action.destination, action.content, { flag: action.config ? 'w' : 'wx' });
    }
  }
  return actions.map(action => `${dryRun ? 'Would stage' : 'Staged'} ${relative(targetRoot, action.destination)}`);
}

function main() {
  const options = {};
  const argumentsList = process.argv.slice(2);
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === '--help' || argument === '-h') {
      console.log('Usage: node scripts/adopt.mjs [--dry-run] [--profile core|issues|migrations|full] TARGET');
      return;
    }
    if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--profile') {
      const value = argumentsList[++index];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}`);
      options[argument.slice(2)] = value;
    } else if (argument.startsWith('-') || options.target) throw new Error(`Unexpected argument: ${argument}`);
    else options.target = argument;
  }
  for (const message of adopt(options)) console.log(message);
  console.log(options.dryRun ? 'Preview complete; no files changed.' : 'Staging complete. Discuss and approve /initialize-repository in the target project.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
