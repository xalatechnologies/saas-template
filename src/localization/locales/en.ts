export const en = {
  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    home: 'Home',
    features: 'Features',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
  },

  // Dashboard
  dashboard: {
    title: 'Task Overview',
    welcome: 'Welcome back',
    totalTasks: 'Total tasks',
    completedTasks: 'Completed tasks',
    inProgressTasks: 'In progress tasks',
    overdueTasks: 'Overdue tasks',
    recentTasks: 'Recent tasks',
    quickActions: 'Quick actions',
    createTask: 'Create task',
    viewAll: 'View all',
  },

  // Tasks
  tasks: {
    title: 'Tasks',
    create: 'Create task',
    edit: 'Edit task',
    delete: 'Delete task',
    status: 'Status',
    priority: 'Priority',
    assignee: 'Assignee',
    dueDate: 'Due date',
    createdAt: 'Created',
    updatedAt: 'Updated',
    description: 'Description',
    tags: 'Tags',

    // Status values
    todo: 'To do',
    inProgress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',

    // Priority values
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',

    // Actions
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    duplicate: 'Duplicate',
    archive: 'Archive',
  },

  // Forms
  forms: {
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    reset: 'Reset',
    required: 'Required',
    optional: 'Optional',

    // Validation messages
    validation: {
      required: 'This field is required',
      email: 'Invalid email address',
      minLength: 'Minimum {{count}} characters',
      maxLength: 'Maximum {{count}} characters',
      passwordMatch: 'Passwords must match',
    },
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    name: 'Name',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    noAccount: 'Don&apos;t have an account?',
    hasAccount: 'Already have an account?',

    // Messages
    loginSuccess: 'Login successful',
    loginError: 'Login failed',
    logoutSuccess: 'You have been logged out',
    registerSuccess: 'Registration successful',
    registerError: 'Registration failed',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'Customize the application according to your needs and preferences',
    general: 'General',
    appearance: 'Appearance',
    language: 'Language',
    theme: {
      title: 'Theme Settings',
      description: 'Select application theme',
      select: 'Select theme',
    },
    accessibility: {
      title: 'Accessibility',
      description: 'Customize accessibility settings',
      highContrast: 'High contrast',
      largeText: 'Large text',
      reduceMotion: 'Reduce motion',
      screenReader: 'Screen reader optimized',
    },
    notifications: 'Notifications',

    // Theme options
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',

    // Language options
    norwegian: 'Norwegian',
    english: 'English',
    french: 'French',
    arabic: 'Arabic',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    close: 'Close',
    notifications: 'Notifications',
    moreOptions: 'More options',
    goToHome: 'Go to homepage',
    openMenu: 'Open menu',
    toggleMenu: 'Toggle menu',
    navigation: {
      home: 'Go to homepage',
      tasks: 'View tasks',
      back: 'Back',
    },

    // Date/Time
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    nextWeek: 'Next week',
  },

  // Search
  search: {
    placeholder: 'Search tasks, projects, people...',
    openSearch: 'Open search',
    noResults: 'No results found',
    tryDifferentKeywords: 'Try searching with different keywords',
    recentSearches: 'Recent Searches',
    trending: 'Trending',
    filters: 'Filters',
    clearFilters: 'Clear all',
    categories: {
      all: 'All',
      tasks: 'Tasks',
      projects: 'Projects',
      people: 'People',
      files: 'Files',
      pages: 'Pages',
    },
  },

  // Norwegian specific (keeping original terms)
  norwegian: {
    personalNumber: 'Personal number',
    postalCode: 'Postal code',
    municipality: 'Municipality',
    county: 'County',

    // Security classifications
    security: {
      public: 'Public',
      internal: 'Internal',
      confidential: 'Confidential',
      secret: 'Secret',
    },
  },

  // Error pages
  errors: {
    notFound: {
      title: '404 - Page Not Found',
      subtitle: "We couldn't find the page you were looking for",
      heading: 'Page Not Found',
      message:
        "Sorry, but we couldn't find the page you were looking for. It might have been moved, renamed, or is temporarily unavailable.",
    },
    unexpected: {
      title: 'Something Went Wrong',
      subtitle: 'An error occurred while processing your request',
      heading: 'Application Error',
      message:
        'Sorry, but an unexpected error occurred. Our technical team has been notified of the issue.',
      details: 'Error Details',
      errorId: 'Error ID',
      tryAgain: 'Try Again',
    },
  },
};
