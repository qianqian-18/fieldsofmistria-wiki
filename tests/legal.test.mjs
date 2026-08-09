import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("legal pages identify the fan site without invented operator details", async () => {
  const [privacy, terms] = await Promise.all([
    readFile(new URL("app/[locale]/privacy-policy/page.tsx", root), "utf8"),
    readFile(new URL("app/[locale]/terms-of-service/page.tsx", root), "utf8"),
  ]);
  const legal = `${privacy}\n${terms}`;
  assert.match(legal, /independent fan-made/i);
  assert.match(legal, /待确认/);
  assert.doesNotMatch(legal, /Stardew Valley Wiki/);
});
