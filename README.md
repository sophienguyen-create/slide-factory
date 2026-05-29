# ONX Scaffold

Build OneNexus-branded demo apps from client specs.

## How to use

1. Drop the client spec file into `specs/`
2. Open this folder in Claude Code
3. Say **"onx scaffold"**

## Structure

```
specs/        ← drop client spec files here (markdown, HTML, JSX)
template/     ← scaffold source and archive
apps/         ← delivered app HTML files
docs/         ← design system reference (open design-system.html in browser)
scripts/      ← git hooks and dev tooling
```

See `docs/design-system.html` for the full component library and strict/flexible rules.

## First-time setup (after cloning)

Install the pre-commit hook to enforce version consistency:

```bash
cp scripts/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

This blocks commits that change the scaffold or design system without a matching version bump and CHANGELOG entry.
