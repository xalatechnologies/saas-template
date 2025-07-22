// All UI Components (from ui directory)
export * from './ui';

// Layout components - re-export everything from layout/index.ts
export * from './layout';

// Task components
export { TaskCard } from './tasks/TaskCard';
export { TasksContent } from './tasks/TasksContent';

// Dashboard components
export { TaskStats } from './dashboard/TaskStats';
export { DashboardContent } from './dashboard/DashboardContent';

// Landing components
export { LandingContent } from './landing/LandingContent';

// Auth components
export { LoginForm } from './auth/LoginForm';
export { LoginFormContent } from './auth/LoginFormContent';
export { SignupFormContent } from './auth/SignupFormContent';
export { AuthGuard } from './auth/AuthGuard';
export { GuestGuard } from './auth/GuestGuard';
export { AuthProvider } from './auth/AuthProvider';

// Form components
export { TaskForm } from './forms/TaskForm';

// Settings components
export { ThemeSettings } from './settings/ThemeSettings';
export { SettingsContent } from './settings/SettingsContent';
export { AccessibilitySettings } from './accessibility/AccessibilitySettings';

// GDPR components
export { GDPRBanner, GDPRDataRequest, useGDPRStore } from './gdpr/GDPRBanner';

// Accessibility components
export {
  AccessibilityProvider,
  useAccessibility,
  SkipLinks,
  FocusTrap,
} from './accessibility/AccessibilityProvider';

// Development components
export { DevMode } from './dev';

// Re-export types for convenience
export type { BasePageProps } from './layout/BasePage';
export type { PageSectionProps } from './layout/PageSection';
export type { EmptyStateProps } from './ui/states/EmptyState';
export type { LoadingStateProps } from './ui/states/LoadingState';
