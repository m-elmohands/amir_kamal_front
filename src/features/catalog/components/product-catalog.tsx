"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { Locale, Messages } from "@/i18n/messages";
import { fetchLiveCategories, fetchLiveProducts } from "@/services/api";
import type { Category, Product } from "@/types/catalog";

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  messages: Messages["catalog"];
}

export function ProductCatalog({ products, categories, locale, messages: t }: ProductCatalogProps) {
  const [liveProducts, setLiveProducts] = useState(products);
  const [liveCategories, setLiveCategories] = useState(categories);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim().toLocaleLowerCase(locale) ?? "";
  const category = searchParams.get("category") ?? "";
  const filteredProducts = liveProducts.filter(
    (product) =>
      (!category || product.category.slug === category) &&
      (!search ||
        `${product.name} ${product.sku} ${product.summary}`
          .toLocaleLowerCase(locale)
          .includes(search)),
  );

  useEffect(() => {
    let active = true;

    Promise.all([fetchLiveProducts(locale), fetchLiveCategories(locale)])
      .then(([latestProducts, latestCategories]) => {
        if (!active) return;
        setLiveProducts(latestProducts);
        setLiveCategories(latestCategories);
        setRefreshFailed(false);
      })
      .catch(() => {
        if (active) setRefreshFailed(true);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  return (
    <>
      <form className="filters" role="search">
        <label className="sr-only" htmlFor="search">
          {t.searchLabel}
        </label>
        <input
          id="search"
          name="search"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder={t.searchPlaceholder}
        />
        <select name="category" defaultValue={category} aria-label={t.allCategories}>
          <option value="">{t.allCategories}</option>
          {liveCategories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="button">{t.search}</button>
      </form>
      <p>
        {filteredProducts.length} {t.found}
      </p>
      {refreshFailed ? <div className="notice error-notice">{t.refreshFailure}</div> : null}
      {filteredProducts.length ? (
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} locale={locale} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyText}</p>
        </div>
      )}
    </>
  );
}
