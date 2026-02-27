# 🤖 Guia de Integração do Olly no Prana

## 📋 Índice
1. [Setup do Banco de Dados](#setup-do-banco-de-dados)
2. [Configuração de Environment](#configuração-de-environment)
3. [Integração no App](#integração-no-app)
4. [Usando em Componentes](#usando-em-componentes)
5. [API Reference](#api-reference)
6. [Exemplos Práticos](#exemplos-práticos)

---

## Setup do Banco de Dados

### 1. **Criar Arquivo de Setup**
```bash
# Já criado: setup-olly-db.js
```

### 2. **Executar o Script de Setup**
```bash
node setup-olly-db.js
```

**Saída esperada:**
```
✅ Conectado ao banco de dados Prana
✅ Tabelas criadas com sucesso
✅ Índices criados com sucesso
✅ Triggers criados com sucesso

🎉 ========================================
✅ TABELAS DO OLLY CONFIGURADAS COM SUCESSO!
   ========================================

📊 Tabelas criadas:
   • olly_sessions
   • olly_messages
   • olly_campaigns
   • olly_analyses
   • olly_optimizations
   • olly_user_settings
   • olly_files
   • olly_audit_log
   • olly_task_queue

⚡ Índices e triggers configurados
```

---

## Configuração de Environment

### Variáveis Necessárias (já no .env)
```env
# URL do Olly API
VITE_OLLY_API_URL=https://gracious-hope-production.up.railway.app

# URL do Banco de Dados (já configurada)
DATABASE_URL=postgresql://...

# Token de API (opcional, para autenticação extra)
OLLY_API_TOKEN=seu_token_aqui
```

---

## Integração no App

### 1. **Configurar OllyProvider em main.jsx**
```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { OllyProvider } from '@/contexts/OllyContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllyProvider>
      <App />
    </OllyProvider>
  </React.StrictMode>,
)
```

### 2. **Verificar Imports**
```jsx
// src/App.jsx ou seu componente principal
import { OllyProvider } from '@/contexts/OllyContext'

// Já envolvido no main.jsx, então não precisa aqui
// Mas se quiser encapsular só partes:
<OllyProvider>
  {/* seus componentes */}
</OllyProvider>
```

---

## Usando em Componentes

### Método 1: Hook `useOlly()`

```jsx
import { useOlly } from '@/contexts/OllyContext'

function MeuComponente() {
  const { 
    chat, 
    analyzeFile, 
    isLoading, 
    messages 
  } = useOlly();

  const handleChat = async () => {
    const response = await chat('Olá Olly!');
    console.log('Resposta:', response);
  };

  return (
    <button onClick={handleChat} disabled={isLoading}>
      {isLoading ? 'Enviando...' : 'Falar com Olly'}
    </button>
  );
}
```

### Método 2: Hook `useOllyIntegration()`

```jsx
import { useOllyIntegration } from '@/hooks/useOllyIntegration'

function MinhasCampanhas({ campaignId }) {
  const { 
    analyzeCampaign, 
    chatWithContext,
    applyAllOptimizations 
  } = useOllyIntegration();

  const handleAnalyze = async () => {
    const { analysis, optimizations } = await analyzeCampaign(campaignId);
    console.log('Análise:', analysis);
  };

  return (
    <button onClick={handleAnalyze}>
      Analisar Campanha
    </button>
  );
}
```

---

## API Reference

### `useOlly()` Hook

#### **startSession(metadata)**
Inicia uma nova sessão com Olly.

```jsx
const { startSession } = useOlly();

const session = await startSession({
  campaignId: 'camp_123',
  type: 'analysis'
});
// Returns: { id, user_id, started_at, ... }
```

#### **chat(message)**
Envia uma mensagem e recebe resposta.

```jsx
const { chat } = useOlly();

const response = await chat('Analise minha campanha Meta');
// Returns: { id, role: 'assistant', content: '...', ... }
```

#### **analyzeFile(file, platform)**
Analisa um arquivo de campanha.

```jsx
const { analyzeFile } = useOlly();

const analysis = await analyzeFile(file, 'meta_ads');
// Plataformas: 'meta_ads', 'google_ads', 'tiktok', 'linkedin'
// Returns: { results, confidence, ... }
```

#### **getCampaigns()**
Obtém todas as campanhas do usuário.

```jsx
const { getCampaigns } = useOlly();

const campaigns = await getCampaigns();
// Returns: [{ id, platform, campaign_name, ... }, ...]
```

#### **createAnalysis(campaignId, analysisType)**
Cria uma análise para uma campanha.

```jsx
const { createAnalysis } = useOlly();

const analysis = await createAnalysis(
  'camp_123',
  'comprehensive' // ou 'performance', 'audience', etc
);
```

#### **getOptimizations(campaignId)**
Obtém otimizações sugeridas.

```jsx
const { getOptimizations } = useOlly();

const optimizations = await getOptimizations('camp_123');
// Returns: [{ id, priority, suggestions, applied, ... }, ...]
```

#### **applyOptimization(optimizationId)**
Aplica uma otimização sugerida.

```jsx
const { applyOptimization } = useOlly();

const result = await applyOptimization('opt_123');
// Returns: { id, applied_at, result, ... }
```

#### **endSession()**
Finaliza a sessão atual.

```jsx
const { endSession } = useOlly();

await endSession();
```

### State

```jsx
const {
  isLoading,      // boolean - Requisição em andamento
  error,          // string | null - Mensagem de erro
  currentSession, // object | null - Sessão ativa
  campaigns,      // array - Campanhas carregadas
  messages        // array - Mensagens do chat
} = useOlly();
```

---

## Exemplos Práticos

### Exemplo 1: Painel de Chat Simples

```jsx
import { useOlly } from '@/contexts/OllyContext'
import { useState } from 'react'

export function OllyChat() {
  const { chat, messages, isLoading } = useOlly();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    
    try {
      await chat(message);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mensagens */}
      <div className="space-y-2 h-96 overflow-y-auto">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`p-3 rounded ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-white'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Escreva aqui..."
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
```

### Exemplo 2: Análise de Campanha

```jsx
import { useOllyIntegration } from '@/hooks/useOllyIntegration'
import { useState } from 'react'

export function CampaignAnalysis({ campaignId }) {
  const { 
    analyzeCampaign, 
    applyAllOptimizations,
    isLoading 
  } = useOllyIntegration();

  const [analysis, setAnalysis] = useState(null);
  const [optimizations, setOptimizations] = useState([]);

  const handleAnalyze = async () => {
    try {
      const { analysis, optimizations } = await analyzeCampaign(campaignId);
      setAnalysis(analysis);
      setOptimizations(optimizations);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleApplyAll = async () => {
    try {
      await applyAllOptimizations(optimizations);
      setOptimizations([]); // Limpar após aplicar
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleAnalyze}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {isLoading ? 'Analisando...' : 'Analisar Campanha'}
      </button>

      {analysis && (
        <div className="bg-gray-800 p-4 rounded space-y-2">
          <h3 className="font-bold">Performance: {analysis.results?.performanceScore}%</h3>
          <p>ROI Potencial: +{analysis.results?.potentialRoiIncrease}%</p>
        </div>
      )}

      {optimizations.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold">Otimizações ({optimizations.length})</h4>
          <ul className="space-y-1">
            {optimizations.map(opt => (
              <li key={opt.id} className="text-sm">
                • {opt.suggestions?.title}
              </li>
            ))}
          </ul>
          <button
            onClick={handleApplyAll}
            disabled={isLoading}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
          >
            Aplicar Todas
          </button>
        </div>
      )}
    </div>
  );
}
```

### Exemplo 3: Upload e Análise de Arquivo

```jsx
import { useOlly } from '@/contexts/OllyContext'
import { useState } from 'react'

export function FileAnalyzer() {
  const { analyzeFile, chat, isLoading } = useOlly();
  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const platform = file.name.includes('meta') ? 'meta_ads' : 'google_ads';
      const analysis = await analyzeFile(file, platform);
      
      setResult(analysis);

      // Enviar para Olly analisar mais a fundo
      await chat(`Analise este resultado: ${JSON.stringify(analysis)}`);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer">
        <span className="px-4 py-2 bg-blue-600 text-white rounded">
          {isLoading ? 'Analisando...' : 'Enviar Arquivo'}
        </span>
        <input 
          type="file" 
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
          accept=".csv,.json,.xlsx"
        />
      </label>

      {result && (
        <div className="bg-gray-800 p-4 rounded">
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

---

## 📦 Componentes Inclusos

### OllyChatPanel
Painel completo de chat com upload de arquivos.

```jsx
import { OllyChatPanel } from '@/components/olly/OllyChatPanel'

<OllyChatPanel campaignId="camp_123" />
```

### OllyCampaignAnalyzer
Análise automática de campanha com otimizações.

```jsx
import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer'

<OllyCampaignAnalyzer campaignId="camp_123" />
```

---

## 🔧 Troubleshooting

### "useOlly deve ser usado dentro de <OllyProvider>"
**Solução**: Certifique-se que o `OllyProvider` envolve seu componente no App ou main.jsx.

### Sessão não inicia
**Solução**: Verifique se o `VITE_OLLY_API_URL` está correto no `.env`.

### Erro de autenticação
**Solução**: Verifique se o token está sendo enviado corretamente (localStorage.getItem('prana_token')).

### Banco de dados não conecta
**Solução**: Execute `node setup-olly-db.js` para criar as tabelas.

---

## 📈 Próximos Passos

1. ✅ Setup do banco de dados
2. ✅ Configurar OllyProvider
3. ✅ Criar primeiros componentes
4. ⏳ Integrar em Pages/Views
5. ⏳ Adicionar análises automáticas
6. ⏳ Implementar webhooks para atualizações

---

**Status**: ✅ Pronto para Produção  
**Versão**: 1.0  
**Last Updated**: Dezembro 2025
