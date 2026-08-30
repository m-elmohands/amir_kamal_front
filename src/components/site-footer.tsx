import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { getCurrentLocale, getMessages, localizedPath } from "@/i18n/messages";
import type { SiteSettings } from "@/types/settings";

const socialNetworks = ["facebook", "instagram", "linkedin", "youtube"] as const;

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
} satisfies Record<(typeof socialNetworks)[number], typeof FaFacebookF>;

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const locale = await getCurrentLocale();
  const t = getMessages(locale);
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link className="logo light footer-logo" href={localizedPath(locale, "/")}>
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt={settings.site_name}
                width={220}
                height={64}
                loading="lazy"
                decoding="async"
              />
            ) : (
              settings.site_name
            )}
          </Link>
          <p>{settings.footer_description ?? t.footer.tagline}</p>
        </div>
        <div>
          <h3>{t.footer.explore}</h3>
          <Link href={localizedPath(locale, "/products")}>{t.common.allProducts}</Link>
          <Link href={localizedPath(locale, "/about")}>{t.footer.company}</Link>
          <Link href={localizedPath(locale, "/contact")}>{t.common.requestQuote}</Link>
        </div>
        <div>
          <h3>{t.common.contact}</h3>
          {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
          {settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : null}
          {settings.address ? <span>{settings.address}</span> : null}
          <div className="social-links">
            {settings.whatsapp ? (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">WhatsApp</span>
                <FaWhatsapp size={18} aria-hidden="true" />
              </a>
            ) : null}
            {socialNetworks.map((name) => {
              const url = settings.social[name];
              const SocialIcon = socialIcons[name];

              return url ? (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  <span className="sr-only">{name}</span>
                  <SocialIcon size={18} aria-hidden="true" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="container copyright">
        © {new Date().getFullYear()} {settings.site_name}
      </div>
    </footer>
  );
}
