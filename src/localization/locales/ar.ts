export const ar = {
  // Navigation
  navigation: {
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    features: 'المميزات',
    pricing: 'الأسعار',
    about: 'حول',
    contact: 'اتصل بنا',
  },

  // Dashboard
  dashboard: {
    title: 'نظرة عامة على المهام',
    welcome: 'مرحباً بعودتك',
    totalTasks: 'إجمالي المهام',
    completedTasks: 'المهام المكتملة',
    inProgressTasks: 'المهام قيد التنفيذ',
    overdueTasks: 'المهام المتأخرة',
    recentTasks: 'المهام الحديثة',
    quickActions: 'الإجراءات السريعة',
    createTask: 'إنشاء مهمة',
    viewAll: 'عرض الكل',
  },

  // Tasks
  tasks: {
    title: 'المهام',
    create: 'إنشاء مهمة',
    edit: 'تعديل المهمة',
    delete: 'حذف المهمة',
    status: 'الحالة',
    priority: 'الأولوية',
    assignee: 'المسؤول',
    dueDate: 'تاريخ الاستحقاق',
    createdAt: 'تم الإنشاء',
    updatedAt: 'تم التحديث',
    description: 'الوصف',
    tags: 'العلامات',

    // Status values
    todo: 'للقيام',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    cancelled: 'ملغي',

    // Priority values
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    urgent: 'عاجلة',

    // Actions
    markComplete: 'وضع علامة مكتمل',
    markIncomplete: 'وضع علامة غير مكتمل',
    duplicate: 'تكرار',
    archive: 'أرشفة',
  },

  // Forms
  forms: {
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    reset: 'إعادة تعيين',
    required: 'مطلوب',
    optional: 'اختياري',

    // Validation messages
    validation: {
      required: 'هذا الحقل مطلوب',
      email: 'عنوان بريد إلكتروني غير صالح',
      minLength: 'الحد الأدنى {{count}} أحرف',
      maxLength: 'الحد الأقصى {{count}} أحرف',
      passwordMatch: 'كلمات المرور يجب أن تتطابق',
    },
  },

  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'التسجيل',
    signup: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',

    // Messages
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginError: 'فشل تسجيل الدخول',
    logoutSuccess: 'تم تسجيل خروجك',
    registerSuccess: 'تم التسجيل بنجاح',
    registerError: 'فشل التسجيل',
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    general: 'عام',
    appearance: 'المظهر',
    language: 'اللغة',
    theme: 'السمة',
    notifications: 'الإشعارات',

    // Theme options
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    systemTheme: 'النظام',

    // Language options
    norwegian: 'النرويجية',
    english: 'الإنجليزية',
    french: 'الفرنسية',
    arabic: 'العربية',
  },

  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومات',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    clear: 'مسح',
    refresh: 'تحديث',
    export: 'تصدير',
    import: 'استيراد',
    print: 'طباعة',
    close: 'إغلاق',
    goToHome: 'الانتقال إلى الصفحة الرئيسية',
    openMenu: 'فتح القائمة',
    toggleMenu: 'تبديل القائمة',
    userMenu: 'قائمة المستخدم',

    // Date/Time
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    nextWeek: 'الأسبوع القادم',
  },

  // Search
  search: {
    placeholder: 'البحث في المهام والمشاريع والأشخاص...',
    openSearch: 'فتح البحث',
    noResults: 'لا توجد نتائج',
    tryDifferentKeywords: 'حاول البحث بكلمات مفتاحية مختلفة',
    recentSearches: 'عمليات البحث الأخيرة',
    trending: 'الأكثر رواجاً',
    filters: 'المرشحات',
    clearFilters: 'مسح الكل',
    categories: {
      all: 'الكل',
      tasks: 'المهام',
      projects: 'المشاريع',
      people: 'الأشخاص',
      files: 'الملفات',
      pages: 'الصفحات',
    },
  },

  // Norwegian specific (keeping original terms)
  norwegian: {
    personalNumber: 'الرقم الشخصي',
    postalCode: 'الرمز البريدي',
    municipality: 'البلدية',
    county: 'المقاطعة',

    // Security classifications
    security: {
      public: 'عام',
      internal: 'داخلي',
      confidential: 'سري',
      secret: 'سري للغاية',
    },
  },

  // Error pages
  errors: {
    notFound: {
      title: '404 - الصفحة غير موجودة',
      subtitle: 'لم نتمكن من العثور على الصفحة التي تبحث عنها',
      heading: 'الصفحة غير موجودة',
      message:
        'عذراً، لكننا لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو إعادة تسميتها أو أنها غير متاحة مؤقتاً.',
    },
    unexpected: {
      title: 'حدث خطأ ما',
      subtitle: 'حدث خطأ أثناء معالجة طلبك',
      heading: 'خطأ في التطبيق',
      message:
        'عذراً، لكن حدث خطأ غير متوقع. تم إخطار فريقنا التقني بالمشكلة.',
      details: 'تفاصيل الخطأ',
      errorId: 'معرف الخطأ',
      tryAgain: 'حاول مرة أخرى',
    },
  },

  // Landing page
  landing: {
    hero: {
      badge: 'جديد: اقتراحات المهام المدعومة بالذكاء الاصطناعي',
      heading: {
        first: 'إدارة المهام',
        emphasis: 'بثقة'
      },
      description: 'مصمم للفرق الحديثة مع ميزات قوية لإدارة المهام والتعاون وتحسين الإنتاجية.',
      getStartedButton: 'ابدأ الآن',
      loginButton: 'تسجيل الدخول',
      noCreditCard: 'سجل الآن وجرب الفرق. لا حاجة لبطاقة ائتمان للفترة التجريبية.'
    },
    features: {
      heading: 'كل ما تحتاجه للبقاء منتجاً',
      description: 'ميزات قوية مصممة لمساعدتك على إدارة المهام بكفاءة والتعاون بسلاسة.',
    },
    stats: {
      users: {
        count: '+10 آلاف',
        label: 'مستخدم نشط'
      },
      tasks: {
        count: '+2 مليون',
        label: 'مهمة مكتملة'
      },
      uptime: {
        count: '99.9%',
        label: 'وقت التشغيل'
      },
      rating: {
        count: '4.9',
        label: 'تقييم المستخدمين'
      }
    },
    testimonials: {
      heading: 'ماذا يقول مستخدمونا',
      description: 'انضم إلى آلاف العملاء الراضين الذين قاموا بتحويل تجربة إدارة المهام الخاصة بهم.'
    },
    pricing: {
      heading: 'تسعير بسيط وشفاف',
      description: 'لا رسوم خفية أو مستويات معقدة. اختر الخطة التي تناسب احتياجات فريقك بشكل أفضل.',
      badge: {
        mostPopular: 'الأكثر شعبية'
      },
      starter: {
        name: 'المبتدئ',
        price: '0$',
        period: 'للأبد',
        description: 'مثالي للأفراد والفرق الصغيرة',
        features: {
          tasks: 'ما يصل إلى 10 مهام',
          basic: 'إدارة المهام الأساسية',
          mobile: 'الوصول إلى تطبيق الهاتف المحمول',
          email: 'دعم البريد الإلكتروني'
        }
      },
      professional: {
        name: 'المحترف',
        price: '12$',
        period: 'لكل مستخدم/شهر',
        description: 'للفرق والشركات النامية',
        features: {
          unlimited: 'مهام غير محدودة',
          analytics: 'تحليلات متقدمة',
          collaboration: 'تعاون الفريق',
          priority: 'دعم ذو أولوية',
          workflows: 'سير عمل مخصص',
          api: 'وصول إلى API'
        }
      },
      enterprise: {
        name: 'المؤسسة',
        price: 'مخصص',
        period: 'اتصل بالمبيعات',
        description: 'للمؤسسات الكبيرة',
        features: {
          everything: 'كل شيء في المحترف',
          security: 'أمان متقدم',
          integrations: 'تكاملات مخصصة',
          support: 'دعم مخصص',
          sla: 'ضمان SLA',
          onpremise: 'خيار التثبيت المحلي'
        }
      }
    },
    cta: {
      heading: 'هل أنت مستعد لتعزيز إنتاجيتك؟',
      subtitle: 'انضم إلى آلاف الفرق التي تستخدم بالفعل TaskManager لتحقيق المزيد.',
      freeTrialButton: 'بدء الفترة التجريبية المجانية',
      contactSalesButton: 'اتصل بالمبيعات'
    }
  },
};
