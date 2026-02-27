/* canvas: src/components/forms/HierarchicalProjectSelector.jsx */
import React, { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from '@/api/entities';
import { IconLayers, IconFolder, } from '@/components/icons/PranaLandscapeIcons';

export default function HierarchicalProjectSelector({ value, onChange, placeholder = "Selecione o local...", excludeId = null }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Busca todos os projetos ativos
                const data = await Project.list({ status: 'active' });
                setProjects(data);
            } catch (e) {
                console.error("Erro ao carregar projetos", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Transforma lista plana em lista linear com profundidade (para o Select)
    const flattenedOptions = useMemo(() => {
        const options = [];
        
        const buildOptions = (parentId, depth = 0) => {
            // Filtra filhos do parentId atual
            const children = projects.filter(p => {
                // Compatibilidade com camelCase e snake_case
                const pParent = p.parentId || p.parent_id;
                // Se parentId for null, pega raízes. Se não, pega filhos.
                return parentId ? pParent === parentId : !pParent;
            });

            children.forEach(proj => {
                // Evita selecionar a si mesmo (em caso de edição de projeto)
                if (excludeId && proj.id === excludeId) return;

                options.push({ ...proj, depth });
                buildOptions(proj.id, depth + 1); // Recursão
            });
        };

        buildOptions(null);
        return options;
    }, [projects, excludeId]);

    return (
        <Select value={value || "inbox"} onValueChange={(val) => onChange(val === "inbox" ? null : val)}>
            <SelectTrigger className="bg-white/5 border-white/10 w-full">
                <SelectValue placeholder={loading ? "Carregando..." : placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
                {/* Opção Padrão (Raiz ou Inbox) */}
                <SelectItem value="inbox">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <IconLayers className="w-4 h-4" />
                        <span>{placeholder.includes("Pai") ? "Sem Pai (Raiz)" : "Inbox (Sem Projeto)"}</span>
                    </div>
                </SelectItem>
                
                {/* Árvore de Projetos */}
                {flattenedOptions.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                        <div className="flex items-center gap-2" style={{ paddingLeft: `${proj.depth * 16}px` }}>
                            <span className="opacity-30">
                                {proj.depth > 0 && "└─"}
                            </span>
                            <IconFolder className={`w-4 h-4 ${proj.depth === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={proj.depth === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                                {proj.title || proj.name}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}