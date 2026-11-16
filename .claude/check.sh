#!/bin/bash
# Быстрая проверка: типы и сборка (ловит битый frontmatter по схеме коллекции).
set -e
# Ничего не менялось с последней зелёной проверки (HEAD, дифф, содержимое неотслеживаемых
# файлов вне .claude/) — пропускаем. Штамп пишется только после успеха. Не git — проверяем всегда.
root="$(cd "$(dirname "$0")/.." && pwd)"
stamp="$root/.claude/.check-stamp"
key=""
if git -C "$root" rev-parse -q --verify HEAD >/dev/null 2>&1; then
  key=$( { git -C "$root" rev-parse HEAD
           git -C "$root" diff HEAD -- . ':!.claude'
           git -C "$root" ls-files -o --exclude-standard -z -- . ':!.claude' | (cd "$root" && xargs -0 shasum 2>/dev/null)
         } | shasum | cut -c1-40 )
  [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$key" ] && exit 0
fi
cd "$(dirname "$0")/.."
npx --no-install tsc --noEmit
npx --no-install astro build >/dev/null

[ -n "$key" ] && echo "$key" > "$stamp"
exit 0
