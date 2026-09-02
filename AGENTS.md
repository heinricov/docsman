<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:docsman-project-rules -->
# docsman — project context (read this before ANY change)

This repo is **docsman**, a reusable React layout & sidebar component kit (Base UI, shadcn-style, Tailwind CSS v4) plus the documentation sites that showcase it. Cards for orientation: see `CONTRIBUTING.md` (workflow) and `docs/decisions/` (why certain things are done).

## Tooling — NOT pnpm

- Root is **Turborepo on top of npm workspaces** (`"packageManager": "npm@11.19.0"`).
- Never use `pnpm`. Use npm / root turbo scripts:
  - `npm run build`, `npm run dev`, `npm run lint`, `npm run format`, `npm run typecheck` at root run `turbo <task>` across workspaces.
  - Per-package: `npm run build -w <name>` (names: `docsman`, `web`, `docs`), or run inside the package dir with `npm run <task>`.
- Workspaces live in `apps/*` (`web`, `docs`) and `packages/*` (`docsman`).

## Editing the `docsman` package — you MUST rebuild `dist/`

`apps/web` and `apps/docs` import docsman through subpaths (`docsman/render`, `docsman/layouts`, `docsman/ui/*`) which resolve to **`dist/`** via the `exports` map in `packages/docsman/package.json` — they do **NOT** consume `src/`.

Therefore, after editing `packages/docsman/src/*` you MUST regenerate `dist/` before testing the apps:

```bash
npm run build -w docsman        # or: npm run build at root
```

Without rebuild, the apps keep serving stale bundled code and debugging becomes misleading (e.g. an edited source with no effect in the browser).

## Dev server workflow

- `apps/web` runs on port **3000** by default. After verifying, ALWAYS kill it:
  ```bash
  lsof -ti :3000 | xargs kill -9
  ```
- If a previous dev server is still running, Turbopack refuses to bind and prints "Another next dev server is already running" — kill the lingering PID first (check `lsof -ti :3000` / `:3001`, and `pkill -f 'next dev'` if needed).

## Publishing — NEVER publish yourself

- The user publishes `docsman` manually. **Do not run `npm publish` / `npm pack` / `npm login`.**
- `packages/docsman/publish.md` documents the user-facing install + publish steps; `scripts/npm-install-docsman.sh` (invoked via `npm run docsman` at root) simulates a local `npm install docsman` into a test app — leave those alone.

## Technical notes you will trip on

- `docman-render.tsx` (`packages/docsman/src/render/`) is the MDX renderer. It uses `next-mdx-remote/rsc` (`compileMDX`) + `remark-gfm` + `rehype-pretty-code`.
  - `mdxComponents` maps (≈ line 252): typography is registered **only under lowercase keys** (`h1`–`h6`, `p`, `blockquote`, `ul`, `ol`, `li`, `code`, `pre`, `a`, `hr`, `strong`, `em`). Capitalized tags (`<H1>`, `<P>`, `<A>`) are NOT registered → `HTTP 500` "Expected component ... to be defined". Use standard Markdown in live previews.
- MDX attribute strings do NOT support backslash escapes like `\"` (causes `Unexpected character '\'` MDX compile error). Use single-quoted strings, JS expression containers `value={'...'}` (real JS — escapes work), or avoid escapes.
- `docsman/render` is a **Server Component** (reads `fs` via `src/lib/mdx.ts`); client subcomponents live under `docsman/render-client`.
- Hydration: `CodeCommand` and `CodeBlock` use a `useSyncExternalStore` mounted-guard and render a plain `<pre><code>` on SSR, mounting `SyntaxHighlighter` only after hydration. Keep that pattern.
- MDX **block-style children** passed into a `"use client"` component serialize as a React **lazy `_payload`** element server-side. Any custom text extraction (e.g. `CodeCommand`'s `extractTextContent`) must unwrap `_payload.value.props.children`, not just string / element / array. See `docs/decisions/0002-...`.
- Known minor issue: two component filenames have typos — `src/components/logo-setion.tsx` and `src/components/typograpy.tsx`. Do not "fix" names without checking every import & doc reference.
- docsman version is **0.0.10** (track in `packages/docsman/package.json`).
<!-- END:docsman-project-rules -->