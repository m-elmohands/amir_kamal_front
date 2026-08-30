export interface Category {
  name: string;
  slug: string;
  description: string;
  image_url?: string | null;
}
export interface Brand {
  name: string;
  slug: string;
  logo_url?: string | null;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  summary: string;
  description: string;
  specifications: Record<string, string>;
  image_url?: string | null;
  is_featured: boolean;
  category: Pick<Category, "name" | "slug">;
  brand?: Pick<Brand, "name" | "slug"> | null;
}
export interface PaginatedProducts {
  data: Product[];
  meta: { current_page: number; last_page: number; total: number };
}
export interface InquiryPayload {
  product_id?: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
