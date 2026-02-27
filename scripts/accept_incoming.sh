#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "Erro: execute este script dentro de um repositório Git." >&2
  exit 1
fi

remote=${1:-origin}
branch=${2:-work}

echo "Atualizando referências remotas..."
git fetch --all --prune

echo "Mesclando ${remote}/${branch} na branch atual..."
git merge "${remote}/${branch}"

if git diff --name-only --diff-filter=U | grep -q "."; then
  echo "Conflitos detectados. Aceitando incoming change para todos os arquivos..."
  git diff --name-only --diff-filter=U | xargs -I{} git checkout --theirs "{}"
  git add .
  echo "Conflitos resolvidos. Revise o diff e rode os checks antes de commitar."
else
  echo "Nenhum conflito encontrado. Merge concluído sem intervenções."
fi
