/**
 * Field Validation Utilities
 * 
 * Provides validation rules and functions for custom project fields
 * Supports: text, number, dropdown, date, member, checkbox
 */

/**
 * Validates a field value against field schema
 * Returns { isValid: boolean, error: string | null }
 */
export function validateFieldValue(value, field) {
  if (!field) {
    return { isValid: false, error: 'Campo não configurado' };
  }

  const { type, is_required, validation_rules = {} } = field;

  // Check required
  if (is_required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: 'Este campo é obrigatório' };
  }

  // If not required and empty, it's valid
  if (!is_required && (value === null || value === undefined || value === '')) {
    return { isValid: true, error: null };
  }

  // Type-specific validation
  switch (type) {
    case 'text':
      return validateText(value, field, validation_rules);
    
    case 'number':
      return validateNumber(value, field, validation_rules);
    
    case 'dropdown':
      return validateDropdown(value, field, validation_rules);
    
    case 'date':
      return validateDate(value, field, validation_rules);
    
    case 'member':
      return validateMember(value, field, validation_rules);
    
    case 'checkbox':
      return validateCheckbox(value, field, validation_rules);
    
    default:
      return { isValid: true, error: null };
  }
}

/**
 * Text field validation
 * Supports: min_length, max_length, pattern
 */
function validateText(value, field, rules) {
  if (typeof value !== 'string') {
    return { isValid: false, error: 'Valor deve ser texto' };
  }

  const trimmed = value.trim();

  // Min length
  if (rules.min_length && trimmed.length < rules.min_length) {
    return {
      isValid: false,
      error: `Mínimo ${rules.min_length} caracteres (${trimmed.length} fornecidos)`
    };
  }

  // Max length
  if (rules.max_length && trimmed.length > rules.max_length) {
    return {
      isValid: false,
      error: `Máximo ${rules.max_length} caracteres (${trimmed.length} fornecidos)`
    };
  }

  // Pattern (regex)
  if (rules.pattern) {
    try {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return {
          isValid: false,
          error: rules.pattern_error_message || 'Formato inválido'
        };
      }
    } catch (e) {
      console.error('Invalid regex pattern:', rules.pattern);
    }
  }

  return { isValid: true, error: null };
}

/**
 * Number field validation
 * Supports: min, max, step, decimal_places
 */
function validateNumber(value, field, rules) {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return { isValid: false, error: 'Valor deve ser um número' };
  }

  // Min value
  if (rules.min !== undefined && num < rules.min) {
    return {
      isValid: false,
      error: `Mínimo: ${rules.min}`
    };
  }

  // Max value
  if (rules.max !== undefined && num > rules.max) {
    return {
      isValid: false,
      error: `Máximo: ${rules.max}`
    };
  }

  // Decimal places
  if (rules.decimal_places !== undefined) {
    const decimalCount = (num.toString().split('.')[1] || '').length;
    if (decimalCount > rules.decimal_places) {
      return {
        isValid: false,
        error: `Máximo ${rules.decimal_places} casas decimais`
      };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Dropdown field validation
 * Ensures value is one of the allowed options
 */
function validateDropdown(value, field, rules) {
  const { options = [] } = field;

  // If value is empty and not required, it's valid
  if (!value) {
    return { isValid: true, error: null };
  }

  // Check if value is in options
  const validOptions = options.map(opt => 
    typeof opt === 'string' ? opt : opt.value
  );

  if (!validOptions.includes(value)) {
    return {
      isValid: false,
      error: 'Opção inválida'
    };
  }

  return { isValid: true, error: null };
}

/**
 * Date field validation
 * Supports: min_date, max_date, date_format
 */
function validateDate(value, field, rules) {
  if (!value) {
    return { isValid: true, error: null };
  }

  // Parse date
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }

  // Min date
  if (rules.min_date) {
    const minDate = new Date(rules.min_date);
    if (date < minDate) {
      return {
        isValid: false,
        error: `Data deve ser depois de ${rules.min_date}`
      };
    }
  }

  // Max date
  if (rules.max_date) {
    const maxDate = new Date(rules.max_date);
    if (date > maxDate) {
      return {
        isValid: false,
        error: `Data deve ser antes de ${rules.max_date}`
      };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Member field validation
 * Ensures value is a valid member ID
 */
function validateMember(value, field, rules) {
  if (!value) {
    return { isValid: true, error: null };
  }

  // Value should be a UUID (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    return {
      isValid: false,
      error: 'Membro inválido'
    };
  }

  return { isValid: true, error: null };
}

/**
 * Checkbox field validation
 * Value must be boolean
 */
function validateCheckbox(value, field, rules) {
  if (typeof value !== 'boolean') {
    return { isValid: false, error: 'Valor deve ser verdadeiro/falso' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates multiple field values at once
 * Returns object with field slugs as keys and validation results as values
 */
export function validateFieldsObject(customData, fields) {
  const errors = {};

  for (const field of fields) {
    const value = customData?.[field.slug];
    const validation = validateFieldValue(value, field);

    if (!validation.isValid) {
      errors[field.slug] = validation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Get visual feedback for a field
 * Returns { icon, color, label } for UI display
 */
export function getFieldValidationFeedback(validation) {
  if (!validation) {
    return { icon: null, color: 'default', label: '' };
  }

  if (validation.isValid) {
    return {
      icon: '✓',
      color: 'green',
      label: 'Válido'
    };
  }

  return {
    icon: '⚠',
    color: 'red',
    label: validation.error
  };
}

/**
 * Common patterns for text validation
 */
export const TEXT_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\d{10,}$/,
  ZIP_CODE: /^\d{5}-?\d{3}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NO_SPACES: /^\S+$/
};

/**
 * Default validation rules by field type
 * Can be extended during field creation
 */
export const DEFAULT_VALIDATION_RULES = {
  text: {
    max_length: 255
  },
  number: {
    min: 0,
    decimal_places: 2
  },
  dropdown: {},
  date: {},
  member: {},
  checkbox: {}
};

/**
 * Get user-friendly error message for common validation errors
 */
export function getLocalizedErrorMessage(error) {
  const messages = {
    'required': 'Este campo é obrigatório',
    'invalid': 'Valor inválido',
    'format': 'Formato não suportado',
    'range': 'Valor fora do intervalo permitido',
    'duplicate': 'Este valor já existe'
  };

  for (const [key, message] of Object.entries(messages)) {
    if (error && error.toLowerCase().includes(key)) {
      return message;
    }
  }

  return error || 'Erro desconhecido';
}
