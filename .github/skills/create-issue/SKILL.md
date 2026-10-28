---
name: create-issue
description: 'Discuss, refine, and create an agreed backlog issue. Use /create-issue when defining a change, recording a problem, or turning a report into actionable tracked work. Does not implement the change.'
argument-hint: 'Change or problem to discuss'
---

# Create Issue

Read the [portable contracts](../initialize-repository/references/baseline.md), the current repository's `.github/cdd.json`, and its issue conventions. Use this repository's tracker. If issues are not enabled or required context is missing, stop and discuss initialization rather than inventing a tracker.

1. Read the owning board, canonical template, existing issues, documentation, and relevant implementation context. Check for duplicate or overlapping work.
2. Discuss reason, outcome, scope, constraints, dependencies, alternatives, and uncertainties. Ask focused questions until another contributor could plan confidently.
3. Propose acceptance criteria that follow the issue contract: few, one observable outcome each, with repeatable proof. Keep constraints, execution steps, and repository-wide checks out of them. Summarize the issue and obtain explicit agreement before allocating an ID or writing.
4. Allocate the next unused number across every issue status using the owning prefix. Resolve concurrent allocation conflicts. Create a stable flat issue file from the board's template with `status: backlog`, `board: archive`, today's creation date, and `closedDate: null`.
5. Add its sorted link to Backlog and validate metadata, filename, heading, backlinks, and references. Keep empty-location placeholders correct.
6. Report the agreed scope, created path, acceptance criteria, and any deferred work. Do not implement, triage to Ready without direction, create speculative ADRs, or commit.

Keep one coherent outcome per issue. Cross-link consequential decision candidates instead of duplicating rationale. Maintain approved requirements and active plans together after material changes; preserve dated approvals. Do not expose private planning in public reports or links without permission.
