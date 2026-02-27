/* canvas: src/pages/BiomeDebugPage.jsx
   desc: Tela de debug para o Motor de Biomas + Ash.
   state: Apenas BeijaFlor, Onça, Elefante + Oceano
*/
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/api/apiClient';
import { PranaLogo } from '@/components/ui/PranaLogo';
import { BeijaFlorTotem } from '@/components/biome/BeijaFlorTotem';
import { ElefanteTotem } from '@/components/biome/ElefanteTotem';
import { OncaTotem } from '@/components/biome/OncaTotem';
import { OceanCinematic } from '@/components/biome/OceanCinematic';
import { FruitForestCinematic } from '@/components/biome/FruitForestCinematic';
import { RiverNacenteCinematic } from '@/components/biome/RiverNacenteCinematic';
import { BiomeEnergyTestPanel } from '@/components/biome/BiomeEnergyTestPanel';

const defaultPayload = {
  physical: 6,
  mental: 7,
  emotional: 5,
  spiritual: 4,
  tags: ['criativo', 'foco_profundo'],
  notes: 'Sessão de trabalho criativa com foco profundo, mas com um leve cansaço emocional do dia.'
};

const BIOME_SCENES = {
  agua: {
    beijaflor: {
      title: 'Água · Nascente (Beija-flor)',
      subtitle: 'Flow leve, foco macio, criatividade fresca.',
      gradient: 'from-sky-500/40 via-cyan-400/40 to-emerald-300/30',
      orb: 'bg-cyan-300/70',
    },
    nascente: {
      title: 'Água · Nascente (Mata Ciliar)',
      subtitle: 'Rio sereno, ancestralidade, população ribeirinha.',
      gradient: 'from-sky-600/50 via-emerald-500/40 to-green-900/50',
      orb: 'bg-emerald-400/60',
    },
    oceano: {
      title: 'Água · Oceano',
      subtitle: 'Profundidade emocional, mergulho lento e seguro.',
      gradient: 'from-sky-900/60 via-indigo-800/60 to-slate-900/70',
      orb: 'bg-sky-300/60',
    },
  },
  floresta: {
    _: {
      title: 'Floresta — Elefante',
      subtitle: 'Grounding, foco profundo, passo firme e constante.',
      gradient: 'from-emerald-700/60 via-emerald-500/50 to-lime-400/40',
      orb: 'bg-emerald-300/70',
    },
  },
  sertao: {
    _: {
      title: 'Sertão — Onça',
      subtitle: 'Ação focada, coragem, atravessar o calor das urgências.',
      gradient: 'from-amber-700/70 via-orange-600/60 to-rose-600/60',
      orb: 'bg-amber-300/80',
    },
  },
};

