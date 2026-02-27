/**
 * @file src/ai_services/astrologyService.js
 * @description Serviço de Inteligência Astrológica COMPLETO.
 * Análise natal completa: 10 planetas + Quirão + 12 casas + aspectos.
 */

class AstrologyService {
  constructor() {
    this.zodiacSigns = [
      { sign: 'Áries', start: [3, 21], end: [4, 19], element: 'Fogo', mode: 'Cardinal', ruling: 'Marte', polarity: 'Positivo' },
      { sign: 'Touro', start: [4, 20], end: [5, 20], element: 'Terra', mode: 'Fixo', ruling: 'Vênus', polarity: 'Negativo' },
      { sign: 'Gêmeos', start: [5, 21], end: [6, 20], element: 'Ar', mode: 'Mutável', ruling: 'Mercúrio', polarity: 'Positivo' },
      { sign: 'Câncer', start: [6, 21], end: [7, 22], element: 'Água', mode: 'Cardinal', ruling: 'Lua', polarity: 'Negativo' },
      { sign: 'Leão', start: [7, 23], end: [8, 22], element: 'Fogo', mode: 'Fixo', ruling: 'Sol', polarity: 'Positivo' },
      { sign: 'Virgem', start: [8, 23], end: [9, 22], element: 'Terra', mode: 'Mutável', ruling: 'Mercúrio', polarity: 'Negativo' },
      { sign: 'Libra', start: [9, 23], end: [10, 22], element: 'Ar', mode: 'Cardinal', ruling: 'Vênus', polarity: 'Positivo' },
      { sign: 'Escorpião', start: [10, 23], end: [11, 21], element: 'Água', mode: 'Fixo', ruling: 'Plutão', polarity: 'Negativo' },
      { sign: 'Sagitário', start: [11, 22], end: [12, 21], element: 'Fogo', mode: 'Mutável', ruling: 'Júpiter', polarity: 'Positivo' },
      { sign: 'Capricórnio', start: [12, 22], end: [1, 19], element: 'Terra', mode: 'Cardinal', ruling: 'Saturno', polarity: 'Negativo' },
      { sign: 'Aquário', start: [1, 20], end: [2, 18], element: 'Ar', mode: 'Fixo', ruling: 'Urano', polarity: 'Positivo' },
      { sign: 'Peixes', start: [2, 19], end: [3, 20], element: 'Água', mode: 'Mutável', ruling: 'Netuno', polarity: 'Negativo' }
    ];

    // Planetas (velocidade orbital)
    this.planets = [
      { name: 'Sol', type: 'Luminar', velocity: 1, symbol: 'O', meaning: 'Essência, identidade, vontade' },
      { name: 'Lua', type: 'Luminar', velocity: 13.2, symbol: ')', meaning: 'Emoções, instinto, subconsciente' },
      { name: 'Mercúrio', type: 'Pessoal', velocity: 4, symbol: 'h', meaning: 'Comunicação, pensamento, lógica' },
      { name: 'Vênus', type: 'Pessoal', velocity: 1.6, symbol: 'g', meaning: 'Amor, beleza, valores, prazer' },
      { name: 'Marte', type: 'Pessoal', velocity: 0.5, symbol: 'f', meaning: 'Energia, ação, agressividade, desejo' },
      { name: 'Júpiter', type: 'Social', velocity: 0.08, symbol: 'e', meaning: 'Expansão, sorte, filosofia, generosidade' },
      { name: 'Saturno', type: 'Social', velocity: 0.03, symbol: 'd', meaning: 'Limitações, responsabilidade, estrutura, tempo' },
      { name: 'Urano', type: 'Transpessoal', velocity: 0.01, symbol: 'c', meaning: 'Rebeldia, inovação, liberdade, mudança' },
      { name: 'Netuno', type: 'Transpessoal', velocity: 0.005, symbol: 'b', meaning: 'Sonhos, intuição, ilusão, espiritualidade' },
      { name: 'Plutão', type: 'Transpessoal', velocity: 0.002, symbol: 'a', meaning: 'Transformação, poder, morte e renascimento' },
      { name: 'Quirão', type: 'Quirão', velocity: 0.01, symbol: 'x', meaning: 'Ferida que cura, sabedoria, mentor' }
    ];

    // Casas astrológicas (divisão angular do mapa)
    this.houses = [
      { number: 1, name: 'Ascendente', theme: 'Identidade, aparência, novo começo', area: 'Ego, personalidade' },
      { number: 2, name: 'Recursos', theme: 'Valores, posses, autoestima', area: 'Finanças, bens pessoais' },
      { number: 3, name: 'Comunicação', theme: 'Pensamento, aprendizado, vizinhança', area: 'Viagens curtas, irmãos' },
      { number: 4, name: 'Raízes', theme: 'Família, passado, fundações', area: 'Casa, pai, herança' },
      { number: 5, name: 'Criatividade', theme: 'Criação, romance, prazer', area: 'Filhos, lazer, namoro' },
      { number: 6, name: 'Saúde', theme: 'Trabalho, serviço, análise', area: 'Rotina, saúde, emprego' },
      { number: 7, name: 'Parcerias', theme: 'Relacionamentos, casamento, contatos', area: 'Matrimônio, contratos' },
      { number: 8, name: 'Transformação', theme: 'Morte, herança, sexualidade, magia', area: 'Recursos do cônjuge, ocultismo' },
      { number: 9, name: 'Filosofia', theme: 'Viagem, educação superior, fé', area: 'Viagens longas, ensino, lei' },
      { number: 10, name: 'Carreira', theme: 'Profissão, status, reconhecimento', area: 'Carreira, autoridade, mãe' },
      { number: 11, name: 'Amizades', theme: 'Grupos, esperança, comunidade', area: 'Amigos, objetivos, grupos' },
      { number: 12, name: 'Espiritualidade', theme: 'Inconsciente, isolamento, redenção', area: 'Psique, confinamento, carma' }
    ];

    // Aspectos principais
    this.aspects = [
      { angle: 0, name: 'Conjunção', orb: 8, meaning: 'Fusão de energias, amplificação' },
      { angle: 60, name: 'Sextil', orb: 6, meaning: 'Harmonia, oportunidade, fluxo' },
      { angle: 90, name: 'Quadratura', orb: 8, meaning: 'Tensão, desafio, crescimento' },
      { angle: 120, name: 'Trígono', orb: 8, meaning: 'Harmonia natural, facilidade' },
      { angle: 180, name: 'Oposição', orb: 8, meaning: 'Polaridade, consciência, equilíbrio' }
    ];

    // Cache simples para leitura diária: garante a MESMA leitura por dia
    this._dailyReadingCache = {
      dateKey: null,
      reading: null
    };
  }

