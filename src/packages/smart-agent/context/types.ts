/**
 * Context Engineering Types
 * Defines the structure of multi-layered context system
 */

/**
 * Project-level context that persists across sessions
 */
export interface ProjectContext {
  readonly name: string;
  readonly version: string;
  readonly currentPhase: string;
  readonly techStack: readonly string[];
  readonly conventions: readonly string[];
  readonly history: {
    readonly milestones: readonly ProjectMilestone[];
    readonly decisions: readonly TechnicalDecision[];
    readonly lessons: readonly LessonLearned[];
  };
  readonly activeFeatures: readonly string[];
  readonly technicalDebt: readonly TechnicalDebtItem[];
  readonly upcomingGoals: readonly Goal[];
}

/**
 * Session-level context for current working session
 */
export interface SessionContext {
  readonly id: string;
  readonly startTime: Date;
  readonly user: string;
  readonly workingDirectory: string;
  readonly recentFiles: readonly string[];
  readonly recentCommands: readonly Command[];
  readonly currentBranch: string;
  readonly uncommittedChanges: readonly string[];
}

/**
 * Active conversation context
 */
export interface ConversationContext {
  readonly id: string;
  readonly messages: readonly ConversationMessage[];
  readonly establishedContext: readonly string[];
  readonly clarifiedConcepts: readonly string[];
  readonly userPreferences: UserPreferences;
  readonly mood: ConversationMood;
  readonly momentum: number; // 0-100 score of conversation flow
}

/**
 * Semantic understanding of current task
 */
export interface SemanticContext {
  readonly taskType: TaskType;
  readonly relatedComponents: readonly string[];
  readonly similarPastTasks: readonly PastTask[];
  readonly suggestedPatterns: readonly Pattern[];
  readonly relevantDocumentation: readonly string[];
  readonly estimatedComplexity: ComplexityLevel;
}

/**
 * Time-based context for recent changes
 */
export interface TemporalContext {
  readonly recentChanges: readonly Change[];
  readonly lastInteraction: Date;
  readonly workingHours: TimeRange;
  readonly velocity: DevelopmentVelocity;
  readonly upcomingDeadlines: readonly Deadline[];
}

/**
 * Complete context layer combining all contexts
 */
export interface ContextLayer {
  readonly project: ProjectContext;
  readonly session: SessionContext;
  readonly conversation: ConversationContext;
  readonly semantic: SemanticContext;
  readonly temporal: TemporalContext;
}

/**
 * Supporting types
 */
export interface ProjectMilestone {
  readonly phase: string;
  readonly description: string;
  readonly completedAt: Date;
  readonly keyAchievements: readonly string[];
}

export interface TechnicalDecision {
  readonly id: string;
  readonly decision: string;
  readonly rationale: string;
  readonly alternatives: readonly string[];
  readonly madeAt: Date;
  readonly impact: 'low' | 'medium' | 'high';
}

export interface LessonLearned {
  readonly id: string;
  readonly lesson: string;
  readonly context: string;
  readonly category: string;
  readonly severity: 'info' | 'warning' | 'critical';
}

export interface TechnicalDebtItem {
  readonly id: string;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high';
  readonly effort: 'small' | 'medium' | 'large';
  readonly createdAt: Date;
}

export interface Goal {
  readonly id: string;
  readonly title: string;
  readonly targetDate?: Date;
  readonly priority: 'low' | 'medium' | 'high';
}

export interface Command {
  readonly command: string;
  readonly executedAt: Date;
  readonly result: 'success' | 'failure';
}

export interface ConversationMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
  readonly tokens?: number;
}

export interface UserPreferences {
  readonly communicationStyle: 'formal' | 'casual' | 'technical';
  readonly explanationDepth: 'minimal' | 'balanced' | 'detailed';
  readonly codeStyle: {
    readonly commentsLevel: 'none' | 'minimal' | 'detailed';
    readonly examplePreference: 'minimal' | 'comprehensive';
  };
  readonly feedbackStyle: 'direct' | 'encouraging' | 'detailed';
}

export type ConversationMood = 'collaborative' | 'focused' | 'exploratory' | 'debugging' | 'learning';

export type TaskType = 
  | 'create_component'
  | 'fix_bug'
  | 'refactor'
  | 'add_feature'
  | 'update_styles'
  | 'migrate_layout'
  | 'optimize_performance'
  | 'add_tests'
  | 'update_documentation';

export interface PastTask {
  readonly id: string;
  readonly type: TaskType;
  readonly description: string;
  readonly completedAt: Date;
  readonly filesChanged: readonly string[];
  readonly patterns: readonly string[];
  readonly outcome: 'success' | 'partial' | 'reverted';
}

export interface Pattern {
  readonly name: string;
  readonly description: string;
  readonly example: string;
  readonly usageCount: number;
  readonly successRate: number;
}

export type ComplexityLevel = 'trivial' | 'simple' | 'moderate' | 'complex' | 'very_complex';

export interface Change {
  readonly file: string;
  readonly type: 'created' | 'modified' | 'deleted';
  readonly timestamp: Date;
  readonly description?: string;
}

export interface TimeRange {
  readonly start: string; // HH:MM format
  readonly end: string;   // HH:MM format
  readonly timezone: string;
}

export interface DevelopmentVelocity {
  readonly filesPerHour: number;
  readonly linesPerHour: number;
  readonly tasksCompleted: number;
  readonly trend: 'increasing' | 'stable' | 'decreasing';
}

export interface Deadline {
  readonly task: string;
  readonly dueDate: Date;
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Context relevance scoring
 */
export interface ContextRelevance {
  readonly item: string;
  readonly score: number; // 0-1
  readonly reason: string;
  readonly category: string;
}

/**
 * Context window management
 */
export interface ContextWindow {
  readonly maxTokens: number;
  readonly currentTokens: number;
  readonly items: readonly ContextItem[];
}

export interface ContextItem {
  readonly id: string;
  readonly content: string;
  readonly tokens: number;
  readonly priority: number; // 0-100
  readonly category: string;
  readonly addedAt: Date;
}