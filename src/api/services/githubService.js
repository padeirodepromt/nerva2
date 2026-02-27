/**
 * src/api/services/githubService.js
 * Serviço unificado para interação com a API do GitHub.
 * Suporta: Code Push (Agente de Coding) e Project Management (Agente de Planejamento).
 */

const GITHUB_API_BASE = 'https://api.github.com';

// ============================================================================
// HELPERS
// ============================================================================

async function fetchGitHub(url, token, options = {}) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`GitHub API Error [${response.status}]: ${errorBody.message || response.statusText}`);
  }
  
  return response.json();
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * 1. Garante que um repositório existe (cria se não existir)
 */
export async function ensureRepoExists(token, repoName) {
  try {
    // Tenta obter o usuário atual para saber o dono
    const user = await getGitHubUser(token);
    const owner = user.login;

    // Verifica se já existe
    try {
      return await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repoName}`, token);
    } catch (e) {
      if (!e.message.includes('404')) throw e;
    }

    // Se deu 404, cria
    return await fetchGitHub(`${GITHUB_API_BASE}/user/repos`, token, {
      method: 'POST',
      body: JSON.stringify({
        name: repoName,
        description: `Prana Project: ${repoName} (Created by Ash)`,
        private: true,
        auto_init: true, // Importante para criar o branch main inicial
      })
    });
  } catch (error) {
    console.error('ensureRepoExists error:', error);
    throw error;
  }
}

/**
 * 2. Faz Push de arquivos (Commit direto)
 * Usado pelo Agente de Código para salvar trabalho.
 */
export async function pushToGitHub(token, owner, repo, files, branch = 'main') {
  try {
    // A) Pega referência do branch (latest commit SHA)
    const refData = await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`, token);
    const latestCommitSha = refData.object.sha;

    // B) Pega a árvore base
    const commitData = await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, token);
    const baseTreeSha = commitData.tree.sha;

    // C) Cria nova árvore com os arquivos
    const treeItems = files.map(file => ({
      path: file.name,
      mode: '100644', // blob file
      type: 'blob',
      content: file.content
    }));

    const newTreeData = await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`, token, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    });

    // D) Cria o Commit
    const newCommitData = await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`, token, {
      method: 'POST',
      body: JSON.stringify({
        message: `Ash Update: ${new Date().toISOString()}`,
        tree: newTreeData.sha,
        parents: [latestCommitSha]
      })
    });

    // E) Atualiza a referência (Git Push efetivo)
    await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ sha: newCommitData.sha })
    });

    return {
      success: true,
      commitSha: newCommitData.sha,
      message: `Pushed ${files.length} files to ${owner}/${repo}`
    };
  } catch (error) {
    console.error('pushToGitHub error:', error);
    throw error;
  }
}

/**
 * 3. Cria uma Issue (Tarefas do Prana -> GitHub)
 * NOVO: Requisitado para integração de gerenciamento.
 */
export async function createIssue(token, owner, repo, issueData) {
  try {
    const payload = {
      title: issueData.title,
      body: issueData.body || "Created via Prana OS",
      labels: issueData.labels || ['prana-task']
    };

    if (issueData.assignees) payload.assignees = issueData.assignees;

    return await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`, token, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('createIssue error:', error);
    throw error;
  }
}

/**
 * 4. Obtém atividade do usuário (Diário de Bordo Automático)
 * NOVO: Busca eventos do dia para popular o Logbook.
 */
export async function getUserActivity(token, dateFilterISO) {
  try {
    const user = await getGitHubUser(token);
    const username = user.login;
    
    // Busca eventos (limite de 30 é padrão, pode aumentar per page se precisar)
    const events = await fetchGitHub(`${GITHUB_API_BASE}/users/${username}/events?per_page=50`, token);
    
    const filterDate = new Date(dateFilterISO);
    filterDate.setHours(0,0,0,0);

    // Filtra e formata para o Ash entender fácil
    const activity = events
      .filter(ev => {
        const evDate = new Date(ev.created_at);
        return evDate >= filterDate; // Eventos de hoje/data especificada em diante
      })
      .map(ev => {
        let message = '';
        if (ev.type === 'PushEvent') {
          message = `Pushed ${ev.payload.size} commits: ${ev.payload.commits[0]?.message}`;
        } else if (ev.type === 'PullRequestEvent') {
          message = `PR ${ev.payload.action}: ${ev.payload.pull_request.title}`;
        } else if (ev.type === 'IssuesEvent') {
          message = `Issue ${ev.payload.action}: ${ev.payload.issue.title}`;
        } else {
          message = ev.type;
        }

        return {
          type: ev.type,
          repo: ev.repo.name,
          date: ev.created_at,
          message: message
        };
      });

    return activity;
  } catch (error) {
    console.error('getUserActivity error:', error);
    return []; // Retorna vazio em vez de explodir, para não travar o diário
  }
}

/**
 * 5. Utilitários Básicos
 */
export async function getGitHubUser(token) {
  return await fetchGitHub(`${GITHUB_API_BASE}/user`, token);
}

export async function validateGitHubToken(token) {
  try {
    await getGitHubUser(token);
    return true;
  } catch (e) {
    return false;
  }
}

// Export default agrupado para facilitar importação se preferir
export const githubService = {
  ensureRepoExists,
  pushToGitHub,
  createIssue,
  getUserActivity,
  getGitHubUser,
  validateGitHubToken
};