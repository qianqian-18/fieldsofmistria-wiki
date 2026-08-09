import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/content/articles";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles("en");
  const fixed = ["", "/special-pages", "/privacy-policy", "/terms-of-service"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const suffix of fixed) {
      entries.push({ url: absoluteUrl(`/${locale}${suffix}`), changeFrequency: suffix ? "monthly" : "weekly", alternates: { languages: languageAlternates(suffix) } });
    }
    for (const article of articles) {
      const suffix = `/wiki/${article.frontmatter.slug}`;
      entries.push({ url: absoluteUrl(`/${locale}${suffix}`), changeFrequency: "monthly", alternates: { languages: languageAlternates(suffix) } });
    }
  }
  return entries;
}
