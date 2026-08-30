import type { Metadata } from "next";
import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "@/i18n/messages";

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "من نحن" : "About" };
}

export default async function About({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = getMessages(locale).aboutPage;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="container story">
          <div>
            <div className="eyebrow">{t.drive}</div>
            <h2>{t.adviceTitle}</h2>
            <p>{t.p1}</p>
            <p>{t.p2}</p>
          </div>
          <div className="story-card">
            <blockquote>{t.quote}</blockquote>
            <p>{t.philosophy}</p>
          </div>
        </div>
      </section>
      <section className="section band">
        <div className="container band-grid">
          <div>
            <div className="eyebrow">{t.principles}</div>
            <h2>{t.practical}</h2>
          </div>
          <div>
            {t.items.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
            <Link className="button" href={localizedPath(locale, "/contact")}>
              {t.work}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
