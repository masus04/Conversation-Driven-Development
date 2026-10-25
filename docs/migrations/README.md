# Migration Guides

[Back to documentation](../README.md)

Migration guides help downstream consumers update their usage across major versions. This optional module can be enabled during initialization or added later. It complements changelogs and ADRs: explain the upgrade, link to change summaries and rationale, and keep implementation proof in issues or working records.

## Guide Index

_No migration guides. No major-version transition has been published or asserted by this setup._

## Conventions

Agree on the project's version convention and which consumers are affected. Keep one guide per actual major-version transition directly in this directory, such as `v1-to-v2.md`. The filename identifies the source and target major versions; exact supported source ranges and target versions belong in Version Coverage. Targets must advance beyond sources. Preserve published paths and repair inbound links when necessary.

Use YAML `fromMajor` and `toMajor` integers, a nonempty string `title`, and `status: draft` or `published`. A draft describes an agreed upcoming transition, not an already released version. Publication requires explicit developer authorization and evidence for the documented target. Never infer release approval from implementing a guide. An empty index is valid when there is no agreed transition.

Write concrete, ordered update steps and before/after examples appropriate to the consumer-facing API, configuration, workflow, or method. State who is affected and identify changes requiring no action. Explain compatibility constraints and how consumers validate a successful update. Verify examples and commands against the affected versions, recording evidence in the governing work record; structural checks alone do not establish correctness.

Update affected guides with the breaking change, keeping unreleased claims clearly marked. When enabling guides later, agree which existing transitions to document and verify their facts rather than fabricating history. Every guide appears once in this index; do not put templates in separate unindexed guide files.

During issue close-out, when this module is enabled, review consumer-facing changes for breaking behavior that warrants a major-version guide. A breaking change does not itself determine versioning. Check whether a guide already exists and whether a real source-to-target transition is in scope. If a new guide appears warranted, propose its transition, affected consumers, actions, examples, verification, and evidence; wait for explicit approval before authoring. Reconcile issue scope and criteria before adding an in-scope guide. For separate work, ask how it should be tracked or deferred. Record a dated decision and residual risk if the guide is declined or deferred. If there is no major-version guide to write, record the reviewed surfaces and rationale. This check does not publish a version or replace release authorization.

## Template

```markdown
---
title: Upgrade from version 1 to version 2
fromMajor: 1
toMajor: 2
status: draft
---

# Upgrade From Version 1 To Version 2

[Back to migration guides](README.md)

## Version Coverage

Exact supported source range, target version, transition state, and affected consumers.

## Breaking Changes

What changed, who is affected, and whether action is required.

## Update Steps

Ordered actions consumers must take.

## Before And After

Concrete usage examples showing the change.

## Verification

Commands or checks consumers can run and their expected results.

## Compatibility

Prerequisites, supported combinations, limitations, and fallback options where relevant.

## References

Links to the relevant release material, contracts, decisions, and available evidence.
```
