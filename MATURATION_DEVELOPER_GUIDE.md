# 🔧 Maturação Orgânica - Developer Guide

## Arquitetura Técnica

### Stack de Tecnologias
```
Frontend:   React 18 + Vite
Animações:  Framer Motion
Gráficos:   SVG + Canvas (future)
State:      React hooks (useState, useEffect)
Styling:    Tailwind CSS
Build:      Vite 6.4.1
```

---

## Estrutura de Arquivos

```
/src/components/organic/
├── OrganicStageRenderer.jsx
│   ├── SoloStage (SVG ellipse + animation)
│   ├── SementeStage (SVG circle + rotate)
│   ├── BrotoStage (SVG path + growth)
│   ├── CrescimentoStage (SVG tree + branches)
│   ├── ColheitaStage (SVG tree + fruits)
│   └── export OrganicStageRenderer
│
├── AnimalTotem.jsx
│   ├── BeijaFlorTotem (Nascente)
│   ├── ElefanteTotem (Floresta)
│   ├── OncaPintadaTotem (Sertão)
│   ├── SabiaTotem (Ventos)
│   ├── CorujaTotem (Cosmos)
│   └── AnimalTotem (main component)
│
├── BiomeReactionSystem.js
│   ├── reactions.nascente {}
│   ├── reactions.floresta {}
│   ├── reactions.sertao {}
│   ├── reactions.ventos {}
│   ├── reactions.cosmos {}
│   ├── getReactions()
│   ├── interpolateReactions()
│   ├── getInterpolatedReactions()
│   └── generateCSSVariables()
│
├── HifasConnections.jsx
│   ├── calculateConnectionPath()
│   ├── getConnectionColor()
│   ├── HifaConnection (individual)
│   ├── HifasConnections (system)
│   ├── projectToConnections()
│   └── useHifasAnimation()
│
└── HarvestRitual.jsx
    ├── HarvestParticle
    ├── FruitExplosion
    ├── FeedbackText
    ├── CompletionInfo
    ├── ActionButtons
    ├── HarvestRitual (main)
    └── useHarvestRitual (hook)
```

---

## API Reference

### OrganicStageRenderer

```javascript
import { OrganicStageRenderer } from '@/components/organic/OrganicStageRenderer';

// Props
<OrganicStageRenderer
  organic_stage='broto'           // 'solo'|'semente'|'broto'|'crescimento'|'colheita'
  progress={45}                   // 0-100 (percent within current stage)
  biome='floresta'                // 'nascente'|'floresta'|'sertao'|'ventos'|'cosmos'
  focusTime={120}                 // minutes of deep focus (affects broto stems)
  subtaskCount={5}                // total subtasks (affects crescimento branches)
  completedSubtasks={3}           // completed count (affects colheita fruits)
/>

// Returns: SVG element rendered with stage-specific animation
```

**Stage Morphology**:
```
solo       → Static ellipse with trembling at 0.05Hz
semente    → Pulsing core (1.5s) + rotating shell (2s)
broto      → 2 stems growing to (focusTime / 100) height
crescimento → Tree with (subtaskCount) branches, animated bounce
colheita   → Mature tree with (completedSubtasks) golden fruits
```

**Color Schemes by Biome**:
```javascript
{
  nascente: {
    solo: '#0ea5e9',      semente: '#06b6d4',    broto: '#22d3ee',
    crescimento: '#67e8f9', colheita: '#a5f3fc'
  },
  floresta: {
    solo: '#16a34a',      semente: '#22c55e',    broto: '#4ade80',
    crescimento: '#86efac', colheita: '#bbf7d0'
  },
  // ... etc for other biomes
}
```

---

### AnimalTotem

```javascript
import { AnimalTotem } from '@/components/organic/AnimalTotem';

// Props
<AnimalTotem
  biome='floresta'        // Determines animal
  state='ACTIVE'          // 'IDLE'|'ACTIVE'|'SUCCESS'|'LOW_ENERGY'|'ALERT'
/>

// Returns: SVG animal with state-based animation
```

**Animal Selection**:
```javascript
const animals = {
  nascente: BeijaFlorTotem,
  floresta: ElefanteTotem,
  sertao: OncaPintadaTotem,
  ventos: SabiaTotem,
  cosmos: CorujaTotem
}
```