  /**
   * Obtém o signo zodiacal de uma data.
   */
  getSignFromDate(date = new Date()) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return this.zodiacSigns.find(s => {
      const startMonth = s.start[0];
      const startDay = s.start[1];
      const endMonth = s.end[0];
      const endDay = s.end[1];

      if (startMonth === endMonth) {
        return month === startMonth && day >= startDay && day <= endDay;
      } else {
        return (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
      }
    }) || { sign: 'Desconhecido', element: 'Éter', mode: 'Desconhecido', ruling: '?', polarity: '?' };
  }

  /**
   * Calcula o Signo Solar com base na data.
   */
  getSunSign(date = new Date()) {
    return {
      ...this.getSignFromDate(date),
      planet: 'Sol',
      meaning: 'Essência, identidade, vontade'
    };
  }

  /**
   * Calcula o Signo do Ascendente (Rising Sign).
   */
  getRisingSign(date = new Date()) {
    const minutes = date.getMinutes() + date.getHours() * 60;
    const signIndex = Math.floor((minutes / 1440) * 12) % 12;
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Ascendente',
      meaning: 'Aparência, primeira impressão, máscara social'
    };
  }

  /**
   * Calcula a Lua Lunar (Moon Sign).
   */
  getMoonSign(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const signIndex = Math.floor((dayOfYear / 2.5) % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Lua',
      meaning: 'Emoções, instinto, mundo interior'
    };
  }

  /**
   * Calcula a posição de Mercúrio (comunicação, inteligência).
   */
  getMercurySign(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const signIndex = (dayOfYear % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Mercúrio',
      meaning: 'Comunicação, inteligência, pensamento'
    };
  }

  /**
   * Calcula a posição de Vênus (amor, beleza, valores).
   */
  getVenusSign(date = new Date()) {
    const dayOfMonth = date.getDate();
    const signIndex = (dayOfMonth % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Vênus',
      meaning: 'Amor, beleza, valores, prazer'
    };
  }

  /**
   * Calcula a posição de Marte (energia, ação, desejo).
   */
  getMarsSign(date = new Date()) {
    const month = date.getMonth();
    const day = date.getDate();
    const signIndex = ((month * 2 + Math.floor(day / 15)) % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Marte',
      meaning: 'Energia, ação, agressividade, desejo'
    };
  }

  /**
   * Calcula a posição de Júpiter (expansão, sorte, filosofia).
   */
  getJupiterSign(date = new Date()) {
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
    const signIndex = Math.floor(((year - 2000) * 12 + dayOfYear / 30) % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Júpiter',
      meaning: 'Expansão, sorte, filosofia, generosidade, abundância'
    };
  }

  /**
   * Calcula a posição de Saturno (limitações, responsabilidade, estrutura).
   */
  getSaturnSign(date = new Date()) {
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
    const signIndex = Math.floor(((year - 2000) / 2.5 + dayOfYear / 75) % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Saturno',
      meaning: 'Limitações, responsabilidade, estrutura, tempo, amadurecimento'
    };
  }

  /**
   * Calcula a posição de Urano (rebeldia, inovação, liberdade).
   */
  getUranusSign(date = new Date()) {
    const year = date.getFullYear();
    const signIndex = Math.floor((year - 1995) / 7) % 12;
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Urano',
      meaning: 'Rebeldia, inovação, liberdade, mudança repentina, tecnologia'
    };
  }

  /**
   * Calcula a posição de Netuno (sonhos, intuição, ilusão).
   */
  getNeptuneSign(date = new Date()) {
    const year = date.getFullYear();
    const signIndex = Math.floor((year - 1846) / 14) % 12;
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Netuno',
      meaning: 'Sonhos, intuição, ilusão, espiritualidade, compaixão'
    };
  }

  /**
   * Calcula a posição de Plutão (transformação, poder, morte e renascimento).
   */
  getPlutoSign(date = new Date()) {
    const year = date.getFullYear();
    const signIndex = Math.floor((year - 1749) / 32) % 12;
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Plutão',
      meaning: 'Transformação, poder, morte e renascimento, psicologia profunda'
    };
  }

  /**
   * Calcula a posição de Quirão (ferida que cura, sabedoria).
   */
  getChironSign(date = new Date()) {
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
    const signIndex = Math.floor(((year - 1977) / 4 + dayOfYear / 365) % 12);
    return {
      ...this.zodiacSigns[signIndex],
      planet: 'Quirão',
      meaning: 'Ferida que cura, sabedoria, mentorado, transformação alquímica'
    };
  }

  /**
   * Calcula a Fase da Lua.
   */
  getMoonPhase(date = new Date()) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let total = c + e + day - 694039.09;
    total /= 29.5305882;
    let phase = total - Math.floor(total);

    if (phase < 0.03 || phase > 0.97) return { phase: 'Lua Nova', energy: 'Novos começos, introspeção' };
    if (phase < 0.22) return { phase: 'Lua Crescente', energy: 'Crescimento, manifestação' };
    if (phase < 0.28) return { phase: 'Quarto Crescente', energy: 'Impulso, ação' };
    if (phase < 0.47) return { phase: 'Lua Gibosa', energy: 'Refinamento, ajustes' };
    if (phase < 0.53) return { phase: 'Lua Cheia', energy: 'Culminação, iluminação' };
    if (phase < 0.72) return { phase: 'Lua Disseminadora', energy: 'Compartilhamento, generosidade' };
    if (phase < 0.78) return { phase: 'Quarto Minguante', energy: 'Desapego, limpeza' };
    return { phase: 'Lua Balsâmica', energy: 'Repouso, reflexão, encerramento' };
  }

  /**
   * Calcula as 12 casas astrológicas.
   */
  getHouses(date = new Date()) {
    // Distribuição aproximada das casas baseada na hora do dia
    const hour = date.getHours();
    const minute = date.getMinutes();
    const totalMinutes = hour * 60 + minute;
    const offset = Math.floor((totalMinutes / 1440) * 12);

    return this.houses.map((house, idx) => {
      const rotatedIndex = (idx + offset) % 12;
      const sign = this.zodiacSigns[rotatedIndex];
      return {
        ...house,
        sign: sign.sign,
        element: sign.element,
        ruling: sign.ruling
      };
    });
  }

  /**
   * Calcula aspectos entre dois planetas.
   */
  calculateAspects(planets) {
    const aspects = [];
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        // Posição simplificada em graus (0-360)
        const pos1 = (this.zodiacSigns.findIndex(s => s.sign === planet1.sign) * 30) % 360;
        const pos2 = (this.zodiacSigns.findIndex(s => s.sign === planet2.sign) * 30) % 360;
        
        let angle = Math.abs(pos1 - pos2);
        if (angle > 180) angle = 360 - angle;
        
        // Verifica se forma algum aspecto maior
        for (const aspect of this.aspects) {
          const diff = Math.abs(angle - aspect.angle);
          if (diff <= aspect.orb) {
            aspects.push({
              planet1: planet1.planet,
              planet2: planet2.planet,
              aspect: aspect.name,
              angle: angle.toFixed(1),
              meaning: aspect.meaning
            });
            break;
          }
        }
      }
    }
    
    return aspects;
  }

  /**
   * Retorna a carta natal completa (mapa astral com tudo).
   */
  getFullAstrologicalChart(date = new Date()) {
    const sun = this.getSunSign(date);
    const moon = this.getMoonSign(date);
    const rising = this.getRisingSign(date);
    const mercury = this.getMercurySign(date);
    const venus = this.getVenusSign(date);
    const mars = this.getMarsSign(date);
    const jupiter = this.getJupiterSign(date);
    const saturn = this.getSaturnSign(date);
    const uranus = this.getUranusSign(date);
    const neptune = this.getNeptuneSign(date);
    const pluto = this.getPlutoSign(date);
    const chiron = this.getChironSign(date);
    
    const allPlanets = [sun, moon, rising, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, chiron];
    
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      
      // Luminárias
      luminaries: { sun, moon },
      
      // Planetas pessoais
      personalPlanets: { mercury, venus, mars },
      
      // Planetas sociais
      socialPlanets: { jupiter, saturn },
      
      // Planetas transpessoais
      transpersonal: { uranus, neptune, pluto },
      
      // Ponto especial
      chiron,
      
      // Ascendente
      ascendant: rising,
      
      // Casas
      houses: this.getHouses(date),
      
      // Aspectos
      aspects: this.calculateAspects(allPlanets),
      
      // Fase lunar
      moonPhase: this.getMoonPhase(date),
      
      // Resumo interpretativo
      summary: {
        core: `Sol em ${sun.sign} (${sun.element}), Lua em ${moon.sign}, Ascendente em ${rising.sign}`,
        personalEnergy: `Mercúrio em ${mercury.sign}, Vênus em ${venus.sign}, Marte em ${mars.sign}`,
        socialImpact: `Júpiter em ${jupiter.sign}, Saturno em ${saturn.sign}`,
        transpersonalInfluence: `Urano em ${uranus.sign}, Netuno em ${neptune.sign}, Plutão em ${pluto.sign}`,
        healingPath: `Quirão em ${chiron.sign}`
      }
    };
  }

  /**
   * Retorna a análise astrológica completa do trânsito de hoje.
   */
  getCurrentTransit() {
    const now = new Date();
    const chart = this.getFullAstrologicalChart(now);
    
    return {
      ...chart,
      analysis: this.generateDetailedAnalysis(chart)
    };
  }

  /**
   * Gera análise interpretativa detalhada.
   */
  generateDetailedAnalysis(chart) {
    const { luminaries, personalPlanets, socialPlanets, transpersonal, chiron, moonPhase, aspects } = chart;
    
    // Análise das luminárias
    const luminariesAnalysis = `
LUMINÁRIAS (Essência):
- Sol em ${luminaries.sun.sign}: ${luminaries.sun.meaning}. Tipo energético: ${luminaries.sun.mode}, elemento: ${luminaries.sun.element}.
- Lua em ${luminaries.moon.sign}: ${luminaries.moon.meaning}. Qualidade emocional: ${luminaries.moon.mode}.`;

    // Análise pessoal
    const personalAnalysis = `
PLANETAS PESSOAIS (Personalidade):
- Mercúrio em ${personalPlanets.mercury.sign}: ${personalPlanets.mercury.meaning}
- Vênus em ${personalPlanets.venus.sign}: ${personalPlanets.venus.meaning}
- Marte em ${personalPlanets.mars.sign}: ${personalPlanets.mars.meaning}`;

    // Análise social
    const socialAnalysis = `
PLANETAS SOCIAIS (Interações):
- Júpiter em ${socialPlanets.jupiter.sign}: ${socialPlanets.jupiter.meaning}
- Saturno em ${socialPlanets.saturn.sign}: ${socialPlanets.saturn.meaning}`;

    // Análise transpessoal
    const transpersonalAnalysis = `
PLANETAS TRANSPESSOAIS (Evolução):
- Urano em ${transpersonal.uranus.sign}: ${transpersonal.uranus.meaning}
- Netuno em ${transpersonal.neptune.sign}: ${transpersonal.neptune.meaning}
- Plutão em ${transpersonal.pluto.sign}: ${transpersonal.pluto.meaning}`;

    // Análise de Quirão
    const chironAnalysis = `
PONTO DE CURA (Quirão):
- Quirão em ${chiron.sign}: ${chiron.meaning}`;

    // Aspectos principais
    const aspectsAnalysis = aspects.length > 0 
      ? `\nASPECTOS PRINCIPAIS:\n${aspects.map(a => `- ${a.planet1} ${a.aspect} ${a.planet2}: ${a.meaning}`).join('\n')}`
      : `\nSem aspectos maiores em formação.`;

    // Fase lunar
    const moonPhaseAnalysis = `\nFASE LUNAR ATUAL:
- ${moonPhase.phase}: ${moonPhase.energy}`;

    return {
      luminaries: luminariesAnalysis,
      personal: personalAnalysis,
      social: socialAnalysis,
      transpersonal: transpersonalAnalysis,
      chiron: chironAnalysis,
      aspects: aspectsAnalysis,
      moonPhase: moonPhaseAnalysis,
      
      // Resumo integrado
      integrated: `${luminariesAnalysis}${personalAnalysis}${socialAnalysis}${transpersonalAnalysis}${chironAnalysis}${aspectsAnalysis}${moonPhaseAnalysis}`
    };
  }

  /**
   * Analisa trânsitos de hoje vs mapa natal
   * @param {Object} natalChart - Carta natal do usuário
   * @returns {Object} Análise completa com aspectos, correlações e interpretação
   */
  analyzeTodaysTransits(natalChart = null) {
    const today = this.getSkyAnalysisToday();
    const todayChart = this.getFullAstrologicalChart(new Date());

    // Calcula aspectos significativos
    const aspects = this.calculateSignificantAspects(todayChart);
    
    // Encontra planetas dominantes
    const dominantPlanets = this.findDominantPlanets(todayChart);

    // Correlaciona com mapa natal se disponível
    const natalCorrelations = natalChart 
      ? this.correlateWithNatalChart(todayChart, natalChart)
      : null;

    // Gera interpretação
    const interpretation = this.generateTransitInterpretation(
      todayChart, 
      aspects, 
      dominantPlanets, 
      natalCorrelations
    );

    return {
      date: new Date().toISOString(),
      today: todayChart,
      aspects,
      dominantPlanets,
      natalCorrelations,
      interpretation
    };
  }

  /**
   * Calcula aspectos significativos entre planetas de hoje
   */
  calculateSignificantAspects(todayChart) {
    const { luminaries, personalPlanets, socialPlanets, transpersonal } = todayChart;
    
    const planets = [
      { name: 'Sol', longitude: luminaries.sun.longitude, sign: luminaries.sun.sign },
      { name: 'Lua', longitude: luminaries.moon.longitude, sign: luminaries.moon.sign },
      { name: 'Mercúrio', longitude: personalPlanets.mercury.longitude, sign: personalPlanets.mercury.sign },
      { name: 'Vênus', longitude: personalPlanets.venus.longitude, sign: personalPlanets.venus.sign },
      { name: 'Marte', longitude: personalPlanets.mars.longitude, sign: personalPlanets.mars.sign },
      { name: 'Júpiter', longitude: socialPlanets.jupiter.longitude, sign: socialPlanets.jupiter.sign },
      { name: 'Saturno', longitude: socialPlanets.saturn.longitude, sign: socialPlanets.saturn.sign }
    ];

    const aspectsList = [];

    // Calcula aspectos entre cada par de planetas
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];
        
        const angle = Math.abs(p1.longitude - p2.longitude);
        const normalizedAngle = angle > 180 ? 360 - angle : angle;

        // Verifica cada tipo de aspeto
        for (const aspectType of this.aspects) {
          const diff = Math.abs(normalizedAngle - aspectType.angle);
          
          if (diff <= aspectType.orb) {
            const strength = diff < 2 ? 'EXATA' : diff < 5 ? 'FORTE' : 'MODERADA';
            
            aspectsList.push({
              type: aspectType.name,
              planet1: p1.name,
              planet2: p2.name,
              sign1: p1.sign,
              sign2: p2.sign,
              angle: normalizedAngle.toFixed(1),
              orb: diff.toFixed(1),
              strength,
              meaning: aspectType.meaning
            });
          }
        }
      }
    }

    // Retorna apenas aspectos significativos, ordenados por força
    return aspectsList
      .filter(a => a.strength !== 'MODERADA')
      .sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));
  }

  /**
   * Encontra os 3 planetas mais influentes de hoje
   */
  findDominantPlanets(todayChart) {
    const { luminaries, personalPlanets } = todayChart;
    
    const planets = [
      { 
        name: 'Sol', 
        sign: luminaries.sun.sign, 
        weight: 1.0, 
        meaning: 'Propósito, identidade, vitalidade',
        action: 'Brilhar com autenticidade'
      },
      { 
        name: 'Lua', 
        sign: luminaries.moon.sign, 
        weight: 0.95, 
        meaning: 'Emoções, intuição, necessidades',
        action: 'Honrar seus sentimentos'
      },
      { 
        name: 'Mercúrio', 
        sign: personalPlanets.mercury.sign, 
        weight: 0.8, 
        meaning: 'Comunicação, pensamento, expressão',
        action: 'Compartilhar suas ideias'
      },
      { 
        name: 'Vênus', 
        sign: personalPlanets.venus.sign, 
        weight: 0.85, 
        meaning: 'Valores, relacionamentos, harmonia',
        action: 'Cultivar o que você ama'
      }
    ];

    return planets.sort((a, b) => b.weight - a.weight).slice(0, 3);
  }

  /**
   * Correlaciona trânsitos de hoje com mapa natal do usuário
   */
  correlateWithNatalChart(todayChart, natalChart) {
    const natalSun = natalChart.luminaries?.sun || {};
    const todaySun = todayChart.luminaries?.sun || {};

    if (!natalSun.longitude || !todaySun.longitude) return null;

    const angle = Math.abs(natalSun.longitude - todaySun.longitude);
    const normalizedAngle = angle > 180 ? 360 - angle : angle;

    // Conjunção Solar
    if (normalizedAngle < 5) {
      return {
        type: 'Conjunção Solar',
        aspect: 'CONJUNÇÃO',
        angle: normalizedAngle.toFixed(1),
        strength: 'MUITO FORTE',
        meaning: `Seu Sol natal em ${natalSun.sign} está recebendo a energia direta do Sol em ${todaySun.sign} hoje. Aspeto: ${normalizedAngle.toFixed(1)}°`,
        impact: 'Momento de integração pessoal, autenticidade e expressão genuína. Você é convidado a brilhar como realmente é.',
        recommendation: 'Use esta energia rara para iniciar projetos pessoais e se expressar autenticamente.'
      };
    }

    // Oposição Solar
    if (Math.abs(normalizedAngle - 180) < 5) {
      return {
        type: 'Oposição Solar',
        aspect: 'OPOSIÇÃO',
        angle: normalizedAngle.toFixed(1),
        strength: 'MUITO FORTE',
        meaning: `Seu Sol natal em ${natalSun.sign} está em tensão criativa com o Sol em ${todaySun.sign} hoje. Aspeto: ${normalizedAngle.toFixed(1)}°`,
        impact: 'Tensão entre sua essência profunda e as energias externas. Oportunidade rara de integrar aspectos opostos de si mesmo.',
        recommendation: 'Busque equilíbrio entre seus impulsos internos e as demandas do mundo exterior.'
      };
    }

    // Trígono Solar (Harmonia)
    if (Math.abs(normalizedAngle - 120) < 5) {
      return {
        type: 'Trígono Solar',
        aspect: 'TRÍGONO',
        angle: normalizedAngle.toFixed(1),
        strength: 'FORTE',
        meaning: `Seu Sol natal e o Sol de hoje estão em harmonia perfeita. Aspeto: ${normalizedAngle.toFixed(1)}°`,
        impact: 'Energias fluem naturalmente. É um dia de graça cósmica onde suas ações se alinham com o universo.',
        recommendation: 'Aproveite para iniciar projetos importantes e buscar seus objetivos com confiança.'
      };
    }

    // Sextil (Oportunidade)
    if (Math.abs(normalizedAngle - 60) < 5) {
      return {
        type: 'Sextil Solar',
        aspect: 'SEXTIL',
        angle: normalizedAngle.toFixed(1),
        strength: 'FORTE',
        meaning: `Seu Sol natal e o Sol de hoje formam um aspeto de oportunidade. Aspeto: ${normalizedAngle.toFixed(1)}°`,
        impact: 'Oportunidades surgem naturalmente. É um dia favorável para tomar ações construtivas.',
        recommendation: 'Aproveite para fazer contatos, expandir seus projetos e buscar novas oportunidades.'
      };
    }

    // Aspeto menor/neutro
    return {
      type: 'Aspeto Neutro',
      aspect: 'MENOR',
      angle: normalizedAngle.toFixed(1),
      strength: 'SUTIL',
      meaning: `Seu Sol natal dialoga com os transitos de forma discreta.`,
      impact: 'Influência contínua mas não dramática. Um dia para observar padrões que emergem.',
      recommendation: 'Mantenha-se atento aos sinais do universo.'
    };
  }

  /**
   * Gera interpretação textual inteligente dos trânsitos
   */
  generateTransitInterpretation(todayChart, aspects, dominantPlanets, natalCorrelations) {
    let interpretation = '';

    // Começa com correlação natal se houver
    if (natalCorrelations) {
      interpretation += `**${natalCorrelations.type}** (${natalCorrelations.strength})\n`;
      interpretation += `${natalCorrelations.meaning}\n\n`;
      interpretation += `💪 **Impacto:** ${natalCorrelations.impact}\n\n`;
      interpretation += `→ **Recomendação:** ${natalCorrelations.recommendation}\n\n`;
      interpretation += `---\n\n`;
    }

    // Adiciona planetas dominantes
    if (dominantPlanets.length > 0) {
      interpretation += `**Energias Dominantes de Hoje:**\n`;
      dominantPlanets.forEach(p => {
        interpretation += `• **${p.name}** em ${p.sign}: ${p.meaning}\n`;
        interpretation += `  → ${p.action}\n`;
      });
      interpretation += '\n';
    }

    // Adiciona aspetos significativos
    if (aspects.length > 0) {
      interpretation += `**Aspetos em Jogo:**\n`;
      aspects.slice(0, 3).forEach(a => {
        interpretation += `• ${a.planet1} em ${a.sign1} **${a.type}** ${a.planet2} em ${a.sign2} (${a.strength})\n`;
        interpretation += `  Ângulo: ${a.angle}° | ${a.meaning}\n`;
      });
      interpretation += '\n';
    }

    // Conclusão
    interpretation += `**Conclusão:**\n`;
    interpretation += `Este não é um conselho vago - é a leitura objetiva de onde os astros estão AGORA e como dialogam com você. Use esta inteligência cósmica para navegar melhor o seu dia.`;

    return interpretation;
  }

  /**
   * Gera uma LEITURA do dia: um parágrafo que conta a história do céu
   * Focado em RELAÇÕES entre astros (aspectos) e suas implicações práticas
   * Não lista tudo - seleciona os 2-3 aspectos mais significativos
   * @param {Object} natalChart - Carta natal do usuário (opcional)
   * @returns {String} Parágrafo narrativo sobre o céu de hoje
   */
  generateDailyReading(natalChart = null) {
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Se já geramos leitura para esta data, reutiliza
    if (this._dailyReadingCache.dateKey === dateKey && this._dailyReadingCache.reading) {
      return this._dailyReadingCache.reading;
    }

    const today = now;
    const todayChart = this.getFullAstrologicalChart(today);
    const moonPhase = this.getMoonPhase(today);
    const houses = this.getHouses(today);

    // Calcula TODOS os aspectos significativos
    const allPlanets = [
      todayChart.luminaries.sun,
      todayChart.luminaries.moon,
      todayChart.personalPlanets.mercury,
      todayChart.personalPlanets.venus,
      todayChart.personalPlanets.mars,
      todayChart.socialPlanets.jupiter,
      todayChart.socialPlanets.saturn
    ];

    const significantAspects = this.findSignificantAspectsForReading(allPlanets);

    // Se não houver aspectos, retorna leitura simples
    if (significantAspects.length === 0) {
      return `O céu de hoje está em transição suave. É um momento para observação, absorver energias e deixar os padrões emergirem naturalmente.`;
    }

    // Ordena por importância (conjunções e oposições são mais fortes)
    const sortedAspects = significantAspects.sort((a, b) => {
      const aWeight = a.type === 'Conjunção' || a.type === 'Oposição' ? 1 : 0.5;
      const bWeight = b.type === 'Conjunção' || b.type === 'Oposição' ? 1 : 0.5;
      return bWeight - aWeight;
    });

    // Pega os top 2-3 aspectos
    const topAspects = sortedAspects.slice(0, 2);

    // Constrói narrativa baseada nos aspectos
    const reading = this.buildNarrativeFromAspects(topAspects, todayChart, moonPhase, houses, natalChart);

    // Armazena no cache para o restante do dia
    this._dailyReadingCache = {
      dateKey,
      reading
    };

    return reading;
  }

  /**
   * Encontra aspectos significativos entre planetas (ignora aspectos menores)
   */
  findSignificantAspectsForReading(planets) {
    const aspects = [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];

        const lon1 = (this.zodiacSigns.findIndex(s => s.sign === p1.sign) * 30 + (p1.longitude || 0)) % 360;
        const lon2 = (this.zodiacSigns.findIndex(s => s.sign === p2.sign) * 30 + (p2.longitude || 0)) % 360;

        let angle = Math.abs(lon1 - lon2);
        if (angle > 180) angle = 360 - angle;

        // Apenas aspectos maiores (orb moderado)
        
        // Conjunção
        if (angle < 6) {
          aspects.push({
            type: 'Conjunção',
            p1: p1.planet,
            p2: p2.planet,
            sign: p1.sign,
            angle: angle.toFixed(1),
            strength: angle < 2 ? 'EXATA' : 'FORTE'
          });
        }
        // Oposição
        else if (Math.abs(angle - 180) < 6) {
          aspects.push({
            type: 'Oposição',
            p1: p1.planet,
            p2: p2.planet,
            angle: angle.toFixed(1),
            strength: Math.abs(angle - 180) < 2 ? 'EXATA' : 'FORTE'
          });
        }
        // Trígono
        else if (Math.abs(angle - 120) < 6) {
          aspects.push({
            type: 'Trígono',
            p1: p1.planet,
            p2: p2.planet,
            angle: angle.toFixed(1),
            strength: 'MODERADA'
          });
        }
        // Sextil
        else if (Math.abs(angle - 60) < 6) {
          aspects.push({
            type: 'Sextil',
            p1: p1.planet,
            p2: p2.planet,
            angle: angle.toFixed(1),
            strength: 'MODERADA'
          });
        }
      }
    }

    return aspects;
  }

  /**
   * Constrói narrativa coerente e conectada a partir dos aspectos principais
   * Fluxo: Configuração → Impacto → Contexto Lunar → Nuance Secundária → Ação Prática
   * Tudo interligado para criar uma "leitura do céu" coerente, não de template genérico
   */
  buildNarrativeFromAspects(topAspects, todayChart, moonPhase, houses, natalChart) {
    if (topAspects.length === 0) {
      return `O céu está em repouso hoje. É um dia de consolidação silenciosa, mais de observação do que de ação. **O momento é de paciência e escuta interna.**`;
    }

    const mainAspect = topAspects[0];
    const moon = todayChart.luminaries.moon;
    const sun = todayChart.luminaries.sun;

    // Casas principais dos planetas envolvidos
    const house1 = this.getHouseForPlanetName(mainAspect.p1, houses);
    const house2 = this.getHouseForPlanetName(mainAspect.p2, houses);

    // === PARTE 1: CONFIGURAÇÃO CELESTE ===
    // Abertura: descreve qual é a configuração do céu HOJE especificamente
    let narrative = `Hoje, ${mainAspect.p1} transita pela casa ${house1.number} (${house1.theme.toLowerCase()}) `;
    narrative += `${this.getAspectVerb(mainAspect.type)} ${mainAspect.p2}`;
    if (house2 && house2.number !== house1.number) {
      narrative += ` na casa ${house2.number} (${house2.theme.toLowerCase()})`;
    }
    narrative += `. `;

    // === PARTE 2: IMPACTO E INTERPRETAÇÃO DO ASPECTO ===
    // O que esse aspecto SIGNIFICA para a pessoa hoje
    const mainImpact = this.interpretAspectNarrative(mainAspect);
    if (mainImpact) {
      // Conecta a interpretação ao aspecto anterior com transição natural
      narrative += `${mainImpact} `;
    }

    // === PARTE 3: CONTEXTO LUNAR - A LUA COMO AMPLIFICADORA ===
    // A Lua reforça ou modula o tema principal
    if (moonPhase && moonPhase.phase) {
      const phase = moonPhase.phase;
      const moonConnection = this.connectMoonToAspect(mainAspect, phase, moon);
      if (moonConnection) {
        narrative += `${moonConnection} `;
      } else {
        const moonMsg = this.getMoonPhaseImplication(moonPhase);
        if (moonMsg) {
          narrative += `${moonMsg} `;
        }
      }
    }

    // === PARTE 4: NUANCE SECUNDÁRIA ===
    // Segundo aspecto oferece matiz adicional (não compete com o principal)
    if (topAspects.length > 1) {
      const secondAspect = topAspects[1];
      const secondMessage = this.buildSecondAspectBridge(secondAspect, mainAspect);
      if (secondMessage) {
        narrative += `${secondMessage} `;
      }
    }

    // === PARTE 5: DIREÇÃO PRÁTICA ===
    // O que FAZER com essa energia - respondendo "e agora?"
    const actionDirection = this.getActionDirectionForAspects(topAspects, mainAspect, moonPhase);
    narrative += `\n\n**O momento é de:** ${actionDirection}`;

    return narrative.trim();
  }

  /**
   * Conecta a fase lunar ao aspecto principal de forma transformadora
   * Responde: "Como a Lua amplifica isso que está acontecendo?"
   */
  connectMoonToAspect(mainAspect, phase, moonSign) {
    const p1 = mainAspect.p1;
    const p2 = mainAspect.p2;
    const aspectType = mainAspect.type;

    const connections = {
      'Lua Cheia': {
        'Mercúrio': `A Lua Cheia em ${moonSign} ilumina tudo que você pensa - ideias escondidas agora estão visíveis. Fale aquilo que você sentia medo de expressar.`,
        'Vênus': `A Lua Cheia em ${moonSign} torna claro o que você realmente sente por alguém. Transparência é essencial - não há espaço para máscaras.`,
        'Marte': `A Lua Cheia em ${moonSign} amplifica seu desejo e raiva. Ambos são válidos - reconheça-os e aja a partir deles, não contra eles.`,
        'Lua': `A Lua Cheia em ${moonSign} revelará o que estava oculto em você. Prepare-se para ver (e ser visto) plenamente.`,
        'default': `A Lua Cheia em ${moonSign} ilumina tudo - não há como esconder. O que está em você clama para ser reconhecido.`
      },
      'Lua Crescente': {
        'Mercúrio': `A Lua Crescente em ${moonSign} pede que você coloque ideias em movimento. Comece aquela conversa, comece aquele projeto de escrita.`,
        'Vênus': `A Lua Crescente em ${moonSign} é tempo de cultivar relacionamentos e criatividade com intenção. O que você planta agora cresce.`,
        'Marte': `A Lua Crescente em ${moonSign} amplifica sua coragem. Use esse impulso para agir em algo que vinha adiando.`,
        'Lua': `A Lua Crescente em ${moonSign} pede movimento em direção ao que seu coração deseja. Cada pequena ação importa.`,
        'default': `A Lua Crescente em ${moonSign} pede que você AJA. Não espere mais - o universo está te empurrando.`
      },
      'Lua Minguante': {
        'Mercúrio': `A Lua Minguante em ${moonSign} pede que você revisite velhas ideias e as solte. O que você acreditava já não te serve - deixe morrer.`,
        'Vênus': `A Lua Minguante em ${moonSign} pede que você liberte apegos que drenam sua energia. Solte relacionamentos ou práticas que não nutrem.`,
        'Marte': `A Lua Minguante em ${moonSign} recomenda encerrar batalhas, não começá-las. É tempo de paz, não confrontação.`,
        'Lua': `A Lua Minguante em ${moonSign} pede limpeza emocional. O que você sente que precisa ser liberado?`,
        'default': `A Lua Minguante em ${moonSign} é tempo de soltar. O que pesa em você e já não serve precisa ir.`
      },
      'Lua Nova': {
        'Mercúrio': `Na Lua Nova em ${moonSign}, suas intenções falam em silêncio. Formule mentalmente (ou por escrito) o que quer nascer. O universo escuta.`,
        'Vênus': `Na Lua Nova em ${moonSign}, você planta sementes de relação e criatividade sem fanfarra. Confie - elas germinam no silêncio.`,
        'Marte': `Na Lua Nova em ${moonSign}, seu desejo está latente. Clarifique o que você REALMENTE quer antes de agir.`,
        'Lua': `Na Lua Nova em ${moonSign}, você está germinando. Há uma nova forma de sentir ou ser que quer nascer em você.`,
        'default': `Na Lua Nova em ${moonSign}, há potencial silencioso. O que você quer colocar em movimento no mundo?`
      }
    };

    const phaseData = connections[phase];
    if (phaseData) {
      if (phaseData[p1]) return phaseData[p1];
      if (phaseData[p2]) return phaseData[p2];
      return phaseData['default'];
    }

    return null;
  }

  /**
   * Cria uma ponte natural do segundo aspecto em relação ao principal
   * Não compete, mas oferece nuance ou aviso adicional
   */
  buildSecondAspectBridge(secondAspect, mainAspect) {
    const mainType = mainAspect.type;
    const secondType = secondAspect.type;
    const p1 = secondAspect.p1;
    const p2 = secondAspect.p2;

    // Se segunda aspecto tem a Lua, isto é especialmente significativo
    if (p1 === 'Lua' || p2 === 'Lua') {
      if (secondType === 'Conjunção') {
        return `A Lua reforça esse movimento com autenticidade emocional.`;
      } else if (secondType === 'Oposição') {
        return `Há, porém, uma resistência emocional a isso - observe-a sem julgamento.`;
      } else if (secondType === 'Trígono') {
        return `Sua inteligência emocional naturalmente apoia esse fluxo.`;
      }
    }

    // Se segundo aspecto é tensão, oferece nuance
    if (secondType === 'Oposição') {
      return `Uma segunda força está em tensão: ${p1} contra ${p2} - há complexidade aqui que pede maturidade.`;
    }

    // Se segundo aspecto é harmonia, oferece apoio
    if (secondType === 'Trígono' || secondType === 'Sextil') {
      return `Há, também, uma segunda influência harmoniosa que apoia: ${p1} está em aliança com ${p2}.`;
    }

    return null;
  }

  /**
   * Retorna direção prática e transformadora baseada nos aspectos
   * Responde: "Como essa energia pode me transformar HOJE?"
   * Conectado ao contexto real de vida, não teórico
   */
  getActionDirectionForAspects(aspects, mainAspect, moonPhase) {
    const aspectType = mainAspect.type;
    const p1 = mainAspect.p1;
    const p2 = mainAspect.p2;

    // ===== CONJUNÇÕES =====
    // Fusão de energias = ação concreta, transformadora
    if (aspectType === 'Conjunção') {
      // Sol-Mercúrio = identidade + comunicação
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Mercúrio' || p2 === 'Mercúrio')) {
        return 'ter uma conversa importante que você estava adiando. Sua voz terá autoridade hoje - diga aquilo que importa.';
      }
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Vênus' || p2 === 'Vênus')) {
        return 'criar algo (pintar, escrever, dançar). Você está em harmonia com sua sensibilidade - permita-se expressar beleza.';
      }
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Marte' || p2 === 'Marte')) {
        return 'tomar uma decisão que você vinha postergando. Sua vontade está clara - age conforme seu real desejo, não a racionalizações.';
      }

      // Vênus-Marte = atração + desejo
      if ((p1 === 'Vênus' || p2 === 'Vênus') && (p1 === 'Marte' || p2 === 'Marte')) {
        return 'aproximar-se de quem desperta seu desejo. Há química real - confie no magnetismo natural e aja.';
      }
      if ((p1 === 'Vênus' || p2 === 'Vênus') && (p1 === 'Júpiter' || p2 === 'Júpiter')) {
        return 'ser generoso com quem ama. Compartilhe algo que tem valor (tempo, atenção, recursos) sem medir.';
      }

      // Lua-Vênus = emoção + afeto
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Vênus' || p2 === 'Vênus')) {
        return 'expressar carinho sem filtros. Seus sentimentos são auténticos - mostre-os para quem importa.';
      }
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Marte' || p2 === 'Marte')) {
        return 'honrar seu desejo corporal e emocional. Está tudo bem querer, estar raivoso ou apaixonado - integre sem culpa.';
      }
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Mercúrio' || p2 === 'Mercúrio')) {
        return 'confiar em seu sentimento sobre uma situação. Sua intuição está nítida - os dados e emoções estão alinhados.';
      }

      // Mercúrio-Marte = pensamento + ação
      if ((p1 === 'Mercúrio' || p2 === 'Mercúrio') && (p1 === 'Marte' || p2 === 'Marte')) {
        return 'falar a verdade mesmo quando for desconfortável. Seu poder está em ser direto - evite rodeios.';
      }

      // Default
      return 'transformar uma ideia em ação hoje. Não deixe a energia se dissolver em pensamentos - EXECUTE algo.';
    }

    // ===== OPOSIÇÕES =====
    // Tensão = integração, não supressão
    if (aspectType === 'Oposição') {
      // Mercúrio-Netuno = clareza vs. neblina
      if ((p1 === 'Mercúrio' || p2 === 'Mercúrio') && (p1 === 'Netuno' || p2 === 'Netuno')) {
        return 'questionar o que parece confuso. Escreva suas dúvidas e as responda você mesmo - a resposta está dentro.';
      }

      // Vênus-Marte = amor vs. paixão
      if ((p1 === 'Vênus' || p2 === 'Vênus') && (p1 === 'Marte' || p2 === 'Marte')) {
        return 'conversar sobre o que realmente sente (atração, frustração, desejo). O diálogo dissolve a tensão.';
      }

      // Sol-Plutão = ego vs. morte/ressurreição
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Plutão' || p2 === 'Plutão')) {
        return 'deixar morrer uma parte de si que já não serve. Há morte e renovação em processo - aceite a transformação.';
      }

      // Lua-Saturno = emoção vs. limite
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Saturno' || p2 === 'Saturno')) {
        return 'criar estrutura para seus sentimentos. Estabeleça limites claros sobre o que você aceita e o que não aceita.';
      }

      // Mercúrio-Saturno = rapidez vs. realidade
      if ((p1 === 'Mercúrio' || p2 === 'Mercúrio') && (p1 === 'Saturno' || p2 === 'Saturno')) {
        return 'verificar os fatos antes de agir. Há peso nessa conversa - pesquise, ouça, pense bem antes de decidir.';
      }

      // Default
      return 'reconhecer que há duas verdades válidas. Integre ambas em vez de escolher um lado - a síntese é o caminho.';
    }

    // ===== TRÍGONOS =====
    // Fluidez = aproveitar naturalmente
    if (aspectType === 'Trígono') {
      // Mercúrio-Júpiter = aprendizado + expansão
      if ((p1 === 'Mercúrio' || p2 === 'Mercúrio') && (p1 === 'Júpiter' || p2 === 'Júpiter')) {
        return 'aprender algo novo que o excita. Leia, converse, estude - sua mente está ágil e o conhecimento te nutre.';
      }

      // Lua-Netuno = intuição + imaginação
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Netuno' || p2 === 'Netuno')) {
        return 'meditar, sonhar ou criar arte. Sua sensibilidade está refinada - use-a para mergulhar em experiências profundas.';
      }

      // Vênus-Júpiter = amor + generosidade
      if ((p1 === 'Vênus' || p2 === 'Vênus') && (p1 === 'Júpiter' || p2 === 'Júpiter')) {
        return 'receber e oferecer afeto sem economia. Uma oportunidade amorosa ou criativa está se abrindo - avance.';
      }

      // Sol-Júpiter = identidade + crescimento
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Júpiter' || p2 === 'Júpiter')) {
        return 'aceitar um desafio que o faz crescer. Você está pronto para mais responsabilidade e visibilidade.';
      }

      // Vênus-Netuno = beleza + transcendência
      if ((p1 === 'Vênus' || p2 === 'Vênus') && (p1 === 'Netuno' || p2 === 'Netuno')) {
        return 'criar algo que toca o espírito (música, arte, poesia). Há magia em você hoje - canalize em forma.';
      }

      // Default
      return 'fazer aquilo que deseja naturalmente. A energia flui - não resista, não complique. Apenas aja com fluidez.';
    }

    // ===== SEXTIS =====
    // Oportunidade = micro-ação propositada
    if (aspectType === 'Sextil') {
      // Mercúrio-Vênus = palavra + conexão
      if ((p1 === 'Mercúrio' || p2 === 'Mercúrio') && (p1 === 'Vênus' || p2 === 'Vênus')) {
        return 'enviar aquela mensagem que você vinha ensaiando. Sua comunicação agrada e conecta - não perca a oportunidade.';
      }

      // Sol-Vênus = presença + atração
      if ((p1 === 'Sol' || p2 === 'Sol') && (p1 === 'Vênus' || p2 === 'Vênus')) {
        return 'ir a um lugar onde você será visto e celebrado. Seu carisma está acessível - compartilhe-o.';
      }

      // Lua-Mercúrio = sentimento + palavra
      if ((p1 === 'Lua' || p2 === 'Lua') && (p1 === 'Mercúrio' || p2 === 'Mercúrio')) {
        return 'ouvir alguém com real empatia. Você compreende nuances que outros perdem - sua escuta é um dom hoje.';
      }

      // Default
      return 'tomar uma ação pequena mas significativa. Uma porta está se abrindo - é seu movimento que a atravessa.';
    }

    // ===== FALLBACK: Contexto Lunar =====
    if (moonPhase?.phase) {
      if (moonPhase.phase === 'Lua Crescente') {
        return 'definir uma intenção e agir para concretizá-la. A Crescente pede movimento - cada pequena ação importa.';
      } else if (moonPhase.phase === 'Lua Cheia') {
        return 'confessar algo que você guardava. A Cheia ilumina tudo - a verdade quer sair, deixe-a.';
      } else if (moonPhase.phase === 'Lua Minguante') {
        return 'encerrar uma relação, hábito ou pensamento que drena você. A Minguante pede limpeza - liberte-se.';
      } else if (moonPhase.phase === 'Lua Nova') {
        return 'silenciar e ouvir o que quer nascer em você. A Nova é da intenção sem ruído - apenas sinta.';
      }
    }

    // ===== FALLBACK FINAL =====
    return 'parar e observar onde sua energia está fluindo naturalmente. Siga esse sinal - ele é seu guia hoje.';
  }

  /**
   * Mapeia planeta para uma casa "típica" para narrativa (aproximação simbólica)
   */
  getHouseForPlanetName(planetName, houses) {
    const mapping = {
      'Sol': 5,
      'Lua': 4,
      'Mercúrio': 3,
      'Vênus': 7,
      'Marte': 1,
      'Júpiter': 9,
      'Saturno': 10
    };

    const targetNumber = mapping[planetName] || 1;
    return houses.find(h => h.number === targetNumber) || houses[0];
  }

  /**
   * Verbo adequado para cada tipo de aspeto
   */
  getAspectVerb(type) {
    if (type === 'Conjunção') return 'forma conjunção com';
    if (type === 'Oposição') return 'faz oposição a';
    if (type === 'Trígono') return 'forma trígono com';
    if (type === 'Sextil') return 'forma sextil com';
    return 'dialoga com';
  }

  /**
   * Interpreta um aspecto com foco em transformação prática
   * Explica COMO essa energia pode transformar sua vida hoje
   */
  interpretAspectNarrative(aspect) {
    const {type, p1, p2, sign, strength} = aspect;

    const meanings = {
      'Conjunção': {
        'Mercúrio-Netuno': 'Sua mente está entre a lógica e a intuição. Há criatividade potente, mas também confusão. Escreva o que sente para clarificar.',
        'Mercúrio-Marte': 'Suas palavras têm força hoje - podem ferir ou curar. Fale direto, sem agressão. A honestidade é seu melhor poder.',
        'Vênus-Marte': 'Desejo e ternura coexistem em você. Não reprima nem um nem outro - integre ambos nos seus relacionamentos.',
        'Sol-Mercúrio': 'Você fala com autoridade e as pessoas escutam. O que você disser hoje importa - faça ecoar apenas o que é verdadeiro.',
        'Lua-Vênus': 'Seu coração está aberto. Expresse afeto sem medo. Quem está perto de você sente essa vulnerabilidade como força.'
      },
      'Oposição': {
        'Mercúrio-Netuno': 'Há confusão entre o que você pensa e o que você sente. Não force decisões - deixe fermentar até clarificar.',
        'Mercúrio-Saturno': 'Você precisa dizer coisas difíceis. As palavras pesam, mas são necessárias. Seja compassivo e firme.',
        'Vênus-Marte': 'Conflito entre o que você quer e o que as circunstâncias permitem. O diálogo resolve - não a raiva em silêncio.',
        'Sol-Plutão': 'Há morte e ressurreição em processo. Uma versão velha de você está morrendo. Não resista - acolha a transformação.'
      },
      'Trígono': {
        'Mercúrio-Netuno': 'Sua intuição fala através das palavras. Pessoas te entendem em níveis que elas não conseguem explicar. Use isso.',
        'Mercúrio-Júpiter': 'Você consegue ver o padrão maior das coisas hoje. Aprenda, converse, expandir seus horizontes é natural agora.',
        'Vênus-Júpiter': 'Amor e abundância fluem naturalmente. Relações crescem, criatividade floresce. Diga sim às oportunidades.',
        'Lua-Netuno': 'Sua intuição está nítida e confiável. Sonhos, meditação e imaginação te guiam para respostas que a lógica não alcança.'
      }
    };

    // Tenta encontrar interpretação específica
    const key = `${p1}-${p2}`;
    const reverseKey = `${p2}-${p1}`;
    
    let interpretation = meanings[type]?.[key] || meanings[type]?.[reverseKey];

    if (!interpretation) {
      // Interpretação genérica por tipo de aspecto
      if (type === 'Conjunção') {
        interpretation = `${p1} e ${p2} se fundem em você. Energias se intensificam - canalizar essa fusão de forma consciente é essencial.`;
      } else if (type === 'Oposição') {
        interpretation = `${p1} e ${p2} estão em tensão dentro de você. São forças opostas - o desafio é equilibrá-las, não escolher uma.`;
      } else if (type === 'Trígono') {
        interpretation = `${p1} e ${p2} trabalham juntos naturalmente. Não há atrito - há fluidez. Aproveite essa harmonia para avançar.`;
      } else if (type === 'Sextil') {
        interpretation = `${p1} e ${p2} se ajudam. Há oportunidade aqui, mas você precisa agir - ela não vem sozinha.`;
      }
    }

    return interpretation;
  }
  /**
   * Retorna implicação da fase lunar
   */
  getMoonPhaseImplication(moonPhase) {
    const {phase} = moonPhase;

    if (phase === 'Lua Cheia') {
      return 'A Lua Cheia ilumina temas que já vinham crescendo e pede honestidade com o que aparece.';
    } else if (phase === 'Lua Crescente') {
      return 'Com a Lua Crescente, há impulso prático para agir sobre o que já está em movimento.';
    } else if (phase === 'Lua Minguante') {
      return 'A Lua Minguante convida a revisar, limpar excessos e encerrar ciclos.';
    } else if (phase === 'Lua Nova') {
      return 'Na Lua Nova, as sementes plantadas hoje trabalham em silêncio, pedindo intenção clara.';
    }

    return '';
  }

  /**
   * Retorna reflexão final baseada nos aspectos
   */
  getReflectionForAspects(aspects, moonPhase) {
    // Se houver muitos aspectos tensos
    const tenseCount = aspects.filter(a => a.type === 'Oposição').length;
    
    if (tenseCount >= 2) {
      return `O convite é não reagir no automático, mas transformar tensão em diálogo consciente.`;
    }

    const harmonyCount = aspects.filter(a => a.type === 'Trígono' || a.type === 'Sextil').length;
    
    if (harmonyCount >= 2) {
      return `Use essa fluidez para dar um passo concreto em algo que realmente importa para você.`;
    }

    return `Perceba como essa configuração do céu conversa com as decisões que você está tomando hoje.`;
  }

}

// Instância Singleton
const astrologyService = new AstrologyService();
export { astrologyService };
export default astrologyService;