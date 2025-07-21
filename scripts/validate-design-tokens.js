#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Enforces .cursorrules requirement: "ALL components MUST use design tokens exclusively. NO hardcoded styling is permitted."
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Forbidden hardcoded values that should use design tokens instead
const FORBIDDEN_PATTERNS = [
  // Hardcoded colors
  /bg-(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
  /text-(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
  /border-(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g,
  
  // Hardcoded spacing (should use design system spacing)
  /[mp][trblxy]?-\d+(?![\d.])/g, // Matches p-4, m-8, pt-2, etc. but not p-4.5
  /space-[xy]-\d+/g,
  /gap-\d+/g,
  
  // Hardcoded dimensions
  /[wh]-\d+(?![\d.])/g, // w-64, h-32, etc.
  
  // Hardcoded border radius (should use design system)
  /rounded-(?:sm|md|lg|xl|2xl|3xl)(?!-)/g,
  
  // Hardcoded shadows (should use design system)
  /shadow-(?:sm|md|lg|xl|2xl)(?!-)/g,
  
  // Hex colors
  /#[0-9a-fA-F]{3,6}/g,
  
  // RGB/RGBA colors
  /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,
  
  // Pixel values
  /\d+px/g,
  
  // Rem values (should use design tokens)
  /\d+(?:\.\d+)?rem/g,
];

// Allowed design token patterns
const ALLOWED_PATTERNS = [
  // Semantic colors
  /bg-(?:background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring)/,
  /text-(?:foreground|muted-foreground|primary-foreground|secondary-foreground|accent-foreground|destructive-foreground)/,
  /border-(?:border|input|ring)/,
  
  // Design system spacing
  /[mp][trblxy]?-(?:px|0\.5|1\.5|2\.5|3\.5)/,
  
  // Design system dimensions
  /[wh]-(?:auto|full|screen|min|max|fit)/,
  
  // CSS variables
  /var\(--[\w-]+\)/,
];

/**
 * Check if a line contains forbidden hardcoded values
 * @param {string} line - Line of code to check
 * @param {string} filePath - Path to the file being checked
 * @param {number} lineNumber - Line number in the file
 * @returns {Array} Array of violations found
 */
function checkLineForViolations(line, filePath, lineNumber) {
  const violations = [];
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    const matches = line.match(pattern);
    if (matches) {
      // Check if any allowed patterns are present that might override the forbidden ones
      const hasAllowedPattern = ALLOWED_PATTERNS.some(allowedPattern => 
        allowedPattern.test(line)
      );
      
      if (!hasAllowedPattern) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: line.indexOf(matches[0]) + 1,
          message: `Hardcoded styling detected: "${matches[0]}". Use design tokens instead.`,
          rule: 'design-token-usage',
          severity: 'error',
          suggestion: getDesignTokenSuggestion(matches[0])
        });
      }
    }
  }
  
  return violations;
}

/**
 * Get design token suggestion for a hardcoded value
 * @param {string} hardcodedValue - The hardcoded value found
 * @returns {string} Suggested design token alternative
 */
function getDesignTokenSuggestion(hardcodedValue) {
  if (hardcodedValue.includes('bg-')) {
    return 'Use semantic colors like bg-background, bg-primary, bg-secondary, etc.';
  }
  if (hardcodedValue.includes('text-')) {
    return 'Use semantic text colors like text-foreground, text-muted-foreground, etc.';
  }
  if (hardcodedValue.match(/[mp][trblxy]?-\d+/)) {
    return 'Use design system spacing classes or CSS variables like var(--spacing-lg)';
  }
  if (hardcodedValue.includes('#') || hardcodedValue.includes('rgb')) {
    return 'Use CSS variables like hsl(var(--primary)) or semantic color classes';
  }
  if (hardcodedValue.includes('px') || hardcodedValue.includes('rem')) {
    return 'Use design token spacing or CSS variables';
  }
  return 'Replace with appropriate design token from the design system';
}

/**
 * Validate design token usage in a file
 * @param {string} filePath - Path to the file to validate
 * @returns {Array} Array of violations found
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  
  lines.forEach((line, index) => {
    const lineViolations = checkLineForViolations(line, filePath, index + 1);
    violations.push(...lineViolations);
  });
  
  return violations;
}

/**
 * Main validation function
 */
function validateDesignTokens() {
  console.log('🎨 Validating design token usage...');
  
  // Files to check for design token violations
  const patterns = [
    'src/**/*.{ts,tsx,js,jsx}',
    'app/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/*.spec.{ts,tsx,js,jsx}',
    '!node_modules/**',
  ];
  
  let allViolations = [];
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    
    files.forEach(file => {
      const violations = validateFile(file);
      allViolations.push(...violations);
    });
  });
  
  // Report results
  if (allViolations.length === 0) {
    console.log('✅ Design token validation passed! No hardcoded styling detected.');
    return true;
  }
  
  console.log(`❌ Design token validation failed! Found ${allViolations.length} violations:\n`);
  
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
  
  console.log('\n📖 Design Token Guidelines:');
  console.log('   • Use semantic colors: bg-background, bg-primary, text-foreground, etc.');
  console.log('   • Use CSS variables: hsl(var(--primary)), var(--spacing-lg), etc.');
  console.log('   • Avoid hardcoded values: #3b82f6, 16px, 1rem, bg-blue-500, etc.');
  console.log('   • Refer to src/design-tokens/ for available tokens\n');
  
  return false;
}

// Run validation if called directly
if (require.main === module) {
  const success = validateDesignTokens();
  process.exit(success ? 0 : 1);
}

module.exports = { validateDesignTokens };