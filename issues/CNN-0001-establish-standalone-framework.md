---
id: CNN-0001
title: Establish the standalone framework
status: done
board: current
createdDate: 2026-10-25
closedDate: 2026-10-25
---

# CNN-0001: Establish the Standalone Framework

[Back to issue board](README.md)

## Reason

The extracted initializer is incomplete and carries assumptions from its original environment. Make the method independently understandable, adoptable, and usable in this repository itself.

## Description

Establish canonical method documentation, single-repository initialization, independent workflow skills, copy-based adoption, MIT licensing, and focused validation. Use `CNN` for this repository's issues and configurable prefixes downstream. Support VS Code/Copilot first while keeping the method editor-independent.

ADRs are part of every initialization. Issues and migration guides are optional and can be added on a later run. This repository enables both optional modules. Migration guides describe actual major-version transitions for downstream consumers; do not invent a historical transition or release. Preserve existing knowledge and explicit approval gates. Do not import domain content, add release-planning metadata, implement other editor integrations, commit, push, or merge.

## Acceptance Criteria

- [x] The root explains the method, adoption, and navigation; verify local links and indexed directories.
- [x] This repository follows its own collaboration, issue, ADR, and migration conventions; inspect instructions, board, metadata, indexes, and decision records.
- [x] No original-project names, paths, or IDs remain; scan tracked and new content.
- [x] Every initialized profile requires ADR infrastructure; exercise core, issues, migrations, and full output contracts.
- [x] Later issue/migration addition and repeat adoption preserve existing content; verify conflict and repeat-run fixtures.
- [x] Issue and ADR skills define approval, triage, metadata, verification, and supersession consistently for the current repository; exercise lifecycle fixtures.
- [x] Optional migration guides define version coverage, breaking changes, update steps, examples, verification, compatibility, and references; exercise valid and invalid guide fixtures without inventing a release here.
- [x] Adoption is copy-only and all guidance concerns the current repository; inspect configuration, CLI, skills, documentation, and tests.
- [x] When migration guides are enabled, `/close-issue` reviews consumer-facing breaking changes, proposes warranted guides, and waits for approval before authoring; inspect the canonical contract and regression test.
- [x] Project-facing README, indexes, always-on instructions, and method guidance mention only enabled workflows; verify disabled issues/migration modules leave no user-facing references or dangling links.
- [x] MIT licensing and focused repository checks are present; run the checks and record their limits.
- [x] `/close-issue` proposes exactly one commit message on one line, beginning with the current issue's full ID and a colon; verify the skill contract.

## Proof of Success

- 2026-10-25: The developer approved the proposed six-part plan, including the recommended licensing direction, and explicitly requested implementation using issue `CNN-0001`. This is the bootstrap authorization to establish the missing tracker and instructions. No source-project files are copied verbatim; reusable workflows are independently expressed here.

### Scope Approval And Verification

