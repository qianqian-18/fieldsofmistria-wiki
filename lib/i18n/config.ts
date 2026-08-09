export const locales = ["en", "zh-cn", "zh-tw", "fr", "ja", "ko", "ru", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizePath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments[0] = nextLocale;
  else segments.unshift(nextLocale);
  return `/${segments.join("/")}`;
}
