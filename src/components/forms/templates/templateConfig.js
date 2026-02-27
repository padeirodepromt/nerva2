/* src/components/forms/templates/templateConfig.js
   desc: Configuração Mestre de Arquétipos V7.
   updates: 
     - Dev: Atualizado para fluxo 'Feature-First' (Focus Mode + Domains).
     - Content/Business: Restaurados para manter integridade do sistema.
*/

import { 
    // Tech Icons
    IconCode, IconServer, IconBug, IconDiff, IconLink, IconGitBranch,
    // Content Icons
    IconVideo, IconLayers, IconImage, 
    // Business Icons
    IconTarget, IconBriefcase, IconDollarSign, IconFileText,
    // General Icons
    IconZap, IconClock, IconMapPin
} from '@/components/icons/PranaLandscapeIcons';

// ============================================================================
// 1. PROJECT TEMPLATES (O AMBIENTE)
// Definem as variáveis globais que as tarefas podem herdar/consultar.
// ============================================================================

export const PROJECT_TEMPLATES = {
    // --- 1. DEV / ARQUITETO (Nosso Foco Atual) ---
    'software_system': {
        id: 'software_system',
        label: 'Sistema de Software',
        icon: IconCode,
        defaultTaskTemplate: 'dev_feature',
        variablesSchema: [
            { key: 'techStack', label: 'Tech Stack', type: 'text', placeholder: 'Ex: React, Node' },
            { key: 'repoUrl', label: 'Repositório', type: 'url' }
        ]
    },

    // --- 2. PRODUTOR DE CONTEÚDO ---
    'content_machine': {
        id: 'content_machine',
        label: 'Máquina de Conteúdo',
        icon: IconVideo,
        defaultTaskTemplate: 'content_post',
        variablesSchema: [
            { key: 'platform', label: 'Plataforma', type: 'select', options: ['Instagram', 'YouTube', 'LinkedIn', 'Blog'] },
            { key: 'editoria', label: 'Editoria / Nicho', type: 'text' }
        ]
    },

    // --- 3. EMPREENDEDOR / BUSINESS ---
    'business_startup': {
        id: 'business_startup',
        label: 'Gestão de Negócio',
        icon: IconTarget,
        defaultTaskTemplate: 'default',
        variablesSchema: [
            { key: 'quarter_goal', label: 'Meta do Trimestre', type: 'text' },
            { key: 'budget_status', label: 'Status Orçamento', type: 'select', options: ['Aprovado', 'Pendente', 'Estourado'] }
        ]
    },

    // --- 4. FREELANCER / SERVIÇO ---
    'client_project': {
        id: 'client_project',
        label: 'Projeto de Cliente',
        icon: IconBriefcase,
        defaultTaskTemplate: 'default',
        variablesSchema: [
            { key: 'client_name', label: 'Cliente', type: 'text' },
            { key: 'deadline', label: 'Prazo Final', type: 'date' }
        ]
    }
};

// ============================================================================
// 2. TASK TEMPLATES (AS FERRAMENTAS)
// Definem a interface (ViewMode), o Módulo e os Campos Específicos.
// ============================================================================

export const TASK_TEMPLATES = {
    
    // --- DEV: FEATURE / CODE (Validado) ---
    'dev_feature': {
        id: 'dev_feature',
        label: 'Funcionalidade / Código',
        icon: IconCode,
        viewMode: 'focus', // Foco Total (Craft)
        workspace_module: 'CODE_EDITOR', 
        
        default_checklist: [
            "Análise: Ler arquivos atuais",
            "Diagnóstico: Explicar o plano",
            "Execução: Gerar código",
            "Auditoria: Validar alterações"
        ],

        // Schema "Prana Self-Dev"
        schema: [
            { 
                key: 'target_path', 
                label: 'Arquivo / Caminho Alvo', 
                type: 'text', 
                icon: IconFileText,
                placeholder: 'ex: src/views/KanbanView.jsx' 
            },
            { 
                key: 'domain', 
                label: 'Camada / Domínio', 
                type: 'select', 
                icon: IconLayers,
                options: ['Frontend (UI)', 'Backend (API)', 'Database (Schema)', 'AI / Logic', 'Styles / CSS']
            },
            { 
                key: 'action_type', 
                label: 'Tipo de Ação', 
                type: 'select', 
                icon: IconZap,
                options: ['Nova Feature', 'Refatoração', 'Bugfix', 'Configuração'] 
            }
        ]
    },

    // --- CONTENT: POST / MEDIA (Action Mode) ---
    'content_post': {
        id: 'content_post',
        label: 'Post / Conteúdo',
        icon: IconImage,
        viewMode: 'split', // Ver dados + Preview
        workspace_module: 'CAROUSEL_BUILDER', 
        
        default_checklist: ["Ideia Central", "Roteiro/Copy", "Design", "Agendar"],
        
        schema: [
            { key: 'format', label: 'Formato', type: 'select', options: ['Carrossel', 'Reels', 'Stories', 'Artigo'] },
            { key: 'post_date', label: 'Data Publicação', type: 'date', icon: IconClock },
            { key: 'midia_link', label: 'Link da Arte/Vídeo', type: 'url', icon: IconLink }
        ]
    },

    // --- DEFAULT (Fallback Seguro) ---
    'default': {
        id: 'default',
        label: 'Tarefa Simples',
        icon: IconTarget,
        viewMode: 'split',
        workspace_module: 'DEFAULT',
        schema: [] // Sem campos extras, apenas Título/Descrição
    }
};

// --- DETECÇÃO INTELIGENTE ---
export const detectTaskTemplate = (task) => {
    if (!task) return TASK_TEMPLATES['default'];
    
    // 1. Prioridade para ID explícito
    if (task.templateId && TASK_TEMPLATES[task.templateId]) {
        return TASK_TEMPLATES[task.templateId];
    }
    
    // 2. Inferência por Texto (Título)
    const text = (task.title || '').toLowerCase();
    
    // Dev Keywords
    if (text.includes('feat') || text.includes('api') || text.includes('component') || 
        text.includes('fix') || text.includes('bug') || text.includes('refactor') ||
        text.includes('src/')) {
        return TASK_TEMPLATES['dev_feature'];
    }

    // Content Keywords
    if (text.includes('post') || text.includes('video') || text.includes('carrossel') || 
        text.includes('instagram') || text.includes('youtube')) {
        return TASK_TEMPLATES['content_post'];
    }

    return TASK_TEMPLATES['default'];
};