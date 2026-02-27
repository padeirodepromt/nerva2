/* src/components/settings/VSCodeSettingsLayout.jsx
   desc: Layout de Settings estilo VS Code com sidebar, paleta de comandos e busca
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSettings, IconSearch, IconX, IconChevronUp, IconChevronDown,
    IconGitBranch, IconBrainCircuit, IconBookOpen, IconSoul,
    IconVision, IconCosmos, IconFilter, IconCode, IconDollarSign
} from '@/components/icons/PranaLandscapeIcons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Menu de seções
const SETTINGS_SECTIONS = [
    {
        id: 'general',
        name: 'Geral',
        icon: IconSoul,
        description: 'Aparência, idioma e conta',
        subsections: [
            { id: 'appearance', name: 'Aparência', icon: IconVision },
            { id: 'language', name: 'Idioma e Região', icon: IconCosmos },
            { id: 'profile', name: 'Perfil', icon: IconSoul }
        ]
    },
    {
        id: 'brain',
        name: 'Inteligência',
        icon: IconBrainCircuit,
        description: 'Configure o comportamento do Ash',
        subsections: [
            { id: 'personality', name: 'Personalidade', icon: IconBrainCircuit },
            { id: 'advanced', name: 'Configurações Avançadas', icon: IconCode }
        ]
    },
    {
        id: 'knowledge',
        name: 'Conhecimento',
        icon: IconBookOpen,
        description: 'Base de conhecimento global',
        subsections: [
            { id: 'documents', name: 'Meus Documentos', icon: IconBookOpen }
        ]
    },
    {
        id: 'migration',
        name: 'Importação',
        icon: IconGitBranch,
        description: 'Migre seus dados',
        subsections: [
            { id: 'csv', name: 'CSV', icon: IconGitBranch },
            { id: 'notion', name: 'Notion', icon: IconGitBranch },
            { id: 'asana', name: 'Asana', icon: IconGitBranch },
            { id: 'history', name: 'Histórico', icon: IconGitBranch }
        ]
    },
    {
        id: 'plans',
        name: 'Planos',
        icon: IconDollarSign,
        description: 'Gerenciar planos de assinatura',
        adminOnly: true,
        subsections: [
            { id: 'subscription-plans', name: 'Planos de Assinatura', icon: IconDollarSign }
        ]
    }
];

// === NOVO: Paleta de Navegação (Views) ===
const NAVIGATION_COMMANDS = [
    { id: 'dashboard', label: 'Dashboard', icon: IconSoul, description: 'Central de comando' },
    { id: 'chat', label: 'Prana AI', icon: IconBrainCircuit, description: 'Inteligência conversacional' },
    { id: 'sankalpa', label: 'Sankalpa', icon: IconVision, description: 'Sua intenção e propósito' },
    { id: 'cronos', label: 'Cronos', icon: IconCode, description: 'Planejamento temporal' },
    { id: 'cosmos', label: 'Cosmos', icon: IconCosmos, description: 'Universo temporal' },
    { id: 'diary', label: 'Diário de Bordo', icon: IconBookOpen, description: 'Seu mapa pessoal' },
    { id: 'papyrus', label: 'Papyrus', icon: IconBookOpen, description: 'Ideias e reflexões' },
    { id: 'neural', label: 'Neural', icon: IconBrainCircuit, description: 'Conexões mentais' },
    { id: 'coletivo', label: 'Coletivo', icon: IconSoul, description: 'Harmonia coletiva' },
    { id: 'matrix', label: 'Matrix', icon: IconCode, description: 'Dados estruturados' },
    { id: 'flux', label: 'Flux', icon: IconGitBranch, description: 'Fluxo visual' }
];


// Paleta de Comandos
const CommandPalette = ({ isOpen, onClose, sections }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // === NOVO: Buscar em navegação + settings ===
    const filteredCommands = [
        // Comandos de navegação (views)
        ...NAVIGATION_COMMANDS.filter(cmd => 
            cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        // Comandos de settings
        ...sections
            .flatMap(section => [
                { ...section, type: 'section', label: section.name },
                ...section.subsections.map(sub => ({
                    ...sub,
                    type: 'subsection',
                    parent: section.name,
                    label: sub.name
                }))
            ])
            .filter(cmd => cmd.label.toLowerCase().includes(searchQuery.toLowerCase()))
    ];

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        setSelectedIndex(0);
    }, [isOpen, searchQuery]);

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    const cmd = filteredCommands[selectedIndex];
                    // Navegar para view se for comando de navegação
                    if (NAVIGATION_COMMANDS.find(nc => nc.id === cmd.id)) {
                        window.dispatchEvent(new CustomEvent('prana:navigate', { 
                            detail: { view: cmd.id } 
                        }));
                    }
                    onClose();
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
            default:
                break;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-xl bg-secondary/30 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="border-b border-white/10 p-3 bg-[#252526]">
                            <div className="flex items-center gap-2 px-3 py-2">
                                <IconSearch className="w-4 h-4 text-gray-500" />
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Procurar configurações..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-0 text-sm focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {filteredCommands.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    Nenhuma configuração encontrada
                                </div>
                            ) : (
                                filteredCommands.map((cmd, idx) => {
                                    const Icon = cmd.icon;
                                    const isSelected = idx === selectedIndex;
                                    return (
                                        <motion.div
                                            key={`${cmd.type}-${cmd.id}`}
                                            layout
                                            className={cn(
                                                'px-4 py-2 cursor-pointer transition-colors flex items-center gap-3 border-l-2',
                                                isSelected
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'border-transparent hover:bg-white/5'
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{cmd.label}</p>
                                                {cmd.parent && (
                                                    <p className="text-xs text-gray-500">{cmd.parent}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Help Footer */}
                        <div className="border-t border-white/10 bg-[#252526] px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                            <span>Use ↑↓ para navegar</span>
                            <span className="flex items-center gap-1">
                                Enter para confirmar
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Sidebar
const SettingsSidebar = ({ sections, activeSection, onSectionChange, onCommandPaletteOpen }) => {
    return (
        <div className="w-64 bg-secondary/30 border-r border-white/10 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                        <IconSettings className="w-4 h-4 text-primary" />
                    </div>
                    <h1 className="text-sm font-bold uppercase tracking-widest">Configurações</h1>
                </div>

                {/* Busca rápida / Paleta de comandos */}
                <button
                    onClick={onCommandPaletteOpen}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded bg-white/5 border border-white/10 hover:border-primary/30 transition-colors text-xs text-gray-500"
                >
                    <IconSearch className="w-3 h-3" />
                    <span>Buscar...</span>
                    <span className="ml-auto text-[10px] opacity-50">⌘K</span>
                </button>
            </div>

            {/* Seções */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {sections.map(section => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                        <div key={section.id}>
                            <motion.button
                                onClick={() => onSectionChange(section.id)}
                                className={cn(
                                    'w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 mb-1',
                                    isActive
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {section.name}
                            </motion.button>

                            {/* Subsections */}
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="ml-4 space-y-1"
                                >
                                    {section.subsections.map(sub => (
                                        <button
                                            key={sub.id}
                                            className="w-full text-left px-3 py-1.5 rounded text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                                        >
                                            • {sub.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer - Versão */}
            <div className="border-t border-white/10 p-3 text-xs text-gray-600">
                <p>Prana v3.0.0</p>
            </div>
        </div>
    );
};

// Main Layout Component
export default function VSCodeSettingsLayout({ children, activeSection = 'general', onSectionChange }) {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    // Atalho ⌘K para abrir paleta
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsPaletteOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-full bg-background text-foreground">
            {/* Sidebar */}
            <SettingsSidebar
                sections={SETTINGS_SECTIONS}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                onCommandPaletteOpen={() => {}}
            />

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar com breadcrumbs */}
                <div className="border-b border-white/10 px-6 py-3 bg-secondary/30 flex items-center gap-2 text-sm">
                    <IconSettings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Configurações</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-300 font-medium">
                        {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.name}
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
