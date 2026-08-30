# Axis Industrial frontend

Statically exported Next.js frontend for the bilingual CNC and lathe supplies website.

## Requirements

- Node.js and npm
- The Laravel API URL configured through `NEXT_PUBLIC_API_URL`
- Laravel must allow the deployed frontend origin through CORS for inquiry submissions

## Environment

Create `.env.local` for local builds:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Configure `.env.production.local` before a production build:

```env
NEXT_PUBLIC_API_URL=https://amir-kamal-admin.marketopiacloud.com/api/v1
```

This value is embedded into the browser bundle. Never build a deployable `out/` directory with a localhost API URL.

## Development

```bash
npm install
npm run dev
```

## Static production build

Run:

```bash
npm run build
```

Next.js writes the deployable site to `out/`. Upload the contents of that directory to the web root on the static server.

The export contains physical English and Arabic routes under `/en/` and `/ar/`. The root page provides a language choice. Settings, header/footer identity, homepage catalog content, product lists, contact details, and existing product details refresh from Laravel in the browser. Product filtering and contact-form query prefilling also run in the browser, while inquiry submissions are sent directly to Laravel.

## Content updates

The export includes fallback HTML so pages remain usable if Laravel is temporarily unavailable. Existing exported pages refresh their data from the API on every browser load.

New product slugs still require a rebuild because a static server cannot create a new product-detail directory at runtime. Rebuild and upload `out/` after creating a product with a new slug or changing SEO metadata.
