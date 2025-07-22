/**
 * Memory System Types
 * Defines different memory types for the Smart Agent
 */

/**
 * Working Memory - Short-term, limited capacity memory
 * Like human working memory, holds 5-10 items actively
 */
export interface WorkingMemory {
  readonly capacity: number;
  readonly items: MemoryItem[];
  readonly lastAccessed: Date;
}

/**
 * Episodic Memory - Memory of specific events and experiences
 * Stores what happened, when, and the outcome
 */
export interface EpisodicMemory {
  readonly sessions: Session[];
  readonly interactions: Interaction[];
  readonly outcomes: Outcome[];
}

/**
 * Semantic Memory - General knowledge and facts
 * Stores concepts, patterns, and relationships
 */
export interface SemanticMemory {
  readonly concepts: Map<string, Concept>;
  readonly relationships: Relationship[];
  readonly patterns: Pattern[];
  readonly knowledge: KnowledgeItem[];
}

/**
 * Procedural Memory - How-to knowledge
 * Stores workflows, procedures, and skills
 */
export interface ProceduralMemory {
  readonly workflows: Workflow[];
  readonly procedures: Procedure[];
  readonly skills: Skill[];
  readonly shortcuts: Shortcut[];
}

/**
 * Complete memory system
 */
export interface MemorySystem {
  readonly working: WorkingMemory;
  readonly episodic: EpisodicMemory;
  readonly semantic: SemanticMemory;
  readonly procedural: ProceduralMemory;
}

/**
 * Base memory item
 */
export interface MemoryItem {
  readonly id: string;
  readonly content: string;
  readonly type: MemoryType;
  readonly importance: number; // 0-100
  readonly accessCount: number;
  readonly createdAt: Date;
  readonly lastAccessedAt: Date;
  readonly associations: string[]; // IDs of related memories
  readonly metadata?: Record<string, any>;
}

export type MemoryType = 'fact' | 'event' | 'concept' | 'procedure' | 'pattern' | 'preference';

/**
 * Session memory
 */
export interface Session {
  readonly id: string;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly user: string;
  readonly goals: string[];
  readonly tasksCompleted: string[];
  readonly lessonsLearned: string[];
  readonly satisfaction: number; // 0-100
}

/**
 * Interaction memory
 */
export interface Interaction {
  readonly id: string;
  readonly sessionId: string;
  readonly timestamp: Date;
  readonly input: string;
  readonly output: string;
  readonly feedback?: Feedback;
  readonly success: boolean;
  readonly tokensUsed: number;
}

/**
 * Outcome memory
 */
export interface Outcome {
  readonly id: string;
  readonly interactionId: string;
  readonly result: 'success' | 'partial' | 'failure';
  readonly userSatisfaction?: number; // 0-100
  readonly lessonsLearned: string[];
  readonly improvements: string[];
}

/**
 * Concept in semantic memory
 */
export interface Concept {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly examples: string[];
  readonly relatedConcepts: string[];
  readonly usageCount: number;
  readonly confidence: number; // 0-100
}

/**
 * Relationship between concepts
 */
export interface Relationship {
  readonly fromConcept: string;
  readonly toConcept: string;
  readonly type: RelationshipType;
  readonly strength: number; // 0-100
}

export type RelationshipType = 
  | 'is-a'
  | 'has-a'
  | 'uses'
  | 'similar-to'
  | 'opposite-of'
  | 'depends-on'
  | 'implements'
  | 'extends';

/**
 * Pattern in semantic memory
 */
export interface Pattern {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly structure: string;
  readonly examples: Example[];
  readonly applicability: string[];
  readonly successRate: number; // 0-100
  readonly usageCount: number;
}

/**
 * Knowledge item
 */
export interface KnowledgeItem {
  readonly id: string;
  readonly category: string;
  readonly fact: string;
  readonly source: string;
  readonly confidence: number; // 0-100
  readonly verifiedAt?: Date;
}

/**
 * Workflow in procedural memory
 */
export interface Workflow {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly steps: WorkflowStep[];
  readonly prerequisites: string[];
  readonly outcomes: string[];
  readonly averageTime?: number; // minutes
  readonly successRate: number; // 0-100
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  readonly order: number;
  readonly action: string;
  readonly description: string;
  readonly optional: boolean;
  readonly conditions?: string[];
  readonly alternatives?: string[];
}

/**
 * Procedure in procedural memory
 */
export interface Procedure {
  readonly id: string;
  readonly name: string;
  readonly trigger: string;
  readonly steps: string[];
  readonly exceptions: Exception[];
  readonly lastUsed?: Date;
  readonly effectiveness: number; // 0-100
}

/**
 * Exception handling
 */
export interface Exception {
  readonly condition: string;
  readonly action: string;
}

/**
 * Skill in procedural memory
 */
export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly proficiency: number; // 0-100
  readonly practiceCount: number;
  readonly lastPracticed?: Date;
  readonly relatedSkills: string[];
}

/**
 * Shortcut or optimization
 */
export interface Shortcut {
  readonly id: string;
  readonly name: string;
  readonly originalProcess: string;
  readonly optimizedProcess: string;
  readonly timeSaved: number; // percentage
  readonly applicableWhen: string[];
}

/**
 * User feedback
 */
export interface Feedback {
  readonly helpful: boolean;
  readonly accurate: boolean;
  readonly clear: boolean;
  readonly comment?: string;
}

/**
 * Example for patterns
 */
export interface Example {
  readonly input: string;
  readonly output: string;
  readonly explanation?: string;
}

/**
 * Memory search criteria
 */
export interface MemorySearchCriteria {
  readonly query?: string;
  readonly type?: MemoryType;
  readonly minImportance?: number;
  readonly maxAge?: number; // days
  readonly category?: string;
  readonly limit?: number;
}

/**
 * Memory consolidation settings
 */
export interface ConsolidationSettings {
  readonly enabled: boolean;
  readonly interval: number; // minutes
  readonly minAccessCount: number;
  readonly importanceThreshold: number;
  readonly maxAge: number; // days
}

/**
 * Forgetting curve parameters
 */
export interface ForgettingCurve {
  readonly initialStrength: number;
  readonly decayRate: number;
  readonly minimumStrength: number;
  readonly reinforcementBonus: number;
}