"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localizePath, type Locale } from "@/lib/i18n/config";
import localeNames from "@/content/data/locales.json";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="language-switcher">
      <span>{label}</span>
      <select value={locale} onChange={(event) => router.push(localizePath(pathname, event.target.value as Locale))}>
        {locales.map((code) => (
          <option key={code} value={code}>{localeNames.find((item) => item.code === code)?.label ?? code}</option>
        ))}
      </select>
    </label>
  );
}
