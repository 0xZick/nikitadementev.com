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

## Publish a note

Add `src/content/writing/your-slug.md`:

```md
---
title: Title
date: 2026-09-21
summary: One sentence for the index.
lang: en
draft: false
---
```

`draft: true` keeps it off `/writing` and `/rss.xml`. Notes are published in English; Russian originals sit in `src/content/writing-ru/` (not a collection, not built). Do not publish keys, contract addresses, or exact filter thresholds.

## Pages

| Path | Job |
|---|---|
| `/` | Record: lede, profile, now, career, numbers |
| `/bio` | Full sourced biography (prose only; tables live on /work) |
| `/work` | Products, stack, GitHub |
| `/writing` | Notes from `src/content/writing/`; `/rss.xml` feed |
| `/llms.txt` | Machine digest for language models |
| `/og.png` | Share image. Source: `og-source.html`, rendered 1200×630 with headless Chrome |
| `/Nikita-Dementev-CV.pdf` | Copy of the Engineering Lead EN résumé; replace when the PDF changes |

Sitemap at `/sitemap-index.xml` (via `@astrojs/sitemap`), `robots.txt` in `public/`. Dark theme follows `prefers-color-scheme`.

Regenerate the share image after editing `og-source.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=4000 --screenshot=public/og.png "file://$PWD/og-source.html"
```

Tornado Cash is stated as Mar 2020 – Feb 2022, left ~6 months before OFAC. Do not compress that.
