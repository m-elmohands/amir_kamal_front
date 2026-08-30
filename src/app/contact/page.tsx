import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { getCurrentLocale, getMessages } from "@/i18n/messages";
import { getSiteSettings } from "@/services/api";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: (await getCurrentLocale()) === "ar" ? "التواصل وعروض الأسعار" : "Contact & Quotes",
  };
}
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; subject?: string }>;
}) {
  const params = await searchParams;
  const locale = await getCurrentLocale();
  const t = getMessages(locale);
  const settings = await getSiteSettings(locale);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{t.contact.eyebrow}</div>
          <h1>{t.contact.title}</h1>
          <p>{t.contact.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="container form-grid">
          <div>
            <h2>{t.contact.sideTitle}</h2>
            <p>{t.contact.sideText}</p>
            <p>
              <strong>{t.contact.phone}</strong>
              <br />
              {settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : "—"}
            </p>
            <p>
              <strong>{t.contact.email}</strong>
              <br />
              {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : "—"}
            </p>
            <p>
              <strong>{t.contact.hours}</strong>
              <br />
              {t.contact.hoursValue}
            </p>
          </div>
          <ContactForm
            productId={params.product ? Number(params.product) : undefined}
            initialSubject={params.subject}
            messages={t.contact}
          />
        </div>
      </section>
    </>
  );
}
