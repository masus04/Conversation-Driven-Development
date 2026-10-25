# Adoption

[Back to documentation](README.md)

## Install Project-Owned Skills

Copy `.github/skills/initialize-repository/` with all its references into the project's `.github/skills/`. Preserve the MIT notice alongside copied material. The bundle is sufficient to discuss and initialize a project without access to this checkout. The initializer can author the optional issue skills from its baseline when that module is approved.

Alternatively, Node.js 22+ can stage the selected skills from this checkout:

```sh
node scripts/adopt.mjs --dry-run /path/to/project
node scripts/adopt.mjs /path/to/project
node scripts/adopt.mjs --profile full /path/to/project
```

Profiles are documented in [initialization](initialization.md). Staging skills does not generate project guidance, accept decisions, or approve implementation. Open the target in VS Code/Copilot, invoke `/initialize-repository`, and discuss the proposed initialization. Track project-owned copies in version control; updates are intentional reviewable changes, not automatic synchronization.

The tool preflights all destinations before writing, accepts byte-identical files on reruns, adds missing files, and refuses conflicting content or links. It never overwrites customized skills. For an update, compare upstream changes and reconcile them explicitly; do not delete project knowledge to bypass a conflict. Profile upgrades are additive. Interrupted or concurrent operations can still leave partial additions; inspect and rerun after resolving the cause.

## Extend An Existing Setup

ADRs are always part of initialization. To add optional issues or migration guidance, rerun staging with `--profile issues`, `--profile migrations`, or `--profile full`, then invoke `/initialize-repository` and approve the additions. The tool only stages skills and records the requested profile; the agent establishes the selected documentation and records after agreement.

`.github/cdd.json` records the additive profile. Initialization records the agreed integration branch and issue prefix if issues are enabled. All instructions, skills, issues, decisions, and guides belong to the current repository. The tool does not edit ignore rules, hide changes, or select a license for the project.

## Licensing

The framework is MIT licensed. Copy the notice with redistributed material; the adoption tool puts it in `.github/cdd-LICENSE`. This does not select or replace the target project's own license. New projects must choose their own licensing and rights policy.

## Verification

In this repository, run `npm ci`, `npm run check`, and `npm test`. YAML is parsed with the `yaml` package and Markdown with `marked`; no hand-written YAML parser is used. The checker includes untracked files outside `.git`, `node_modules`, and `coverage`, validates local links and fragments, frontmatter, indexes, board placement, ADR relationships, and migration-guide structure. It cannot prove historical approvals, post-merge immutability, or that guide instructions succeed for real consumers; review those against evidence and Git history.

Tests use disposable directories for copy staging, preview, conflicts, repeat runs, profile upgrades, mandatory ADRs, optional migrations, and positive and negative lifecycle records. A contract test checks that `/close-issue` includes the migration review, proposal, and approval gate; it cannot determine whether a real code change breaks a consumer contract. Generated representative fixtures test the documented output contract, not the ability of an LLM to produce that output. Live agent-mediated downstream initialization remains a manual acceptance exercise: initialize core, rerun with issues or migrations, inspect the diff and approvals, and verify existing content remains intact.

Linux is the tested adoption environment. Other operating systems and editor integrations are not yet certified.
