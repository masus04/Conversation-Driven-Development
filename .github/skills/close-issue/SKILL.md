---
name: close-issue
description: 'Verify acceptance evidence, reconcile knowledge, and close an implemented issue. Use /close-issue for final delivery checks and decision reconciliation, without automatically committing or archiving.'
argument-hint: 'In-progress issue ID or path'
---

# Close Issue

Read the [portable contracts](../initialize-repository/references/baseline.md), configuration, and tracker conventions in the current repository. Use its issue, documentation, and decision records. Stop if issue tracking is disabled or context is missing. Respect private/public boundaries.

1. Require an unambiguous `in-progress + current` issue. Read the latest approved scope, plan, criteria, evidence, relevant changes, and ADRs. Earlier proof must still support current requirements.
2. Verify every criterion with its stated proof method. Record commands, outcomes, inspections, and limits. Unsupported criteria, missing proof, or unapproved material deviations leave the issue in progress; do not mark checkboxes merely because code exists.
3. Apply relevant reconciliation requirements from the portable baseline. Record required reviews and rationale, verify examples where applicable, and repair indexes and links. Remove only issue-scoped temporary artifacts. Preserve future ideas as unselected, not delivered.
4. Review linked decisions. Obtain explicit confirmation of each complete proposed decision before acceptance, set actual dates, and update indexes and issue evidence. Preserve earlier acceptance dates. Resolve abandoned proposals with the developer rather than silently accepting or deleting them.
5. For supersession, accept the replacement first, then update reciprocal metadata and both indexes. Preserve post-merge decision content; use the configured integration branch rather than assuming its name. Material pre-merge revisions require renewed confirmation.
6. Run final focused validation after reconciliation. If all conditions are met, set `status: done`, retain `board: current`, set today's `closedDate`, and update the board without moving the file.
7. Review the diff and report proof, required review outcomes, changed knowledge, and limitations. Propose exactly one single-line commit message beginning with the exact `id` value from the current issue's metadata, including its configured prefix, followed by a colon. Do not infer or copy an ID from another issue. Do not include a body or alternative subjects. Do not archive, commit, push, merge, or publish without separate authorization.
