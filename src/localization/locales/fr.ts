export const fr = {
  // Navigation
  navigation: {
    dashboard: 'Tableau de bord',
    tasks: 'Tâches',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
  },

  // Dashboard
  dashboard: {
    title: 'Aperçu des tâches',
    welcome: 'Bienvenue',
    totalTasks: 'Tâches totales',
    completedTasks: 'Tâches terminées',
    inProgressTasks: 'Tâches en cours',
    overdueTasks: 'Tâches en retard',
    recentTasks: 'Tâches récentes',
    quickActions: 'Actions rapides',
    createTask: 'Créer une tâche',
    viewAll: 'Voir tout',
  },

  // Tasks
  tasks: {
    title: 'Tâches',
    create: 'Créer une tâche',
    edit: 'Modifier la tâche',
    delete: 'Supprimer la tâche',
    status: 'Statut',
    priority: 'Priorité',
    assignee: 'Assigné à',
    dueDate: 'Date d\'échéance',
    createdAt: 'Créé le',
    updatedAt: 'Modifié le',
    description: 'Description',
    tags: 'Étiquettes',
    
    // Status values
    todo: 'À faire',
    inProgress: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
    
    // Priority values
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Élevée',
    urgent: 'Urgente',
    
    // Actions
    markComplete: 'Marquer comme terminé',
    markIncomplete: 'Marquer comme incomplet',
    duplicate: 'Dupliquer',
    archive: 'Archiver',
  },

  // Forms
  forms: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    submit: 'Soumettre',
    reset: 'Réinitialiser',
    required: 'Requis',
    optional: 'Optionnel',
    
    // Validation messages
    validation: {
      required: 'Ce champ est requis',
      email: 'Adresse e-mail invalide',
      minLength: 'Minimum {{count}} caractères',
      maxLength: 'Maximum {{count}} caractères',
      passwordMatch: 'Les mots de passe doivent correspondre',
    },
  },

  // Authentication
  auth: {
    login: 'Connexion',
    logout: 'Déconnexion',
    register: 'S\'inscrire',
    email: 'E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    name: 'Nom',
    forgotPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi',
    noAccount: 'Pas de compte ?',
    hasAccount: 'Déjà un compte ?',
    
    // Messages
    loginSuccess: 'Connexion réussie',
    loginError: 'Échec de la connexion',
    logoutSuccess: 'Vous avez été déconnecté',
    registerSuccess: 'Inscription réussie',
    registerError: 'Échec de l\'inscription',
  },

  // Settings
  settings: {
    title: 'Paramètres',
    general: 'Général',
    appearance: 'Apparence',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    
    // Theme options
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    systemTheme: 'Système',
    
    // Language options
    norwegian: 'Norvégien',
    english: 'Anglais',
    french: 'Français',
    arabic: 'Arabe',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    clear: 'Effacer',
    refresh: 'Actualiser',
    export: 'Exporter',
    import: 'Importer',
    print: 'Imprimer',
    close: 'Fermer',
    
    // Date/Time
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    thisWeek: 'Cette semaine',
    lastWeek: 'La semaine dernière',
    nextWeek: 'La semaine prochaine',
  },

  // Norwegian specific (keeping original terms)
  norwegian: {
    personalNumber: 'Numéro personnel',
    postalCode: 'Code postal',
    municipality: 'Municipalité',
    county: 'Comté',
    
    // Security classifications
    security: {
      public: 'Public',
      internal: 'Interne',
      confidential: 'Confidentiel',
      secret: 'Secret',
    },
  },
};