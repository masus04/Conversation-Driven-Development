# Portable Initialization Contract

This is the canonical, self-contained contract for generating project-owned guidance in the current repository. Preserve compatible conventions and discuss deviations. No original checkout, project identity, or external tool is required to use this reference.

## Profiles And Surface

Core requires `README.md`, `.github/copilot-instructions.md`, this initializer and reference, `.github/cdd.json`, `docs/README.md`, `docs/collaboration.md`, `docs/documentation.md`, and `docs/adr/README.md`. ADR infrastructure is mandatory from the start; records are created only for agreed consequential decision candidates.

The `issues` profile adds `issues/README.md` and `.github/skills/create-issue/SKILL.md`, `implement-issue/SKILL.md`, and `close-issue/SKILL.md`. Issue records are created only for agreed work.

The `migrations` profile adds `docs/migrations/README.md` with an index, conventions, and template. `full` enables both optional issues and migration guides. Do not require disabled modules or dangling links to them. Profiles are additive on reruns; removing a module requires separate agreement.

The root README explains the project and links to its docs, repository instructions, and enabled indexes. Every content directory under `docs/` and enabled `issues/` has a `README.md` with a parent link and direct-child index. Keep stable issue and ADR filenames and repair inbound links when other content moves.

### Profile-Specific Project Guidance

Generate project-facing guidance for the selected profile, not for the framework's superset of capabilities. In the target project's README, indexes, always-on instructions, method/collaboration/documentation guidance, and other ordinary workflow docs, include only modules that are enabled. When issues are disabled, do not link to, index, describe, or instruct users to use an issue board or issue skills. When migration guides are disabled, do not link to, index, describe, or instruct users to use migration guides. Do not leave empty sections, placeholder links, template references, or prose explaining that a disabled module could be added later. ADRs are always enabled and should be referenced consistently.

This restriction applies to project-facing guidance, not the portable initializer's own skill and baseline. Those meta-level setup instructions must describe optional profiles so an operator can intentionally add a module in a later approved run. Keep that capability clearly separate from the target repository's active workflow and do not copy broad meta-level explanations into its generated instructions.

When generating an enabled module's skills, include only applicable workflow requirements. In particular, issue skills must not retain conditional text naming a disabled module; put cross-module conditional requirements in the portable baseline and have project skills defer to applicable local contracts.

On an additive rerun, an already installed module remains enabled even if a narrower profile is requested; do not hide or delete its links or instructions. Removing an installed module requires a separately approved migration that removes its content and references together. Never create a configuration that marks an installed module disabled while leaving its guidance visible.

## Configuration And Adoption

`.github/cdd.json` is a JSON object: `version: 1` and `profile: "core"`, `"issues"`, `"migrations"`, or `"full"`. Initialization records `integrationBranch` as a nonempty string and `issuePrefix` as an uppercase alphanumeric string starting with a letter when issues are enabled. Ask the developer for these values; never embed a source-project prefix or assume a branch. Preserve compatible project-specific configuration.

Copy skills and references into the project. All instructions, skills, issues, ADRs, and guides belong to the current repository. Resolve an ambiguous target with the developer. If required context is missing or inconsistent, stop dependent work instead of inventing another tracker.

Generate local instructions with correct context and navigation. Keep adoption changes visible to Git. Preserve license notices; do not choose the target project's own license without agreement. Preflight destination conflicts, preserve customized content, and make previews read-only. Updates are intentional reconciliations, not forced replacement.

## Collaboration And Knowledge

Generate concise always-on instructions linking to canonical project guidance. Developers and agents collaboratively investigate, propose alternatives, and challenge assumptions. Developers control direction, consequential approvals, commits, merges, and publication.

The work cycle is understand, discuss, agree, implement, verify, reconcile. Present a concrete plan with acceptance criteria, implementation, evidence, documentation, risks, and decision candidates; wait for explicit approval before implementation. Invocation, silence, edits, and commits do not establish approval. A fully specified explicitly requested small correction may itself provide authorization; planning-first requests do not. Material departures require renewed agreement.

Without issues, keep approved plans and proof in the conversation; before a handoff or context loss, save a concise project-owned working record linked from the docs index. Do not force issue tracking. With issues, read the named or relevant issue before dependent work or resumption. Keep current requirements and the active plan reconciled after agreement; preserve dated material approvals without competing historical instructions.

Documentation explains intent, constraints, architecture, workflows, and non-obvious behavior. Code and verified evidence establish delivered behavior; procedural specifications establish intended workflow. Distinguish proposed design, accepted decisions, and verified delivery. Give each concept a canonical home, link to owning code, and reconcile stale knowledge with the change that exposes it. Mark factual uncertainty `[to be verified]` and unselected choices `[open design decision]`; record evidence needs in the work record. Ideas do not authorize implementation. Do not publish private context without explicit permission.

