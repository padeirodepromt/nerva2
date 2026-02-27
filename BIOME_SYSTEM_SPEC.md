# Prana 3.0 – Sistema de Biomas Bio‑Digitais

Documento: BIOME_SYSTEM_SPEC.md  
Versão: 1.0 (esqueleto implementável)  
Contexto: Motor de Consciência / Biomas / Animais‑Guia / Maturação Orgânica

---

## 1. Visão Geral

O objetivo deste sistema é transformar dados internos do usuário (check‑ins de energia, tarefas, projetos) em **ambientes vivos** dentro do Prana, criando um "Motor Bio‑Digital Regenerativo".

- **Via de mão dupla**:
  - Entrada: `energy_checkins`, `task_metadata`, contexto de projeto.
  - Saída: Bioma ativo (visual + som + comportamento), Animal‑Guia, microcomportamentos de UI.
- **Intenção**:
  - Reduzir ansiedade organizacional guiando o usuário para o Bioma que melhor sustenta o estado mental desejado.
  - Criar um vínculo entre produtividade consciente e impacto regenerativo (árvores, nascentes, fauna etc.).

Este documento NÃO fixa nomes de arquivos, mas define **contratos e camadas**. A implementação pode ser adaptada à arquitetura atual (frontend + backend) desde que respeite os contratos abaixo.

### 1.1. Três Eixos (sem conflito)

Para evitar bagunça conceitual, todo o sistema se organiza em três eixos independentes:

1. **Energia / Estado interno (input)**
   - Vem de `energy_checkins` + contexto da tarefa.
   - Diz como o usuário ESTÁ (mental, físico, emocional, espiritual).
2. **Bioma (ambiente de trabalho)**
   - É a RESPOSTA do sistema: Água, Floresta, Sertão, Ventos, Cosmos.
   - Cada Bioma pode ter uma variação interna (ex.: Água → Nascente ou Oceano), sem virar novos biomas no modelo de dados.
3. **Maturação Orgânica (`organic_stage`)**
   - Fala sobre o ESTADO DO PROJETO (Solo, Semente, Broto, Crescimento, Colheita).
   - Não participa da decisão de Bioma; apenas muda a morfologia visual do projeto e seus rituais (ex.: Colheita).

Sempre que o Motor de Consciência rodar:

- Lê o eixo 1 (Energia/estado interno).
- Decide o eixo 2 (Bioma + variação interna).
- Usa o eixo 3 apenas para desenhar como o projeto aparece, nunca para escolher o Bioma.

---

## 2. Motor de Consciência (Camada de Lógica)

### 2.1. Fontes de dados mínimas

- `energy_checkins`
  - Campos recomendados:
    - `user_id`
    - `timestamp`
    - `mental_state` (ex.: baixo, médio, alto)
    - `physical_state` (ex.: baixo, médio, alto)
    - `emotional_state` (opcional)
    - `spiritual_state` (opcional)
    - `notes` (texto livre)
- `task_metadata`
  - Campos recomendados:
    - `task_id`
    - `user_id`
    - `energy_tag` (ex.: criatividade, foco_deep, urgencia, estrategia, volta)
    - `difficulty` (baixa/média/alta)
    - `deadline` (opcional)
- (Opcional) `project_metadata`
  - Campos recomendados:
    - `project_id`
    - `user_id`
    - `%_completion`
    - `organic_stage` (Solo / Semente / Broto / Crescimento / Colheita)

### 2.2. Gatilhos do motor

- Gatilhos primários:
  - Novo `energy_checkin` salvo.
  - Mudança relevante em `task_metadata` (início de foco em tarefa, conclusão, mudança de energy_tag).
  - Detecção de inconsistência rítmica pela IA (ex.: Ash detecta padrão de cansaço / ansiedade em série de check‑ins).

Quando um gatilho dispara, o Motor avalia o **contexto atual** e decide:

1. Qual **Bioma** deve estar ativo.
2. Qual **Animal‑Guia** representa o estado do usuário.
3. Qual **Estímulo cognitivo** a UI deve enfatizar (fluidez, foco, urgência, visão, integração).

---

## 3. Mapeamento de Estados → Bioma / Animal / Estímulo

