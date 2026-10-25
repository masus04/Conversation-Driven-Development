# Documentation Practice

[Back to documentation](README.md)

Documentation explains intent, constraints, decisions, and non-obvious behavior. Verified code and runtime evidence establish delivered behavior; procedural specifications establish intended workflow contracts. Distinguish the target design, approved decisions, optional proposals, and demonstrated implementation.

## Canonical Knowledge

- Give each concept one owning document and link to it instead of maintaining competing copies.
- Link to owning code for implementation details. Keep delivery status and proof in issues or working records, not scattered across concept pages.
- Keep always-on instructions short; link to canonical workflow guidance. Skill checklists may summarize invariants but must not redefine them.
- Reconcile stale knowledge in the change that exposes it. Ask when evidence does not reveal intent.
- Place `[to be verified]` next to factual uncertainty and `[open design decision]` next to unselected choices. Record the needed evidence or agreement in the active work record.
- Preserve useful unselected ideas separately from requirements. An idea, research result, or uncertainty marker does not authorize implementation.

## Navigation And Change

Every content directory under `docs/` and, when enabled, `issues/` has a `README.md` linking to its parent and indexing direct children. Repair inbound links when content moves. Keep filenames stable for issues and ADRs as their status changes.

When migration guides are enabled, follow their indexed conventions for major-version transitions affecting consumers. A guide explains how to update usage and verify the result; a changelog summarizes changes, an ADR explains rationale, and an issue records implementation proof. Link these records rather than duplicating their purposes. Update affected guides alongside breaking changes; guide publication does not authorize a release.

Use paragraphs for explanation, lists for independent requirements, numbered steps for procedures, and tables for genuine comparisons or tracking. Favor direct language and domain-neutral examples in reusable material.

## Evidence

Record commands and outcomes, inspections, measurements, or screenshots that support each acceptance criterion. Identify manual and untested requirements. A documentation-only change can verify a specification without proving that an agent or downstream implementation follows it.

The portable baseline may need enough procedural detail to work without this checkout. Treat it as the canonical initializer contract, not a second tutorial. When its contract changes, reconcile the explanatory docs, consuming skills, and tests in the same issue.
