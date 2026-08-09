import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import homeData from "@/content/data/home.json";
import { ContextNav } from "./ContextNav";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function WikiShell({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  return (
    <div className="site-canvas">
      <header className="site-header">
        <div className="utility-bar">
          <span>Fields of Mistria Wiki</span>
          <LanguageSwitcher locale={locale} label={dictionary.language} />
        </div>
        <Link href={`/${locale}`} className="pixel-logo" aria-label="Fields of Mistria Wiki home">
          <span className="logo-sprout">✦</span>
          <strong>FIELDS OF MISTRIA</strong>
          <small>COMMUNITY WIKI</small>
        </Link>
        <div className="search-row">
          <ContextNav locale={locale} dictionary={dictionary} />
          <form className="wiki-search" action={`/${locale}/special-pages`}>
            <input name="q" aria-label={dictionary.search} placeholder={dictionary.search} />
            <button type="submit" aria-label={dictionary.search}>⌕</button>
          </form>
        </div>
      </header>
      <div className="wiki-frame">
        <main className="wiki-content">{children}</main>
        <aside className="wiki-sidebar">
          <section>
            <h2>{dictionary.navigation}</h2>
            <Link href={`/${locale}`}>{dictionary.mainPage}</Link>
            <Link href={`/${locale}/special-pages`}>{dictionary.specialPages}</Link>
            <Link href={`/${locale}/wiki/beginner-guide`}>{dictionary.guides}</Link>
          </section>
          <section>
            <h2>{dictionary.codes}</h2>
            <p className="code-empty">{homeData.sidebarCodes[0]}</p>
            <small>{dictionary.noCodes}</small>
          </section>
          <section>
            <h2>{dictionary.officialLinks}</h2>
            <a href="https://store.steampowered.com/app/2142790/Fields_of_Mistria/" target="_blank" rel="noreferrer">Steam</a>
            <span>{homeData.footer.officialDiscord}: {dictionary.pending}</span>
            <span>{homeData.footer.officialYoutube}: {dictionary.pending}</span>
          </section>
        </aside>
      </div>
      <footer className="site-footer">
        <div><strong>{homeData.footer.aboutTitle}</strong><p>{homeData.footer.about}</p></div>
        <nav><Link href={`/${locale}/privacy-policy`}>{dictionary.privacy}</Link><Link href={`/${locale}/terms-of-service`}>{dictionary.terms}</Link></nav>
        <small>Independent fan-made guide · NPC Studio affiliation: {dictionary.pending}</small>
      </footer>
    </div>
  );
}
