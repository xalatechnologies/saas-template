'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { Button } from '../ui';
import { Container, FlexLayout, GridLayout, SplitLayout } from './';
import { cn } from '@/utils';

interface AuthLayoutProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly type: 'login' | 'signup' | 'forgot-password' | 'reset-password';
}

interface Feature {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly description: string;
}

/**
 * Auth layout component with split-screen design
 * @returns JSX.Element
 */
export const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  type 
}: AuthLayoutProps): JSX.Element => {
  const features: Feature[] = [
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Get intelligent task recommendations and productivity analytics',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and GDPR compliance built-in',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for teams of any size',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time updates and seamless team coordination',
    },
  ];

  return (
    <SplitLayout
      className="min-h-screen"
      split="60/40"
    >
      <Container size="full" className="hidden lg:flex bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <FlexLayout direction="column" justify="between" className="h-full w-full">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bg-white rounded-full blur-3xl" style={{ top: '-6rem', left: '-6rem', width: '24rem', height: '24rem' }} />
              <div className="absolute bg-white rounded-full blur-3xl" style={{ bottom: '-6rem', right: '-6rem', width: '24rem', height: '24rem' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-3xl" style={{ width: '24rem', height: '24rem' }} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center text-primary-foreground" style={{ gap: 'var(--spacing-sm)' }}>
                <FlexLayout align="center" justify="center" className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl" style={{ height: 'var(--icon-container-xl)', width: 'var(--icon-container-xl)' }}>
                  <span className="text-xl font-bold">TM</span>
                </FlexLayout>
                <span className="text-2xl font-bold">TaskManager</span>
              </Link>

              {/* Main Content */}
              <div className="max-w-xl" style={{ marginTop: 'var(--spacing-3xl)' }}>
                <h1 className="text-5xl font-bold text-white leading-tight" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  Manage Tasks with Confidence
                </h1>
                <p className="text-xl text-white/90 leading-relaxed" style={{ marginBottom: 'var(--spacing-xl)' }}>
                  Join thousands of teams using TaskManager to streamline their workflow and boost productivity.
                </p>

                {/* Features Grid */}
                <GridLayout columns={{ mobile: 1, tablet: 2 }} gap="lg">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" style={{ padding: 'var(--spacing-lg)' }}"
                      >
                        <Icon className="text-white" style={{ height: 'var(--icon-lg)', width: 'var(--icon-lg)', marginBottom: 'var(--spacing-sm)' }} />
                        <h3 className="text-white font-semibold" style={{ marginBottom: 'var(--spacing-xs)' }}>{feature.title}</h3>
                        <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    );
                  })}
                </GridLayout>
              </div>
            </div>

          {/* Footer */}
          <div className="relative z-10">
            <p className="text-white/60 text-sm">
              © 2024 TaskManager. All rights reserved.
            </p>
          </div>
        </FlexLayout>
      </Container>

      <FlexLayout direction="column" className="w-full">
        {/* Top Navigation */}
        <Container size="full" className="border-b border-border">
          <FlexLayout direction="row" align="center" justify="between">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-2xl"
              >
                <ArrowLeft style={{ height: 'var(--icon-xs)', width: 'var(--icon-xs)', marginRight: 'var(--spacing-xs)' }} />
                Back to home
              </Button>
            </Link>
            
            <div className="text-sm text-muted-foreground">
              {type === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </>
              ) : type === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <Link 
                    href="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Log in
                  </Link>
                </>
              ) : null}
            </div>
          </FlexLayout>
        </Container>

          {/* Form Container */}
          <FlexLayout direction="column" align="center" justify="center" className="flex-1">
            <Container size="sm" className="w-full max-w-md">
              {/* Mobile Logo (shown only on mobile) */}
              <div className="lg:hidden text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link href="/" className="inline-flex items-center text-primary" style={{ gap: 'var(--spacing-sm)' }}>
                  <FlexLayout align="center" justify="center" className="bg-primary text-primary-foreground rounded-2xl shadow-xl" style={{ height: 'var(--icon-container-xl)', width: 'var(--icon-container-xl)' }}>
                    <span className="text-xl font-bold">TM</span>
                  </FlexLayout>
                  <span className="text-2xl font-bold">TaskManager</span>
                </Link>
              </div>

              {/* Form Header */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 className="text-3xl font-bold text-foreground" style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>

              {/* Form Content */}
              <FlexLayout direction="column" gap="lg">
                {children}
              </FlexLayout>

              {/* Social Login */}
              {(type === 'login' || type === 'signup') && (
                <>
                  <div className="relative" style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-background text-muted-foreground" style={{ paddingLeft: 'var(--spacing-sm)', paddingRight: 'var(--spacing-sm)' }}>Or continue with</span>
                    </div>
                  </div>

                  <GridLayout columns={{ mobile: 2 }} gap="md">
                    <Button
                      variant="outline"
                      className="rounded-2xl font-medium"
                      style={{ height: 'var(--button-lg)' }}
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)', marginRight: 'var(--spacing-xs)' }}>
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl font-medium"
                      style={{ height: 'var(--button-lg)' }}
                      type="button"
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)', marginRight: 'var(--spacing-xs)' }}>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </Button>
                  </GridLayout>
                </>
              )}

            {/* Terms */}
            {type === 'signup' && (
              <p className="text-center text-sm text-muted-foreground" style={{ marginTop: 'var(--spacing-lg)' }}>
                By signing up, you agree to our{' '}
                <Link href={'/terms' as any} className="font-medium text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href={'/privacy' as any} className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            )}
          </Container>
        </FlexLayout>
      </FlexLayout>
    </SplitLayout>
  );
};