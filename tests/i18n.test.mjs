import assert from "node:assert/strict";
import test from "node:test";

test("locale helpers support eight languages and preserve route paths", async () => {
  const { locales, isLocale, localizePath } = await import("../lib/i18n/config.ts");

  assert.equal(locales.length, 8);
  assert.equal(isLocale("ja"), true);
  assert.equal(isLocale("de"), false);
  assert.equal(localizePath("/en/wiki/fields-of-mistria", "ja"), "/ja/wiki/fields-of-mistria");
  assert.equal(localizePath("/special-pages", "fr"), "/fr/special-pages");
});
