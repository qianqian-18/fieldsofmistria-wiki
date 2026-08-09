import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("content data preserves verified codes and keyword decisions", async () => {
  const [home, keywords, locales] = await Promise.all([
    readFile(new URL("content/data/home.json", root), "utf8").then(JSON.parse),
    readFile(new URL("content/data/keywords.json", root), "utf8").then(JSON.parse),
    readFile(new URL("content/data/locales.json", root), "utf8").then(JSON.parse),
  ]);

  assert.deepEqual(home.sidebarCodes, ["None available", "None available"]);
  assert.deepEqual(locales.map((item) => item.code), [
    "en", "zh-cn", "zh-tw", "fr", "ja", "ko", "ru", "es",
  ]);
  assert.deepEqual(locales.slice(1, 3).map(({ label, short }) => ({ label, short })), [
    { label: "Simplified Chinese", short: "ZH-CN" },
    { label: "Traditional Chinese", short: "ZH-TW" },
  ]);
  assert.equal(keywords.filter((item) => item.status === "publish").length, 8);
  for (const keyword of [
    "fields of mistria download free",
    "cs.rin fields of mistria",
    "field of mistria skidrow",
  ]) {
    assert.equal(keywords.find((item) => item.keyword === keyword)?.status, "excluded");
  }
});
