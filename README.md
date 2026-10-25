# Conversation-Driven Development

A lightweight method for developers and agents to turn discussion into agreed changes, verified outcomes, and maintained project knowledge.

Discuss intent and tradeoffs, agree on a plan, implement within its boundaries, verify the result, and reconcile what the project knows. Architecture decision records (ADRs) are part of the method from the start. Issue tracking and consumer migration guides are optional and can be added later.

## Start Here

- [The method](docs/method.md): roles, approvals, and the work cycle.
- [Adopt the framework](docs/adoption.md): project-owned copies and safe updates.
- [Initialization](docs/initialization.md): choose a scope and safely extend it later.
- [Documentation index](docs/README.md): canonical guidance and decisions.
- [Issue tracker](issues/README.md): this repository's work and acceptance evidence.
- [Migration guides](docs/migrations/README.md): major-version upgrade guidance for consumers.
- [Repository instructions](.github/copilot-instructions.md): the rules used to maintain this repository.

## Adopt In A Project

With Node.js 22 or newer, from this checkout:

```sh
node scripts/adopt.mjs --dry-run /path/to/project
node scripts/adopt.mjs /path/to/project
```

This installs the portable initializer, not a generated project. In the target project's VS Code/Copilot chat, invoke `/initialize-repository`, discuss the desired scope, and approve the resulting plan. Node is only needed for the optional adoption/check tooling, not to use the method or skills. Manual copying is also supported.

The method is editor-independent; VS Code/Copilot is the first supported integration. Agent instructions guide behavior but do not technically enforce approval gates.

## Maintain This Repository

```sh
npm ci
npm run check
npm test
```

The checks include untracked content outside ignored dependency and Git directories. Tests exercise tooling and contract fixtures; they do not claim to prove that an agent will follow instructions. See [adoption and verification](docs/adoption.md#verification).

This repository uses the full profile, issue prefix `CNN`, and integration branch `main`. Its reusable package does not depend on those choices. Documentation, skills, and tooling are available under the [MIT license](LICENSE).
