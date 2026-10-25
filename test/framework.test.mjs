import assert from 'node:assert/strict';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { stringify } from 'yaml';
import { adopt } from '../scripts/adopt.mjs';
import { checkRepository } from '../scripts/check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function workspace(context) {
  const directory = mkdtempSync(join(tmpdir(), 'cdd fixtures '));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function write(directory, path, content) {
  const destination = join(directory, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content.endsWith('\n') ? content : `${content}\n`);
}

function snapshot(directory) {
  return readdirSync(directory, { withFileTypes: true }).sort((first, second) => first.name.localeCompare(second.name)).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) return [[entry.name, readlinkSync(path)]];
    if (entry.isDirectory()) return [[entry.name, snapshot(path)]];
    return [[entry.name, readFileSync(path, 'utf8')]];
  });
}

function issueData(status = 'backlog', board = 'archive') {
  return { id: 'APP-0001', title: 'A bounded change', status, board, createdDate: '2026-10-25', closedDate: status === 'done' ? '2026-10-25' : null };
}

function issueRecord(directory, data) {
  const body = ['Reason', 'Description', 'Acceptance Criteria', 'Proof of Success', 'Implementation Plan', 'References'].map(section => {
    const text = section === 'Acceptance Criteria' ? `- [${data.status === 'done' ? 'x' : ' '}] Observable outcome.` : 'Fixture evidence or agreed scope.';
    return `## ${section}\n\n${text}\n`;
  }).join('\n');
  write(directory, 'issues/APP-0001-a-bounded-change.md', `---\n${stringify(data)}---\n\n# ${data.id}: ${data.title}\n\n[Back](README.md)\n\n${body}`);
}

function board(directory, data) {
  const link = '[APP-0001: A bounded change](APP-0001-a-bounded-change.md)';
  const cells = ['ready', 'in-progress', 'done'].map(status => data?.status === status && data.board === 'current' ? link : '_No issues._');
  const backlog = data?.status === 'backlog' ? `- ${link}` : '_No issues._';
  const archive = data?.status === 'done' && data.board === 'archive' ? `- ${link}` : '_No issues._';
  write(directory, 'issues/README.md', `# Issues\n\n[Back](../README.md)\n\n| Ready | In Progress | Done |\n|:--|:--|:--|\n| ${cells.join(' | ')} |\n\n<details>\n<summary>Backlog</summary>\n\n${backlog}\n\n</details>\n\n<details>\n<summary>Archive</summary>\n\n${archive}\n\n</details>\n`);
}

function adrData(number, status = 'PROPOSED') {
  return { id: `adr-${number}`, title: 'A decision', status, createdDate: '2026-10-25', acceptedDate: status === 'PROPOSED' ? null : '2026-10-25', supersededDate: null, supersededBy: null, supersedes: [] };
}

function adrRecord(directory, data) {
  const body = ['Context', 'Decision', 'Consequences', 'Alternatives'].map(section => `## ${section}\n\nFixture reasoning.\n`).join('\n');
  write(directory, `docs/adr/${data.id}-a-decision.md`, `---\n${stringify(data)}---\n\n# ${data.id.toUpperCase()}: ${data.title}\n\n[Back](README.md)\n\n${body}`);
}

function adrIndex(directory, records = []) {
  const sections = ['PROPOSED', 'ACCEPTED', 'SUPERSEDED'].map(status => {
    const title = status[0] + status.slice(1).toLowerCase();
    const links = records.filter(data => data.status === status).map(data => `- [${data.id}](${data.id}-a-decision.md)`).join('\n');
    return `### ${title}\n\n${links || '_No ADRs._'}\n`;
  }).join('\n');
  write(directory, 'docs/adr/README.md', `# Decisions\n\n[Back](../README.md)\n\n## Status Index\n\n${sections}`);
}

function migrationIndex(directory, guides = []) {
  const links = guides.map(name => `- [${name}](${name})`).join('\n');
  write(directory, 'docs/migrations/README.md', `# Migrations\n\n[Back](../README.md)\n\n${links || '_No migration guides._'}\n`);
}

