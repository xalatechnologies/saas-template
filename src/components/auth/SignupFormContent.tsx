'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input, Label, Checkbox } from '@/components';
import { useAuth, useFormValidation, useUI } from '@/hooks';
import { registerSchema } from '@/utils';

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Signup form content component for use with AuthLayout
 * @returns JSX.Element
 */
export const SignupFormContent = (): JSX.Element => {
  const { t } = useUI();
  const router = useRouter();
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { errors, handleSubmit, clearFieldError } = useFormValidation({
    schema: registerSchema,
    onSubmit: async (data: SignupData) => {
      if (!agreedToTerms) {
        throw new Error('Please agree to the terms and conditions');
      }
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push('/');
    },
  });

  const handleInputChange =
    (field: keyof SignupData) =>
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
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-semibold">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          placeholder="John Doe"
          disabled={isLoading}
          autoComplete="name"
          required
          className="h-12 rounded-xl text-base"
        />
      </div>

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
        <Label htmlFor="password" className="text-base font-semibold">
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
            autoComplete="new-password"
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-base font-semibold">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="••••••••"
          disabled={isLoading}
          autoComplete="new-password"
          required
          className="h-12 rounded-xl text-base"
        />
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          disabled={isLoading}
          className="mt-1"
        />
        <Label 
          htmlFor="terms" 
          className="text-sm font-medium cursor-pointer leading-relaxed"
        >
          I agree to the Terms of Service and Privacy Policy
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
        disabled={isLoading || !agreedToTerms}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
};