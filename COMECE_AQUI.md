# 🚀 COMECE AQUI - GUIA PASSO-A-PASSO

## O que você precisa fazer AGORA (não vai demorar, prometo!)

---

## ✅ PASSO 1: Executar Comando para Criar Tabelas (2 minutos)

Abra o terminal e execute:

```bash
node setup-olly-db.js
```

**O que acontece:**
- Cria 9 tabelas no banco de dados PostgreSQL
- Se funcionou, você verá a mensagem: `✅ TABELAS DO OLLY CONFIGURADAS COM SUCESSO!`

**Se der erro:**
- Verifique se tem `DATABASE_URL` no arquivo `.env`
- Verifique se a URL está correta

---

## ✅ PASSO 2: Adicionar OllyProvider no App (2 minutos)

Abra o arquivo: **`src/main.jsx`**

Procure por este código:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
```

**MUDE PARA:**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { OllyProvider } from '@/contexts/OllyContext'
```

Depois procure por:

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**MUDE PARA:**

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllyProvider>
      <App />
    </OllyProvider>
  </React.StrictMode>,
)
```

**Pronto!** Salve o arquivo.

---

## ✅ PASSO 3: Testar no Navegador (1 minuto)

Execute no terminal:

```bash
npm run dev
```

Abra: `http://localhost:5173`

Procure pela página **"Olly Integration Example"** (deve estar em seu menu)

Se não achar, você pode acessar diretamente uma rota como:
- `http://localhost:5173/olly-example`

---

## ✅ PASSO 4: Testar o Chat (1 minuto)

Na página que abriu:

1. Clique na aba **"Chat"**
2. Digite uma mensagem: `Olá Olly, qual é o ROI da minha campanha?`
3. Clique em **"Enviar"**
4. Veja a resposta aparecer!

**Se funcionou** = ✅ Tudo está funcionando!

---

## ✅ PASSO 5: Agora Use em Seus Componentes (5 minutos)

Você agora pode usar em qualquer página ou componente.

**Exemplo 1: Chat Simples**

Crie um arquivo novo ou edite um existente:

```jsx
import { useOlly } from '@/contexts/OllyContext'

export default function MinhaPagina() {
  const { chat, messages, isLoading } = useOlly()

  const handleEnviar = async () => {
    await chat('Olá! Como você está?')
  }

  return (
    <div>
      <h1>Chat com Olly</h1>
      
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}

      <button onClick={handleEnviar} disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </div>
  )
}
```

**Exemplo 2: Painel de Chat Completo**

```jsx
import { OllyChatPanel } from '@/components/olly/OllyChatPanel'

export default function MinhaPagina() {
  return (
    <div>
      <h1>Chat com Olly</h1>
      <OllyChatPanel campaignId="camp_123" />
    </div>
  )
}
```

**Exemplo 3: Análise de Campanha**

```jsx
import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer'

export default function MinhaPagina() {
  return (
    <div>
      <h1>Análise da Campanha</h1>
      <OllyCampaignAnalyzer campaignId="camp_123" />
    </div>
  )
}
```

---

## 🎯 RESUMO DO QUE FOI CRIADO

```
✅ setup-olly-db.js           - Script para criar tabelas
✅ src/contexts/OllyContext.jsx - Provider que você envolveu no App
✅ src/components/olly/        - Componentes prontos para usar
✅ src/hooks/useOllyIntegration.js - Hook helper
✅ Documentação completa       - Se quiser aprender mais
```

---

## 🔧 Métodos Disponíveis (useOlly)

Você pode usar isso em qualquer componente que estiver dentro de `<OllyProvider>`:

```jsx
const {
  chat,                    // Enviar mensagem
  messages,                // Histórico de mensagens
  isLoading,               // Está carregando?
  error,                   // Erro, se houver
  analyzeFile,             // Analisar arquivo
  getCampaigns,            // Listar campanhas
  createAnalysis,          // Criar análise
  getOptimizations,        // Obter sugestões
  applyOptimization,       // Aplicar sugestão
} = useOlly()
```

---

## 💡 Dicas Importantes

### Dica 1: campaignId
- `<OllyChatPanel campaignId="camp_123" />`
- Troque `"camp_123"` pela ID da campanha real
- Pode deixar vazio se não tiver uma campanha específica

### Dica 2: Arquivos de Documentação
Se precisar aprender mais:
- `OLLY_QUICK_START.js` - Exemplos rápidos
- `OLLY_INTEGRATION_GUIDE.md` - Documentação completa
- `OLLY_ARCHITECTURE_DIAGRAM.md` - Como funciona tudo

### Dica 3: Troubleshooting
Se algo não funcionar:

**Erro: "DATABASE_URL não definido"**
→ Verifique `.env` se tem a variável

**Erro: "Tabelas não encontradas"**
→ Execute novamente: `node setup-olly-db.js`

**Erro: "useOlly() retorna undefined"**
→ Certifique-se que envolveu o App com `<OllyProvider>`

---

## 📋 Checklist Final

- [ ] Executei `node setup-olly-db.js` (e funcionou)
- [ ] Adicionei `OllyProvider` em `src/main.jsx`
- [ ] Executei `npm run dev`
- [ ] Testei o chat na página de exemplo
- [ ] Funcionou! ✅

---

## 🎉 Pronto!

Você tem a integração Olly 100% funcional!

Agora pode:
1. ✅ Usar `<OllyChatPanel />` em qualquer lugar
2. ✅ Usar `<OllyCampaignAnalyzer />` em qualquer lugar
3. ✅ Usar `useOlly()` em qualquer componente
4. ✅ Fazer análises, chat, otimizações automaticamente

---

## 📞 Próximas Perguntas?

Procure por:
- **Como customizar?** → `OLLY_DEVELOPER_GUIDE.md`
- **Como fazer deploy?** → `deploy-olly.sh`
- **Preciso de tudo?** → `OLLY_INDEX.md`
- **Exemplos?** → `OLLY_QUICK_START.js`

---

**Status**: ✅ Pronto para Uso!

🚀 **Bom desenvolvimento!**
