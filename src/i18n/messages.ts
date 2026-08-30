import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Messages = typeof en;
const dictionaries: Record<Locale, Messages> = { en, ar };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
