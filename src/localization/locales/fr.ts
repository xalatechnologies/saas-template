export const fr = {
  // Navigation
  navigation: {
    dashboard: 'Tableau de bord',
    tasks: 'Tâches',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    home: 'Accueil',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    about: 'À propos',
    contact: 'Contact',
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
    dueDate: "Date d'échéance",
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
    register: "S'inscrire",
    signup: "S'inscrire",
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
    registerError: "Échec de l'inscription",
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
    goToHome: 'Aller à la page d\'accueil',
    openMenu: 'Ouvrir le menu',
    toggleMenu: 'Basculer le menu',
    userMenu: 'Menu utilisateur',

    // Date/Time
    today: "Aujourd'hui",
    yesterday: 'Hier',
    tomorrow: 'Demain',
    thisWeek: 'Cette semaine',
    lastWeek: 'La semaine dernière',
    nextWeek: 'La semaine prochaine',
  },

  // Search
  search: {
    placeholder: 'Rechercher tâches, projets, personnes...',
    openSearch: 'Ouvrir la recherche',
    noResults: 'Aucun résultat trouvé',
    tryDifferentKeywords: 'Essayez de rechercher avec des mots-clés différents',
    recentSearches: 'Recherches récentes',
    trending: 'Tendances',
    filters: 'Filtres',
    clearFilters: 'Tout effacer',
    categories: {
      all: 'Tout',
      tasks: 'Tâches',
      projects: 'Projets',
      people: 'Personnes',
      files: 'Fichiers',
      pages: 'Pages',
    },
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

  // Error pages
  errors: {
    notFound: {
      title: '404 - Page non trouvée',
      subtitle: 'Nous ne trouvons pas la page que vous recherchez',
      heading: 'Page non trouvée',
      message:
        'Désolé, mais nous ne trouvons pas la page que vous recherchez. Elle a peut-être été déplacée, renommée ou est temporairement indisponible.',
    },
    unexpected: {
      title: 'Une erreur est survenue',
      subtitle: 'Une erreur est survenue lors du traitement de votre demande',
      heading: "Erreur d'application",
      message:
        'Désolé, mais une erreur inattendue est survenue. Notre équipe technique a été notifiée du problème.',
      details: "Détails de l'erreur",
      errorId: "ID d'erreur",
      tryAgain: 'Réessayer',
    },
  },

  // Landing page
  landing: {
    hero: {
      badge: 'Nouveau: Suggestions de tâches alimentées par IA',
      heading: {
        first: 'Gérez vos tâches avec',
        emphasis: 'Confiance'
      },
      description: 'Conçu pour les équipes modernes avec des fonctionnalités puissantes pour la gestion des tâches, la collaboration et l\'optimisation de la productivité.',
      getStartedButton: 'Commencer',
      loginButton: 'Connexion',
      noCreditCard: 'Inscrivez-vous maintenant et faites l\'expérience de la différence. Aucune carte de crédit requise pour l\'essai.'
    },
    features: {
      heading: 'Tout ce dont vous avez besoin pour rester productif',
      description: 'Des fonctionnalités puissantes conçues pour vous aider à gérer efficacement les tâches et à collaborer sans problème.',
    },
    stats: {
      users: {
        count: '10K+',
        label: 'Utilisateurs actifs'
      },
      tasks: {
        count: '2M+',
        label: 'Tâches terminées'
      },
      uptime: {
        count: '99.9%',
        label: 'Disponibilité'
      },
      rating: {
        count: '4.9',
        label: 'Note utilisateur'
      }
    },
    testimonials: {
      heading: 'Ce que disent nos utilisateurs',
      description: 'Rejoignez des milliers de clients satisfaits qui ont transformé leur expérience de gestion des tâches.'
    },
    pricing: {
      heading: 'Tarification simple et transparente',
      description: 'Pas de frais cachés ni de niveaux compliqués. Choisissez le plan qui convient le mieux aux besoins de votre équipe.',
      badge: {
        mostPopular: 'Plus populaire'
      },
      starter: {
        name: 'Débutant',
        price: '0 €',
        period: 'pour toujours',
        description: 'Parfait pour les individus et les petites équipes',
        features: {
          tasks: 'Jusqu\'à 10 tâches',
          basic: 'Gestion de tâches de base',
          mobile: 'Accès à l\'application mobile',
          email: 'Support par e-mail'
        }
      },
      professional: {
        name: 'Professionnel',
        price: '12 €',
        period: 'par utilisateur/mois',
        description: 'Pour les équipes et entreprises en croissance',
        features: {
          unlimited: 'Tâches illimitées',
          analytics: 'Analyses avancées',
          collaboration: 'Collaboration d\'équipe',
          priority: 'Support prioritaire',
          workflows: 'Flux de travail personnalisés',
          api: 'Accès API'
        }
      },
      enterprise: {
        name: 'Entreprise',
        price: 'Personnalisé',
        period: 'contacter les ventes',
        description: 'Pour les grandes organisations',
        features: {
          everything: 'Tout dans Pro',
          security: 'Sécurité avancée',
          integrations: 'Intégrations personnalisées',
          support: 'Support dédié',
          sla: 'Garantie SLA',
          onpremise: 'Option sur site'
        }
      }
    },
    cta: {
      heading: 'Prêt à booster votre productivité?',
      subtitle: 'Rejoignez des milliers d\'équipes qui utilisent déjà TaskManager pour accomplir davantage.',
      freeTrialButton: 'Commencer l\'essai gratuit',
      contactSalesButton: 'Contacter les ventes'
    }
  },
};
