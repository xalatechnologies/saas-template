/**
 * Conversation Manager
 * Manages conversation state and flow
 */

import type {
  ConversationContext,
  ConversationMessage,
  ConversationMood,
  UserPreferences
} from './types';
import { memoryManager } from '../memory/memory-manager';

export interface ConversationState {
  readonly id: string;
  readonly startTime: Date;
  readonly messages: ConversationMessage[];
  readonly context: ConversationContext;
  readonly metadata: ConversationMetadata;
}

export interface ConversationMetadata {
  readonly tokenCount: number;
  readonly turnCount: number;
  readonly topics: string[];
  readonly sentiment: 'positive' | 'neutral' | 'negative';
  readonly userEngagement: number; // 0-100
}

export interface ConversationAnalysis {
  readonly dominantTopic: string;
  readonly userIntent: string;
  readonly complexity: 'simple' | 'moderate' | 'complex';
  readonly suggestedMood: ConversationMood;
  readonly contextNeeded: string[];
}

export class ConversationManager {
  private activeConversation: ConversationState | null = null;
  private conversationHistory: Map<string, ConversationState> = new Map();
  private readonly maxMessageHistory = 20; // Keep last 20 messages in context

  /**
   * Start a new conversation
   */
  public startConversation(userPreferences?: Partial<UserPreferences>): ConversationState {
    const id = this.generateConversationId();
    const defaultPreferences: UserPreferences = {
      communicationStyle: 'casual',
      explanationDepth: 'balanced',
      codeStyle: {
        commentsLevel: 'minimal',
        examplePreference: 'comprehensive'
      },
      feedbackStyle: 'encouraging'
    };

    const context: ConversationContext = {
      id,
      messages: [],
      establishedContext: [],
      clarifiedConcepts: [],
      userPreferences: { ...defaultPreferences, ...userPreferences },
      mood: 'collaborative',
      momentum: 50
    };

    this.activeConversation = {
      id,
      startTime: new Date(),
      messages: [],
      context,
      metadata: {
        tokenCount: 0,
        turnCount: 0,
        topics: [],
        sentiment: 'neutral',
        userEngagement: 50
      }
    };

    // Start session in memory
    memoryManager.startSession('user', []);

    return this.activeConversation;
  }

  /**
   * Add message to conversation
   */
  public addMessage(role: 'user' | 'assistant', content: string, tokens?: number): void {
    if (!this.activeConversation) {
      this.startConversation();
    }

    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
      tokens: tokens || this.estimateTokens(content)
    };

    this.activeConversation!.messages.push(message);
    this.activeConversation!.context.messages = this.getRecentMessages();
    
    // Update metadata
    this.activeConversation!.metadata = {
      ...this.activeConversation!.metadata,
      tokenCount: this.activeConversation!.metadata.tokenCount + (tokens || this.estimateTokens(content)),
      turnCount: this.activeConversation!.metadata.turnCount + (role === 'user' ? 1 : 0)
    };

    // Update conversation analysis
    if (role === 'user') {
      this.updateConversationAnalysis(content);
    }