**State Animations**:
```javascript
{
  IDLE: { duration: 2-4s, subtle movement },
  ACTIVE: { duration: 0.6-0.8s, vigorous movement },
  SUCCESS: { duration: 1-1.3s, celebrate 360° },
  LOW_ENERGY: { duration: 4-5s, sluggish + opacity },
  ALERT: { duration: 0.4-0.6s, alert posture + scale }
}
```

---

### BiomeReactionSystem

```javascript
import BiomeReactionSystem from '@/components/organic/BiomeReactionSystem';

// Get reactions for specific stage
const reactions = BiomeReactionSystem.getReactions('floresta', 'broto');
// Returns: { mossGrowth: 0.5, canopyOpacity: 0.6, ... }

// Interpolate between stages for smooth progression
const interpolated = BiomeReactionSystem.getInterpolatedReactions(
  'sertao',      // biome
  'broto',       // current stage
  45             // progress within stage (0-100)
);
// Returns: smoothly transitioned reaction values

// Generate CSS variables
const cssVars = BiomeReactionSystem.generateCSSVariables('nascente', 'colheita');
// Returns: { '--waterClarity': '0.95', '--fishDensity': '0.95', ... }
```

**Reaction Schema**:
```typescript
interface BiomeReaction {
  // Nascente
  waterClarity?: number;
  fishDensity?: number;
  coralGlow?: number;
  biolumIntensity?: number;
  particleCount?: number;
  particleSpeed?: number;
  particleColor?: string;

  // Floresta
  mossGrowth?: number;
  canopyOpacity?: number;
  birdActivity?: number;
  lightFiltering?: number;
  leafParticles?: number;

  // Sertao
  heatHaze?: number;
  sunBrightness?: number;
  cactusBloom?: number;
  fruitGlow?: number;
  dustParticles?: number;
  skyGradient?: string;

  // Ventos
  cloudSpeed?: number;
  mindmapFloat?: number;
  windParticles?: number;
  seedDispersion?: number;

  // Cosmos
  starDensity?: number;
  nebulaBrightness?: number;
  vortexIntensity?: number;
  mandalaGlow?: number;
  cosmicParticles?: number;
}
```

---

### HifasConnections

```javascript
import { HifasConnections, projectToConnections, useHifasAnimation } from '@/components/organic/HifasConnections';

// Render system
<HifasConnections
  connections={[
    {
      id: 'hifa-1',
      from: { x: 100, y: 100 },
      to: { x: 200, y: 150 },
      progress: 45,
      biome: 'floresta',
      parentProgress: 50,
      energyFlow: true,
      label: 'Task: Design'
    }
  ]}
  biome='floresta'
  animationDelay={0.1}
  interactive={false}
/>

// Convert project hierarchy to connections
const connections = projectToConnections(
  project,           // { id, title, parent_id, subtasks, progress }
  positions          // optional { [id]: { x, y } }
);

// Use animation hook
const animated = useHifasAnimation(connections, {
  autoProgression: true,
  progressStep: 5,
  interval: 1000
});
```

**Connection Schema**:
```typescript
interface Connection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: 0-100;
  biome: string;
  parentProgress?: 0-100;
  energyFlow?: boolean;
  label?: string;
}
```

---

### HarvestRitual

```javascript
import { HarvestRitual, useHarvestRitual } from '@/components/organic/HarvestRitual';

// Hook for state management
const { isOpen, setIsOpen, celebrate, close } = useHarvestRitual(defaultOpen);

// Component
<HarvestRitual
  isVisible={isOpen}
  projectName='My Project'
  duration='2 weeks'
  tasksCompleted={15}
  pranaCredits={250}
  biome='floresta'
  onCertificate={() => generatePDF()}
  onShare={() => shareOnTwitter()}
  onContinue={() => createNewProject()}
  onClose={() => setIsOpen(false)}
  autoClose={true}
  autoCloseDelay={8000}
/>

// Trigger celebration
const close = celebrate({
  name: 'My Project',
  tasks: 15,
  credits: 250
});
```

**Animation Timeline**:
```
t=0.0s   → Modal enter (opacity 0→1, scale 0.8→1)
t=0.1s   → Fruit explosion 1 (24 particles)
t=0.2s   → Fruit explosion 2 (corner)
t=0.4s   → Feedback text (fade in + bounce emoji)
t=0.5s   → Completion card (scale + colors)
t=1.5s   → Action buttons (fade + stagger)
t=8.0s   → Auto-close (or manual click)
```

