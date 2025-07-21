'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  PageSection,
} from '@/components';
import { useAuth, useFormValidation, useUI } from '@/hooks';
import { loginSchema } from '@/utils';
import type { LoginCredentials } from '@/types';

/**
 * Login form component for user authentication
 * @returns React.ReactElement
 */
export const LoginForm = (): React.ReactElement => {
  const { t } = useUI();
  const router = useRouter();
  const { login, isLoading, error, redirectIfAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { errors, handleSubmit, clearFieldError } = useFormValidation({
    schema: loginSchema,
    onSubmit: async (data: LoginCredentials) => {
      await login(data);
      router.push('/');
    },
  });

  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  /**
   * Handles input field changes
   * @param field - Field name to update
   * @returns Change handler function
   */
  const handleInputChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear validation error when user starts typing
      if (errors[field]) {
        clearFieldError(field);
      }
    };

  /**
   * Handles form submission
   * @param e - Form event
   */
  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <PageSection variant="transparent" className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <PageSection variant="transparent" className="flex justify-center">
            <div
              role="img"
              aria-label="Logo"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary"
            >
              <span className="text-2xl font-bold">TM</span>
            </div>
          </PageSection>
          <CardTitle className="text-3xl font-black text-foreground">{t('auth.login')}</CardTitle>
          <p>{t('dashboard.welcome')}</p>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <PageSection variant="transparent">
              <Label htmlFor="email" required>
                {t('auth.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                placeholder="din@epost.no"
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </PageSection>

            {/* Password Field */}
            <PageSection variant="transparent">
              <Label htmlFor="password" required>
                {t('auth.password')}
              </Label>
              <PageSection variant="transparent" className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                  className="pr-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="absolute right-0 top-0 h-full"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </PageSection>
            </PageSection>

            {/* Error Display */}
            {error && (
              <PageSection
                variant="transparent"
                className="rounded-xl bg-destructive/10 border-2 border-destructive/20 p-4"
              >
                <p>{error}</p>
              </PageSection>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  <span>{t('common.loading')}</span>
                </>
              ) : (
                t('auth.login')
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <PageSection variant="transparent" className="bg-muted rounded-xl border-2 border-border">
            <p>Demo credentials:</p>
            <p>
              Email: demo@example.com
              <br />
              Password: password123
            </p>
          </PageSection>
        </CardContent>
      </Card>
    </PageSection>
  );
};
