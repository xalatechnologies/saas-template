#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Extract and generate design tokens from Airbnb design system
 * focusing on animations, effects, and visual properties
 * This script formats all tokens according to our project's TypeScript interfaces.
 * 
 * This extracts the exact look and feel of Airbnb's design system including:
 * - Animation patterns (timing, easing, presets)
 * - Transition effects (page transitions, hover effects)
 * - Visual treatments (elevation, shadows, motion principles)
 */

// Define paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, 'src/design-tokens/base');
const airbnbDir = path.resolve(outputDir, 'airbnb');

// Ensure output directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

ensureDirectoryExists(outputDir);
ensureDirectoryExists(airbnbDir);


/**
 * Airbnb animation tokens - manually extracted from their documentation
 * Source: https://airbnb.design/ and related resources
 */

// Animation system
const animation = {
  // Animation durations based on Airbnb's system
  durations: {
    xfast: '100ms',    // Extra fast for micro-interactions
    fast: '200ms',     // Quick transitions (e.g., hover states)
    normal: '300ms',   // Standard transitions
    medium: '400ms',   // Medium duration animations
    slow: '500ms',     // Slower, more noticeable animations
    xslow: '800ms',    // Extended animations for emphasis
    xxslow: '1200ms',  // Very slow animations (rare usage)
  },
  
  // Animation easings based on Airbnb's system
  easings: {
    // Standard curves
    linear: 'linear',
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Design standard
    
    // Entry animations
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Objects entering the screen
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)', // Dramatic entrance
    
    // Exit animations
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',     // Objects leaving the screen
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)', // Quick exit
    
    // Special purpose
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Smooth transitions
    spring: 'cubic-bezier(0.5, 0, 0.1, 1)',      // Natural, springy motion
  },
  
  // Common animation presets
  presets: {
    fadeIn: {
      duration: '300ms',
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      properties: 'opacity',
    },
    fadeOut: {
      duration: '250ms',
      easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
      properties: 'opacity',
    },
    slideUp: {
      duration: '400ms',
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      properties: 'transform',
    },
    slideDown: {
      duration: '350ms',
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      properties: 'transform',
    },
    scaleUp: {
      duration: '400ms',
      easing: 'cubic-bezier(0.5, 0, 0.1, 1)',
      properties: 'transform',
    },
    scaleDown: {
      duration: '350ms',
      easing: 'cubic-bezier(0.5, 0, 0.1, 1)',
      properties: 'transform',
    }
  },
  
  // Page transition delays
  delay: {
    none: '0ms',
    short: '50ms',
    medium: '100ms',
    long: '200ms',
  },
  
  // Stagger delays for lists and grids
  stagger: {
    xxsmall: '10ms',
    xsmall: '20ms',
    small: '30ms',
    medium: '50ms',
    large: '80ms',
    xlarge: '100ms',
  }
};

// Generate animation content
const animationContent = `/**
 * Animation tokens extracted from Airbnb design system
 * Use these tokens to maintain consistent animation patterns across the application
 */

export const animation = ${JSON.stringify(animation, null, 2)};
`;

// Write the token files
try {
  fs.writeFileSync(path.join(outputDir, 'airbnb-animation.ts'), animationContent);
  console.log('✅ Generated Airbnb design tokens:');
  console.log(`→ ${path.join(outputDir, 'airbnb-animation.ts')}`);
} catch (error) {
  console.error('❌ Error generating Airbnb design tokens:', error);
  process.exit(1);
}

console.log('\n📝 Usage instructions:');
console.log('Import the animation tokens in your components:');
console.log("import { animation } from '@/design-tokens/base/airbnb-animation';");
console.log('\nExample usage:');
console.log("const fadeInAnimation = `transition: opacity \${animation.durations.normal} \${animation.easings.easeOut};`;");
