import { useState, useCallback } from 'react';
import type { ApiError } from '../services/apiClient';

/**
 * Hook para tratamento de erros da API
 */
export function useApiError() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleError = useCallback((err: unknown) => {
    if (err && typeof err === 'object' && 'message' in err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Ocorreu um erro inesperado');
      
      // Processa erros de validação por campo
      if (apiError.errors) {
        const errors: Record<string, string> = {};
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          errors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({});
      }
    } else {
      setError('Ocorreu um erro inesperado');
      setFieldErrors({});
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return fieldErrors[field];
  }, [fieldErrors]);

  return {
    error,
    fieldErrors,
    handleError,
    clearError,
    getFieldError,
  };
}

