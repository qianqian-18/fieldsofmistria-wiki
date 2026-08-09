# English-Only Public Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Chinese characters from every visitor-facing English page while preserving internal research data.

**Architecture:** Public copy remains in its current JSON, MDX, dictionary, and page sources. A contract test scans only visitor-facing paths for Han characters, deliberately excluding internal keyword research, scripts, plans, and source filenames.

**Tech Stack:** Next.js 16, TypeScript, MDX, Node.js test runner

## Global Constraints

- Translate only visitor-facing content.
- Keep routes, layout, SEO behavior, Cloudflare settings, and internal keyword research unchanged.
- Use `To be confirmed` for unsupported details and `None available` for empty redemption-code values.

---

### Task 1: Add the English-only public-content contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: public source files under `app/[locale]`, `content/articles/en`, `content/data/home.json`, and `lib/i18n/dictionaries.ts`
- Produces: a Node test that reports any public file containing `/\p{Script=Han}/u`

- [ ] Add a test that reads the public source paths and asserts that no Han characters remain.
- [ ] Run `node --test --test-isolation=none tests/site-contract.test.mjs` and confirm the new test fails on current Chinese copy.

### Task 2: Translate visitor-facing copy

**Files:**
- Modify: `content/data/home.json`
- Modify: `lib/i18n/dictionaries.ts`
- Modify: `app/[locale]/privacy-policy/page.tsx`
- Modify: `app/[locale]/terms-of-service/page.tsx`
- Modify: `content/articles/en/*.mdx`

**Interfaces:**
- Consumes: the existing public copy structure
- Produces: equivalent natural English strings with no route or schema changes

- [ ] Translate the four homepage descriptions.
- [ ] Replace public `待确认` with `To be confirmed`.
- [ ] Replace public `暂无` with `None available`.
- [ ] Replace Chinese source-label filenames rendered in article metadata with neutral English labels such as `Supplied research material`.
- [ ] Re-run the focused contract test and confirm it passes.

### Task 3: Verify and deploy

**Files:**
- No additional product files.

**Interfaces:**
- Consumes: the translated public content
- Produces: a successful production build and Cloudflare deployment

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Commit and push the changes to `main`.
- [ ] Wait for Cloudflare Pages production deployment to succeed.
- [ ] Verify the homepage, an article, privacy policy, terms page, robots file, and sitemap return HTTP 200 and display English-only public copy.
