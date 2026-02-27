/* src/components/dashboard/DashboardFiltersDropdown.jsx
   desc: Dropdown customizado para filtrar seções do Dashboard
*/

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconSettings } from '@/components/icons/PranaLandscapeIcons';

export default function DashboardFiltersDropdown({ filters, onFiltersChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fechar quando clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        
        if (open) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [open]);

    const handleToggle = (section) => {
        const newFilters = {
            ...filters,
            [section]: !filters[section]
        };
        onFiltersChange(newFilters);
        // Manter dropdown aberto após clique
    };

    const sections = [
        { group: 'Produtividade', items: ['sankalpa', 'tasks', 'velocity'] },
        { group: 'Rituais', items: ['rituals'] },
        { group: 'Analíticas', items: ['astrology', 'energy', 'mood', 'tags', 'ash'] }
    ];

    const labels = {
        sankalpa: 'Intenção do Dia',
        tasks: 'Tarefas Prioritárias',
        velocity: 'Velocidade (Ações)',
        rituals: 'Rituais',
        astrology: 'Astrologia & Lunar',
        energy: 'Energia (Stats)',
        mood: 'Humor (Stats)',
        tags: 'Nuvem de Tags',
        ash: 'Recomendações Ash',
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs border-white/10 hover:bg-white/5"
                onClick={() => setOpen(!open)}
            >
                <IconSettings className="w-4 h-4" />
                Filtrar
            </Button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                            Seções do Dashboard
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {sections.map((section, idx) => (
                            <div key={section.group}>
                                <div className="px-3 py-2 mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                                    {section.group}
                                </div>
                                {section.items.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => handleToggle(item)}
                                        className="w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors flex items-center gap-2 group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters[item] || false}
                                            onChange={() => {}}
                                            className="w-4 h-4 cursor-pointer accent-current"
                                        />
                                        <span className="text-foreground/80 group-hover:text-foreground">
                                            {labels[item]}
                                        </span>
                                    </button>
                                ))}
                                {idx < sections.length - 1 && (
                                    <div className="my-1 border-t border-white/5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
