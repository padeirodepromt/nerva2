# Plano Operacional Prana v5 (Visão do Agente)

Este documento traduz o "Plano de Ação: A Evolução do Prana (v5 - Final)" para um roteiro operacional detalhado. Ele está organizado em trilhas paralelas para facilitar priorização e acompanhamento contínuo.

## 1. Fundação de Dados e Serviços (Fases 1 e 2)

### 1.1 Estrutura do Banco de Dados
- **Tasks**: garantir colunas `title`, `category`, `templateData`, `checklist`, `process_data` e campos de auditoria coerentes.
- **Papyrus**: manter tabela `papyrus_notes` alinhada às rotas REST e ferramentas (`create_papyrus_note`, `write_to_papyrus`).
- **Campos Personalizados**:
  - Índice único `(taskId, fieldName)` aplicado.
  - Utilizar helper de inferência de tipo (`text`, `number`, `boolean`, `date`, `json`).
  - Funções que manipulam campos (`create_task`, `set_custom_field_value`) devem passar pelo helper para consistência.
- **Kanban & Sheet Settings**:
  - `project_view_settings` e `project_kanban_settings` com escopo por usuário (`projectId + userId`).
  - Estrutura das colunas deve carregar metadado `type: 'status' | 'custom'`.
- **Task Relations**: manter API e esquema preparados para dependências (`dependency`) e associações livres (`related`).

### 1.2 Serviços (toolService)
- **Criação Universal**: funções `create_task`, `create_papyrus_note`, `create_agreement` aceitam campos estruturados, incluindo `category`, `templateData` e `customFields`.
- **Memória e Papyrus**: `write_to_papyrus`, `memorize_knowledge`, `search_knowledge` íntegros e registrando erros significativos.
- **Vistas Dinâmicas**:
  - `get_project_view_sheet`: retornar tarefas + campos personalizados filtrados, respeitando preferências salvas.
  - `get_project_view_kanban`: aplicar metadados de colunas, agrupar tarefas por status ou custom field `kanban_column_id`.
  - `get_project_view_map`/`chain`: carregar `taskRelations` relevantes com filtros por projeto/usuário.
- **Conectores e Personalização**:
  - `connect_tasks`: validação para evitar loops, retorno da relação criada.
  - `add_custom_column_sheet/kanban`: preservar metadados, atualizar `updated_at` e `created_by`.
  - `move_task_to_kanban_column`: atualizar `tasks.status` ou `kanban_column_id`, retornando coluna/estado atualizados.
  - `transmute_mindmap_node_to_task`: criar tarefa a partir de nó, atualizar `mind_map_nodes` para `node_type: 'task'`.

### 1.3 Camada Express (server.js)
- Rotas REST espelhando ferramentas principais:
  - `/api/projects/:id/views/{sheet,kanban,map,chain}`.
  - `/api/projects/:id/sheet-columns` (GET/PUT/POST).
  - `/api/projects/:id/kanban-columns` e `/api/projects/:id/kanban/move`.
  - `/api/tasks/:id/custom-fields` (POST) e equivalentes para leitura futura.
  - `/api/mind-map/nodes/:nodeId/transmute` + `/api/tools/transmute-mindmap-node` para acesso do Ash.
- Middleware de autenticação garantindo `req.user.email` presente antes de chamar ferramentas.
- Tratamento de erros padronizado (logs com contexto + resposta JSON).

## 2. Interface Centrada no Chat (Fases 3 e 4)

### 2.1 PranaFormModal (Zoom In)
- **Templates Dinâmicos**:
  - Se `category === 'general'`: formulário padrão com descrição + checklist.
  - `video_script`: interpretar `templateData.scenes`, sincronizar com checklist e descrição (sinopse).
  - `instagram_carousel`: interpretar `templateData.slides`, sincronizar com checklist e descrição (caption).
- **Salvar/Carregar**:
  - Converter dados de template antes do submit (`buildTemplatePayload`).
  - `loadEditingData` deve mesclar dados antigos (`checklist`, `description`) com `templateData` parseado.
- **Interoperabilidade MindMap**: permitir receber `initialData` (rótulo/metadata) e remover nó de origem após criação/edição.
- **Compatibilidade**: manter suporte a projetos, notas e acordos sem quebrar fluxo existente.

### 2.2 Vistas no Chat (Zoom Nível 2)
- **ChatSheetView**: consumir dados reais das APIs, permitir edição inline chamando `set_custom_field_value`/`update_task`/`add_custom_column_sheet`.
- **ChatKanbanView**:
  - Sincronizar drag-and-drop com `move_task_to_kanban_column`.
  - Atualizar estado local após respostas; recarregar dados com `fetchKanbanView`.
  - Suportar colunas personalizadas (metadado `type`) e minimizar/quadro hub.
- **ChatMapView / ChatChainView**: consumir dados reais (`mapData`, `chainData`), expor botões para `connect_tasks` e, quando aplicável, `transmute_mindmap_node_to_task`.
- **ToolCallResultCard**: direcionar cada tool result para o componente de vista correto, mantendo cartões miniatura para operações simples.

## 3. Hubs Manuais (Fase 5)

### 3.1 ProjectView.jsx
- Estruturar abas (`overview`, `sheet`, `kanban`, `map`, `chain`).
- Reutilizar componentes do chat em modo hub (`variant="hub"`, alturas configuráveis, sem controles de minimizar).
- Garantir carregamento lazy de cada aba + estado de loading independente.

### 3.2 MindMap.jsx
- Canvas responsivo (ReactFlow) com pan/zoom.
- Nós sincronizados com tarefas (`node_type: 'task'`) e ideias (`node_type: 'idea'`).
- Botões laterais: abrir detalhes (PranaFormModal), abrir hub do projeto, transmutar para tarefa, excluir.
- Conexões criadas via `connect_tasks` com feedback de sucesso/erro.

## 4. Design & Identidade (Fase 6)
- Aplicar `PranaIcons-Tech` na navegação (`Layout.jsx`).
- Manter tema "Papyrus" disponível e coerente com novos componentes.
- Ícones sutis para ações de zoom/minimizar nas vistas do chat.
- Preservar consistência visual entre chat e hubs (glass-effect, bordas suaves, animações framer-motion).

## 5. Colaboração/Teams (Fase 7)
- Definir esquema de atribuição (`assignTaskToUser`) integrando tabela `teams`.
- Adaptar vistas para exibir filtros/legendas por membro (cores, ícones).
- Extender ferramentas do Ash para atribuir tarefas e gerar relatórios por equipe.

## 6. Trilha de Qualidade
- **Testes Automatizados**: preparar suite mínima (`npm run build`, lint, testes focados em utils) como pré-commit.
- **Migrações Drizzle**: gerar e aplicar sempre que schema mudar (`npm run drizzle:generate`, `npm run drizzle:migrate`).
- **Observabilidade**: manter logs claros em toolService e rotas Express; considerar hook centralizado de erros.

## 7. Roadmap de Próximos Passos
1. Finalizar persistência das vistas (Sheet/Kanban) eliminando mocks restantes.
2. Concluir integração de transmutação MindMap ↔ tarefas, expondo funcionalidade no chat.
3. Refinar PranaFormModal para suportar templates adicionais (carrossel, roteiro, general) com salvamento seguro.
4. Reforçar ProjectView como hub definitivo, removendo páginas redundantes do menu.
5. Atacar trilha Teams/atribuições após consolidar vistas e modal.

---

> **Nota**: Este plano deve ser revisitado ao final de cada incremento para atualizar prioridades e registrar dependências emergentes.
