"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import type { Locale, Messages } from "@/i18n/messages";
import { localizedPath } from "@/i18n/messages";
import { fetchLiveProduct } from "@/services/api";
import type { Product } from "@/types/catalog";

export function ProductDetail({
  initialProduct,
  locale,
  messages: t,
}: {
  initialProduct: Product;
  locale: Locale;
  messages: Messages;
}) {
  const [product, setProduct] = useState(initialProduct);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const availability = product.availability ?? {
    status: "in_stock" as const,
    stock_quantity: null,
    minimum_order_quantity: 1,
    lead_time_days: null,
    can_request_quote: true,
  };

  useEffect(() => {
    let active = true;

    fetchLiveProduct(initialProduct.slug, locale)
      .then((latestProduct) => {
        if (!active) return;
        setProduct(latestProduct);
        setRefreshFailed(false);
      })
      .catch(() => {
        if (active) setRefreshFailed(true);
      });

    return () => {
      active = false;
    };
  }, [initialProduct.slug, locale]);

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
            {refreshFailed ? (
              <div className="notice error-notice">{t.catalog.refreshFailure}</div>
            ) : null}
            <div className="eyebrow">
              {product.brand?.name ?? t.common.axisSelect} · {product.sku}
            </div>
            <div className={`availability availability-${availability.status}`}>
              {t.availability[availability.status]}
              {availability.lead_time_days !== null
                ? ` · ${availability.lead_time_days} ${t.availability.days}`
                : ""}
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
            {availability.can_request_quote ? (
              <Link
                className="button"
                href={`${localizedPath(locale, "/contact")}?product=${product.id}&subject=${encodeURIComponent(`${t.product.quote}: ${product.name}`)}`}
              >
                {t.product.quote} <Arrow />
              </Link>
            ) : (
              <Link className="button dark" href={localizedPath(locale, "/contact")}>
                {t.product.askAlternative}
              </Link>
            )}
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
