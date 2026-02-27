# Teste Rápido: Renomear Projeto com Alteração de Hierarquia

## ✅ Pré-requisitos
- [ ] Dashboard carregando com projetos
- [ ] Pelo menos 2 projetos na tela
- [ ] Botão de editar visível em cada projeto

## 🧪 Cenários de Teste

### Cenário 1: Renomear Simples
1. Clique em editar em qualquer projeto
2. Modal abre com nome atual
3. Altere o nome (ex: "A" → "A Novo")
4. Clique "Salvar Mudanças"
5. ✅ Esperado: Modal fecha, projeto mostra novo nome, toast verde

### Cenário 2: Alterar Hierarquia (Mover para Novo Pai)
1. Crie 3 projetos: "Livro" (raiz), "Cap 1" (pai=Livro), "Seção 1" (pai=Cap1)
2. Clique editar em "Seção 1"
3. Mude o pai de "Cap 1" para "Livro" (mover um nível acima)
4. Clique "Salvar Mudanças"
5. ✅ Esperado: Seção 1 agora é filho direto de Livro

### Cenário 3: Tentar Criar Ciclo (deve ser bloqueado)
1. Você tem: Livro → Cap 1 → Seção 1
2. Clique editar em "Livro"
3. Tente selecionar "Seção 1" como pai
4. ❌ Esperado: 
   - "Seção 1" não aparece no dropdown (filtrado automaticamente)
   - Ou mostra erro "não pode selecionar descendente"

### Cenário 4: Limite de Profundidade
1. Crie hierarquia profunda: A→B→C→D→E→F→G (7 níveis)
2. Tente criar mais um nível (H → pai = G)
3. ❌ Esperado: 
   - Erro: "Limite de profundidade alcançado (máximo 7 níveis)"
   - Botão "Salvar" desabilitado

### Cenário 5: Aviso Próximo ao Limite
1. Crie hierarquia com 6 níveis: A→B→C→D→E→F
2. Clique editar em F
3. ✅ Esperado: 
   - Mostra "Profundidade atual: 5 de 7 níveis"
   - Se tiver 6 níveis, aviso amarelo: "Você está próximo ao limite"

### Cenário 6: Erro do Backend
1. Simule erro (abra DevTools, Network)
2. Clique editar, mude nome
3. Desconecte internet (ou simule erro)
4. Clique "Salvar Mudanças"
5. ✅ Esperado: Toast vermelho com mensagem de erro

---

## 🔍 O Que Procurar

### UI
- [ ] Modal tem fundo escuro (gradiente Prana)
- [ ] Animação suave ao abrir/fechar
- [ ] Input para nome está focado
- [ ] Dropdown mostra projetos elegíveis
- [ ] Profundidade indicada embaixo do dropdown
- [ ] Botão "Salvar" mostra loading "⏳ Salvando..."

### Validações
- [ ] Nome vazio desabilita botão salvar
- [ ] Ciclos são filtrados do dropdown
- [ ] Profundidade excedida mostra erro em vermelho
- [ ] Profundidade próxima ao limite mostra aviso em amarelo

### Dados
- [ ] Após salvar, novo nome aparece no projeto
- [ ] Nova hierarquia reflete no explorer/breadcrumb
- [ ] Toast verde confirma sucesso
- [ ] Dados recarregam da API

---

## 📋 Checklist de Aceitação

### Core Functionality
- [ ] Modal abre ao clicar editar
- [ ] Modal fecha ao clicar "Cancelar"
- [ ] Modal fecha após salvar com sucesso
- [ ] Nome pode ser alterado
- [ ] Pai pode ser alterado
- [ ] Ambos (nome + pai) podem ser alterados juntos

### Validações
- [ ] Ciclos são prevenidos
- [ ] Limite de profundidade é respeitado
- [ ] Mensagens de erro são claras
- [ ] Avisos de profundidade aparecem

### UX
- [ ] Modal é responsivo (mobile, tablet, desktop)
- [ ] Animações são suaves
- [ ] Loading state é claro
- [ ] Toast messages aparecem
- [ ] Não há lag ao atualizar

### Backend
- [ ] Validações de ciclo funcionam
- [ ] Validações de profundidade funcionam
- [ ] Erros retornam status 400
- [ ] Dados são salvos no DB

---

## 🐛 Bugs Conhecidos / Limitações

Nenhum no momento. Sistema testado com:
- Ciclos simples (A→B→A)
- Ciclos complexos (A→B→C→A)
- Profundidade máxima (7 níveis)
- Mudanças simultâneas (nome + pai)
- Erro de conexão

---

## 📞 Suporte

Se encontrar bug:
1. Abra DevTools (F12)
2. Console: Procure por erros vermelhos
3. Network: Veja resposta da API ao salvar
4. Descreva: O que fez, o que esperava, o que aconteceu

**Exemplo de bug report:**
```
Cenário: Renomear projeto
Passos:
  1. Cliquei editar em "Projeto A"
  2. Mudei nome para "Projeto B"
  3. Cliquei Salvar

Esperado: Modal fecha, nome atualiza
Atual: Modal fica aberto, nome não muda, sem erro

Console: [log do erro]
Network: [status da resposta]
```
