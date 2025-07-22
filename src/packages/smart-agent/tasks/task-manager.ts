/**
 * Task Manager
 * Manages tasks and their execution through the Smart Agent
 */

import { promptInjector, PromptContext } from '../core/prompt-injector';
import { smartAgentConfig } from '../config/smart-agent.config';

export interface Task {
  readonly id: string;
  readonly type: 'create_component' | 'fix_bug' | 'refactor' | 'add_feature' | 'update_styles' | 'migrate_layout';
  readonly title: string;
  readonly description: string;
  readonly context: TaskContext;
  readonly rules?: readonly string[];
  readonly status: 'pending' | 'in_progress' | 'completed' | 'failed';
  readonly result?: TaskResult;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface TaskContext {
  readonly component?: string;
  readonly feature?: string;
  readonly targetDirectory?: string;
  readonly affectedFiles?: readonly string[];
  readonly requirements?: readonly string[];
}

export interface TaskResult {
  readonly success: boolean;
  readonly message: string;
  readonly filesChanged?: readonly string[];
  readonly errors?: readonly string[];
  readonly warnings?: readonly string[];
  readonly validationScore?: number;
}

export class TaskManager {
  private tasks: Map<string, Task> = new Map();

  /**
   * Create a new task
   */
  public createTask(
    type: Task['type'],
    title: string,
    description: string,
    context: TaskContext,
    rules?: readonly string[]
  ): Task {
    const task: Task = {
      id: this.generateTaskId(),
      type,
      title,
      description,
      context,
      rules,
      status: 'pending',
      createdAt: new Date()
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Generate enriched prompt for task
   */
  public generateTaskPrompt(taskId: string): string {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const basePrompt = this.buildTaskPrompt(task);
    const promptContext: PromptContext = {
      task: task.type,
      component: task.context.component,
      feature: task.context.feature,
      targetDirectory: task.context.targetDirectory,
      additionalRules: task.rules
    };

    return promptInjector.injectSmartPrompt(basePrompt, promptContext);
  }

  /**
   * Execute task through platform
   */
  public async executeTask(
    taskId: string,
    platform: PromptContext['platform'],
    executor: (prompt: string) => Promise<string>
  ): Promise<TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Update task status
    this.updateTaskStatus(taskId, 'in_progress');

    try {
      // Generate platform-specific prompt
      const prompt = this.generatePlatformPrompt(task, platform);
      
      // Execute through platform
      const result = await executor(prompt);
      
      // Validate result
      const taskResult = await this.validateTaskResult(task, result);
      
      // Update task with result
      this.completeTask(taskId, taskResult);
      
      return taskResult;
    } catch (error) {
      const errorResult: TaskResult = {
        success: false,
        message: `Task execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
      
      this.failTask(taskId, errorResult);
      return errorResult;
    }
  }

  /**
   * Get task by ID
   */
  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  public getTasksByStatus(status: Task['status']): Task[] {
    return this.getAllTasks().filter(task => task.status === status);
  }

  private buildTaskPrompt(task: Task): string {
    let prompt = `${task.description}\n\n`;

    if (task.context.requirements && task.context.requirements.length > 0) {
      prompt += `Requirements:\n${task.context.requirements.map(req => `- ${req}`).join('\n')}\n\n`;
    }

    if (task.context.affectedFiles && task.context.affectedFiles.length > 0) {
      prompt += `Affected Files:\n${task.context.affectedFiles.map(file => `- ${file}`).join('\n')}\n\n`;
    }

    // Add task-specific instructions
    switch (task.type) {
      case 'create_component':
        prompt += this.getComponentCreationInstructions(task);
        break;
      case 'migrate_layout':
        prompt += this.getLayoutMigrationInstructions(task);
        break;
      case 'update_styles':
        prompt += this.getStyleUpdateInstructions(task);
        break;
      case 'fix_bug':
        prompt += this.getBugFixInstructions(task);
        break;
      case 'refactor':
        prompt += this.getRefactorInstructions(task);
        break;
      case 'add_feature':
        prompt += this.getFeatureInstructions(task);
        break;
    }

    return prompt;
  }

  private getComponentCreationInstructions(_: Task): string {
    return `Create a new component following these steps:
1. Define TypeScript interfaces for props (readonly, no any types)
2. Create the component with explicit JSX.Element return type
3. Use GridLayout system components for all layouts
4. Apply design tokens for all styling (no hardcoded values)
5. Add proper accessibility attributes
6. Implement internationalization with translation keys
7. Export from appropriate index file
8. Add to component documentation if needed`;
  }

  private getLayoutMigrationInstructions(_: Task): string {
    return `Migrate layouts to GridLayout system:
1. Identify all hardcoded div elements with flex/grid classes
2. Replace with appropriate GridLayout components (FlexLayout, GridLayout, SplitLayout, Container)
3. Convert Tailwind responsive classes to component props
4. Ensure proper gap and spacing using design tokens
5. Test responsive behavior at all breakpoints
6. Validate no forbidden patterns remain`;
  }

  private getStyleUpdateInstructions(_: Task): string {
    return `Update styling to use design tokens:
1. Identify all hardcoded color, spacing, and size values
2. Map to appropriate design tokens
3. Upgrade to professional sizing standards (h-16+ for inputs/buttons)
4. Apply consistent border radius (rounded-xl or rounded-2xl)
5. Use proper shadow tokens (shadow-lg, shadow-xl, shadow-2xl)
6. Test with all theme variants`;
  }

  private getBugFixInstructions(_: Task): string {
    return `Fix the bug following these steps:
1. Identify the root cause of the issue
2. Implement the fix following all coding standards
3. Ensure no regression in functionality
4. Add or update tests if applicable
5. Verify accessibility is maintained
6. Check all language translations still work`;
  }

  private getRefactorInstructions(_: Task): string {
    return `Refactor the code following these guidelines:
1. Maintain all existing functionality
2. Improve code organization and readability
3. Ensure strict TypeScript compliance
4. Use proper component composition
5. Apply all project standards
6. Update imports and exports as needed`;
  }

  private getFeatureInstructions(_: Task): string {
    return `Add the new feature following these steps:
1. Plan the implementation approach
2. Create necessary types and interfaces
3. Implement UI components using the design system
4. Add state management with Zustand if needed
5. Implement proper error handling
6. Add accessibility features
7. Create all necessary translations
8. Test with all themes and languages`;
  }

  private generatePlatformPrompt(task: Task, platform: PromptContext['platform']): string {
    const basePrompt = this.buildTaskPrompt(task);
    const promptContext: PromptContext = {
      task: task.type,
      component: task.context.component,
      feature: task.context.feature,
      targetDirectory: task.context.targetDirectory,
      additionalRules: task.rules,
      platform
    };

    return promptInjector.generatePlatformPrompt(basePrompt, platform, promptContext);
  }

  private async validateTaskResult(task: Task, result: string): Promise<TaskResult> {
    // Basic validation - in real implementation, this would be more sophisticated
    const validationScore = this.calculateValidationScore(task, result);
    
    return {
      success: validationScore >= 80,
      message: result,
      validationScore,
      warnings: validationScore < 100 ? ['Some standards may not be fully met'] : undefined
    };
  }

  private calculateValidationScore(task: Task, result: string): number {
    let score = 100;
    
    // Check for forbidden patterns
    for (const forbidden of smartAgentConfig.layoutSystem.forbidden) {
      if (result.includes(forbidden)) {
        score -= 10;
      }
    }
    
    for (const forbidden of smartAgentConfig.designTokens.forbidden) {
      if (result.includes(forbidden)) {
        score -= 5;
      }
    }
    
    // Check for required patterns
    let hasRequiredLayout = false;
    for (const required of smartAgentConfig.layoutSystem.required) {
      if (result.includes(required)) {
        hasRequiredLayout = true;
        break;
      }
    }
    if (!hasRequiredLayout && task.type !== 'fix_bug') {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  private updateTaskStatus(taskId: string, status: Task['status']): void {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.set(taskId, {
        ...task,
        status,
        updatedAt: new Date()
      });
    }
  }

  private completeTask(taskId: string, result: TaskResult): void {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.set(taskId, {
        ...task,
        status: 'completed',
        result,
        updatedAt: new Date()
      });
    }
  }

  private failTask(taskId: string, result: TaskResult): void {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.set(taskId, {
        ...task,
        status: 'failed',
        result,
        updatedAt: new Date()
      });
    }
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const taskManager = new TaskManager();