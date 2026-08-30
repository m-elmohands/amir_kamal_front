"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/messages";
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "ar" : "en";

  const segments = pathname.split("/").filter(Boolean);
  const localizedSegments = ["en", "ar"].includes(segments[0])
    ? [nextLocale, ...segments.slice(1)]
    : [nextLocale, ...segments];
  const target = `/${localizedSegments.join("/")}`;

  return (
    <Link
      className="language-switcher"
      href={target}
      aria-label={nextLocale === "ar" ? "التبديل إلى العربية" : "Switch to English"}
    >
      {nextLocale === "ar" ? "العربية" : "English"}
    </Link>
  );
}
