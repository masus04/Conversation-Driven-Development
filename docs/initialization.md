# Initialization

[Back to documentation](README.md)

The [initializer skill](../.github/skills/initialize-repository/SKILL.md) inspects a project, discusses its needs, proposes a plan, and waits for approval. It is agent-mediated, not a deterministic scaffolding command. Its [baseline](../.github/skills/initialize-repository/references/baseline.md) defines the portable contract.

## Scope Interview

Clarify purpose, likely project size, contributors, existing instructions, and public/private boundaries. ADR infrastructure is always included. Ask whether persistent issue tracking is useful and whether downstream consumers need migration guides. Agree on an issue prefix when needed, an integration branch, and the project's version convention when migration guides are enabled. Do not derive consequential choices from a repository name alone.

| Profile | Core Guidance And ADRs | Issues | Migration Guides |
|:--|:--:|:--:|:--:|
| `core` | Yes | No | No |
| `issues` | Yes | Yes | No |
| `migrations` | Yes | No | Yes |
| `full` | Yes | Yes | Yes |

Core establishes a README entry point, project-owned repository instructions and skills, collaboration and documentation guidance, and the ADR index, lifecycle, and template. It preserves approval and verification without requiring a board or speculative ADRs. This repository uses `full`; that is not the default for new projects.

## Safe Reruns

Inventory present, missing, compatible, and conflicting content. Propose additions and reconciliations, not wholesale replacement. Preserve issue IDs, ADR history, guides, evidence, and compatible project conventions. Profiles are additive: issues and migrations can be added independently, with both resulting in full. A smaller requested profile does not delete existing capabilities. Confirm removal or migration separately.

Audit-only invocations report differences without changing files. Initializing or extending a project requires approval of the resulting plan. Do not create speculative ADRs or mark agreements accepted merely to complete a checklist.

For issues added later, ask what existing work should become tracked. Do not manufacture historic approval or retroactively close imported work. For migration guides added later, establish an index and template and ask which actual version transitions need documenting; do not fabricate historical releases. The [migration conventions](migrations/README.md) define guide content and verification.
