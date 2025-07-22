# 🧠 Smart Agent System

[![npm version](https://img.shields.io/npm/v/@saas-template/smart-agent)](https://github.com/your-username/saas-template/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

An intelligent development assistant that learns from your project history, maintains conversation context, and provides personalized guidance across AI-powered development tools (Cursor, Claude, Windsurf, Replit, etc.).

## ✨ Key Features

- 🎯 **Context Engineering**: Multi-layered context awareness (project, session, conversation, semantic, temporal)
- 🧠 **Memory Management**: Human-like memory with working, episodic, semantic, and procedural memory types
- 📚 **Project History Learning**: Learns from `.cursor-updates` files to understand project evolution
- 💬 **Conversation Intelligence**: Maintains mood, preferences, and conversation flow
- 🚀 **Smart Prompt Generation**: Creates context-aware, personalized responses
- 🔄 **Continuous Learning**: Improves over time through interaction feedback
- 🛠️ **Multi-Platform**: Works with Cursor, Claude, Windsurf, and other AI tools
- 📦 **Standalone**: Can be used as an independent package in any project

## 📦 Installation

### From GitHub Packages (Recommended)

```bash
# Install from GitHub packages
npm install @saas-template/smart-agent

# Or with yarn
yarn add @saas-template/smart-agent

# Or with pnpm
pnpm add @saas-template/smart-agent
```

### Authentication for GitHub Packages

Create a `.npmrc` file in your project root:

```ini
@saas-template:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/saas-template.git

# Navigate to smart-agent package
cd saas-template/src/packages/smart-agent

# Install dependencies
npm install

# Build the package
npm run build
```

## 🚀 Quick Start

### 1. Initialize the Smart Agent

```typescript
import { initializeSmartAgent } from '@saas-template/smart-agent';

// Initialize the system (loads project history, memory, etc.)
await initializeSmartAgent();
```

### 2. Generate Enhanced Prompts

```typescript
import { generatePrompt } from '@saas-template/smart-agent';

// Generate a context-aware prompt for Cursor
const prompt = await generatePrompt(
  'Create a user dashboard component',
  'cursor',
  { 
    component: 'UserDashboard',
    targetDirectory: 'src/components/dashboard/',
    task: 'create_component'
  }
);

// Use the enhanced prompt with your AI tool
console.log(prompt);
```

### 3. Validate Code Against Standards

```typescript
import { validateCode } from '@saas-template/smart-agent';

const componentCode = `
export const UserCard = ({ user }: { user: User }): JSX.Element => {
  return <Card>{user.name}</Card>;
};
`;

const validation = await validateCode(componentCode);
if (!validation.valid) {
  console.log('Issues found:', validation.errors);
}
```

### 4. Learn from Interactions

```typescript
import { learnFromInteraction } from '@saas-template/smart-agent';

// Provide feedback to improve future responses
await learnFromInteraction(true, 'The component worked perfectly!');
await learnFromInteraction(false, 'The styling needs improvement');
```

## 🎯 Advanced Usage

### Context-Aware Development Workflow

```typescript
import { 
  generatePrompt, 
  learnFromInteraction, 
  getMemoryStats,
  getConversationSummary 
} from '@saas-template/smart-agent';

async function developFeature() {
  // 1. Generate initial prompt with context
  const prompt = await generatePrompt(
    'Implement user authentication with OAuth',
    'claude',
    { 
      targetDirectory: 'src/auth/',
      task: 'add_feature',
      priority: 'high'
    }
  );

  // 2. Use prompt with AI tool (implement feature)
  const implementation = await callAITool(prompt);

  // 3. Validate the result
  const validation = await validateCode(implementation);

  // 4. Learn from the outcome
  await learnFromInteraction(validation.valid, validation.valid ? 
    'Implementation successful' : 
    `Issues: ${validation.errors.join(', ')}`
  );

  // 5. Check memory usage
  const memoryStats = getMemoryStats();
  console.log(`Memory: ${memoryStats.workingMemoryUsage}% used`);
}
```

### Multi-Platform Integration

#### Cursor IDE

```typescript
// .cursor/rules integration
import { generatePrompt } from '@saas-template/smart-agent';

const cursorPrompt = await generatePrompt(
  'Fix the TypeScript errors in UserService',
  'cursor',
  { 
    task: 'fix_bug',
    component: 'UserService',
    targetFile: 'src/services/user.service.ts'
  }
);
```

#### Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { generatePrompt } from '@saas-template/smart-agent';

const anthropic = new Anthropic();

const prompt = await generatePrompt(
  'Refactor the payment processing logic',
  'claude',
  { task: 'refactor', component: 'PaymentProcessor' }
);

const response = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 4000
});
```

#### Generic AI Tool

```typescript
async function useWithAnyAI(userPrompt: string) {
  const enhancedPrompt = await generatePrompt(userPrompt, 'generic');
  
  // Use with any AI tool
  const result = await yourAITool.complete(enhancedPrompt);
  
  // Learn from the result
  await learnFromInteraction(result.success, result.feedback);
}
```

## 🛠️ CLI Usage

The Smart Agent includes a command-line interface:

```bash
# Initialize project integration
smart-agent setup

# Generate enhanced prompt
smart-agent prompt cursor "Create a booking system"

# Create and manage tasks
smart-agent task create
smart-agent task list
smart-agent task execute <task-id>

# Validate code
smart-agent validate src/components/MyComponent.tsx

