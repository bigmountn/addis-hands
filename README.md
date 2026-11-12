# Addis Hands B2B Marketplace

TradeKorea-style B2B showcase connecting Ethiopian SMEs with global buyers.

- English default, plus Korean / Japanese / Chinese
- SME profiles, products, About story, buyer inquiry form
- Inquiries go to `info@bigmountn.com` (via Resend when configured)
- File-based admin at `/admin` (companies, products, news, image upload)

## Setup

```bash
npm install
cp .env.example .env.local
# set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin (file-based)

Catalog data lives in:

- `data/companies.json`
- `data/products.json`
- `data/news.json`
- uploaded images under `public/media/...`

Sign in with `ADMIN_PASSWORD`. The session cookie is signed with `ADMIN_SESSION_SECRET`.

Admin UI is Korean-primary with English field labels. English content is required; KO/JA/ZH are optional (empty locales fall back to English on save).

## Photos

Prefer uploading through `/admin` (cover + gallery). Files land in:

```text
public/media/companies/[company-slug]/cover.jpg
public/media/companies/[company-slug]/gallery-1.jpg

public/media/products/[product-slug]/cover.jpg
public/media/products/[product-slug]/gallery-1.jpg

public/media/news/[news-slug]/cover.jpg
```

You can also place files manually and set the same paths in the JSON via admin forms.

## Inquiry email

In `.env.local`:

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=Addis Hands <noreply@yourdomain.com>
```

Without `RESEND_API_KEY`, inquiries are saved to `data/inquiries.json` for local demo.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
