/* src/components/forms/TemplateSelector.jsx
   desc: Component para selecionar e visualizar templates disponíveis
   feat: Preview de templates, aplicação com opção de override
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from '@/components/LanguageProvider';

const TemplateSelector = ({ onTemplateSelected, onClose }) => {
  const { t } = useTranslations();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/project-templates');
      if (!response.ok) throw new Error('Failed to load templates');
      const data = await response.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error(t('error_load_templates', 'Erro ao carregar templates'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTemplate = async () => {
    if (!projectName.trim() || !selectedTemplate) {
      toast.error(t('error_project_name_required', 'Digite o nome do novo projeto'));
      return;
    }

    try {
      const response = await fetch(`/api/project-templates/${selectedTemplate.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName.trim(),
          projectDescription: '',
        }),
      });

      if (!response.ok) throw new Error('Failed to apply template');

      const result = await response.json();
      toast.success(t('template_applied', 'Projeto criado a partir do template!'));
      
      if (onTemplateSelected) onTemplateSelected(result.project);
      onClose();
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error(t('error_apply_template', 'Erro ao aplicar template'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-2">
          {t('use_template', 'Usar Template')}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('select_template_help', 'Selecione um de seus templates para criar um novo projeto')}
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('no_templates_yet', 'Você ainda não tem templates salvos')}</p>
            <p className="text-xs mt-2">{t('create_template_hint', 'Crie um projeto e salve como template!')}</p>
          </div>
        ) : (
          <>
            {/* Lista de Templates */}
            <div className="grid gap-3 mb-6">
              <AnimatePresence mode="wait">
                {templates.map((template, idx) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedTemplate?.id === template.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('used', 'Usado')} {template.usageCount || 0}x
                        </p>
                      </div>
                      <div
                        className={`
                          w-4 h-4 rounded border mt-1
                          ${selectedTemplate?.id === template.id
                            ? 'bg-primary border-primary'
                            : 'border-white/20'
                          }
                        `}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Info do Template Selecionado */}
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6"
              >
                <p className="text-sm font-medium text-blue-200 mb-2">
                  {t('included_data', 'Dados que serão inclusos:')}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-100">
                  {selectedTemplate.includedFields && Object.entries(JSON.parse(
                    typeof selectedTemplate.includedFields === 'string'
                      ? selectedTemplate.includedFields
                      : JSON.stringify(selectedTemplate.includedFields)
                  )).map(([key, included]) => (
                    included && (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span className="capitalize">{key}</span>
                      </div>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input de Nome do Projeto */}
            {selectedTemplate && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {t('new_project_name', 'Nome do novo projeto')}
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t('enter_project_name', 'Ex: Projeto Importante')}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-background/50"
                />
              </div>
            )}
          </>
        )}

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t('cancel', 'Cancelar')}
          </Button>
          {selectedTemplate && (
            <Button
              onClick={handleApplyTemplate}
              disabled={!projectName.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {t('create_from_template', 'Criar do Template')}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateSelector;
