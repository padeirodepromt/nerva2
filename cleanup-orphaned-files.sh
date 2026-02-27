#!/bin/bash

###############################################################################
# SCRIPT DE LIMPEZA SEGURA - Arquivos Órfãos do Prana 3.0
# 
# Propósito: Remover arquivos descontinuados/órfãos de forma segura
# Segurança: Backup automático, validação pré/pós, rollback possível
#
# Uso: bash cleanup-orphaned-files.sh
###############################################################################

set -e  # Exit on error

# CORES PARA OUTPUT
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# CONFIGURAÇÃO
PROJECT_ROOT="/workspaces/prana3.0"
BACKUP_DIR="${PROJECT_ROOT}/.backups/orphaned-files-$(date +%s)"
ORPHANED_FILES=(
  "old_LandingPage.jsx"
  "src/components/ui/sidebar.v2_backup.jsx"
  "src/site/LandingPage_old.jsxdesabilitado"
  "src/pages/AntigaPagina.jsx"
)
BACKUP_ONLY=false

# FUNÇÕES
print_header() {
  echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ 🧹 LIMPEZA DE ARQUIVOS ÓRFÃOS - Prana 3.0               ║${NC}"
  echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
  print_info "Validando pré-requisitos..."
  
  if [ ! -d "$PROJECT_ROOT" ]; then
    print_error "Diretório do projeto não encontrado: $PROJECT_ROOT"
    exit 1
  fi
  
  if [ ! -d "$PROJECT_ROOT/.git" ]; then
    print_error "Este não é um repositório git válido: $PROJECT_ROOT"
    exit 1
  fi
  
  print_success "Pré-requisitos validados"
}

verify_orphaned_files() {
  print_info "Verificando arquivos órfãos..."
  echo ""
  
  local count=0
  local total_size=0
  
  for file in "${ORPHANED_FILES[@]}"; do
    local full_path="$PROJECT_ROOT/$file"
    
    if [ -f "$full_path" ]; then
      local size=$(du -h "$full_path" | cut -f1)
      local lines=$(wc -l < "$full_path")
      
      echo -e "  ${GREEN}✓${NC} $file"
      echo -e "    └─ Tamanho: $size | Linhas: $lines"
      
      count=$((count + 1))
    else
      echo -e "  ${YELLOW}─${NC} $file (não encontrado)"
    fi
  done
  
  echo ""
  if [ $count -eq 0 ]; then
    print_warning "Nenhum arquivo órfão encontrado para remover"
    exit 0
  fi
  
  print_info "Total de arquivos a processar: $count"
}

check_references() {
  print_info "Verificando referências residuais..."
  echo ""
  
  local found_refs=false
  
  for file in "${ORPHANED_FILES[@]}"; do
    local filename=$(basename "$file" .jsx)
    local refs=$(cd "$PROJECT_ROOT" && grep -r "$filename" src/ --include="*.jsx" --include="*.js" 2>/dev/null | wc -l)
    
    if [ $refs -eq 0 ]; then
      echo -e "  ${GREEN}✓${NC} $filename: zero referências"
    else
      echo -e "  ${YELLOW}⚠${NC} $filename: $refs referência(s) encontrada(s)"
      echo -e "    $(cd "$PROJECT_ROOT" && grep -r "$filename" src/ --include="*.jsx" --include="*.js" 2>/dev/null | head -1)"
      found_refs=true
    fi
  done
  
  echo ""
  if [ "$found_refs" = true ]; then
    print_warning "Algumas referências foram encontradas. Verifique antes de deletar."
  else
    print_success "Nenhuma referência residual encontrada"
  fi
}

create_backup() {
  print_info "Criando backup dos arquivos..."
  
  mkdir -p "$BACKUP_DIR"
  
  for file in "${ORPHANED_FILES[@]}"; do
    local full_path="$PROJECT_ROOT/$file"
    
    if [ -f "$full_path" ]; then
      local backup_file="$BACKUP_DIR/$file"
      mkdir -p "$(dirname "$backup_file")"
      cp "$full_path" "$backup_file"
      print_success "Backup criado: $backup_file"
    fi
  done
  
  echo ""
  print_info "Todos os backups armazenados em: $BACKUP_DIR"
}