Tabela conceitual (base para implementação de um map estático ou tabela no banco):

| Estado de Energia                   | Bioma (Ambiente) | Animal‑Guia           | Estímulo Cognitivo                 |
|-------------------------------------|------------------|-----------------------|------------------------------------|
| Mental baixo + Criatividade         | Nascente (Água)  | Beija‑flor            | Fluidez, polinização de ideias    |
| Físico alto + Foco Deep             | Floresta (Terra) | Elefante              | Estabilidade, raízes, memória     |
| Urgência + Execução                 | Sertão (Fogo)    | Onça‑Pintada          | Resiliência, precisão, calor      |
| Planejamento + Estratégia           | Ventos (Ar)      | Sabiá‑Laranjeira      | Perspectiva, horizonte limpo      |
| VOLTA + Integração (pós‑ciclo)      | Cosmos (Éter)    | Coruja‑Buraqueira     | Observação silenciosa, expansão   |

**Implementação sugerida**:

```ts
// pseudo‑código
interface EnergySnapshot {
  mental: 'baixo' | 'medio' | 'alto';
  physical: 'baixo' | 'medio' | 'alto';
  tag: 'criatividade' | 'foco_deep' | 'urgencia' | 'estrategia' | 'volta';
}

interface BiomeDecision {
  biome: 'agua' | 'floresta' | 'sertao' | 'ventos' | 'cosmos';
  // Variante interna do mesmo bioma (leve/profundo, quando fizer sentido)
  subBiome?: 'nascente' | 'oceano';
  animal: 'beija_flor' | 'baleia' | 'elefante' | 'onca' | 'sabia' | 'coruja';
  cognitiveCue: 'flow' | 'grounding' | 'acao' | 'visao' | 'integracao';
}

function decideBiome(snapshot: EnergySnapshot): BiomeDecision { /* ... */ }
```

Esta função pode viver em um módulo `biomeEngine` (backend ou frontend, conforme a arquitetura). O importante é que o retorno seja serializável e possa ser consumido pela UI.

---

## 4. Biomas Bio‑Regenerativos (Camada Visual / Experiência)

Para cada Bioma, definimos: **Visual**, **Fauna**, **Impacto real sugerido**.

### 4.1. 🌊 Bioma Água (Nascente & Oceano)

Água é um bioma único no modelo de dados, mas tem duas **faces complementares** na experiência: Nascente (leve, criativa) e Oceano (profunda, emocional). O Motor escolhe a variante com base na combinação entre energia mental/emocional e contexto da tarefa, sem mudar o bioma base (`biome = 'agua'`).

#### 4.1.1. Nascente (Flow & Intuição Leve)

- Visual:
  - Fundo azul‑turquesa.
  - Linhas de ondas brancas que emanam do cursor ou do foco atual.
  - "Corais Astrais" ao fundo que brilham quando o usuário digita no chat ou em diários.
- Fauna (mascote principal):
  - **Beija‑flor** pairando sobre a tarefa ativa.
  - Ao concluir uma tarefa rapidamente, executa um looping de celebração.
- Uso típico:
  - Sessões de brainstorm, escrita leve, ideação rápida, reorganização de ideias.
- Impacto real (para roadmap):
  - Cada ciclo de foco consciente em Nascente poderia financiar projetos de recuperação de nascentes e matas ciliares.

#### 4.1.2. Oceano (Profundidade & Processamento Emocional)

- Visual:
  - Fundo azul‑profundo, sensação de abismo suave.
  - Feixes de luz descendo de cima, como se o usuário estivesse submerso.
  - Partículas lentas que sobem, reforçando a ideia de catarse/emergência.
- Fauna (mascote principal):
  - **Baleia**, nadando com movimentos amplos e calmos.
  - Pode cruzar o quadro lentamente quando o usuário está escrevendo diários profundos ou revendo memórias densas.
- Uso típico:
  - Diário emocional, revisão de ciclos difíceis, processamento terapêutico, integração de experiências.
- Impacto real (para roadmap):
  - Apoio à proteção de oceanos, limpeza de plástico ou conservação de fauna marinha.

### 4.2. 🌳 Floresta (Grounding & Estrutura)

