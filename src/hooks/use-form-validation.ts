import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormValidationOptions<T> {
  readonly schema: z.ZodSchema<T>;
  readonly onSubmit: (data: T) => Promise<void> | void;
}

export const useFormValidation = <T extends Record<string, unknown>>({
  schema,
  onSubmit,
}: UseFormValidationOptions<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (data: T): boolean => {
      const result = schema.safeParse(data);

      if (!result.success) {
        const validationErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            validationErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(validationErrors);
        return false;
      }

      setErrors({});
      return true;
    },
    [schema],
  );

  const clearFieldError = useCallback((field: string): void => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: T): Promise<void> => {
      if (!validate(data)) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit],
  );

  return {
    errors,
    isSubmitting,
    validate,
    clearFieldError,
    handleSubmit,
    setErrors,
  };
};
