/**
 * Rules Loader
 * Loads and parses rules from .cursorrules and CLAUDE.md files
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface ProjectRules {
  readonly source: 'cursorrules' | 'claude.md';
  readonly content: string;
  readonly sections: Map<string, string>;
  readonly codingStandards: readonly string[];
  readonly forbiddenPatterns: readonly string[];
  readonly requiredPatterns: readonly string[];
}

export class RulesLoader {
  private projectRoot: string;
  private rulesCache: Map<string, ProjectRules> = new Map();

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  /**
   * Load rules from .cursorrules file
   */
  public async loadCursorRules(): Promise<ProjectRules | null> {
    const cached = this.rulesCache.get('cursorrules');
    if (cached) return cached;

    try {
      const filePath = path.join(this.projectRoot, '.cursorrules');
      const content = await fs.readFile(filePath, 'utf-8');
      
      const rules: ProjectRules = {
        source: 'cursorrules',
        content,
        sections: this.parseSections(content),
        codingStandards: this.extractCodingStandards(content),
        forbiddenPatterns: this.extractForbiddenPatterns(content),
        requiredPatterns: this.extractRequiredPatterns(content)
      };

      this.rulesCache.set('cursorrules', rules);
      return rules;
    } catch (error) {
      console.warn('Could not load .cursorrules:', error);
      return null;
    }
  }

  /**
   * Load rules from CLAUDE.md file
   */
  public async loadClaudeMd(): Promise<ProjectRules | null> {
    const cached = this.rulesCache.get('claude.md');
    if (cached) return cached;

    try {
      const filePath = path.join(this.projectRoot, 'CLAUDE.md');
      const content = await fs.readFile(filePath, 'utf-8');
      
      const rules: ProjectRules = {
        source: 'claude.md',
        content,
        sections: this.parseSections(content),
        codingStandards: this.extractCodingStandards(content),
        forbiddenPatterns: this.extractForbiddenPatterns(content),
        requiredPatterns: this.extractRequiredPatterns(content)
      };

      this.rulesCache.set('claude.md', rules);
      return rules;
    } catch (error) {
      console.warn('Could not load CLAUDE.md:', error);
      return null;
    }
  }

  /**
   * Load all available rules
   */
  public async loadAllRules(): Promise<{
    cursorrules: ProjectRules | null;
    claudeMd: ProjectRules | null;
  }> {
    const [cursorrules, claudeMd] = await Promise.all([
      this.loadCursorRules(),
      this.loadClaudeMd()
    ]);

    return { cursorrules, claudeMd };
  }

  /**
   * Parse markdown sections
   */
  private parseSections(content: string): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = content.split('\n');
    
    let currentSection = '';
    let currentContent: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection && currentContent.length > 0) {
          sections.set(currentSection, currentContent.join('\n').trim());
        }
        currentSection = line.substring(3).trim();
        currentContent = [];
      } else if (line.startsWith('### ')) {
        if (currentSection && currentContent.length > 0) {
          sections.set(currentSection, currentContent.join('\n').trim());
        }
        currentSection = `${currentSection} - ${line.substring(4).trim()}`;
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }
    
    if (currentSection && currentContent.length > 0) {
      sections.set(currentSection, currentContent.join('\n').trim());
    }
    
    return sections;
  }

  /**
   * Extract coding standards from content
   */
  private extractCodingStandards(content: string): readonly string[] {
    const standards: string[] = [];
    const lines = content.split('\n');
    
    let inStandardsSection = false;
    
    for (const line of lines) {
      if (line.includes('Coding Standards') || line.includes('Core Development Rules')) {
        inStandardsSection = true;
        continue;
      }
      
      if (inStandardsSection && line.startsWith('## ')) {
        inStandardsSection = false;
        continue;
      }
      
      if (inStandardsSection && line.trim().startsWith('- ')) {
        standards.push(line.trim().substring(2));
      }
    }
    
    return standards;
  }

  /**
   * Extract forbidden patterns from content
   */
  private extractForbiddenPatterns(content: string): readonly string[] {
    const patterns: string[] = [];
    const lines = content.split('\n');
    
    let inForbiddenSection = false;
    
    for (const line of lines) {
      if (line.includes('FORBIDDEN') || line.includes("Don't Do") || line.includes('❌')) {
        inForbiddenSection = true;
        continue;
      }
      
      if (inForbiddenSection && (line.includes('REQUIRED') || line.includes('✅') || line.startsWith('## '))) {
        inForbiddenSection = false;
        continue;
      }
      
      if (inForbiddenSection) {
        // Extract code patterns from the line
        const codeMatch = line.match(/`([^`]+)`/g);
        if (codeMatch) {
          patterns.push(...codeMatch.map(m => m.replace(/`/g, '')));
        }
        // Also extract patterns starting with < or className=
        const tagMatch = line.match(/<[^>]+>|className="[^"]+"/g);
        if (tagMatch) {
          patterns.push(...tagMatch);
        }
      }
    }
    
    return Array.from(new Set(patterns)); // Remove duplicates
  }

  /**
   * Extract required patterns from content
   */
  private extractRequiredPatterns(content: string): readonly string[] {
    const patterns: string[] = [];
    const lines = content.split('\n');
    
    let inRequiredSection = false;
    
    for (const line of lines) {
      if (line.includes('REQUIRED') || line.includes('Do Instead') || (line.includes('✅') && !line.includes('FORBIDDEN'))) {
        inRequiredSection = true;
        continue;
      }
      
      if (inRequiredSection && (line.includes('FORBIDDEN') || line.includes('❌') || line.startsWith('## '))) {
        inRequiredSection = false;
        continue;
      }
      
      if (inRequiredSection) {
        // Extract code patterns from the line
        const codeMatch = line.match(/`([^`]+)`/g);
        if (codeMatch) {
          patterns.push(...codeMatch.map(m => m.replace(/`/g, '')));
        }
        // Also extract component names
        const componentMatch = line.match(/<([A-Z]\w+)/g);
        if (componentMatch) {
          patterns.push(...componentMatch.map(m => m.substring(1)));
        }
      }
    }
    
    return Array.from(new Set(patterns)); // Remove duplicates
  }

  /**
   * Merge rules from multiple sources
   */
  public mergeRules(rules: (ProjectRules | null)[]): ProjectRules {
    const validRules = rules.filter((r): r is ProjectRules => r !== null);
    
    if (validRules.length === 0) {
      throw new Error('No valid rules found');
    }
    
    const mergedSections = new Map<string, string>();
    const mergedStandards: string[] = [];
    const mergedForbidden: string[] = [];
    const mergedRequired: string[] = [];
    
    for (const rule of validRules) {
      // Merge sections
      rule.sections.forEach((content, section) => {
        const existing = mergedSections.get(section);
        if (existing) {
          mergedSections.set(section, `${existing}\n\n${content}`);
        } else {
          mergedSections.set(section, content);
        }
      });
      
      // Merge arrays
      mergedStandards.push(...rule.codingStandards);
      mergedForbidden.push(...rule.forbiddenPatterns);
      mergedRequired.push(...rule.requiredPatterns);
    }
    
    return {
      source: 'cursorrules', // Primary source
      content: validRules.map(r => r.content).join('\n\n---\n\n'),
      sections: mergedSections,
      codingStandards: Array.from(new Set(mergedStandards)),
      forbiddenPatterns: Array.from(new Set(mergedForbidden)),
      requiredPatterns: Array.from(new Set(mergedRequired))
    };
  }
}

// Export singleton instance
export const rulesLoader = new RulesLoader();