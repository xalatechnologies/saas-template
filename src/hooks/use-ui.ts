import { useUIStore } from '@/store';
import { useTheme } from '@/providers';
import { useI18n } from '@/providers';
import type { Theme, Language } from '@/types';

export const useUI = () => {
  const {
    sidebarOpen,
    notifications,
    setSidebarOpen,
    toggleSidebar,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useUIStore();

  const { currentTheme, setTheme, toggleDarkMode, isDarkMode } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const showNotification = (
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string,
    duration?: number
  ): void => {
    addNotification({
      type,
      title,
      message,
      duration,
    });
  };

  return {
    // Sidebar
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    
    // Theme
    theme: currentTheme,
    isDarkMode,
    setTheme,
    toggleTheme: toggleDarkMode,
    
    // Language
    language,
    setLanguage,
    t,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showNotification,
  };
};