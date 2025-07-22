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

// Auth components
export { LoginForm } from './auth/LoginForm';
export { LoginFormContent } from './auth/LoginFormContent';
export { SignupFormContent } from './auth/SignupFormContent';

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

// Re-export types for convenience
export type { BasePageProps } from './layout/BasePage';
export type { PageSectionProps } from './layout/PageSection';
export type { ContentGridProps } from './layout/ContentGrid';
export type { EmptyStateProps } from './layout/EmptyState';
export type { LoadingStateProps } from './layout/LoadingState';
