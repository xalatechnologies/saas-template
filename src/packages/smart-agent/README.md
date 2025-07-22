# Smart Agent System with Context Engineering & Memory

An intelligent development assistant that learns from your project history, maintains conversation context, and provides personalized guidance across AI-powered development tools (Cursor, Claude, Windsurf, Replit, etc.).

## Overview

The Smart Agent System is now enhanced with advanced context engineering and memory capabilities:

1. **Context Engineering** - Multi-layered context awareness (project, session, conversation, semantic, temporal)
2. **Memory Management** - Different memory types (working, episodic, semantic, procedural) with forgetting curve
3. **Project History** - Learns from `.cursor-updates` file to understand project evolution
4. **Conversation State** - Maintains conversation flow, mood, and user preferences
5. **Smart Prompts** - Generates context-aware, personalized responses based on history and memory
6. **Learning System** - Improves over time by learning from interactions

## Architecture

```
smart-agent/
├── config/              # Configuration and standards
├── context/            # Context engineering system
│   ├── context-engine.ts     # Multi-layered context management
│   ├── conversation-manager.ts # Conversation state tracking
│   └── types.ts              # Context type definitions
├── core/               # Prompt injection engines
│   ├── prompt-injector.ts    # Base prompt injection
│   ├── enhanced-prompt-injector.ts # Rule-based enhancement
│   └── smart-prompt-injector.ts    # Context-aware AI
├── memory/             # Memory management system
│   ├── memory-manager.ts     # Memory storage and retrieval
│   └── types.ts              # Memory type definitions
├── integrations/       # Platform integrations
│   ├── cursor-integration.ts # Cursor IDE integration
│   ├── rules-loader.ts       # Load .cursorrules/CLAUDE.md
│   └── project-history-loader.ts # Load project history
├── tasks/              # Task management
├── validators/         # Code validation
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

### 1. Context Engineering
- **Multi-layered Context**: Project, session, conversation, semantic, and temporal contexts
- **Smart Context Window**: Optimizes token usage by prioritizing relevant context
- **Dynamic Context Building**: Automatically gathers context based on current task

### 2. Memory System
- **Working Memory**: Limited capacity (7±2 items) with LRU eviction
- **Episodic Memory**: Remembers sessions, interactions, and outcomes
- **Semantic Memory**: Stores concepts, patterns, and relationships
- **Procedural Memory**: Learns workflows and shortcuts
- **Forgetting Curve**: Implements Ebbinghaus forgetting curve for realistic memory

### 3. Conversation Intelligence
- **Mood Detection**: Adapts tone based on conversation (collaborative, focused, debugging, etc.)
- **User Preferences**: Learns and remembers communication style preferences
- **Momentum Tracking**: Maintains conversation flow and engagement
- **Context Establishment**: Tracks what's been discussed to avoid repetition

### 4. Project History Awareness
- **Learns from .cursor-updates**: Understands project phases and evolution
- **Pattern Recognition**: Identifies successful patterns from history
- **Lesson Application**: Applies lessons learned to current tasks
- **Similar Task Detection**: Finds and references similar past implementations

### 5. Smart Prompt Generation
- **Personalized Greetings**: Context-aware introductions
- **Relevant History**: References similar past work
- **Memory Integration**: Includes relevant memories in prompts
- **Task-Specific Guidance**: Provides tips based on task type
- **Encouraging Tone**: Adapts encouragement to task complexity

## Best Practices

1. **Keep rules updated**: Regularly sync `.cursorrules` with `CLAUDE.md`
2. **Use tasks**: Track complex changes through the task system
3. **Validate often**: Run validation before committing
4. **Platform-specific**: Use platform-specific wrappers when available

## Example: Context-Aware Interaction

### Traditional Agent Response:
```
Create a component using TypeScript with strict types, use GridLayout system...
[Generic rules dump]
```

### Smart Agent Response:
```
Hey! I'm excited to work on this with you. I notice this is similar to what we 
did in Phase 5: Task Management Core Features. That implementation worked really well!

Based on our previous work, I remember:
- We created TaskCard using the Card component from our UI system
- The GridLayout system helped with responsive design
- We followed the validation patterns from TaskForm

In our conversation so far, we've established:
- You prefer to start with TypeScript interfaces
- You like comprehensive examples
- You're working on the booking feature

💡 Relevant lessons from our project:
- Component Purity: UI components without business logic
- Error Boundaries: Graceful error handling at component level

✨ Patterns that have worked well:
- Component organization by feature
- Strict TypeScript with explicit return types
- Design token system for consistent styling

🎯 Tips for this task:
- Start with TypeScript interfaces for props
- Use our existing UI components as building blocks
- Remember to add proper accessibility attributes

This should be straightforward. Let me know if you need any clarification!
```

## Advanced Usage

### Context-Aware Development
```typescript
import { generatePrompt, learnFromInteraction, getMemoryStats } from '@/packages/smart-agent';

// Generate context-aware prompt
const prompt = await generatePrompt(
  "Create a booking card component",
  'cursor',
  { 
    component: 'BookingCard',
    targetDirectory: 'src/components/ui/'
  }
);

// After implementation, provide feedback
await learnFromInteraction(true, "The component worked perfectly!");

// Check memory statistics
const stats = getMemoryStats();
console.log(`Memory usage: ${stats.workingMemoryUsage}%`);
console.log(`Learned patterns: ${stats.totalPatterns}`);
```

### Conversation Management
```typescript
import { conversationManager } from '@/packages/smart-agent';

// Start a conversation with preferences
conversationManager.startConversation({
  communicationStyle: 'casual',
  explanationDepth: 'detailed',
  codeStyle: {
    commentsLevel: 'detailed',
    examplePreference: 'comprehensive'
  }
});

// During conversation
conversationManager.establishContext('Using booking feature');
conversationManager.clarifyConcept('GridLayout system');

// Get summary
const summary = conversationManager.getConversationSummary();
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