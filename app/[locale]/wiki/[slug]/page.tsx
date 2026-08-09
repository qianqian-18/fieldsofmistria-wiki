import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticle } from "@/lib/content/articles";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/site";
import { getPublishedArticles } from "@/lib/content/articles";

export async function generateStaticParams() {
  const articles = await getPublishedArticles("en");
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.frontmatter.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await getArticle(locale, slug);
  return article ? {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: {
      canonical: absoluteUrl(`/${locale}/wiki/${slug}`),
      languages: languageAlternates(`/wiki/${slug}`),
    },
  } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticle(locale, slug);
  if (!article) notFound();
  const dictionary = getDictionary(locale);
  return <article className="article-page"><header className="article-heading"><p>{dictionary.article}</p><h1>{article.frontmatter.title}</h1><span>{article.frontmatter.category}</span></header>{article.usedFallback && <p className="fallback-notice">{dictionary.fallbackNotice}</p>}<aside className="article-infobox"><strong>Fields of Mistria</strong><dl><div><dt>Keyword</dt><dd>{article.frontmatter.keyword}</dd></div><div><dt>Source status</dt><dd>Verified material only</dd></div></dl></aside><div className="mdx-content"><MDXRemote source={article.content} /></div><section className="article-sources"><h2>{dictionary.sources}</h2><ul>{article.frontmatter.sources.map((source) => <li key={source}>{source}</li>)}</ul></section></article>;
}
