import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses the Fields of Mistria identity and standard Next.js scripts", async () => {
  const [layout, page, packageJson] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(layout, /Fields of Mistria Wiki 鈥?Guides, Farming, Romance/);
  assert.doesNotMatch(layout, /Starter Project/);
  assert.doesNotMatch(page, /_sites-preview|codex-preview/);
  assert.match(packageJson, /"dev": "next dev --webpack"/);
  assert.match(packageJson, /"build": "next build --webpack"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|drizzle-orm|@cloudflare\/vite-plugin/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
});

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
