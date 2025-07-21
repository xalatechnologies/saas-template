export const en = {
  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
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
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    name: 'Name',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
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
    general: 'General',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
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
    
    // Date/Time
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    nextWeek: 'Next week',
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
};