---

## Integration Patterns

### 1. **ProjectNode Integration**

```javascript
// Import all components
import { OrganicStageRenderer } from '@/components/organic/OrganicStageRenderer';
import { AnimalTotem } from '@/components/organic/AnimalTotem';
import { HarvestRitual, useHarvestRitual } from '@/components/organic/HarvestRitual';
import BiomeReactionSystem from '@/components/organic/BiomeReactionSystem';

// Setup state and calculations
const { isOpen: isHarvestOpen, setIsOpen: setIsHarvestOpen } = useHarvestRitual();
const [animalState, setAnimalState] = useState('IDLE');

// Calculate progress
const totalTasks = projectTasks.length;
const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
const projectProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// Determine stage
const getOrganicStage = (progress) => {
  if (progress <= 5) return 'solo';
  if (progress <= 20) return 'semente';
  if (progress <= 50) return 'broto';
  if (progress <= 90) return 'crescimento';
  return 'colheita';
};

const organicStage = getOrganicStage(projectProgress);

// Monitor progress changes
useEffect(() => {
  if (projectProgress === 100) {
    setAnimalState('SUCCESS');
    setIsHarvestOpen(true);
  } else if (projectProgress >= 75) {
    setAnimalState('ACTIVE');
  } else if (projectProgress < 25) {
    setAnimalState('IDLE');
  }
}, [projectProgress, setIsHarvestOpen]);

// Render
<OrganicStageRenderer
  organic_stage={organicStage}
  progress={projectProgress}
  biome={project.biome || 'floresta'}
  subtaskCount={projectSubprojects.length}
  completedSubtasks={completedTasks}
/>

<HarvestRitual
  isVisible={isHarvestOpen}
  projectName={project.name}
  tasksCompleted={completedTasks}
  pranaCredits={calculatePranaCredits()}
  biome={project.biome}
  onClose={() => setIsHarvestOpen(false)}
/>
```

### 2. **Dashboard Integration**

```javascript
// In dashboard/list view
import { BiomeReactionSystem } from '@/components/organic/BiomeReactionSystem';

// Apply biome reactions as CSS
const biomeVars = BiomeReactionSystem.generateCSSVariables(
  project.biome,
  currentStage
);

<div style={biomeVars} className="project-container">
  {/* Biome-specific styling applied via CSS variables */}
</div>
```

### 3. **Kanban Integration**

```javascript
// In kanban view
import { HifasConnections, projectToConnections } from '@/components/organic/HifasConnections';

// Convert task hierarchy to visual connections
const connections = projectToConnections(project, cardPositions);

<HifasConnections
  connections={connections}
  biome={project.biome}
  animationDelay={0.1}
  interactive={true}
/>
```

---

## Extending the System

### 1. **Adding a New Biome**

```javascript
// In BiomeReactionSystem.js
cosmos: {
  solo: {
    starDensity: 0.1,
    nebulaBrightness: 0,
    vortexIntensity: 0,
    mandalaGlow: 0,
    // ... etc for all 5 stages
  },
  semente: { /* ... */ },
  broto: { /* ... */ },
  crescimento: { /* ... */ },
  colheita: { /* ... */ }
}
```

### 2. **Adding a New Animal**

```javascript
// In AnimalTotem.jsx
const MyAnimalTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: { duration: 2 },
    ACTIVE: { duration: 0.8 },
    SUCCESS: { duration: 1.2 },
    LOW_ENERGY: { duration: 5 },
    ALERT: { duration: 0.5 }
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      animate={stateAnimations[state]}
      transition={{ repeat: Infinity }}
    >
      {/* SVG paths here */}
    </motion.svg>
  );
};

// Register in animals map
const animals = {
  mybiome: MyAnimalTotem
};
```

### 3. **Custom Prana Credits Formula**

```javascript
// Override calculation
const calculateCustomCredits = (project, taskCount, subprojectCount, progress) => {
  // Custom logic
  const base = taskCount * 7; // 7 per task instead of 5
  const subWeight = subprojectCount * 15;
  const speedBonus = progress >= 95 ? progress * 3 : progress * 1.5;
  
  return Math.round(base + subWeight + speedBonus);
};
```