## Issue Contract

Keep all issues directly in `issues/`. Use `<PREFIX>-NNNN-short-title.md` with matching string `id`, at least four digits, and a concise kebab-case title. Allocate the next ID from all existing issue filenames regardless of status; never reuse a number. Resolve concurrent collisions before creation. Agree the prefix during initialization.

The canonical template lives in `issues/README.md`. It contains YAML fields `id`, `title`, `status`, `board`, `createdDate`, `closedDate`. Dates are ISO `YYYY-MM-DD` strings; unset dates are explicit YAML `null`. The H1 begins with the matching ID. Include a board backlink and body sections Reason, Description, Acceptance Criteria, Proof of Success, Implementation Plan, References. Record boundaries and non-goals in Description. Keep plan and evidence separate.

Acceptance criteria fix the agreed outcome before work starts and are only useful when each can be verified without interpretation. Keep them few, each stating one observable end state with a repeatable proof: a command or test, an inspectable artifact at a stated location, a measurement with a threshold, or a dated developer acceptance. Put judgment into one developer-acceptance criterion instead of several overlapping quality criteria. Constraints belong in Description, execution steps such as commits, merges, or removals in the plan, and repository-wide hygiene checks such as links, indexes, and formatting apply to every issue without being listed. When the agreed outcome changes, revise the affected criteria with the developer; never mark a criterion complete under a new interpretation.

The board uses a Ready / In Progress / Done Markdown table and collapsible HTML `details` sections named Backlog and Archive. Empty locations use `_No issues._`. Metadata is authoritative; list every issue exactly once in the matching location, sorted by ID, with `<br>` between table-cell links and list items in details sections.

| Status | Board | Location |
|:--|:--|:--|
| `backlog` | `archive` | Backlog |
| `ready` | `current` | Ready |
| `in-progress` | `current` | In Progress |
| `done` | `current` | Done |
| `done` | `archive` | Archive |

`archive` means outside current scope, not necessarily completed. Other combinations are invalid. Update metadata and board together without moving files. Developer-directed triage promotes backlog to ready; do not infer triage from an implementation invocation. Archive completed work only on developer direction, not automatically at closure. `closedDate` is null until done and then set to the closure date. Product-specific planning fields are extensions, not defaults.

## ADR Contract

Keep all ADRs directly in `docs/adr/`, with Proposed, Accepted, Superseded indexes and a canonical template in its README. Allocate `adr-NNNN-short-title.md` across every status without reusing IDs. Metadata fields are `id` (lowercase `adr-NNNN`), `title`, `status`, `createdDate`, `acceptedDate`, `supersededDate`, `supersededBy`, `supersedes`, `issue`. Use string IDs, ISO date strings or explicit `null`, `supersedes` as an array of IDs, and singular references as an ID or `null`. Include an H1 beginning with `ADR-NNNN`, a parent link, and Context, Decision, Consequences, Alternatives sections.

- `PROPOSED`: Mutable, with null acceptance and supersession fields. Create only after agreement on a meaningful candidate.
- `ACCEPTED`: Requires explicit developer confirmation of the entire decision. Set its actual acceptance date and update the index and originating work record. Acceptance can occur during implementation or closure and does not prove delivery. Material revisions before merge require renewed confirmation.
- `SUPERSEDED`: Replace only through an accepted ADR. The old record receives status, `supersededDate`, and `supersededBy`; the replacement lists the old ID in `supersedes`. Keep links reciprocal and chains acyclic.

After merge to the configured integration branch, accepted decision content is immutable. Only supersession status and metadata may change in the old record. Preserve acceptance dates. A decision not to act can be accepted; do not invent a rejected status. Remove an abandoned unmerged proposal only with agreement when no meaningful decision would be lost.

When issues are enabled, the `issue` field is the originating issue ID or `null`. Context links to that issue or the approved working record; issues link back under References. When issues are disabled, omit the `issue` field and issue-specific prose from the generated ADR template and guidance. Keep rationale in the ADR and delivery proof in the work record. Do not expose private links from public records.

## Migration Guide Contract

Ask whether the project has downstream consumers, what version convention it uses, and whether guides are needed now. Guides are optional and can be added later without issue tracking. Establish `docs/migrations/README.md` with a parent link, direct-child index, conventions, and an embedded canonical template. An empty index is valid when there is no agreed actual transition; never invent historical versions or releases.

