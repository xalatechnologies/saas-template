/* eslint-disable no-console */
/**
 * Smart Agent Usage Example
 * Shows how to use the Smart Agent system in your workflow
 */

import { 
  generatePrompt, 
  validateCode, 
  taskManager,
  initializeSmartAgent 
} from '../index';

async function example() {
  // Initialize the Smart Agent (loads rules)
  await initializeSmartAgent();

  // Example 1: Generate enhanced prompt for Cursor
  console.log('=== Example 1: Generate Cursor Prompt ===\n');
  
  const cursorPrompt = await generatePrompt(
    "Create a BookingCard component that displays booking title, date, location, and status",
    'cursor',
    {
      component: 'BookingCard',
      targetDirectory: 'src/components/ui/',
      additionalRules: [
        'Must support loading and error states',
        'Include action buttons for edit and delete',
        'Show user avatar and name'
      ]
    }
  );
  
  console.log('Generated Cursor Prompt:');
  console.log('-'.repeat(80));
  console.log(cursorPrompt.substring(0, 500) + '...\n');

  // Example 2: Create and execute a task
  console.log('=== Example 2: Task Management ===\n');
  
  const task = taskManager.createTask(
    'create_component',
    'Create BookingCard Component',
    'Create a professional booking card component with all required features',
    {
      component: 'BookingCard',
      targetDirectory: 'src/components/ui/',
      requirements: [
        'Display booking information',
        'Support all themes',
        'WCAG AAA compliant',
        'Fully localized'
      ]
    }
  );
  
  console.log(`Task created: ${task.id}`);
  console.log(`Title: ${task.title}`);
  console.log(`Type: ${task.type}\n`);

  // Example 3: Validate code
  console.log('=== Example 3: Code Validation ===\n');
  
  const sampleCode = `
import React from 'react';

interface BookingCardProps {
  title: string;
  date: Date;
  location: string;
}

export const BookingCard = ({ title, date, location }: BookingCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <span>{date.toLocaleDateString()}</span>
    </div>
  );
};
  `;
  
  const validation = await validateCode(sampleCode);
  
  console.log(`Validation Result: ${validation.valid ? '❌ FAILED' : '✅ PASSED'}`);
  console.log('\nErrors found:');
  validation.errors.forEach(error => console.log(`  - ${error}`));
  console.log('\nWarnings:');
  validation.warnings.forEach(warning => console.log(`  - ${warning}`));

  // Example 4: Correct code following standards
  console.log('\n=== Example 4: Corrected Code ===\n');
  
  const correctCode = `
import React from 'react';
import { FlexLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import { useUI } from '@/hooks';

interface BookingCardProps {
  readonly title: string;
  readonly date: Date;
  readonly location: string;
}

export const BookingCard = ({ title, date, location }: BookingCardProps): JSX.Element => {
  const { t } = useUI();
  
  return (
    <Card className="p-8 rounded-xl shadow-lg hover:shadow-xl">
      <FlexLayout direction="column" gap="lg">
        <h3 className="text-xl font-semibold">{title}</h3>
        <FlexLayout direction="row" justify="between" align="center">
          <p className="text-base text-muted-foreground">{location}</p>
          <span className="text-sm text-muted">
            {date.toLocaleDateString(t('locale'))}
          </span>
        </FlexLayout>
      </FlexLayout>
    </Card>
  );
};
  `;
  
  const correctValidation = await validateCode(correctCode);
  console.log(`Corrected Code Validation: ${correctValidation.valid ? '✅ PASSED' : '❌ FAILED'}`);
  
  // Example 5: Setup Cursor integration
  console.log('\n=== Example 5: Cursor Integration ===\n');
  
  console.log('To set up Cursor integration, run:');
  console.log('  npm run smart-agent:setup');
  console.log('\nThis will create:');
  console.log('  - .cursor.routes.json');
  console.log('  - .cursor.meta');
  console.log('  - Sync .cursorrules with CLAUDE.md');
}

// Run the example
if (require.main === module) {
  example().catch(console.error);
}