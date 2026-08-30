import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getSiteSettings } from "@/services/api";
import { getCurrentLocale } from "@/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
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
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getCurrentLocale();
  const settings = await getSiteSettings(locale);
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <ScrollReveal />
        {settings.maintenance_mode ? (
          <main className="maintenance-page">
            <div>
              <span className="eyebrow">{settings.site_name}</span>
              <h1>{locale === "ar" ? "الموقع تحت الصيانة" : "We’ll be back shortly"}</h1>
              <p>
                {locale === "ar"
                  ? "نعمل حالياً على تحسين الموقع. يرجى المحاولة مرة أخرى قريباً."
                  : "We’re improving the website right now. Please check back soon."}
              </p>
            </div>
          </main>
        ) : (
          <>
            <SiteHeader settings={settings} />
            <main>{children}</main>
            <SiteFooter settings={settings} />
          </>
        )}
      </body>
    </html>
  );
}
