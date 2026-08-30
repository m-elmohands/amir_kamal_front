import Link from "next/link";
import { Arrow, Icon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { AnimatedStats } from "@/features/home/components/animated-stats";
import { getCategories, getProducts } from "@/services/api";
import { getCurrentLocale, getMessages, localizedPath } from "@/i18n/messages";
export default async function Home() {
  const locale = await getCurrentLocale();
  const t = getMessages(locale);
  const [{ data: allProducts }, categories] = await Promise.all([
    getProducts({ locale }),
    getCategories(locale),
  ]);
  const featured = allProducts.filter((p) => p.is_featured).slice(0, 3);
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
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.home.categoryEyebrow}</div>
              <h2>{t.home.categoryTitle}</h2>
            </div>
            <p>{t.home.categoryIntro}</p>
          </div>
          <div className="category-grid">
            {categories.slice(0, 4).map((category, index) => (
              <Link
                href={`${localizedPath(locale, "/products")}?category=${category.slug}`}
                className="category-card"
                key={category.slug}
              >
                <span>0{index + 1}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.home.featuredEyebrow}</div>
              <h2>{t.home.featuredTitle}</h2>
            </div>
            <Link className="text-link" href={localizedPath(locale, "/products")}>
              {t.home.viewCatalog} <Arrow />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
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
