#!/usr/bin/env node
/**
 * Localization Completeness Validation Script
 *
 * This script checks for consistency across localization files:
 * - Ensures all keys present in the primary locale exist in other locales
 * - Detects duplicate keys in localization files
 * - Checks for usage of localization keys in components that aren't defined
 * - Reports missing translations across all supported languages
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const config = {
  // Localization configuration
  localization: {
    primaryLocale: 'no',
    localesDir: './src/localization/locales',
    supportedLocales: ['no', 'en', 'fr', 'ar'],
  },
  // Files to scan for localization usage
  scanDirectories: ['./app/**/*.tsx', './src/components/**/*.tsx'],
};

/**
 * Extract all translation keys from a locale file
 */
function extractTranslationKeys(localeObj, prefix = '') {
  let keys = [];

  Object.entries(localeObj).forEach(([key, value]) => {
    const currentKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      keys = [...keys, ...extractTranslationKeys(value, currentKey)];
    } else {
      keys.push(currentKey);
    }
  });

  return keys;
}

/**
 * Find duplicate keys in an object (same key at the same level)
 */
function findDuplicateKeys(localeObj) {
  const duplicates = [];
  const findDuplicatesInObject = (obj, path = '') => {
    const keys = {};

    Object.keys(obj).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (keys[key]) {
        duplicates.push(currentPath);
      } else {
        keys[key] = true;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicatesInObject(obj[key], currentPath);
      }
    });
  };

  findDuplicatesInObject(localeObj);
  return duplicates;
}

/**
 * Extract all t() function calls from component files
 */
function extractUsedTranslationKeys(filesGlob) {
  const usedKeys = new Set();
  const files = glob.sync(filesGlob);

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    // Match t('key.path') or t("key.path") patterns
    const regex = /t\(\s*['"]([^'"]+)['"]\s*[,)]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  });

  return [...usedKeys];
}

/**
 * Main validation function
 */
function validateLocalization() {
  const { primaryLocale, localesDir, supportedLocales } = config.localization;
  const localePaths = {};
  const localeData = {};
  let hasErrors = false;

  // Load all locale files
  supportedLocales.forEach((locale) => {
    const localePath = path.join(localesDir, `${locale}.ts`);

    try {
      if (fs.existsSync(localePath)) {
        localePaths[locale] = localePath;

        // Read file and extract object
        const content = fs.readFileSync(localePath, 'utf8');
        // Extract the export statement using regex
        const exportMatch = content.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);

        if (exportMatch && exportMatch[1]) {
          try {
            // Evaluate the object (not secure, but works for our validation)
            // In production, use a proper parser
            localeData[locale] = eval(`(${exportMatch[1]})`);
          } catch (e) {
            console.error(chalk.red(`Error parsing locale file ${locale}.ts: ${e.message}`));
            hasErrors = true;
          }
        } else {
          console.error(chalk.red(`Invalid locale file format: ${locale}.ts`));
          hasErrors = true;
        }
      } else {
        console.error(chalk.red(`Missing locale file: ${locale}.ts`));
        hasErrors = true;
      }
    } catch (error) {
      console.error(chalk.red(`Error processing ${locale}.ts: ${error.message}`));
      hasErrors = true;
    }
  });

  if (hasErrors) {
    return false;
  }

  console.log(
    chalk.blue(`\n🔍 Validating localization for ${supportedLocales.length} languages...\n`),
  );

  // 1. Check for duplicate keys in each locale
  let duplicateKeysFound = false;

  Object.entries(localeData).forEach(([locale, data]) => {
    const duplicates = findDuplicateKeys(data);

    if (duplicates.length > 0) {
      console.log(chalk.yellow(`\n📁 ${locale}.ts has duplicate keys:`));
      duplicates.forEach((key) => {
        console.log(chalk.red(`  ❌ Duplicate key: ${key}`));
      });
      duplicateKeysFound = true;
    }
  });

  // 2. Compare keys across locales
  const primaryKeys = extractTranslationKeys(localeData[primaryLocale]);
  let missingKeysFound = false;

  supportedLocales
    .filter((locale) => locale !== primaryLocale)
    .forEach((locale) => {
      if (!localeData[locale]) return;

      const currentKeys = extractTranslationKeys(localeData[locale]);
      const missingKeys = primaryKeys.filter((key) => !currentKeys.includes(key));

      if (missingKeys.length > 0) {
        console.log(
          chalk.yellow(`\n📁 ${locale}.ts is missing keys that exist in ${primaryLocale}.ts:`),
        );
        missingKeys.forEach((key) => {
          console.log(chalk.red(`  ❌ Missing key: ${key}`));
        });
        missingKeysFound = true;
      }
    });

  // 3. Check for usage of undefined translation keys
  const usedKeys = [];
  config.scanDirectories.forEach((pattern) => {
    usedKeys.push(...extractUsedTranslationKeys(pattern));
  });

  const primaryKeysSet = new Set(primaryKeys);
  const undefinedKeys = usedKeys.filter((key) => !primaryKeysSet.has(key));

  if (undefinedKeys.length > 0) {
    console.log(chalk.yellow(`\n⚠️ Found usage of undefined translation keys:`));
    undefinedKeys.forEach((key) => {
      console.log(chalk.red(`  ❌ Undefined key in code: ${key}`));
    });
    hasErrors = true;
  }

  return !duplicateKeysFound && !missingKeysFound && !hasErrors;
}

// Run validation and report results
const valid = validateLocalization();

if (valid) {
  console.log(chalk.green('\n✅ All localization files are complete and consistent!\n'));
  process.exit(0);
} else {
  console.log(chalk.red(`\n❌ Found issues with localization files\n`));
  console.log(chalk.yellow('Fix these issues to ensure proper internationalization support'));
  process.exit(1);
}
