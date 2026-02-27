# Plano Prana v6 — Auditoria Técnica

Esta auditoria revisa o estado atual do repositório contra o plano centrado em chat/hubs (v6). O objetivo é indicar o que já está entregue, o que precisa de ajustes e onde existem lacunas técnicas antes de avançarmos para novas iterações.

## Fase 1 — Camada de Dados Flexível

### Entregas confirmadas
- A tabela `tasks` já expõe `title`, `category`, `templateData`, `checklist` e `process_data`, permitindo salvar templates específicos no modal inteligente. 【F:src/db/schema.js†L40-L67】
- As tabelas de configurações `project_view_settings` e `project_kanban_settings` possuem chave única `(projectId, userId)`, o que garante preferências por usuário conforme previsto. 【F:src/db/schema.js†L215-L238】

### Lacunas
- `task_custom_fields` não possui índice de unicidade composto e continua aceitando múltiplos registros para o mesmo par `(taskId, fieldName)`, o que contraria a estratégia de upsert usada pelas ferramentas. 【F:src/db/schema.js†L203-L210】

## Fase 2 — Ferramentas do Ash

### Entregas confirmadas
- `create_task`, `update_task` e os demais helpers CRUD já operam sobre `tasks.title` e gravam templates/checklists no banco. 【F:src/ai_services/toolService.js†L76-L129】

### Lacunas
- O bloco que grava `customFields` ainda converte todos os valores para string e mantém `fieldType: 'text'` com um `TODO` explícito; precisamos inferir o tipo real antes de continuar o plano de personalização. 【F:src/ai_services/toolService.js†L93-L107】

## Fase 3 — Modal Inteligente

### Entregas confirmadas
- O `PranaFormModal` carrega templates como carrossel e roteiro, exibindo listas especializadas de cenas/slides. 【F:src/components/forms/PranaFormModal.jsx†L37-L131】

### Lacunas
- As interações avançadas (abrir subtarefas/cenas em modais próprios) ainda disparam apenas `console.log`/`toast` com a mensagem “Simulando abertura do modal”, o que impede o fluxo de edição completo previsto para o Zoom In. 【F:src/components/forms/PranaFormModal.jsx†L12-L31】

## Fase 4 — Vistas no Chat

### Entregas confirmadas
- As vistas de chat (Sheet, Kanban, Map, Nexus, Geral) consomem helpers dedicados e renderizam controles de edição direta. 【F:src/components/chat/ChatSheetView.jsx†L1-L120】【F:src/components/chat/ChatKanbanView.jsx†L1-L140】【F:src/components/chat/ChatMapView.jsx†L1-L115】

### Lacunas
- `ChatSheetView` e `ChatKanbanView` dependem de endpoints `/projects/:id/views/sheet` e `/projects/:id/views/kanban`, mas o servidor expõe apenas `/api/projects/:projectId/kanban-view`, gerando 404 ao carregar dados reais. 【F:src/api/projectViews.js†L1-L36】【F:server.js†L223-L269】
- `setCustomFieldValue` chama `/tasks/:taskId/custom-fields`, porém não existe rota correspondente no `server.js`, logo nenhuma alteração de coluna personalizada chega ao banco. 【F:src/api/taskCustomFields.js†L1-L13】【F:server.js†L200-L269】

## Fase 5 — Hubs e “Formas de Trabalho”

### Entregas confirmadas
- O `PageIntroTrigger` substituiu os títulos estáticos por modais leves em várias páginas, alinhando-se ao onboarding contextual do plano. 【F:src/components/PageIntroTrigger.jsx†L1-L40】【F:src/pages/ConversationHistory.jsx†L74-L119】

### Lacunas
- `ProjectHub` continua alimentado por `MOCK_PROJECT_DATA` e `MOCK_TASKS`, sem chamadas reais para as vistas dinamicamente persistidas, o que impede que o Hub seja uma alternativa completa ao chat. 【F:src/pages/ProjectHub.jsx†L21-L120】

## Fase 6 — Experiência Visual e Temas

### Entregas confirmadas
- Os temas originais e os novos (orgânico/texturizado) coexistem na UI, com seleção persistida no layout. 【F:src/pages/Layout.jsx†L45-L170】
- O conjunto de ícones paisagem e o `PageIntroTrigger` já refletem a linguagem glassmórfica requerida. 【F:src/pages/Layout.jsx†L15-L43】【F:src/components/PageIntroTrigger.jsx†L1-L40】

## Resumo das Pendências Prioritárias
1. Criar índices/validadores para `task_custom_fields` e ajustar os upserts para evitar duplicidade de campos personalizados.
2. Implementar as rotas REST faltantes (`/projects/:id/views/sheet`, `/projects/:id/views/kanban`, `/projects/:id/sheet-columns`, `/tasks/:id/custom-fields`, etc.) ou alinhar os clients para usar as rotas existentes.
3. Substituir os mocks do `ProjectHub` por integrações reais com as vistas dinamicamente salvas.
4. Evoluir o `PranaFormModal` para abrir editores de subtarefa/cena reais em vez de apenas registrar logs.

Com esses ajustes, o Plano v6 ficará alinhado à experiência centrada no chat e aos hubs descritos no roteiro estratégico.