- 2026-10-25: The developer explicitly approved the revised implementation plan below: ADRs always included, optional issues and migration guides, and single-repository copy-only adoption. Earlier verification is historical and does not establish delivery of this revision. Revalidate all affected criteria.
- 2026-10-25: The developer approved adding a close-out migration review. When guides are enabled, identify evidence-backed consumer breaking changes and a real major-version transition, check for an existing guide, propose scope and verification, and wait for explicit approval before authoring. Do not infer version boundaries, release authorization, or scope expansion. Record a justified no-guide outcome or an explicit deferral.
- `npm test`: 23 tests passed on Linux with Node.js v26.5.1. Core, issues, migrations, and full representative outputs all include ADR infrastructure. Tests also cover read-only preview, copy conflicts, repeat runs, nested paths with spaces, additive module upgrades, preserved custom configuration, and adding migrations without issues or changing an existing accepted ADR.
- Migration fixtures validate draft and published structure and reject non-advancing major versions, filename/metadata disagreement, missing or empty required sections, and duplicate index entries. These are synthetic fixtures, not project release claims.
- The close-issue workflow contract and regression test require migration review, an evidence-backed proposal, explicit approval before authoring, no inferred major-version boundary, and an explicit outcome for disabled or deferred guide work. This tests instructions, not an agent's judgment about a real consumer contract.
- After adding the close-out gate: `npm run check` passed for 18 Markdown files, one issue, one proposed ADR, and zero migration guides; `npm test` passed all 24 tests; `git diff --check` passed; editor diagnostics reported no errors.
- Local lifecycle fixtures cover all five issue placements, invalid and duplicate board entries, ADR acceptance and reciprocal supersession, replacement cycles, malformed YAML, impossible dates, broken links/fragments, and missing indexes.
- `npm run check`: passed for 18 Markdown files, one in-progress issue, one proposed ADR, and zero migration guides. The real migration index contains conventions and an embedded template, not a fabricated version transition.
- All four skill frontmatters parse as YAML and match their directory names. Local documentation links resolve; editor diagnostics report no errors.
- `git diff --check`: passed. A content scan identified and removed the stale ADR lifecycle ownership sentence; the active documentation, configuration, tooling, and fixtures now describe only project-owned records in the current repository.
- Final `npm run check` and `npm test` rerun: passed, with 23 tests and the same document/record counts. `node scripts/adopt.mjs --dry-run --profile full .` reported only the framework-license-notice addition and made no changes. `git diff --check` passed.
- Case-insensitive content scan excluding Git internals and dependencies: no original-project identifiers or retired setup references found. Final editor diagnostics: no errors.
- MIT licensing remains unchanged. No commit, push, merge, publication, closure, ADR acceptance, or archiving was performed.
- 2026-10-25: The developer selected `masus` as the holder named in the MIT notice. No trademark notice or trademark claim is included.
- Profile-specific guidance is explicit in the initializer and baseline. The validator checks project-facing Markdown and disabled module artifacts against `.github/cdd.json`; the portable initializer skill and baseline are exempt because they describe setup options. Issue skills defer to applicable baseline rules, so issues-only installations omit migration-guide workflow text. `npm run check` passed for 18 Markdown files, one issue, one proposed ADR, and zero migration guides; `npm test` passed 26/26; `git diff --check` passed; editor diagnostics reported no errors.
- 2026-10-25 close-out review: Reviewed the delivered framework, consumer-facing contracts, package metadata, and migration index. This private package is version `0.1.0`, has no version tags or published major-version transition, and the migration index contains no guide. No consumer-facing breaking transition is identified; a migration guide is not warranted. Final `npm run check` passed for 18 Markdown files, one issue, one proposed ADR, and zero migration guides; `npm test` passed 26/26; `git diff --check` passed.
- 2026-10-25: The developer explicitly instructed acceptance of the complete ADR-0001 and closure of this issue. ADR-0001 is `ACCEPTED` with `acceptedDate: 2026-10-25`; CNN-0001 is `done + current` with `closedDate: 2026-10-25`.
- Post-acceptance close-out validation on 2026-10-25: `npm run check` passed for 18 Markdown files, one done issue, one accepted ADR, and zero migration guides; `npm test` passed 26/26; `git diff --check` passed; editor diagnostics reported no errors.
- 2026-10-25: The developer requested reopening this issue for the small addition that `/close-issue` propose one commit message line with the current issue's full ID prefix. The explicit request supplies authorization for this bounded correction; the previously completed scope and accepted ADR remain unchanged.
- The close-issue skill and portable baseline now require exactly one single-line subject beginning with the exact `id` from the current issue metadata, including its configured prefix. The regression test verifies this contract. `npm run check` passed; `npm test` passed 27/27; `git diff --check` and `git diff --cached --check` passed; editor diagnostics reported no errors.
- 2026-10-25 close-out review: The addendum changes maintainer workflow guidance and its regression test only; it introduces no consumer-facing product/API or version change. No new migration guide is warranted. Final `npm run check` passed for 18 Markdown files, one done issue, one accepted ADR, and zero migration guides; `npm test` passed 27/27; staged and unstaged `git diff --check` passed; editor diagnostics reported no errors.
- 2026-10-25: The developer invoked `/close-issue` for CNN-0001. The issue is closed as `done + current` with `closedDate: 2026-10-25`; ADR-0001 remains accepted with its original acceptance date.

### Limitations

Fixtures are representative initialized outputs, not evidence that a separate agent session successfully performed initialization. A live downstream VS Code/Copilot initialization, real consumer migration, and non-Linux adoption remain unverified and are explicitly documented in the adoption guide. Node.js 22 is the declared tooling minimum; this run used v26.5.1, not every supported runtime. Structural guide validation does not establish release authorization or upgrade correctness.

## Implementation Plan

Revised plan explicitly approved 2026-10-25; the final step was updated on 2026-10-25 per the developer's explicit close-out instruction:

1. Reconcile this issue's scope, criteria, and evidence with the approved revision; retain in-progress status.
2. Make ADR infrastructure mandatory and issues/migrations independently optional. Update the portable baseline, guidance, skills, configuration, and proposed ADR together.
3. Simplify adoption to project-owned copies and current-repository work. Preserve preview, conflict protection, and additive module upgrades.
4. Establish an indexed migration-guide convention and template for actual major-version transitions; enable the module here without fabricating a guide.
5. Update focused fixtures for every profile, module addition, adoption safety, local lifecycle relationships, migration contracts, and close-out guide proposal approval. Run required checks and record concrete proof and limits.
6. Ensure generated project-facing guidance contains only enabled modules; preserve optional-module instructions only within the initializer's meta-level contract for future extension.
7. Accept ADR-0001 with explicit developer confirmation, complete final focused validation, and close this issue as done/current. Closure does not authorize a commit, merge, or publication.

Reopened addendum, explicitly requested 2026-10-25:

1. Require the close-issue skill and portable baseline to propose exactly one single-line commit message with the current issue's full ID and colon prefix.
2. Add a regression assertion and validate the focused contract; run repository checks, record proof, and close CNN-0001 as done/current through `/close-issue`.

## References

- [Initializer](../.github/skills/initialize-repository/SKILL.md)
- [Method](../docs/method.md)
- [Adoption and verification](../docs/adoption.md)
- [Migration conventions and template](../docs/migrations/README.md)
- [Accepted modular-adoption decision](../docs/adr/adr-0001-modular-standalone-adoption.md)
- [Adoption tooling](../scripts/adopt.mjs)
- [Repository checker](../scripts/check.mjs)
- [Contract tests](../test/framework.test.mjs)
