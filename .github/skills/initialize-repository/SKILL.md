---
name: initialize-repository
description: 'Initialize, audit, or extend a repository for conversation-driven development. Use /initialize-repository to establish collaboration, documentation, and ADRs, optionally add issues or migration guides, or safely reconcile an existing setup.'
argument-hint: 'Project scope, optional modules, or audit-only'
---

# Initialize Repository

Establish the contracts in [the portable baseline](./references/baseline.md). Read that reference before planning. It contains everything needed to author project-owned guidance and optional workflow skills without access to the original framework checkout.

## Phase 1: Inspect and Discuss

1. Identify the current target repository explicitly. Resolve ambiguity before proceeding; all generated guidance and records belong to this repository.
2. Read existing instructions, README, documentation, work records, decisions, configuration, and relevant code. Preserve outside changes.
3. Ask about purpose, scope, contributors, optional issue tracking, downstream consumers, migration-guide needs, and integration branch. ADR infrastructure is always included. Ask for an issue prefix only when issues are enabled and clarify version conventions when guides are enabled. Do not assume a tracker or branch named `main`.
4. Classify baseline items as present, missing, compatible, or conflicting. Treat existing compatible conventions as inputs. Discuss meaningful deviations and migration risks.
5. For an audit-only request, report findings and stop without writing. Otherwise present a concrete initialization plan with proof methods and wait for explicit approval. Invocation or silence is not approval.

## Phase 2: Initialize

1. After approval, establish core guidance, navigation, and the ADR index, lifecycle, and template. Create proposed decisions only after agreement on meaningful candidates. Record the agreed profile in `.github/cdd.json` and human-readable guidance.
2. Add only the agreed optional modules. For issues, establish the board and canonical template and author the three issue skills from the baseline contracts if not already staged. For migration guides, establish an index, conventions, and template; create a guide only for an agreed actual transition. Do not invent versions or releases.
3. On reruns, add missing capabilities and reconcile compatible content. Do not delete modules, reset IDs, replace custom skills, manufacture historical approvals, or duplicate trackers. Ask before migration or material deviation.
4. Generate project-facing instructions and docs from the selected profile. Remove disabled-module links, sections, descriptions, and references, including from the root README, docs index, always-on instructions, method pages, and ADR templates. The initializer skill and portable baseline may describe optional modules solely as setup capabilities; do not copy those explanations into project workflow guidance.
5. Update direct-child indexes, parent links, and inbound links. Without issues, record persistent approved plans and evidence in an indexed project-owned working record when a handoff needs one.

Use the smallest compatible edit. Do not delete, rename, or rewrite existing project knowledge merely to match wording in the baseline. When existing behavior conflicts with the baseline and intent is unclear, pause and ask the developer.

## Phase 3: Validate

1. Confirm required paths for the agreed modules exist; do not require disabled modules.
2. Parse each skill's YAML frontmatter. Verify that `name` matches its directory and that `description` clearly states when the skill applies.
3. Verify every local Markdown link resolves.
4. Verify every content directory under `docs/` and enabled `issues/` contains an indexed `README.md` with a parent link.
5. Search all project-facing docs and instructions for disabled-module references and remove them; verify enabled modules have complete links and indexes. Keep setup-capability explanations within the initializer skill and baseline only.
6. Run editor diagnostics and a whitespace check across all Markdown, including untracked files.
7. Review repository status and report the exact initialized or reconciled surface. Do not commit unless explicitly instructed.

## Completion Rules

- Follow the baseline's approval, metadata, and evidence contracts; summarize them in generated instructions rather than maintaining competing rules.
- ADRs are always included. Optional issues and migration guides are independent and additive; neither is required for a small project.
- Do not accept an ADR, close work, commit, publish, or select a target-project license merely because initialization completed.
