import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { getAllProducts, getCategories } from "@/services/api";
import { getMessages, type Locale } from "@/i18n/messages";

interface ProductsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "كتالوج المنتجات" : "Product Catalog" };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = getMessages(locale).catalog;
  const [products, categories] = await Promise.all([getAllProducts(locale), getCategories(locale)]);

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
          <Suspense fallback={<p>{t.found}</p>}>
            <ProductCatalog
              products={products}
              categories={categories}
              locale={locale}
              messages={t}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
