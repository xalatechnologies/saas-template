/**
 * Smart Agent System
 * Enforces consistent coding standards across AI tools
 */

// Core exports
export { PromptInjector } from './core/prompt-injector';
export type { PromptContext } from './core/prompt-injector';
export { EnhancedPromptInjector, enhancedPromptInjector } from './core/enhanced-prompt-injector';

// Configuration
export type { SmartAgentConfig } from './config/smart-agent.config';
export { smartAgentConfig, platformConfigs } from './config/smart-agent.config';

// Task management
export type { Task, TaskContext, TaskResult } from './tasks/task-manager';
export { TaskManager, taskManager } from './tasks/task-manager';

// Integrations
export type { ProjectRules } from './integrations/rules-loader';
export { RulesLoader, rulesLoader } from './integrations/rules-loader';
export { CursorIntegration, cursorIntegration } from './integrations/cursor-integration';

// Import necessary types and instances for utility functions
import { enhancedPromptInjector } from './core/enhanced-prompt-injector';
import type { PromptContext } from './core/prompt-injector';

// Utility functions
export async function initializeSmartAgent(): Promise<void> {
  await enhancedPromptInjector.initialize();
}

export async function generatePrompt(
  userPrompt: string,
  platform?: PromptContext['platform'],
  context?: PromptContext
): Promise<string> {
  if (platform) {
    return enhancedPromptInjector.generatePlatformPrompt(userPrompt, platform, context);
  }
  return enhancedPromptInjector.injectEnhancedPrompt(userPrompt, context);
}

export async function validateCode(code: string): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  return enhancedPromptInjector.validateCode(code);
}