Keep one guide per major-version transition directly in that directory, named `v<fromMajor>-to-v<toMajor>.md`, such as `v1-to-v2.md`. Metadata contains nonempty string `title`, nonnegative integer `fromMajor`, integer `toMajor` greater than `fromMajor`, and string `status` (`draft` or `published`). The filename must match the metadata. Include one H1, an index backlink, and nonempty body sections Version Coverage, Breaking Changes, Update Steps, Before And After, Verification, Compatibility, References.

Version Coverage specifies exact supported source ranges, targets, affected consumers, and whether the transition is upcoming or released. Breaking Changes identifies impact and required action. Update Steps gives ordered concrete actions; Before And After demonstrates updated usage. Verification provides commands/checks and expected results. Compatibility states prerequisites, supported combinations, and limitations. References links to relevant contracts, decisions, release material, and available proof. Use examples appropriate to the consumer-facing API, configuration, workflow, or method rather than copying a changelog.

Drafts describe agreed upcoming transitions and do not assert a release. Publishing requires explicit developer authorization and evidence for the documented target; implementing the guide is not release authorization. Validate examples against affected versions and record proof in the governing issue or working record. Structural checks cannot prove real consumer upgrades. Update affected guides with breaking changes, index each guide once, preserve published paths, and repair inbound links. When adding guides later, ask which existing transitions require documentation and verify their facts.

At issue close-out, review delivered behavior and consumer-facing contracts for changes that warrant an actual major-version guide. Use supported-version and behavior evidence; a breaking change alone does not establish a major transition. Check for an existing guide and record why none is warranted when applicable. If a guide is warranted, propose its source and target versions, affected consumers, changes, ordered update steps, before/after examples, verification, compatibility, and evidence. Wait for explicit approval before authoring; reconcile issue scope and plan first if approved. Ask how to track or defer out-of-scope work, and record declines or deferrals with remaining risk. Never infer release authorization. Skip this review when the guide module is disabled.

## Issue Skill Contracts

Each skill has valid YAML frontmatter with directory-matching `name`, a quoted discovery-oriented `description`, and `argument-hint`. Include procedures and approval boundaries, not merely a list of goals. The skills read the current repository's tracker conventions and this baseline instead of embedding repository names. Omit any conditional workflow whose module is disabled.

### Create Issue

Read context and existing work to avoid duplication. Discuss reason, desired outcome, scope, constraints, dependencies, meaningful alternatives, and acceptance criteria that follow the issue contract. Resolve high-level ambiguity and obtain agreement before allocating an ID or writing. Create a backlog/archive issue from the canonical template and update Backlog. Do not implement or create speculative ADRs.

### Implement Issue

Require an unambiguous ready/current issue. Read the issue and owning implementation paths, documentation, tests, and decisions read-only. Present a plan covering implementation, proof, docs, cleanup, risks, and ADR candidates. Pause for explicit approval; no implementation files, ADR creation, or status change before that gate. After approval, record the active plan, move to in-progress/current, create agreed proposed ADRs, implement and validate focused behavior, reconcile applicable documentation and enabled workflow guidance, and record proof. Seek renewed approval for material changes. Explicit complete ADR acceptance may happen during implementation; preserve dates and distinguish it from delivery. Do not close or commit.

### Close Issue

Require an unambiguous in-progress/current issue. Run the repository's standing checks, then verify every current acceptance criterion and record concrete evidence; unsupported criteria or material unapproved deviations leave it in progress. Propose revising a criterion that no longer fits the agreed outcome instead of reinterpreting it. Apply enabled-module close-out requirements from this baseline, including any required reviews, approvals, evidence, and documentation updates. Reconcile affected knowledge and indexes; clean up only issue-scoped artifacts. Finalize linked ADRs with explicit confirmation, preserving earlier acceptance dates and updating reciprocal supersession metadata. Resolve proposed decisions rather than silently accepting them. Run focused validation, mark done/current with a closure date, update the board, and inspect the diff. Propose exactly one single-line commit message beginning with the exact `id` value from the current issue's metadata, including its configured prefix, followed by a colon. Do not infer or copy an ID from another issue, and do not include a body or alternative subjects. Do not archive, commit, push, merge, or publish without separate authorization.

## Initialization Verification

Validate the selected surface, configuration, YAML, IDs, links, indexes, board placement, ADRs, and enabled migration guides, including untracked content. Review actual approvals, guide accuracy, and historical immutability separately. Preserve compatible user content on repeats and module additions; report conflicts without overwriting. Audit-only mode makes no changes. Report checks, limitations, and the exact changed surface; never claim deterministic tooling proves an agent followed the method.
