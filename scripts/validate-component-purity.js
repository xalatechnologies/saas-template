#!/usr/bin/env node

/**
 * Component Purity Validation Script
 * Enforces .cursorrules requirement: "Components must be pure and presentational in `/ui` directory"
 * "NO internal state hooks (useState, useEffect)"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Hooks that are forbidden in pure UI components
const FORBIDDEN_HOOKS = [
  'useState',
  'useEffect',
  'useLayoutEffect',
  'useReducer',
  'useCallback',
  'useMemo',
  'useRef',
  'useImperativeHandle',
  'useContext',
  // Custom hooks that might contain state
  'useAuth',
  'useTasks',
  'useUI',
  'useTheme',
  'useI18n',
];

// Allowed hooks for pure components
const ALLOWED_HOOKS = [
  'React.forwardRef',
  'React.memo',
];

/**
 * Check if a line contains forbidden hooks
 * @param {string} line - Line of code to check
 * @param {string} filePath - Path to the file being checked
 * @param {number} lineNumber - Line number in the file
 * @returns {Array} Array of violations found
 */
function checkLineForHooks(line, filePath, lineNumber) {
  const violations = [];
  
  // Skip comments and imports
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import')) {
    return violations;
  }
  
  for (const hook of FORBIDDEN_HOOKS) {
    // Look for hook usage patterns
    const patterns = [
      new RegExp(`\\b${hook}\\s*\\(`, 'g'), // useState(
      new RegExp(`\\b${hook}\\s*<`, 'g'),   // useState<
      new RegExp(`const\\s+.*=\\s*${hook}\\s*\\(`, 'g'), // const [state] = useState(
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: line.indexOf(hook) + 1,
          message: `Forbidden hook "${hook}" found in UI component. UI components must be pure and presentational.`,
          rule: 'component-purity',
          severity: 'error',
          hook: hook,
          suggestion: getHookSuggestion(hook)
        });
      }
    }
  }
  
  return violations;
}

/**
 * Get suggestion for replacing forbidden hooks
 * @param {string} hook - The forbidden hook
 * @returns {string} Suggestion for replacement
 */
function getHookSuggestion(hook) {
  switch (hook) {
    case 'useState':
    case 'useReducer':
      return 'Move state management to parent component or use a store (Zustand). Pass data as props.';
    case 'useEffect':
    case 'useLayoutEffect':
      return 'Move side effects to parent component or custom hooks outside the UI directory.';
    case 'useCallback':
    case 'useMemo':
      return 'These optimizations should be handled by parent components. Keep UI components simple.';
    case 'useRef':
      return 'Use React.forwardRef if you need to expose DOM references. Avoid internal refs in UI components.';
    case 'useContext':
      return 'Pass context values as props from parent components instead of consuming context directly.';
    default:
      if (hook.startsWith('use')) {
        return 'Custom hooks should not be used in pure UI components. Pass data as props instead.';
      }
      return 'Remove this hook and pass necessary data as props from parent components.';
  }
}

/**
 * Check if a file contains React component patterns
 * @param {string} content - File content
 * @returns {boolean} True if file appears to be a React component
 */
function isReactComponent(content) {
  const componentPatterns = [
    /export\s+(?:const|function)\s+\w+.*=.*React\.forwardRef/,
    /export\s+(?:const|function)\s+\w+.*=.*\(.*\)\s*=>/,
    /export\s+function\s+\w+.*\(.*\).*\{/,
    /return\s*\(/,
    /return\s*</,
    /<\w+/,
    /JSX\.Element/,
  ];
  
  return componentPatterns.some(pattern => pattern.test(content));
}

/**
 * Validate component purity in a file
 * @param {string} filePath - Path to the file to validate
 * @returns {Array} Array of violations found
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Only check React components
  if (!isReactComponent(content)) {
    return [];
  }
  
  const lines = content.split('\n');
  const violations = [];
  
  lines.forEach((line, index) => {
    const lineViolations = checkLineForHooks(line, filePath, index + 1);
    violations.push(...lineViolations);
  });
  
  return violations;
}

/**
 * Main validation function
 */
function validateComponentPurity() {
  console.log('🧩 Validating component purity in UI directory...');
  
  // Only check UI components directory
  const patterns = [
    'src/components/ui/**/*.{ts,tsx}',
    'components/ui/**/*.{ts,tsx}',
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
  console.log(`📊 Checked ${totalFiles} UI component files`);
  
  if (allViolations.length === 0) {
    console.log('✅ Component purity validation passed! All UI components are pure and presentational.');
    return true;
  }
  
  console.log(`❌ Component purity validation failed! Found ${allViolations.length} violations:\n`);
  
  // Group violations by file
  const violationsByFile = allViolations.reduce((acc, violation) => {
    if (!acc[violation.file]) {
      acc[violation.file] = [];
    }
    acc[violation.file].push(violation);
    return acc;
  }, {});
  
  // Display violations
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`📁 ${file}:`);
    violations.forEach(violation => {
      console.log(`  ❌ Line ${violation.line}:${violation.column} - ${violation.message}`);
      console.log(`     💡 Suggestion: ${violation.suggestion}\n`);
    });
  });
  
  console.log('📖 Component Purity Guidelines:');
  console.log('   • UI components must be pure and presentational');
  console.log('   • No state management hooks (useState, useReducer)');
  console.log('   • No side effects (useEffect, useLayoutEffect)');
  console.log('   • No custom hooks that contain state or effects');
  console.log('   • Pass all data as props from parent components');
  console.log('   • Use React.forwardRef and React.memo when needed\n');
  
  return false;
}

// Run validation if called directly
if (require.main === module) {
  const success = validateComponentPurity();
  process.exit(success ? 0 : 1);
}

module.exports = { validateComponentPurity };