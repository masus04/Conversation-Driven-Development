---
id: adr-0001
title: Modular standalone adoption
status: ACCEPTED
createdDate: 2026-10-25
acceptedDate: 2026-10-25
supersededDate: null
supersededBy: null
supersedes: []
issue: CNN-0001
---

# ADR-0001: Modular Standalone Adoption

[Back to ADR index](README.md)

## Context

[CNN-0001](../../issues/CNN-0001-establish-standalone-framework.md) establishes a self-contained framework for one repository. Consequential decisions need durable rationale from the start, while tracking needs and downstream-consumer obligations vary by project. Implementation of the setup and its revised scope is approved. The developer explicitly accepted this complete decision on 2026-10-25.

## Decision

Include collaboration, documentation practice, and ADR infrastructure in every initialization. Offer independently selectable issue tracking and migration-guide modules, each addable later. Use project-owned copies operating on the current repository and a self-contained initializer baseline as the portable contract. Support additive, approval-gated reruns rather than forced replacement. Migration guides explain actual major-version transitions without inventing releases.

## Consequences

Small projects need no issue tracker but have a place for consequential decisions. Copies remain usable without this checkout and require intentional updates. Projects with downstream consumers can maintain actionable upgrade paths without imposing guides on every project. All records remain local. Automated fixtures verify contracts and staging safety, not agent compliance or real consumer upgrades.

## Alternatives

- Mandatory issue tracking and migration guides would burden projects that do not need them.
- Optional ADR infrastructure would make durable decision rationale an afterthought.
- Changelogs alone summarize changes but do not provide consumers with actionable upgrade instructions.
- Deterministic full scaffolding would offer stronger output guarantees but impose a larger toolchain and reconciliation system than this initial method needs.
