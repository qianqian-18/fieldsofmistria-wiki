# Cloudflare Pages Deployment Design

## Goal

Deploy the existing Fields of Mistria wiki from the `main` branch to Cloudflare Pages as a static Next.js export.

## Root Cause

The committed `package-lock.json` is not valid JSON. Binary data appears inside an `integrity` value, so Cloudflare's dependency installation fails at `npm ci` before the Next.js build starts.

The previously configured `.next` output directory is also not a deployable Cloudflare Pages static artifact.

## Design

- Remove the corrupted npm lock file so Cloudflare performs a normal dependency installation.
- Configure Next.js with `output: "export"` so the build produces the `out` directory expected by Cloudflare Pages.
- Replace the server-side root redirect with a static-export-compatible client redirect and a visible fallback link to `/en`.
- Keep all localized and article routes statically generated through their existing `generateStaticParams` functions.
- Configure Cloudflare Pages with production branch `main`, build command `npm run build`, and output directory `out`.
- Set `NODE_VERSION=22` and set `NEXT_PUBLIC_SITE_URL` to the production custom-domain origin.

## Verification

- Confirm the repository no longer contains an invalid npm lock file.
- Install dependencies from `package.json` in a clean environment.
- Run the existing tests and lint checks.
- Run `npm run build` and confirm `out/index.html`, localized pages, article pages, `robots.txt`, and `sitemap.xml` exist.
- Trigger a Cloudflare deployment and smoke-test the Pages URL before attaching or validating the custom domain.

## Constraints

- No Workers or OpenNext adapter is introduced.
- No application content, SEO text, routes, or visual styling changes beyond the root redirect fallback.
- A fresh lock file may be generated later from a clean npm environment and committed separately.
