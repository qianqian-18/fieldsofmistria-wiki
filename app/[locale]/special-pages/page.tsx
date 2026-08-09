import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/content/articles";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export default async function SpecialPages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const articles = await getPublishedArticles(locale);
  const groups = Map.groupBy(articles, (article) => article.frontmatter.category);
  return <article className="article-page"><header className="article-heading"><p>{dictionary.navigation}</p><h1>{dictionary.specialPages}</h1><span>{articles.length} verified pages</span></header><p className="lead">Browse all published guides and reference pages. Topics without enough verified research remain hidden until their sources are confirmed.</p><div className="special-grid">{[...groups].map(([category, items]) => <section key={category}><h2>{category}</h2><ul>{items.map((article) => <li key={article.frontmatter.slug}><Link href={`/${locale}/wiki/${article.frontmatter.slug}`}>{article.frontmatter.title}</Link></li>)}</ul></section>)}</div></article>;
}
