/* src/components/chat/ToolCallResultCard.jsx
   desc: Renderizador Universal de Ferramentas V10.
   feat: Suporta Views Complexas do Ash (V8) + Ferramentas Cirúrgicas do Neo (V10).
*/

import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2, LayoutDashboard } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import PranaFormModal from '@/components/forms/PranaFormModal';

// [V10] Importação da Bolha Cirúrgica do Neo
import { NeoDiffBubble } from '../specialists/dev-neo/NeoDiffBubble';

// --- Vistas de Visualização (Lazy Load para performance no chat) ---
const ChatGeneralView = React.lazy(() => import('./ChatGeneralView'));
const ChatSheetView = React.lazy(() => import('./ChatSheetView.jsx.desligado'));
const ChatKanbanView = React.lazy(() => import('./ChatKanbanView'));
const ChatMapView = React.lazy(() => import('./ChatMapView'));
const ChatChainView = React.lazy(() => import('./ChatChainView'));

// --- Card de Item Único (Aparência de "Notificação de Sucesso") ---
const SingleItemCard = ({ item, type, onOpen }) => (
    <div className="p-4 border border-green-500/20 rounded-xl bg-green-500/5 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-500">
                {type === 'project' ? <LayoutDashboard className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-green-400 font-medium uppercase tracking-wider">
                    {type === 'task' ? 'Tarefa Criada' : 'Projeto Iniciado'}
                </p>
                <p className="font-semibold text-sm truncate text-foreground">
                    {item.title || item.name || "Item sem nome"}
                </p>
            </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpen} className="border-green-500/30 hover:bg-green-500/10 hover:text-green-400">
            Abrir Detalhes
        </Button>
    </div>
);

export default function ToolCallResultCard({ toolName, args, result, state, status }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalItemType, setModalItemType] = useState('task');
    const [modalItemId, setModalItemId] = useState(null);

    const openModal = (type, id) => {
        setModalItemType(type);
        setModalItemId(id);
        setModalOpen(true);
    };

    // 🧩 [V10] ESTADO DE EXECUÇÃO: Mostra que a ferramenta está rodando no backend
    if (state === 'call' || state === 'partial-call' || status === 'pending') {
        return (
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl text-muted-foreground w-full animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest">
                    Processando Tool: {toolName}...
                </span>
            </div>
        );
    }

    // Tratamento de Erros
    if (status === 'error' || (result && result.success === false)) {
        return (
            <div className="flex items-center gap-3 p-4 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                    {result?.message || 'Não foi possível completar a ação. Verifique os dados.'}
                </span>
            </div>
        );
    }

    // 🧩 [V10] SEÇÃO NEO: Ferramentas Técnicas do Engenheiro de Software
    if (toolName === 'explain_code_diff') {
        const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
        return (
            <NeoDiffBubble 
                filePath={parsedArgs.filePath} 
                oldSnippet={parsedArgs.oldSnippet} 
                newSnippet={parsedArgs.newSnippet} 
                reason={parsedArgs.reason} 
            />
        );
    }

    // Exibição Limpa para outras ferramentas do Neo (Grep, Skeleton) para não poluir o chat
    if (['code_grep', 'read_skeleton', 'project_indexing'].includes(toolName)) {
        return (
            <div className="w-full bg-black/20 p-3 rounded-xl border border-white/5 font-mono text-[10px] my-2">
                <div className="text-gray-400 mb-2 border-b border-white/5 pb-1 flex justify-between">
                    <span className="uppercase font-bold tracking-widest text-[9px]">Ação Concluída</span>
                    <span className="text-indigo-400">{toolName}</span>
                </div>
                <div className="text-gray-500 mb-1 mt-2 text-[8px] uppercase">Resultado Resumido:</div>
                <pre className="text-gray-300 overflow-x-auto bg-black/40 p-2 rounded line-clamp-3 hover:line-clamp-none transition-all">
                    {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </pre>
            </div>
        );
    }

    // Se a ferramenta for de visualização/criação, mas não houver resultado, aborta
    if (!result) return null;

    const renderView = (Component, label) => (
        <Suspense fallback={
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-black/20 rounded-xl border border-white/5">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span className="text-xs">Carregando {label}...</span>
            </div>
        }>
            <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <Component data={result} />
            </div>
        </Suspense>
    );

    // --- Roteamento de Vistas (Exibição Inline no Chat - ASH V8) ---
    const renderContent = () => {
        switch(toolName) {
            case 'get_project_view_general': return renderView(ChatGeneralView, 'Visão Geral');
            case 'get_project_view_sheet': return renderView(ChatSheetView, 'Planilha');
            case 'get_project_view_kanban': return renderView(ChatKanbanView, 'Kanban');
            case 'get_project_view_map': return renderView(ChatMapView, 'Mapa Mental');
            case 'get_project_view_chain': return renderView(ChatChainView, 'Dependências');

            case 'create_task':
                if (!result.task) return <span className="text-red-400 text-xs">Erro: Dados da tarefa ausentes.</span>;
                return <SingleItemCard item={result.task} type="task" onOpen={() => openModal('task', result.task.id)} />;
            
            case 'create_project':
                 if (!result.project) return <span className="text-red-400 text-xs">Erro: Dados do projeto ausentes.</span>;
                return <SingleItemCard item={result.project} type="project" onOpen={() => openModal('project', result.project.id)} />;
            
            // Fallback genérico para ferramentas que não foram mapeadas
            default:
                return (
                    <div className="flex items-center gap-2 text-green-400 p-3 bg-green-500/5 rounded-lg border border-green-500/10 w-full">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">Ação {toolName} concluída silenciosamente.</span>
                    </div>
                );
        }
    };

    const isComplexView = toolName.startsWith('get_project_view');

    return (
        <div className="w-full my-2">
            {isComplexView ? (
                renderContent()
            ) : (
                <div className="w-full md:max-w-md">
                    {renderContent()}
                </div>
            )}

            {/* Modal Global para Edição */}
            <PranaFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                itemType={modalItemType}
                editingItemId={modalItemId}
            />
        </div>
    );
}