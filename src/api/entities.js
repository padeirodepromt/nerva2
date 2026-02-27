/* src/api/entities.js
   desc: Mapeamento central das entidades e conexão com a IA (Ash).
   feat: Arquitetura V10 (Neural OS Sync).
   fix: Consolidação total, remoção de duplicidades e fiação de promoção para Checklists.
*/
import apiClient from './apiClient'; 

// Helper para desembrulhar a resposta do Axios
const unwrap = (response) => response.data;

// Função auxiliar para criar URLs de página
export const createPageUrl = (pageName) => '/' + pageName.toLowerCase().replace(/ /g, '-');

// ============================================================================
// CLASSE BASE (CRUD PADRÃO)
// ============================================================================
export class BaseEntity {
  static resource = ''; 

  static async get(id) {
    const response = await apiClient.get(`/${this.resource}/${id}`);
    return unwrap(response);
  }

  static async filter(params = {}) {
    const response = await apiClient.get(`/${this.resource}`, { params });
    return unwrap(response);
  }

  static async list(params = {}) {
     const response = await apiClient.get(`/${this.resource}`, { params });
     return unwrap(response);
  }

  static async create(data) {
    const response = await apiClient.post(`/${this.resource}`, data);
    return unwrap(response);
  }

  static async update(id, data) {
    const response = await apiClient.put(`/${this.resource}/${id}`, data);
    return unwrap(response);
  }

  static async delete(id) {
    const response = await apiClient.delete(`/${this.resource}/${id}`);
    return unwrap(response);
  }
}

// ============================================================================
// AUTH & USER
// ============================================================================
export class User extends BaseEntity {
  static resource = 'users';

  static async me() {
    try {
      const token = localStorage.getItem('prana_auth_token');
      if (!token) return null;
      const response = await apiClient.get(`/users/me`);
      return unwrap(response);
    } catch (error) {
      console.warn("Sessão inválida ou expirada.");
      localStorage.removeItem('prana_auth_token');
      return null;
    }
  }
  
  static logout() {
    localStorage.removeItem('prana_auth_token');
  }

  static async login(data) {
    const response = await apiClient.post(`/login`, data);
    if (response.data.token) {
        localStorage.setItem('prana_auth_token', response.data.token);
    }
    return response.data.user;
  }

  static async register(data) {
    const response = await apiClient.post(`/register`, data);
    if (response.data.token) {
        localStorage.setItem('prana_auth_token', response.data.token);
    }
    return response.data.user;
  }
}

// ============================================================================
// EVENTS
export const Event = {
    list: (params) => fetchApi('/events', { params }),
    create: (data) => fetchApi('/events', { method: 'POST', body: data }),
    update: (id, data) => fetchApi(`/events/${id}`, { method: 'PUT', body: data }),
    delete: (id) => fetchApi(`/events/${id}`, { method: 'DELETE' }),
};

// ============================================================================
// CORE SYSTEM (Estrutura Neural V10)
// ============================================================================

export class Realm extends BaseEntity { 
    static resource = 'realms'; 
}

export class Project extends BaseEntity { 
    static resource = 'projects'; 

    static async getTree() {
        return this.list({ status: 'active' });
    }

    static async updateSchema(id, fields_schema) {
        return this.update(id, { fields_schema });
    }
}

export class Task extends BaseEntity { 
    static resource = 'tasks'; 

    static async update(id, data) {
        const response = await apiClient.put(`/${this.resource}/${id}`, data);
        const updatedTask = unwrap(response);

        if (data.status === 'done') {
            let detail = { color: updatedTask.priority === 'high' ? '#f87171' : '#34d399' };
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('prana:task-completed', { detail }));
            }
        }
        return updatedTask;
    }
    
    static async updateProperties(id, properties) {
        return this.update(id, { properties });
    }

    static async reorder(data) {
        const response = await apiClient.post(`/${this.resource}/reorder`, data);
        return unwrap(response);
    }
}

// [V10] CHECKLIST: Itens atômicos da Inbox
export class Checklist extends BaseEntity {
  static resource = 'checklists';

  // Transmutação: Promover pensamento em ação real no banco
  static async promoteToTask(id, project_id = null) {
    const response = await apiClient.post(`/${this.resource}/${id}/promote`, { project_id });
    return unwrap(response);
  }
}

export class Template extends BaseEntity { static resource = 'templates'; }
export class Team extends BaseEntity { static resource = 'teams'; }

export class Tag extends BaseEntity { 
    static resource = 'tags'; 
    static async suggest(query) {
        const res = await apiClient.get(`/tags/suggest?q=${query}`);
        return res.data;
    }
}

// ============================================================================
// DATA ENGINE V8 (Records & Sheets)
// ============================================================================

export class Sheet extends BaseEntity { 
    static resource = 'sheets'; 
}

export class Record extends BaseEntity {
    static resource = 'records';

