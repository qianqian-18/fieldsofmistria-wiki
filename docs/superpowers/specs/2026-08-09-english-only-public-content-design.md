# English-Only Public Content Design

## Goal

Ensure every visitor-facing page on Fields of Mistria Wiki displays English-only text.

## Scope

- Translate Chinese copy in public page data and published English articles.
- Replace public `待确认` labels with `To be confirmed`.
- Replace public `暂无` labels with `None available`.
- Preserve internal source filenames, keyword research data, scripts, plans, and historical documentation unless they are rendered publicly.

## Implementation

Update public content sources and UI-rendered strings without changing routes, page structure, metadata behavior, or the Cloudflare Pages configuration. Add an automated public-content scan that fails when Han characters appear in visitor-facing source files.

## Verification

- Run the repository test suite.
- Run the production build.
- Confirm the public-content scan reports no Chinese text.
- After Cloudflare deploys, verify the homepage, representative article, privacy page, terms page, robots file, and sitemap respond successfully.
