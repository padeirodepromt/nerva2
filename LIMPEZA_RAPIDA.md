# 🧹 Guia Rápido: Limpeza de Arquivos Órfãos

**Tempo estimado:** 5 minutos  
**Risco:** Muito Baixo (4 arquivos desconectados)  
**Espaço liberado:** ~131 KB

---

## 📋 Arquivos para Remover

| Arquivo | Tamanho | Linhas | Status |
|---------|---------|--------|--------|
| `old_LandingPage.jsx` | 29 KB | 597 | Zero referências |
| `src/components/ui/sidebar.v2_backup.jsx` | 21 KB | 619 | Zero referências |
| `src/site/LandingPage_old.jsxdesabilitado` | 37 KB | 624 | Zero referências |
| `src/pages/AntigaPagina.jsx` | 45 KB | 1041 | Apenas comentário |

---

## ✂️ Opção 1: Limpeza Automática (Recomendado)

```bash
# 1. Tornar script executável
chmod +x cleanup-orphaned-files.sh

# 2. Executar limpeza interativa
bash cleanup-orphaned-files.sh

# 3. Escolher opção 3 (limpeza completa)
# O script criará backup automático
```

---

## 🗑️ Opção 2: Limpeza Manual

```bash
cd /workspaces/prana3.0

# 1. Criar backup (segurança)
mkdir -p .backups
cp old_LandingPage.jsx .backups/
cp src/components/ui/sidebar.v2_backup.jsx .backups/
cp "src/site/LandingPage_old.jsxdesabilitado" .backups/
cp src/pages/AntigaPagina.jsx .backups/

# 2. Deletar arquivos
rm -f old_LandingPage.jsx
rm -f src/components/ui/sidebar.v2_backup.jsx
rm -f "src/site/LandingPage_old.jsxdesabilitado"
rm -f src/pages/AntigaPagina.jsx

# 3. Verificar (deve retornar vazio)
grep -r "old_LandingPage\|sidebar.v2_backup\|LandingPage_old\|AntigaPagina" \
  src/ --include="*.jsx" --include="*.js"

# 4. Confirmar no Git
git status
git add .
git commit -m "chore: remove orphaned files"
```

---

## ✅ Verificação Pós-Limpeza

```bash
# Validar que não há referências residuais
grep -r "old_LandingPage\|sidebar.v2_backup\|LandingPage_old\|AntigaPagina" \
  /workspaces/prana3.0/src --include="*.jsx" --include="*.js" || echo "✅ Zero referências"

# Confirmar exclusão
ls -la old_LandingPage.jsx 2>/dev/null || echo "✅ Arquivo removido"
```

---

## ⚠️ Decisão Necessária

**`src/site/personas/LandingPageHolistic_Backup.jsx`** (92 KB)
- Este arquivo ESTÁ em uso (rota `/backup`)
- Decidir:
  - **A)** Manter como fallback de demonstração
  - **B)** Remover a rota e deletar arquivo

---

## 📖 Documentação Completa

Para análise completa, ver: [ANALISE_ARQUIVOS_ORFAOS.md](ANALISE_ARQUIVOS_ORFAOS.md)

---

## 🔄 Rollback (Se Necessário)

Se algo der errado, os backups estão em `.backups/`:
```bash
# Restaurar individual
cp .backups/old_LandingPage.jsx old_LandingPage.jsx

# Ou executar script de rollback
bash cleanup-orphaned-files.sh  # Escolher opção 4
```

---

**Status:** Pronto para limpeza  
**Data:** 2025
