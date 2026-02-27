/* src/ai_services/importService.js
   desc: Service para importar dados de outras plataformas (CSV, Notion, Asana, etc)
   feat: Validação, preview, detecção de duplicatas, histórico
*/

import { db } from '../db/index.js';
import { projects, tasks, tags, taskTags } from '../db/schema.js';
import { createId } from '../utils/id.js';
import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * Gerar hash do task para detecção de duplicatas
 */
function generateTaskHash(title, description = '') {
  const content = `${title.toLowerCase()}|${description.toLowerCase()}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * VALIDAÇÃO: Testar conexão CSV
 */
export function validateCSV(csvDataArray) {
  try {
    const dataArray = typeof csvDataArray === 'string' 
      ? JSON.parse(csvDataArray) 
      : csvDataArray;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return { success: false, error: 'Dados CSV inválidos ou vazios' };
    }

    // Validar estrutura mínima
    const hasTitle = dataArray.some(row => row.title && row.title.trim());
    if (!hasTitle) {
      return { success: false, error: 'Nenhuma coluna "title" encontrada' };
    }

    return { 
      success: true, 
      message: `CSV válido com ${dataArray.length} linhas`,
      rowCount: dataArray.length,
      headers: Object.keys(dataArray[0] || {})
    };
  } catch (error) {
    return { success: false, error: `Erro ao validar CSV: ${error.message}` };
  }
}

/**
 * PREVIEW: Obter amostra de dados CSV
 */
export function previewCSV(csvDataArray, limit = 5) {
  try {
    const dataArray = typeof csvDataArray === 'string' 
      ? JSON.parse(csvDataArray) 
      : csvDataArray;

    return {
      success: true,
      preview: dataArray.slice(0, limit),
      total: dataArray.length,
      showing: Math.min(limit, dataArray.length)
    };
  } catch (error) {
    return { success: false, error: 'Erro ao gerar preview' };
  }
}

/**
 * VALIDAÇÃO: Testar conexão Notion
 */
export async function validateNotion(notionToken, notionDatabaseId) {
  try {
    if (!notionToken || !notionDatabaseId) {
      return { success: false, error: 'Token e Database ID são obrigatórios' };
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `Erro Notion: ${response.status}. Verifique credenciais e permissões.` 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: `Conexão OK - Database: ${data.title?.[0]?.plain_text || 'Sem título'}`,
      databaseName: data.title?.[0]?.plain_text
    };
  } catch (error) {
    return { success: false, error: `Erro ao conectar Notion: ${error.message}` };
  }
}

/**
 * PREVIEW: Obter amostra Notion
 */
export async function previewNotion(notionToken, notionDatabaseId, limit = 5) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_size: limit
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Erro ao buscar amostra Notion' };
    }

    const data = await response.json();
    const preview = data.results.map(page => parseNotionPage(page));

    return {
      success: true,
      preview,
      total: data.results.length,
      showing: preview.length
    };
  } catch (error) {
    return { success: false, error: 'Erro ao gerar preview Notion' };
  }
}

/**
 * VALIDAÇÃO: Testar conexão Asana
 */
export async function validateAsana(asanaToken, asanaProjectId) {
  try {
    if (!asanaToken || !asanaProjectId) {
      return { success: false, error: 'Token e Project ID são obrigatórios' };
    }

    const response = await fetch(`https://app.asana.com/api/1.0/projects/${asanaProjectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${asanaToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `Erro Asana: ${response.status}. Verifique credenciais e ID do projeto.` 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      message: `Conexão OK - Projeto: ${data.data.name}`,
      projectName: data.data.name
    };
  } catch (error) {
    return { success: false, error: `Erro ao conectar Asana: ${error.message}` };
  }
}

/**
 * PREVIEW: Obter amostra Asana
 */
