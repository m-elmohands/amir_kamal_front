import Link from "next/link";
import { Arrow, Icon } from "@/components/icons";
import { AnimatedStats } from "@/features/home/components/animated-stats";
import { HomeCatalog } from "@/features/home/components/home-catalog";
import { getCategories, getProducts } from "@/services/api";
import { getMessages, localizedPath, type Locale } from "@/i18n/messages";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getMessages(locale);
  const [{ data: allProducts }, categories] = await Promise.all([
    getProducts({ locale }),
    getCategories(locale),
  ]);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{t.home.eyebrow}</div>
            <h1>
              {t.home.titleA}
              <br />
              {t.home.titleB} <span>{t.home.titleAccent}</span>
            </h1>
            <p>{t.home.intro}</p>
            <div className="hero-actions">
              <Link className="button" href={localizedPath(locale, "/products")}>
                {t.home.browse} <Arrow />
              </Link>
              <Link className="button dark" href={localizedPath(locale, "/contact")}>
                {t.home.expert}
              </Link>
            </div>
          </div>
          <div className="hero-art" role="img" aria-label="Abstract industrial lathe">
            <div className="lathe" />
            <div className="hero-badge">{t.home.heroBadge}</div>
          </div>
        </div>
      </section>
      <section className="trust">
        <div className="container trust-grid">
          {t.home.trust.map(({ title, text: description }, index) => (
            <div className="trust-item" key={title}>
              <Icon name={(["tool", "shield", "truck", "support"] as const)[index]} />
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <HomeCatalog categories={categories} products={allProducts} locale={locale} messages={t} />
      <section className="section process-section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.home.processEyebrow}</div>
              <h2>{t.home.processTitle}</h2>
            </div>
            <p>{t.home.processIntro}</p>
          </div>
          <ol className="process-grid">
            {t.home.processSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section band">
        <div className="container band-grid">
          <div>
            <div className="eyebrow">{t.home.partnerEyebrow}</div>
            <h2>{t.home.partnerTitle}</h2>
            <p>{t.home.partnerText}</p>
            <Link className="button" href={localizedPath(locale, "/about")}>
              {t.home.howWeWork} <Arrow />
            </Link>
          </div>
          <AnimatedStats stats={t.home.stats} />
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <div>
            <h2>{t.home.ctaTitle}</h2>
            <p>{t.home.ctaText}</p>
          </div>
          <Link className="button" href={localizedPath(locale, "/contact")}>
            {t.common.requestQuote} <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