function BiomeScene({ biome }) {
  const biomeKey = biome?.biome || 'agua';
  const subBiomeKey = biome?.subBiome || 'beijaflor';
  const configGroup = BIOME_SCENES[biomeKey] || BIOME_SCENES.agua;
  const config = configGroup[subBiomeKey] || configGroup._ || BIOME_SCENES.agua.beijaflor;

  const animalId = biome?.animal || 'beija_flor';

  const isWater = biomeKey === 'agua';
  const isOceano = subBiomeKey === 'oceano';
  const isNascente = subBiomeKey === 'nascente';
  const isFloresta = biomeKey === 'floresta';

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background cinematográfico */}
      {isOceano ? (
        <OceanCinematic />
      ) : isNascente && isWater ? (
        <RiverNacenteCinematic />
      ) : isFloresta ? (
        <FruitForestCinematic />
      ) : (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Orb decorativa */}
      <motion.div
        className={`absolute -bottom-10 -right-10 w-52 h-52 rounded-full blur-3xl ${config.orb}`}
        animate={{
          y: [0, -10, 0],
          x: [0, 8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Mascote + Info */}
      <div className="relative h-full flex items-center px-6 md:px-10 gap-6 md:gap-10">
        <motion.div
          className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-black/20 border border-white/40 flex items-center justify-center shadow-inner backdrop-blur-xl overflow-hidden"
          animate={{
            scale: [1, 1.06, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {animalId === 'beija_flor' && (
            <BeijaFlorTotem className="w-32 h-32" mood={biome?.mood || 'idle'} />
          )}
          {animalId === 'elefante' && (
            <ElefanteTotem className="w-32 h-32" mood={biome?.mood || 'idle'} />
          )}
          {animalId === 'onca' && (
            <OncaTotem className="w-32 h-32" mood={biome?.mood || 'idle'} />
          )}
        </motion.div>

        <div className="space-y-2 text-white drop-shadow-sm max-w-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Bioma Ativo</p>
          <h2 className="text-xl md:text-2xl font-semibold leading-snug">
            {config.title}
          </h2>
          <p className="text-sm md:text-base text-white/80 max-w-md">
            {config.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BiomeDebugPage() {
  const [form, setForm] = useState(defaultPayload);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [forcedBiome, setForcedBiome] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setForcedBiome(null);

    try {
      const payload = {
        physical: Number(form.physical) || 0,
        mental: Number(form.mental) || 0,
        emotional: Number(form.emotional) || 0,
        spiritual: Number(form.spiritual) || 0,
        tags: form.tags,
        notes: form.notes,
      };

      const response = await apiClient.post('/ai/energy-analysis', { checkInData: payload });
      setResult(response.data);
    } catch (err) {
      console.error('[BiomeDebugPage] Erro ao chamar /ai/energy-analysis', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const biomeForDisplay = forcedBiome || result?.biome;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex items-center gap-4">
          <PranaLogo className="w-10 h-10" ativo />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Motor de Biomas · Cinematográfico</h1>
            <p className="text-sm text-muted-foreground">
              Beija-flor • Nascente (Mata Ciliar) • Oceano • Floresta Frutífera • Sertão (Onça)
            </p>
          </div>
        </header>

        {/* Ambiente vivo do Bioma atual */}
        <BiomeScene biome={biomeForDisplay} />

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['physical', 'mental', 'emotional', 'spiritual'].map((field) => (
              <label key={field} className="flex flex-col gap-1 text-xs">
                <span className="uppercase tracking-wide text-muted-foreground">{field}</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-1 text-xs">
            <span className="uppercase tracking-wide text-muted-foreground">Tags (separadas por vírgula)</span>
            <input
              type="text"
              value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="uppercase tracking-wide text-muted-foreground">Notas</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-amber-50 shadow hover:bg-amber-500 disabled:opacity-60"
          >
            {loading ? 'Consultando Ash + Bioma…' : 'Rodar Motor de Biomas'}
          </button>
        </form>

        {/* Botões de preset para testes rápidos */}
        <div className="rounded-xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Testes rápidos — Forçar Bioma</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setForcedBiome({ biome: 'agua', subBiome: 'beijaflor', animal: 'beija_flor', cognitiveCue: 'flow' })}
              className="text-xs px-2 py-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-200 hover:bg-sky-500/30"
            >
              Água · Beija-flor
            </button>
            <button
              onClick={() => setForcedBiome({ biome: 'agua', subBiome: 'nascente', animal: 'beija_flor', cognitiveCue: 'ancestralidade' })}
              className="text-xs px-2 py-1 rounded bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30"
            >
              Água · Nascente
            </button>
            <button
              onClick={() => setForcedBiome({ biome: 'agua', subBiome: 'oceano', animal: 'baleia', cognitiveCue: 'profundidade' })}
              className="text-xs px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/30"
            >
              Água · Oceano
            </button>
            <button
              onClick={() => setForcedBiome({ biome: 'floresta', animal: 'elefante', cognitiveCue: 'grounding' })}
              className="text-xs px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30"
            >
              Floresta Frutífera
            </button>
            <button
              onClick={() => setForcedBiome({ biome: 'sertao', animal: 'onca', cognitiveCue: 'acao' })}
              className="text-xs px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30"
            >
              Sertão
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/60 bg-red-950/60 p-3 text-sm text-red-100">
            <p className="font-semibold mb-1">Erro</p>
            <pre className="whitespace-pre-wrap text-xs opacity-90">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {result && (
          <section className="grid gap-4 md:grid-cols-[1.1fr,0.9fr] items-start">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur">
              <h2 className="text-sm font-semibold mb-2">Mensagem da Ash</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur space-y-2 text-sm">
              <h2 className="font-semibold">BiomeDecision</h2>
              {result.biome ? (
                <>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 font-medium text-amber-300 border border-amber-500/30">
                      Bioma: {result.biome.biome}{result.biome.subBiome ? ` · ${result.biome.subBiome}` : ''}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300 border border-emerald-500/30">
                      Animal: {result.biome.animal}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 font-medium text-sky-300 border border-sky-500/30">
                      Fio Cognitivo: {result.biome.cognitiveCue}
                    </span>
                  </div>
                  <pre className="mt-2 rounded-md bg-background/60 p-2 text-[11px] leading-snug text-muted-foreground overflow-x-auto">
                    {JSON.stringify(result.biome, null, 2)}
                  </pre>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                    Nenhum Bioma retornado (verifique se o backend já está com o Motor de Biomas).
                </p>
              )}
            </div>
          </section>
        )}

        {/* Novo: Painel de Teste em Tempo Real */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">🎮 Teste de Biomas em Tempo Real</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use este painel para simular mudanças de energia e ver os biomas serem ativados automaticamente
            com recomendações do Ash. Este painel está integrado com o PranaWorkspaceLayout.
          </p>
          <BiomeEnergyTestPanel />
        </section>
      </div>
    </div>
  );
}
