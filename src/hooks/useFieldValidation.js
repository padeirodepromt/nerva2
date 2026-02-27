import { useState, useCallback, useEffect } from 'react';
import { validateFieldValue, validateFieldsObject } from '@/utils/fieldValidation';

/**
 * Hook for validating individual field values
 * 
 * @param {Object} field - Field configuration object
 * @returns {Object} { validate, isValid, error, setError, clearError }
 */
export function useFieldValidation(field) {
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((value) => {
    if (!field) {
      setIsValid(false);
      setError('Campo não configurado');
      return false;
    }

    const validation = validateFieldValue(value, field);
    setIsValid(validation.isValid);
    setError(validation.error);

    return validation.isValid;
  }, [field]);

  const clearError = useCallback(() => {
    setError(null);
    setIsValid(true);
  }, []);

  return {
    validate,
    isValid,
    error,
    setError,
    clearError
  };
}

/**
 * Hook for validating multiple field values at once
 * 
 * @param {Array} fields - Array of field configurations
 * @returns {Object} { validateAll, validateField, errors, isValid, clearErrors }
 */
export function useFieldsValidation(fields = []) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const validateAll = useCallback((customData) => {
    if (!fields || fields.length === 0) {
      setIsValid(true);
      setErrors({});
      return true;
    }

    const validation = validateFieldsObject(customData, fields);
    setErrors(validation.errors);
    setIsValid(validation.isValid);

    return validation.isValid;
  }, [fields]);

  const validateField = useCallback((fieldSlug, value) => {
    const field = fields.find(f => f.slug === fieldSlug);
    if (!field) {
      return true;
    }

    const validation = validateFieldValue(value, field);

    if (validation.isValid) {
      // Clear error for this field if validation passed
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldSlug];
        return newErrors;
      });
    } else {
      // Set error for this field
      setErrors(prev => ({
        ...prev,
        [fieldSlug]: validation.error
      }));
    }

    return validation.isValid;
  }, [fields]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const hasError = useCallback((fieldSlug) => {
    return !!errors[fieldSlug];
  }, [errors]);

  const getError = useCallback((fieldSlug) => {
    return errors[fieldSlug] || null;
  }, [errors]);

  // Update isValid whenever errors change
  useEffect(() => {
    setIsValid(Object.keys(errors).length === 0);
  }, [errors]);

  return {
    validateAll,
    validateField,
    errors,
    isValid,
    clearErrors,
    hasError,
    getError
  };
}

/**
 * Hook for real-time field validation with debounce
 * Useful for instant feedback as user types
 * 
 * @param {Object} field - Field configuration
 * @param {number} debounceMs - Milliseconds to wait before validating (default: 300)
 * @returns {Object} { validate, isValid, error, clearError, isValidating }
 */
export function useRealTimeValidation(field, debounceMs = 300) {
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const validate = useCallback((value) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setIsValidating(true);

    // Set new timeout for debounced validation
    const newTimeoutId = setTimeout(() => {
      if (!field) {
        setIsValid(false);
        setError('Campo não configurado');
        setIsValidating(false);
        return;
      }

      const validation = validateFieldValue(value, field);
      setIsValid(validation.isValid);
      setError(validation.error);
      setIsValidating(false);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  }, [field, debounceMs, timeoutId]);

  const clearError = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setError(null);
    setIsValid(true);
    setIsValidating(false);
  }, [timeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    validate,
    isValid,
    error,
    clearError,
    isValidating
  };
}

/**
 * Hook for checking if a field value is required
 * 
 * @param {Object} field - Field configuration
 * @returns {boolean}
 */
export function useIsFieldRequired(field) {
  return field?.is_required ?? false;
}

/**
 * Hook for getting field validation state as an object
 * Combines all validation info in one place
 * 
 * @param {Object} field - Field configuration
 * @param {*} value - Current field value
 * @returns {Object} Validation state object
 */
export function useFieldValidationState(field, value) {
  const validation = useFieldValidation(field);
  const isRequired = useIsFieldRequired(field);

  const getValidationState = useCallback(() => {
    if (!field) {
      return {
        isRequired: false,
        isTouched: false,
        isDirty: false,
        isValid: false,
        error: null,
        status: 'error'
      };
    }

    const result = validateFieldValue(value, field);

    return {
      isRequired,
      isTouched: true,
      isDirty: !!value,
      isValid: result.isValid,
      error: result.error,
      status: result.isValid ? 'success' : 'error'
    };
  }, [field, value, isRequired]);

  return getValidationState();
}