- Visual:
  - Verdes profundos e luz filtrada (efeito Komorebi).
  - Bordas da tela com "Musgos Digitais" que crescem conforme o tempo de foco (integração futura com um TaskTimer).
- Fauna:
  - Elefante caminhando lentamente na base da tela.
  - Em projetos grandes, ele "carrega" o ícone do projeto nas costas.
- Impacto real:
  - Conversão de Prana Credits em plantio de árvores nativas.

### 4.3. ☀️ Sertão (Resiliência & Ação)

- Visual:
  - Tons de ocre, laranja e dourado.
  - Efeito de ar trêmulo (distorção de calor) no horizonte.
  - Cactos (Mandacarus) que florescem apenas quando metas difíceis são atingidas.
- Fauna:
  - Onça‑Pintada observando da Sidebar.
  - Ruge (visual/sonoro suave) quando um deadline importante se aproxima.
- Impacto real:
  - Apoio a preservação da fauna da Caatinga e projetos de acesso à água (cisternas, por exemplo).

### 4.4. ☁️ Ventos (Perspectiva & Visão)

- Visual:
  - Horizonte amplo, nuvens rápidas.
  - O MindMap parece flutuar no céu (background mais claro, linhas suaves).
- Fauna:
  - Sabiá‑Laranjeira voando entre nós de projeto, transportando partículas de luz entre tarefas dependentes.
- Impacto real:
  - Monitoramento da qualidade do ar / apoio a projetos de energia eólica.

### 4.5. ✨ Cosmos (Éter & Integração)

- Visual:
  - Fundo estrelado, gradientes suaves.
  - Partículas lentas, sensação de observação e integração.
- Fauna:
  - Coruja‑Buraqueira em posição de observação.
- Papel:
  - Bioma de VOLTA/integração, usado após ciclos intensos.

---

## 5. Maturação Orgânica (Projetos como Organismos)

Objetivo: cada projeto deve ser tratado como um **organismo em desenvolvimento**, não apenas um número de porcentagem.

### 5.1. Campo `organic_stage`

Adicionar (ou consolidar) um campo conceitual `organic_stage` para projetos:

- `solo` (0%–5%)
- `semente` (6%–20%)
- `broto` (21%–50%)
- `crescimento` (51%–90%)
- `colheita` (91%–100%)

Este campo pode ser calculado automaticamente a partir de `%_completion`, mas também ajustado por lógica de negócios (ex.: a IA pode segurar um projeto em "Broto" se houver muitos bloqueios, mesmo com avanço percentual alto).

**Importante:** `organic_stage` não decide Bioma. Ele é um eixo separado que influencia apenas **como** o projeto aparece (forma do nó, animações de crescimento, rituais de colheita), não **em qual Bioma** o usuário trabalha. A escolha do Bioma continua sendo função do estado energético atual.

### 5.2. Morfologia sugerida (para um futuro `ProjectNode`)

- Solo (Nidana – 0% a 5%)
  - Visual: torrão de terra escura com textura de ruído.
  - Comportamento: leve tremor, sensação de que algo está para nascer.
- Semente (Bija – 6% a 20%)
  - Visual: núcleo de luz protegido por casca geométrica.
  - Comportamento: pulsação rítmica; Ash pode sugerir: "Sua intenção está protegida. Agora, forneça nutrientes (tarefas).".
- Broto (Ankura – 21% a 50%)
  - Visual: duas hastes verdes emergindo do nó.
  - Comportamento: se o usuário está em Foco Profundo, as hastes se alongam; se o usuário para, murcham levemente.
- Crescimento (Vriddhi – 51% a 90%)
  - Visual: árvore (Floresta) ou coral complexo (Nascente) com galhos conectando subtarefas.
  - Comportamento: o bioma ao redor reage (musgo mais denso, animais mais próximos do nó).
- Colheita (Phala – 91% a 100%)
  - Visual: frutos de ouro ou coral em bioluminescência total.
  - Ritual: ao concluir o projeto, ZenParticles dispara um efeito especial e um relatório de "Memória de Colheita" pode ser gerado (PDF).

---

## 6. Objetos de Frontend sugeridos

### 6.1. DynamicBiomeBackground (componente)

Responsabilidade: renderizar o background animado do Bioma ativo.

