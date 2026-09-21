# Nikita Dementev — personal site

Personal record in the Mad Assembly visual language (JetBrains Mono, underscore nav, orange/purple). Content is merged from the four EN résumés in `~/Desktop/resume-v2` (Engineering Lead, Solidity, Full-Stack, Frontend, Sep 2026). Nothing goes on the site that is not in a résumé; `src/data/person.ts` is the single source, pages only render it.

## Run

```bash
cd /Users/0xzick/Desktop/work/ai-created/site
npm install
npm run dev
```

http://localhost:4321

Canonical in config is `https://0xzick.dev` — change `astro.config.mjs` and `src/data/person.ts` when the real domain is known.

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

`draft: true` keeps it off `/writing` and `/llms.txt`. Do not publish keys, contract addresses, or exact filter thresholds.

## Pages

| Path | Job |
|---|---|
| `/` | Record: lede, profile, now, career, numbers |
| `/bio` | Full sourced biography (prose only; tables live on /work) |
| `/work` | Products, stack, GitHub |
| `/llms.txt` | Machine digest for language models |

`/writing` is parked until notes are reviewed. Markdown can sit in `src/content/writing/` with `draft: true`.

Tornado Cash is stated as Mar 2020 – Feb 2022, left ~6 months before OFAC. Do not compress that.
