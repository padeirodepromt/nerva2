/* src/components/forms/SaveAsTemplateModal.jsx
   desc: Modal para salvar projeto como template com seleção customizável
   feat: Checkboxes para escolher quais campos salvar
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslations } from '@/components/LanguageProvider';
import { Project } from '@/api/entities';

const SaveAsTemplateModal = ({ project, isOpen, onClose, onSave }) => {
  const { t } = useTranslations();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado dos campos selecionados
  const [selectedFields, setSelectedFields] = useState({
    title: false,
    description: true,
    tags: true,
    customFields: true,
    subtasks: true,
    color: true,
    icon: true,
    settings: false,
  });

  const fieldOptions = [
    { key: 'title', label: t('template_field_title', 'Título do Projeto') },
    { key: 'description', label: t('template_field_description', 'Descrição') },
    { key: 'tags', label: t('template_field_tags', 'Tags') },
    { key: 'customFields', label: t('template_field_custom_fields', 'Campos Customizados') },
    { key: 'subtasks', label: t('template_field_subtasks', 'Estrutura de Tarefas') },
    { key: 'color', label: t('template_field_color', 'Cor') },
    { key: 'icon', label: t('template_field_icon', 'Ícone') },
    { key: 'settings', label: t('template_field_settings', 'Configurações') },
  ];

  const toggleField = (fieldKey) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error(t('error_template_name_required', 'Nome do template é obrigatório'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/project-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          templateName: templateName.trim(),
          templateDescription: templateDescription.trim() || null,
          selectedFields,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      const template = await response.json();
      toast.success(t('template_saved_success', `Template "${templateName}" salvo com sucesso!`));
      
      if (onSave) onSave(template);
      
      // Reset e fecha
      setTemplateName('');
      setTemplateDescription('');
      setSelectedFields({
        title: false,
        description: true,
        tags: true,
        customFields: true,
        subtasks: true,
        color: true,
        icon: true,
        settings: false,
      });
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(t('error_save_template', 'Erro ao salvar template'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="bg-background border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">
          {t('save_as_template', 'Salvar como Template')}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('template_description_help', 'Escolha exatamente quais dados você quer reutilizar neste template')}
        </p>

        {/* Nome */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t('template_name', 'Nome do Template')}
          </label>
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={`Ex: ${project.title} - Estrutura Base`}
            className="w-full"
          />
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t('description', 'Descrição')} ({t('optional', 'Opcional')})
          </label>
          <textarea
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            placeholder={t('template_description_placeholder', 'Descreva quando usar este template...')}
            className="w-full px-3 py-2 border border-white/10 rounded-lg bg-background/50 text-sm resize-none"
            rows={3}
          />
        </div>

        {/* Seleção de Fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            {t('select_fields_to_save', 'Selecione os campos a salvar')}
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {fieldOptions.map(option => (
              <label
                key={option.key}
                className="flex items-center gap-3 p-3 border border-white/5 rounded-lg hover:bg-white/5 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedFields[option.key]}
                  onChange={() => toggleField(option.key)}
                  className="w-5 h-5 rounded accent-current cursor-pointer"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6 text-sm text-blue-200">
          <p className="font-medium mb-1">{t('tip', 'Dica:')}</p>
          <p>{t('template_use_case', 'Use este template para criar novos projetos rapidamente com a mesma estrutura e configurações')}</p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('cancel', 'Cancelar')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !templateName.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {t('saving', 'Salvando...')}
              </>
            ) : (
              t('save', 'Salvar')
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SaveAsTemplateModal;
