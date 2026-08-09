"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ContextNav({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname();
  const isArticle = pathname.includes("/wiki/");
  return (
    <nav className="context-nav" aria-label={dictionary.navigation}>
      <Link href={`/${locale}`} className={!isArticle && !pathname.includes("special-pages") ? "active" : ""}>{dictionary.mainPage}</Link>
      <Link href={`/${locale}/special-pages`} className={pathname.includes("special-pages") ? "active" : ""}>{dictionary.specialPages}</Link>
      {isArticle ? <span className="active">{dictionary.article}</span> : <Link href={`/${locale}/wiki/beginner-guide`}>{dictionary.guides}</Link>}
    </nav>
  );
}
