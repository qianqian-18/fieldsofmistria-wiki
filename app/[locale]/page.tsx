import Link from "next/link";
import { notFound } from "next/navigation";
import homeData from "@/content/data/home.json";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const { hero, start, aboutGame, finalCta } = homeData.home;
  return (
    <>
      <section className="welcome-banner">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-copy">{hero.description}</p>
        <div className="hero-actions"><Link href={`/${locale}/wiki/beginner-guide`}>{hero.primaryCta}</Link><Link href={`/${locale}/wiki/fields-of-mistria-characters`}>{hero.secondaryCta}</Link><Link href={`/${locale}/special-pages`}>{hero.tertiaryCta}</Link></div>
        <ul className="stat-ribbon">{hero.stats.map((stat) => <li key={stat}>{stat}</li>)}</ul>
      </section>
      <div className="home-grid">
        <section className="wiki-panel start-panel"><header><span>{start.eyebrow}</span><h2>{start.title}</h2></header><div className="guide-list">{start.cards.map((card, index) => <article key={card.number}><b>{card.number}</b><div><h3>{card.title}</h3><p>{card.description}</p>{index > 0 && <small>{dictionary.pending}</small>}</div></article>)}</div></section>
        <section className="wiki-panel about-panel"><header><h2>{aboutGame.title}</h2></header>{aboutGame.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<dl>{aboutGame.stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></section>
      </div>
      <section className="wiki-panel code-panel"><h2>{dictionary.codes}</h2><strong>{homeData.sidebarCodes[0]}</strong><p>{dictionary.noCodes}</p></section>
      <section className="final-callout"><h2>{finalCta.title}</h2><p>{finalCta.description}</p><div><Link href={`/${locale}/wiki/beginner-guide`}>{finalCta.primary}</Link><a href="https://store.steampowered.com/app/2142790/Fields_of_Mistria/">{finalCta.secondary}</a></div></section>
    </>
  );
}
