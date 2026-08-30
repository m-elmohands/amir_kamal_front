"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import type { Locale, Messages } from "@/i18n/messages";
import { localizedPath } from "@/i18n/messages";
import { fetchLiveCategories, fetchLiveProducts } from "@/services/api";
import type { Category, Product } from "@/types/catalog";

export function HomeCatalog({
  categories,
  products,
  locale,
  messages,
}: {
  categories: Category[];
  products: Product[];
  locale: Locale;
  messages: Messages;
}) {
  const [liveCategories, setLiveCategories] = useState(categories);
  const [liveProducts, setLiveProducts] = useState(products);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const featured = liveProducts.filter((product) => product.is_featured).slice(0, 3);

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
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{messages.home.categoryEyebrow}</div>
              <h2>{messages.home.categoryTitle}</h2>
            </div>
            <p>{messages.home.categoryIntro}</p>
          </div>
          {refreshFailed ? (
            <div className="notice error-notice">{messages.catalog.refreshFailure}</div>
          ) : null}
          <div className="category-grid">
            {liveCategories.slice(0, 4).map((category, index) => (
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
              <div className="eyebrow">{messages.home.featuredEyebrow}</div>
              <h2>{messages.home.featuredTitle}</h2>
            </div>
            <Link className="text-link" href={localizedPath(locale, "/products")}>
              {messages.home.viewCatalog} <Arrow />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} locale={locale} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
