// Core Layout System
export { BaseLayout } from './BaseLayout';
export type { LayoutVariant } from './BaseLayout';

// Basic Layouts
export { BasePage } from './BasePage';
export { Header } from './Header';
export { PageSection } from './PageSection';
export { Sidebar } from './Sidebar';
export { Footer } from './Footer';
export { Container } from './Container';
export { WebNavigation, getWebNavItems } from './WebNavigation';
export { MainContent } from './MainContent';

// Page Layouts
export { WebLayout } from './WebLayout';
export { DashboardLayout } from './DashboardLayout';
export { AuthLayout } from './AuthLayout';
export { RightDrawer } from './RightDrawer';

// Form Layouts

// Content Layouts
export { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from './Modal';
export { CardLayout, CardLayoutHeader, CardLayoutBody, CardLayoutFooter, CardGrid, StatsCard } from './CardLayout';
export { GridLayout, GridItem, FlexLayout, SplitLayout } from './GridLayout';


// Search Layouts
export { GlobalSearch } from './GlobalSearch';


// Export types
export type { SearchResult, SearchCategory, SearchFilters } from './GlobalSearch';