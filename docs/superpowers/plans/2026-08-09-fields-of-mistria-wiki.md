# Fields of Mistria Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a reference-faithful, eight-language Fields of Mistria fan wiki with a home page, Special Pages list, MDX articles, eight evidence-backed SEO pages, and legal pages.

**Architecture:** Use a Next.js App Router site with locale-prefixed routes, MDX files as long-form content, typed JSON for keyword classification, and shared wiki-shell components. Server components load locale dictionaries and MDX metadata; small client components handle language switching, search, and collapsible mobile navigation.

**Tech Stack:** Next.js, React, TypeScript, MDX, CSS Modules/global CSS, Vitest, Testing Library, Zod, Cloudflare-compatible Sites deployment.

## Global Constraints

- Public brand is exactly `Fields of Mistria Wiki`; `Stardew Valley` may appear only in the comparison article and internal reference documentation.
- Locales are exactly `en`, `zh-cn`, `zh-tw`, `fr`, `ja`, `ko`, `ru`, and `es`; English is the fallback.
- Missing facts and external URLs render `待确认`; missing redemption codes render `暂无`.
- Never invent values, character names, redemption codes, release details, or links.
- Each publishable SEO title is 40–60 characters and contains its primary keyword.
- Each publishable SEO description is 140–160 characters and contains its primary keyword.
- Long-form pages target roughly 1,200 words only when supplied evidence supports that length.
- The visual shell follows the supplied Stardew Valley Wiki references rather than a generic landing-page design.
- Piracy-oriented keywords never produce pages or download links.

---

### Task 1: Scaffold the site and establish test infrastructure

**Files:**
- Create/initialize: `package.json`, `app/layout.tsx`, `app/globals.css`, `.openai/hosting.json`
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/smoke.test.tsx`
- Modify: `tsconfig.json`

**Interfaces:**
- Produces: `npm run test`, `npm run build`, App Router root layout, and Cloudflare-compatible Sites configuration.

- [ ] **Step 1: Initialize the site with the Sites starter**

Run the Sites `scripts/init-site.sh` once with the project root as target. Preserve the generated package manager, lockfile, Vite/Sites plugin, and `.openai/hosting.json`.

- [ ] **Step 2: Add the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

it('uses the Fields of Mistria site identity', () => {
  render(<RootLayout><main>Wiki content</main></RootLayout>)
  expect(screen.getByText('Wiki content')).toBeInTheDocument()
  expect(document.title).toContain('Fields of Mistria Wiki')
})
```

- [ ] **Step 3: Run the smoke test and verify failure**

Run: `npm test -- tests/smoke.test.tsx`
Expected: FAIL because Vitest or the finished metadata is not configured.

- [ ] **Step 4: Configure Vitest and replace starter metadata**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
})
```

Set root metadata title to `Fields of Mistria Wiki — Guides, Farming, Romance` and description to the supplied metadata description. Remove starter preview imports, metadata markers, and unused loading-skeleton code.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- tests/smoke.test.tsx && npm run build`
Expected: PASS and successful production build.

Commit: `git commit -am "chore: scaffold Fields of Mistria wiki"`

---

### Task 2: Add validated locale, content, and keyword data

**Files:**
- Create: `lib/i18n/config.ts`, `lib/content/schema.ts`, `lib/content/keywords.ts`
- Create: `content/data/home.json`, `content/data/keywords.json`
- Create: `content/locales/en.json`, `content/locales/zh-cn.json`, `content/locales/zh-tw.json`, `content/locales/fr.json`, `content/locales/ja.json`, `content/locales/ko.json`, `content/locales/ru.json`, `content/locales/es.json`
- Test: `tests/content-data.test.ts`

**Interfaces:**
- Produces: `Locale`, `locales`, `isLocale(value)`, `HomeContent`, `KeywordRecord`, `loadHomeContent()`, and `loadKeywords()`.

- [ ] **Step 1: Write failing schema tests**

```ts
import { loadHomeContent, loadKeywords } from '@/lib/content/keywords'

it('keeps codes factual and excludes piracy routes', () => {
  expect(loadHomeContent().sidebarCodes).toEqual(['暂无', '暂无'])
  const keywords = loadKeywords()
  expect(keywords.filter(x => x.status === 'publish')).toHaveLength(8)
  expect(keywords.find(x => x.keyword === 'fields of mistria download free')?.status).toBe('excluded')
})
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- tests/content-data.test.ts`
Expected: FAIL because loaders and data do not exist.

- [ ] **Step 3: Implement typed configuration and schemas**