---

## Performance Optimization

### Current Optimizations
- ✅ SVG pathLength animations (GPU accelerated)
- ✅ Framer Motion repeat: Infinity (efficient loop)
- ✅ CSS transforms only (no layout recalc)
- ✅ Component memoization (via React.memo)

### Future Optimizations
```javascript
// 1. Canvas rendering for particles
import THREE from 'three';

// 2. Particle pooling
class ParticlePool {
  constructor(size) {
    this.pool = Array(size).fill(null).map(() => new Particle());
  }
  
  get() {
    return this.pool.pop() || new Particle();
  }
  
  return(particle) {
    particle.reset();
    this.pool.push(particle);
  }
}

// 3. Request animation frame batching
useAnimationFrame(() => {
  // Batch update all reactions
  updateBiomeReactions();
  updateAnimalState();
});
```

---

## Testing

### Unit Tests
```javascript
// BiomeReactionSystem.test.js
describe('BiomeReactionSystem', () => {
  test('getReactions returns correct values', () => {
    const reactions = BiomeReactionSystem.getReactions('floresta', 'broto');
    expect(reactions.mossGrowth).toBe(0.5);
  });

  test('interpolateReactions smooths values', () => {
    const from = { value: 0 };
    const to = { value: 100 };
    const result = BiomeReactionSystem.interpolateReactions(from, to, 0.5);
    expect(result.value).toBe(50);
  });
});

// AnimalTotem.test.js
describe('AnimalTotem', () => {
  test('renders correct animal for biome', () => {
    const { container } = render(<AnimalTotem biome="floresta" />);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  test('applies state animations', () => {
    const { container } = render(<AnimalTotem state="ACTIVE" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('animate'); // Framer Motion applies data-*
  });
});
```

### Manual Testing
```
1. Create project with each biome
2. Add tasks and mark complete (0% → 100%)
3. Verify:
   - Stage transitions at correct %
   - Animal state changes appropriately
   - Biome reactions respond correctly
   - Harvest ritual triggers at 100%
   - Credits calculated accurately
```

---

## Debugging

### Console Logs
```javascript
// In ProjectNode or component
console.log('Progress:', projectProgress);
console.log('Stage:', organicStage);
console.log('Animal State:', animalState);
console.log('Biome Reactions:', BiomeReactionSystem.getReactions(biome, stage));
console.log('Prana Credits:', calculatePranaCredits());
```

### React Dev Tools
```
1. Inspect <OrganicStageRenderer> props
   - organic_stage should match progress %
   - biome should be one of 5 values
   - progress should increase 0→100

2. Inspect <AnimalTotem> state
   - state should change: IDLE → ACTIVE → SUCCESS

3. Inspect <HarvestRitual>
   - isVisible should toggle at 100%
```

### Performance Profiling
```javascript
// Chrome DevTools → Performance
// Record while changing project progress
// Look for:
// - SVG redraws (should be < 60ms)
// - Animation jank (should be 60fps)
// - No memory leaks (should stabilize)
```

---

## Deployment Checklist

- [ ] All components import correctly
- [ ] Build passes without errors
- [ ] No console errors in browser
- [ ] Animations smooth (60fps)
- [ ] Harvest ritual triggers correctly
- [ ] Credits calculated accurately
- [ ] All 5 biomas work
- [ ] All animal states render
- [ ] Responsive on mobile
- [ ] Accessibility tested

---

## Browser Compatibility

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
⚠️  IE 11 (not supported)
```

**SVG & Framer Motion support**:
- PathLength animation: Chrome 90+, Firefox 92+
- CSS transforms: all modern browsers
- requestAnimationFrame: all modern browsers

---

## Future Roadmap

### Phase 2 (Q2 2025)
- [ ] Auto-donation integration
- [ ] Certificado digital (PDF)
- [ ] Leaderboard system
- [ ] Advanced badges
- [ ] Biome background canvas integration

### Phase 3 (Q3 2025)
- [ ] Multiplayer garden
- [ ] Plant sharing economy
- [ ] Seasonal events
- [ ] Animal personality customization

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Maintainer**: Prana Team

---

*Build with intention. Grow with purpose. 🌱*
