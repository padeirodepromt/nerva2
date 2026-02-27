/* src/components/chat/ActionConfirmationCard.jsx
   desc: UI de "Draft Mode". Permite ao usuário aprovar ações do Ash.
*/
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconCheckCircle, IconX, IconAlertTriangle, IconLoader2, IconCode } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import * as toolService from '@/ai_services/toolService'; // Importa tools para execução direta
import { toast } from 'sonner';

export default function ActionConfirmationCard({ proposal, onExecuted }) {
    const { title, description, impact, toolToExecute, argsToExecute } = proposal;
    const [status, setStatus] = useState('pending'); // pending, executing, success, error, cancelled

    const isCritical = impact === 'critical' || impact === 'high';

    const handleConfirm = async () => {
        setStatus('executing');
        try {
            // Mágica: O Frontend executa a tool handler diretamente
            // Isso funciona porque nossos handlers usam 'db' importado que funciona no contexto da aplicação
            const handler = Object.values(toolService).find(t => t.declaration.name === toolToExecute)?.handler;
            
            if (!handler) throw new Error("Ferramenta não encontrada.");

            const result = await handler(argsToExecute);

            if (result.error) throw new Error(result.error);

            setStatus('success');
            toast.success("Plano executado com sucesso.");
            
            // Repassa o resultado (ex: navegar para view) para o chat processar
            if (onExecuted) onExecuted(result);

        } catch (error) {
            console.error(error);
            setStatus('error');
            toast.error("Falha na execução do plano.");
        }
    };

    const handleCancel = () => {
        setStatus('cancelled');
    };

    if (status === 'cancelled') {
        return (
            <div className="p-3 rounded-lg border border-white/5 bg-white/5 text-xs text-gray-500 italic">
                Proposta cancelada.
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10 flex items-center gap-3 text-green-400">
                <IconCheckCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Executado: {title}</span>
            </div>
        );
    }

    return (
        <div className={cn(
            "rounded-xl border p-4 my-2 transition-all duration-300",
            isCritical ? "bg-red-500/5 border-red-500/20" : "bg-blue-500/5 border-blue-500/20"
        )}>
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className={cn("p-2 rounded-lg", isCritical ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400")}>
                    {isCritical ? <IconAlertTriangle className="w-5 h-5" /> : <IconCode className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="font-bold text-sm text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
            </div>

            {/* Detalhes Técnicos (Colapsáveis ou sutis) */}
            <div className="bg-black/20 rounded p-2 mb-4 font-mono text-[10px] text-gray-500 overflow-x-auto">
                <span className="text-purple-400">function</span> {toolToExecute}(...)
            </div>

            {/* Ações */}
            <div className="flex gap-2 justify-end">
                <Button 
                    size="sm" variant="ghost" 
                    onClick={handleCancel}
                    disabled={status === 'executing'}
                    className="text-xs h-8"
                >
                    Cancelar
                </Button>
                
                <Button 
                    size="sm" 
                    onClick={handleConfirm}
                    disabled={status === 'executing'}
                    className={cn(
                        "text-xs h-8 gap-2 text-white",
                        isCritical ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {status === 'executing' ? <IconLoader2 className="w-3 h-3 animate-spin" /> : <IconCheckCircle className="w-3 h-3" />}
                    {status === 'executing' ? "Executando..." : "Confirmar & Executar"}
                </Button>
            </div>
        </div>
    );
}