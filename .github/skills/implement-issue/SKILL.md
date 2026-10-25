---
name: implement-issue
description: 'Explore, plan, and implement a ready issue with an explicit approval gate. Use /implement-issue for tracked implementation, including documentation or workflow changes; never infer approval from invocation.'
argument-hint: 'Ready issue ID or path'
---

# Implement Issue

Read the [portable contracts](../initialize-repository/references/baseline.md) and the current repository's configuration and tracker conventions. Work in this repository's issues, code, documentation, and ADRs. If issue tracking is disabled or required context is unavailable, stop dependent work and ask.

## Explore And Pause

1. Locate an unambiguous `ready + current` issue. Resolve missing or mismatched state with the developer; invocation does not authorize triage.
2. Read its complete current scope, approvals, acceptance criteria, and active plan; inspect relevant code, tests, documentation, and ADRs read-only.
3. Present a concrete plan covering implementation, proof, documentation, cleanup, risks, consequential ADR candidates, and applicable enabled-module work. Resolve high-level ambiguity.
4. Wait for explicit developer approval of that plan. Before approval, do not edit implementation files, create ADRs, or change status. Silence and earlier edits are not approval.

## Implement The Approved Plan

1. Record the approved plan and date in the issue. Change status to `in-progress`, keep `board: current`, and update the board without moving the file.
2. Create only agreed `PROPOSED` ADRs in this repository; link them to the issue and index. ADR infrastructure does not require a record for every task.
3. Implement bounded changes, validating the narrowest relevant behavior after substantive edits. Reconcile affected docs, enabled workflow guidance, navigation, and uncertainty with verified evidence.
4. Keep scope, criteria, active plan, and proof current after agreed changes. Pause for renewed approval on material departures; replace obsolete active instructions rather than appending competing plans.
5. Record concrete proof and dated approvals. A developer may explicitly accept a complete ADR now; follow its lifecycle and preserve the distinction between accepted decisions and completed work.
6. Report results and remaining gaps. Leave the issue in progress for `/close-issue`. Do not commit, merge, publish, or close as part of implementation.
