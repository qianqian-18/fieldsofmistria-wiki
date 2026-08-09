import { notFound } from "next/navigation";
import { WikiShell } from "@/components/wiki/WikiShell";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { absoluteUrl, languageAlternates } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { alternates: { canonical: absoluteUrl(`/${locale}`), languages: languageAlternates("") } };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <WikiShell locale={locale} dictionary={getDictionary(locale)}>{children}</WikiShell>;
}
