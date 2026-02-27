# 🌍 Sistema de Biomas v2.0 - Documentação Completa

## Visão Geral

O Sistema de Biomas v2.0 implementa uma **detecção automática em tempo real** de estados de energia do usuário e aplica um **bioma cinematográfico correspondente** como background do workspace, com **recomendações contextuais do Ash**.

### Fluxo Principal

```
Check-in de Energia
    ↓
BiomeMonitor (Hook)
    ↓
decideBiomeFromCheckIn() [biomeEngine.js]
    ↓
Atualização Automática de Bioma
    ↓
DynamicBiomeBackground renderiza cena cinematográfica
    ↓
Ash dispara recomendação personalizada
```

## Arquitetura

### 1. **BiomeContext.jsx** (`/src/contexts/BiomeContext.jsx`)
**Propósito**: Gerenciar estado global de biomas

**Responsabilidades**:
- Armazenar bioma ativo atual
- Manter histórico de transições
- Gerenciar mood do mascote (idle, active, success, low_energy)
- Armazenar recomendação do Ash com timestamp

**API**:
```jsx
{
  // Estado
  currentBiome: { biome, subBiome, animal, cognitiveCue }
  ashRecommendation: { message, showNotification, timestamp }
  biomeHistory: Array
  mood: 'idle' | 'active' | 'success' | 'low_energy'
  
  // Ações
  updateBiome(newBiome)
  setRecommendation(message, autoDismiss?)
  dismissRecommendation()
  updateMood(newMood)
}
```

### 2. **useBiomeMonitor.js** (`/src/hooks/useBiomeMonitor.js`)
**Propósito**: Monitorar mudanças de energia em tempo real

**Comportamento**:
- Escuta evento global `prana:energy-update` (disparado por check-ins)
- Debounce de 500ms para evitar múltiplas atualizações rápidas
- Chama `decideBiomeFromCheckIn()` para calcular novo bioma
- Dispara recomendação personalizada do Ash
- Monitora completação/início de tarefas para atualizar mood

**Eventos Monitorados**:
- `prana:energy-update` → Atualiza bioma
- `prana:task-completed` → Define mood como 'success'
- `prana:task-started` → Define mood como 'active'

### 3. **DynamicBiomeBackground.jsx** (`/src/components/biome/DynamicBiomeBackground.jsx`)
**Propósito**: Renderizar o bioma cinematográfico apropriado

**Características**:
- Lazy loading de componentes de biomas
- Transições suaves com Framer Motion
- Suporta fallback para gradientes enquanto carrega
- Renderiza como overlay fixo (z-0, não interfere com conteúdo)

**Mapeamento de Biomas**:
| Bioma | SubBioma | Componente | Animal |
|-------|----------|-----------|--------|
| agua | nascente | RiverNacenteCinematic | beija_flor |
| agua | oceano | OceanCinematic | baleia |
| floresta | - | FruitForestCinematic | elefante |
| sertao | - | CerradoCinematic | onca |
| ventos | - | [TODO] | sabia |
| cosmos | - | [TODO] | coruja |

### 4. **BiomeRecommendationNotification.jsx** (`/src/components/biome/BiomeRecommendationNotification.jsx`)
**Propósito**: Exibir recomendações do Ash de forma visual

**Características**:
- Animação de entrada/saída suave
- Auto-dismiss após 8 segundos
- Botão para fechar manualmente
- Indicador visual de ativação (pulsing dots)

### 5. **biomeEngine.js** (`/src/ai_services/biomeEngine.js`)
**Propósito**: Lógica determinística de decisão de bioma

**Função Principal**: `decideBiomeFromCheckIn(checkInData)`

**Entrada**:
```javascript
{
  physical: 0-10,
  mental: 0-10,
  emotional: 0-10,
  spiritual: 0-10,
  tags: Array<string>,
  notes: string
}
```

**Saída**:
```javascript
{
  biome: 'agua' | 'floresta' | 'sertao' | 'ventos' | 'cosmos',
  subBiome?: 'nascente' | 'oceano',
  animal: 'beija_flor' | 'baleia' | 'elefante' | 'onca' | 'sabia' | 'coruja',
  cognitiveCue: 'flow' | 'grounding' | 'acao' | 'visao' | 'integracao'
}
```

