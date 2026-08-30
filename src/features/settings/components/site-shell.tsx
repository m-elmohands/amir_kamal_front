"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMessages, type Locale } from "@/i18n/messages";
import { fetchLiveSiteSettings } from "@/services/api";
import type { SiteSettings } from "@/types/settings";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function useSiteSettings(): SiteSettings {
  const settings = useContext(SiteSettingsContext);

  if (!settings) throw new Error("useSiteSettings must be used inside SiteShell.");

  return settings;
}

export function SiteShell({
  children,
  initialSettings,
  locale,
}: {
  children: React.ReactNode;
  initialSettings: SiteSettings;
  locale: Locale;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const t = getMessages(locale);

  useEffect(() => {
    let active = true;

    fetchLiveSiteSettings(locale)
      .then((latestSettings) => {
        if (!active) return;
        setSettings(latestSettings);
        setRefreshFailed(false);
      })
      .catch(() => {
        if (active) setRefreshFailed(true);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!settings.favicon_url) return;

    let icon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');

    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.append(icon);
    }

    icon.href = settings.favicon_url;
  }, [settings.favicon_url]);

  return (
    <SiteSettingsContext.Provider value={settings}>
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
          <SiteHeader settings={settings} locale={locale} />
          <main>{children}</main>
          <SiteFooter settings={settings} locale={locale} />
        </>
      )}
      {refreshFailed ? (
        <div className="data-refresh-toast" role="status">
          {t.common.dataRefreshFailed}
        </div>
      ) : null}
    </SiteSettingsContext.Provider>
  );
}
