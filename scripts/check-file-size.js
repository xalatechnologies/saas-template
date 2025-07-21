#!/usr/bin/env node

/**
 * File Size Validation Script
 * Enforces .cursorrules requirement: "Maximum 300 lines per file"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MAX_LINES = 300;
const EXCLUDED_PATTERNS = [
  'node_modules/**',
  '.next/**',
  'coverage/**',
  'dist/**',
  'build/**',
  '**/*.min.js',
  '**/*.bundle.js',
  'package-lock.json',
  '**/*.test.{ts,tsx,js,jsx}', // Test files can be longer
  '**/*.spec.{ts,tsx,js,jsx}',
];

/**
 * Count lines in a file, excluding empty lines and comments-only lines
 * @param {string} filePath - Path to the file
 * @returns {Object} Line count information
 */
function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let totalLines = lines.length;
  let codeLines = 0;
  let commentLines = 0;
  let emptyLines = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      emptyLines++;
    } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      commentLines++;
    } else {
      codeLines++;
    }
  });

  return {
    total: totalLines,
    code: codeLines,
    comments: commentLines,
    empty: emptyLines,
  };
}

/**
 * Check if a file exceeds the maximum line limit
 * @param {string} filePath - Path to the file to check
 * @returns {Object|null} Violation object if file is too large, null otherwise
 */
function checkFileSize(filePath) {
  const stats = countLines(filePath);

  if (stats.total > MAX_LINES) {
    return {
      file: filePath,
      lines: stats.total,
      codeLines: stats.code,
      maxLines: MAX_LINES,
      excess: stats.total - MAX_LINES,
      message: `File exceeds maximum line limit of ${MAX_LINES} lines (${stats.total} lines found)`,
      rule: 'max-file-size',
      severity: 'error',
      suggestion: getSuggestion(filePath, stats),
    };
  }

  return null;
}

/**
 * Get refactoring suggestion based on file type and size
 * @param {string} filePath - Path to the file
 * @param {Object} stats - Line count statistics
 * @returns {string} Refactoring suggestion
 */
function getSuggestion(filePath, stats) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);

  if (filePath.includes('components/')) {
    return 'Consider breaking this component into smaller, focused components. Extract reusable logic into custom hooks.';
  }

  if (filePath.includes('pages/') || filePath.includes('app/')) {
    return 'Consider moving business logic to separate service files or custom hooks. Break complex pages into smaller components.';
  }

  if (filePath.includes('utils/') || filePath.includes('lib/')) {
    return 'Consider splitting utility functions into separate modules based on functionality.';
  }

  if (filePath.includes('store/')) {
    return 'Consider splitting large stores into smaller, domain-specific stores.';
  }

  if (ext === '.ts' || ext === '.js') {
    return 'Consider breaking this module into smaller, focused modules with clear responsibilities.';
  }

  return 'Consider refactoring this file into smaller, more manageable pieces following the Single Responsibility Principle.';
}

/**
 * Main validation function
 */
function validateFileSizes() {
  console.log(`📏 Validating file sizes (max ${MAX_LINES} lines)...`);

  // Files to check
  const patterns = [
    'src/**/*.{ts,tsx,js,jsx}',
    'app/**/*.{ts,tsx,js,jsx}',
    'components/**/*.{ts,tsx,js,jsx}',
    'pages/**/*.{ts,tsx,js,jsx}',
    'lib/**/*.{ts,tsx,js,jsx}',
    'utils/**/*.{ts,tsx,js,jsx}',
  ];

  let allViolations = [];
  let totalFiles = 0;

  patterns.forEach((pattern) => {
    const files = glob.sync(pattern, { ignore: EXCLUDED_PATTERNS });

    files.forEach((file) => {
      totalFiles++;
      const violation = checkFileSize(file);
      if (violation) {
        allViolations.push(violation);
      }
    });
  });

  // Report results
  console.log(`📊 Checked ${totalFiles} files`);

  if (allViolations.length === 0) {
    console.log('✅ File size validation passed! All files are within the size limit.');
    return true;
  }

  console.log(
    `❌ File size validation failed! Found ${allViolations.length} files exceeding the limit:\n`,
  );

  // Sort violations by excess lines (worst first)
  allViolations.sort((a, b) => b.excess - a.excess);

  allViolations.forEach((violation, index) => {
    console.log(`${index + 1}. 📁 ${violation.file}`);
    console.log(`   📏 ${violation.lines} lines (${violation.excess} over limit)`);
    console.log(`   💡 ${violation.suggestion}\n`);
  });

  console.log('📖 File Size Guidelines:');
  console.log(`   • Maximum ${MAX_LINES} lines per file`);
  console.log('   • Break large files into smaller, focused modules');
  console.log('   • Follow Single Responsibility Principle');
  console.log('   • Extract reusable logic into separate files\n');

  return false;
}

// Run validation if called directly
if (require.main === module) {
  const success = validateFileSizes();
  process.exit(success ? 0 : 1);
}

module.exports = { validateFileSizes, MAX_LINES };