```ts
export const locales = ['en','zh-cn','zh-tw','fr','ja','ko','ru','es'] as const
export type Locale = (typeof locales)[number]
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale)

export type KeywordStatus = 'publish'|'duplicate-intent'|'spelling-variant'|'needs-research'|'excluded'
export interface KeywordRecord {
  keyword: string
  canonicalKeyword: string
  slug: string | null
  status: KeywordStatus
  sources: string[]
}
```

Copy the supplied home JSON exactly into `home.json`. Convert all 215 unique keyword strings into `keywords.json`, map eight canonical keywords to `publish`, map variants to canonical records, mark unsupported topics `needs-research`, and mark the three piracy-oriented terms `excluded`.

- [ ] **Step 4: Add complete UI dictionaries**

Each locale dictionary must define the same keys: `mainPage`, `specialPages`, `search`, `language`, `contents`, `sources`, `categories`, `pending`, `noCodes`, `privacy`, `terms`, `fallbackNotice`, and navigation labels. Translations must not add facts.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/content-data.test.ts`
Expected: PASS.

Commit: `git add lib content tests/content-data.test.ts && git commit -m "feat: add validated multilingual content data"`

---

### Task 3: Implement locale routing and metadata foundations

**Files:**
- Create: `middleware.ts`, `lib/i18n/load-dictionary.ts`, `app/[locale]/layout.tsx`, `app/[locale]/not-found.tsx`
- Create: `components/language-switcher.tsx`
- Test: `tests/i18n.test.tsx`

**Interfaces:**
- Consumes: `Locale`, `locales`, `isLocale`.
- Produces: `getDictionary(locale)`, locale redirect behavior, localized layout metadata, and `LanguageSwitcher`.

- [ ] **Step 1: Write failing locale tests**

```tsx
it('lists all eight language choices', () => {
  render(<LanguageSwitcher locale="en" pathname="/en/wiki/fields-of-mistria" />)
  expect(screen.getAllByRole('option')).toHaveLength(8)
})

it('preserves the page path when changing locale', () => {
  expect(localizePath('/en/wiki/fields-of-mistria', 'ja')).toBe('/ja/wiki/fields-of-mistria')
})
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/i18n.test.tsx`
Expected: FAIL because locale routing components do not exist.

- [ ] **Step 3: Implement dictionaries and route preservation**

```ts
export function localizePath(pathname: string, next: Locale) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] && isLocale(segments[0])) segments[0] = next
  else segments.unshift(next)
  return '/' + segments.join('/')
}
```

Middleware redirects an unprefixed request to the closest supported browser locale and falls back to `/en`. Unknown locale segments render the localized not-found page.

- [ ] **Step 4: Add locale-aware metadata alternates**

Generate canonical and language-alternate URLs for all eight locales. If localized MDX is missing, render English and display the dictionary's `fallbackNotice`.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/i18n.test.tsx && npm run build`
Expected: PASS and build succeeds.

Commit: `git add middleware.ts lib/i18n app/[locale] components/language-switcher.tsx tests/i18n.test.tsx && git commit -m "feat: add eight-locale routing"`

---

### Task 4: Build the reference-faithful wiki shell

**Files:**
- Create: `components/wiki/header.tsx`, `components/wiki/context-nav.tsx`, `components/wiki/search.tsx`, `components/wiki/sidebar.tsx`, `components/wiki/footer.tsx`, `components/wiki/page-frame.tsx`
- Create: `styles/wiki-shell.css`
- Modify: `app/globals.css`, `app/[locale]/layout.tsx`
- Test: `tests/wiki-shell.test.tsx`

**Interfaces:**
- Produces: `WikiShell`, `ContextNav`, `WikiSidebar`, and `PageFrame` shared by all routes.

- [ ] **Step 1: Write failing shell tests**

```tsx
it('renders contextual navigation and verified code state', () => {
  render(<WikiShell locale="en" routeKind="article"><main>Article</main></WikiShell>)
  expect(screen.getByRole('link', { name: /main page/i })).toHaveAttribute('href', '/en')
  expect(screen.getByText('暂无')).toBeInTheDocument()
  expect(screen.queryByText(/Stardew Valley Wiki/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/wiki-shell.test.tsx`
Expected: FAIL because shell components do not exist.

- [ ] **Step 3: Implement semantic shell components**

`WikiShell` accepts `{ locale: Locale; routeKind: 'home'|'list'|'article'|'legal'; children: ReactNode }`. `ContextNav` changes secondary links by `routeKind`; `Main page` always targets `/${locale}`. External links without verified URLs render text plus `待确认`, never an anchor.

- [ ] **Step 4: Reproduce the reference layout in CSS**

Use layered pixel-art-compatible background treatment, a narrow utility bar, centered framed content surface, wiki-style tabs, muted cream paper colors, brown borders, compact serif headings, bordered data tables, and a two-column content/sidebar layout. Define colors as documented HSL custom properties; if an exact researched value is unavailable, label the token comment `待确认` and use a visually sampled neutral value rather than claiming it is official Fields of Mistria branding.

