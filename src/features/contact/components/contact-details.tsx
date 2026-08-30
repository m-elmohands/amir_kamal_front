"use client";

import type { Messages } from "@/i18n/messages";
import { useSiteSettings } from "@/features/settings/components/site-shell";

export function ContactDetails({ messages: t }: { messages: Messages["contact"] }) {
  const settings = useSiteSettings();

  return (
    <div>
      <h2>{t.sideTitle}</h2>
      <p>{t.sideText}</p>
      <p>
        <strong>{t.phone}</strong>
        <br />
        {settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : "—"}
      </p>
      <p>
        <strong>{t.email}</strong>
        <br />
        {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : "—"}
      </p>
      <p>
        <strong>{t.hours}</strong>
        <br />
        {t.hoursValue}
      </p>
    </div>
  );
}
