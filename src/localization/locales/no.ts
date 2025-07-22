export const no = {
  // Navigation
  navigation: {
    dashboard: 'Oversikt',
    tasks: 'Oppgaver',
    settings: 'Innstillinger',
    profile: 'Profil',
    logout: 'Logg ut',
    home: 'Hjem',
    features: 'Funksjoner',
    pricing: 'Priser',
    about: 'Om oss',
    contact: 'Kontakt',
  },

  // Dashboard
  dashboard: {
    title: 'Oppgaveoversikt',
    welcome: 'Velkommen tilbake',
    overview: 'Her er en oversikt over dine oppgaver og fremdrift.',
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
    filter: 'Filtrer oppgaver',
    new: 'Nye oppgaver',
    noTasksYet: 'Ingen oppgaver ennå',
    createFirstTask: 'Opprett din første oppgave for å komme i gang!',

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
    signup: 'Registrer deg',
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
    subtitle: 'Tilpass applikasjonen etter dine behov og preferanser',
    general: 'Generelt',
    appearance: 'Utseende',
    language: 'Språk',
    theme: {
      title: 'Tema-innstillinger',
      description: 'Velg tema for applikasjonen',
      select: 'Velg tema',
    },
    accessibility: {
      title: 'Tilgjengelighet',
      description: 'Tilpass tilgjengelighetsinnstillinger',
      highContrast: 'Høy kontrast',
      largeText: 'Stor tekst',
      reduceMotion: 'Reduser bevegelser',
      screenReader: 'Skjermleser-optimalisert',
    },
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
    goToHome: 'Gå til forsiden',
    openMenu: 'Åpne meny',
    toggleMenu: 'Veksle meny',
    navigation: {
      home: 'Gå til forsiden',
      tasks: 'Vis oppgaver',
      back: 'Tilbake',
    },
    generateReport: 'Generer rapport',
    loading: 'Laster innhold...',

    // Date/Time
    today: 'I dag',
    yesterday: 'I går',
    tomorrow: 'I morgen',
    thisWeek: 'Denne uken',
    lastWeek: 'Forrige uke',
    nextWeek: 'Neste uke',
  },

  // Search
  search: {
    placeholder: 'Søk oppgaver, prosjekter, personer...',
    openSearch: 'Åpne søk',
    noResults: 'Ingen resultater funnet',
    tryDifferentKeywords: 'Prøv å søke med andre nøkkelord',
    recentSearches: 'Nylige søk',
    trending: 'Populært',
    filters: 'Filtre',
    clearFilters: 'Fjern alle',
    categories: {
      all: 'Alle',
      tasks: 'Oppgaver',
      projects: 'Prosjekter',
      people: 'Personer',
      files: 'Filer',
      pages: 'Sider',
    },
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

  // Error pages
  errors: {
    notFound: {
      title: '404 - Side ikke funnet',
      subtitle: 'Vi kunne ikke finne siden du leter etter',
      heading: 'Siden finnes ikke',
      message:
        'Beklager, men vi kunne ikke finne siden du leter etter. Den kan ha blitt flyttet, omdøpt eller midlertidig utilgjengelig.',
    },
    unexpected: {
      title: 'Noe gikk galt',
      subtitle: 'Det oppstod en feil under behandling av forespørselen din',
      heading: 'Applikasjonsfeil',
      message:
        'Beklager, men det oppstod en uventet feil. Vår tekniske team har blitt varslet om problemet.',
      details: 'Feildetaljer',
      errorId: 'Feil-ID',
      tryAgain: 'Prøv igjen',
    },
  },
};
