import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/api";
import { Arrow } from "@/components/icons";
import { getCurrentLocale, getMessages, localizedPath } from "@/i18n/messages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.name ?? "Product", description: product?.summary };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getCurrentLocale();
  const t = getMessages(locale);
  const product = await getProduct((await params).slug, locale);
  if (!product) notFound();
  return (
    <>
      <section className="section">
        <div className="container detail">
          <div className="product-visual">
            <div className="machine-part">
              <i />
              <i />
              <i />
            </div>
            <span>{product.category.name}</span>
          </div>
          <div>
            <div className="eyebrow">
              {product.brand?.name ?? t.common.axisSelect} · {product.sku}
            </div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="specs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div className="spec-row" key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <Link
              className="button"
              href={`${localizedPath(locale, "/contact")}?product=${product.id}&subject=${encodeURIComponent(`Quote: ${product.name}`)}`}
            >
              {t.product.quote} <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <div>
            <h2>{t.product.fitTitle}</h2>
            <p>{t.product.fitText}</p>
          </div>
          <Link className="button" href={localizedPath(locale, "/contact")}>
            {t.product.askExpert}
          </Link>
        </div>
      </section>
    </>
  );
}
