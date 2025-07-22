/**
 * Prompt Injector
 * Enriches user prompts with project-specific rules and context
 */

import { smartAgentConfig, SmartAgentConfig } from '../config/smart-agent.config';

export interface PromptContext {
  readonly task?: string;
  readonly component?: string;
  readonly feature?: string;
  readonly targetDirectory?: string;
  readonly additionalRules?: readonly string[];
  readonly platform?: 'cursor' | 'claude' | 'windsurf' | 'replit' | 'vscode';
}

export class PromptInjector {
  constructor(private readonly config: SmartAgentConfig = smartAgentConfig) {}

  /**
   * Inject smart agent rules into user prompt
   */
  public injectSmartPrompt(userPrompt: string, context?: PromptContext): string {
    const sections = [
      this.buildPersonaSection(),
      this.buildCodingStandardsSection(),
      this.buildLayoutSystemSection(),
      this.buildDesignTokensSection(),
      this.buildAccessibilitySection(),
      this.buildInternationalizationSection(),
      this.buildFolderStructureSection(context),
      this.buildOutputRulesSection(),
      this.buildValidationSection(),
      context?.additionalRules ? this.buildAdditionalRulesSection(context.additionalRules) : '',
      this.buildTaskSection(userPrompt, context)
    ];

    return sections.filter(Boolean).join('\n\n');
  }

  /**
   * Generate platform-specific prompt
   */
  public generatePlatformPrompt(
    userPrompt: string, 
    platform: PromptContext['platform'], 
    context?: PromptContext
  ): string {
    const basePrompt = this.injectSmartPrompt(userPrompt, { ...context, platform });
    
    switch (platform) {
      case 'cursor':
        return this.wrapForCursor(basePrompt);
      case 'claude':
        return this.wrapForClaude(basePrompt);
      case 'windsurf':
        return this.wrapForWindsurf(basePrompt);
      case 'replit':
        return this.wrapForReplit(basePrompt);
      default:
        return basePrompt;
    }
  }

  private buildPersonaSection(): string {
    return `You are ${this.config.persona} for ${this.config.projectName} v${this.config.version}.
Your role is to ensure all code follows the strict project standards and conventions.`;
  }

  private buildCodingStandardsSection(): string {
    const standards = this.config.codingStandards.map(standard => `- ${standard}`).join('\n');
    return `## MANDATORY Coding Standards

${standards}

CRITICAL: Failure to follow these standards will result in code rejection.`;
  }

  private buildLayoutSystemSection(): string {
    const forbidden = this.config.layoutSystem.forbidden.map(pattern => `- ${pattern}`).join('\n');
    const required = this.config.layoutSystem.required.map(comp => `- ${comp}`).join('\n');
    
    return `## CRITICAL: Layout System Compliance

### ❌ FORBIDDEN Layout Patterns (NEVER USE):
${forbidden}

### ✅ REQUIRED Layout Components (ALWAYS USE):
${required}

### Component Usage Examples:
${Object.entries(this.config.layoutSystem.components)
  .map(([name, usage]) => `- ${name}: <${usage}>`)
  .join('\n')}`;
  }

  private buildDesignTokensSection(): string {
    const forbidden = this.config.designTokens.forbidden.map(token => `- ${token}`).join('\n');
    const required = this.config.designTokens.required.map(token => `- ${token}`).join('\n');
    
    return `## CRITICAL: Design Token System Compliance

### ❌ FORBIDDEN Styling (NEVER USE):
${forbidden}

### ✅ REQUIRED Design Tokens (ALWAYS USE):
${required}

### Professional Standards:
${Object.entries(this.config.designTokens.standards)
  .map(([name, standard]) => `- ${name}: ${standard}`)
  .join('\n')}`;
  }

  private buildAccessibilitySection(): string {
    const requirements = this.config.accessibility.requirements.map(req => `- ${req}`).join('\n');
    
    return `## Accessibility Requirements (${this.config.accessibility.standard})

${requirements}`;
  }

  private buildInternationalizationSection(): string {
    return `## Internationalization

- Primary Language: ${this.config.internationalization.primaryLanguage}
- Supported Languages: ${this.config.internationalization.supportedLanguages.join(', ')}
- RTL Languages: ${this.config.internationalization.rtlLanguages.join(', ')}
- ALWAYS use translation keys via t('key')
- NEVER hardcode strings`;
  }

  private buildFolderStructureSection(context?: PromptContext): string {
    const targetDir = context?.targetDirectory || 
      (context?.component ? this.config.folderStructure.components : 
       context?.feature ? this.config.folderStructure.features : 
       this.config.folderStructure.pages);

    return `## File Organization

Target Directory: ${targetDir}

Full Structure:
${Object.entries(this.config.folderStructure)
  .map(([name, path]) => `- ${name}: ${path}`)
  .join('\n')}`;
  }

  private buildOutputRulesSection(): string {
    return `## Output Requirements

- Format: ${this.config.outputRules.format}
- Language: ${this.config.outputRules.language}
- Comment Style: ${this.config.outputRules.commentStyle}
- Strict Typing: ${this.config.outputRules.strictTyping ? 'MANDATORY' : 'Optional'}`;
  }

  private buildValidationSection(): string {
    return `## Validation Requirements

Pre-commit checks:
${this.config.validation.preCommit.map(check => `- ${check}`).join('\n')}

Pre-build checks:
${this.config.validation.preBuild.map(check => `- ${check}`).join('\n')}

Quality checks:
${this.config.validation.quality.map(check => `- ${check}`).join('\n')}`;
  }

  private buildAdditionalRulesSection(rules: readonly string[]): string {
    return `## Additional Context-Specific Rules

${rules.map(rule => `- ${rule}`).join('\n')}`;
  }

  private buildTaskSection(userPrompt: string, context?: PromptContext): string {
    let taskDescription = `## Task

${userPrompt}`;

    if (context?.task) {
      taskDescription = `Task Type: ${context.task}\n\n${taskDescription}`;
    }

    if (context?.component) {
      taskDescription += `\n\nComponent: ${context.component}`;
    }

    if (context?.feature) {
      taskDescription += `\nFeature: ${context.feature}`;
    }

    return taskDescription;
  }

  // Platform-specific wrappers
  private wrapForCursor(prompt: string): string {
    return `[CURSOR SMART AGENT]

${prompt}

[CURSOR SPECIFIC]
- Use @workspace context for file navigation
- Leverage Cursor's AI capabilities for code completion
- Follow .cursorrules configuration`;
  }

  private wrapForClaude(prompt: string): string {
    return `<smart-agent-prompt>
${prompt}
</smart-agent-prompt>

Remember to use structured thinking and break down complex tasks into steps.`;
  }

  private wrapForWindsurf(prompt: string): string {
    return `# WINDSURF SMART AGENT

${prompt}

## Windsurf Integration
- Check .windsurf.memory for context
- Use Windsurf's workflow capabilities
- Maintain session state`;
  }

  private wrapForReplit(prompt: string): string {
    return `<!-- REPLIT SMART AGENT -->

${prompt}

<!-- REPLIT SPECIFIC -->
- Consider Replit's collaborative environment
- Use Replit's file system API when needed
- Maintain compatibility with Replit's runtime`;
  }
}

// Export singleton instance
export const promptInjector = new PromptInjector();