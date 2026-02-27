/* canvas: src/components/documents/DocumentHistoryTimeline.jsx
   desc: Timeline de Histórico de Documentos.
   fix: Adicionado 'export default' explícito.
*/
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// Importação de ícones verificada: Todos existem na sua biblioteca
import { IconCronos, IconCheck, IconFlux, IconArrowLeft } from '@/components/icons/PranaLandscapeIcons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// AQUI ESTÁ O EXPORT DEFAULT OBRIGATÓRIO
export default function DocumentHistoryTimeline({ versions, currentVersionId, onSelectVersion, onRestore }) {
    return (
        <div className="flex flex-col h-full bg-background/20 border-l border-white/5 w-[300px]">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-serif">
                    <IconCronos className="w-4 h-4 text-primary" />
                    Memória do Artefato
                </div>
            </div>

            <ScrollArea className="flex-1 prana-scrollbar">
                <div className="p-4 space-y-6">
                    {/* Linha do Tempo Vertical */}
                    <div className="relative border-l-2 border-white/10 ml-2 space-y-8">
                        {versions.map((ver, idx) => {
                            const isCurrent = ver.id === currentVersionId;
                            return (
                                <div key={ver.id} className="relative pl-6">
                                    {/* Bolinha da Linha do Tempo */}
                                    <div 
                                        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                                            isCurrent ? 'bg-primary border-primary' : 'bg-background border-white/20'
                                        }`}
                                    />
                                    
                                    <div 
                                        onClick={() => onSelectVersion(ver)}
                                        className={`
                                            p-3 rounded-xl border cursor-pointer transition-all group
                                            ${isCurrent ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className="text-[10px] h-5 border-white/10">
                                                v{ver.versionNumber}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                {format(new Date(ver.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                        
                                        <p className="text-xs font-medium text-foreground mb-1">
                                            {ver.changeLog || "Alteração sem título"}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground opacity-70">
                                            <div className="w-4 h-4 rounded-full bg-white/10" /> {/* Avatar Placeholder */}
                                            {ver.editorName || "Autor"}
                                        </div>

                                        {/* Botão de Restaurar (Só aparece se não for a atual) */}
                                        {!isCurrent && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={(e) => { e.stopPropagation(); onRestore(ver); }}
                                                className="w-full mt-2 h-7 text-[10px] border border-white/10 hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <IconFlux className="w-3 h-3 mr-2" /> Restaurar esta versão
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}