- Props mínimas:
  - `biome: 'nascente' | 'floresta' | 'sertao' | 'ventos' | 'cosmos'`
  - (Opcional) `intensity: 'low' | 'medium' | 'high'`

- Implementação:
  - Camada base em CSS (gradientes, cores).
  - Camada de partículas / ondas via Canvas ou biblioteca leve.
  - Integrado ao layout principal (ex.: atrás da área de trabalho do Santuário).

### 6.2. AnimalTotem (componente)

Responsabilidade: representar o Animal‑Guia do Bioma atual.

- Props mínimas:
  - `animal: 'beija_flor' | 'elefante' | 'onca' | 'sabia' | 'coruja'`
  - `state: 'idle' | 'active' | 'success' | 'low_energy'`

- Requisitos visuais:
  - Usar SVGs (não imagens estáticas) com animação de path.
  - Movimentos suaves, não distrativos.

#### 6.2.1. Diretrizes de mascotes com a alma do Prana

- Estilo:
  - "Desenho animado fluido" (cel‑shaded suave), sem parecer infantil demais.
  - Formas orgânicas, traços que lembram os glifos do sistema de ícones do Prana.
  - Evitar realismo pesado; priorizar símbolos vivos e gentis.
- Paleta:
  - Respeitar a paleta já usada no cockpit e na landing (âmbar/terra, verdes profundos, azuis água, roxos cósmicos).
  - Mascotes devem parecer integrados ao ambiente (Bioma) e não colados por cima.
- Comportamento:
  - Estados do totem:
    - `idle`: presença discreta, respirando ou piscando de leve.
    - `active`: se aproxima da tarefa/projeto atual, com animação fluida.
    - `success`: pequena celebração (looping do Beija‑flor, salto da Onça, voo alto do Sabiá).
    - `low_energy`: postura mais lenta, convidando à pausa ou VOLTA.
  - Nunca usar animações agressivas ou ansiosas; o mascote é sempre um guardião, não um fiscal.

### 6.3. Integração com MindMap/Connections

Se houver MindMap/graph view:

- Linhas de conexão devem ser tratadas como **hifas** (raízes) ou **correntes de água**, com leve movimento de pulso transportando pontos de luz do nó pai para os filhos.

---

## 7. Impacto Regenerativo (Camada de Negócio)

Este sistema abre a porta para um modelo de negócio regenerativo:

- Cada ação consciente (check‑ins consistentes, ciclos em biomas, projetos completos) gera **Prana Credits**.
- Os créditos podem ser convertidos periodicamente em:
  - Árvores plantadas.
  - Proteção de nascentes.
  - Preservação de fauna.
  - Projetos de ar limpo/energia renovável.

A parte operacional (parcerias, APIs externas, etc.) pode ser definida em outro documento de negócio; aqui basta garantir que o sistema consiga **contabilizar** ações por bioma e por usuário.

---

## 8. Roadmap de Implementação (alto nível)

1. **Camada de Dados**
   - Garantir que `energy_checkins`, `task_metadata` e `project_metadata` possuam os campos necessários.
   - Adicionar `organic_stage` em projetos.

2. **Motor de Decisão (biomeEngine)**
   - Criar função pura que recebe snapshot de energia + contexto e retorna `BiomeDecision`.
   - Persistir o último Bioma/Animal ativo por usuário.

3. **UI Básica (sem animações complexas ainda)**
   - Mostrar Bioma/Animal atual em local consistente do layout (ex.: header do Santuário).
   - Ajustar leve coloração de fundo e pequenos detalhes visuais por Bioma.

4. **UI Avançada**
   - Implementar `DynamicBiomeBackground` com animações leves.
   - Implementar `AnimalTotem` animado.
   - Integrar estágios orgânicos na visualização de projetos.

5. **Camada Regenerativa**
   - Criar modelo de "Prana Credits" por ação.
   - Conectar com iniciativas reais (árvores, nascentes, fauna, ar, energia).

---

## 9. Filosofia de Design

- A interface é um **jardim**, não um painel frio.
- Negligenciar tarefas → bioma mais árido; cuidar com consciência → floresta digital exuberante.
- Cada sessão de uso deve convidar o usuário a habitar um estado de presença, não apenas "executar tarefas".
