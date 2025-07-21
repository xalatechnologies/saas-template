'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '../ui';
import { useAuth, useFormValidation, useUI } from '@/hooks';
import { loginSchema } from '@/utils';
import type { LoginCredentials } from '@/types';

/**
 * Login form component for user authentication
 * @returns JSX.Element
 */
export const LoginForm = (): JSX.Element => {
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
  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData(prev => ({
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
    setShowPassword(prev => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-6 py-12">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl ring-2 ring-primary/20">
            <span className="text-2xl font-black text-primary-foreground">TM</span>
          </div>
          <CardTitle className="text-3xl font-black text-foreground">
            {t('auth.login')}
          </CardTitle>
          <p className="text-lg text-muted-foreground mt-3">
            {t('dashboard.welcome')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-3">
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
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" required>
                {t('auth.password')}
              </Label>
              <div className="relative">
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
                  className="absolute right-0 top-0 h-full px-4 py-3 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border-2 border-destructive/20 p-4 mt-6">
                <p className="text-base text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-8 h-14 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.login')
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-6 bg-muted rounded-xl border-2 border-border">
            <p className="text-base text-muted-foreground mb-3 font-medium">Demo credentials:</p>
            <p className="text-sm text-muted-foreground">
              Email: demo@example.com<br />
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};