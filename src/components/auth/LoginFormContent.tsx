'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input, Label, Checkbox } from '@/components';
import { useAuth, useFormValidation, useUI } from '@/hooks';
import { loginSchema } from '@/utils';
import type { LoginCredentials } from '@/types';

/**
 * Login form content component for use with AuthLayout
 * @returns JSX.Element
 */
export const LoginFormContent = (): JSX.Element => {
  const { t } = useUI();
  const router = useRouter();
  const { login, isLoading, error, redirectIfAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleInputChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (errors[field]) {
        clearFieldError(field);
      }
    };

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-semibold">
          {t('auth.email')}
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="you@example.com"
          disabled={isLoading}
          autoComplete="email"
          required
          className="h-12 rounded-xl text-base"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-base font-semibold">
            {t('auth.password')}
          </Label>
          <Link 
            href="/forgot-password" 
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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
            className="h-12 rounded-xl text-base pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-10 w-10 rounded-lg"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={isLoading}
        />
        <Label 
          htmlFor="remember" 
          className="text-sm font-medium cursor-pointer"
        >
          Remember me for 30 days
        </Label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base font-semibold shadow-lg" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.loading')}
          </>
        ) : (
          t('auth.login')
        )}
      </Button>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
        <p className="text-sm font-semibold text-muted-foreground mb-1">Demo credentials:</p>
        <p className="text-sm text-muted-foreground">
          Email: demo@example.com<br />
          Password: password123
        </p>
      </div>
    </form>
  );
};