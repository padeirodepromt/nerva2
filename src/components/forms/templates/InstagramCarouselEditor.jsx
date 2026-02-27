import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, Type, Plus, ArrowUp, ArrowDown, Trash2 } from '@/components/icons/PranaLandscapeIcons';
import generateClientId from '@/utils/id';

const normalizeSlide = (slide, index) => ({
  id: slide?.id || generateClientId(`slide_${index}`),
  headline: slide?.headline || slide?.title || slide?.text || `Slide ${index + 1}`,
  body: slide?.body || slide?.description || '',
  mediaUrl: slide?.mediaUrl || slide?.media || slide?.image || '',
  callToAction: slide?.callToAction || slide?.cta || '',
});

const buildChecklistSnapshot = (slides) =>
  slides.map((slide, index) => ({
    id: slide.id,
    text: slide.headline || `Slide ${index + 1}`,
    is_completed: Boolean(slide.mediaUrl),
  }));

const InstagramCarouselEditor = ({ value, onChange }) => {
  const template = useMemo(() => {
    const slidesArray = Array.isArray(value?.slides) ? value.slides : [];
    return {
      caption: value?.caption || '',
      slides: slidesArray.map((slide, index) => normalizeSlide(slide, index)),
    };
  }, [value]);

  const [selectedSlideId, setSelectedSlideId] = useState(
    template.slides[0]?.id || null,
  );

  useEffect(() => {
    if (!template.slides.length) {
      setSelectedSlideId(null);
      return;
    }
    if (!template.slides.find((slide) => slide.id === selectedSlideId)) {
      setSelectedSlideId(template.slides[0].id);
    }
  }, [template.slides, selectedSlideId]);

  const emitChange = (nextTemplate) => {
    const normalizedSlides = nextTemplate.slides.map((slide, index) =>
      normalizeSlide(slide, index),
    );
    const normalizedTemplate = {
      caption: nextTemplate.caption || '',
      slides: normalizedSlides,
    };
    onChange?.(normalizedTemplate, {
      description: normalizedTemplate.caption,
      checklist: buildChecklistSnapshot(normalizedSlides),
    });
  };

  const handleCaptionChange = (event) => {
    emitChange({ ...template, caption: event.target.value });
  };

  const handleAddSlide = () => {
    const newSlide = normalizeSlide(
      {
        id: generateClientId('slide'),
        headline: '',
        body: '',
        mediaUrl: '',
        callToAction: '',
      },
      template.slides.length,
    );
    emitChange({ ...template, slides: [...template.slides, newSlide] });
    setSelectedSlideId(newSlide.id);
  };

  const updateSlide = (slideId, updater) => {
    const nextSlides = template.slides.map((slide) =>
      slide.id === slideId ? { ...slide, ...updater(slide) } : slide,
    );
    emitChange({ ...template, slides: nextSlides });
  };

  const handleSlideFieldChange = (slideId, field, value) => {
    updateSlide(slideId, () => ({ [field]: value }));
  };

  const handleRemoveSlide = (slideId) => {
    const filtered = template.slides.filter((slide) => slide.id !== slideId);
    emitChange({ ...template, slides: filtered });
    if (selectedSlideId === slideId) {
      setSelectedSlideId(filtered[0]?.id || null);
    }
  };

  const handleReorderSlide = (slideId, direction) => {
    const index = template.slides.findIndex((slide) => slide.id === slideId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= template.slides.length) return;
    const nextSlides = [...template.slides];
    const [moved] = nextSlides.splice(index, 1);
    nextSlides.splice(targetIndex, 0, moved);
    emitChange({ ...template, slides: nextSlides });
  };

  const selectedSlide = template.slides.find(
    (slide) => slide.id === selectedSlideId,
  ) || template.slides[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Legenda principal / CTA
        </label>
        <Textarea
          rows={4}
          value={template.caption}
          onChange={handleCaptionChange}
          placeholder="Escreva a narrativa que acompanha o carrossel."
          className="w-full bg-transparent"
        />
      </div>

      <Separator className="opacity-30" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Slides ({template.slides.length})
            </h4>
            <Button size="sm" variant="ghost" onClick={handleAddSlide}>
              <Plus className="w-4 h-4 mr-2" /> Novo slide
            </Button>
          </div>

          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {template.slides.map((slide, index) => {
              const isActive = slide.id === selectedSlideId;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setSelectedSlideId(slide.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-border/40 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Slide {index + 1}
                    </span>
                    {slide.mediaUrl && (
                      <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Mídia
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">
                    {slide.headline || 'Sem título'}
                  </p>
                  {slide.body && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {slide.body}
                    </p>
                  )}
                </button>
              );
            })}
            {template.slides.length === 0 && (
              <p className="text-sm text-muted-foreground/70">
                Crie o primeiro slide para começar a planejar o carrossel.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedSlide ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Título / Gancho</label>
                  <Input
                    value={selectedSlide.headline}
                    onChange={(event) =>
                      handleSlideFieldChange(selectedSlide.id, 'headline', event.target.value)
                    }
                    placeholder="Ex: Energia Tech em 3 passos"
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Chamada (CTA)</label>
                  <Input
                    value={selectedSlide.callToAction}
                    onChange={(event) =>
                      handleSlideFieldChange(selectedSlide.id, 'callToAction', event.target.value)
                    }
                    placeholder="Ex: Arraste para sentir a energia"
                    className="bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Descrição / Conteúdo</label>
                <Textarea
                  rows={3}
                  value={selectedSlide.body}
                  onChange={(event) =>
                    handleSlideFieldChange(selectedSlide.id, 'body', event.target.value)
                  }
                  placeholder="Texto que complementa o título do slide."
                  className="bg-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">URL da mídia</label>
                  <Input
                    value={selectedSlide.mediaUrl}
                    onChange={(event) =>
                      handleSlideFieldChange(selectedSlide.id, 'mediaUrl', event.target.value)
                    }
                    placeholder="https://..."
                    className="bg-transparent"
                  />
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReorderSlide(selectedSlide.id, 'up')}
                    disabled={template.slides[0]?.id === selectedSlide.id}
                    className="h-8 w-8"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReorderSlide(selectedSlide.id, 'down')}
                    disabled={template.slides[template.slides.length - 1]?.id === selectedSlide.id}
                    className="h-8 w-8"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSlide(selectedSlide.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border/60 bg-background/40 flex items-start gap-3 text-sm text-muted-foreground">
                <Type className="w-4 h-4 mt-1" />
                <p>
                  Slides consistentes ajudam Ash a gerar versões alternativas e sugestões de narrativa automaticamente. Preencha título, descrição e CTA para manter o ritmo do carrossel.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
              Crie o primeiro slide para editar os detalhes aqui.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramCarouselEditor;
