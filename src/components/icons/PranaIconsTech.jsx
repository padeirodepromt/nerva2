/**
 * PranaIconsTech.jsx
 * * ARQUIVO DE MAPEAMENTO LEGADO (Ritual 7: Compatibilidade)
 * *
 * * *** ATUALIZAÇÃO (Check-in de Consciência) ***
 * * PROBLEMA: Componentes antigos (ChatGeneralView, Layout, etc.) tentam
 * * importar ícones utilitários (Minimize, OpenHub) e de navegação diretamente
 * * deste arquivo, causando a avalanche de erros 'No matching export'.
 * *
 * * SOLUÇÃO: Mapear *todos* os nomes procurados para os componentes Lucide
 * * ou para o novo estilo de IconWrapper. Este arquivo agora é um Dicionário de
 * * Compatibilidade que atende a todos os imports legados.
 */

import React from 'react';
import {
    LayoutDashboard, MessageSquare, Target, Clock, Zap, Cpu, Folder, Users, Grid, List, Settings, TrendingUp, Sun, Minimize2, Maximize2, ExternalLink, BrainCircuit
} from '@/components/icons/PranaLandscapeIcons';

// Função base de estilo para envolver os ícones Lucide
const IconWrapper = ({ children, active, className }) => (
    <div
        className={`prana-icon-hero transition-all duration-300 ${active ? 'text-accent' : 'text-muted-foreground'} ${className}`}
        style={{ color: active ? 'var(--accent)' : 'var(--text-secondary-color)' }}
    >
        {children}
    </div>
);

// --- ÍCONES EXPORTADOS PARA COMPATIBILIDADE ---
// Estes são os nomes que o Vite estava reclamando em CADA ARQUIVO .jsx

export const IconMinimize = (props) => <IconWrapper {...props}><Minimize2 /></IconWrapper>;
export const IconExpand = (props) => <IconWrapper {...props}><Maximize2 /></IconWrapper>;
export const IconOpenHub = (props) => <IconWrapper {...props}><ExternalLink /></IconWrapper>;
export const IconBrain = (props) => <IconWrapper {...props}><BrainCircuit /></IconWrapper>;

// Ícones de Navegação (Mapeados para compatibilidade com Layout.jsx)
export const IconDashboard = (props) => <IconWrapper {...props}><LayoutDashboard /></IconWrapper>;
export const IconChat = (props) => <IconWrapper {...props}><MessageSquare /></IconWrapper>;
export const IconSankalpa = (props) => <IconWrapper {...props}><Target /></IconWrapper>;
export const IconCronos = (props) => <IconWrapper {...props}><Clock /></IconWrapper>;
export const IconCosmos = (props) => <IconWrapper {...props}><Sun /></IconWrapper>;
export const IconNexus = (props) => <IconWrapper {...props}><Zap /></IconWrapper>;
export const IconDiario = (props) => <IconWrapper {...props}><List /></IconWrapper>;
export const IconPapyrus = (props) => <IconWrapper {...props}><Folder /></IconWrapper>;
export const IconNeural = (props) => <IconWrapper {...props}><Cpu /></IconWrapper>;
export const IconColetivo = (props) => <IconWrapper {...props}><Users /></IconWrapper>;
export const IconMatrix = (props) => <IconWrapper {...props}><Grid /></IconWrapper>;
export const IconFlux = (props) => <IconWrapper {...props}><TrendingUp /></IconWrapper>;
export const IconSettings = (props) => <IconWrapper {...props}><Settings /></IconWrapper>;
export const IconLogoMark = (props) => <IconWrapper {...props}><Zap /></IconWrapper>;
// Exportação adicional para resolver imports que podem usar o nome do componente
// export default IconWrapper;