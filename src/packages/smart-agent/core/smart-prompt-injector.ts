/**
 * Smart Prompt Injector
 * Integrates context engineering, memory, and project history
 */

import { EnhancedPromptInjector } from './enhanced-prompt-injector';
import { PromptContext } from './prompt-injector';
import { contextEngine } from '../context/context-engine';
import { conversationManager } from '../context/conversation-manager';
import { memoryManager } from '../memory/memory-manager';
import { projectHistoryLoader } from '../integrations/project-history-loader';
import type { TaskType, ContextWindow } from '../context/types';

export class SmartPromptInjector extends EnhancedPromptInjector {
  private initialized = false;

  /**
   * Initialize all systems
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize parent
    await super.initialize();

    // Load project history
    const projectContext = await projectHistoryLoader.getProjectContext();
    if (projectContext) {
      await contextEngine.initialize(projectContext);
    }

    // Load memory
    await memoryManager.loadMemory();

    // Start conversation if not already started
    if (!conversationManager.getConversationContext()) {
      conversationManager.startConversation();
    }

    this.initialized = true;
  }

  /**
   * Generate smart context-aware prompt
   */
  public async generateSmartPrompt(
    userPrompt: string,
    context?: PromptContext
  ): Promise<string> {
    await this.initialize();

    // Add user message to conversation
    conversationManager.addMessage('user', userPrompt);

    // Analyze conversation
    const analysis = conversationManager.analyzeConversation();
    
    // Build comprehensive context
    const taskType = this.inferTaskType(userPrompt, context);
    const contextWindow = await contextEngine.buildTaskContext(
      taskType,
      userPrompt,
      context?.targetDirectory
    );

    // Search memory for relevant items
    const memoryResults = await memoryManager.searchMemory({
      query: userPrompt,
      limit: 5,
      minImportance: 60
    });

    // Get relevant project history
    const relevantHistory = await projectHistoryLoader.getRelevantHistory(
      taskType,
      context?.component
    );

    // Build the prompt with all context
    const sections = [
      this.buildSmartGreeting(analysis?.suggestedMood),
      this.buildContextualIntroduction(contextWindow, relevantHistory),
      this.buildMemoryContext(memoryResults),
      this.buildConversationContext(),
      await super.injectEnhancedPrompt(userPrompt, context),
      this.buildSmartGuidance(taskType, relevantHistory),
      this.buildEncouragement(analysis?.complexity)
    ];

    const smartPrompt = sections.filter(Boolean).join('\n\n');

    // Add assistant response to conversation
    conversationManager.addMessage('assistant', smartPrompt);

    return smartPrompt;
  }

  /**
   * Build smart greeting based on conversation mood
   */
  private buildSmartGreeting(mood?: string): string {
    const greetings: Record<string, string> = {
      collaborative: "Hey! I'm excited to work on this with you.",
      focused: "I'm ready to help you tackle this task efficiently.",
      exploratory: "Let's explore this together and find the best approach.",
      debugging: "I see you're dealing with an issue. Let me help you solve it.",
      learning: "Great question! Let me explain this clearly."
    };

    return greetings[mood || 'collaborative'] || greetings.collaborative;
  }

  /**
   * Build contextual introduction
   */
  private buildContextualIntroduction(
    contextWindow: ContextWindow,
    relevantHistory: any
  ): string {
    const sections: string[] = [];

    // Mention similar past work
    if (relevantHistory.similarPhases.length > 0) {
      const phase = relevantHistory.similarPhases[0];
      sections.push(
        `I notice this is similar to what we did in ${phase.name}. ` +
        `That implementation worked really well!`
      );
    }

    // Mention current context
    const projectContext = contextWindow.items.find(item => item.category === 'project');
    if (projectContext) {
      sections.push(`We're currently in ${projectContext.content}`);
    }

    // Mention recent work
    const recentChanges = contextWindow.items.find(item => item.category === 'temporal');
    if (recentChanges) {
      sections.push(`I see you've been working on: ${recentChanges.content}`);
    }

    return sections.join(' ');
  }

  /**
   * Build memory context
   */
  private buildMemoryContext(memoryItems: any[]): string {
    if (memoryItems.length === 0) return '';

    const relevantMemories = memoryItems.slice(0, 3);
    
    return `Based on our previous work, I remember:
${relevantMemories.map(item => `- ${item.content}`).join('\n')}`;
  }

  /**
   * Build conversation context
   */
  private buildConversationContext(): string {
    const context = conversationManager.getConversationContext();
    if (!context || context.establishedContext.length === 0) return '';

    return `In our conversation so far, we've established:
${context.establishedContext.map(item => `- ${item}`).join('\n')}`;
  }

