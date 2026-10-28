---
id: CNN-0002
title: Add acceptance criteria guidance
status: done
board: current
createdDate: 2026-10-28
closedDate: 2026-10-28
---

# CNN-0002: Add Acceptance Criteria Guidance

[Back to issue board](README.md)

## Reason

The issue contract only asked for observable acceptance criteria with credible proof. In long-running work, criteria written to that rule still grew into compound obligations, restated hygiene checks and execution steps, with proof methods nobody could repeat, and were read differently at close-out than when they were agreed. Criteria are only worth their cost when each can be verified without interpretation.

## Description

Add concise rules for writing acceptance criteria to the portable issue contract and carry them into the issue skills, the method explanation and the contract tests:

- Criteria are few, each one observable end state with a repeatable proof.
- Judgment is concentrated in one developer-acceptance criterion.
- Constraints stay in Description, execution steps in the plan, and repository-wide hygiene checks apply to every issue without being listed.
- Criteria are revised with the developer when the agreed outcome changes, never ticked under a new interpretation.
- `/close-issue` runs the repository's standing checks before verifying criteria.

Non-goals: no new validator rule, template field or checker; existing issues are not rewritten.

## Acceptance Criteria

- [x] The portable issue contract states the criteria rules, and the create-issue and close-issue skills follow them. **Proof:** the regression test `acceptance criteria stay outcome-based and are revised rather than reinterpreted` passes.
- [x] The method explains why acceptance criteria lose value when they become procedure and links to the contract. **Proof:** the Acceptance Criteria section of [the method](../docs/method.md#acceptance-criteria).
- [x] The developer accepts the change. **Proof:** dated approval under Proof of Success.

## Proof of Success

- 2026-10-28: The developer asked to add lessons about acceptance criteria to this framework, adapted to its process rather than mapped one-to-one, then asked to record the change as `CNN-0002` and push it.
- `npm test`: all 28 tests passed, including the new contract assertion.
- `npm run check`: passed for the repository's Markdown, issues and ADRs, including links, fragments and indexes.
- `git diff --check`: passed.

## Implementation Plan

Explicitly approved 2026-10-28:

1. Add the criteria rules to the issue contract and the standing-check and revision rules to the close-issue contract in the portable baseline.
2. Point the create-issue and close-issue skills to the contract.
3. Explain the rationale in the method and link the Discuss step to it.
4. Add a regression assertion and run the repository checks.

## References

- [Portable baseline](../.github/skills/initialize-repository/references/baseline.md#issue-contract)
- [Method](../docs/method.md#acceptance-criteria)
- [Create issue skill](../.github/skills/create-issue/SKILL.md)
- [Close issue skill](../.github/skills/close-issue/SKILL.md)
- [Contract tests](../test/framework.test.mjs)
