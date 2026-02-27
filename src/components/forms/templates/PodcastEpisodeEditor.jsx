import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Clock, Mic2 } from '@/components/icons/PranaLandscapeIcons';
import generateClientId from '@/utils/id';

const normalizeSegment = (segment, index) => ({
  id: segment?.id || generateClientId(`segment_${index}`),
  title: segment?.title || segment?.name || segment?.text || `Bloco ${index + 1}`,
  objective: segment?.objective || segment?.goal || segment?.summary || '',
  speaker: segment?.speaker || '',
  duration: segment?.duration || '',
  notes: segment?.notes || '',
});

const buildChecklistSnapshot = (segments) =>
  segments.map((segment, index) => ({
    id: segment.id,
    text: segment.title || `Bloco ${index + 1}`,
    is_completed: Boolean(segment.notes && segment.notes.length > 0),
  }));

const PodcastEpisodeEditor = ({ value, onChange }) => {
  const template = useMemo(() => {
    const segmentsArray = Array.isArray(value?.segments) ? value.segments : [];
    return {
      summary: value?.summary || '',
      segments: segmentsArray.map((segment, index) => normalizeSegment(segment, index)),
    };
  }, [value]);

  const emitChange = (nextTemplate) => {
    const normalizedSegments = nextTemplate.segments.map((segment, index) =>
      normalizeSegment(segment, index),
    );
    const normalizedTemplate = {
      summary: nextTemplate.summary || '',
      segments: normalizedSegments,
    };
    onChange?.(normalizedTemplate, {
      description: normalizedTemplate.summary,
      checklist: buildChecklistSnapshot(normalizedSegments),
    });
  };

  const handleSummaryChange = (event) => {
    emitChange({ ...template, summary: event.target.value });
  };

  const handleAddSegment = () => {
    const newSegment = normalizeSegment({ id: generateClientId('segment') }, template.segments.length);
    emitChange({ ...template, segments: [...template.segments, newSegment] });
  };

  const handleSegmentFieldChange = (segmentId, field, value) => {
    const nextSegments = template.segments.map((segment) =>
      segment.id === segmentId ? { ...segment, [field]: value } : segment,
    );
    emitChange({ ...template, segments: nextSegments });
  };

  const handleRemoveSegment = (segmentId) => {
    const filtered = template.segments.filter((segment) => segment.id !== segmentId);
    emitChange({ ...template, segments: filtered });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Mic2 className="w-4 h-4" /> Resumo do Episódio
        </label>
        <Textarea
          rows={4}
          value={template.summary}
          onChange={handleSummaryChange}
          placeholder="Qual é a intenção vibracional deste episódio? Quais temas principais serão abordados?"
          className="w-full bg-transparent"
        />
      </div>

      <Separator className="opacity-30" />

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Blocos do episódio ({template.segments.length})
          </h4>
          <p className="text-xs text-muted-foreground/80">
            Estruture os momentos chave e indique quem conduz cada transição.
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleAddSegment}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar bloco
        </Button>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {template.segments.map((segment, index) => (
          <div key={segment.id} className="rounded-xl border border-border/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Bloco {index + 1}</span>
                <p className="text-sm font-semibold">{segment.title || 'Defina o título do bloco'}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleRemoveSegment(segment.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Título
                </label>
                <Input
                  value={segment.title}
                  onChange={(event) => handleSegmentFieldChange(segment.id, 'title', event.target.value)}
                  placeholder="Ex.: Abertura energética"
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Quem conduz
                </label>
                <Input
                  value={segment.speaker}
                  onChange={(event) => handleSegmentFieldChange(segment.id, 'speaker', event.target.value)}
                  placeholder="Nome ou função"
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Duração estimada
                </label>
                <Input
                  value={segment.duration}
                  onChange={(event) => handleSegmentFieldChange(segment.id, 'duration', event.target.value)}
                  placeholder="Ex.: 05:30"
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Objetivo vibracional
                </label>
                <Input
                  value={segment.objective}
                  onChange={(event) => handleSegmentFieldChange(segment.id, 'objective', event.target.value)}
                  placeholder="Qual sensação queremos ativar?"
                  className="bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notas / Transições
              </label>
              <Textarea
                rows={3}
                value={segment.notes}
                onChange={(event) => handleSegmentFieldChange(segment.id, 'notes', event.target.value)}
                placeholder="Indique trilhas, falas importantes ou ganchos para o próximo bloco."
                className="bg-transparent"
              />
            </div>
          </div>
        ))}

        {template.segments.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/40 p-6 text-center text-sm text-muted-foreground/80">
            Nenhum bloco adicionado. Use “Adicionar bloco” para mapear o fluxo do episódio.
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastEpisodeEditor;
