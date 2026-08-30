import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactDetails } from "@/features/contact/components/contact-details";
import { ContactForm } from "@/features/contact/components/contact-form";
import { getMessages, type Locale } from "@/i18n/messages";

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "التواصل وعروض الأسعار" : "Contact & Quotes" };
}

export default async function Contact({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = getMessages(locale);

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
          <ContactDetails messages={t.contact} />
          <Suspense fallback={<div className="form" aria-hidden="true" />}>
            <ContactForm messages={t.contact} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
