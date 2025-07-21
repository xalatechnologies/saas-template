#!/usr/bin/env node
/**
 * Build Syntax Validation Script
 *
 * This script checks for syntax issues that might cause build failures:
 * - Validates JavaScript/TypeScript syntax
 * - Checks for mismatched parentheses, brackets, and braces
 * - Identifies metadata configuration issues in Next.js pages
 * - Detects conflicts between client/server components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Simple color functions since chalk v5+ is ESM-only
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`
};

// Configuration
const config = {
  // Directories to analyze
  directories: ['./app/**/*.tsx', './app/**/*.ts', './src/**/*.tsx', './src/**/*.ts'],
  // Files to skip
  excludeFiles: ['node_modules', '.next', 'out', 'coverage'],
};

/**
 * Check for JavaScript/TypeScript syntax errors using Node's parser
 */
function validateSyntax(filePath) {
  const tempFile = path.join(__dirname, '.temp-validate.js');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Write content to a temporary file
  fs.writeFileSync(tempFile, fileContent);

  try {
    // Use Node to check syntax (this will throw if there's a syntax error)
    execSync(`node --check ${tempFile}`, { stdio: 'pipe' });
    fs.unlinkSync(tempFile);
    return null;
  } catch (error) {
    fs.unlinkSync(tempFile);
    return error.message;
  }
}

/**
 * Check for common metadata conflicts in Next.js App Router
 */
function checkMetadataConflicts(content, filePath) {
  const issues = [];

  // Check for 'use client' + metadata conflicts
  const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
  const hasMetadataExport = content.includes('export const metadata');
  const hasGenerateMetadata = content.includes('export async function generateMetadata');

  if (hasUseClient && (hasMetadataExport || hasGenerateMetadata)) {
    issues.push(
      "File has both 'use client' directive and metadata exports - these are incompatible",
    );
  }

  return issues;
}

/**
 * Check for bracket mismatches that could cause syntax errors
 */
function checkBracketMatching(content) {
  const issues = [];
  const stack = [];
  const lines = content.split('\n');

  // Simple bracket matching check
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for commented lines
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      continue;
    }

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '(' || char === '[' || char === '{') {
        stack.push({ char, line: i + 1, col: j + 1 });
      } else if (char === ')' || char === ']' || char === '}') {
        const matchingChar = char === ')' ? '(' : char === ']' ? '[' : '{';

        if (stack.length === 0 || stack[stack.length - 1].char !== matchingChar) {
          issues.push(
            `Mismatched bracket at line ${i + 1}, column ${j + 1}: found '${char}' without matching '${matchingChar}'`,
          );
        } else {
          stack.pop();
        }
      }
    }
  }

  // Check for unclosed brackets
  stack.forEach((item) => {
    issues.push(`Unclosed bracket '${item.char}' at line ${item.line}, column ${item.col}`);
  });

  return issues;
}

/**
 * Validate that all imports are properly terminated
 */
function checkImportStatements(content) {
  const issues = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip comments
    if (line.startsWith('//') || line.startsWith('/*')) {
      continue;
    }

    // Check import statements
    if (
      line.startsWith('import ') &&
      !line.endsWith(';') &&
      !line.endsWith("'") &&
      !line.endsWith('"')
    ) {
      // Find next line that ends the import
      let j = i + 1;
      let found = false;

      while (j < lines.length && !found) {
        const nextLine = lines[j].trim();
        if (nextLine.endsWith(';') || nextLine.endsWith("'") || nextLine.endsWith('"')) {
          found = true;
        }
        j++;
      }

      if (!found) {
        issues.push(`Possibly unterminated import statement at line ${i + 1}`);
      }
    }
  }

  return issues;
}

/**
 * Main validation function
 */
function validateFiles() {
  const files = [];
  let totalIssues = 0;

  config.directories.forEach((pattern) => {
    const matches = glob.sync(pattern, { ignore: config.excludeFiles.map((ex) => `**/${ex}/**`) });
    files.push(...matches);
  });

  const uniqueFiles = [...new Set(files)];
  console.log(colors.blue(`\n🔍 Validating ${uniqueFiles.length} files for build issues...\n`));

  uniqueFiles.forEach((filePath) => {
    const absolutePath = path.resolve(filePath);

    try {
      const content = fs.readFileSync(absolutePath, 'utf8');

      // Check for syntax errors
      const syntaxError = validateSyntax(absolutePath);

      // Run other checks
      const metadataIssues = checkMetadataConflicts(content, filePath);
      const bracketIssues = checkBracketMatching(content);
      const importIssues = checkImportStatements(content);

      // Combine all issues
      const issues = [
        ...(syntaxError ? [`JavaScript syntax error: ${syntaxError}`] : []),
        ...metadataIssues,
        ...bracketIssues,
        ...importIssues,
      ];

      if (issues.length > 0) {
        totalIssues += issues.length;

        console.log(colors.yellow(`\n📁 ${filePath}`));
        issues.forEach((issue) => {
          console.log(colors.red(`  ❌ ${issue}`));
        });
      }
    } catch (error) {
      console.error(colors.red(`Error processing ${filePath}: ${error.message}`));
    }
  });

  return totalIssues === 0;
}

// Run validation and report results
const valid = validateFiles();

if (valid) {
  console.log(colors.green('\n✅ All files passed build syntax validation!\n'));
  process.exit(0);
} else {
  console.log(colors.red(`\n❌ Found syntax issues that might cause build failures\n`));
  console.log(colors.yellow('Fix these issues before running the production build'));
  process.exit(1);
}
