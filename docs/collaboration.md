# Collaboration

[Back to documentation](README.md)

Developers and agents contribute ideas, investigation, implementation, and review. Challenge assumptions with evidence and explain meaningful alternatives without silently overruling project intent. Developers decide product direction and authorize consequential changes, merges, and publication.

## Approval

Follow the [work cycle](method.md#work-cycle). A concrete implementation plan requires explicit approval. Material changes to scope, architecture, security boundaries, ownership, or the agreed proof require renewed agreement. Read-only investigation and discussion do not authorize file changes or lifecycle transitions.

Small corrections can use a short plan and a short approval; proportional ceremony does not erase the approval boundary. An explicitly requested, fully specified correction can itself supply the plan and authorization. When a request asks for a plan first, stop after presenting it.

Decision approval, implementation approval, acceptance proof, and permission to commit are distinct. Record significant approvals with dates in the governing issue or working record. Do not infer acceptance of a whole ADR from approval of one section.

## Resuming Work

Read the active agreement and relevant outside changes before resuming. Preserve unrelated work. Reconcile changed requirements and proof together rather than appending contradictory plans. State remaining uncertainty plainly.

Use the current repository's instructions, records, and code. If required context is inaccessible, stop dependent work instead of inventing a replacement tracker. Never expose private links, plans, or identifiers in public docs, commits, or reports without permission.

## Commits

Do not commit, push, merge, or publish without explicit instruction. For issue work in this repository, propose commit subjects prefixed with the governing `CNN` ID. Downstream projects select their own convention; issue-free projects need no invented issue ID.
