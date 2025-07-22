/**
 * Context Engine
 * Manages multi-layered context for intelligent prompt generation
 */

import type {
  ContextLayer,
  ProjectContext,
  SessionContext,
  ConversationContext,
  SemanticContext,
  TemporalContext,
  ContextRelevance,
  ContextWindow,
  ContextItem,
  TaskType,
  Pattern,
  PastTask
} from './types';

export class ContextEngine {
  private contextLayers: Partial<ContextLayer> = {};
  private readonly maxContextTokens = 8000; // Reserve tokens for context
  
  /**
   * Initialize context engine with project context
   */
  public async initialize(projectContext: ProjectContext): Promise<void> {
    this.contextLayers.project = projectContext;
  }

  /**
   * Update specific context layer
   */
  public updateLayer<K extends keyof ContextLayer>(
    layer: K,
    context: ContextLayer[K]
  ): void {
    this.contextLayers[layer] = context;
  }

  /**
   * Get current context state
   */
  public getContext(): Partial<ContextLayer> {
    return { ...this.contextLayers };
  }

  /**
   * Build context for a specific task
   */
  public async buildTaskContext(
    taskType: TaskType,
    userPrompt: string,
    currentFile?: string
  ): Promise<ContextWindow> {
    const relevantItems = await this.gatherRelevantContext(taskType, userPrompt, currentFile);
    const rankedItems = this.rankByRelevance(relevantItems);
    return this.optimizeContextWindow(rankedItems);
  }

  /**
   * Gather all potentially relevant context
   */
  private async gatherRelevantContext(
    taskType: TaskType,
    userPrompt: string,
    currentFile?: string
  ): Promise<ContextItem[]> {
    const items: ContextItem[] = [];

    // Add project-level context
    if (this.contextLayers.project) {
      items.push(...this.extractProjectContext(this.contextLayers.project, taskType));
    }

    // Add session context
    if (this.contextLayers.session) {
      items.push(...this.extractSessionContext(this.contextLayers.session, currentFile));
    }

    // Add conversation context
    if (this.contextLayers.conversation) {
      items.push(...this.extractConversationContext(this.contextLayers.conversation));
    }

    // Add semantic context
    if (this.contextLayers.semantic) {
      items.push(...this.extractSemanticContext(this.contextLayers.semantic, taskType));
    }

    // Add temporal context
    if (this.contextLayers.temporal) {
      items.push(...this.extractTemporalContext(this.contextLayers.temporal));
    }

    return items;
  }

  /**
   * Extract relevant project context
   */
  private extractProjectContext(
    project: ProjectContext,
    taskType: TaskType
  ): ContextItem[] {
    const items: ContextItem[] = [];

    // Always include core project info
    items.push({
      id: 'project-overview',
      content: `Project: ${project.name} v${project.version} - Phase: ${project.currentPhase}`,
      tokens: 50,
      priority: 90,
      category: 'project',
      addedAt: new Date()
    });

    // Include relevant conventions
    const relevantConventions = project.conventions.filter(conv => 
      this.isRelevantToTask(conv, taskType)
    );
    
    if (relevantConventions.length > 0) {
      items.push({
        id: 'project-conventions',
        content: `Key Conventions:\n${relevantConventions.join('\n')}`,
        tokens: relevantConventions.length * 20,
        priority: 85,
        category: 'conventions',
        addedAt: new Date()
      });
    }

    // Include recent lessons learned
    const recentLessons = project.history.lessons
      .filter(lesson => lesson.severity !== 'info')
      .slice(0, 3);
    
    if (recentLessons.length > 0) {
      items.push({
        id: 'lessons-learned',
        content: `Important Lessons:\n${recentLessons.map(l => `- ${l.lesson}`).join('\n')}`,
        tokens: recentLessons.length * 30,
        priority: 75,
        category: 'lessons',
        addedAt: new Date()
      });
    }

    return items;
  }

