/* src/config/moduleRegistry.js
   desc: Mapa central de Módulos de Workspace.
   updates: Correção do caminho de importação do TaskCodeWorkspace.
*/

// [CORREÇÃO] O caminho agora aponta para onde o arquivo realmente existe
import TaskCodeWorkspace from '@/components/specialists/dev-neo/TaskCodeWorkspace';
import React from 'react';

// Fallback simples se não houver módulo específico
const DefaultWorkspace = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 select-none">
        <p className="text-xs uppercase tracking-widest">Nenhum editor específico</p>
    </div>
);

export const MODULE_REGISTRY = {
    // Chave DEVE bater com 'workspace_module' do templates.js
    
    // O Editor de Código (Dev Task)
    'CODE_EDITOR': TaskCodeWorkspace,
    
    // O Construtor de Carrossel (Content Task) - Placeholder por enquanto
    'CAROUSEL_BUILDER': DefaultWorkspace, 
    
    // O Editor de Roteiro (Video Task) - Placeholder por enquanto
    'PAPYRUS_EDITOR': DefaultWorkspace,
    
    'DEFAULT': DefaultWorkspace
};

export const getModuleComponent = (moduleKey) => {
    return MODULE_REGISTRY[moduleKey] || MODULE_REGISTRY['DEFAULT'];
};