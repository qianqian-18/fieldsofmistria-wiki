import { readFile, writeFile } from "node:fs/promises";

const source = process.argv[2];
const output = process.argv[3] ?? "content/data/keywords.json";
if (!source) throw new Error("Usage: node scripts/build-keywords.mjs <source> [output]");

const canonical = new Map([
  ["fields of mistria", "fields-of-mistria"],
  ["fields of mistria wiki", "fields-of-mistria-wiki"],
  ["fields of mistria release date", "fields-of-mistria-release-date"],
  ["fields of mistria gameplay", "fields-of-mistria-gameplay"],
  ["fields of mistria characters", "fields-of-mistria-characters"],
  ["fields of mistria romance", "fields-of-mistria-romance"],
  ["fields of mistria vs stardew valley", "fields-of-mistria-vs-stardew-valley"],
  ["fields of mistria steam", "fields-of-mistria-steam"],
]);
const excluded = new Set([
  "fields of mistria download free",
  "cs.rin fields of mistria",
  "field of mistria skidrow",
]);

const raw = await readFile(source, "utf8");
const unique = [...new Set(raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))].sort();
const records = unique.map((keyword) => {
  const normalized = keyword.toLowerCase();
  if (canonical.has(normalized)) {
    return { keyword, canonicalKeyword: normalized, slug: canonical.get(normalized), status: "publish", sources: ["关键词素材.MD"] };
  }
  if (excluded.has(normalized)) {
    return { keyword, canonicalKeyword: normalized, slug: null, status: "excluded", sources: [] };
  }
  const spellingVariant = /misteria|mystria|misria|mysteria|mistra|mistrial|msitria|mistris|mistrie|mistrer|opf mistrie|pf mistria|ields of/.test(normalized);
  return {
    keyword,
    canonicalKeyword: spellingVariant ? "fields of mistria" : normalized,
    slug: spellingVariant ? "fields-of-mistria" : null,
    status: spellingVariant ? "spelling-variant" : "needs-research",
    sources: spellingVariant ? ["关键词.MD"] : [],
  };
});

for (const [keyword, slug] of canonical) {
  if (!records.some((record) => record.keyword.toLowerCase() === keyword)) {
    records.push({ keyword, canonicalKeyword: keyword, slug, status: "publish", sources: ["关键词素材.MD"] });
  }
}
records.sort((a, b) => a.keyword.localeCompare(b.keyword));

await writeFile(output, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.log(`Wrote ${records.length} unique keyword records to ${output}`);