  /**
   * Extract relevant session context
   */
  private extractSessionContext(
    session: SessionContext,
    currentFile?: string
  ): ContextItem[] {
    const items: ContextItem[] = [];

    // Include current working context
    items.push({
      id: 'session-context',
      content: `Working in: ${session.workingDirectory}, Branch: ${session.currentBranch}`,
      tokens: 30,
      priority: 70,
      category: 'session',
      addedAt: new Date()
    });

    // Include recent files if relevant
    const relevantFiles = currentFile
      ? session.recentFiles.filter(file => this.areFilesRelated(file, currentFile))
      : session.recentFiles.slice(0, 3);

    if (relevantFiles.length > 0) {
      items.push({
        id: 'recent-files',
        content: `Recently edited: ${relevantFiles.join(', ')}`,
        tokens: relevantFiles.length * 10,
        priority: 65,
        category: 'session',
        addedAt: new Date()
      });
    }

    return items;
  }

  /**
   * Extract relevant conversation context
   */
  private extractConversationContext(
    conversation: ConversationContext
  ): ContextItem[] {
    const items: ContextItem[] = [];

    // Include established context
    if (conversation.establishedContext.length > 0) {
      items.push({
        id: 'established-context',
        content: `We've established: ${conversation.establishedContext.join(', ')}`,
        tokens: conversation.establishedContext.length * 10,
        priority: 80,
        category: 'conversation',
        addedAt: new Date()
      });
    }

    // Include user preferences
    items.push({
      id: 'user-preferences',
      content: `Communication style: ${conversation.userPreferences.communicationStyle}, Detail level: ${conversation.userPreferences.explanationDepth}`,
      tokens: 20,
      priority: 60,
      category: 'preferences',
      addedAt: new Date()
    });

    // Include recent conversation summary
    const recentMessages = conversation.messages.slice(-3);
    if (recentMessages.length > 0) {
      const summary = this.summarizeConversation(recentMessages);
      items.push({
        id: 'conversation-summary',
        content: summary,
        tokens: 100,
        priority: 75,
        category: 'conversation',
        addedAt: new Date()
      });
    }

    return items;
  }

  /**
   * Extract semantic context
   */
  private extractSemanticContext(
    semantic: SemanticContext,
    taskType: TaskType
  ): ContextItem[] {
    const items: ContextItem[] = [];

    // Include similar past tasks
    const relevantPastTasks = semantic.similarPastTasks
      .filter(task => task.type === taskType || task.outcome === 'success')
      .slice(0, 2);

    if (relevantPastTasks.length > 0) {
      items.push({
        id: 'similar-tasks',
        content: `Similar successful implementations:\n${relevantPastTasks.map(t => 
          `- ${t.description} (${t.patterns.join(', ')})`
        ).join('\n')}`,
        tokens: relevantPastTasks.length * 40,
        priority: 85,
        category: 'semantic',
        addedAt: new Date()
      });
    }

    // Include suggested patterns
    const topPatterns = semantic.suggestedPatterns
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);

    if (topPatterns.length > 0) {
      items.push({
        id: 'suggested-patterns',
        content: `Recommended patterns:\n${topPatterns.map(p => 
          `- ${p.name}: ${p.description}`
        ).join('\n')}`,
        tokens: topPatterns.length * 30,
        priority: 80,
        category: 'patterns',
        addedAt: new Date()
      });
    }

