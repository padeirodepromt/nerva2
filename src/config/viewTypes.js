/* src/config/viewTypes.js
   desc: Registro Central de Visualizações (Views).
   upd: Adicionado suporte para HoloCanvas, Daily Briefing e Tag Canvas.
*/

export const VIEW_TYPES = {
    // --- CORE (O Básico) ---
    DASHBOARD: 'dashboard',
    SETTINGS: 'settings',
    ASH_CHAT: 'ash_chat', // O Terminal Lateral
    SANKALPA: 'sankalpa', // O "Canvas em Branco" / Home

    // --- TEMPO (Cronos) ---
    PLANNER_WEEKLY: 'planner_weekly',
    CALENDAR_MONTHLY: 'calendar_monthly',
    
    // --- ESTRUTURA (Projetos e Hierarquia) ---
    PROJECT_HUB: 'project_hub', // A Raiz (Meu Computador)
    PROJECT_CANVAS: 'project_canvas', // O Interior de uma Pasta
    
    // --- FERRAMENTAS ESPECÍFICAS ---
    SHEET_VIEW: 'sheet_view',
    CHAIN_VIEW: 'chain_view',
    MINDMAP_BOARD: 'mindmap_board',
    DOC_EDITOR: 'doc_editor',
    LOGBOOK: 'logbook',
    LIST_VIEW: 'list_view', // [NOVO] 
    INBOX_VIEW: 'inbox_view', // [NOVO]
    KANBAN_BOARD: 'kanban_board', // Nome oficial
    TEAMS_VIEW: 'teams_view', // [NOVO]



    // --- EXPERIÊNCIA GENERATIVA (Ash Driven) ---
    DAILY_BRIEFING: 'daily_briefing', // O Card "Minority Report"
    HOLO_CANVAS: 'holo_canvas',       // A UI Dinâmica (Lego)
    TAG_CANVAS: 'tag_canvas'          // A Pasta Virtual de Tags
};