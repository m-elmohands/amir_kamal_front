import Link from "next/link";
import type { Product } from "@/types/catalog";
import { Arrow } from "./icons";
import { getCurrentLocale, getMessages, localizedPath } from "@/i18n/messages";
export async function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const locale = await getCurrentLocale();
  const t = getMessages(locale);
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
        <div className="eyebrow">
          {product.brand?.name ?? t.common.axisSelect} · {product.sku}
        </div>
        <h3>
          <Link href={localizedPath(locale, `/products/${product.slug}`)}>{product.name}</Link>
        </h3>
        <p>{product.summary}</p>
        <Link href={localizedPath(locale, `/products/${product.slug}`)} className="text-link">
          {t.common.viewDetails} <Arrow />
        </Link>
      </div>
    </article>
  );
}
