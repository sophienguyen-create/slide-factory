# ONX Scaffold

Build OneNexus-branded demo apps from client specs.

## How to use

1. Clone the repo: `git clone https://github.com/Innovatube/onx-scaffold`
2. `cd onx-scaffold`
3. Install the pre-commit hook (see First-time setup below)
4. Open the project folder in your AI IDE — Claude Code, Codex CLI, and Cursor all work; they pick up `AGENTS.md` and `CLAUDE.md` automatically
5. Drop the client spec file into `specs/` (markdown, HTML, or JSX)
6. Type **"onx scaffold"** and attach (or name) the spec file — e.g. `specs/my-client-spec.html`. There may be multiple files in `specs/`; tell the agent which one to use
7. The agent produces a Build Plan for your review, then builds one page at a time — you approve each page before it continues

## Structure

```
specs/        ← drop client spec files here (markdown, HTML, JSX)
template/     ← layout-shell.html (chrome + layout archetypes), core.css + core.js
                (shared single-source core), onx-logo.png + onx-agent-icon.png
                (image assets), and _archive/
apps/         ← delivered app HTML files (self-contained, core inlined)
docs/         ← design-system.html — branding + component gallery (open in a browser)
scripts/      ← git hooks and dev tooling
```

Scaffolding **composes** from two references rather than adapting one file:

- **`template/layout-shell.html`** — header, navbar, and the two layout archetypes (canvas + document). The assembly skeleton.
- **`docs/design-system.html`** — branding and the component gallery, each component badged Strict/Flexible.
- **`template/core.css` + `template/core.js`** — the shared core (tokens, components, JS APIs), inlined into each delivered demo so the output stays a single self-contained HTML file. `core.css` carries the canonical version.

See [CHANGELOG.md](CHANGELOG.md) for the current version and release history.

## First-time setup (after cloning)

Install the pre-commit hook to enforce version consistency:

```bash
cp scripts/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

This blocks commits that change the core or either reference doc without a matching version bump (in `core.css`) and CHANGELOG entry.
