// scripts/seedTemplates.js
// O DNA PROFISSIONAL DO PRANA

import { db } from '../src/db/index.js';
import { templates } from '../src/db/schema/core.js';
import { createId } from '../src/utils/id.js';

const REAL_ARCHETYPES = [
  // ========================================================================
  // 1. O PRODUTOR DE CONTEÚDO (A Esteira Criativa)
  // ========================================================================
  {
    name: 'Esteira de Conteúdo (Projeto)',
    type: 'project',
    description: 'Estrutura para gerenciar frequência e consistência de mídia.',
    structure: [
      // Estas serão as COLUNAS na Matrix
      { key: 'platform', label: 'Plataforma', type: 'select', options: ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Blog'] },
      { key: 'format', label: 'Formato', type: 'select', options: ['Reels/Shorts', 'Carrossel', 'Post Estático', 'Artigo', 'Story'] },
      { key: 'editor_status', label: 'Status da Edição', type: 'select', options: ['Não Iniciado', 'Com Editor', 'Em Revisão', 'Aprovado'] },
      { key: 'media_link', label: 'Link da Pasta (Drive)', type: 'text' }, // Texto simples para URL
      { key: 'publish_date', label: 'Data Publicação', type: 'date' }
    ]
  },
  {
    name: 'Vídeo Curto / Reels (Tarefa)',
    type: 'task',
    description: 'Preset para criação de vídeos verticais.',
    // O Ash usa isso para preencher a tarefa dentro da Esteira
    structure: {
      // Valores Padrão para as Colunas do Projeto
      default_values: {
        format: 'Reels/Shorts',
        editor_status: 'Não Iniciado'
      },
      // O Processo Interno (Checklist)
      checklist: [
        "Escrever Gancho (3s)",
        "Desenvolver Roteiro",
        "Gravar Takes (A-Roll)",
        "Gravar Cobertura (B-Roll)",
        "Enviar para Edição",
        "Aprovar Capa/Thumb",
        "Agendar"
      ],
      // O Esqueleto do Roteiro (vai para o Papyrus/Descrição)
      default_content: `<h3>Roteiro de Vídeo</h3><p><strong>Gancho:</strong> ...</p><p><strong>Conteúdo:</strong> ...</p><p><strong>CTA:</strong> ...</p>`
    }
  },
  {
    name: 'Carrossel Educativo (Tarefa)',
    type: 'task',
    description: 'Preset para conteúdo visual deslizável.',
    structure: {
      default_values: {
        format: 'Carrossel',
        platform: 'Instagram'
      },
      checklist: [
        "Definir Tópicos (5-7 slides)",
        "Escrever Legendas dos Slides",
        "Briefing para Design",
        "Revisar Ortografia",
        "Exportar Imagens"
      ],
      default_content: `<h3>Estrutura do Carrossel</h3><ul><li>Capa: [Título Atrativo]</li><li>Slide 1: ...</li><li>Slide 2: ...</li><li>Slide Final: [CTA]</li></ul>`
    }
  },

  // ========================================================================
  // 2. O DESENVOLVEDOR DE SOFTWARE (O Ciclo de Release)
  // ========================================================================
  {
    name: 'Desenvolvimento de Software (Projeto)',
    type: 'project',
    description: 'Ciclo de vida de features e produtos digitais.',
    structure: [
      { key: 'sprint', label: 'Sprint', type: 'select', options: ['Backlog', 'Sprint Atual', 'Próxima Sprint'] },
      { key: 'complexity', label: 'Complexidade (Fib)', type: 'select', options: ['1', '2', '3', '5', '8', '13', '21'] },
      { key: 'environment', label: 'Ambiente', type: 'select', options: ['Dev', 'Staging', 'Prod'] },
      { key: 'branch', label: 'Git Branch', type: 'text' },
      { key: 'pr_link', label: 'Link do PR', type: 'text' }
    ]
  },
  {
    name: 'Nova Feature (Tarefa)',
    type: 'task',
    description: 'Implementação de funcionalidade.',
    structure: {
      default_values: {
        environment: 'Dev'
      },
      checklist: [
        "Análise de Requisitos",
        "Implementação",
        "Testes Unitários",
        "Code Review",
        "Merge para Staging"
      ]
    }
  },
  {
    name: 'Bug Fix (Tarefa)',
    type: 'task',
    description: 'Correção de erro.',
    structure: {
      default_values: {
        complexity: '1'
      },
      default_content: `<h3>Relatório de Bug</h3><p><strong>Passos para reproduzir:</strong></p><ol><li>...</li></ol><p><strong>Comportamento Esperado:</strong> ...</p><p><strong>Comportamento Atual:</strong> ...</p>`,
      checklist: [
        "Reproduzir erro localmente",
        "Identificar causa raiz",
        "Aplicar fix",
        "Verificar regressão"
      ]
    }
  },

  // ========================================================================
  // 3. O ADVOGADO (Gestão Processual)
  // ========================================================================
  {
    name: 'Caso Jurídico (Projeto)',
    type: 'project',
    description: 'Acompanhamento de processo judicial.',
    structure: [
      { key: 'process_number', label: 'Nº Processo', type: 'text' },
      { key: 'court', label: 'Tribunal/Vara', type: 'text' },
      { key: 'phase', label: 'Fase Processual', type: 'select', options: ['Inicial', 'Instrução', 'Sentença', 'Recurso', 'Execução'] },
      { key: 'next_deadline', label: 'Prazo Fatal', type: 'date' },
      { key: 'client_status', label: 'Status Cliente', type: 'select', options: ['Aguardando Docs', 'Informado', 'Reunião Necessária'] }
    ]
  },
  {
    name: 'Petição de Prazo (Tarefa)',
    type: 'task',
    description: 'Redação e protocolo de peça jurídica.',
    structure: {
      checklist: [
        "Analisar Publicação",
        "Coletar Jurisprudência",
        "Redigir Peça",
        "Revisão Final",
        "Protocolar no PJe",
        "Salvar Recibo"
      ],
      default_content: `<h3>Estrutura da Peça</h3><p><strong>Tese Principal:</strong> ...</p><p><strong>Pedidos:</strong> ...</p>`
    }
  }
];

async function seed() {
  console.log('🔮 Invocando Arquétipos Profissionais...');
  
  try {
    // Limpa templates antigos para evitar duplicação no dev
    // await db.delete(templates); // Opcional: descomente se quiser limpar tudo antes

    for (const tmpl of REAL_ARCHETYPES) {
      await db.insert(templates).values({
        id: createId('tmpl'),
        name: tmpl.name,
        description: tmpl.description,
        type: tmpl.type,
        structure: tmpl.structure, // O Drizzle salva o JSON complexo aqui
        createdBy: 'system_genesis',
        createdAt: new Date()
      });
      console.log(`✅ Arquétipo Criado: ${tmpl.name}`);
    }
    console.log('✨ A Matriz de Conhecimento está ativa.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na invocação:', error);
    process.exit(1);
  }
}

seed();