    static async list(projectId) {
        if (typeof projectId === 'string') {
            const response = await apiClient.get(`/records/project/${projectId}`);
            return unwrap(response);
        }
        return super.list(projectId);
    }

    static async updateProperties(id, properties) {
        return this.update(id, { properties });
    }

    static async convertToTask(recordId, taskData) {
        const response = await apiClient.post('/associations/create-task-from-record', {
            recordId,
            ...taskData
        });
        return unwrap(response);
    }
}

export class ProjectView extends BaseEntity {
    static resource = 'views'; 
    
    static async listByProject(projectId) {
        const response = await apiClient.get(`/projects/${projectId}/views`);
        return unwrap(response);
    }
    
    static async getByType(projectId, type) {
        const response = await apiClient.get(`/projects/${projectId}/views/${type}`);
        return unwrap(response);
    }
}



// ============================================================================
// ASH INTELLIGENCE (IA)
// ============================================================================
export class Ash extends BaseEntity {
    static resource = 'ash'; 

    static async getDailyInsight(stats) {
        const response = await apiClient.post(`/${this.resource}/insight`, {
            context: 'daily_summary',
            data: stats,
            tone: 'wabi-sabi' 
        });
        return unwrap(response);
    }

    static async chat(message, history) {
        const response = await apiClient.post(`/${this.resource}/chat`, { message, history });
        return unwrap(response);
    }
}

// ============================================================================
// PLANNING & TIME (Ciclos de Execução)
// ============================================================================
export class TimeSession extends BaseEntity { static resource = 'time_sessions'; }
export class Sankalpa extends BaseEntity { static resource = 'sankalpas'; }
export class WeeklyTask extends BaseEntity { static resource = 'weekly-tasks'; }
export class PlanningNote extends BaseEntity { static resource = 'planning-notes'; }
export class PlannerItem extends BaseEntity { static resource = 'planner-items'; }

// --- O TEMPO (RITUAIS) ---
export const Routine = {
    list: (params) => fetchApi('/routines', { params }),
    create: (data) => fetchApi('/routines', { method: 'POST', body: data }),
    update: (id, data) => fetchApi(`/routines/${id}`, { method: 'PUT', body: data }),
    delete: (id) => fetchApi(`/routines/${id}`, { method: 'DELETE' }),
    }

// ============================================================================
// KNOWLEDGE & ARTIFACTS (Capture & Fluxo)
// ============================================================================
export class Note extends BaseEntity { static resource = 'notes'; }
export class Agreement extends BaseEntity { static resource = 'agreements'; }
export class UserProfile extends BaseEntity { static resource = 'user-profiles'; }
export class WorkSession extends BaseEntity { static resource = 'work-sessions'; }
export class EnergyState extends BaseEntity { static resource = 'energy-states'; }

export class Document extends BaseEntity { static resource = 'documents'; } 
export class MindMap extends BaseEntity { static resource = 'mind-maps'; } 
export class MindMapNode extends BaseEntity { static resource = 'mindmap-nodes'; } 
export class Thought extends BaseEntity { static resource = 'thoughts'; } 

// ============================================================================
// COLLAB & SOCIAL
// ============================================================================
export class Conversation extends BaseEntity { static resource = 'nexus'; }
export class Message extends BaseEntity { static resource = 'messages'; }

export class Collab {
  static async getMessages(params) {
      const response = await apiClient.get('/messages', { params });
      return response.data;
  }
  static async sendMessage(data) {
      const response = await apiClient.post('/messages', data);
      return response.data;
  }
  static async getTeamMembers(teamId) {
      const response = await apiClient.get(`/teams/${teamId}/members`);
      return response.data;
  }
  static async inviteMember(teamId, email) {
      const response = await apiClient.post(`/teams/${teamId}/invite`, { email });
      return response.data;
  }
}

// ============================================================================
// ECOSYSTEM & LEGACY
// ============================================================================
export class Astral extends BaseEntity { 
    static resource = 'astral'; 
    static async getToday() {
        try {
            const response = await apiClient.get(`/${this.resource}/today`);
            return unwrap(response);
        } catch (e) {
            console.warn("Astral offline, usando fallback.");
            return { summary: "Energia neutra.", moon_sign: "Áries", advice: "Foque na ação." };
        }
    }
}

export class Integration extends BaseEntity {
    static resource = 'integrations';
    static async getStatus() {
        const response = await apiClient.get(`/${this.resource}/status`);
        return unwrap(response);
    }
    static async connect(provider) {
        const response = await apiClient.post(`/${this.resource}/connect`, { provider });
        return unwrap(response); 
    }
    static async disconnect(provider) {
        const response = await apiClient.post(`/${this.resource}/disconnect`, { provider });
        return unwrap(response);
    }
}

export class MenuConfig extends BaseEntity { static resource = 'menu-configs'; }
export class MenstrualCycle extends BaseEntity { 
    static resource = 'menstrual-cycles';
    static async getLatest() {
        const response = await apiClient.get(`/${this.resource}/latest`);
        return unwrap(response);
    }
}