import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/(.:)/, "$1"));

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(full) : [full];
  }))).flat();
}

test("publishes discovery metadata and blocks unsafe public content", async () => {
  const [sitemap, robots, articlePage, home] = await Promise.all([
    readFile(path.join(root, "app/sitemap.ts"), "utf8"),
    readFile(path.join(root, "app/robots.ts"), "utf8"),
    readFile(path.join(root, "app/[locale]/wiki/[slug]/page.tsx"), "utf8"),
    readFile(path.join(root, "content/data/home.json"), "utf8"),
  ]);
  assert.match(sitemap, /hreflang|alternates/);
  assert.match(robots, /sitemap/);
  assert.match(articlePage, /canonical/);
  assert.doesNotMatch(home, /[A-Z0-9]{8,}.*redeem/i);

  const publicFiles = [
    ...(await filesUnder(path.join(root, "app"))),
    ...(await filesUnder(path.join(root, "components"))),
    ...(await filesUnder(path.join(root, "content/articles/en"))).filter((file) => !file.endsWith("fields-of-mistria-vs-stardew-valley.mdx")),
  ];
  const publicText = (await Promise.all(publicFiles.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(publicText, /Stardew Valley Wiki/);
  assert.doesNotMatch(publicText, /cs\.rin|skidrow|download free/i);
});
