/* src/api/shop.js
   desc: Shop Client V1
   used_by: Sidebar dynamic + ShopDrawer
*/

const BASE = '/api/shop';

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

export const ShopAPI = {
  async getCatalog() {
    return request('/catalog', { method: 'GET' });
  },

  async hire(productKey) {
    return request('/hire', {
      method: 'POST',
      body: JSON.stringify({ productKey })
    });
  },

  async unhire(productKey) {
    return request('/unhire', {
      method: 'POST',
      body: JSON.stringify({ productKey })
    });
  },

  async getProjectWidgets(projectId) {
    if (!projectId) throw new Error('projectId is required');
    return request(`/project/${projectId}/widgets`, { method: 'GET' });
  }
};

export default ShopAPI;