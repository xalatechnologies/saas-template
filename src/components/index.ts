// All UI Components (from ui directory)
export * from './ui';

// Layout components
export { Layout } from './layout/Layout';
export { Header } from './layout/Header';
export { Sidebar } from './layout/Sidebar';
export { BasePage } from './layout/BasePage';
export { PageSection } from './layout/PageSection';
export { ContentGrid } from './layout/ContentGrid';
export { EmptyState } from './layout/EmptyState';
export { LoadingState } from './layout/LoadingState';
export { NotFoundContent } from './layout/NotFoundContent';
export { ErrorContent } from './layout/ErrorContent';

// Task components
export { TaskCard } from './tasks/TaskCard';
export { TasksContent } from './tasks/TasksContent';

// Dashboard components
export { TaskStats } from './dashboard/TaskStats';
export { DashboardContent } from './dashboard/DashboardContent';

// Auth components
export { LoginForm } from './auth/LoginForm';

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
