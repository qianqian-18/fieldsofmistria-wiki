# Cloudflare Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Next.js wiki produce a valid static `out` artifact and deploy it from `main` through Cloudflare Pages.

**Architecture:** Keep the application fully static and use Next.js native `output: "export"` with directory-based trailing-slash output. Preserve all localized routes and article generation, replace only the unsupported server redirect at `/`, and remove the corrupt npm lock file that prevents Cloudflare from installing dependencies.

**Tech Stack:** Next.js 16, React 19, Node.js 22, Node test runner, Cloudflare Pages

## Global Constraints

- Production branch is `main`.
- Cloudflare build command is `npm run build`.
- Cloudflare output directory is `out`.
- Production origin is `https://fieldsofmistria.blog`.
- No Workers or OpenNext adapter is introduced.
- No application content, SEO text, localized routes, or visual styling is changed beyond the root redirect fallback.

---

### Task 1: Add the static-deployment contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: repository files `next.config.ts`, `app/page.tsx`, and `package-lock.json`
- Produces: a regression test that defines the Cloudflare Pages deployment contract

- [ ] **Step 1: Add a failing deployment-contract test**

```js
test("is configured as a Cloudflare Pages static export", async () => {
  const [nextConfig, rootPage] = await Promise.all([
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
  ]);

  assert.match(nextConfig, /output:\s*["']export["']/);
  assert.match(nextConfig, /trailingSlash:\s*true/);
  assert.doesNotMatch(rootPage, /from ["']next\/navigation["']/);
  assert.match(rootPage, /httpEquiv=["']refresh["']/);
  assert.match(rootPage, /href=["']\/en["']/);
  await assert.rejects(access(new URL("package-lock.json", root)));
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-isolation=none tests/site-contract.test.mjs`

Expected: FAIL because `next.config.ts` lacks `output: "export"`, `app/page.tsx` uses `next/navigation`, and the corrupt lock file exists.

- [ ] **Step 3: Commit the test**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: define Cloudflare Pages export contract"
```

### Task 2: Implement the static export

**Files:**
- Modify: `next.config.ts`
- Modify: `app/page.tsx`
- Delete: `package-lock.json`

**Interfaces:**
- Consumes: the deployment contract from Task 1 and existing localized route generation
- Produces: static HTML output in `out`, with `/` forwarding visitors to `/en`

- [ ] **Step 1: Enable native Next.js static export**

Add the following property to the existing `nextConfig` object without changing its experimental build settings:

```ts
output: "export",
trailingSlash: true,
```

- [ ] **Step 2: Replace the server redirect with a static redirect page**

Replace `app/page.tsx` with:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <meta httpEquiv="refresh" content="0;url=/en" />
      <p>
        Continue to the <Link href="/en">English wiki</Link>.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Remove the corrupted lock file**

Delete `package-lock.json`. Do not create another lock file in this task because the current file is invalid JSON and the clean lock generator is unavailable in the local environment.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test --test-isolation=none tests/site-contract.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run all repository tests**

Run: `node --test --test-isolation=none tests/*.test.mjs`

Expected: all tests PASS.

- [ ] **Step 6: Commit the implementation**

```bash
git add next.config.ts app/page.tsx package-lock.json
git commit -m "fix: prepare Next.js site for Cloudflare Pages"
```

### Task 3: Verify the production artifact

**Files:**
- Verify: `package.json`
- Verify: generated `out/`

**Interfaces:**
- Consumes: static-export configuration from Task 2
- Produces: a verified Pages artifact containing the root, localized routes, articles, robots file, and sitemap

- [ ] **Step 1: Install dependencies without a lock file**

Run: `npm install --ignore-scripts --no-audit --no-fund --cache .npm-cache`

Expected: dependency installation completes and generates local `node_modules`. Do not commit the generated lock file; remove it after installation if npm creates one.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: PASS with no lint errors.

- [ ] **Step 3: Build with the production origin**

Run in PowerShell:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://fieldsofmistria.blog"
npm run build
```

Expected: Next.js exits successfully and creates `out`.

- [ ] **Step 4: Inspect required static files**

Run in PowerShell:

```powershell
@(
  "out/index.html",
  "out/en/index.html",
  "out/en/wiki/beginner-guide/index.html",
  "out/robots.txt",
  "out/sitemap.xml"
) | ForEach-Object { if (-not (Test-Path -LiteralPath $_)) { throw "Missing artifact: $_" } }
```

Expected: command exits successfully without a missing-artifact error.

### Task 4: Publish and deploy through Cloudflare Pages

**Files:**
- Publish: `tests/site-contract.test.mjs`, `next.config.ts`, `app/page.tsx`
- Delete remotely: `package-lock.json`

**Interfaces:**
- Consumes: verified repository state and `out` build contract
- Produces: a successful Cloudflare Pages production deployment

- [ ] **Step 1: Push the verified changes to `main`**

Push only the reviewed deployment changes and leave generated `node_modules`, `.npm-cache`, `.next`, and `out` untracked.

- [ ] **Step 2: Set Cloudflare Pages build settings**

Set these exact values for `fieldsofmistria-wiki`:

```text
Production branch: main
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: out
Root directory: /
```

- [ ] **Step 3: Set build environment variables**

```text
NODE_VERSION=22
NEXT_PUBLIC_SITE_URL=https://fieldsofmistria.blog
```

- [ ] **Step 4: Trigger a production deployment and inspect the complete log**

Expected sequence: repository clone succeeds, npm installs dependencies, `next build --webpack` succeeds, and Cloudflare publishes `out`.

- [ ] **Step 5: Smoke-test the deployment**

Verify the Pages production URL returns HTTP 200 for `/en`, `/en/wiki/beginner-guide`, `/robots.txt`, and `/sitemap.xml`; verify `/` forwards to `/en` in a browser.

- [ ] **Step 6: Validate the custom domain**

Confirm `https://fieldsofmistria.blog` serves the successful production deployment with a valid TLS certificate.