    return items;
  }

  /**
   * Extract temporal context
   */
  private extractTemporalContext(
    temporal: TemporalContext
  ): ContextItem[] {
    const items: ContextItem[] = [];

    // Include very recent changes
    const veryRecentChanges = temporal.recentChanges
      .filter(change => {
        const hoursSince = (Date.now() - change.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursSince < 2;
      })
      .slice(0, 5);

    if (veryRecentChanges.length > 0) {
      items.push({
        id: 'recent-changes',
        content: `Recent changes:\n${veryRecentChanges.map(c => 
          `- ${c.type} ${c.file}`
        ).join('\n')}`,
        tokens: veryRecentChanges.length * 15,
        priority: 70,
        category: 'temporal',
        addedAt: new Date()
      });
    }

    // Include velocity context
    items.push({
      id: 'velocity',
      content: `Current pace: ${temporal.velocity.tasksCompleted} tasks completed, trend: ${temporal.velocity.trend}`,
      tokens: 20,
      priority: 50,
      category: 'temporal',
      addedAt: new Date()
    });

    return items;
  }

  /**
   * Rank context items by relevance
   */
  private rankByRelevance(items: ContextItem[]): ContextItem[] {
    return items.sort((a, b) => {
      // First sort by priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Then by recency
      return b.addedAt.getTime() - a.addedAt.getTime();
    });
  }

  /**
   * Optimize context to fit within token budget
   */
  private optimizeContextWindow(items: ContextItem[]): ContextWindow {
    const window: ContextWindow = {
      maxTokens: this.maxContextTokens,
      currentTokens: 0,
      items: []
    };

    const includedItems: ContextItem[] = [];
    let currentTokens = 0;

    for (const item of items) {
      if (currentTokens + item.tokens <= this.maxContextTokens) {
        includedItems.push(item);
        currentTokens += item.tokens;
      } else {
        // Check if we can replace a lower priority item
        const lowestPriority = includedItems.reduce((min, i) => 
          i.priority < min.priority ? i : min, 
          includedItems[0]
        );

        if (lowestPriority && lowestPriority.priority < item.priority) {
          // Replace the lowest priority item
          const index = includedItems.indexOf(lowestPriority);
          includedItems[index] = item;
          currentTokens = currentTokens - lowestPriority.tokens + item.tokens;
        }
      }
    }

    window.items = includedItems;
    window.currentTokens = currentTokens;

    return window;
  }

  /**
   * Check if task type is relevant to convention
   */
  private isRelevantToTask(convention: string, taskType: TaskType): boolean {
    const relevanceMap: Record<TaskType, string[]> = {
      'create_component': ['component', 'typescript', 'props', 'ui'],
      'fix_bug': ['error', 'validation', 'handling'],
      'refactor': ['structure', 'organization', 'pattern'],
      'add_feature': ['feature', 'functionality', 'implementation'],
      'update_styles': ['style', 'design', 'token', 'theme'],
      'migrate_layout': ['layout', 'grid', 'flex', 'responsive'],
      'optimize_performance': ['performance', 'optimization', 'bundle'],
      'add_tests': ['test', 'validation', 'coverage'],
      'update_documentation': ['documentation', 'comment', 'readme']
    };

    const keywords = relevanceMap[taskType] || [];
    return keywords.some(keyword => 
      convention.toLowerCase().includes(keyword)
    );
  }

  /**
   * Check if two files are related
   */
  private areFilesRelated(file1: string, file2: string): boolean {
    // Same directory
    const dir1 = file1.substring(0, file1.lastIndexOf('/'));
    const dir2 = file2.substring(0, file2.lastIndexOf('/'));
    if (dir1 === dir2) return true;

    // Same feature
    if (file1.includes('/features/') && file2.includes('/features/')) {
      const feature1 = file1.match(/\/features\/([^/]+)/)?.[1];
      const feature2 = file2.match(/\/features\/([^/]+)/)?.[1];
      if (feature1 === feature2) return true;
    }

    // Same component type
    const base1 = file1.substring(file1.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    const base2 = file2.substring(file2.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    return base1.toLowerCase().includes(base2.toLowerCase()) || 
           base2.toLowerCase().includes(base1.toLowerCase());
  }

  /**
   * Summarize recent conversation
   */
  private summarizeConversation(messages: any[]): string {
    const topics = messages
      .filter(m => m.role === 'user')
      .map(m => this.extractTopic(m.content))
      .filter(Boolean);

    return `Recent discussion: ${topics.join(', ')}`;
  }

  /**
   * Extract main topic from message
   */
  private extractTopic(content: string): string {
    // Simple topic extraction - could be enhanced with NLP
    const keywords = ['create', 'fix', 'update', 'add', 'implement', 'refactor'];
    for (const keyword of keywords) {
      if (content.toLowerCase().includes(keyword)) {
        const words = content.split(' ');
        const index = words.findIndex(w => w.toLowerCase().includes(keyword));
        if (index !== -1 && index < words.length - 1) {
          return `${words[index]} ${words[index + 1]}`;
        }
      }
    }
    return content.split(' ').slice(0, 5).join(' ') + '...';
  }
}

// Export singleton instance
export const contextEngine = new ContextEngine();