**Regras de Decisão**:
1. **VOLTA (Cosmos)**: Se `tags` contém 'volta' OU (spiritual baixo E emotional baixo)
2. **URGÊNCIA (Sertão)**: Se `tags` contém 'urgencia' OU (physical alto E mental alto)
3. **FOCO PROFUNDO (Floresta)**: Se `tags` contém 'foco_deep' OU (mental alto E physical ≠ baixo)
4. **ESTRATÉGIA (Ventos)**: Se `tags` contém 'estrategia'
5. **DEFAULT (Água)**: Nascente (criatividade) ou Oceano (introspecção profunda)

### 6. **biomeIntegrator.js** (`/src/ai_services/biomeIntegrator.js`)
**Propósito**: Conectar eventos de aplicação com o sistema de biomas

**Funções Públicas**:
```javascript
triggerBiomeUpdate(energyState)        // Dispara atualização
notifyTaskCompletion(taskData)         // Marca tarefa como completa
notifyTaskStart(taskData)              // Marca tarefa como iniciada
syncBiomeState()                       // Sincroniza estado atual
```

## Integração com PranaWorkspaceLayout

### Estrutura Modificada

```jsx
<BiomeProvider>
  {/* Background dinâmico (z-0) */}
  <DynamicBiomeBackground asOverlay={true} />
  
  {/* Conteúdo principal */}
  <PranaWorkspaceContent />
  
  {/* Notificações do Ash */}
  <BiomeRecommendationNotification />
</BiomeProvider>
```

### Como Funciona

1. **BiomeProvider** envolve todo o layout
2. **useBiomeMonitor** é ativado no componente interno
3. **DynamicBiomeBackground** renderiza como overlay fixo (z-0)
4. Conteúdo normal renderiza acima (z > 0)
5. Quando energia muda → bioma muda automaticamente
6. Notificação do Ash aparece no canto inferior esquerdo

## Como Usar

### Para Disparar Atualização de Energia

```javascript
import { triggerBiomeUpdate } from '@/ai_services/biomeIntegrator';

// Em qualquer lugar da aplicação
triggerBiomeUpdate({
  physical: 7,
  mental: 8,
  emotional: 6,
  spiritual: 7,
  tags: ['foco_deep'],
  notes: 'Pronto para trabalho profundo'
});
```

### Para Notificar Conclusão de Tarefa

```javascript
import { notifyTaskCompletion } from '@/ai_services/biomeIntegrator';

notifyTaskCompletion({
  taskId: '123',
  title: 'Implementar feature X'
});
```

### Para Acessar o Contexto em Componentes

```jsx
import { useBiomeContext } from '@/contexts/BiomeContext';

function MeuComponente() {
  const { currentBiome, mood, ashRecommendation } = useBiomeContext();
  
  return (
    <div>
      <p>Bioma ativo: {currentBiome.biome}</p>
      <p>Mood: {mood}</p>
    </div>
  );
}
```

## Recomendações do Ash - Mensagens Personalizadas

As mensagens do Ash são mapeadas por bioma e selecionadas aleatoriamente:

```javascript
BIOME_MESSAGES = {
  agua: {
    nascente: [
      'Detectei que você está em criatividade baixa. Recomendo a Nascente para fluir...',
      '...'
    ],
    oceano: [
      'Você está em uma jornada emocional profunda...',
      '...'
    ]
  },
  floresta: [
    'Você está pronto para foco profundo! A Floresta...',
    '...'
  ],
  // ... mais biomas
}
```

Cada mensagem:
- Reconhece o estado do usuário
- Recomenda o bioma específico
- Explica o benefício
- Termina com emoji + nome do animal guia

## Cenários de Teste

### 1. Criatividade Baixa (Nascente)
```javascript
triggerBiomeUpdate({
  physical: 5,
  mental: 4,
  emotional: 5,
  spiritual: 5,
  tags: ['criatividade'],
  notes: 'Preciso de flow'
});
```
**Resultado**: Nascente + Beija-flor + mensagem sobre criatividade

### 2. Deep Focus (Floresta)
```javascript
triggerBiomeUpdate({
  physical: 7,
  mental: 8,
  emotional: 6,
  spiritual: 6,
  tags: ['foco_deep'],
  notes: 'Pronto para trabalho profundo'
});
```
**Resultado**: Floresta + Elefante + mensagem sobre grounding

### 3. Urgência Alta (Sertão)
```javascript
triggerBiomeUpdate({
  physical: 9,
  mental: 8,
  emotional: 7,
  spiritual: 5,
  tags: ['urgencia'],
  notes: 'Deadline próximo'
});
```
**Resultado**: Sertão + Onça-Pintada + mensagem sobre ação

