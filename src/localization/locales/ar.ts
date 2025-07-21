export const ar = {
  // Navigation
  navigation: {
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
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
    
    // Date/Time
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    nextWeek: 'الأسبوع القادم',
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
};