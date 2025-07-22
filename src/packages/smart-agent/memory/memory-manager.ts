/**
 * Memory Manager
 * Manages different types of memory for the Smart Agent
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  MemorySystem,
  WorkingMemory,
  EpisodicMemory,
  SemanticMemory,
  ProceduralMemory,
  MemoryItem,
  MemoryType,
  MemorySearchCriteria,
  Session,
  Interaction,
  Concept,
  Pattern,
  Workflow,
  ForgettingCurve,
  ConsolidationSettings
} from './types';

export class MemoryManager {
  private memorySystem: MemorySystem;
  private memoryPath: string;
  private readonly forgettingCurve: ForgettingCurve = {
    initialStrength: 100,
    decayRate: 0.1,
    minimumStrength: 10,
    reinforcementBonus: 20
  };
  private readonly consolidationSettings: ConsolidationSettings = {
    enabled: true,
    interval: 30, // 30 minutes
    minAccessCount: 3,
    importanceThreshold: 70,
    maxAge: 30 // 30 days
  };

  constructor(memoryPath?: string) {
    this.memoryPath = memoryPath || path.join(process.cwd(), '.smart-agent', 'memory');
    this.memorySystem = this.initializeMemorySystem();
  }

  /**
   * Initialize empty memory system
   */
  private initializeMemorySystem(): MemorySystem {
    return {
      working: {
        capacity: 7, // Miller's law: 7±2
        items: [],
        lastAccessed: new Date()
      },
      episodic: {
        sessions: [],
        interactions: [],
        outcomes: []
      },
      semantic: {
        concepts: new Map(),
        relationships: [],
        patterns: [],
        knowledge: []
      },
      procedural: {
        workflows: [],
        procedures: [],
        skills: [],
        shortcuts: []
      }
    };
  }

  /**
   * Load memory from storage
   */
  public async loadMemory(): Promise<void> {
    try {
      await fs.mkdir(this.memoryPath, { recursive: true });
      
      const files = [
        'working.json',
        'episodic.json',
        'semantic.json',
        'procedural.json'
      ];

      for (const file of files) {
        const filePath = path.join(this.memoryPath, file);
        try {
          const data = await fs.readFile(filePath, 'utf-8');
          const parsed = JSON.parse(data);
          
          switch (file) {
            case 'working.json':
              this.memorySystem.working = this.deserializeWorkingMemory(parsed);
              break;
            case 'episodic.json':
              this.memorySystem.episodic = parsed;
              break;
            case 'semantic.json':
              this.memorySystem.semantic = this.deserializeSemanticMemory(parsed);
              break;
            case 'procedural.json':
              this.memorySystem.procedural = parsed;
              break;
          }
        } catch (error) {
          // File doesn't exist yet, use default
        }
      }

      // Apply forgetting curve
      this.applyForgettingCurve();
    } catch (error) {
      console.error('Error loading memory:', error);
    }
  }

  /**
   * Save memory to storage
   */
  public async saveMemory(): Promise<void> {
    try {
      await fs.mkdir(this.memoryPath, { recursive: true });

      // Save working memory
      await fs.writeFile(
        path.join(this.memoryPath, 'working.json'),
        JSON.stringify(this.memorySystem.working, null, 2)
      );

      // Save episodic memory
      await fs.writeFile(
        path.join(this.memoryPath, 'episodic.json'),
        JSON.stringify(this.memorySystem.episodic, null, 2)
      );

      // Save semantic memory
      await fs.writeFile(
        path.join(this.memoryPath, 'semantic.json'),
        JSON.stringify(this.serializeSemanticMemory(this.memorySystem.semantic), null, 2)
      );

      // Save procedural memory
      await fs.writeFile(
        path.join(this.memoryPath, 'procedural.json'),
        JSON.stringify(this.memorySystem.procedural, null, 2)
      );
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }

  /**
   * Add item to working memory
   */
  public addToWorkingMemory(item: Omit<MemoryItem, 'id' | 'accessCount' | 'createdAt' | 'lastAccessedAt'>): void {
    const newItem: MemoryItem = {
      ...item,
      id: this.generateId(),
      accessCount: 1,
      createdAt: new Date(),
      lastAccessedAt: new Date()
    };

    // Check capacity
    if (this.memorySystem.working.items.length >= this.memorySystem.working.capacity) {
      // Evict least recently used
      this.evictFromWorkingMemory();
    }

    this.memorySystem.working.items.push(newItem);
    this.memorySystem.working.lastAccessed = new Date();
  }

  /**
   * Evict least recently used item from working memory
   */
  private evictFromWorkingMemory(): void {
    if (this.memorySystem.working.items.length === 0) return;

    // Find LRU item
    let lruIndex = 0;
    let lruTime = this.memorySystem.working.items[0].lastAccessedAt;

    for (let i = 1; i < this.memorySystem.working.items.length; i++) {
      if (this.memorySystem.working.items[i].lastAccessedAt < lruTime) {
        lruIndex = i;
        lruTime = this.memorySystem.working.items[i].lastAccessedAt;
      }
    }

    // Check if important enough to consolidate
    const evicted = this.memorySystem.working.items[lruIndex];
    if (evicted.importance >= this.consolidationSettings.importanceThreshold) {
      this.consolidateToLongTerm(evicted);
    }

    // Remove from working memory
    this.memorySystem.working.items.splice(lruIndex, 1);
  }

  /**
   * Consolidate memory item to long-term storage
   */
  private consolidateToLongTerm(item: MemoryItem): void {
    switch (item.type) {
      case 'concept':
        this.addConcept({
          id: item.id,
          name: item.content.split(':')[0] || item.content,
          definition: item.content,
          examples: [],
          relatedConcepts: item.associations,
          usageCount: item.accessCount,
          confidence: item.importance
        });
        break;
      
      case 'pattern':
        this.addPattern({
          id: item.id,
          name: item.content.split(':')[0] || 'Pattern',
          description: item.content,
          structure: '',
          examples: [],
          applicability: [],
          successRate: item.importance,
          usageCount: item.accessCount
        });
        break;
      
      case 'procedure':
        this.memorySystem.procedural.procedures.push({
          id: item.id,
          name: item.content.split(':')[0] || 'Procedure',
          trigger: '',
          steps: [item.content],
          exceptions: [],
          lastUsed: item.lastAccessedAt,
          effectiveness: item.importance
        });
        break;
    }
  }

  /**
   * Add session to episodic memory
   */
  public startSession(user: string, goals: string[]): Session {
    const session: Session = {
      id: this.generateId(),
      startTime: new Date(),
      user,
      goals,
      tasksCompleted: [],
      lessonsLearned: [],
      satisfaction: 0
    };

    this.memorySystem.episodic.sessions.push(session);
    return session;
  }

  /**
   * End session
   */
  public endSession(sessionId: string, satisfaction: number, lessonsLearned: string[]): void {
    const session = this.memorySystem.episodic.sessions.find(s => s.id === sessionId);
    if (session) {
      (session as any).endTime = new Date();
      (session as any).satisfaction = satisfaction;
      (session as any).lessonsLearned = lessonsLearned;
    }
  }

  /**
   * Add interaction to episodic memory
   */
  public addInteraction(interaction: Omit<Interaction, 'id'>): void {
    const newInteraction: Interaction = {
      ...interaction,
      id: this.generateId()
    };
    this.memorySystem.episodic.interactions.push(newInteraction);
  }

  /**
   * Add concept to semantic memory
   */
  public addConcept(concept: Concept): void {
    this.memorySystem.semantic.concepts.set(concept.id, concept);
  }

  /**
   * Add pattern to semantic memory
   */
  public addPattern(pattern: Pattern): void {
    const existing = this.memorySystem.semantic.patterns.findIndex(p => p.id === pattern.id);
    if (existing !== -1) {
      // Update existing pattern
      this.memorySystem.semantic.patterns[existing] = {
        ...this.memorySystem.semantic.patterns[existing],
        usageCount: this.memorySystem.semantic.patterns[existing].usageCount + 1,
        successRate: (this.memorySystem.semantic.patterns[existing].successRate + pattern.successRate) / 2
      };
    } else {
      this.memorySystem.semantic.patterns.push(pattern);
    }
  }

  /**
   * Add workflow to procedural memory
   */
  public addWorkflow(workflow: Workflow): void {
    this.memorySystem.procedural.workflows.push(workflow);
  }

  /**
   * Search memory
   */
  public async searchMemory(criteria: MemorySearchCriteria): Promise<MemoryItem[]> {
    const results: MemoryItem[] = [];
    const query = criteria.query?.toLowerCase() || '';

    // Search working memory
    results.push(...this.searchWorkingMemory(query, criteria));

    // Search long-term memories
    results.push(...this.searchLongTermMemory(query, criteria));

    // Sort by relevance and recency
    results.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime();
    });

    // Apply limit
    if (criteria.limit) {
      return results.slice(0, criteria.limit);
    }

    return results;
  }

  /**
   * Search working memory
   */
  private searchWorkingMemory(query: string, criteria: MemorySearchCriteria): MemoryItem[] {
    return this.memorySystem.working.items.filter(item => {
      if (criteria.type && item.type !== criteria.type) return false;
      if (criteria.minImportance && item.importance < criteria.minImportance) return false;
      if (query && !item.content.toLowerCase().includes(query)) return false;
      return true;
    });
  }

  /**
   * Search long-term memory
   */
  private searchLongTermMemory(query: string, criteria: MemorySearchCriteria): MemoryItem[] {
    const results: MemoryItem[] = [];

    // Search concepts
    for (const [id, concept] of this.memorySystem.semantic.concepts) {
      if (query && !concept.name.toLowerCase().includes(query) && 
          !concept.definition.toLowerCase().includes(query)) continue;
      
      results.push({
        id,
        content: `${concept.name}: ${concept.definition}`,
        type: 'concept',
        importance: concept.confidence,
        accessCount: concept.usageCount,
        createdAt: new Date(), // Would need to track this
        lastAccessedAt: new Date(),
        associations: concept.relatedConcepts
      });
    }

    // Search patterns
    for (const pattern of this.memorySystem.semantic.patterns) {
      if (query && !pattern.name.toLowerCase().includes(query) && 
          !pattern.description.toLowerCase().includes(query)) continue;
      
      results.push({
        id: pattern.id,
        content: `${pattern.name}: ${pattern.description}`,
        type: 'pattern',
        importance: pattern.successRate,
        accessCount: pattern.usageCount,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        associations: []
      });
    }

    return results;
  }

  /**
   * Apply forgetting curve to memories
   */
  private applyForgettingCurve(): void {
    const now = new Date();

    // Apply to working memory
    this.memorySystem.working.items = this.memorySystem.working.items.filter(item => {
      const daysSinceAccess = (now.getTime() - item.lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24);
      const strength = this.calculateMemoryStrength(item.importance, daysSinceAccess, item.accessCount);
      
      if (strength < this.forgettingCurve.minimumStrength) {
        // Consider consolidating before forgetting
        if (item.importance >= this.consolidationSettings.importanceThreshold) {
          this.consolidateToLongTerm(item);
        }
        return false;
      }
      
      // Update importance based on decay
      (item as any).importance = strength;
      return true;
    });
  }

  /**
   * Calculate memory strength using forgetting curve
   */
  private calculateMemoryStrength(
    initialImportance: number,
    daysSinceAccess: number,
    accessCount: number
  ): number {
    // Modified Ebbinghaus forgetting curve
    const decayFactor = Math.exp(-this.forgettingCurve.decayRate * daysSinceAccess);
    const reinforcementFactor = 1 + (accessCount * 0.1); // Each access adds 10% strength
    
    return Math.max(
      this.forgettingCurve.minimumStrength,
      initialImportance * decayFactor * reinforcementFactor
    );
  }

  /**
   * Reinforce memory
   */
  public reinforceMemory(itemId: string): void {
    // Check working memory
    const workingItem = this.memorySystem.working.items.find(item => item.id === itemId);
    if (workingItem) {
      (workingItem as any).accessCount++;
      (workingItem as any).lastAccessedAt = new Date();
      (workingItem as any).importance = Math.min(
        100,
        workingItem.importance + this.forgettingCurve.reinforcementBonus
      );
      return;
    }

    // Check and reinforce in long-term memory
    // This would need to be implemented for each memory type
  }

  /**
   * Get memory statistics
   */
  public getMemoryStats(): {
    workingMemoryUsage: number;
    totalConcepts: number;
    totalPatterns: number;
    totalSessions: number;
    averageSessionSatisfaction: number;
  } {
    const sessions = this.memorySystem.episodic.sessions.filter(s => s.satisfaction > 0);
    const avgSatisfaction = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.satisfaction, 0) / sessions.length
      : 0;

    return {
      workingMemoryUsage: (this.memorySystem.working.items.length / this.memorySystem.working.capacity) * 100,
      totalConcepts: this.memorySystem.semantic.concepts.size,
      totalPatterns: this.memorySystem.semantic.patterns.length,
      totalSessions: this.memorySystem.episodic.sessions.length,
      averageSessionSatisfaction: avgSatisfaction
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Serialize semantic memory for storage
   */
  private serializeSemanticMemory(semantic: SemanticMemory): any {
    return {
      concepts: Array.from(semantic.concepts.entries()),
      relationships: semantic.relationships,
      patterns: semantic.patterns,
      knowledge: semantic.knowledge
    };
  }

  /**
   * Deserialize semantic memory from storage
   */
  private deserializeSemanticMemory(data: any): SemanticMemory {
    return {
      concepts: new Map(data.concepts || []),
      relationships: data.relationships || [],
      patterns: data.patterns || [],
      knowledge: data.knowledge || []
    };
  }

  /**
   * Deserialize working memory with date parsing
   */
  private deserializeWorkingMemory(data: any): WorkingMemory {
    return {
      capacity: data.capacity || 7,
      items: (data.items || []).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        lastAccessedAt: new Date(item.lastAccessedAt)
      })),
      lastAccessed: new Date(data.lastAccessed || Date.now())
    };
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();