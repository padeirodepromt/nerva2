import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, BookOpen, Sparkles } from '@/components/icons/PranaLandscapeIcons';
import generateClientId from '@/utils/id';

const normalizeLesson = (lesson, moduleIndex, lessonIndex) => ({
  id: lesson?.id || generateClientId(`lesson_${moduleIndex}_${lessonIndex}`),
  title: lesson?.title || lesson?.name || lesson?.text || `Lição ${lessonIndex + 1}`,
  notes: lesson?.notes || lesson?.description || '',
});

const normalizeModule = (module, moduleIndex) => ({
  id: module?.id || generateClientId(`module_${moduleIndex}`),
  title: module?.title || module?.name || module?.text || `Módulo ${moduleIndex + 1}`,
  description: module?.description || module?.summary || '',
  lessons: Array.isArray(module?.lessons)
    ? module.lessons.map((lesson, lessonIndex) => normalizeLesson(lesson, moduleIndex, lessonIndex))
    : [],
});

const buildChecklistSnapshot = (modules) => {
  const items = [];
  modules.forEach((module, moduleIndex) => {
    items.push({
      id: module.id,
      text: `Módulo ${moduleIndex + 1}: ${module.title || 'Sem título'}`,
      is_completed: Boolean(module.description && module.description.length > 0),
    });
    module.lessons.forEach((lesson, lessonIndex) => {
      items.push({
        id: `${module.id}_${lesson.id}`,
        text: ` - Lição ${lessonIndex + 1}: ${lesson.title || 'Sem título'}`,
        is_completed: Boolean(lesson.notes && lesson.notes.length > 0),
      });
    });
  });
  return items;
};

const CourseOutlineEditor = ({ value, onChange }) => {
  const template = useMemo(() => {
    const modulesArray = Array.isArray(value?.modules) ? value.modules : [];
    return {
      overview: value?.overview || '',
      modules: modulesArray.map((module, moduleIndex) => normalizeModule(module, moduleIndex)),
    };
  }, [value]);

  const emitChange = (nextTemplate) => {
    const normalizedModules = nextTemplate.modules.map((module, moduleIndex) =>
      normalizeModule(module, moduleIndex),
    );
    const normalizedTemplate = {
      overview: nextTemplate.overview || '',
      modules: normalizedModules,
    };
    onChange?.(normalizedTemplate, {
      description: normalizedTemplate.overview,
      checklist: buildChecklistSnapshot(normalizedModules),
    });
  };

  const handleOverviewChange = (event) => {
    emitChange({ ...template, overview: event.target.value });
  };

  const handleAddModule = () => {
    const newModule = normalizeModule({ id: generateClientId('module') }, template.modules.length);
    emitChange({ ...template, modules: [...template.modules, newModule] });
  };

  const handleModuleFieldChange = (moduleId, field, value) => {
    const nextModules = template.modules.map((module) =>
      module.id === moduleId ? { ...module, [field]: value } : module,
    );
    emitChange({ ...template, modules: nextModules });
  };

  const handleRemoveModule = (moduleId) => {
    const filtered = template.modules.filter((module) => module.id !== moduleId);
    emitChange({ ...template, modules: filtered });
  };

  const handleAddLesson = (moduleId) => {
    const nextModules = template.modules.map((module) => {
      if (module.id !== moduleId) return module;
      const lessons = Array.isArray(module.lessons) ? module.lessons : [];
      const newLesson = normalizeLesson({ id: generateClientId('lesson') }, 0, lessons.length);
      return { ...module, lessons: [...lessons, newLesson] };
    });
    emitChange({ ...template, modules: nextModules });
  };

  const handleLessonFieldChange = (moduleId, lessonId, field, value) => {
    const nextModules = template.modules.map((module) => {
      if (module.id !== moduleId) return module;
      const lessons = module.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson,
      );
      return { ...module, lessons };
    });
    emitChange({ ...template, modules: nextModules });
  };

  const handleRemoveLesson = (moduleId, lessonId) => {
    const nextModules = template.modules.map((module) => {
      if (module.id !== moduleId) return module;
      const lessons = module.lessons.filter((lesson) => lesson.id !== lessonId);
      return { ...module, lessons };
    });
    emitChange({ ...template, modules: nextModules });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Visão geral do curso
        </label>
        <Textarea
          rows={4}
          value={template.overview}
          onChange={handleOverviewChange}
          placeholder="Qual transformação este curso entrega? Qual é a jornada proposta?"
          className="w-full bg-transparent"
        />
      </div>

      <Separator className="opacity-30" />

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Módulos ({template.modules.length})
          </h4>
          <p className="text-xs text-muted-foreground/80">
            Estruture os módulos, descreva o foco e adicione lições essenciais.
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleAddModule}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar módulo
        </Button>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {template.modules.map((module, moduleIndex) => (
          <div key={module.id} className="rounded-xl border border-border/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Módulo {moduleIndex + 1}</span>
                <p className="text-sm font-semibold">{module.title || 'Defina o foco do módulo'}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleRemoveModule(module.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Título
                </label>
                <Input
                  value={module.title}
                  onChange={(event) => handleModuleFieldChange(module.id, 'title', event.target.value)}
                  placeholder="Ex.: Fundamentos da Energia Tech"
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Resultado vibracional
                </label>
                <Input
                  value={module.description}
                  onChange={(event) => handleModuleFieldChange(module.id, 'description', event.target.value)}
                  placeholder="Qual é a transformação deste módulo?"
                  className="bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Lições ({module.lessons.length})</span>
                <Button size="sm" variant="secondary" onClick={() => handleAddLesson(module.id)}>
                  <Plus className="w-4 h-4 mr-1" /> Nova lição
                </Button>
              </div>
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="rounded-lg border border-border/30 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Lição {lessonIndex + 1}
                      </span>
                      <Button size="icon" variant="ghost" onClick={() => handleRemoveLesson(module.id, lesson.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={lesson.title}
                      onChange={(event) => handleLessonFieldChange(module.id, lesson.id, 'title', event.target.value)}
                      placeholder="Título da lição"
                      className="bg-transparent"
                    />
                    <Textarea
                      rows={2}
                      value={lesson.notes}
                      onChange={(event) => handleLessonFieldChange(module.id, lesson.id, 'notes', event.target.value)}
                      placeholder="Anotações, materiais ou checkpoints da lição."
                      className="bg-transparent"
                    />
                  </div>
                ))}

                {module.lessons.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border/30 p-4 text-center text-xs text-muted-foreground/70">
                    Nenhuma lição adicionada ainda. Crie a primeira para detalhar este módulo.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {template.modules.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/40 p-6 text-center text-sm text-muted-foreground/80">
            Nenhum módulo adicionado. Use “Adicionar módulo” para iniciar o outline do curso.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOutlineEditor;