### 4. Oceano Profundo (Baleia)
```javascript
triggerBiomeUpdate({
  physical: 4,
  mental: 4,
  emotional: 2,
  spiritual: 6,
  tags: ['introspecção'],
  notes: 'Estou em uma jornada emocional profunda...'
});
```
**Resultado**: Oceano + Baleia + mensagem sobre compreensão emocional

## Monitoramento em Tempo Real

### Hook useBiomeMonitor Detalhes

```javascript
export const useBiomeMonitor = () => {
  // 1. Escuta energia via evento global
  window.addEventListener('prana:energy-update', handleCheckInUpdate)
  
  // 2. Debounce de 500ms
  
  // 3. Calcula novo bioma
  const newBiome = decideBiomeFromCheckIn(energyState)
  
  // 4. Atualiza contexto
  updateBiome(newBiome)
  
  // 5. Gera e exibe recomendação
  setRecommendation(message)
}
```

### Mood States (Mascotes)

| Estado | Quando | Duração | Efeito Visual |
|--------|--------|---------|---------------|
| idle | Default | - | Animações normais |
| active | Tarefa iniciada | - | Maior escala, movimentos rápidos |
| success | Tarefa completa | 3s | Celebração, aura |
| low_energy | Energia muito baixa | - | Dimmed, sluggish |

## Próximos Passos

### TODO - Biomas Pendentes
- [ ] **VentosCinematic.jsx** - Sabiá-Laranjeira em paisagem aérea/montanhosa
- [ ] **CosmosCinematic.jsx** - Coruja-Buraqueira em céu noturno

### TODO - Melhorias
- [ ] Persistência de histórico de biomas (localStorage/DB)
- [ ] Sincronização com check-ins da API
- [ ] Analytics: rastrear tempo em cada bioma
- [ ] Customização de mensagens do Ash por usuário
- [ ] Animações especiais em transições de bioma
- [ ] Integração com sistema de rotinas (recomendações por hora do dia)

## Troubleshooting

### Bioma não muda
1. Verificar se `BiomeProvider` envolve o componente
2. Verificar console para eventos `prana:energy-update`
3. Verificar se `useBiomeMonitor` foi chamado (deve estar no componente interno)

### Recomendação do Ash não aparece
1. Verificar se `BiomeRecommendationNotification` está renderizando
2. Verificar z-index (deve ser z-50)
3. Verificar `ashRecommendation.showNotification` está true

### Background vazio/cinzento
1. Se Suspense está em fallback, bioma está carregando
2. Verificar imports dos biomas cinematográficos
3. Verificar se componentes de bioma exportam corretamente

## Arquivos Criados/Modificados

### Novos Arquivos
- ✅ `/src/contexts/BiomeContext.jsx`
- ✅ `/src/hooks/useBiomeMonitor.js`
- ✅ `/src/components/biome/DynamicBiomeBackground.jsx`
- ✅ `/src/components/biome/BiomeRecommendationNotification.jsx`
- ✅ `/src/components/biome/BiomeEnergyTestPanel.jsx`
- ✅ `/src/ai_services/biomeIntegrator.js`

### Arquivos Modificados
- ✅ `/src/pages/PranaWorkspaceLayout.jsx` - Integração com BiomeProvider
- ✅ `/src/pages/BiomeDebugPage.jsx` - Adição do painel de teste

### Arquivos Existentes (Não Modificados)
- `/src/ai_services/biomeEngine.js` - Sistema de decisão
- `/src/ai_services/energyService.js` - Análise de energia
- `/src/components/biome/FruitForestCinematic.jsx` - Bioma Floresta
- `/src/components/biome/RiverNacenteCinematic.jsx` - Bioma Nascente
- `/src/components/biome/OceanCinematic.jsx` - Bioma Oceano
- `/src/components/biome/CerradoCinematic.jsx` - Bioma Sertão

## Resumo de Implementação

✅ **Sistema Completo e Funcional**:
- Detecção automática de energia em tempo real
- Renderização cinematográfica de biomas como background
- Recomendações personalizadas do Ash
- Painel de teste integrado para validação
- Integração suave com PranaWorkspaceLayout
- Zero impacto no performance (lazy loading, suspense)
- Arquitetura escalável para novos biomas

🎯 **Pronto para Uso**: O sistema está pronto para ser conectado com o check-in real de energia da API.
