/**
 * Enhanced Prompt Injector
 * Uses both smart-agent config and loaded project rules
 */

import { PromptInjector, PromptContext } from './prompt-injector';
import { rulesLoader, ProjectRules } from '../integrations/rules-loader';
import { smartAgentConfig } from '../config/smart-agent.config';

export class EnhancedPromptInjector extends PromptInjector {
  private projectRules: ProjectRules | null = null;
  private rulesLoaded = false;

  /**
   * Initialize by loading project rules
   */
  public async initialize(): Promise<void> {
    if (this.rulesLoaded) return;

    const { cursorrules, claudeMd } = await rulesLoader.loadAllRules();
    
    // Prefer .cursorrules if available, otherwise use CLAUDE.md
    if (cursorrules) {
      this.projectRules = cursorrules;
    } else if (claudeMd) {
      this.projectRules = claudeMd;
    } else {
      console.warn('No project rules found, using default configuration only');
    }

    this.rulesLoaded = true;
  }

  /**
   * Enhanced inject that includes project rules
   */
  public async injectEnhancedPrompt(userPrompt: string, context?: PromptContext): Promise<string> {
    await this.initialize();

    // Get base prompt from parent class
    const basePrompt = super.injectSmartPrompt(userPrompt, context);

    // If no project rules, return base prompt
    if (!this.projectRules) {
      return basePrompt;
    }

    // Enhance with project rules
    const enhancedSections = [
      this.buildProjectSpecificSection(),
      basePrompt,
      this.buildProjectRulesSection(),
      this.buildValidationChecklistSection()
    ];

    return enhancedSections.filter(Boolean).join('\n\n');
  }

  /**
   * Build section from project-specific rules
   */
  private buildProjectSpecificSection(): string {
    if (!this.projectRules) return '';

    const projectOverview = this.projectRules.sections.get('Project Overview');
    if (!projectOverview) return '';

    return `## Project Context

${projectOverview}

Source: ${this.projectRules.source === 'cursorrules' ? '.cursorrules file' : 'CLAUDE.md file'}`;
  }

  /**
   * Build comprehensive rules section
   */
  private buildProjectRulesSection(): string {
    if (!this.projectRules) return '';

    const sections: string[] = [];

    // Add critical sections from project rules
    const criticalSections = [
      'CRITICAL: Layout System Compliance',
      'CRITICAL: Design Token System Compliance',
      'Core Development Rules',
      'Accessibility Requirements',
      'Norwegian Compliance'
    ];

    for (const sectionName of criticalSections) {
      const content = this.findSection(sectionName);
      if (content) {
        sections.push(`### ${sectionName}\n\n${content}`);
      }
    }

    // Add merged forbidden and required patterns
    if (this.projectRules.forbiddenPatterns.length > 0) {
      sections.push(`### Combined Forbidden Patterns

${this.projectRules.forbiddenPatterns.map(p => `- ${p}`).join('\n')}`);
    }

    if (this.projectRules.requiredPatterns.length > 0) {
      sections.push(`### Combined Required Patterns

${this.projectRules.requiredPatterns.map(p => `- ${p}`).join('\n')}`);
    }

    return sections.join('\n\n');
  }

  /**
   * Build validation checklist
   */
  private buildValidationChecklistSection(): string {
    if (!this.projectRules) return '';

    const checklistContent = this.findSection('Code Quality Checklist') || 
                           this.findSection('Code Review Checklist') ||
                           this.findSection('Validation Checklist');

    if (!checklistContent) return '';

    return `## Final Validation Checklist

${checklistContent}

CRITICAL: Ensure all items are checked before completing the task.`;
  }

  /**
   * Find section by partial name match
   */
  private findSection(partialName: string): string | undefined {
    if (!this.projectRules) return undefined;

    for (const [sectionName, content] of Array.from(this.projectRules.sections)) {
      if (sectionName.includes(partialName)) {
        return content;
      }
    }

    return undefined;
  }

  /**
   * Generate cursor-specific prompt using .cursorrules
   */
  public async generateCursorPrompt(userPrompt: string, context?: PromptContext): Promise<string> {
    await this.initialize();

    // If we have .cursorrules, use them directly
    if (this.projectRules && this.projectRules.source === 'cursorrules') {
      return `${this.projectRules.content}\n\n---\n\n## Current Task\n\n${userPrompt}`;
    }

    // Otherwise use enhanced prompt
    return this.generatePlatformPrompt(userPrompt, 'cursor', context);
  }

  /**
   * Validate code against project rules
   */
  public async validateCode(code: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    await this.initialize();

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.projectRules) {
      warnings.push('No project rules loaded for validation');
      return { valid: true, errors, warnings };
    }

    // Check forbidden patterns
    for (const pattern of this.projectRules.forbiddenPatterns) {
      if (code.includes(pattern)) {
        errors.push(`Forbidden pattern found: ${pattern}`);
      }
    }

    // Check for required patterns (warning if component code doesn't have any)
    if (code.includes('export') && code.includes('JSX.Element')) {
      let hasRequiredPattern = false;
      for (const pattern of this.projectRules.requiredPatterns) {
        if (code.includes(pattern)) {
          hasRequiredPattern = true;
          break;
        }
      }
      if (!hasRequiredPattern) {
        warnings.push('Component does not use any required patterns (GridLayout, design tokens, etc.)');
      }
    }

    // Additional validation from config
    const configForbidden = [
      ...smartAgentConfig.layoutSystem.forbidden,
      ...smartAgentConfig.designTokens.forbidden
    ];

    for (const pattern of configForbidden) {
      if (code.includes(pattern)) {
        errors.push(`Config forbidden pattern found: ${pattern}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const enhancedPromptInjector = new EnhancedPromptInjector();