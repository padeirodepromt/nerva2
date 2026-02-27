/* canvas: src/components/dashboard/TagExplorer.jsx */
import React, { useState, useEffect } from 'react';
import { IconNexus, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { Task, Project } from '@/api/entities';
import { cn } from '@/lib/utils';

export default function TagExplorer({ onSelectTag, activeTag }) {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                // Em produção, isso seria um endpoint: await apiClient.get('/tags')
                // Simulação de agregação:
                const [tasks, projects] = await Promise.all([
                    Task.list(),
                    Project.list()
                ]);

                const tagMap = {};

                const processTags = (item) => {
                    if (!item.tags) return;
                    const itemTags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]');
                    itemTags.forEach(tag => {
                        const normalized = tag.toLowerCase();
                        if (!tagMap[normalized]) tagMap[normalized] = { name: tag, count: 0 };
                        tagMap[normalized].count++;
                    });
                };

                tasks.forEach(processTags);
                projects.forEach(processTags);

                // Converte para array e ordena por contagem
                const sortedTags = Object.values(tagMap).sort((a, b) => b.count - a.count);
                setTags(sortedTags);

            } catch (e) {
                console.error("Erro ao carregar tags", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) return <div className="flex justify-center p-4"><IconLoader2 className="w-4 h-4 animate-spin text-gray-500"/></div>;

    return (
        <div className="h-full w-full pb-10">
            {tags.length === 0 ? (
                <div className="p-4 text-xs text-center text-gray-600">Nenhuma tag encontrada.</div>
            ) : (
                <div className="flex flex-col">
                    {tags.map(tag => (
                        <button
                            key={tag.name}
                            onClick={() => onSelectTag(tag.name)}
                            className={cn(
                                "flex items-center justify-between py-1.5 px-3 cursor-pointer text-sm group transition-all border-l-2 border-transparent",
                                activeTag === tag.name 
                                    ? "bg-primary/10 border-primary text-white" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <IconNexus className={cn("w-3 h-3 shrink-0", activeTag === tag.name ? "text-primary" : "text-gray-600 group-hover:text-gray-400")} />
                                <span className="truncate">{tag.name}</span>
                            </div>
                            <span className="text-[10px] opacity-30 group-hover:opacity-100 min-w-[20px] text-right">
                                {tag.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}