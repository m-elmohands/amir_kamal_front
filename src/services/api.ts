import { cache } from "react";
import { categories as fallbackCategories, products as fallbackProducts } from "./fallback-data";
import type { Category, InquiryPayload, PaginatedProducts, Product } from "@/types/catalog";
import type { SiteSettings } from "@/types/settings";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit, retries = 1): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
      next: init?.method || init?.cache === "no-store" ? undefined : { revalidate: 60 },
    });
    const payload = (await response.json().catch(() => null)) as
      (T & { message?: string; errors?: Record<string, string[]> }) | null;

    if (!response.ok) {
      throw new ApiError(
        payload?.message ?? `Request failed (${response.status})`,
        response.status,
        payload?.errors,
      );
    }

    if (!payload) throw new ApiError("The API returned an empty response.", response.status);

    return payload;
  } catch (error) {
    if (retries > 0) return request<T>(path, init, retries - 1);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
export async function getProducts(
  filters: { search?: string; category?: string; locale?: string } = {},
): Promise<PaginatedProducts> {
  const params = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
  try {
    return await request<PaginatedProducts>(`/products?${params}`);
  } catch {
    const data = fallbackProducts.filter(
      (p) =>
        (!filters.category || p.category.slug === filters.category) &&
        (!filters.search ||
          `${p.name} ${p.sku} ${p.summary}`.toLowerCase().includes(filters.search.toLowerCase())),
    );
    return { data, meta: { current_page: 1, last_page: 1, total: data.length } };
  }
}
export async function getProduct(slug: string, locale = "en"): Promise<Product | null> {
  try {
    const result = await request<{ data: Product }>(`/products/${slug}?locale=${locale}`);
    return result.data;
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getAllProducts("en");

  return [...new Set(products.map((product) => product.slug))];
}

export async function getAllProducts(locale: "en" | "ar"): Promise<Product[]> {
  try {
    const firstPage = await request<PaginatedProducts>(
      `/products?locale=${locale}&per_page=48&page=1`,
    );
    const products = [...firstPage.data];

    for (let page = 2; page <= firstPage.meta.last_page; page += 1) {
      const result = await request<PaginatedProducts>(
        `/products?locale=${locale}&per_page=48&page=${page}`,
      );
      products.push(...result.data);
    }

    return products;
  } catch {
    return fallbackProducts;
  }
}

export async function fetchLiveProducts(locale: "en" | "ar"): Promise<Product[]> {
  const firstPage = await request<PaginatedProducts>(
    `/products?locale=${locale}&per_page=48&page=1`,
    { cache: "no-store" },
  );
  const products = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.last_page; page += 1) {
    const result = await request<PaginatedProducts>(
      `/products?locale=${locale}&per_page=48&page=${page}`,
      { cache: "no-store" },
    );
    products.push(...result.data);
  }

  return products;
}

export async function fetchLiveCategories(locale: "en" | "ar"): Promise<Category[]> {
  const result = await request<{ data?: { categories?: unknown } }>(
    `/catalog/filters?locale=${locale}`,
    { cache: "no-store" },
  );

  return Array.isArray(result.data?.categories) ? (result.data.categories as Category[]) : [];
}

export async function getCategories(locale = "en"): Promise<Category[]> {
  try {
    const result = await request<{ data?: { categories?: unknown } }>(
      `/catalog/filters?locale=${locale}`,
    );
    return Array.isArray(result.data?.categories)
      ? (result.data.categories as Category[])
      : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}
export async function sendInquiry(payload: InquiryPayload): Promise<string> {
  try {
    const result = await request<{ message: string }>(
      "/inquiries",
      { method: "POST", body: JSON.stringify(payload) },
      0,
    );
    return result.message;
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.errors.product_id) {
      const generalInquiry = { ...payload };
      delete generalInquiry.product_id;
      const result = await request<{ message: string }>(
        "/inquiries",
        { method: "POST", body: JSON.stringify(generalInquiry) },
        0,
      );
      return result.message;
    }

    throw error;
  }
}

const fallbackSettings: Record<"en" | "ar", SiteSettings> = {
  en: {
    site_name: "Axis Industrial",
    logo_url: null,
    favicon_url: null,
    email: "sales@axisindustrial.com",
    phone: "+20 100 000 0000",
    whatsapp: "+20 100 000 0000",
    address: "Cairo, Egypt",
    footer_description: "Professional CNC tooling and lathe supplies for modern workshops.",
    seo: {
      title: "Axis Industrial | CNC & Lathe Supplies",
      description:
        "Professional CNC tooling, lathe supplies, workholding, cutting tools, and metrology equipment.",
    },
    social: { facebook: null, instagram: null, linkedin: null, youtube: null },
    maintenance_mode: false,
  },
  ar: {
    site_name: "أكسس إندستريال",
    logo_url: null,
    favicon_url: null,
    email: "sales@axisindustrial.com",
    phone: "+20 100 000 0000",
    whatsapp: "+20 100 000 0000",
    address: "القاهرة، مصر",
    footer_description: "أدوات CNC ومستلزمات مخارط احترافية للورش الحديثة.",
    seo: {
      title: "أكسس إندستريال | مستلزمات CNC والمخارط",
      description: "أدوات CNC ومستلزمات مخارط وأدوات تثبيت وقطع وقياس احترافية.",
    },
    social: { facebook: null, instagram: null, linkedin: null, youtube: null },
    maintenance_mode: false,
  },
};

export const getSiteSettings = cache(async (locale: "en" | "ar"): Promise<SiteSettings> => {
  try {
    const result = await request<{ data: SiteSettings }>(`/settings?locale=${locale}`);
    return result.data;
  } catch {
    return fallbackSettings[locale];
  }
});

export async function fetchLiveSiteSettings(locale: "en" | "ar"): Promise<SiteSettings> {
  const result = await request<{ data: SiteSettings }>(`/settings?locale=${locale}`, {
    cache: "no-store",
  });

  return result.data;
}

export async function fetchLiveProduct(slug: string, locale: "en" | "ar"): Promise<Product> {
  const result = await request<{ data: Product }>(`/products/${slug}?locale=${locale}`, {
    cache: "no-store",
  });

  return result.data;
}
