/* VIEWS FILTER STANDARDIZATION GUIDE
   
   Objetivo: Padronizar filtros em todas as Views para melhor UX e consistência

   ✅ VIEWS JÁ ATUALIZADAS:
   - ListView (com FilterBar)

   ⏳ VIEWS QUE PRECISAM DE ATUALIZAÇÃO:
   
   1. KanbanView
      Atual: searchText, filterPriority
      Esperado: searchText, filterStatus, filterPriority
      Ação: Substituir DropdownMenu manual por FilterBar

   2. SheetView
      Atual: Nenhum filtro UI
      Esperado: searchText, filterStatus, filterPriority
      Ação: Adicionar FilterBar no topo

   3. CalendarView
      Atual: Nenhum filtro UI
      Esperado: searchText, filterStatus, filterPriority
      Ação: Adicionar FilterBar no topo

   4. ChainView
      Atual: Nenhum filtro UI
      Esperado: searchText, filterStatus
      Ação: Adicionar FilterBar (sem prioridade, pois é visual)

   5. MindMapBoardView
      Atual: Não verificado
      Esperado: searchText, filterStatus, filterPriority
      Ação: TBD

   ═════════════════════════════════════════════════════════════════

   COMO USAR FilterBar:

   1. Import no arquivo da View:
      import FilterBar from '@/components/views/FilterBar';

   2. Adicionar estados:
      const [searchText, setSearchText] = useState('');
      const [filterStatus, setFilterStatus] = useState('all');
      const [filterPriority, setFilterPriority] = useState('all');

   3. Usar o componente (após o PageHeader, antes do conteúdo):
      <FilterBar
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={filterStatus}
          onStatusChange={setFilterStatus}
          priorityFilter={filterPriority}
          onPriorityChange={setFilterPriority}
          onClearAll={() => {
              setSearchText('');
              setFilterStatus('all');
              setFilterPriority('all');
          }}
          showPriority={true}  // Opcional: esconde se view não precisa
          showStatus={true}    // Opcional: esconde se view não precisa
      />

   4. Atualizar a filtragem dos tasks:
      Exemplo em useMemo:
      
      const filteredTasks = useMemo(() => {
          let result = [...tasks];
          
          if (searchText) {
              result = result.filter(t => 
                  t.title.toLowerCase().includes(searchText.toLowerCase())
              );
          }
          if (filterStatus !== 'all') {
              result = result.filter(t => t.status === filterStatus);
          }
          if (filterPriority !== 'all') {
              result = result.filter(t => t.priority === filterPriority);
          }
          
          return result;
      }, [tasks, searchText, filterStatus, filterPriority]);

   ═════════════════════════════════════════════════════════════════

   STATUS OPTIONS (Padrão Global):
   - 'all'         → Todos
   - 'todo'        → A Fazer
   - 'in_progress' → Em Andamento
   - 'blocked'     → Bloqueado
   - 'done'        → Concluído

   PRIORITY OPTIONS (Padrão Global):
   - 'all'      → Todas
   - 'critical' → Crítica (Vermelho)
   - 'high'     → Alta (Laranja)
   - 'medium'   → Média (Âmbar)
   - 'low'      → Baixa (Azul)

   ═════════════════════════════════════════════════════════════════

   PRÓXIMAS MELHORIAS:
   - [ ] Adicionar filtro por Responsável (multi-select)
   - [ ] Adicionar filtro por Intervalo de Datas
   - [ ] Salvar preferências de filtro no localStorage
   - [ ] Adicionar filtros customizados por campos dinâmicos
*/

export const FILTER_STANDARDIZATION_NOTES = `
   Iniciado em: 19 de Dezembro de 2025
   Status: Em Progresso
   Prioridade: Alta
`;
