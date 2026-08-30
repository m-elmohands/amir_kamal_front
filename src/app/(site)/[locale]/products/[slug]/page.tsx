import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProductSlugs, getProduct } from "@/services/api";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import { getMessages, locales, type Locale } from "@/i18n/messages";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ locale: Locale; slug: string }>> {
  const slugs = await getAllProductSlugs();

  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale);
  return { title: product?.name ?? "Product", description: product?.summary };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getMessages(locale);
  const product = await getProduct(slug, locale);
  if (!product) notFound();

  return <ProductDetail initialProduct={product} locale={locale} messages={t} />;
}
