import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * FormBubble - Formulário renderizado dinamicamente pelo Ash
 * Usado para criar tarefas, eventos, etc. sem sair do chat
 */
export default function FormBubble({
  title = 'Novo Item',
  fields = [],
  submitLabel = 'Enviar',
  onSubmit,
  isLoading = false
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} é obrigatório`;
      }

      if (field.validation && formData[field.name]) {
        const error = field.validation(formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros do formulário');
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10',
        'p-4 space-y-3 max-w-sm'
      )}
    >
      {/* Title */}
      <div className="text-sm font-semibold">{title}</div>

      {/* Fields */}
      <div className="space-y-3">
        {fields.map((field, idx) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <label className="block text-xs font-medium mb-1.5">
              {field.label}
              {field.required && <span className="text-red-400"> *</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                disabled={isLoading}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-white/10 border border-white/20',
                  'placeholder-muted-foreground/50',
                  'focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  errors[field.name] && 'border-red-400 focus:ring-red-400/50'
                )}
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={isLoading}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-white/10 border border-white/20',
                  'focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  errors[field.name] && 'border-red-400 focus:ring-red-400/50'
                )}
              >
                <option value="">{field.placeholder || 'Selecione...'}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type="date"
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={isLoading}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-white/10 border border-white/20',
                  'focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  errors[field.name] && 'border-red-400 focus:ring-red-400/50'
                )}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                disabled={isLoading}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-white/10 border border-white/20',
                  'placeholder-muted-foreground/50',
                  'focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  errors[field.name] && 'border-red-400 focus:ring-red-400/50'
                )}
              />
            )}

            {/* Error Message */}
            <AnimatePresence>
              {errors[field.name] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-red-400 mt-1"
                >
                  ⚠️ {errors[field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full h-10 rounded-lg font-medium text-sm',
          'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400',
          'border border-blue-400/20 hover:border-blue-400/40',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95'
        )}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block"
          >
            ⚡
          </motion.span>
        ) : (
          submitLabel
        )}
      </button>
    </motion.form>
  );
}
