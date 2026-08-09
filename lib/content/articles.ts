import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n/config";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  keyword: string;
  slug: string;
  category: string;
  sources: string[];
};

const root = path.join(process.cwd(), "content", "articles");

export async function getArticle(locale: Locale, slug: string) {
  let usedFallback = false;
  let file = path.join(root, locale, `${slug}.mdx`);
  try { await readFile(file, "utf8"); } catch { file = path.join(root, "en", `${slug}.mdx`); usedFallback = locale !== "en"; }
  try {
    const raw = await readFile(file, "utf8");
    const parsed = matter(raw);
    return { frontmatter: parsed.data as ArticleFrontmatter, content: parsed.content, usedFallback };
  } catch { return null; }
}

export async function getPublishedArticles(locale: Locale) {
  const localeDir = path.join(root, locale);
  const fallbackDir = path.join(root, "en");
  let files: string[];
  try { files = await readdir(localeDir); } catch { files = await readdir(fallbackDir); }
  return Promise.all(files.filter((file) => file.endsWith(".mdx")).map(async (file) => (await getArticle(locale, file.replace(/\.mdx$/, "")))!));
}