delete_orphaned_files() {
  print_info "Deletando arquivos órfãos..."
  echo ""
  
  for file in "${ORPHANED_FILES[@]}"; do
    local full_path="$PROJECT_ROOT/$file"
    
    if [ -f "$full_path" ]; then
      rm -f "$full_path"
      print_success "Deletado: $file"
    fi
  done
  
  echo ""
  print_success "Todos os arquivos órfãos foram removidos"
}

verify_deletion() {
  print_info "Verificando integridade pós-limpeza..."
  echo ""
  
  local remaining=0
  
  for file in "${ORPHANED_FILES[@]}"; do
    local full_path="$PROJECT_ROOT/$file"
    
    if [ -f "$full_path" ]; then
      print_error "Arquivo ainda existe: $file"
      remaining=$((remaining + 1))
    else
      print_success "Arquivo removido: $file"
    fi
  done
  
  echo ""
  
  if [ $remaining -eq 0 ]; then
    print_success "Limpeza concluída com sucesso!"
    return 0
  else
    print_error "Limpeza incompleta ($remaining arquivos ainda existem)"
    return 1
  fi
}

print_git_status() {
  print_info "Status do Git:"
  echo ""
  
  cd "$PROJECT_ROOT"
  
  git status --short src/ | grep -E "^ D " || true
  
  if git status --short src/ | grep -E "^ D " > /dev/null; then
    echo ""
    print_info "Para confirmar as mudanças, execute:"
    echo -e "  ${BLUE}cd $PROJECT_ROOT${NC}"
    echo -e "  ${BLUE}git add .${NC}"
    echo -e "  ${BLUE}git commit -m 'chore: remove orphaned files (ANALISE_ARQUIVOS_ORFAOS.md)'${NC}"
  fi
}

rollback() {
  print_warning "Iniciando rollback..."
  
  if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Nenhum backup encontrado para rollback"
    exit 1
  fi
  
  for file in "${ORPHANED_FILES[@]}"; do
    local backup_file="$BACKUP_DIR/$file"
    local full_path="$PROJECT_ROOT/$file"
    
    if [ -f "$backup_file" ]; then
      mkdir -p "$(dirname "$full_path")"
      cp "$backup_file" "$full_path"
      print_success "Restaurado: $file"
    fi
  done
  
  print_success "Rollback concluído"
}

# MENU PRINCIPAL
show_menu() {
  echo -e "${YELLOW}Escolha uma opção:${NC}"
  echo "  1) Verificar (nenhuma ação)"
  echo "  2) Backup apenas (sem deletar)"
  echo "  3) Executar limpeza completa (backup + deletar)"
  echo "  4) Rollback (restaurar backup)"
  echo "  5) Sair"
  echo ""
  read -p "Opção (1-5): " choice
}

main() {
  print_header
  check_prerequisites
  verify_orphaned_files
  check_references
  
  echo ""
  show_menu
  
  case $choice in
    1)
      print_info "Modo verificação - nenhuma ação será executada"
      ;;
    2)
      print_warning "Modo backup apenas"
      create_backup
      ;;
    3)
      print_warning "ATENÇÃO: Você está prestes a deletar 4 arquivos órfãos"
      read -p "Deseja continuar? (s/n): " confirm
      
      if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        create_backup
        delete_orphaned_files
        verify_deletion
        print_git_status
      else
        print_info "Operação cancelada"
      fi
      ;;
    4)
      read -p "Tem certeza de que deseja fazer rollback? (s/n): " confirm
      
      if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        rollback
      else
        print_info "Rollback cancelado"
      fi
      ;;
    5)
      print_info "Saindo..."
      exit 0
      ;;
    *)
      print_error "Opção inválida"
      exit 1
      ;;
  esac
  
  echo ""
  print_info "Operação concluída"
}

# EXECUTAR
main
