## Como Testar PHASE 1 - Diários

### Quick Start - Testar Localmente

1. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

2. **Acessar a aplicação:**
   - Abrir http://localhost:5173
   - Login com suas credenciais

3. **Acessar Diários:**
   - **Opção 1:** Via VIEW_TYPES (Adicionará um botão quando ProjectHub for integrado)
   - **Opção 2:** Chamar via código:
     ```javascript
     // Em qualquer view do PranaWorkspaceLayout
     openTab({ type: VIEW_TYPES.DIARIES_VIEW, title: 'Diários' }, 'main')
     ```

### Testar Funcionalidades

#### 1. Criar Diário
1. Clique no botão "Nova Entrada"
2. Preencha:
   - Título: "Meu Primeiro Diário"
   - Conteúdo: Use o editor TipTap (teste bold, italic, h2, listas)
   - Energia: Selecione um nível (1-5)
   - Humor: Selecione uma opção
   - Tags: Adicione "teste", "primeira"
3. Clique "Salvar Entrada"
4. Verifique se aparecer no grid

#### 2. Buscar e Filtrar
- **Busca:** Digite na caixa de busca
- **Energia:** Clique em um nível (1-5)
- **Humor:** Selecione um humor
- **Tags:** Clique em uma tag para filtrar
- **Ordenação:** Teste "Recentes", "Energia ↓", "Energia ↑"

#### 3. Editar Diário
1. Clique em um card
2. Clique "Editar"
3. Modifique título/conteúdo
4. Clique "Salvar Entrada"
5. Verifique atualização

#### 4. Deletar Diário
1. Clique em um card
2. Clique "Deletar" (ação rápida)
3. Verifique se desaparece do grid

#### 5. Testar API Diretamente
```bash
# 1. Criar diário
curl -X POST http://localhost:3000/api/diaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "user_123",
    "title": "Teste API",
    "content": "<p>Conteúdo do teste</p>",
    "energyLevel": 4,
    "mood": "Alegria",
    "tags": ["api", "teste"]
  }'

# 2. Listar diários
curl -X GET "http://localhost:3000/api/diaries?userId=user_123" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Obter diário específico
curl -X GET http://localhost:3000/api/diaries/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Atualizar
curl -X PUT http://localhost:3000/api/diaries/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Título atualizado"}'

# 5. Deletar
curl -X DELETE http://localhost:3000/api/diaries/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verificar Integração com Ash

1. Crie um novo diário
2. Verifique no chat do Ash se aparece mensagem:
   - "Nova entrada de diário: 'Título' com energia 4/5"
3. O contexto deve ser enviado com tipo `diary_entry`

### Verificar Database

1. Acesse o banco de dados (usando sua ferramenta preferida)
2. Verifique se a tabela `diaries` foi criada
3. Verifique registros inseridos
4. Schema esperado:
   ```sql
   CREATE TABLE diaries (
     id TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     energyLevel INTEGER DEFAULT 3,
     mood TEXT,
     tags JSON,
     insights TEXT,
     date TIMESTAMP,
     createdAt TIMESTAMP,
     updatedAt TIMESTAMP
   );
   ```

### Checklist de Testes

- [ ] Criar diário com todos os campos
- [ ] Validação: Erro se título ou conteúdo vazios
- [ ] Busca funciona em tempo real
- [ ] Filtros de energia funcionam
- [ ] Filtros de humor funcionam
- [ ] Filtros de tags funcionam
- [ ] Ordenação funciona
- [ ] Editar diário atualiza com sucesso
- [ ] Deletar remove do grid
- [ ] API retorna dados corretos
- [ ] Ash recebe notificação ao criar
- [ ] Database armazena dados corretamente
- [ ] Build continua passando (npm run build)

### Possíveis Issues e Soluções

#### "Erro ao carregar diários"
- Verificar se auth middleware está funcionando
- Verificar token de autenticação
- Verificar logs do servidor

#### "Editor TipTap não aparece"
- Limpar cache do navegador
- Verificar se TipTap foi instalado: `npm list @tiptap/react`

#### "Ícones não aparecem"
- Verifique imports de IconDiario, IconPlus
- Verifique se PranaLandscapeIcons.jsx exporta esses ícones

#### Tags não salvam
- Verifique se o array JSON está sendo convertido corretamente
- Verifique schema do Drizzle

### Próximos Passos

Após validar tudo acima:

1. Adicionar Diários ao ProjectHub (como uma pasta especial)
2. Integrar com Human Design (PHASE 2)
3. Criar widgets de dashboard (PHASE 4)
4. Adicionar integração com Ash (PHASE 3)

---

**Status:** Pronto para teste manual ✅
**Build Status:** Passing ✅
**Last Build:** 10.52s, 0 errors
