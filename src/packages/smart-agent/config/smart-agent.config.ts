/**
 * Smart Agent Configuration
 * Central configuration for AI agent behavior across all platforms
 */

export interface SmartAgentConfig {
  readonly persona: string;
  readonly projectName: string;
  readonly version: string;
  readonly codingStandards: readonly string[];
  readonly folderStructure: Record<string, string>;
  readonly outputRules: {
    readonly format: string;
    readonly language: string;
    readonly commentStyle: string;
    readonly strictTyping: boolean;
  };
  readonly layoutSystem: {
    readonly forbidden: readonly string[];
    readonly required: readonly string[];
    readonly components: Record<string, string>;
  };
  readonly designTokens: {
    readonly forbidden: readonly string[];
    readonly required: readonly string[];
    readonly standards: Record<string, string>;
  };
  readonly accessibility: {
    readonly standard: string;
    readonly requirements: readonly string[];
  };
  readonly internationalization: {
    readonly primaryLanguage: string;
    readonly supportedLanguages: readonly string[];
    readonly rtlLanguages: readonly string[];
  };
  readonly validation: {
    readonly preCommit: readonly string[];
    readonly preBuild: readonly string[];
    readonly quality: readonly string[];
  };
}

export const smartAgentConfig: SmartAgentConfig = {
  persona: "Task Management AI Assistant",
  projectName: "SaaS Template - Task Management",
  version: "1.0.0",
  
  codingStandards: [
    "STRICT TypeScript only - no any types permitted",
    "Explicit return types for all components: JSX.Element",
    "Readonly interfaces for all props",
    "Must use GridLayout system components exclusively",
    "Must use design tokens only - no hardcoded styling",
    "All strings must be localized via i18n",
    "All components extend from appropriate base components",
    "No raw HTML elements in pages - use UI components only",
    "WCAG AAA accessibility compliance mandatory",
    "Norwegian compliance standards for validation",
    "Zustand for state management with Immer",
    "Professional sizing: h-16 minimum for inputs/buttons",
    "Component organization by feature",
    "Pure presentational components in /ui directory",
    "Business logic components in feature directories"
  ],
  
  folderStructure: {
    pages: "src/app/",
    components: "src/components/",
    uiComponents: "src/components/ui/",
    layoutComponents: "src/components/layout/",
    features: "src/features/",
    packages: "src/packages/",
    types: "src/packages/types/",
    store: "src/packages/store/",
    designTokens: "src/packages/design-tokens/",
    localization: "src/packages/localization/",
    hooks: "src/hooks/",
    utils: "src/utils/",
    api: "src/api/",
    styles: "src/styles/"
  },
  
  outputRules: {
    format: "TSX",
    language: "TypeScript",
    commentStyle: "JSDoc",
    strictTyping: true
  },
  
  layoutSystem: {
    forbidden: [
      "<div className=\"flex",
      "<div className=\"grid",
      "<div className=\"flex-col",
      "className=\"space-x-",
      "className=\"space-y-",
      "flex items-center justify-between",
      "grid grid-cols-",
      "flex-col space-y-"
    ],
    required: [
      "FlexLayout",
      "GridLayout",
      "SplitLayout",
      "Container"
    ],
    components: {
      flex: "FlexLayout direction=\"{direction}\" align=\"{align}\" justify=\"{justify}\"",
      grid: "GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap=\"lg\"",
      split: "SplitLayout split=\"50/50\" direction=\"horizontal\"",
      container: "Container size=\"lg\" centered"
    }
  },
  
  designTokens: {
    forbidden: [
      "p-4", "p-2", "p-6", "mb-6", "mt-4",
      "text-blue-", "bg-gray-", "border-green-",
      "h-12", "w-64", "h-10", "h-8",
      "rounded-md", "rounded-lg",
      "shadow-sm", "shadow-md",
      "style={{ padding:", "style={{ margin:"
    ],
    required: [
      "p-8", "mb-12", "mt-8", "space-y-12",
      "text-primary", "bg-muted", "border-border",
      "h-16", "w-80", "h-20",
      "rounded-xl", "rounded-2xl",
      "shadow-lg", "shadow-xl", "shadow-2xl"
    ],
    standards: {
      buttonHeight: "h-16 (64px) minimum",
      inputHeight: "h-16 (64px) minimum",
      cardPadding: "p-8 (32px) minimum",
      sectionSpacing: "space-y-12 (48px) minimum",
      borderRadius: "rounded-xl or rounded-2xl only",
      shadows: "shadow-lg, shadow-xl, shadow-2xl only"
    }
  },
  
  accessibility: {
    standard: "WCAG AAA",
    requirements: [
      "All interactive elements keyboard accessible",
      "ARIA labels and roles for screen readers",
      "Focus management and trapping in modals",
      "High contrast mode support",
      "Skip links for navigation",
      "Proper heading hierarchy",
      "Color contrast ratios AAA compliant",
      "Alternative text for all images",
      "Form validation accessible",
      "Loading states announced to screen readers"
    ]
  },
  
  internationalization: {
    primaryLanguage: "no",
    supportedLanguages: ["no", "en", "fr", "ar"],
    rtlLanguages: ["ar"]
  },
  
  validation: {
    preCommit: [
      "type-check",
      "lint",
      "format:check",
      "validate:design-tokens",
      "validate:component-structure"
    ],
    preBuild: [
      "validate:build-syntax",
      "validate:all"
    ],
    quality: [
      "validate:design-tokens",
      "validate:file-size",
      "validate:component-purity",
      "validate:architecture",
      "validate:component-structure",
      "validate:localization"
    ]
  }
};

// Platform-specific configurations
export const platformConfigs = {
  cursor: {
    configFile: ".cursorrules",
    routesFile: ".cursor.routes.json",
    metaFile: ".cursor.meta"
  },
  claude: {
    configFile: "CLAUDE.md",
    promptFormat: "markdown"
  },
  windsurf: {
    configFile: ".windsurf.config.json",
    memoryFile: ".windsurf.memory"
  },
  replit: {
    configFile: ".replit",
    rulesFile: "replit.nix"
  },
  vscode: {
    settingsFile: ".vscode/settings.json",
    extensionsFile: ".vscode/extensions.json"
  }
} as const;

// Export types
export type PlatformConfig = typeof platformConfigs;
export type Platform = keyof PlatformConfig;