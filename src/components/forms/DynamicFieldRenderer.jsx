/* src/components/forms/DynamicFieldRenderer.jsx
   desc: Renderiza campos baseado no schema do template.
*/
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

// Importando os ícones (incluindo os novos)
import { 
    IconHash, IconFlux, IconLink, IconTarget, IconClock, IconZap, IconCopy, IconAlert, IconLayers, 
    IconMatrix, IconCode, IconGitBranch, IconServer, IconBug, IconDiff
} from '@/components/icons/PranaLandscapeIcons';

// Mapa Seguro atualizado
const SAFE_ICON_MAP = {
    'IconHash': IconHash,
    'IconFlux': IconFlux,
    'IconLink': IconLink,
    'IconTarget': IconTarget,
    'IconClock': IconClock,
    'IconZap': IconZap,
    'IconAlert': IconAlert,
    'IconLayers': IconLayers,
    'IconMatrix': IconMatrix,
    // [NOVOS]
    'IconCode': IconCode,
    'IconGitBranch': IconGitBranch,
    'IconServer': IconServer,
    'IconBug': IconBug,
    'IconDiff': IconDiff
};

export default function DynamicFieldRenderer({ template, data = {}, onChange }) {
    if (!template || !template.schema || template.schema.length === 0) return null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado!");
    };

    const colorTheme = {
        blue: "bg-blue-900/10 border-blue-500/20 text-blue-400",
        cyan: "bg-cyan-900/10 border-cyan-500/20 text-cyan-400",
        red: "bg-red-900/10 border-red-500/20 text-red-400",
        default: "bg-white/5 border-white/10 text-muted-foreground"
    }[template.color] || "bg-white/5 border-white/10 text-muted-foreground";

    return (
        <div className={`mb-6 p-4 rounded-xl border ${colorTheme} animate-in fade-in slide-in-from-top-2`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 opacity-90">
                {SAFE_ICON_MAP[template.icon] && React.createElement(SAFE_ICON_MAP[template.icon], { className: "w-4 h-4" })}
                {template.label}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.schema.map((field) => {
                    const FieldIcon = field.icon; // Passado direto no template.js
                    const value = data[field.key] || '';

                    return (
                        <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                            <label className="text-[10px] uppercase opacity-50 mb-1 flex items-center gap-1">
                                {FieldIcon && <FieldIcon className="w-3 h-3" />}
                                {field.label}
                            </label>

                            <div className="relative flex items-center gap-2">
                                {field.type === 'select' ? (
                                    <Select value={value} onValueChange={(val) => onChange(field.key, val)}>
                                        <SelectTrigger className="h-8 text-xs bg-black/20 border-white/10 w-full font-mono">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10">
                                            {field.options.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input 
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        value={value}
                                        onChange={(e) => onChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="h-8 text-xs bg-black/20 border-white/10 font-mono focus-visible:ring-1 text-white/90"
                                    />
                                )}

                                {field.copyable && value && (
                                    <Button 
                                        type="button" size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 shrink-0"
                                        onClick={() => handleCopy(value)}
                                    >
                                        <IconCopy className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}