/* canvas: src/pages/index.jsx
   desc: Barrel File Oficial V3.
   note: Exporta apenas as Views definitivas do modelo IDE/Cockpit.
   ref: Manual Mestre Cap 6, Fase 1, Passo 4.
*/

// --- Core Views (O Tabuleiro) ---
export { default as DashboardView } from '../views/DashboardView';
export { default as PlannerView } from '../views/PlannerView';
export { default as CalendarView } from '../views/CalendarView';

// --- Project Views (A Forja) ---
export { default as ProjectHub } from './ProjectHub'; // Ainda está em pages, será migrado
export { default as ProjectCanvasView } from '../views/ProjectCanvasView';
export { default as SheetView } from '../views/SheetView';
export { default as ChainView } from '../views/ChainView';
export { default as MindMapBoardView } from '../views/MindMapBoardView';
export { default as DocEditorView } from '../views/DocEditorView';
export { default as KanbanView } from '../views/KanbanView'; // [NOVO]
export { default as PostitBoardPage } from '../views/KanbanView'; // Alias para compatibilidade, se necessário

// --- Personal Views (O Espelho) ---
export { default as LogbookView } from '../views/LogbookView';
export { default as SettingsView } from './Settings'; // Ainda está em pages

// --- Auth ---
export { default as LoginModal } from '../components/auth/LoginModal';