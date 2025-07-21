#!/usr/bin/env node
/**
 * Component Structure Validation Script
 *
 * This script checks React components against project standards:
 * - Ensures components use proper UI components instead of raw HTML
 * - Verifies localization usage for user-facing text
 * - Checks for proper return types (React.ReactElement)
 * - Ensures client directives are used appropriately
 * - Validates components against max file size rules
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const config = {
  // Raw HTML elements that should be avoided in components
  rawHtmlElements: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li'],
  // Components that must be used in pages
  requiredComponentsInPages: ['BasePage'],
  // Max lines allowed in a component file
  maxFileLength: 200,
  // Return type pattern to look for
  returnTypePattern: /function\s+\w+\([^)]*\):\s*React\.ReactElement/,
  // Client directive check pattern
  clientDirectivePattern: /'use client';/,
  // Localization hook usage pattern
  localizationPattern: /const\s*{\s*t\s*}.*useUI\(\)/,
  // Directories to analyze
  directories: ['./app/**/*.tsx', './src/components/**/*.tsx', './src/features/**/*.tsx'],
  // Exempt files (paths that can be skipped)
  exemptFiles: ['./app/layout.tsx', './app/providers.tsx'],
};

// Counter for issues
let totalIssues = 0;
let fileIssues = {};

/**
 * Check if file uses raw HTML elements that should be replaced with UI components
 */
function checkRawHtmlUsage(content, filePath) {
  const issues = [];

  config.rawHtmlElements.forEach((element) => {
    const pattern = new RegExp(`<${element}[\\s>]`, 'g');
    const matches = content.match(pattern);

    if (matches) {
      issues.push(
        `Found ${matches.length} raw <${element}> element(s) - replace with UI components`,
      );
    }
  });

  return issues;
}

/**
 * Check if page components use BasePage
 */
function checkBasePageUsage(content, filePath) {
  // Skip if not a page component
  if (
    (!filePath.includes('/page.tsx') && !filePath.includes('/app/')) ||
    filePath.includes('/components/')
  ) {
    return [];
  }

  // Special exclusions
  if (filePath.includes('app/login/page.tsx')) {
    return []; // Login page is exempt as it uses LoginForm directly
  }

  const issues = [];

  config.requiredComponentsInPages.forEach((component) => {
    if (!content.includes(`<${component}`)) {
      issues.push(`Page component doesn't use <${component}> wrapper component`);
    }
  });

  return issues;
}

/**
 * Check for proper return type declarations
 */
function checkReturnTypes(content, filePath) {
  // Skip non-component files
  if (!filePath.endsWith('.tsx')) return [];

  const issues = [];
  const functionComponentPattern = /function\s+\w+\([^)]*\):\s*[^{]*/g;
  const matches = content.match(functionComponentPattern);

  if (matches) {
    matches.forEach((match) => {
      if (!match.includes('React.ReactElement') && !match.includes('PropsWithChildren')) {
        issues.push(
          `Component has incorrect return type: ${match.trim()} - should use React.ReactElement`,
        );
      }
    });
  }

  return issues;
}

/**
 * Check for localization usage in user-facing text
 */
function checkLocalization(content, filePath) {
  // Skip certain files
  if (
    filePath.includes('localization/') ||
    config.exemptFiles.some((exempt) => filePath.includes(exempt))
  ) {
    return [];
  }

  const issues = [];

  // Check if component renders text but doesn't use the t() function
  const hasJsxText = /(>[\s\w\d.,!?æøåÆØÅ]+<)/g.test(content);
  const usesLocalization = content.includes('t(') || content.includes('useUI');

  if (hasJsxText && !usesLocalization) {
    issues.push('Component contains hardcoded text without localization (t() function)');
  }

  return issues;
}

/**
 * Check for client directive in client components
 */
function checkClientDirective(content, filePath) {
  // Skip server components or layout files
  if (config.exemptFiles.some((exempt) => filePath.includes(exempt))) {
    return [];
  }

  const issues = [];
  const usesHooks = /use[A-Z]\w+\(/g.test(content);
  const isClientComponent =
    content.includes('useState') ||
    content.includes('useEffect') ||
    content.includes('useUI') ||
    content.includes('useContext');

  if ((usesHooks || isClientComponent) && !config.clientDirectivePattern.test(content)) {
    issues.push("Client component uses hooks but is missing 'use client' directive");
  }

  return issues;
}

/**
 * Check file length against maximum
 */
function checkFileLength(content, filePath) {
  const lines = content.split('\n').length;

  if (lines > config.maxFileLength) {
    return [`File exceeds max length (${lines}/${config.maxFileLength} lines)`];
  }

  return [];
}

/**
 * Main validation function
 */
function validateFiles() {
  const files = [];

  config.directories.forEach((pattern) => {
    const matches = glob.sync(pattern);
    files.push(...matches);
  });

  const uniqueFiles = [...new Set(files)];

  console.log(chalk.blue(`\n🔍 Validating ${uniqueFiles.length} component files...\n`));

  uniqueFiles.forEach((filePath) => {
    const absolutePath = path.resolve(filePath);

    // Skip exempted files
    if (config.exemptFiles.some((exempt) => filePath.includes(exempt))) {
      return;
    }

    try {
      const content = fs.readFileSync(absolutePath, 'utf8');

      // Run all checks
      const rawHtmlIssues = checkRawHtmlUsage(content, filePath);
      const basePageIssues = checkBasePageUsage(content, filePath);
      const returnTypeIssues = checkReturnTypes(content, filePath);
      const localizationIssues = checkLocalization(content, filePath);
      const clientDirectiveIssues = checkClientDirective(content, filePath);
      const fileLengthIssues = checkFileLength(content, filePath);

      // Combine all issues
      const issues = [
        ...rawHtmlIssues,
        ...basePageIssues,
        ...returnTypeIssues,
        ...localizationIssues,
        ...clientDirectiveIssues,
        ...fileLengthIssues,
      ];

      if (issues.length > 0) {
        totalIssues += issues.length;
        fileIssues[filePath] = issues;

        console.log(chalk.yellow(`\n📁 ${filePath}`));
        issues.forEach((issue) => {
          console.log(chalk.red(`  ❌ ${issue}`));
        });
      }
    } catch (error) {
      console.error(chalk.red(`Error processing ${filePath}: ${error.message}`));
    }
  });

  return totalIssues === 0;
}

// Run validation and report results
const valid = validateFiles();

if (valid) {
  console.log(chalk.green('\n✅ All components meet project standards!\n'));
  process.exit(0);
} else {
  console.log(
    chalk.red(`\n❌ Found ${totalIssues} issues in ${Object.keys(fileIssues).length} files\n`),
  );
  console.log(chalk.yellow('Fix these issues to maintain project quality standards'));
  process.exit(1);
}