function migrationRecord(directory, overrides = {}, omitted = '') {
  const data = { title: 'Upgrade from version 1 to version 2', fromMajor: 1, toMajor: 2, status: 'draft', ...overrides };
  const sections = {
    'Version Coverage': 'Fixture source 1.x to upcoming target 2.0.0; all API consumers.',
    'Breaking Changes': 'The example API name changes and requires an update.',
    'Update Steps': '1. Replace the old API name.\n2. Run the verification.',
    'Before And After': 'Before: `client.old()`. After: `client.new()`.',
    Verification: 'Run the fixture consumer tests; expect a zero exit code.',
    Compatibility: 'Use the target runtime and API together; mixed APIs are unsupported.',
    References: '[Project contracts](../README.md).',
  };
  const body = Object.entries(sections).filter(([section]) => section !== omitted).map(([section, text]) => `## ${section}\n\n${text}\n`).join('\n');
  write(directory, 'docs/migrations/v1-to-v2.md', `---\n${stringify(data)}---\n\n# Upgrade From Version 1 To Version 2\n\n[Back](README.md)\n\n${body}`);
}

function initializedFixture(directory, profile = 'core') {
  adopt({ target: directory, profile });
  const configPath = join(directory, '.github/cdd.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  config.integrationBranch = 'trunk';
  if (['issues', 'full'].includes(profile)) config.issuePrefix = 'APP';
  write(directory, '.github/cdd.json', JSON.stringify(config, null, 2));
  write(directory, 'README.md', '# Fixture Project\n\n[Docs](docs/README.md)\n');
  write(directory, '.github/copilot-instructions.md', '# Instructions\n\nFollow the approved plan.\n');
  const migrationLink = ['migrations', 'full'].includes(profile) ? '\n- [Migrations](migrations/README.md)' : '';
  write(directory, 'docs/README.md', `# Docs\n\n[Back](../README.md)\n\n- [Collaboration](collaboration.md)\n- [Documentation](documentation.md)\n- [ADRs](adr/README.md)${migrationLink}\n`);
  write(directory, 'docs/collaboration.md', '# Collaboration\n\n[Back](README.md)\n');
  write(directory, 'docs/documentation.md', '# Documentation\n\n[Back](README.md)\n');
  if (['issues', 'full'].includes(profile)) board(directory);
  adrIndex(directory);
  if (['migrations', 'full'].includes(profile)) migrationIndex(directory);
}

test('copy preview is read-only and independent copies are repeatable', context => {
  const directory = workspace(context);
  write(directory, 'existing.txt', 'User content');
  const before = snapshot(directory);
  assert.ok(adopt({ target: directory, dryRun: true }).length);
  assert.deepEqual(snapshot(directory), before);
  adopt({ target: directory });
  assert.equal(adopt({ target: directory }).length, 0);
  const initializer = join(directory, '.github/skills/initialize-repository');
  assert.equal(lstatSync(initializer).isSymbolicLink(), false);
  assert.ok(existsSync(join(initializer, 'references/baseline.md')));
  assert.ok(existsSync(join(directory, '.github/cdd-LICENSE')));
  assert.equal(readFileSync(join(directory, 'existing.txt'), 'utf8'), 'User content\n');
  assert.equal(existsSync(join(directory, 'issues')), false);
});

test('profile upgrades are additive and preserve project configuration', context => {
  const directory = workspace(context);
  adopt({ target: directory, profile: 'migrations' });
  const config = JSON.parse(readFileSync(join(directory, '.github/cdd.json'), 'utf8'));
  write(directory, '.github/cdd.json', JSON.stringify({ ...config, integrationBranch: 'release', custom: 'keep' }, null, 2));
  write(directory, 'docs/user-notes.md', '# Keep my notes');
  const before = snapshot(directory);
  adopt({ target: directory, profile: 'issues', dryRun: true });
  assert.deepEqual(snapshot(directory), before);
  adopt({ target: directory, profile: 'issues' });
  const upgraded = JSON.parse(readFileSync(join(directory, '.github/cdd.json'), 'utf8'));
  assert.equal(upgraded.profile, 'full');
  assert.equal(upgraded.custom, 'keep');
  assert.equal(upgraded.integrationBranch, 'release');
  assert.ok(existsSync(join(directory, '.github/skills/close-issue/SKILL.md')));
  assert.equal(adopt({ target: directory, profile: 'core' }).length, 0);
});

test('copy conflicts are detected before any staged files are written', context => {
  const directory = workspace(context);
  write(directory, '.github/skills/close-issue/SKILL.md', 'Custom skill');
  const before = snapshot(directory);
  assert.throws(() => adopt({ target: directory, profile: 'full' }), /conflicting path/);
  assert.deepEqual(snapshot(directory), before);
});

test('copy refuses a linked destination parent and configuration conflicts', context => {
  const directory = workspace(context);
  const outside = workspace(context);
  symlinkSync(outside, join(directory, '.github'));
  assert.throws(() => adopt({ target: directory }), /linked parent/);
  assert.deepEqual(snapshot(outside), []);
  rmSync(join(directory, '.github'));
  write(directory, '.github/cdd.json', JSON.stringify({ version: 999, profile: 'core' }));
  assert.throws(() => adopt({ target: directory }), /configuration conflicts/);
});

test('copies work in nested paths with spaces and preserve Git files', context => {
  const directory = workspace(context);
  const target = join(directory, 'nested/project with spaces');
  mkdirSync(target, { recursive: true });
  write(target, '.gitignore', 'keep-this-rule');
  const before = snapshot(target);
  adopt({ target, profile: 'full', dryRun: true });
  assert.deepEqual(snapshot(target), before);
  adopt({ target, profile: 'full' });
  assert.equal(lstatSync(join(target, '.github/skills/close-issue')).isSymbolicLink(), false);
  assert.equal(adopt({ target, profile: 'full' }).length, 0);
  assert.equal(readFileSync(join(target, '.gitignore'), 'utf8'), 'keep-this-rule\n');
  assert.equal(existsSync(join(target, '.github/copilot-instructions.md')), false);
});

test('adoption refuses broken symlinks and invalid options without writes', context => {
  const directory = workspace(context);
  mkdirSync(join(directory, '.github/skills'), { recursive: true });
  symlinkSync('missing', join(directory, '.github/skills/initialize-repository'));
  const before = snapshot(directory);
  assert.throws(() => adopt({ target: directory }), /linked parent/);
  assert.throws(() => adopt({ target: directory, profile: 'unknown' }), /Unknown profile/);
  assert.deepEqual(snapshot(directory), before);
});

test('CLI rejects missing targets and reports a read-only preview', context => {
  const directory = workspace(context);
  const script = join(root, 'scripts/adopt.mjs');
  const missing = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(missing.status, 1);
  const preview = spawnSync(process.execPath, [script, '--dry-run', directory], { encoding: 'utf8' });
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /no files changed/);
  assert.deepEqual(snapshot(directory), []);
});

