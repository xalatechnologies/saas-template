/**
 * Smart Agent System
 * Enforces consistent coding standards across AI tools with context and memory
 */

// Core exports
export { PromptInjector } from './core/prompt-injector';
export type { PromptContext } from './core/prompt-injector';
export { EnhancedPromptInjector, enhancedPromptInjector } from './core/enhanced-prompt-injector';
export { SmartPromptInjector, smartPromptInjector } from './core/smart-prompt-injector';

// Configuration
export type { SmartAgentConfig } from './config/smart-agent.config';
export { smartAgentConfig, platformConfigs } from './config/smart-agent.config';

// Context Engineering
export { contextEngine } from './context/context-engine';
export { conversationManager } from './context/conversation-manager';
export type { 
  ContextLayer, 
  ProjectContext, 
  SessionContext, 
  ConversationContext,
  SemanticContext,
  TemporalContext 
} from './context/types';

// Memory Management
export { memoryManager } from './memory/memory-manager';
export type {
  MemorySystem,
  WorkingMemory,
  EpisodicMemory,
  SemanticMemory,
  ProceduralMemory,
  MemoryItem
} from './memory/types';

// Task management
export type { Task, TaskContext, TaskResult } from './tasks/task-manager';
export { TaskManager, taskManager } from './tasks/task-manager';

// Integrations
export type { ProjectRules } from './integrations/rules-loader';
export { RulesLoader, rulesLoader } from './integrations/rules-loader';
export { CursorIntegration, cursorIntegration } from './integrations/cursor-integration';
export { ProjectHistoryLoader, projectHistoryLoader } from './integrations/project-history-loader';

// Import necessary types and instances for utility functions
import { smartPromptInjector } from './core/smart-prompt-injector';
import type { PromptContext } from './core/prompt-injector';

// Enhanced utility functions
export async function initializeSmartAgent(): Promise<void> {
  await smartPromptInjector.initialize();
}

export async function generatePrompt(
  userPrompt: string,
  platform?: PromptContext['platform'],
  context?: PromptContext
): Promise<string> {
  // Use the smart injector for context-aware prompts
  return smartPromptInjector.generateSmartPrompt(userPrompt, context);
}

export async function validateCode(code: string): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  return smartPromptInjector.validateCode(code);
}

// New context-aware functions
export async function learnFromInteraction(
  success: boolean,
  feedback?: string
): Promise<void> {
  return smartPromptInjector.learnFromOutcome(success, feedback);
}

export async function endAgentSession(satisfaction: number): Promise<void> {
  return smartPromptInjector.endSession(satisfaction);
}

export function getMemoryStats() {
  return memoryManager.getMemoryStats();
}

export function getConversationSummary() {
  return conversationManager.getConversationSummary();
}