import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Theme, Language } from '@/types';

interface UIStore {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  notifications: Notification[];

  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Language actions
  setLanguage: (language: Language) => void;

  // Sidebar actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  readonly id: string;
  readonly type: 'info' | 'success' | 'warning' | 'error';
  readonly title: string;
  readonly message: string;
  readonly duration?: number;
}

export const useUIStore = create<UIStore>()(
  immer((set, get) => ({
    theme: 'light',
    language: 'no',
    sidebarOpen: false,
    notifications: [],

    setTheme: (theme: Theme): void => {
      set((state) => {
        state.theme = theme;
      });

      // Update document class and localStorage
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    },

    toggleTheme: (): void => {
      const currentTheme = get().theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      get().setTheme(newTheme);
    },

    setLanguage: (language: Language): void => {
      set((state) => {
        state.language = language;
      });

      if (typeof window !== 'undefined') {
        // Add transition class for smooth RTL switching
        document.documentElement.classList.add('language-transition');
        
        // Update document direction for RTL languages
        const isRTL = language === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        localStorage.setItem('language', language);
        
        // Remove transition class after animation completes
        setTimeout(() => {
          document.documentElement.classList.remove('language-transition');
        }, 300);
      }
    },

    setSidebarOpen: (open: boolean): void => {
      set((state) => {
        state.sidebarOpen = open;
      });
    },

    toggleSidebar: (): void => {
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      });
    },

    addNotification: (notification: Omit<Notification, 'id'>): void => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
      };

      set((state) => {
        state.notifications.push(newNotification);
      });

      // Auto remove after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, notification.duration || 5000);
      }
    },

    removeNotification: (id: string): void => {
      set((state) => {
        state.notifications = state.notifications.filter((n) => n.id !== id);
      });
    },

    clearNotifications: (): void => {
      set((state) => {
        state.notifications = [];
      });
    },
  })),
);