for (const profile of ['core', 'issues', 'migrations', 'full']) {
  test(`${profile} representative initialized output passes without disabled modules`, context => {
    const directory = workspace(context);
    initializedFixture(directory, profile);
    assert.deepEqual(checkRepository(directory).errors, []);
    assert.ok(existsSync(join(directory, 'docs/adr/README.md')));
    if (['core', 'migrations'].includes(profile)) assert.equal(existsSync(join(directory, 'issues')), false);
    if (['core', 'issues'].includes(profile)) assert.equal(existsSync(join(directory, 'docs/migrations')), false);
  });
}

test('disabled workflow references and artifacts fail profile validation', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'issues');
  write(directory, '.github/skills/close-issue/SKILL.md', '---\nname: close-issue\ndescription: "Close an issue."\nargument-hint: "Issue ID"\n---\n\nMigration guides are optional and can be added later.');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('References disabled module: migrations')));
  mkdirSync(join(directory, 'docs/migrations'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Disabled module artifact:')));

  const migrationOnly = workspace(context);
  initializedFixture(migrationOnly, 'migrations');
  write(migrationOnly, 'docs/collaboration.md', '# Collaboration\n\nIssues are optional and can be added later.');
  assert.ok(checkRepository(migrationOnly).errors.some(error => error.includes('References disabled module: issues')));
  mkdirSync(join(migrationOnly, 'issues'));
  assert.ok(checkRepository(migrationOnly).errors.some(error => error.includes('Disabled module artifact: issues')));
});

test('disabled issue metadata is rejected while enabled issue metadata is supported', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  const decision = { ...adrData('0001'), issue: null };
  adrRecord(directory, decision);
  adrIndex(directory, [decision]);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Issue field present while issues are disabled')));
});

test('ADR infrastructure and status indexes are mandatory even for core', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  write(directory, 'docs/adr/README.md', '# Decisions\n\n[Back](../README.md)');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Missing ADR status index')));
  rmSync(join(directory, 'docs/adr'), { recursive: true });
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Missing profile path: docs/adr/README.md')));
});