  /**
   * Build smart guidance based on task and history
   */
  private buildSmartGuidance(taskType: TaskType, relevantHistory: any): string {
    const sections: string[] = [];

    // Add relevant lessons
    if (relevantHistory.relevantLessons.length > 0) {
      sections.push('💡 Relevant lessons from our project:');
      relevantHistory.relevantLessons.slice(0, 2).forEach((lesson: any) => {
        sections.push(`- ${lesson.lesson}: ${lesson.context}`);
      });
    }

    // Add success patterns
    if (relevantHistory.successPatterns.length > 0) {
      sections.push('\n✨ Patterns that have worked well:');
      relevantHistory.successPatterns.slice(0, 3).forEach((pattern: string) => {
        sections.push(`- ${pattern}`);
      });
    }

    // Add task-specific tips
    const tips = this.getTaskSpecificTips(taskType);
    if (tips.length > 0) {
      sections.push('\n🎯 Tips for this task:');
      tips.forEach(tip => sections.push(`- ${tip}`));
    }

    return sections.join('\n');
  }

  /**
   * Build encouragement based on complexity
   */
  private buildEncouragement(complexity?: string): string {
    const encouragements: Record<string, string> = {
      simple: "This should be straightforward. Let me know if you need any clarification!",
      moderate: "This is a good task. We'll work through it step by step.",
      complex: "This is a comprehensive task, but we've handled similar challenges before. Let's break it down!"
    };

    return encouragements[complexity || 'moderate'] || encouragements.moderate;
  }

  /**
   * Infer task type from prompt
   */
  private inferTaskType(prompt: string, context?: PromptContext): TaskType {
    if (context?.task) {
      return context.task as TaskType;
    }

    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('create') || lowerPrompt.includes('build') || lowerPrompt.includes('new')) {
      return 'create_component';
    } else if (lowerPrompt.includes('fix') || lowerPrompt.includes('error') || lowerPrompt.includes('bug')) {
      return 'fix_bug';
    } else if (lowerPrompt.includes('refactor') || lowerPrompt.includes('improve')) {
      return 'refactor';
    } else if (lowerPrompt.includes('style') || lowerPrompt.includes('design') || lowerPrompt.includes('css')) {
      return 'update_styles';
    } else if (lowerPrompt.includes('layout') || lowerPrompt.includes('grid') || lowerPrompt.includes('flex')) {
      return 'migrate_layout';
    } else if (lowerPrompt.includes('test')) {
      return 'add_tests';
    }

    return 'add_feature';
  }

  /**
   * Get task-specific tips
   */
  private getTaskSpecificTips(taskType: TaskType): string[] {
    const tipsMap: Record<TaskType, string[]> = {
      create_component: [
        'Start with TypeScript interfaces for props',
        'Use our existing UI components as building blocks',
        'Remember to add proper accessibility attributes'
      ],
      fix_bug: [
        'Check the browser console for detailed error messages',
        'Look for similar fixes in our git history',
        'Consider edge cases and error boundaries'
      ],
      refactor: [
        'Maintain all existing functionality',
        'Improve code readability and performance',
        'Update tests if needed'
      ],
      add_feature: [
        'Plan the implementation approach first',
        'Consider state management needs',
        'Think about edge cases and error handling'
      ],
      update_styles: [
        'Use our design tokens for consistency',
        'Test with all theme variants',
        'Ensure responsive design works'
      ],
      migrate_layout: [
        'Use GridLayout system components',
        'Remove all hardcoded flex/grid classes',
        'Test at all breakpoints'
      ],
      optimize_performance: [
        'Measure before and after',
        'Consider bundle size impact',
        'Use React.memo where appropriate'
      ],
      add_tests: [
        'Cover happy path and edge cases',
        'Test user interactions',
        'Include accessibility tests'
      ],
      update_documentation: [
        'Keep it concise but comprehensive',
        'Include code examples',
        'Update related documentation'
      ]
    };

    return tipsMap[taskType] || [];
  }

  /**
   * Learn from interaction outcome
   */
  public async learnFromOutcome(
    success: boolean,
    feedback?: string
  ): Promise<void> {
    const conversation = conversationManager.getConversationContext();
    if (!conversation) return;

    // Update conversation momentum
    conversationManager.updateMomentum(success ? 10 : -10);

    // Add to memory
    if (success && conversation.messages.length > 0) {
      const lastUserMessage = [...conversation.messages]
        .reverse()
        .find(m => m.role === 'user');
      
      if (lastUserMessage) {
        memoryManager.addToWorkingMemory({
          content: `Successful: ${lastUserMessage.content}`,
          type: 'pattern',
          importance: 80,
          associations: conversation.establishedContext
        });
      }
    }

    // Save memory
    await memoryManager.saveMemory();
  }

  /**
   * End session
   */
  public async endSession(satisfaction: number): Promise<void> {
    conversationManager.endConversation(satisfaction);
    await memoryManager.saveMemory();
  }
}

// Export singleton instance
export const smartPromptInjector = new SmartPromptInjector();