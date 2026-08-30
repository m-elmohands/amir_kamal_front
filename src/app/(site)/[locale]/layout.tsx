import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { SiteShell } from "@/features/settings/components/site-shell";
import { getSiteSettings } from "@/services/api";
import { isLocale, locales, type Locale } from "@/i18n/messages";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: Locale }> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const settings = await getSiteSettings(locale);
  const icons = settings.favicon_url
    ? {
        icon: settings.favicon_url,
        shortcut: settings.favicon_url,
        apple: settings.favicon_url,
      }
    : undefined;

  return {
    title: {
      default: settings.seo.title ?? settings.site_name,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.seo.description,
    icons,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const settings = await getSiteSettings(locale);
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <SiteShell initialSettings={settings} locale={locale}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