test('adding issues to a core fixture preserves existing guidance', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  const before = readFileSync(join(directory, 'docs/collaboration.md'), 'utf8');
  adopt({ target: directory, profile: 'issues' });
  const config = JSON.parse(readFileSync(join(directory, '.github/cdd.json'), 'utf8'));
  write(directory, '.github/cdd.json', JSON.stringify({ ...config, issuePrefix: 'APP' }, null, 2));
  board(directory);
  assert.deepEqual(checkRepository(directory).errors, []);
  assert.equal(readFileSync(join(directory, 'docs/collaboration.md'), 'utf8'), before);
});

test('migration guides can be added later without issues or changing existing ADRs', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  const decision = adrData('0001', 'ACCEPTED');
  adrRecord(directory, decision);
  adrIndex(directory, [decision]);
  const before = readFileSync(join(directory, 'docs/adr/adr-0001-a-decision.md'), 'utf8');
  adopt({ target: directory, profile: 'migrations' });
  migrationIndex(directory);
  const docsIndex = join(directory, 'docs/README.md');
  writeFileSync(docsIndex, `${readFileSync(docsIndex, 'utf8')}\n- [Migrations](migrations/README.md)\n`);
  assert.deepEqual(checkRepository(directory).errors, []);
  assert.equal(existsSync(join(directory, 'issues')), false);
  assert.equal(readFileSync(join(directory, 'docs/adr/adr-0001-a-decision.md'), 'utf8'), before);
  assert.equal(adopt({ target: directory, profile: 'core' }).length, 0);
});

test('migration guides validate draft and published structural contracts', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'migrations');
  migrationIndex(directory, ['v1-to-v2.md']);
  for (const status of ['draft', 'published']) {
    migrationRecord(directory, { status });
    assert.deepEqual(checkRepository(directory).errors, []);
    assert.equal(checkRepository(directory).migrations, 1);
  }
});

test('migration guides reject invalid versions, mismatched filenames, missing sections, and duplicate indexes', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'migrations');
  migrationIndex(directory, ['v1-to-v2.md']);
  migrationRecord(directory, { fromMajor: 2 });
  assert.ok(checkRepository(directory).errors.some(error => error.includes('advancing major-version')));
  migrationRecord(directory, { toMajor: 3 });
  assert.ok(checkRepository(directory).errors.some(error => error.includes('filename must match')));
  migrationRecord(directory, {}, 'Verification');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Missing migration section: Verification')));
  migrationRecord(directory);
  const guide = join(directory, 'docs/migrations/v1-to-v2.md');
  writeFileSync(guide, readFileSync(guide, 'utf8').replace('Run the fixture consumer tests; expect a zero exit code.', ''));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Empty migration section: Verification')));
  migrationRecord(directory);
  migrationIndex(directory, ['v1-to-v2.md', 'v1-to-v2.md']);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('exactly once in its index')));
});

test('close-issue defers to enabled-module close-out rules without naming disabled modules', () => {
  const skill = readFileSync(join(root, '.github/skills/close-issue/SKILL.md'), 'utf8');
  const baseline = readFileSync(join(root, '.github/skills/initialize-repository/references/baseline.md'), 'utf8');
  assert.match(skill, /Apply relevant reconciliation requirements from the portable baseline/);
  assert.doesNotMatch(skill, /migration guide|upgrade guide|docs\/migrations/i);
  const review = baseline.indexOf('At issue close-out, review delivered behavior and consumer-facing contracts');
  const proposal = baseline.indexOf('propose its source and target versions', review);
  const approval = baseline.indexOf('Wait for explicit approval before authoring', review);
  const create = baseline.indexOf('reconcile issue scope and plan first if approved', review);
  assert.ok(review >= 0 && proposal > review && approval > proposal && create > approval);
  assert.match(baseline, /a breaking change alone does not establish a major transition/);
  assert.match(baseline, /ask how to track or defer out-of-scope work/i);
});

test('close-issue proposes exactly one commit message line with the current issue ID prefix', () => {
  const skill = readFileSync(join(root, '.github/skills/close-issue/SKILL.md'), 'utf8');
  assert.match(skill, /exactly one single-line commit message/i);
  assert.match(skill, /exact `id` value from the current issue's metadata, including its configured prefix/i);
  assert.match(skill, /Do not include a body or alternative subjects/i);
});

test('issue lifecycle placement follows every valid state without moving files', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'issues');
  for (const [status, scope] of [['backlog', 'archive'], ['ready', 'current'], ['in-progress', 'current'], ['done', 'current'], ['done', 'archive']]) {
    const data = issueData(status, scope);
    issueRecord(directory, data);
    board(directory, data);
    assert.deepEqual(checkRepository(directory).errors, [], `${status}/${scope}`);
  }
});

