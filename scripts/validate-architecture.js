#!/usr/bin/env node

/**
 * Architecture Validation Script
 * Enforces .cursorrules architectural requirements:
 * - NO cross-dependencies between packages at same level
 * - Proper import organization
 * - File naming conventions
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Package hierarchy - higher level packages can import from lower level ones
const PACKAGE_HIERARCHY = {
  'app': 5,           // Highest level - can import from all
  'pages': 5,         // Same level as app
  'components': 4,    // Can import from hooks, utils, types, etc.
  'hooks': 3,         // Can import from utils, types, store
  'store': 2,         // Can import from utils, types
  'lib': 2,           // Same level as store
  'utils': 1,         // Can import from types only
  'types': 0,         // Lowest level - no imports from other packages
  'providers': 3,     // Same level as hooks
  'localization': 1,  // Same level as utils
  'design-tokens': 1, // Same level as utils
};

// File naming conventions
const NAMING_CONVENTIONS = {
  files: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(ts|tsx|js|jsx)$/, // kebab-case
  components: /^[A-Z][a-zA-Z0-9]*$/, // PascalCase
  hooks: /^use[A-Z][a-zA-Z0-9]*$/, // camelCase starting with 'use'
  constants: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/, // UPPER_CASE
};

/**
 * Extract package name from file path
 * @param {string} filePath - File path
 * @returns {string|null} Package name or null if not in a package
 */
function getPackageName(filePath) {
  const srcMatch = filePath.match(/src\/([^\/]+)/);
  if (srcMatch) {
    return srcMatch[1];
  }
  
  const rootMatch = filePath.match(/^([^\/]+)\//);
  if (rootMatch && PACKAGE_HIERARCHY.hasOwnProperty(rootMatch[1])) {
    return rootMatch[1];
  }
  
  return null;
}

/**
 * Extract imports from file content
 * @param {string} content - File content
 * @returns {Array} Array of import statements
 */
function extractImports(content) {
  const imports = [];
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*(?:{[^}]*}|\*\s+as\s+\w+|\w+))?\s*from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      statement: match[0],
      module: match[1]
    });
  }
  
  return imports;
}

/**
 * Check for cross-package dependency violations
 * @param {string} filePath - Path to the file being checked
 * @param {Array} imports - Array of import statements
 * @returns {Array} Array of violations found
 */
function checkCrossDependencies(filePath, imports) {
  const violations = [];
  const currentPackage = getPackageName(filePath);
  
  if (!currentPackage) {
    return violations;
  }
  
  const currentLevel = PACKAGE_HIERARCHY[currentPackage];
  
  imports.forEach(importItem => {
    const { statement, module } = importItem;
    
    // Check internal imports (starting with @/ or relative paths)
    if (module.startsWith('@/') || module.startsWith('./') || module.startsWith('../')) {
      let targetPackage = null;
      
      if (module.startsWith('@/')) {
        // Extract package from @/package/...
        const packageMatch = module.match(/@\/([^\/]+)/);
        if (packageMatch) {
          targetPackage = packageMatch[1];
        }
      } else {
        // Handle relative imports
        const resolvedPath = path.resolve(path.dirname(filePath), module);
        targetPackage = getPackageName(resolvedPath);
      }
      
      if (targetPackage && PACKAGE_HIERARCHY.hasOwnProperty(targetPackage)) {
        const targetLevel = PACKAGE_HIERARCHY[targetPackage];
        
        // Check if current package is trying to import from a higher-level package
        if (currentLevel < targetLevel) {
          violations.push({
            file: filePath,
            message: `Invalid cross-dependency: "${currentPackage}" (level ${currentLevel}) cannot import from "${targetPackage}" (level ${targetLevel})`,
            rule: 'cross-dependency',
            severity: 'error',
            import: statement,
            suggestion: `Move shared code to a lower-level package or restructure the dependency relationship.`
          });
        }
        
        // Check for same-level cross-dependencies (except allowed ones)
        if (currentLevel === targetLevel && currentPackage !== targetPackage) {
          const allowedSameLevelImports = {
            'store': ['lib'], // Store can import from lib
            'hooks': ['store', 'lib'], // Hooks can import from store and lib
            'components': ['hooks', 'store', 'lib'], // Components can import from hooks, store, lib
          };
          
          const allowed = allowedSameLevelImports[currentPackage] || [];
          if (!allowed.includes(targetPackage)) {
            violations.push({
              file: filePath,
              message: `Invalid same-level cross-dependency: "${currentPackage}" cannot import from "${targetPackage}"`,
              rule: 'same-level-dependency',
              severity: 'warning',
              import: statement,
              suggestion: `Consider moving shared code to a lower-level package or using dependency injection.`
            });
          }
        }
      }
    }
  });
  
  return violations;
}

