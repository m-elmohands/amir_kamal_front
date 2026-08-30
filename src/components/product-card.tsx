import Link from "next/link";
import type { Product } from "@/types/catalog";
import { Arrow } from "./icons";
import { getMessages, localizedPath, type Locale } from "@/i18n/messages";

export function ProductCard({
  product,
  locale,
  index = 0,
}: {
  product: Product;
  locale: Locale;
  index?: number;
}) {
  const t = getMessages(locale);
  const availability = product.availability ?? {
    status: "in_stock" as const,
    stock_quantity: null,
    minimum_order_quantity: 1,
    lead_time_days: null,
    can_request_quote: true,
  };
  return (
    <article className="product-card">
      <Link
        href={localizedPath(locale, `/products/${product.slug}`)}
        className={`product-visual visual-${index % 4}`}
        aria-label={`${t.common.viewDetails}: ${product.name}`}
      >
        <div className="machine-part">
          <i />
          <i />
          <i />
        </div>
        <span>{product.category.name}</span>
      </Link>
      <div className="product-info">
        <div className="product-meta">
          <div className="eyebrow">
            {product.brand?.name ?? t.common.axisSelect} · {product.sku}
          </div>
          <span className={`availability availability-${availability.status}`}>
            {t.availability[availability.status]}
          </span>
        </div>
        <h3>
          <Link href={localizedPath(locale, `/products/${product.slug}`)}>{product.name}</Link>
        </h3>
        <p>{product.summary}</p>
        <div className="product-actions">
          <Link href={localizedPath(locale, `/products/${product.slug}`)} className="text-link">
            {t.common.viewDetails} <Arrow />
          </Link>
          {availability.can_request_quote ? (
            <Link
              className="quote-link"
              href={`${localizedPath(locale, "/contact")}?product=${product.id}&subject=${encodeURIComponent(`${t.product.quote}: ${product.name}`)}`}
            >
              {t.product.quote}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
