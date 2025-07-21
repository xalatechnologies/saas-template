export const no = {
  // Navigation
  navigation: {
    dashboard: 'Oversikt',
    tasks: 'Oppgaver',
    settings: 'Innstillinger',
    profile: 'Profil',
    logout: 'Logg ut',
  },

  // Dashboard
  dashboard: {
    title: 'Oppgaveoversikt',
    welcome: 'Velkommen tilbake',
    totalTasks: 'Totalt oppgaver',
    completedTasks: 'Fullførte oppgaver',
    inProgressTasks: 'Pågående oppgaver',
    overdueTasks: 'Forfalte oppgaver',
    recentTasks: 'Nylige oppgaver',
    quickActions: 'Hurtighandlinger',
    createTask: 'Opprett oppgave',
    viewAll: 'Se alle',
  },

  // Tasks
  tasks: {
    title: 'Oppgaver',
    create: 'Opprett oppgave',
    edit: 'Rediger oppgave',
    delete: 'Slett oppgave',
    status: 'Status',
    priority: 'Prioritet',
    assignee: 'Tildelt',
    dueDate: 'Forfallsdato',
    createdAt: 'Opprettet',
    updatedAt: 'Oppdatert',
    description: 'Beskrivelse',
    tags: 'Tagger',
    
    // Status values
    todo: 'Å gjøre',
    inProgress: 'Pågående',
    completed: 'Fullført',
    cancelled: 'Avbrutt',
    
    // Priority values
    low: 'Lav',
    medium: 'Middels',
    high: 'Høy',
    urgent: 'Hastegrad',
    
    // Actions
    markComplete: 'Marker som fullført',
    markIncomplete: 'Marker som ikke fullført',
    duplicate: 'Dupliser',
    archive: 'Arkiver',
  },

  // Forms
  forms: {
    save: 'Lagre',
    cancel: 'Avbryt',
    submit: 'Send inn',
    reset: 'Tilbakestill',
    required: 'Påkrevd',
    optional: 'Valgfri',
    
    // Validation messages
    validation: {
      required: 'Dette feltet er påkrevd',
      email: 'Ugyldig e-postadresse',
      minLength: 'Minimum {{count}} tegn',
      maxLength: 'Maksimum {{count}} tegn',
      passwordMatch: 'Passordene må være like',
    },
  },

  // Authentication
  auth: {
    login: 'Logg inn',
    logout: 'Logg ut',
    register: 'Registrer',
    email: 'E-post',
    password: 'Passord',
    confirmPassword: 'Bekreft passord',
    name: 'Navn',
    forgotPassword: 'Glemt passord?',
    rememberMe: 'Husk meg',
    noAccount: 'Har du ikke konto?',
    hasAccount: 'Har du allerede konto?',
    
    // Messages
    loginSuccess: 'Innlogging vellykket',
    loginError: 'Innlogging feilet',
    logoutSuccess: 'Du er nå logget ut',
    registerSuccess: 'Registrering vellykket',
    registerError: 'Registrering feilet',
    showPassword: 'Vis passord',
    hidePassword: 'Skjul passord',
  },

  // Settings
  settings: {
    title: 'Innstillinger',
    general: 'Generelt',
    appearance: 'Utseende',
    language: 'Språk',
    theme: 'Tema',
    notifications: 'Varsler',
    
    // Theme options
    lightTheme: 'Lys',
    darkTheme: 'Mørk',
    systemTheme: 'System',
    
    // Language options
    norwegian: 'Norsk',
    english: 'Engelsk',
    french: 'Fransk',
    arabic: 'Arabisk',
  },

  // Common
  common: {
    loading: 'Laster...',
    error: 'Feil',
    success: 'Suksess',
    warning: 'Advarsel',
    info: 'Informasjon',
    yes: 'Ja',
    no: 'Nei',
    ok: 'OK',
    search: 'Søk',
    filter: 'Filter',
    sort: 'Sorter',
    clear: 'Tøm',
    refresh: 'Oppdater',
    export: 'Eksporter',
    import: 'Importer',
    print: 'Skriv ut',
    close: 'Lukk',
    notifications: 'Varsler',
    moreOptions: 'Flere alternativer',
    
    // Date/Time
    today: 'I dag',
    yesterday: 'I går',
    tomorrow: 'I morgen',
    thisWeek: 'Denne uken',
    lastWeek: 'Forrige uke',
    nextWeek: 'Neste uke',
  },

  // Norwegian specific
  norwegian: {
    personalNumber: 'Personnummer',
    postalCode: 'Postnummer',
    municipality: 'Kommune',
    county: 'Fylke',
    
    // Security classifications
    security: {
      public: 'Offentlig',
      internal: 'Intern',
      confidential: 'Konfidensiell',
      secret: 'Hemmelig',
    },
  },
};