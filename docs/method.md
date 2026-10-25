# The Method

[Back to documentation](README.md)

Conversation-Driven Development treats discussion as engineering work: clarify intent, challenge assumptions, agree on a bounded plan, and evaluate what actually changed. Humans and agents share investigation and implementation; developers retain decision authority.

## Work Cycle

1. **Understand.** Read the owning code, documentation, and active work context. Separate observed facts from desired behavior and unanswered questions.
2. **Discuss.** Clarify outcomes, constraints, alternatives, risks, and observable acceptance criteria. Ask focused questions when the answer changes scope or design.
3. **Agree.** Present a concrete plan covering implementation, proof, knowledge updates, and consequential decisions. Wait for explicit approval before implementation. Invocation, silence, or partial agreement is not approval of the resulting plan.
4. **Implement.** Make bounded changes and run a focused check after substantive edits. Keep approved scope and the active plan current; seek renewed agreement for material departures.
5. **Verify.** Check each agreed outcome against evidence. Report failed checks and limitations rather than equating a plausible implementation with success.
6. **Reconcile.** Update documentation, decisions, and evidence to match the verified outcome. Leave incomplete work open. Commits and publication need separate authorization.

## Choose Enough Structure

For a small project, the conversation can hold the active agreement. Before a handoff or context loss, save a concise approved plan and evidence in a project-owned working record linked from the documentation index. Do not silently add an issue tracker just to store a plan.

Every initialized project includes [ADRs](adr/README.md) for consequential choices with meaningful alternatives. An ADR directory is not a requirement to create a decision record for routine tasks. ADRs are independent of issues: an issue-free project can link a decision to its working record instead.

For sustained or concurrent work, opt into [issues](../issues/README.md) to maintain scope, status, and proof. Projects with downstream consumers can opt into [migration guides](migrations/README.md) for major-version upgrades. Initialization can add either module as the project grows, preserving existing knowledge.

## Limits

This is a collaboration method, not an autonomous delivery guarantee. Instructions do not enforce permissions, prove correctness, or replace review, tests, domain expertise, or security controls. Make approval and evidence visible enough for another contributor to resume without reconstructing an entire conversation.