- [ ] **Step 5: Verify responsive behavior and commit**

Run: `npm test -- tests/wiki-shell.test.tsx && npm run build`
Expected: PASS. At widths below 760px, navigation collapses and sidebar follows main content.

Commit: `git add components/wiki styles app && git commit -m "feat: build reference wiki shell"`

---

### Task 5: Build the localized home page

**Files:**
- Create: `app/[locale]/page.tsx`
- Create: `components/home/hero.tsx`, `components/home/start-cards.tsx`, `components/home/about-game.tsx`, `components/home/codes-panel.tsx`, `components/home/final-cta.tsx`
- Test: `tests/home-page.test.tsx`

**Interfaces:**
- Consumes: `loadHomeContent()`, locale dictionary, `WikiShell`.
- Produces: localized home route and reusable home modules.

- [ ] **Step 1: Write failing home content tests**

```tsx
it('renders supplied hero and honest code state', async () => {
  render(await HomePage({ params: Promise.resolve({ locale: 'en' }) }))
  expect(screen.getByRole('heading', { name: 'Fields of Mistria' })).toBeInTheDocument()
  expect(screen.getByText('Fan-Made Community Wiki')).toBeInTheDocument()
  expect(screen.getByText('暂无')).toBeInTheDocument()
  expect(screen.queryByText(/free code|redeem now/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/home-page.test.tsx`
Expected: FAIL because the localized home route does not exist.

- [ ] **Step 3: Implement the five home modules**

Render only supplied JSON copy. Link Beginner Guide to `/${locale}/wiki/beginner-guide`; unsupported Start Here cards render `待确认`. Link Play on Steam to `https://store.steampowered.com/app/2142790/Fields_of_Mistria/`. Keep unverified official/Discord/YouTube destinations non-clickable.

- [ ] **Step 4: Add home-specific wiki panel styling**

