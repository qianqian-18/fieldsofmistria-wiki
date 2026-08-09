# Fields of Mistria Wiki

An independent fan-made Fields of Mistria guide site built with Next.js, MDX, and localized routes.

## Features

- Wiki-style home page, special-pages directory, and article pages
- Eight locale routes: English, Simplified Chinese, Traditional Chinese, French, Japanese, Korean, Russian, and Spanish
- MDX article content with canonical URLs and `hreflang` metadata
- Static sitemap and robots metadata
- Verified-content policy: unknown facts are marked `待确认`, and no redemption codes are invented

## Local development

Node.js 22 or newer is recommended.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`; the root route redirects to `/en`.

## Verification

```bash
npm test
npm run lint
npm run build
```

## Content

- Homepage research data: `content/data/home.json`
- Keyword decisions: `content/data/keywords.json`
- Locale configuration: `content/data/locales.json`
- MDX articles: `content/articles/en/`

This project is not affiliated with NPC Studio. Fields of Mistria and related names are trademarks of their respective owners.