test('validator catches wrong board placement, unsupported state, and unchecked closure', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'issues');
  issueRecord(directory, issueData('in-progress', 'current'));
  board(directory, issueData('ready', 'current'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('matching location')));
  issueRecord(directory, issueData('ready', 'archive'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Invalid status/board')));
  issueRecord(directory, issueData('done', 'current'));
  board(directory, issueData('done', 'current'));
  const path = join(directory, 'issues/APP-0001-a-bounded-change.md');
  writeFileSync(path, readFileSync(path, 'utf8').replace('- [x]', '- [ ]'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('unchecked criteria')));
});

test('duplicate board entries and missing board structure fail validation', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'issues');
  issueRecord(directory, issueData('ready', 'current'));
  board(directory, issueData('ready', 'current'));
  const path = join(directory, 'issues/README.md');
  writeFileSync(path, readFileSync(path, 'utf8').replace('_No issues._', '[Duplicate](APP-0001-a-bounded-change.md)'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('exactly once')));
  write(directory, 'issues/README.md', '# Issues\n\n[Back](../README.md)');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('nonempty Ready/In Progress/Done')));
});

test('ADR acceptance and supersession have reciprocal metadata and stable records', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  const first = adrData('0001');
  adrRecord(directory, first);
  adrIndex(directory, [first]);
  assert.deepEqual(checkRepository(directory).errors, []);
  first.status = 'ACCEPTED';
  first.acceptedDate = '2026-10-25';
  adrRecord(directory, first);
  adrIndex(directory, [first]);
  assert.deepEqual(checkRepository(directory).errors, []);
  const second = adrData('0002', 'ACCEPTED');
  second.supersedes = [first.id];
  first.status = 'SUPERSEDED';
  first.supersededBy = second.id;
  first.supersededDate = '2026-10-25';
  adrRecord(directory, first);
  adrRecord(directory, second);
  adrIndex(directory, [first, second]);
  assert.deepEqual(checkRepository(directory).errors, []);
  second.supersedes = [];
  adrRecord(directory, second);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('reciprocal')));
});

test('cyclic ADR replacements and proposed replacement acceptance are rejected', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  const first = { ...adrData('0001', 'SUPERSEDED'), supersededDate: '2026-10-25', supersededBy: 'adr-0002', supersedes: ['adr-0002'] };
  const second = { ...adrData('0002', 'SUPERSEDED'), supersededDate: '2026-10-25', supersededBy: 'adr-0001', supersedes: ['adr-0001'] };
  adrRecord(directory, first);
  adrRecord(directory, second);
  adrIndex(directory, [first, second]);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Cyclic supersession')));
  second.status = 'PROPOSED';
  second.acceptedDate = null;
  second.supersededDate = null;
  second.supersededBy = null;
  adrRecord(directory, second);
  adrIndex(directory, [first, second]);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Replacement must be accepted')));
});

test('validator catches invalid YAML, dates, links, and missing directory indexes', context => {
  const directory = workspace(context);
  initializedFixture(directory, 'issues');
  const data = issueData();
  data.createdDate = '2026-02-30';
  issueRecord(directory, data);
  board(directory, data);
  assert.ok(checkRepository(directory).errors.some(error => error.includes('creation date')));
  write(directory, 'docs/extra.md', '# Extra\n\n[Missing](missing.md)');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Broken link')));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Unindexed child')));
  mkdirSync(join(directory, 'docs/nested'));
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Missing directory index')));
  write(directory, '.github/skills/create-issue/SKILL.md', '---\nname: [\n---\n');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('SKILL.md')));
});

test('Markdown parsing ignores example links and validates duplicate heading fragments', context => {
  const directory = workspace(context);
  initializedFixture(directory);
  write(directory, 'docs/collaboration.md', '# Collaboration\n\n[Second](#detail-1)\n\n## Detail\n\n## Detail\n\n```markdown\n[Example](not-a-real-file.md)\n```');
  assert.deepEqual(checkRepository(directory).errors, []);
  write(directory, 'docs/collaboration.md', '# Collaboration\n\n[Broken](#absent)');
  assert.ok(checkRepository(directory).errors.some(error => error.includes('Broken fragment')));
});