# Check system status
smart-agent status
```

## 📁 Project Structure Integration

The Smart Agent learns from your project structure and history:

```
your-project/
├── .cursor-updates          # Project history (auto-read)
├── .cursorrules            # Cursor rules (auto-read) 
├── CLAUDE.md               # Claude instructions (auto-read)
├── .smart-agent/           # Smart Agent data
│   ├── memory/            # Persistent memory files
│   ├── context/           # Context cache
│   └── config.json        # Local configuration
└── src/
    └── your-code/
```

## ⚙️ Configuration

### Global Configuration

Create `.smart-agent/config.json` in your project:

```json
{
  "persona": "Senior TypeScript Developer",
  "communicationStyle": "professional",
  "codeStyle": {
    "commentsLevel": "moderate",
    "examplePreference": "comprehensive"
  },
  "platforms": {
    "cursor": { "enabled": true, "rulesFile": ".cursorrules" },
    "claude": { "enabled": true, "rulesFile": "CLAUDE.md" }
  },
  "memory": {
    "maxWorkingMemory": 7,
    "forgetThreshold": 0.3,
    "importanceBoost": 1.2
  }
}
```

### Environment Variables

```bash
# Memory persistence
SMART_AGENT_MEMORY_DIR=.smart-agent/memory

# Context cache
SMART_AGENT_CONTEXT_CACHE=.smart-agent/context

# Debug mode
SMART_AGENT_DEBUG=true

# Platform preferences
SMART_AGENT_DEFAULT_PLATFORM=cursor
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific functionality
npm run test:memory
npm run test:context
npm run test:integration

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📊 Memory & Context System

### Memory Types

- **Working Memory**: Active information (7±2 items), LRU eviction
- **Episodic Memory**: Sessions, interactions, outcomes
- **Semantic Memory**: Concepts, patterns, relationships  
- **Procedural Memory**: Workflows, shortcuts, learned processes

### Context Layers

- **Project Context**: Codebase structure, standards, history
- **Session Context**: Current session goals, progress
- **Conversation Context**: Active discussion, established facts
- **Semantic Context**: Related concepts, similar past work
- **Temporal Context**: Recent changes, current focus

### Memory Statistics

```typescript
import { getMemoryStats } from '@saas-template/smart-agent';

const stats = getMemoryStats();
console.log({
  workingMemoryUsage: `${stats.workingMemoryUsage}%`,
  totalMemories: stats.totalMemories,
  oldestMemory: stats.oldestMemoryAge,
  learningRate: stats.learningEfficiency
});
```

## 🔄 Integration Examples

### Webhook Integration

```typescript
// Express.js webhook for continuous learning
app.post('/smart-agent/feedback', async (req, res) => {
  const { success, feedback, context } = req.body;
  await learnFromInteraction(success, feedback, context);
  res.json({ status: 'learned' });
});
```

### GitHub Actions Integration

```yaml
# .github/workflows/smart-agent.yml
name: Smart Agent Learning
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  learn:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Learn from changes
        run: |
          npm install @saas-template/smart-agent
          npx smart-agent learn-from-diff
```

### VS Code Extension

```typescript
// VS Code extension integration
import * as vscode from 'vscode';
import { generatePrompt, validateCode } from '@saas-template/smart-agent';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    'smart-agent.enhancePrompt',
    async () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.selection;
      const text = editor?.document.getText(selection);
      
      if (text) {
        const enhancedPrompt = await generatePrompt(text, 'vscode');
        // Show enhanced prompt to user
      }
    }
  );
  
  context.subscriptions.push(command);
}
```

## 📈 Performance & Optimization

### Token Optimization

The Smart Agent optimizes context window usage:

- **Smart Context Pruning**: Removes irrelevant context
- **Memory Prioritization**: Uses importance scoring
- **Conversation Compression**: Summarizes long conversations
- **Lazy Loading**: Loads context on-demand

### Memory Efficiency

- **Forgetting Curve**: Implements Ebbinghaus forgetting curve
- **Memory Consolidation**: Merges similar memories  
- **Garbage Collection**: Removes low-importance memories
- **Persistent Storage**: Saves memory between sessions

## 🤝 Contributing

### Development Setup

```bash
# Clone and setup
git clone https://github.com/your-username/saas-template.git
cd saas-template/src/packages/smart-agent

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Extending the System

#### Add New Memory Type

```typescript
// memory/types.ts
export interface CustomMemory extends MemoryItem {
  customField: string;
  specialLogic: () => void;
}

// memory/memory-manager.ts
export class MemoryManager {
  addCustomMemory(memory: CustomMemory) {
    // Implementation
  }
}
```

#### Add New Context Layer

```typescript
// context/types.ts
export interface CustomContext {
  customData: string;
  contextSpecificInfo: any;
}

// context/context-engine.ts  
export class ContextEngine {
  buildCustomContext(): CustomContext {
    // Implementation
  }
}
```

### Publishing

```bash
# Build and publish to GitHub packages
npm run build
npm publish
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by human cognitive architecture
- Built for modern AI-assisted development
- Designed for continuous learning and adaptation

## 📞 Support

- 📧 Email: support@saas-template.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/saas-template/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/saas-template/discussions)
- 📖 Wiki: [GitHub Wiki](https://github.com/your-username/saas-template/wiki)

---

**Smart Agent System** - Making AI assistance truly intelligent through context, memory, and continuous learning.