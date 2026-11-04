<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository publication workflow

- All changes to main go through a feature branch and pull request. Never push directly to main, force-push main, bypass its ruleset, or disable required checks.
- Required check: GitHub Actions `Quality gate`. It succeeds only when code/behavior, disposable PostgreSQL integrity, and production-build/browser checks succeed.
- CodeRabbit manages review. Address findings and resolve conversations only after the actual fix/reply. Do not mark review complete yourself.
- Production is deployed by Vercel after merge, with `Quality gate` required before assigning production domains. Do not publish using `vercel --prod`, force-promote, or manually repoint production aliases.
- Tests must protect user behavior, authorization, data integrity, or significant accessibility/performance constraints. Avoid CSS-source regex, exact animation internals, arbitrary asset sizes, and redundant render-only assertions.
- PostgreSQL tests use only a disposable local `*_test` database from `TEST_DATABASE_URL`. Never pull or use production credentials for tests.
