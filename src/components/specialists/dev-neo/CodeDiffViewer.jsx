/* src/components/specialists/dev-neo/CodeDiffViewer.jsx
   desc: Componente isolado para revisão de código gerado por IA.
   feat: Monaco DiffEditor, Painel de Aprovação e Telemetria Integrada.
*/
import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { IconCheckCircle } from '@/components/icons/PranaLandscapeIcons';
import { TelemetryBadge } from '@/components/packages/neo/TelemetryBadge';

export default function CodeDiffViewer({
    originalContent,
    proposedContent,
    language = 'javascript',
    telemetry,
    onAccept,
    onReject
}) {
    return (
        <div className="flex flex-col h-full relative w-full">
            
            {/* BARRA DE REVISÃO SOBERANA (Flutuante) */}
            {proposedContent && (
                <div className="absolute top-4 right-8 z-10 flex items-center gap-4 bg-[#252526] p-2 rounded-xl border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 animate-in slide-in-from-top-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-widest px-2">
                            Revisão do Neo
                        </span>
                    </div>
                    
                    {/* O Selo Lego (Hard-Code Pack) */}
                    {telemetry && <TelemetryBadge report={telemetry} />}
                    
                    <div className="w-px h-6 bg-white/10" />
                    
                    <div className="flex items-center gap-2 pr-1">
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-red-500/20 text-red-400 h-7 text-[10px]" 
                            onClick={onReject}
                        >
                            Descartar
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-7 text-[10px] gap-1" 
                            onClick={onAccept}
                        >
                            <IconCheckCircle className="w-3 h-3" /> Aplicar Código
                        </Button>
                    </div>
                </div>
            )}

            {/* O MOTOR DE DIFF (Monaco) */}
            <DiffEditor
                height="100%"
                theme="prana-dark"
                language={language}
                original={originalContent || ''}
                modified={proposedContent || originalContent || ''}
                options={{
                    minimap: { enabled: false },
                    readOnly: true,
                    renderSideBySide: true, // Side-by-side clássico
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                    ignoreTrimWhitespace: false
                }}
            />
        </div>
    );
}