/**
 * Check file naming conventions
 * @param {string} filePath - Path to the file
 * @returns {Array} Array of violations found
 */
function checkNamingConventions(filePath) {
  const violations = [];
  const fileName = path.basename(filePath, path.extname(filePath));
  const fileNameWithExt = path.basename(filePath);
  
  // Check file naming (kebab-case)
  if (!NAMING_CONVENTIONS.files.test(fileNameWithExt)) {
    violations.push({
      file: filePath,
      message: `File name "${fileNameWithExt}" does not follow kebab-case convention`,
      rule: 'file-naming',
      severity: 'error',
      suggestion: 'Use kebab-case for file names (e.g., task-card.tsx, user-profile.ts)'
    });
  }
  
  // Check component naming if it's a component file
  if (filePath.includes('/components/') && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
    const content = fs.readFileSync(filePath, 'utf8');
    const componentMatches = content.match(/export\s+(?:const|function)\s+(\w+)/g);
    
    if (componentMatches) {
      componentMatches.forEach(match => {
        const componentName = match.match(/export\s+(?:const|function)\s+(\w+)/)[1];
        if (!NAMING_CONVENTIONS.components.test(componentName)) {
          violations.push({
            file: filePath,
            message: `Component name "${componentName}" does not follow PascalCase convention`,
            rule: 'component-naming',
            severity: 'error',
            suggestion: 'Use PascalCase for component names (e.g., TaskCard, UserProfile)'
          });
        }
      });
    }
  }
  
  return violations;
}

/**
 * Validate architecture in a file
 * @param {string} filePath - Path to the file to validate
 * @returns {Array} Array of violations found
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = extractImports(content);
  
  const violations = [
    ...checkCrossDependencies(filePath, imports),
    ...checkNamingConventions(filePath)
  ];
  
  return violations;
}

/**
 * Main validation function
 */
function validateArchitecture() {
  console.log('🏗️  Validating architecture and dependencies...');
  
  const patterns = [
    'src/**/*.{ts,tsx,js,jsx}',
    'app/**/*.{ts,tsx,js,jsx}',
    'components/**/*.{ts,tsx,js,jsx}',
    'pages/**/*.{ts,tsx,js,jsx}',
    '!**/*.test.{ts,tsx,js,jsx}',
    '!**/*.spec.{ts,tsx,js,jsx}',
    '!node_modules/**',
  ];
  
  let allViolations = [];
  let totalFiles = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    
    files.forEach(file => {
      totalFiles++;
      const violations = validateFile(file);
      allViolations.push(...violations);
    });
  });
  
  // Report results
  console.log(`📊 Checked ${totalFiles} files`);
  
  if (allViolations.length === 0) {
    console.log('✅ Architecture validation passed! All dependencies and naming conventions are correct.');
    return true;
  }
  
  console.log(`❌ Architecture validation failed! Found ${allViolations.length} violations:\n`);
  
  // Group violations by type
  const violationsByType = allViolations.reduce((acc, violation) => {
    if (!acc[violation.rule]) {
      acc[violation.rule] = [];
    }
    acc[violation.rule].push(violation);
    return acc;
  }, {});
  
  // Display violations by type
  Object.entries(violationsByType).forEach(([rule, violations]) => {
    console.log(`\n📋 ${rule.toUpperCase()} VIOLATIONS (${violations.length}):`);
    violations.forEach((violation, index) => {
      console.log(`${index + 1}. 📁 ${violation.file}`);
      console.log(`   ❌ ${violation.message}`);
      if (violation.import) {
        console.log(`   📦 Import: ${violation.import}`);
      }
      console.log(`   💡 ${violation.suggestion}\n`);
    });
  });
  
  console.log('📖 Architecture Guidelines:');
  console.log('   • Package Hierarchy: app/pages > components > hooks/providers > store/lib > utils/localization/design-tokens > types');
  console.log('   • No cross-dependencies between packages at same level');
  console.log('   • Use kebab-case for file names');
  console.log('   • Use PascalCase for component names');
  console.log('   • Use camelCase for hooks (starting with "use")');
  console.log('   • Use UPPER_CASE for constants\n');
  
  return false;
}

// Run validation if called directly
if (require.main === module) {
  const success = validateArchitecture();
  process.exit(success ? 0 : 1);
}

module.exports = { validateArchitecture };