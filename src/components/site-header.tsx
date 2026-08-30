import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/i18n/messages";
import { LanguageSwitcher } from "./language-switcher";
import type { SiteSettings } from "@/types/settings";

export function SiteHeader({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = getMessages(locale);
  return (
    <>
      <div className="utility">
        <div className="container">
          <span>{t.header.tagline}</span>
          <span>
            {t.header.talk}{" "}
            {settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : null}
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link href={localizedPath(locale, "/")} className="logo" aria-label={settings.site_name}>
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_url} alt={settings.site_name} />
            ) : (
              settings.site_name
            )}
          </Link>
          <nav aria-label="Primary navigation">
            <Link href={localizedPath(locale, "/products")}>{t.common.products}</Link>
            <Link href={localizedPath(locale, "/about")}>{t.common.about}</Link>
            <Link href={localizedPath(locale, "/contact")}>{t.common.contact}</Link>
          </nav>
          <LanguageSwitcher locale={locale} />
          <Link className="button small" href={localizedPath(locale, "/contact")}>
            {t.common.requestQuote}
          </Link>
        </div>
      </header>
    </>
  );
}
