import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

const AdminAIModels = () => {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ provider: 'openai', model_identifier: '', tier: 'FAST', alias: '', active: true, priority: 10, meta: {} });

  const load = async () => {
    const res = await apiClient.get('/admin/ai-models');
    setModels(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    await apiClient.post('/admin/ai-models', form);
    setForm({ provider: 'openai', model_identifier: '', tier: 'FAST', alias: '', active: true, priority: 10, meta: {} });
    await load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Admin - AI Models</h1>
      <div className="mb-6">
        <input placeholder="model_identifier" value={form.model_identifier} onChange={e => setForm({...form, model_identifier: e.target.value})} />
        <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})}>
          <option value="openai">OpenAI</option>
          <option value="google">Google (Gemini)</option>
        </select>
        <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}>
          <option value="FAST">FAST</option>
          <option value="SMART">SMART</option>
        </select>
        <input placeholder="costPerToken (e.g. 0.00012)" onBlur={e => setForm({...form, meta: {...form.meta, costPerTokenMicro: Math.round(parseFloat(e.target.value || '0') * 1_000_000)}})} />
        <button onClick={create} className="ml-4 px-3 py-1 bg-blue-600 text-white rounded">Criar</button>
      </div>

      <div className="space-y-4">
        {models.map(m => (
          <div key={m.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{m.model_identifier} <span className="text-xs">({m.provider})</span></div>
                <div className="text-sm text-gray-500">Tier: {m.tier} • priority: {m.priority}</div>
                <div className="text-xs text-gray-400">meta: {JSON.stringify(m.meta)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAIModels;
