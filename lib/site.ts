import { locales, type Locale } from "@/lib/i18n/config";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function languageAlternates(pathWithoutLocale: string) {
  return Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(`/${locale}${pathWithoutLocale}`)])) as Record<Locale, string>;
}
