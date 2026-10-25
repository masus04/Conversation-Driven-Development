import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { parse } from 'yaml';

const profiles = { core: [], issues: ['issues'], migrations: ['migrations'], full: ['issues', 'migrations'] };
const placements = { 'backlog:archive': 'Backlog', 'ready:current': 'Ready', 'in-progress:current': 'In Progress', 'done:current': 'Done', 'done:archive': 'Archive' };
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const disabledReferencePatterns = {
  issues: /\b(?:issuePrefix|issue[- ](?:tracking|tracker|board|skills?|module|workflow|profile)|(?:create|implement|close)-issue)\b|\bissues?\s+(?:are|is|can|may|could|must|should|when|if|field|metadata|record|template|module|workflow|profile|optional|required|enabled|disabled)\b|\b(?:with|without|enable|disable|track|use|add)\s+(?:an?\s+)?issues?\b|\bissues\//i,
  migrations: /\b(?:migration|upgrade)[ -]guides?\b|\b(?:docs\/)?migrations\/|\b(?:migration|migrations)\s+(?:module|workflow|profile|capability|are\s+(?:optional|enabled|disabled)|can\s+be\s+(?:added|enabled|disabled))\b|\b(?:enable|disable|add)\s+migrations?\b/i,
};

function validDate(value) {
  return typeof value === 'string' && datePattern.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function tree(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'node_modules', 'coverage'].includes(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? tree(path) : [path];
  });
}

function markdown(content) {
  const links = [];
  const headings = [];
  marked.walkTokens(marked.lexer(content), token => {
    if (token.type === 'link' || token.type === 'image') links.push(token.href);
    if (token.type === 'heading') headings.push({ depth: token.depth, text: token.text });
  });
  return { links, headings };
}

function slug(text) {
  return text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/ /g, '-');
}

function anchors(content) {
  const counts = new Map();
  return markdown(content).headings.map(heading => {
    const base = slug(heading.text);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  });
}

function frontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  if (!match) throw new Error('Missing YAML frontmatter');
  const data = parse(match[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a mapping');
  return data;
}

function boardEntries(content) {
  const entries = [];
  for (const token of marked.lexer(content)) {
    if (token.type !== 'table' || token.header.map(cell => cell.text).join('|') !== 'Ready|In Progress|Done') continue;
    for (const row of token.rows) {
      row.forEach((cell, index) => {
        for (const href of markdown(cell.text).links) entries.push({ href, location: ['Ready', 'In Progress', 'Done'][index] });
      });
    }
  }
  for (const match of content.matchAll(/<details>\s*<summary>(?:<strong>)?(Backlog|Archive)(?:<\/strong>)?<\/summary>([\s\S]*?)<\/details>/g)) {
    for (const href of markdown(match[2]).links) entries.push({ href, location: match[1] });
  }
  return entries;
}

export function checkRepository(directory) {
  const root = resolve(directory);
  const errors = [];
  const fail = (file, message) => errors.push(`${relative(root, file)}: ${message}`);
  const files = tree(root);
  const markdownFiles = files.filter(file => extname(file) === '.md');
  const documents = new Map();
  for (const file of markdownFiles) {
    const content = readFileSync(file, 'utf8');
    documents.set(file, content);
    if (/[\t ]+$/m.test(content) || !content.endsWith('\n')) fail(file, 'Trailing whitespace or missing final newline');
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    for (const href of markdown(body).links) {
      if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) continue;
      try {
        const [targetPart, fragment] = href.split('#');
        const target = targetPart ? resolve(dirname(file), decodeURIComponent(targetPart)) : file;
        if (!existsSync(target)) fail(file, `Broken link: ${href}`);
        else if (fragment && extname(target) === '.md' && !anchors(readFileSync(target, 'utf8')).includes(decodeURIComponent(fragment))) fail(file, `Broken fragment: ${href}`);
      } catch (error) { fail(file, `Invalid link ${href}: ${error.message}`); }
    }
  }
  for (const area of ['docs', 'issues']) {
    const areaRoot = join(root, area);
    if (!existsSync(areaRoot)) continue;
    const visit = directoryPath => {
      const index = join(directoryPath, 'README.md');
      if (!existsSync(index)) { fail(index, 'Missing directory index'); return; }
      const content = readFileSync(index, 'utf8').replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
      const links = markdown(content).links;
      if (!links.includes('../README.md')) fail(index, 'Missing parent link');
      for (const child of readdirSync(directoryPath, { withFileTypes: true })) {
        if (child.name === 'README.md') continue;
        const childPath = join(directoryPath, child.name);
        if (child.isDirectory()) visit(childPath);
        if (child.isDirectory() || child.name.endsWith('.md')) {
          const target = child.isDirectory() ? `${child.name}/README.md` : child.name;
          if (!links.some(href => decodeURIComponent(href.split('#')[0]) === target)) fail(index, `Unindexed child: ${target}`);
        }
      }
    };
    visit(areaRoot);
  }
  const configFile = join(root, '.github/cdd.json');
  let config;
  if (existsSync(configFile)) {
    try {
      config = JSON.parse(readFileSync(configFile, 'utf8'));
      if (config.version !== 1 || !Object.hasOwn(profiles, config.profile)) throw new Error('Invalid version or profile');
      if (typeof config.integrationBranch !== 'string' || !config.integrationBranch.trim()) throw new Error('Missing integrationBranch');
      if (profiles[config.profile].includes('issues') && !/^[A-Z][A-Z0-9]*$/.test(config.issuePrefix ?? '')) throw new Error('Invalid issuePrefix');
      const required = ['README.md', '.github/copilot-instructions.md', '.github/skills/initialize-repository/SKILL.md', '.github/skills/initialize-repository/references/baseline.md', 'docs/README.md', 'docs/collaboration.md', 'docs/documentation.md', 'docs/adr/README.md'];
      if (profiles[config.profile].includes('issues')) {
        required.push('issues/README.md');
        required.push(...['create-issue', 'implement-issue', 'close-issue'].map(name => `.github/skills/${name}/SKILL.md`));
      }
      if (profiles[config.profile].includes('migrations')) required.push('docs/migrations/README.md');
      for (const path of required) if (!existsSync(join(root, path))) fail(configFile, `Missing profile path: ${path}`);
      const enabled = new Set(profiles[config.profile]);
      const disabledPaths = {
        issues: ['issues', ...['create-issue', 'implement-issue', 'close-issue'].map(name => `.github/skills/${name}`)],
        migrations: ['docs/migrations'],
      };
      for (const [module, paths] of Object.entries(disabledPaths)) {
        if (enabled.has(module)) continue;
        for (const path of paths) if (existsSync(join(root, path))) fail(configFile, `Disabled module artifact: ${path}`);
        for (const [file, content] of documents) {
          const path = relative(root, file).replaceAll('\\', '/');
          if (path.startsWith('.github/skills/initialize-repository/')) continue;
          if (disabledReferencePatterns[module].test(content)) fail(file, `References disabled module: ${module}`);
        }
      }
    } catch (error) { fail(configFile, error.message); }
  } else fail(configFile, 'Missing project configuration');

  const skills = join(root, '.github/skills');
  if (existsSync(skills)) for (const name of readdirSync(skills)) {
    const file = join(skills, name, 'SKILL.md');
    try {
      if (!existsSync(file)) throw new Error('Missing SKILL.md');
      const data = frontmatter(readFileSync(file, 'utf8'));
      if (data.name !== name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name) || data.name.length > 64) throw new Error('Skill name must match its directory');
      if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024 || typeof data['argument-hint'] !== 'string') throw new Error('Missing or invalid discovery fields');
    } catch (error) { fail(file, error.message); }
  }

  function records(area, kind) {
    const recordsList = [];
    for (const [file, content] of documents) {
      if (dirname(file) !== join(root, area) || basename(file) === 'README.md') continue;
      try {
        const data = frontmatter(content);
        const idPattern = kind === 'issue' ? /^[A-Z][A-Z0-9]*-\d{4,}$/ : /^adr-\d{4,}$/;
        if (!idPattern.test(data.id) || !basename(file).startsWith(`${data.id}-`) || !/^[A-Za-z0-9]+-\d{4,}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(basename(file))) throw new Error('ID and stable filename mismatch');
        if (typeof data.title !== 'string' || !data.title.trim() || !validDate(data.createdDate)) throw new Error('Invalid title or creation date');
        const headings = markdown(content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')).headings;
        const headingID = kind === 'adr' ? data.id.toUpperCase() : data.id;
        if (!headings.some(heading => heading.depth === 1 && heading.text.startsWith(`${headingID}: `))) throw new Error('Missing matching ID heading');
        const sections = kind === 'issue' ? ['Reason', 'Description', 'Acceptance Criteria', 'Proof of Success', 'Implementation Plan', 'References'] : ['Context', 'Decision', 'Consequences', 'Alternatives'];
        for (const section of sections) if (!headings.some(heading => heading.depth === 2 && heading.text === section)) throw new Error(`Missing section: ${section}`);
        if (!markdown(content).links.includes('README.md')) throw new Error('Missing record index backlink');
        recordsList.push({ file, content, data });
      } catch (error) { fail(file, error.message); }
    }
    return recordsList;
  }

  const issues = records('issues', 'issue');
  const boardPath = join(root, 'issues/README.md');
  const entries = existsSync(boardPath) ? boardEntries(readFileSync(boardPath, 'utf8')) : [];
  if (existsSync(boardPath)) {
    const boardContent = readFileSync(boardPath, 'utf8');
    const tables = marked.lexer(boardContent).filter(token => token.type === 'table' && token.header.map(cell => cell.text).join('|') === 'Ready|In Progress|Done');
    if (tables.length !== 1 || !tables[0].rows.length) fail(boardPath, 'Require exactly one nonempty Ready/In Progress/Done table');
    for (const location of ['Backlog', 'Archive']) {
      const summaries = [...boardContent.matchAll(/<summary>(?:<strong>)?(Backlog|Archive)(?:<\/strong>)?<\/summary>/g)];
      if (summaries.filter(match => match[1] === location).length !== 1) fail(boardPath, `Require exactly one ${location} section`);
    }
  }
  const issueIDs = new Set();
  for (const { file, content, data } of issues) {
    if (issueIDs.has(data.id)) fail(file, 'Duplicate issue ID');
    issueIDs.add(data.id);
    if (config?.issuePrefix && !data.id.startsWith(`${config.issuePrefix}-`)) fail(file, 'Wrong issue prefix');
    const placement = placements[`${data.status}:${data.board}`];
    if (!placement) fail(file, 'Invalid status/board combination');
    if (data.status === 'done' ? !validDate(data.closedDate) || data.closedDate < data.createdDate : data.closedDate !== null) fail(file, 'Invalid closedDate for status');
    const found = entries.filter(entry => entry.href === basename(file));
    if (found.length !== 1 || found[0].location !== placement) fail(file, 'Board must list issue exactly once in its matching location');
    if (data.status === 'done' && /^- \[ \]/m.test(content)) fail(file, 'Done issue contains unchecked criteria');
  }
  for (const entry of entries) if (!issues.some(issue => basename(issue.file) === entry.href)) fail(boardPath, `Board entry is not an issue: ${entry.href}`);

  const adrs = records('docs/adr', 'adr');
  const adrMap = new Map();
  const adrIndex = join(root, 'docs/adr/README.md');
  const indexContent = existsSync(adrIndex) ? readFileSync(adrIndex, 'utf8') : '';
  const indexSections = new Map([...indexContent.matchAll(/^### (Proposed|Accepted|Superseded)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)].map(match => [match[1].toUpperCase(), markdown(match[2]).links]));
  for (const status of ['PROPOSED', 'ACCEPTED', 'SUPERSEDED']) {
    if (!indexSections.has(status)) fail(adrIndex, `Missing ADR status index: ${status}`);
  }
  for (const record of adrs) {
    const { file, data } = record;
    if (adrMap.has(data.id)) fail(file, 'Duplicate ADR ID');
    adrMap.set(data.id, record);
    if (!['PROPOSED', 'ACCEPTED', 'SUPERSEDED'].includes(data.status)) fail(file, 'Invalid ADR status');
    if (!Array.isArray(data.supersedes) || data.supersedes.some(id => typeof id !== 'string') || new Set(data.supersedes).size !== data.supersedes.length) fail(file, 'Invalid supersedes list');
    if (data.status === 'PROPOSED' ? data.acceptedDate !== null : !validDate(data.acceptedDate) || data.acceptedDate < data.createdDate) fail(file, 'Invalid acceptance date');
    if (data.status === 'SUPERSEDED' ? !validDate(data.supersededDate) || typeof data.supersededBy !== 'string' || data.supersededDate < data.acceptedDate : data.supersededDate !== null || data.supersededBy !== null) fail(file, 'Invalid supersession metadata');
    if (profiles[config?.profile]?.includes('issues')) {
      if (!Object.hasOwn(data, 'issue') || (data.issue !== null && (typeof data.issue !== 'string' || !issueIDs.has(data.issue)))) fail(file, 'Invalid originating issue');
    } else if (Object.hasOwn(data, 'issue')) fail(file, 'Issue field present while issues are disabled');
    const indexed = [...indexSections.values()].flat().filter(href => href === basename(file));
    if (indexed.length !== 1 || !indexSections.get(data.status)?.includes(basename(file))) fail(file, 'ADR must appear once under its status index');
  }
  for (const { file, data } of adrs) {
    for (const oldID of Array.isArray(data.supersedes) ? data.supersedes : []) {
      const old = adrMap.get(oldID);
      if (!old || oldID === data.id) fail(file, `Unknown or self supersedes: ${oldID}`);
      else if (data.status !== 'PROPOSED' && (old.data.status !== 'SUPERSEDED' || old.data.supersededBy !== data.id)) fail(file, 'Supersession must be reciprocal');
    }
    if (data.status === 'SUPERSEDED') {
      const replacement = adrMap.get(data.supersededBy);
      if (!replacement || replacement.data.status === 'PROPOSED' || !replacement.data.supersedes?.includes(data.id)) fail(file, 'Replacement must be accepted and reciprocal');
    }
    const seen = new Set([data.id]);
    let next = data.supersededBy;
    while (next && adrMap.has(next)) {
      if (seen.has(next)) { fail(file, 'Cyclic supersession'); break; }
      seen.add(next);
      next = adrMap.get(next).data.supersededBy;
    }
  }
  const migrationIndex = join(root, 'docs/migrations/README.md');
  const migrationLinks = existsSync(migrationIndex) ? markdown(readFileSync(migrationIndex, 'utf8')).links : [];
  let migrations = 0;
  for (const [file, content] of documents) {
    if (dirname(file) !== join(root, 'docs/migrations') || basename(file) === 'README.md') continue;
    migrations += 1;
    try {
      const data = frontmatter(content);
      if (!Number.isSafeInteger(data.fromMajor) || data.fromMajor < 0 || !Number.isSafeInteger(data.toMajor) || data.toMajor <= data.fromMajor) throw new Error('Invalid advancing major-version transition');
      if (basename(file) !== `v${data.fromMajor}-to-v${data.toMajor}.md`) throw new Error('Migration filename must match version metadata');
      if (typeof data.title !== 'string' || !data.title.trim() || !['draft', 'published'].includes(data.status)) throw new Error('Invalid migration title or status');
      const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      const tokens = marked.lexer(body);
      if (tokens.filter(token => token.type === 'heading' && token.depth === 1).length !== 1) throw new Error('Migration must have one H1');
      for (const section of ['Version Coverage', 'Breaking Changes', 'Update Steps', 'Before And After', 'Verification', 'Compatibility', 'References']) {
        const index = tokens.findIndex(token => token.type === 'heading' && token.depth === 2 && token.text === section);
        if (index < 0) throw new Error(`Missing migration section: ${section}`);
        const following = tokens.slice(index + 1);
        const next = following.findIndex(token => token.type === 'heading' && token.depth <= 2);
        const sectionBody = (next < 0 ? following : following.slice(0, next)).map(token => token.raw).join('').trim();
        if (!sectionBody) throw new Error(`Empty migration section: ${section}`);
      }
      if (!markdown(body).links.includes('README.md')) throw new Error('Missing migration index backlink');
      if (migrationLinks.filter(href => href === basename(file)).length !== 1) throw new Error('Migration must appear exactly once in its index');
    } catch (error) { fail(file, error.message); }
  }
  return { errors, markdownFiles: markdownFiles.length, issues: issues.length, adrs: adrs.length, migrations };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkRepository(process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
  else console.log(`Checked ${result.markdownFiles} Markdown files, ${result.issues} issues, ${result.adrs} ADRs, and ${result.migrations} migration guides.`);
}
