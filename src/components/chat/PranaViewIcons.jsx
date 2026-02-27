import React from 'react';
import { cn } from '@/lib/utils';

const IconBase = React.forwardRef(function IconBase({ className, children, ...props }, ref) {
    return (
        <svg
            ref={ref}
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
            className={cn('prana-icon', className)}
            {...props}
        >
            {children}
        </svg>
    );
});

export const IconMinimize = React.forwardRef(function IconMinimize(props, ref) {
    return (
        <IconBase ref={ref} {...props}>
            <path d="M3.5 10.5c2.2-3.4 4.7-3.4 6.9 0" />
            <path d="M20.5 10.5c-2.2-3.4-4.7-3.4-6.9 0" />
            <path d="M4 16.5h16" opacity="0.6" />
        </IconBase>
    );
});

export const IconExpand = React.forwardRef(function IconExpand(props, ref) {
    return (
        <IconBase ref={ref} {...props}>
            <path d="M5.5 8.5c2.4-3.2 5.6-3.2 8 0" />
            <path d="M18.5 8.5L19 5l-3.5.5" />
            <path d="M18.5 15.5c-2.4 3.2-5.6 3.2-8 0" />
            <path d="M5.5 15.5L5 19l3.5-.5" />
        </IconBase>
    );
});

export const IconOpenHub = React.forwardRef(function IconOpenHub(props, ref) {
    return (
        <IconBase ref={ref} {...props}>
            <circle cx="12" cy="12" r="6.5" opacity="0.65" />
            <path d="M9.5 9.75c1.4-1.2 3.6-1.2 5 0" />
            <path d="M12 7V3" />
            <path d="M16.5 12H21" />
            <path d="M12 17v4" />
            <path d="M3 12h4.5" />
        </IconBase>
    );
});

/**
 * Componente PranaViewIcons: Renderiza os ícones de vista do chat
 * Permite alternar entre diferentes visualizações (geral, kanban, sheet, map, chain)
 */
const PranaViewIcons = ({ currentView, setCurrentView }) => {
    const views = [
        { id: 'general', label: 'Geral', icon: IconMinimize },
        { id: 'kanban', label: 'Kanban', icon: IconExpand },
        { id: 'sheet', label: 'Tabela', icon: IconOpenHub },
        { id: 'map', label: 'Mapa', icon: IconMinimize },
        { id: 'chain', label: 'Chain', icon: IconExpand },
    ];

    return (
        <div className="flex gap-2">
            {views.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;
                return (
                    <button
                        key={view.id}
                        onClick={() => setCurrentView(view.id)}
                        title={view.label}
                        className={`p-2 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-blue-100 text-blue-600'
                                : 'hover:bg-gray-100 text-gray-500'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                );
            })}
        </div>
    );
};

export default PranaViewIcons;