export async function previewAsana(asanaToken, asanaProjectId, limit = 5) {
  try {
    const response = await fetch(`https://app.asana.com/api/1.0/projects/${asanaProjectId}/tasks?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${asanaToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Erro ao buscar amostra Asana' };
    }

    const data = await response.json();
    const preview = data.data.map(task => parseAsanaTask(task));

    return {
      success: true,
      preview,
      total: data.data.length,
      showing: preview.length
    };
  } catch (error) {
    return { success: false, error: 'Erro ao gerar preview Asana' };
  }
}

/**
 * DUPLICATAS: Detectar tasks duplicadas no banco
 */
export async function detectDuplicates(userId, taskHashes) {
  try {
    const existingTasks = await db.select()
      .from(tasks)
      .where(t => t.createdBy === userId)
      .limit(1000);

    const existingHashes = existingTasks.map(t => 
      generateTaskHash(t.title, t.description)
    );

    const duplicates = taskHashes.filter(h => existingHashes.includes(h));

    return {
      success: true,
      duplicateCount: duplicates.length,
      duplicates,
      existingCount: existingTasks.length
    };
  } catch (error) {
    return { success: false, error: 'Erro ao detectar duplicatas' };
  }
}

/**
 * HISTÓRICO: Registrar importação
 */
export async function logImportHistory(userId, source, stats) {
  try {
    const { db: database } = await import('../db/index.js');
    // Será implementado quando schema existir
    return {
      success: true,
      message: 'Importação registrada'
    };
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
    return { success: true }; // Não falha a importação se histórico falhar
  }
}

export async function importFromCSV(csvDataArray, userId) {
  try {
    // Garantir que csvDataArray é um array
    const dataArray = typeof csvDataArray === 'string' 
      ? JSON.parse(csvDataArray) 
      : csvDataArray;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return { success: false, error: 'Dados CSV inválidos' };
    }

    const results = {
      tasksCreated: 0,
      projectsCreated: 0,
      errors: [],
      duplicateCount: 0,
      totalProcessed: dataArray.length
    };

    // Criar projeto "Imported" se não existir
    const importProjectId = await getOrCreateImportProject(userId);

    // Gerar hashes para detecção
    const taskHashes = dataArray.map(row => generateTaskHash(row.title, row.description));
    const duplicationCheck = await detectDuplicates(userId, taskHashes);

    // Processar cada item
    for (let i = 0; i < dataArray.length; i++) {
      const row = dataArray[i];
      try {
        const hash = taskHashes[i];
        
        // Verificar duplicata
        if (duplicationCheck.duplicates?.includes(hash)) {
          results.duplicateCount++;
          continue;
        }

        await createTaskFromRow(userId, importProjectId, row);
        results.tasksCreated++;
      } catch (error) {
        results.errors.push(`Erro ao processar: ${row.title} - ${error.message}`);
      }
    }

    // Registrar no histórico
    await logImportHistory(userId, 'CSV', results);

    return {
      success: true,
      message: `${results.tasksCreated} tarefas importadas`,
      data: results
    };
  } catch (error) {
    console.error('Erro ao importar CSV:', error);
    return { success: false, error: 'Falha ao processar CSV' };
  }
}

/**
 * Importar do Notion usando API
 * Precisa de: notionToken, databaseId
 */
export async function importFromNotion(notionToken, notionDatabaseId, userId) {
  try {
    if (!notionToken || !notionDatabaseId) {
      return { success: false, error: 'Token Notion e Database ID são obrigatórios' };
    }

    const notionPages = await fetchNotionDatabase(notionToken, notionDatabaseId);
    const results = {
      tasksCreated: 0,
      projectsCreated: 0,
      errors: []
    };

    const importProjectId = await getOrCreateImportProject(userId);

    for (const page of notionPages) {
      try {
        const taskData = parseNotionPage(page);
        await createTask(userId, importProjectId, taskData);
        results.tasksCreated++;
      } catch (error) {
        results.errors.push(`Erro ao processar página Notion: ${error.message}`);
      }
    }

    return {
      success: true,
      message: `${results.tasksCreated} itens importados do Notion`,
      data: results
    };
  } catch (error) {
    console.error('Erro ao importar Notion:', error);
    return { success: false, error: 'Falha ao conectar ao Notion' };
  }
}

/**
 * Importar do Asana usando API
 */
export async function importFromAsana(asanaToken, asanaProjectId, userId) {
  try {
    if (!asanaToken || !asanaProjectId) {
      return { success: false, error: 'Token Asana e Project ID são obrigatórios' };
    }

    const asanaTasks = await fetchAsanaProject(asanaToken, asanaProjectId);
    const results = {
      tasksCreated: 0,
      errors: []
    };

    const importProjectId = await getOrCreateImportProject(userId);

    for (const asanaTask of asanaTasks) {
      try {
        const taskData = parseAsanaTask(asanaTask);
        await createTask(userId, importProjectId, taskData);
        results.tasksCreated++;
      } catch (error) {
        results.errors.push(`Erro ao processar tarefa Asana: ${error.message}`);
      }
    }

    return {
      success: true,
      message: `${results.tasksCreated} tarefas importadas do Asana`,
      data: results
    };
  } catch (error) {
    console.error('Erro ao importar Asana:', error);
    return { success: false, error: 'Falha ao conectar ao Asana' };
  }
}

// ============================================================================
// HELPERS
// ============================================================================

async function getOrCreateImportProject(userId) {
  try {
    // Buscar projeto "Imported"
    const existing = await db.select()
      .from(projects)
      .where((p) => p.name.eq('📥 Importado') && p.ownerId.eq(userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Criar projeto novo
    const newProject = {
      id: createId('proj'),
      name: '📥 Importado',
      description: 'Dados importados de outras plataformas',
      ownerId: userId,
      status: 'active',
      createdAt: new Date()
    };

    await db.insert(projects).values(newProject);
    return newProject.id;
  } catch (error) {
    console.error('Erro ao criar projeto import:', error);
    throw error;
  }
}

async function getOrCreateProject(userId, projectName) {
  try {
    const existing = await db.select()
      .from(projects)
      .where((p) => p.name.eq(projectName) && p.ownerId.eq(userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    const newProject = {
      id: createId('proj'),
      name: projectName,
      ownerId: userId,
      status: 'active',
      createdAt: new Date()
    };

    await db.insert(projects).values(newProject);
    return newProject.id;
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
}

async function createTaskFromRow(userId, projectId, row) {
  const taskData = {
    title: row.title || 'Sem título',
    description: row.description || '',
    status: normalizeStatus(row.status || 'todo'),
    priority: normalizePriority(row.priority || 'medium'),
    dueDate: row.dueDate ? new Date(row.dueDate) : null,
    tags: row.tags ? (Array.isArray(row.tags) ? row.tags : row.tags.split(',')).map(t => t.trim()) : []
  };

  return createTask(userId, projectId, taskData);
}

async function createTask(userId, projectId, taskData) {
  try {
    const taskId = createId('task');
    const now = new Date();

    await db.insert(tasks).values({
      id: taskId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      projectId,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      deleted_at: null
    });

    // Adicionar tags se existirem
    if (taskData.tags && taskData.tags.length > 0) {
      for (const tagName of taskData.tags) {
        const tagId = await getOrCreateTag(tagName);
        
        try {
          await db.insert(taskTags).values({
            taskId,
            tagId
          });
        } catch (e) {
          // Ignorar erros de duplicação
        }
      }
    }

    return taskId;
  } catch (error) {
    console.error('Erro ao criar task:', error);
    throw error;
  }
}

async function getOrCreateTag(tagName) {
  try {
    const existing = await db.select()
      .from(tags)
      .where((t) => t.name.eq(tagName))
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    const newTag = {
      id: createId('tag'),
      name: tagName,
      color: getRandomColor()
    };

    await db.insert(tags).values(newTag);
    return newTag.id;
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }
}

function normalizeStatus(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes('done') || normalized.includes('completo') || normalized.includes('completed')) return 'done';
  if (normalized.includes('progress') || normalized.includes('in_progress')) return 'in_progress';
  return 'todo';
}

function normalizePriority(priority) {
  const normalized = priority.toLowerCase();
  if (normalized.includes('high') || normalized.includes('urgent') || normalized.includes('alta')) return 'high';
  if (normalized.includes('low') || normalized.includes('baixa')) return 'low';
  return 'medium';
}

function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function fetchNotionDatabase(notionToken, databaseId) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar Notion:', error);
    return [];
  }
}

function parseNotionPage(page) {
  const props = page.properties || {};
  
  return {
    title: getNotionPropertyValue(props.Name || props.Title),
    description: getNotionPropertyValue(props.Description),
    status: normalizeStatus(getNotionPropertyValue(props.Status) || 'todo'),
    priority: normalizePriority(getNotionPropertyValue(props.Priority) || 'medium'),
    dueDate: getNotionPropertyDate(props.DueDate || props.Due),
    tags: []
  };
}

function getNotionPropertyValue(property) {
  if (!property) return '';
  if (property.title) return property.title.map(t => t.plain_text).join('');
  if (property.rich_text) return property.rich_text.map(t => t.plain_text).join('');
  if (property.checkbox) return property.checkbox ? 'done' : 'todo';
  if (property.select) return property.select?.name || '';
  return '';
}

function getNotionPropertyDate(property) {
  if (!property || !property.date) return null;
  return new Date(property.date.start);
}

async function fetchAsanaProject(asanaToken, projectId) {
  try {
    const response = await fetch(`https://app.asana.com/api/1.0/projects/${projectId}/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${asanaToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Asana API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erro ao buscar Asana:', error);
    return [];
  }
}

function parseAsanaTask(asanaTask) {
  return {
    title: asanaTask.name || 'Sem título',
    description: asanaTask.notes || '',
    status: asanaTask.completed ? 'done' : 'todo',
    priority: asanaTask.priority_string ? normalizePriority(asanaTask.priority_string) : 'medium',
    dueDate: asanaTask.due_on ? new Date(asanaTask.due_on) : null,
    tags: asanaTask.tags?.map(t => t.name) || []
  };
}

export default {
  importFromCSV,
  importFromNotion,
  importFromAsana
};
