# Issue Tracker

[Back to repository](../README.md)

This repository uses the prefix `CNN`. Issue metadata is authoritative; this board is its human-readable projection. Files stay directly in this directory throughout their lifecycle.

## Current Board

| Ready | In Progress | Done |
|:--|:--|:--|
| _No issues._ | _No issues._ | [CNN-0001: Establish the standalone framework](CNN-0001-establish-standalone-framework.md)<br>[CNN-0002: Add acceptance criteria guidance](CNN-0002-acceptance-criteria-guidance.md) |

<details>
<summary>Backlog</summary>

_No issues._

</details>

<details>
<summary>Archive</summary>

_No issues._

</details>

## Lifecycle

Create agreed work in Backlog. Developer-directed triage promotes it to Ready. Implementation requires explicit approval of a concrete plan before status changes to In Progress. Close only after verification and knowledge reconciliation. Completed work remains current until the developer requests archiving.

Valid placements are `backlog + archive` in Backlog, `ready + current` in Ready, `in-progress + current` in In Progress, `done + current` in Done, and `done + archive` in Archive. Here `archive` means outside current scope, not necessarily completed.

List each issue exactly once, sorted by ID. Use `<br>` between links in table cells and one list item per issue in details sections. Update metadata and the board together. Never move an issue file during a transition.

## Naming And Template

Allocate the next number from all `CNN-NNNN-*.md` filenames, regardless of status; never reuse an existing number. Use at least four digits. Resolve concurrent allocation conflicts before creating the file.

```markdown
---
id: CNN-NNNN
title: Short work item title
status: backlog
board: archive
createdDate: YYYY-MM-DD
closedDate: null
---

# CNN-NNNN: Short Work Item Title

[Back to issue board](README.md)

## Reason

Why the work matters.

## Description

Agreed scope, constraints, dependencies, and non-goals.

## Acceptance Criteria

- [ ] Observable outcome with a proof method.

## Proof of Success

Commands, results, evidence, and dated material approvals.

## Implementation Plan

Record the plan after explicit approval; discussion alone does not authorize implementation.

## References

Related documentation, decisions, and implementation.
```

Dates use ISO `YYYY-MM-DD`; unset dates are YAML `null`. `closedDate` is set only when done. Other fields are strings from the documented enums where applicable.

## Keeping Work Current

Read the named issue and its active plan before dependent work or resumption. A board entry, earlier edits, or a commit is not approval. Reconcile requirements, the active plan, and proof together after agreed changes; preserve dated material approvals without accumulating competing plans. Stop for renewed agreement when scope changes materially.

Issues own delivery status and evidence. ADRs own consequential decision rationale. Cross-link them rather than duplicating their content. Do not publish private planning or identifiers without explicit permission.
