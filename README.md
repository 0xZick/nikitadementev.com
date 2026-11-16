# Nikita Dementev — personal site

Personal record in the Mad Assembly visual language (JetBrains Mono, underscore nav, orange/purple). Content is merged from the four EN résumés in `~/Desktop/resume-v2` (Engineering Lead, Solidity, Full-Stack, Frontend, Sep 2026). Nothing goes on the site that is not in a résumé; `src/data/person.ts` is the single source, pages only render it.

## Run

```bash
cd /Users/0xzick/Desktop/work/ai-created/site
npm install
npm run dev
```

http://localhost:4321

Canonical: `https://nikitadementev.com` (set in `astro.config.mjs`, `src/data/person.ts`, `public/robots.txt`, `public/CNAME`, `og-source.html`).

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`: every push to `main` builds with `withastro/action` and deploys. Repo settings → Pages → Source: **GitHub Actions**; Custom domain: `nikitadementev.com`, Enforce HTTPS.

DNS at the registrar:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<github-user>.github.io` |

## Pages

| Path | Job |
|---|---|
| `/` | Record: lede, profile, now, career, numbers |
| `/work` | Full record: biography, products, stack, GitHub |
| `/llms.txt` | Machine digest for language models |
| `/og.png` | Share image. Source: `og-source.html`, rendered 1200×630 with headless Chrome |
| `/Nikita-Dementev-CV.pdf` | Copy of the Engineering Lead EN résumé; replace when the PDF changes |

Sitemap at `/sitemap-index.xml` (via `@astrojs/sitemap`), `robots.txt` in `public/`. Dark theme follows `prefers-color-scheme`.

Regenerate the share image after editing `og-source.html`:

```bash
python3 -m http.server 4890 --bind 127.0.0.1 &   # lottie loads public/ducks/*.json, file:// is blocked
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=6000 --screenshot=public/og.png "http://127.0.0.1:4890/og-source.html"
kill %1
```

Then bump `?v=` on `ogImage` in `src/layouts/Base.astro` and refresh Telegram's cache via @WebpageBot.

Retired /writing texts live in `archive/` (not built). `/bio` and `/writing` redirect.

Tornado Cash is stated as Mar 2020 – Feb 2022, left ~6 months before OFAC. Do not compress that.