Map Hero, Start Here, About, Codes, and Final CTA into bordered wiki panels matching the reference shell. Preserve readable heading order and keyboard-focus styles.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/home-page.test.tsx && npm run build`
Expected: PASS.

Commit: `git add app/[locale]/page.tsx components/home tests/home-page.test.tsx && git commit -m "feat: add Fields of Mistria home page"`

---

### Task 6: Add MDX articles, Special Pages, and legal routes

**Files:**
- Create: `lib/content/articles.ts`, `components/wiki/article-layout.tsx`, `components/wiki/info-box.tsx`, `components/wiki/table-of-contents.tsx`
- Create: `app/[locale]/wiki/[slug]/page.tsx`, `app/[locale]/special-pages/page.tsx`, `app/[locale]/privacy-policy/page.tsx`, `app/[locale]/terms-of-service/page.tsx`
- Create: `content/articles/en/*.mdx` and translated/fallback stubs under the other locale folders
- Test: `tests/articles.test.tsx`, `tests/special-pages.test.tsx`

**Interfaces:**
- Produces: `ArticleFrontmatter`, `getArticle(locale, slug)`, `getPublishedArticles(locale)`, dynamic article metadata, and grouped Special Pages data.

- [ ] **Step 1: Write failing article-loader tests**

```ts
it('loads exactly the approved canonical article set plus beginner guide', async () => {
  const articles = await getPublishedArticles('en')
  expect(articles.map(x => x.slug)).toEqual(expect.arrayContaining([
    'beginner-guide','fields-of-mistria','fields-of-mistria-wiki','fields-of-mistria-release-date',
    'fields-of-mistria-gameplay','fields-of-mistria-characters','fields-of-mistria-romance',
    'fields-of-mistria-vs-stardew-valley','fields-of-mistria-steam'
  ]))
})
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/articles.test.tsx tests/special-pages.test.tsx`
Expected: FAIL because loaders, routes, and MDX files do not exist.

- [ ] **Step 3: Implement the MDX loader and article template**

```ts
export interface ArticleFrontmatter {
  title: string
  description: string
  keyword: string
  slug: string
  sources: string[]
  status: 'publish'
}
```

`getArticle(locale, slug)` loads localized MDX, falls back to English, and returns `{ frontmatter, content, usedFallback }`. Article layout renders title, direct-answer lead, info box where supported, table of contents, H2 sections, sources, and categories.

- [ ] **Step 4: Write the nine evidence-bounded English MDX pages**

Use only the supplied JSON and research file. Filter advertisements and transcript filler. Attribute opinion as opinion. Use `待确认` for unsupported details. Each paragraph contains three to four sentences where natural; do not pad unsupported pages to reach 1,200 words.

- [ ] **Step 5: Implement Special Pages and legal pages**

Special Pages groups published content into Guides, Game Information, Characters & Romance, Platforms & Release, and Site Policies. Legal pages state that the site is independent and fan-made; operator, contact, jurisdiction, and effective date render `待确认`.

- [ ] **Step 6: Add locale translations without new facts**

Translate article headings, direct answers, and supported body text into the seven non-English locales. Where a full translation cannot be safely completed, omit that locale's MDX so the explicit English fallback notice appears.

- [ ] **Step 7: Verify and commit**

Run: `npm test -- tests/articles.test.tsx tests/special-pages.test.tsx && npm run build`
Expected: PASS and all generated article routes build.

Commit: `git add lib/content/articles.ts components/wiki app/[locale] content/articles tests && git commit -m "feat: add MDX wiki articles and directories"`

---

### Task 7: Enforce SEO, source safety, and brand-cleanliness

**Files:**
- Create: `scripts/validate-content.mjs`, `app/sitemap.ts`, `app/robots.ts`
- Create: `tests/seo.test.ts`, `tests/content-safety.test.ts`
- Modify: `package.json`, article frontmatter as validation requires

**Interfaces:**
- Produces: `npm run validate:content`, sitemap, robots metadata, canonical URLs, locale alternates, and article structured data.

- [ ] **Step 1: Write failing validation tests**

```ts
it.each(publishedArticles)('$slug has valid search metadata', article => {
  expect(article.title.length).toBeGreaterThanOrEqual(40)
  expect(article.title.length).toBeLessThanOrEqual(60)
  expect(article.title.toLowerCase()).toContain(article.keyword.toLowerCase())
  expect(article.description.length).toBeGreaterThanOrEqual(140)
  expect(article.description.length).toBeLessThanOrEqual(160)
  expect(article.description.toLowerCase()).toContain(article.keyword.toLowerCase())
})
```

Add safety assertions that piracy phrases have no routes, `sidebarCodes` contains only `暂无`, and `Stardew Valley` occurs publicly only in the comparison article.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/seo.test.ts tests/content-safety.test.ts`
Expected: FAIL on unvalidated metadata or missing scripts.

- [ ] **Step 3: Implement deterministic validation**

The script parses `keywords.json` and MDX frontmatter, reports exact offending file and measured length, rejects publish records without pages, rejects excluded records with slugs, and scans public copy for old branding outside the allowlisted comparison slug.

- [ ] **Step 4: Add sitemap, robots, and structured data**

Only published pages enter the sitemap. Every localized route emits canonical and `hreflang` alternates. Article pages emit `Article` JSON-LD using supplied title, description, source list, and site identity; do not invent author identity or publication dates.

- [ ] **Step 5: Fix metadata to exact limits and commit**

Run: `npm run validate:content && npm test -- tests/seo.test.ts tests/content-safety.test.ts && npm run build`
Expected: all commands PASS.

Commit: `git add scripts app/sitemap.ts app/robots.ts tests package.json content && git commit -m "test: enforce SEO and factual content rules"`

---

### Task 8: Final verification, social preview, and deployment

**Files:**
- Create: `public/og.png` only if generated image text passes inspection
- Modify: `app/layout.tsx` to add verified Open Graph/X metadata
- Create: `docs/verification/launch-checklist.md`

**Interfaces:**
- Consumes: completed site and all validation commands.
- Produces: verified production build and deployed Sites URL.

- [ ] **Step 1: Run the complete automated verification suite**

Run: `npm run validate:content && npm test && npm run build`
Expected: zero failures and successful Cloudflare-compatible output.

- [ ] **Step 2: Verify core route coverage**

Check generated routes for `/en`, `/en/special-pages`, `/en/wiki/beginner-guide`, all eight canonical SEO articles, `/en/privacy-policy`, and `/en/terms-of-service`, then repeat locale-switch checks for all eight locale prefixes.

- [ ] **Step 3: Generate and inspect one social preview**

Use the finished site's cream/brown/pixel-wiki visual language, exact `Fields of Mistria Wiki` title, and fan-made positioning. Reject or retry once if text is invented, misspelled, or missing; omit `og:image` if neither result is safe.

- [ ] **Step 4: Record verification evidence**

```md
# Launch Verification
- Content validation: PASS
- Unit/component tests: PASS
- Production build: PASS
- Old-brand scan: PASS (comparison article and internal docs allowlisted)
- Codes: `暂无` only
- Piracy routes: none
- Locale routes: 8/8
- Core page types: home, list, article, legal
```

- [ ] **Step 5: Deploy with Sites and commit**

Use the Sites hosting workflow, confirm the deployed URL loads, then stop the local development server.

Commit: `git add public app/layout.tsx docs/verification && git commit -m "chore: verify and prepare wiki launch"`

