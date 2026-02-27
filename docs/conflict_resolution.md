# Fluxo de Resolução de Conflitos (Aceitar "Incoming Change")

Quando o GitHub indica que os conflitos são "complexos demais" para o editor web, resolva-os localmente e aceite a versão gerada pelo Ash (incoming change) em todos os arquivos. O procedimento abaixo garante que a sua branch fique alinhada com as atualizações automatizadas.

## 1. Atualize os ponteiros remotos

```bash
git fetch origin
```

Opcionalmente, substitua `origin` pelo nome do remoto que você utiliza.

## 2. Faça o merge da branch de trabalho

```bash
git merge origin/work
```

Troque `work` pela branch que contém as últimas entregas do Ash.

## 3. Aceite todos os "incoming changes"

```bash
git diff --name-only --diff-filter=U | xargs -I{} git checkout --theirs "{}"
```

Este comando varre todos os arquivos em conflito e substitui o conteúdo pela versão remota (incoming).

## 4. Faça a verificação local

```bash
git add .
npm run check
```

Ao final, basta revisar o diff, confirmar que os testes passaram e realizar o commit:

```bash
git commit -m "Resolve merge conflicts by accepting incoming change"
```

> **Dica:** o script `scripts/accept_incoming.sh` automatiza os passos acima (merge + aceitação do incoming change). Use `./scripts/accept_incoming.sh` para executar o fluxo padrão ou informe outro remoto/branch: `./scripts/accept_incoming.sh upstream main`.
