#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Smart Agent CLI
 * Command-line interface for the Smart Agent system
 */

import { enhancedPromptInjector } from '../core/enhanced-prompt-injector';
import { taskManager } from '../tasks/task-manager';
import { cursorIntegration } from '../integrations/cursor-integration';
import { PromptContext } from '../core/prompt-injector';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🤖 Smart Agent CLI v1.0.0');
  console.log('========================\n');

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'setup':
      await setupCommand();
      break;
    case 'prompt':
      await promptCommand(args.slice(1));
      break;
    case 'task':
      await taskCommand(args.slice(1));
      break;
    case 'validate':
      await validateCommand(args.slice(1));
      break;
    case 'help':
    default:
      showHelp();
  }

  rl.close();
}

async function setupCommand() {
  console.log('Setting up Smart Agent integration...\n');
  
  try {
    await cursorIntegration.setup();
    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

async function promptCommand(args: string[]) {
  const platform = args[0] as PromptContext['platform'] || 'cursor';
  const userPrompt = args.slice(1).join(' ') || await prompt('Enter your prompt: ');

  console.log(`\nGenerating ${platform} prompt...\n`);

  try {
    await enhancedPromptInjector.initialize();
    
    const context: PromptContext = { platform };
    const enrichedPrompt = await enhancedPromptInjector.injectEnhancedPrompt(userPrompt, context);
    
    console.log('=' .repeat(80));
    console.log(enrichedPrompt);
    console.log('=' .repeat(80));
  } catch (error) {
    console.error('❌ Error generating prompt:', error);
  }
}

async function taskCommand(args: string[]) {
  const subcommand = args[0];

  switch (subcommand) {
    case 'create':
      await createTask();
      break;
    case 'list':
      listTasks();
      break;
    case 'execute':
      await executeTask(args[1]);
      break;
    default:
      console.log('Usage: smart-agent task [create|list|execute <id>]');
  }
}

async function createTask() {
  console.log('\nCreate New Task');
  console.log('===============\n');

  const typeInput = await prompt('Task type (create_component|fix_bug|refactor|add_feature|update_styles|migrate_layout): ');
  const type = typeInput as 'create_component' | 'fix_bug' | 'refactor' | 'add_feature' | 'update_styles' | 'migrate_layout';
  const title = await prompt('Task title: ');
  const description = await prompt('Task description: ');
  const component = await prompt('Component name (optional): ');
  const feature = await prompt('Feature name (optional): ');
  const targetDirectory = await prompt('Target directory (optional): ');

  const task = taskManager.createTask(
    type,
    title,
    description,
    {
      component: component || undefined,
      feature: feature || undefined,
      targetDirectory: targetDirectory || undefined
    }
  );

  console.log(`\n✅ Task created: ${task.id}`);
  console.log(`Title: ${task.title}`);
  console.log(`Type: ${task.type}`);
}

function listTasks() {
  const tasks = taskManager.getAllTasks();
  
  if (tasks.length === 0) {
    console.log('\nNo tasks found.');
    return;
  }

  console.log('\nTasks:');
  console.log('======\n');

  for (const task of tasks) {
    console.log(`ID: ${task.id}`);
    console.log(`Title: ${task.title}`);
    console.log(`Type: ${task.type}`);
    console.log(`Status: ${task.status}`);
    console.log('---');
  }
}

async function executeTask(taskId: string) {
  if (!taskId) {
    console.error('Please provide a task ID');
    return;
  }

  const task = taskManager.getTask(taskId);
  if (!task) {
    console.error(`Task ${taskId} not found`);
    return;
  }

  console.log(`\nExecuting task: ${task.title}`);
  console.log('Platform: cursor\n');

  try {
    const prompt = taskManager.generateTaskPrompt(taskId);
    
    console.log('Generated Prompt:');
    console.log('=' .repeat(80));
    console.log(prompt);
    console.log('=' .repeat(80));
    
    // In a real implementation, this would execute through the platform
    const result = await taskManager.executeTask(taskId, 'cursor', async () => {
      console.log('\n[Would execute on Cursor with this prompt]');
      return 'Task executed successfully';
    });

    console.log(`\n${result.success ? '✅' : '❌'} ${result.message}`);
    if (result.errors) {
      console.log('Errors:', result.errors.join(', '));
    }
    if (result.warnings) {
      console.log('Warnings:', result.warnings.join(', '));
    }
  } catch (error) {
    console.error('❌ Task execution failed:', error);
  }
}

async function validateCommand(args: string[]) {
  const filePath = args[0];
  
  if (!filePath) {
    console.error('Please provide a file path to validate');
    return;
  }

  console.log(`\nValidating: ${filePath}\n`);

  try {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    
    const validation = await cursorIntegration.validateFile(filePath, content);
    
    console.log(`Validation: ${validation.valid ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (validation.errors.length > 0) {
      console.log('\nErrors:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (validation.suggestions.length > 0) {
      console.log('\nSuggestions:');
      validation.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
    }
  } catch (error) {
    console.error('❌ Validation failed:', error);
  }
}

function showHelp() {
  console.log(`
Smart Agent CLI - Enforce consistent coding standards across AI tools

Usage: smart-agent <command> [options]

Commands:
  setup                     Set up Smart Agent integration files
  prompt <platform> [text]  Generate enriched prompt for platform
  task create              Create a new task
  task list                List all tasks
  task execute <id>        Execute a task
  validate <file>          Validate file against project rules
  help                     Show this help message

Platforms:
  cursor    Cursor IDE
  claude    Claude AI
  windsurf  Windsurf
  replit    Replit
  vscode    VS Code

Examples:
  smart-agent setup
  smart-agent prompt cursor "Create a new BookingCard component"
  smart-agent task create
  smart-agent validate src/components/BookingCard.tsx
`);
}

// Run CLI
main().catch(console.error);