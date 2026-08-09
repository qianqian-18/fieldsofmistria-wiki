import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("defines localized home, directory, and article routes in the wiki shell", async () => {
  const [layout, home, directory, article, shell] = await Promise.all([
    readFile(new URL("app/[locale]/layout.tsx", root), "utf8"),
    readFile(new URL("app/[locale]/page.tsx", root), "utf8"),
    readFile(new URL("app/[locale]/special-pages/page.tsx", root), "utf8"),
    readFile(new URL("app/[locale]/wiki/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("components/wiki/WikiShell.tsx", root), "utf8"),
  ]);

  assert.match(layout, /generateStaticParams/);
  assert.match(home, /hero\.eyebrow/);
  assert.match(directory, /getPublishedArticles/);
  assert.match(article, /MDXRemote/);
  assert.match(shell, /Fields of Mistria Wiki/);
  assert.doesNotMatch(`${home}\n${directory}\n${shell}`, /Stardew Valley Wiki/);
});