    // Add to memory
    memoryManager.addInteraction({
      sessionId: this.activeConversation!.id,
      timestamp: new Date(),
      input: role === 'user' ? content : '',
      output: role === 'assistant' ? content : '',
      success: true,
      tokensUsed: tokens || this.estimateTokens(content)
    });
  }

  /**
   * Get current conversation context
   */
  public getConversationContext(): ConversationContext | null {
    return this.activeConversation?.context || null;
  }

  /**
   * Analyze conversation to determine context needs
   */
  public analyzeConversation(): ConversationAnalysis | null {
    if (!this.activeConversation || this.activeConversation.messages.length === 0) {
      return null;
    }

    const recentMessages = this.activeConversation.messages.slice(-5);
    const userMessages = recentMessages.filter(m => m.role === 'user');
    
    // Simple analysis - in production, this would use NLP
    const analysis: ConversationAnalysis = {
      dominantTopic: this.extractDominantTopic(userMessages),
      userIntent: this.extractUserIntent(userMessages),
      complexity: this.assessComplexity(userMessages),
      suggestedMood: this.determineMood(this.activeConversation),
      contextNeeded: this.determineContextNeeds(userMessages)
    };

    return analysis;
  }

  /**
   * Update conversation momentum
   */
  public updateMomentum(delta: number): void {
    if (!this.activeConversation) return;

    const newMomentum = Math.max(0, Math.min(100, 
      this.activeConversation.context.momentum + delta
    ));

    this.activeConversation.context = {
      ...this.activeConversation.context,
      momentum: newMomentum
    };
  }

  /**
   * Establish context item
   */
  public establishContext(item: string): void {
    if (!this.activeConversation) return;

    if (!this.activeConversation.context.establishedContext.includes(item)) {
      this.activeConversation.context.establishedContext.push(item);
    }
  }

  /**
   * Clarify concept
   */
  public clarifyConcept(concept: string): void {
    if (!this.activeConversation) return;

    if (!this.activeConversation.context.clarifiedConcepts.includes(concept)) {
      this.activeConversation.context.clarifiedConcepts.push(concept);
      
      // Add to semantic memory
      memoryManager.addToWorkingMemory({
        content: `Clarified: ${concept}`,
        type: 'concept',
        importance: 70,
        associations: []
      });
    }
  }

  /**
   * Update user preferences based on interaction
   */
  public updateUserPreferences(updates: Partial<UserPreferences>): void {
    if (!this.activeConversation) return;

    this.activeConversation.context.userPreferences = {
      ...this.activeConversation.context.userPreferences,
      ...updates
    };
  }

  /**
   * End conversation
   */
  public endConversation(satisfaction: number): void {
    if (!this.activeConversation) return;

    // Save to history
    this.conversationHistory.set(
      this.activeConversation.id,
      { ...this.activeConversation }
    );

    // End session in memory
    memoryManager.endSession(
      this.activeConversation.id,
      satisfaction,
      this.extractLessonsLearned()
    );

    // Save memory
    memoryManager.saveMemory();

    this.activeConversation = null;
  }

  /**
   * Get conversation summary
   */
  public getConversationSummary(): string {
    if (!this.activeConversation) return 'No active conversation';

    const { metadata, context } = this.activeConversation;
    
    return `Conversation Summary:
- Duration: ${this.getConversationDuration()} minutes
- Messages: ${metadata.turnCount} turns
- Topics: ${metadata.topics.join(', ')}
- Mood: ${context.mood}
- Momentum: ${context.momentum}%
- Established: ${context.establishedContext.join(', ')}`;
  }

  /**
   * Get recent messages for context window
   */
  private getRecentMessages(): ConversationMessage[] {
    if (!this.activeConversation) return [];
    
    return this.activeConversation.messages.slice(-this.maxMessageHistory);
  }

  /**
   * Estimate token count for a message
   */
  private estimateTokens(content: string): number {
    // Simple estimation: ~4 characters per token
    return Math.ceil(content.length / 4);
  }

  /**
   * Update conversation analysis based on new message
   */
  private updateConversationAnalysis(content: string): void {
    if (!this.activeConversation) return;

    // Extract topics
    const topics = this.extractTopics(content);
    const currentTopics = this.activeConversation.metadata.topics;
    
    // Add new topics
    topics.forEach(topic => {
      if (!currentTopics.includes(topic)) {
        currentTopics.push(topic);
      }
    });

    // Update sentiment
    const sentiment = this.analyzeSentiment(content);
    this.activeConversation.metadata = {
      ...this.activeConversation.metadata,
      sentiment,
      topics: currentTopics.slice(-10) // Keep last 10 topics
    };

    // Update mood based on sentiment and engagement
    this.updateConversationMood();
  }

  /**
   * Extract topics from message
   */
  private extractTopics(content: string): string[] {
    const topics: string[] = [];
    const keywords = [
      'component', 'bug', 'feature', 'style', 'layout', 'error',
      'test', 'performance', 'accessibility', 'documentation'
    ];

    const lowerContent = content.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positive = ['thanks', 'great', 'perfect', 'excellent', 'good', 'helpful'];
    const negative = ['error', 'wrong', 'bad', 'issue', 'problem', 'confused'];
    
    const lowerContent = content.toLowerCase();
    let score = 0;
    
    positive.forEach(word => {
      if (lowerContent.includes(word)) score++;
    });
    
    negative.forEach(word => {
      if (lowerContent.includes(word)) score--;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Update conversation mood based on analysis
   */
  private updateConversationMood(): void {
    if (!this.activeConversation) return;

    const { sentiment, userEngagement } = this.activeConversation.metadata;
    const { momentum } = this.activeConversation.context;

    let mood: ConversationMood = 'collaborative';

    if (sentiment === 'negative' || momentum < 30) {
      mood = 'debugging';
    } else if (userEngagement > 80 && momentum > 70) {
      mood = 'focused';
    } else if (this.activeConversation.metadata.topics.length > 5) {
      mood = 'exploratory';
    } else if (sentiment === 'positive' && momentum > 60) {
      mood = 'learning';
    }

    this.activeConversation.context = {
      ...this.activeConversation.context,
      mood
    };
  }

  /**
   * Extract dominant topic from messages
   */
  private extractDominantTopic(messages: ConversationMessage[]): string {
    const topicCounts = new Map<string, number>();
    
    messages.forEach(msg => {
      const topics = this.extractTopics(msg.content);
      topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    let dominantTopic = 'general';
    let maxCount = 0;
    
    topicCounts.forEach((count, topic) => {
      if (count > maxCount) {
        maxCount = count;
        dominantTopic = topic;
      }
    });

    return dominantTopic;
  }

  /**
   * Extract user intent
   */
  private extractUserIntent(messages: ConversationMessage[]): string {
    if (messages.length === 0) return 'unknown';

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes('create') || lastMessage.includes('build')) {
      return 'create';
    } else if (lastMessage.includes('fix') || lastMessage.includes('error')) {
      return 'fix';
    } else if (lastMessage.includes('explain') || lastMessage.includes('how')) {
      return 'learn';
    } else if (lastMessage.includes('refactor') || lastMessage.includes('improve')) {
      return 'refactor';
    }

    return 'general';
  }

  /**
   * Assess complexity of request
   */
  private assessComplexity(messages: ConversationMessage[]): 'simple' | 'moderate' | 'complex' {
    if (messages.length === 0) return 'simple';

    const lastMessage = messages[messages.length - 1].content;
    const wordCount = lastMessage.split(' ').length;
    const hasMultipleRequirements = lastMessage.includes('and') || lastMessage.includes('also');
    
    if (wordCount > 50 || hasMultipleRequirements) return 'complex';
    if (wordCount > 20) return 'moderate';
    return 'simple';
  }

  /**
   * Determine mood from conversation state
   */
  private determineMood(conversation: ConversationState): ConversationMood {
    return conversation.context.mood;
  }

  /**
   * Determine what context is needed
   */
  private determineContextNeeds(messages: ConversationMessage[]): string[] {
    const needs: string[] = [];
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    if (lastMessage.includes('component')) {
      needs.push('component-patterns');
    }
    if (lastMessage.includes('style') || lastMessage.includes('design')) {
      needs.push('design-tokens');
    }
    if (lastMessage.includes('layout')) {
      needs.push('layout-system');
    }
    if (lastMessage.includes('accessibility')) {
      needs.push('accessibility-standards');
    }

    return needs;
  }

  /**
   * Extract lessons learned from conversation
   */
  private extractLessonsLearned(): string[] {
    if (!this.activeConversation) return [];

    const lessons: string[] = [];
    
    // Look for patterns in established context
    if (this.activeConversation.context.establishedContext.length > 3) {
      lessons.push(`Complex task requiring multiple context items: ${
        this.activeConversation.context.establishedContext.slice(0, 3).join(', ')
      }`);
    }

    // Look for clarified concepts
    if (this.activeConversation.context.clarifiedConcepts.length > 0) {
      lessons.push(`Concepts that needed clarification: ${
        this.activeConversation.context.clarifiedConcepts.join(', ')
      }`);
    }

    return lessons;
  }

  /**
   * Get conversation duration in minutes
   */
  private getConversationDuration(): number {
    if (!this.activeConversation) return 0;
    
    const duration = Date.now() - this.activeConversation.startTime.getTime();
    return Math.round(duration / (1000 * 60));
  }

  /**
   * Generate conversation ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const conversationManager = new ConversationManager();