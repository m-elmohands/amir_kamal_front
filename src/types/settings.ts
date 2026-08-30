export interface SiteSettings {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  footer_description: string | null;
  seo: {
    title: string | null;
    description: string | null;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  maintenance_mode: boolean;
}
