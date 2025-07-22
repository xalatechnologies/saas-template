# Smart Agent System

A comprehensive system for enforcing consistent coding standards across AI-powered development tools (Cursor, Claude, Windsurf, Replit, etc.).

## Overview

The Smart Agent System ensures that all AI-generated code follows your project's specific standards by:

1. **Loading existing rules** from `.cursorrules` and `CLAUDE.md`
2. **Enriching prompts** with project-specific context and standards
3. **Validating code** against forbidden/required patterns
4. **Managing tasks** with consistent execution across platforms

## Architecture

```
smart-agent/
├── config/              # Configuration and standards
├── core/               # Prompt injection engine
├── integrations/       # Platform-specific integrations
├── tasks/              # Task management system
├── validators/         # Code validation logic
└── cli/               # Command-line interface
```

## Usage

### 1. Setup Integration

```bash
# Install dependencies
npm install

# Set up Smart Agent files
npx ts-node src/packages/smart-agent/cli/smart-agent-cli.ts setup
```

This creates:
- `.cursor.routes.json` - Route configuration for Cursor
- `.cursor.meta` - Metadata for Smart Agent
- Syncs `.cursorrules` with `CLAUDE.md`

### 2. Generate Enhanced Prompts

```typescript
import { generatePrompt } from '@/packages/smart-agent';

// Generate platform-specific prompt
const cursorPrompt = await generatePrompt(
  "Create a BookingCard component",
  'cursor',
  { component: 'BookingCard' }
);

// Use in your AI tool
```

### 3. Create and Execute Tasks

```typescript
import { taskManager } from '@/packages/smart-agent';

// Create a task
const task = taskManager.createTask(
  'create_component',
  'Create BookingCard Component',
  'Create a card component for displaying booking information',
  {
    component: 'BookingCard',
    targetDirectory: 'src/components/ui/',
    requirements: [
      'Display booking title, date, and location',
      'Support loading and error states',
      'Include action buttons'
    ]
  }
);

// Execute through platform
const result = await taskManager.executeTask(
  task.id,
  'cursor',
  async (prompt) => {
    // Your platform execution logic
    return executedCode;
  }
);
```

### 4. Validate Code

```typescript
import { validateCode } from '@/packages/smart-agent';

const validation = await validateCode(componentCode);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## CLI Commands

```bash
# Setup integration files
npx smart-agent setup

# Generate enriched prompt
npx smart-agent prompt cursor "Create a new component"

# Create a new task
npx smart-agent task create

# List all tasks
npx smart-agent task list

# Execute a task
npx smart-agent task execute <task-id>

# Validate a file
npx smart-agent validate src/components/MyComponent.tsx
```

## Platform Integration

### Cursor

The system automatically uses `.cursorrules` when available. The enhanced prompt injector:
- Loads rules from `.cursorrules`
- Enriches prompts with project context
- Validates against forbidden/required patterns

### Claude

When using Claude SDK:

```typescript
import { generatePrompt } from '@/packages/smart-agent';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const prompt = await generatePrompt(
  "Implement user authentication",
  'claude'
);

const result = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  system: prompt,
  messages: [{ role: "user", content: prompt }],
  max_tokens: 4000,
});
```

### VS Code Extension

Create a VS Code extension that intercepts AI suggestions:

```typescript
vscode.workspace.onDidChangeTextDocument(async (event) => {
  const validation = await validateCode(event.document.getText());
  
  if (!validation.valid) {
    // Show warnings in VS Code
  }
});
```

## Configuration

### Smart Agent Config

Edit `src/packages/smart-agent/config/smart-agent.config.ts`:

```typescript
export const smartAgentConfig: SmartAgentConfig = {
  persona: "Your Project Assistant",
  codingStandards: [
    // Your standards
  ],
  forbiddenPatterns: [
    // Patterns to avoid
  ],
  requiredPatterns: [
    // Patterns to enforce
  ]
};
```

### Project Rules

The system automatically loads from:
1. `.cursorrules` (primary)
2. `CLAUDE.md` (fallback)

## Key Features

### 1. Rule Enforcement
- Loads existing `.cursorrules` and `CLAUDE.md`
- Merges forbidden/required patterns
- Validates code in real-time

### 2. Context-Aware Prompts
- Detects component/feature from file path
- Adds relevant project sections
- Includes validation checklists

### 3. Task Management
- Track development tasks
- Generate consistent prompts
- Score validation results

### 4. Platform Agnostic
- Works with any AI tool
- Consistent standards everywhere
- Easy integration

## Best Practices

1. **Keep rules updated**: Regularly sync `.cursorrules` with `CLAUDE.md`
2. **Use tasks**: Track complex changes through the task system
3. **Validate often**: Run validation before committing
4. **Platform-specific**: Use platform-specific wrappers when available

## Example Workflow

```bash
# 1. Create a task
npx smart-agent task create
# Choose: create_component
# Title: BookingCard Component
# Description: Card for displaying booking information

# 2. Generate prompt
npx smart-agent task execute <task-id>
# Copy the generated prompt

# 3. Use in Cursor/Claude/etc
# Paste the prompt and let AI generate code

# 4. Validate result
npx smart-agent validate src/components/BookingCard.tsx
# Fix any validation errors

# 5. Commit when validation passes
```

## Troubleshooting

### Rules not loading
- Check `.cursorrules` and `CLAUDE.md` exist
- Run `npx smart-agent setup` to sync files

### Validation too strict
- Review forbidden patterns in config
- Adjust rules for your project needs

### Platform not working
- Ensure platform-specific files are created
- Check integration documentation

## Contributing

To extend the Smart Agent:

1. Add new platforms in `integrations/`
2. Extend validation in `validators/`
3. Add new task types in `tasks/`
4. Update CLI commands in `cli/`

## License

This Smart Agent System is part of the Task Management Application project.