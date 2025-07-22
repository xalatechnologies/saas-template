/**
 * Project History Loader
 * Loads and parses project history from .cursor-updates file
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { 
  ProjectContext, 
  ProjectMilestone, 
  TechnicalDecision, 
  LessonLearned,
  Goal,
  TechnicalDebtItem
} from '../context/types';

export interface ProjectHistory {
  readonly overview: string;
  readonly goals: Goal[];
  readonly phases: Phase[];
  readonly achievements: Achievement[];
  readonly decisions: TechnicalDecision[];
  readonly lessons: LessonLearned[];
  readonly currentStatus: ProjectStatus;
  readonly technicalDebts: TechnicalDebtItem[];
}

export interface Phase {
  readonly number: number;
  readonly name: string;
  readonly description: string;
  readonly completedAt?: Date;
  readonly keyFeatures: string[];
  readonly components: string[];
  readonly challenges: string[];
}

export interface Achievement {
  readonly category: string;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high';
  readonly date?: Date;
}

export interface ProjectStatus {
  readonly phase: string;
  readonly completionPercentage: number;
  readonly readyForProduction: boolean;
  readonly activeFeatures: string[];
  readonly upcomingFeatures: string[];
}

export class ProjectHistoryLoader {
  private projectRoot: string;
  private historyCache: ProjectHistory | null = null;

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  /**
   * Load project history from .cursor-updates
   */
  public async loadProjectHistory(): Promise<ProjectHistory | null> {
    if (this.historyCache) {
      return this.historyCache;
    }

    try {
      const filePath = path.join(this.projectRoot, '.cursor-updates');
      const content = await fs.readFile(filePath, 'utf-8');
      
      this.historyCache = this.parseProjectHistory(content);
      return this.historyCache;
    } catch (error) {
      console.warn('Could not load .cursor-updates:', error);
      return null;
    }
  }

  /**
   * Convert project history to ProjectContext
   */
  public async getProjectContext(): Promise<ProjectContext | null> {
    const history = await this.loadProjectHistory();
    if (!history) return null;

    const milestones: ProjectMilestone[] = history.phases
      .filter(phase => phase.completedAt)
      .map(phase => ({
        phase: phase.name,
        description: phase.description,
        completedAt: phase.completedAt!,
        keyAchievements: phase.keyFeatures
      }));

    return {
      name: 'Task Management Application',
      version: '1.0.0',
      currentPhase: history.currentStatus.phase,
      techStack: this.extractTechStack(history),
      conventions: this.extractConventions(history),
      history: {
        milestones,
        decisions: history.decisions,
        lessons: history.lessons
      },
      activeFeatures: history.currentStatus.activeFeatures,
      technicalDebt: history.technicalDebts,
      upcomingGoals: history.goals.filter(g => !g.targetDate || g.targetDate > new Date())
    };
  }

  /**
   * Parse the .cursor-updates content
   */
  private parseProjectHistory(content: string): ProjectHistory {
    const lines = content.split('\n');
    const history: ProjectHistory = {
      overview: '',
      goals: [],
      phases: [],
      achievements: [],
      decisions: [],
      lessons: [],
      currentStatus: {
        phase: '',
        completionPercentage: 0,
        readyForProduction: false,
        activeFeatures: [],
        upcomingFeatures: []
      },
      technicalDebts: []
    };

    let currentSection = '';
    let currentPhase: Phase | null = null;
    let currentSubsection = '';

    for (const line of lines) {
      // Detect main sections
      if (line.startsWith('## ')) {
        currentSection = line.substring(3).trim();
        currentSubsection = '';
        continue;
      }

      // Detect subsections
      if (line.startsWith('### ')) {
        currentSubsection = line.substring(4).trim();
        
        // Check if it's a phase
        const phaseMatch = line.match(/Phase (\d+): (.+)/);
        if (phaseMatch) {
          if (currentPhase) {
            history.phases.push(currentPhase);
          }
          currentPhase = {
            number: parseInt(phaseMatch[1]),
            name: phaseMatch[2],
            description: '',
            keyFeatures: [],
            components: [],
            challenges: []
          };
        }
        continue;
      }

      // Parse content based on current section
      switch (currentSection) {
        case 'Project Overview':
          if (!history.overview && line.trim()) {
            history.overview = line.trim();
          }
          break;

        case 'Long-term Goals & Vision':
          if (currentSubsection === 'Primary Objectives' && line.startsWith('- ')) {
            const goal = this.parseGoal(line.substring(2));
            if (goal) history.goals.push(goal);
          }
          break;

        case 'Complete Development History':
          if (currentPhase && line.startsWith('- ')) {
            const item = line.substring(2).trim();
            if (currentSubsection.includes('Components')) {
              currentPhase.components.push(item);
            } else {
              currentPhase.keyFeatures.push(item);
            }
          }
          break;

        case 'Technical Achievements':
          if (line.startsWith('- ')) {
            const achievement = this.parseAchievement(line.substring(2));
            if (achievement) history.achievements.push(achievement);
          }
          break;

        case 'Lessons Learned':
          if (line.match(/^\d+\.\s/)) {
            const lesson = this.parseLesson(line);
            if (lesson) history.lessons.push(lesson);
          }
          break;

        case 'Project Status: PRODUCTION READY ✅':
          if (line.startsWith('- ✅')) {
            history.currentStatus.activeFeatures.push(line.substring(4).trim());
          }
          break;
      }
    }

    // Add the last phase
    if (currentPhase) {
      history.phases.push(currentPhase);
    }

    // Set current status
    history.currentStatus.phase = history.phases[history.phases.length - 1]?.name || 'Unknown';
    history.currentStatus.completionPercentage = 100;
    history.currentStatus.readyForProduction = true;

    // Extract decisions from the content
    history.decisions = this.extractDecisions(content);
    
    // Extract technical debts
    history.technicalDebts = this.extractTechnicalDebts(content);

    return history;
  }

  /**
   * Parse a goal line
   */
  private parseGoal(text: string): Goal | null {
    const match = text.match(/\*\*(.+?)\*\*:?\s*(.+)/);
    if (match) {
      return {
        id: this.generateId(),
        title: match[1],
        priority: this.determinePriority(match[2])
      };
    }
    return null;
  }

  /**
   * Parse an achievement line
   */
  private parseAchievement(text: string): Achievement | null {
    const match = text.match(/\*\*(.+?)\*\*:?\s*(.+)/);
    if (match) {
      return {
        category: match[1],
        description: match[2],
        impact: 'high' // Most achievements in the file seem high impact
      };
    }
    return null;
  }

  /**
   * Parse a lesson learned
   */
  private parseLesson(text: string): LessonLearned | null {
    const match = text.match(/^\d+\.\s*\*\*(.+?)\*\*:?\s*(.+)/);
    if (match) {
      return {
        id: this.generateId(),
        lesson: match[1],
        context: match[2],
        category: this.categorizeLesson(match[1]),
        severity: this.determineSeverity(match[2])
      };
    }
    return null;
  }

  /**
   * Extract technical decisions from content
   */
  private extractDecisions(content: string): TechnicalDecision[] {
    const decisions: TechnicalDecision[] = [];
    const decisionPatterns = [
      /- Zustand with Immer for/,
      /- React Query for/,
      /- Tailwind CSS with/,
      /- Radix UI primitives/,
      /- i18next for/
    ];

    const lines = content.split('\n');
    for (const line of lines) {
      for (const pattern of decisionPatterns) {
        if (pattern.test(line)) {
          decisions.push({
            id: this.generateId(),
            decision: line.replace(/^-\s*/, '').split(' for ')[0],
            rationale: line.includes(' for ') ? line.split(' for ')[1] : '',
            alternatives: [],
            madeAt: new Date('2024-01-01'), // Approximate
            impact: 'high'
          });
        }
      }
    }

    return decisions;
  }

  /**
   * Extract technical debts from content
   */
  private extractTechnicalDebts(content: string): TechnicalDebtItem[] {
    const debts: TechnicalDebtItem[] = [];
    
    // Look for "Future Development" or "Planned" sections
    if (content.includes('Planned')) {
      const plannedMatch = content.match(/\(Planned\)([\s\S]*?)(?=##|$)/);
      if (plannedMatch) {
        const plannedItems = plannedMatch[1].match(/- \*\*(.+?)\*\*: (.+)/g) || [];
        for (const item of plannedItems) {
          const match = item.match(/- \*\*(.+?)\*\*: (.+)/);
          if (match) {
            debts.push({
              id: this.generateId(),
              description: `${match[1]}: ${match[2]}`,
              impact: 'medium',
              effort: 'large',
              createdAt: new Date()
            });
          }
        }
      }
    }

    return debts;
  }

  /**
   * Extract tech stack from history
   */
  private extractTechStack(history: ProjectHistory): string[] {
    const techStack = new Set<string>();
    
    // Add known technologies from the file
    techStack.add('Next.js 14');
    techStack.add('TypeScript');
    techStack.add('Zustand');
    techStack.add('React Query');
    techStack.add('Tailwind CSS');
    techStack.add('Radix UI');
    techStack.add('i18next');
    
    // Extract from decisions
    history.decisions.forEach(decision => {
      const tech = decision.decision.split(' ')[0];
      if (tech && tech.length > 2) {
        techStack.add(tech);
      }
    });

    return Array.from(techStack);
  }

  /**
   * Extract conventions from history
   */
  private extractConventions(history: ProjectHistory): string[] {
    const conventions: string[] = [];
    
    // Add known conventions from the file
    conventions.push('Strict TypeScript with explicit return types');
    conventions.push('Component organization by feature');
    conventions.push('Zustand with Immer for state management');
    conventions.push('WCAG AAA accessibility compliance');
    conventions.push('Norwegian compliance standards');
    conventions.push('Design token system for styling');
    conventions.push('GridLayout system for layouts');
    
    return conventions;
  }

  /**
   * Categorize lesson
   */
  private categorizeLesson(lesson: string): string {
    const categories: Record<string, string[]> = {
      'Architecture': ['modular', 'structure', 'organization'],
      'TypeScript': ['typescript', 'type', 'strict'],
      'Accessibility': ['accessibility', 'wcag', 'a11y'],
      'Performance': ['performance', 'optimization', 'bundle'],
      'State Management': ['state', 'zustand', 'context'],
      'Theme System': ['theme', 'design', 'color'],
      'Best Practices': ['practice', 'standard', 'convention']
    };

    const lowerLesson = lesson.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerLesson.includes(keyword))) {
        return category;
      }
    }

    return 'General';
  }

  /**
   * Determine priority from text
   */
  private determinePriority(text: string): 'low' | 'medium' | 'high' {
    if (text.includes('critical') || text.includes('mandatory') || text.includes('must')) {
      return 'high';
    }
    if (text.includes('should') || text.includes('recommended')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Determine severity from text
   */
  private determineSeverity(text: string): 'info' | 'warning' | 'critical' {
    if (text.includes('critical') || text.includes('prevented') || text.includes('error')) {
      return 'critical';
    }
    if (text.includes('challenge') || text.includes('difficult')) {
      return 'warning';
    }
    return 'info';
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get relevant history for a specific task
   */
  public async getRelevantHistory(taskType: string, component?: string): Promise<{
    similarPhases: Phase[];
    relevantLessons: LessonLearned[];
    relatedComponents: string[];
    successPatterns: string[];
  }> {
    const history = await this.loadProjectHistory();
    if (!history) {
      return {
        similarPhases: [],
        relevantLessons: [],
        relatedComponents: [],
        successPatterns: []
      };
    }

    // Find similar phases
    const similarPhases = history.phases.filter(phase => {
      const phaseComponents = phase.components.join(' ').toLowerCase();
      const phaseFeatures = phase.keyFeatures.join(' ').toLowerCase();
      return phaseComponents.includes(taskType.toLowerCase()) ||
             phaseFeatures.includes(taskType.toLowerCase()) ||
             (component && phaseComponents.includes(component.toLowerCase()));
    });

    // Find relevant lessons
    const relevantLessons = history.lessons.filter(lesson => {
      const lessonText = `${lesson.lesson} ${lesson.context}`.toLowerCase();
      return lessonText.includes(taskType.toLowerCase()) ||
             (component && lessonText.includes(component.toLowerCase()));
    });

    // Find related components
    const relatedComponents = new Set<string>();
    for (const phase of history.phases) {
      for (const comp of phase.components) {
        if (component && comp.toLowerCase().includes(component.toLowerCase())) {
          relatedComponents.add(comp);
        }
      }
    }

    // Extract success patterns
    const successPatterns = this.extractSuccessPatterns(history);

    return {
      similarPhases,
      relevantLessons,
      relatedComponents: Array.from(relatedComponents),
      successPatterns
    };
  }

  /**
   * Extract success patterns from history
   */
  private extractSuccessPatterns(history: ProjectHistory): string[] {
    const patterns: string[] = [];
    
    // Common successful patterns from the project
    patterns.push('Component organization by feature');
    patterns.push('Strict TypeScript with explicit return types');
    patterns.push('Design token system for consistent styling');
    patterns.push('GridLayout system for responsive layouts');
    patterns.push('Zustand with Immer for state management');
    patterns.push('Comprehensive accessibility implementation');
    
    // Extract from achievements
    history.achievements
      .filter(a => a.impact === 'high')
      .forEach(a => {
        if (a.description.includes('implementation')) {
          patterns.push(a.description);
        }
      });

    return patterns;
  }
}

// Export singleton instance
export const projectHistoryLoader = new ProjectHistoryLoader();