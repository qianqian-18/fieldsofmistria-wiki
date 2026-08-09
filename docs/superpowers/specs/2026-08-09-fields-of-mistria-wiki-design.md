# Fields of Mistria Wiki Replica — Design Specification

## Goal

Build a multilingual Fields of Mistria fan wiki in Next.js and MDX. The visual shell must closely reproduce the supplied Stardew Valley Wiki references while replacing all Stardew Valley branding and content with verified Fields of Mistria material.

## Reference Pages

- Home layout: `https://stardewvalleywiki.com/Stardew_Valley_Wiki`
- List layout: `https://stardewvalleywiki.com/Special:SpecialPages`
- Article layout reference: `https://stardewvalleywiki.com/Parsnip`

The top navigation is contextual. `Main page` always returns to the localized home page.

## Routes and Languages

Use the Next.js App Router with a locale prefix:

- `/[locale]` — home
- `/[locale]/special-pages` — grouped navigation/list page
- `/[locale]/wiki/beginner-guide` — representative guide article
- `/[locale]/wiki/[slug]` — SEO article pages
- `/[locale]/privacy-policy` and `/[locale]/terms-of-service` — legal pages

Supported locales are English, Simplified Chinese, Traditional Chinese, French, Japanese, Korean, Russian, and Spanish. Locale codes are `en`, `zh-cn`, `zh-tw`, `fr`, `ja`, `ko`, `ru`, and `es`. Browser language selects the initial locale, while a visible selector permits manual switching. English is the fallback.

The locale set follows the official Fields of Mistria FAQ: English is currently supported and the other seven languages are the announced first-wave beta localizations for version 1.0. Translations may restate supplied facts but must not introduce new facts.

## Visual Structure

Reproduce the reference wiki's overall presentation: pixel-game background, horizontal utility navigation, site identity, search, framed paper-like content surface, wiki typography, bordered tables, contextual sidebars, and footer hierarchy. Do not redesign the site as a modern generic landing page.

The home page maps the supplied marketing content into wiki-styled panels:

1. Hero with eyebrow, game title, description, verified stats, and three calls to action.
2. Four-card “Start Here” guide section.
3. Game introduction with two paragraphs and seven supplied facts.
4. Redemption code panel showing `暂无` and stating that no code has been confirmed.
5. Final call to action.

On narrow screens, sidebars move below the main article without abandoning the reference site's visual language.

## Branding and Content Rules

The public-facing site name is `Fields of Mistria Wiki`. The old game name must not remain in the home page, navigation, sidebars, footer, metadata, legal pages, accessibility text, or hidden configuration. References to Stardew Valley are permitted only inside the dedicated comparison article where the supplied source material explicitly discusses that comparison.

Use the supplied home JSON for home copy, footer copy, SEO metadata, and redemption-code state. Do not invent values, character names, codes, release details, or external links. Missing facts display `待确认`; missing redemption codes display `暂无`.

The supplied research files are source inputs:

- `C:/Users/Administrator/Desktop/关键词.MD`
- `C:/Users/Administrator/Desktop/关键词素材.MD`

Official website, Discord, and YouTube URLs are not present in the supplied JSON. They remain non-clickable and marked `待确认` unless separately verified from an official source. The Steam call to action may use the verified official Steam store page.

Legal pages contain only a neutral independent fan-site disclaimer and generic policy structure. Unknown operator identity, contact details, jurisdiction, and dates remain `待确认`.

## Content Architecture

MDX stores long-form home sections, guide content, and SEO articles. Locale dictionaries store interface labels. Shared components render the header, contextual navigation, language picker, search, content frame, sidebar, tables, article contents, source notes, categories, and footer.

`keywords.json` records each cleaned keyword, canonical keyword, route, status, and source coverage. Status values are:

- `publish` — enough supplied evidence exists for a useful page.
- `duplicate-intent` — points to a canonical page and does not create a duplicate article.
- `spelling-variant` — points to a canonical page.
- `needs-research` — withheld until adequate source material exists.
- `excluded` — unsafe or inappropriate intent, including piracy-oriented searches.

The input contains 249 non-empty rows and 215 unique strings. The phrases `fields of mistria download free`, `cs.rin fields of mistria`, and `field of mistria skidrow` are excluded rather than turned into download pages.

## Initial SEO Article Set

The first publishable batch contains eight canonical pages, each with one primary keyword:

1. `fields of mistria`
2. `fields of mistria wiki`
3. `fields of mistria release date`
4. `fields of mistria gameplay`
5. `fields of mistria characters`
6. `fields of mistria romance`
7. `fields of mistria vs stardew valley`
8. `fields of mistria steam`

Each page must:

- include the exact primary keyword in a 40–60 character title;
- include the keyword in a 140–160 character meta description;
- answer the search question immediately;
- use scannable H2 sections and paragraphs of three to four sentences;
- target roughly 1,200 words only when the supplied evidence supports that length;
- mark unsupported claims `待确认` instead of padding or inventing detail;
- include source attribution without copying long source passages.

Similar queries and misspellings map to the relevant canonical page to avoid duplicate thin pages and keyword cannibalization.

## Factual Boundaries

Permitted facts come from the supplied home JSON and research material. Research material includes Wikipedia-derived notes, the community wiki export, and two YouTube transcript excerpts. Content generation must filter advertisements, creator opinions presented as opinions, mistranscriptions, duplicate statements, and claims unsupported by the pasted excerpt.

Facts that have changed over time must be phrased with their date or version context when the source provides one. Conflicting claims are not silently reconciled; use the most authoritative supplied source or mark the point `待确认`.

## SEO and Discovery

Generate canonical URLs, locale `hreflang` alternates, Open Graph metadata, a sitemap, robots metadata, and article structured data. The site-wide title, description, and keywords use the supplied metadata. Page-specific metadata follows the validated length rules.

Search and navigation only expose published pages. Deferred keywords remain in the data file but do not create indexable thin pages.

## Failure and Fallback Behavior

- Unknown locale redirects to or renders the English fallback.
- Missing MDX renders a localized not-found page.
- Unconfirmed external destinations render `待确认` without a fake link.
- Missing localized article content falls back to English with a visible language notice.
- Empty code data renders `暂无`; no placeholder is formatted like a real code.

## Verification

Before delivery:

1. Build the production site successfully.
2. Validate all three core page types plus both legal pages.
3. Scan the whole project for unintended `Stardew Valley` branding; allow only the comparison article and internal reference documentation.
4. Validate every published title and description for keyword inclusion and required character length.
5. Scan redemption-code content and numeric claims against approved source data.
6. Check locale switching, canonical URLs, `hreflang`, sitemap, contextual navigation, and `Main page` behavior.
7. Check the reference-faithful layout at desktop and mobile widths.
8. Confirm piracy-oriented keywords do not produce pages or download links.

## Delivery Scope

The first release includes the wiki shell, eight locales, the home page, Special Pages list, beginner guide article, eight canonical SEO articles, two legal pages, keyword classification data, and production deployment. Content without adequate research remains deferred rather than fabricated.
