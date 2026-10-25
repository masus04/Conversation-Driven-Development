# Repository Instructions

This repository develops and demonstrates Conversation-Driven Development. Read [the method](../docs/method.md) and follow [collaboration](../docs/collaboration.md). Developers retain authority over direction, approvals, publication, and commits. Discuss consequential alternatives constructively.

## Work Context

ADRs are always included. This repository uses the full profile with optional issues and migration guides enabled. Read the [board](../issues/README.md), identify the governing issue, and read its active scope, plan, approvals, and evidence before dependent changes or resumption. Keep unrelated work separate; agree on scope before creating another issue. Existing changes and commit messages do not establish approval.

Use `/create-issue`, `/implement-issue`, and `/close-issue` for issue work. Do not implement or mark work in progress before explicit approval of its concrete plan. Stop for renewed agreement on material changes. A small unrelated correction may be handled directly after checking the board and stating why it cannot affect an active issue.

## Knowledge And Ownership

Use [documentation practice](../docs/documentation.md), keeping concepts canonical, indexes traversable, and delivered claims grounded in evidence. Code is authoritative for implemented behavior; this repository's procedural contracts are specified by the [initialization baseline](skills/initialize-repository/references/baseline.md). Resolve ambiguity rather than silently treating a proposal as an approved rule.

Follow the [ADR lifecycle](../docs/adr/README.md). Decision acceptance requires explicit confirmation and does not prove delivery. Use the configured integration branch, `main` here, as the post-merge immutability boundary.

Follow the [migration-guide conventions](../docs/migrations/README.md) for major-version transitions affecting consumers. Document actionable upgrades with evidence; do not invent a transition, publish a release, or confuse a working draft with a released version.

## Verification And Delivery

Follow the focused checks in the governing issue, then run `npm run check` and `npm test` for framework changes. Record commands, outcomes, and limitations. Never overwrite unrelated changes. Do not commit, push, merge, publish, or archive work unless explicitly instructed. Proposed issue-related commit subjects begin with the actual issue ID, for example `CNN-0001: Establish standalone framework`.
