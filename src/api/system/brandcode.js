/* src/api/system/brandcode.js
   desc: Brand Code System Client V2
   feat:
     - enable/start/get/update
     - saveFoundationAnswers
     - applyDraftToProject (injeta consent automaticamente)
*/

const BASE = '/api/system/brandcode';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    const message = data?.error || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data?.data ?? data;
}

export const BrandCodeSystem = {
  // --------------------------------------------------
  // GET STATE
  // --------------------------------------------------
  async getProjectState(projectId) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}`, { method: 'GET' });
  },

  // --------------------------------------------------
  // ENABLE
  // --------------------------------------------------
  async enableForProject(projectId) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}/enable`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },

  // --------------------------------------------------
  // START PROTOCOL
  // --------------------------------------------------
  async startForProject(projectId) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}/start`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },

  // --------------------------------------------------
  // SAVE FOUNDATION ANSWERS
  // --------------------------------------------------
  async saveFoundationAnswers(projectId, answers = []) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}/foundation`, {
      method: 'POST',
      body: JSON.stringify({
        answers: Array.isArray(answers) ? answers : []
      })
    });
  },

  // --------------------------------------------------
  // UPDATE GENERIC (sem consent automático)
  // --------------------------------------------------
  async updateProjectBrandCode(projectId, patch = {}) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch || {})
    });
  },

  // --------------------------------------------------
  // APPLY DRAFT (ato explícito do usuário)
  // Injeta consent automaticamente.
  // --------------------------------------------------
  async applyDraftToProject(projectId, draft = {}) {
    if (!projectId) throw new Error('projectId is required');
    if (!draft?.dna || typeof draft.dna !== 'object') {
      throw new Error('draft.dna is required');
    }

    const payload = {
      consent: true, // 🔒 exigido pelo backend
      dna: draft.dna,
      summary:
        typeof draft.summary === 'string'
          ? draft.summary
          : (draft.summary ?? null),
      status: draft.status || 'active',
      confidenceScore:
        Number.isInteger(draft.confidenceScore)
          ? draft.confidenceScore
          : 0
    };

    // opcional: amarra aplicação à entrevista
    if (draft.interviewId) {
      payload.lastInterviewId = draft.interviewId;
    }

    return this.updateProjectBrandCode(projectId, payload);
  }
};

export default BrandCodeSystem;
