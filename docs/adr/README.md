# Architecture Decision Records

[Back to documentation](../README.md)

ADRs capture consequential choices with meaningful alternatives, not routine task details. Agree before creating one. Files remain directly in this directory with stable paths. Allocate the next `adr-NNNN-short-title.md` number across every status, using at least four digits and never reusing an ID.

## Status Index

### Proposed

_No proposed ADRs._

### Accepted

- [ADR-0001: Modular standalone adoption](adr-0001-modular-standalone-adoption.md)

### Superseded

_No ADRs._

## Lifecycle

- `PROPOSED`: Mutable while the decision is developed. It is not accepted.
- `ACCEPTED`: The developer explicitly confirms the complete decision, during implementation or close-out. Set the actual acceptance date and update the index and originating work record. Decision acceptance is not delivery proof. Material revisions before merge require renewed confirmation.
- `SUPERSEDED`: Replaced by a later accepted ADR. The old record points to the replacement through `supersededBy`; the replacement's `supersedes` lists the old record's ID. Update both indexes and set `supersededDate` only after replacement acceptance.

After an accepted decision merges to the agreed integration branch (`main` here), its decision content is immutable. Only status and supersession metadata may be amended; change the decision through a new ADR. Preserve acceptance dates. A decision not to act can be accepted; there is no rejected status. Retain a proposed record that captures a meaningful eventual decision; remove an abandoned unmerged proposal only with agreement.

## Relationship To Work

Issues own scope, delivery, and proof; ADRs own decision rationale. Use `issue` for the originating ID and a navigable Context link. An issue-free project uses `issue: null` and links to its approved working record. Accepting an ADR does not close related work. Keep decisions in this repository and avoid exposing private links.

## Template

```markdown
---
id: adr-NNNN
title: Short decision title
status: PROPOSED
createdDate: YYYY-MM-DD
acceptedDate: null
supersededDate: null
supersededBy: null
supersedes: []
issue: null
---

# ADR-NNNN: Short Decision Title

[Back to ADR index](README.md)

## Context

Problem, constraints, and link to the originating issue or working record.

## Decision

The proposed or confirmed choice, including a decision not to act where relevant.

## Consequences

Benefits, costs, risks, and follow-up obligations.

## Alternatives

Meaningful alternatives and why they were not selected.
```

IDs, titles, statuses, and non-null references are strings. Dates are ISO `YYYY-MM-DD` strings or YAML `null`; `supersedes` is an array of ADR IDs, `supersededBy` is one ID or `null`, and `issue` is one originating ID or `null`. Proposed records have null acceptance and supersession fields. Accepted records have an acceptance date; superseded records additionally require a supersession date and accepted-or-later-superseded replacement. Supersession chains must be reciprocal and acyclic.
