# Личный сайт (nikitadementev.com)

## Что это
Статический сайт на Astro 5. Стили в `src/styles/global.css`, тема следует prefers-color-scheme.
Весь контент страниц — в `src/data/person.ts`, страницы его только рендерят. Туда идёт только то, что есть в резюме (сайт собран из 4 EN-резюме: Engineering Lead, Solidity, Full-Stack, Frontend).
Страницы: `/`, `/work` (бывшие bio+work, `/bio` редиректит на неё), `/articles` (content collection `src/content/articles/*.md`, 18.11.26), плюс `/llms.txt`, 404; sitemap через @astrojs/sitemap.
`/writing` и `/rss.xml` убраны (16.11.26); тексты лежат в `archive/writing*` и не собираются; `/writing` редиректит на `/`, `/rss.xml` и `/writing/<slug>` дают 404.
CV: `public/Nikita-Dementev-CV.pdf` — копия Engineering Lead EN, заменять при смене PDF.
Liquorice указан как Software Engineer & Technical Advisor (решение 16.11.26). Даты и роли берутся из резюме, без него не менять.

## Как запустить
`npm install`; `npm run dev` (http://localhost:4321); `npm run build`; `npm run preview`.

## Как проверить
Тестов нет. Быстро: `.claude/check.sh` (около 3 с) — `tsc --noEmit` и `astro build`. Его же гоняет Stop-хук, если менялись исходники.
Нетривиальный дифф перед коммитом: `/code-review`, затем прочитать глазами.

## Деплой
Push в main запускает `.github/workflows/deploy.yml` (withastro/action, Node 22) и GitHub Pages. Push только по просьбе.
Домен задаёт `CNAME` (в корне и в `public/`). Канонический URL https://nikitadementev.com: astro.config.mjs, person.ts, public/robots.txt, og-source.html.
og.png рендерится из og-source.html через headless Chrome 1200x630 (команда в README).

## Чего не трогать
`dist/` и `.astro/` генерируются. `CNAME`.
