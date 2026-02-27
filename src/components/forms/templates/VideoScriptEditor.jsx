import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Play, Plus, ArrowUp, ArrowDown, Trash2 } from '@/components/icons/PranaLandscapeIcons';
import generateClientId from '@/utils/id';

const normalizeScene = (scene, index) => ({
  id: scene?.id || generateClientId(`scene_${index}`),
  title: scene?.title || scene?.text || `Cena ${index + 1}`,
  summary: scene?.summary || scene?.description || '',
  duration: scene?.duration || '',
  notes: scene?.notes || '',
  completed: Boolean(scene?.completed ?? scene?.is_completed),
});

const buildChecklistSnapshot = (scenes) =>
  scenes.map((scene) => ({
    id: scene.id,
    text: scene.title || 'Cena',
    is_completed: Boolean(scene.completed),
  }));

const VideoScriptEditor = ({ value, onChange }) => {
  const template = useMemo(() => {
    const scenesArray = Array.isArray(value?.scenes) ? value.scenes : [];
    return {
      synopsis: value?.synopsis || '',
      scenes: scenesArray.map((scene, index) => normalizeScene(scene, index)),
    };
  }, [value]);

  const [selectedSceneId, setSelectedSceneId] = useState(
    template.scenes[0]?.id || null,
  );

  useEffect(() => {
    if (!template.scenes.length) {
      setSelectedSceneId(null);
      return;
    }
    if (!template.scenes.find((scene) => scene.id === selectedSceneId)) {
      setSelectedSceneId(template.scenes[0].id);
    }
  }, [template.scenes, selectedSceneId]);

  const emitChange = (nextTemplate) => {
    const normalizedScenes = nextTemplate.scenes.map((scene, index) =>
      normalizeScene(scene, index),
    );
    const normalizedTemplate = {
      synopsis: nextTemplate.synopsis || '',
      scenes: normalizedScenes,
    };
    onChange?.(normalizedTemplate, {
      description: normalizedTemplate.synopsis,
      checklist: buildChecklistSnapshot(normalizedScenes),
    });
  };

  const handleSynopsisChange = (event) => {
    emitChange({ ...template, synopsis: event.target.value });
  };

  const handleAddScene = () => {
    const newScene = normalizeScene({
      id: generateClientId('scene'),
      title: '',
      summary: '',
      duration: '',
      notes: '',
      completed: false,
    }, template.scenes.length);
    emitChange({ ...template, scenes: [...template.scenes, newScene] });
    setSelectedSceneId(newScene.id);
  };

  const updateScene = (sceneId, updater) => {
    const nextScenes = template.scenes.map((scene) =>
      scene.id === sceneId ? { ...scene, ...updater(scene) } : scene,
    );
    emitChange({ ...template, scenes: nextScenes });
  };

  const handleSceneFieldChange = (sceneId, field, value) => {
    updateScene(sceneId, () => ({ [field]: value }));
  };

  const handleToggleComplete = (sceneId) => {
    updateScene(sceneId, (scene) => ({ completed: !scene.completed }));
  };

  const handleRemoveScene = (sceneId) => {
    const filtered = template.scenes.filter((scene) => scene.id !== sceneId);
    emitChange({ ...template, scenes: filtered });
    if (selectedSceneId === sceneId) {
      setSelectedSceneId(filtered[0]?.id || null);
    }
  };

  const handleReorderScene = (sceneId, direction) => {
    const index = template.scenes.findIndex((scene) => scene.id === sceneId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= template.scenes.length) return;
    const nextScenes = [...template.scenes];
    const [moved] = nextScenes.splice(index, 1);
    nextScenes.splice(targetIndex, 0, moved);
    emitChange({ ...template, scenes: nextScenes });
  };

  const selectedScene = template.scenes.find(
    (scene) => scene.id === selectedSceneId,
  ) || template.scenes[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Sinopse / Contexto do Vídeo
        </label>
        <Textarea
          rows={4}
          value={template.synopsis}
          onChange={handleSynopsisChange}
          placeholder="Sobre o que é esse roteiro? Quais são os objetivos principais?"
          className="w-full bg-transparent"
        />
      </div>

      <Separator className="opacity-30" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Cenas ({template.scenes.length})
            </h4>
            <Button size="sm" variant="ghost" onClick={handleAddScene}>
              <Plus className="w-4 h-4 mr-2" /> Nova cena
            </Button>
          </div>

          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {template.scenes.map((scene, index) => {
              const isActive = scene.id === selectedSceneId;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-border/40 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Cena {index + 1}
                    </span>
                    {scene.completed && (
                      <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Revisada
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">
                    {scene.title || 'Sem título'}
                  </p>
                  {scene.summary && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {scene.summary}
                    </p>
                  )}
                </button>
              );
            })}
            {template.scenes.length === 0 && (
              <p className="text-sm text-muted-foreground/70">
                Nenhuma cena criada ainda. Adicione a primeira para começar o roteiro.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedScene ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium">Título da cena</label>
                  <Input
                    value={selectedScene.title}
                    onChange={(event) =>
                      handleSceneFieldChange(selectedScene.id, 'title', event.target.value)
                    }
                    placeholder="Ex: Abertura vibracional"
                    className="bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedScene.completed ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleComplete(selectedScene.id)}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {selectedScene.completed ? 'Concluída' : 'Marcar como concluída'}
                  </Button>
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReorderScene(selectedScene.id, 'up')}
                      disabled={template.scenes[0]?.id === selectedScene.id}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReorderScene(selectedScene.id, 'down')}
                      disabled={template.scenes[template.scenes.length - 1]?.id === selectedScene.id}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveScene(selectedScene.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Resumo / Ação da cena</label>
                <Textarea
                  rows={3}
                  value={selectedScene.summary}
                  onChange={(event) =>
                    handleSceneFieldChange(selectedScene.id, 'summary', event.target.value)
                  }
                  placeholder="Detalhe o que acontece nesta parte do vídeo."
                  className="bg-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Duração estimada (segundos)</label>
                  <Input
                    value={selectedScene.duration}
                    onChange={(event) =>
                      handleSceneFieldChange(selectedScene.id, 'duration', event.target.value)
                    }
                    placeholder="Ex: 12"
                    className="bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Notas de direção</label>
                  <Input
                    value={selectedScene.notes}
                    onChange={(event) =>
                      handleSceneFieldChange(selectedScene.id, 'notes', event.target.value)
                    }
                    placeholder="Câmera lenta, inserir gráfico, etc."
                    className="bg-transparent"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border/60 bg-background/40 flex items-start gap-3 text-sm text-muted-foreground">
                <Play className="w-4 h-4 mt-1" />
                <p>
                  Use este painel para manter a narrativa alinhada com a energia do projeto. Títulos claros e notas ajudam Ash a sugerir cortes e transições automaticamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
              Adicione a primeira cena para começar a estruturar o roteiro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoScriptEditor;
