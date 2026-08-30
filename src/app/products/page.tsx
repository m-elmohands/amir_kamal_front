import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/services/api";
import { getCurrentLocale, getMessages } from "@/i18n/messages";
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getCurrentLocale()) === "ar" ? "كتالوج المنتجات" : "Product Catalog" };
}
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const filters = await searchParams;
  const locale = await getCurrentLocale();
  const t = getMessages(locale).catalog;
  const [{ data, meta }, categories] = await Promise.all([
    getProducts({ ...filters, locale }),
    getCategories(locale),
  ]);
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
        <div className="container">
          <form className="filters" role="search">
            <label className="sr-only" htmlFor="search">
              {t.searchLabel}
            </label>
            <input
              id="search"
              name="search"
              defaultValue={filters.search}
              placeholder={t.searchPlaceholder}
            />
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              aria-label={t.allCategories}
            >
              <option value="">{t.allCategories}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="button">{t.search}</button>
          </form>
          <p>
            {meta.total} {t.found}
          </p>
          {data.length ? (
            <div className="products-grid">
              {data.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>{t.emptyTitle}</h3>
              <p>{t.emptyText}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
