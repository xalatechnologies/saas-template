# CLAUDE.md - Task Management Application

This document provides specific instructions for AI assistants working on this comprehensive, production-ready task management application built with Next.js 14.

## Project Overview

This is a sophisticated task management web application featuring:
- **Norwegian compliance standards** and validation
- **Multi-language support** (Norwegian Bokmål primary, English, French, Arabic)
- **WCAG AAA accessibility** compliance
- **Advanced theming system** for multiple sectors
- **Internal package architecture** for scalability
- **GridLayout system** for consistent layouts
- **Design token system** for professional styling

## Core Development Rules

### 1. TypeScript Requirements
- **STRICT TypeScript only** - no `any` types permitted
- **Explicit return types** for all components: `: JSX.Element`
- **Readonly interfaces** for all props
- **Proper error handling** with typed errors

```typescript
interface ComponentProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly variant?: 'default' | 'primary';
}

export const Component = ({ children, title, variant = 'default' }: ComponentProps): JSX.Element => {
  // Implementation
};
```

### 2. Component Structure
- **NO raw HTML elements** in pages - use UI components exclusively
- **Component organization** by feature in `/src/components/`
- **Pure presentational components** in `/ui` directory
- **Business logic components** in feature directories

### 3. CRITICAL: Layout System Compliance

**MANDATORY GridLayout System Usage** - ALL layouts MUST use GridLayout system components exclusively.

#### ❌ FORBIDDEN Layout Patterns
```typescript
// NEVER use these patterns
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">
<div className="flex-col space-y-4">
```

#### ✅ REQUIRED Layout Patterns
```typescript
// ALWAYS use GridLayout system components
<FlexLayout direction="row" align="center" justify="between">
<GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
<FlexLayout direction="column" gap="lg">
<SplitLayout split="60/40" direction="horizontal">
```

#### Layout Component Usage
```typescript
import { GridLayout, FlexLayout, SplitLayout, Container } from '@/components/layout';

// FlexLayout for flex-based layouts
<FlexLayout direction="row" align="center" justify="between" gap="lg">
  {/* Content */}
</FlexLayout>

// GridLayout for responsive grids
<GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
  {/* Grid items */}
</GridLayout>

// SplitLayout for two-panel layouts
<SplitLayout split="50/50" direction="horizontal">
  <div>Left panel</div>
  <div>Right panel</div>
</SplitLayout>

// Container for consistent spacing
<Container size="lg" centered>
  {/* Content */}
</Container>
```

### 4. CRITICAL: Design Token System Compliance

**MANDATORY Design Token Usage** - ALL components MUST use design tokens exclusively. NO hardcoded styling permitted.

#### ❌ FORBIDDEN Styling Patterns
```typescript
// NEVER use hardcoded values
className="p-4 mb-6 text-blue-600 bg-gray-100 h-12 w-64"
className="space-x-2 gap-4 border-green-200"
style={{ padding: '16px', margin: '24px' }}
```

#### ✅ REQUIRED Styling Patterns
```typescript
// ALWAYS use design system classes
className="p-8 mb-12 text-primary bg-muted h-16 w-80"
className="space-x-4 gap-6 border-border text-destructive"
// Use CSS variables for custom styling
style={{ padding: 'var(--spacing-lg)' }}
```

#### Professional Sizing Standards
- **Button height minimum**: `h-12` (48px), **preferred**: `h-16` (64px)
- **Input height minimum**: `h-16` (64px) 
- **Card padding**: `p-8` (32px) minimum
- **Section spacing**: `space-y-12` (48px) minimum
- **Border radius**: `rounded-xl` or `rounded-2xl` (never smaller)
- **Shadows**: `shadow-lg`, `shadow-xl`, `shadow-2xl` only

### 5. State Management (Zustand)
```typescript
interface StoreState {
  readonly items: Item[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
}

export const useStore = create<StoreState>()(
  immer((set, get) => ({
    // Implementation with Immer for immutable updates
  }))
);
```

### 6. Internationalization
- **Primary language**: Norwegian Bokmål (no)
- **Translation keys**: Use nested structure with context
- **RTL support**: Required for Arabic
- **NO hardcoded strings** - always use `t('key')`

```typescript
const { t } = useUI();
// Use translation keys
<Button>{t('tasks.create')}</Button>
```

### 7. Accessibility (WCAG AAA)
- **All interactive elements** must be keyboard accessible
- **ARIA labels and roles** for screen readers
- **Focus management** and trapping in modals
- **High contrast mode** support
- **Skip links** for navigation

```typescript
<Button
  aria-label={t('common.close')}
  onClick={handleClose}
  className="h-16 px-8 rounded-xl"
>
  <X className="h-5 w-5" />
</Button>
```

### 8. File Organization
```
src/
├── components/
│   ├── ui/                 # Pure UI components
│   ├── layout/            # GridLayout system components
│   ├── tasks/             # Task-specific components
│   ├── dashboard/         # Dashboard components
│   └── accessibility/     # Accessibility components
├── packages/
│   ├── types/             # TypeScript types
│   ├── store/            # Zustand stores
│   ├── design-tokens/    # Design system
│   └── localization/     # i18n
```

### 9. Import Organization
```typescript
// 1. React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { create } from 'zustand';

// 3. Internal packages (alphabetical)
import { Button, Card } from '@/components';
import { GridLayout, FlexLayout } from '@/components/layout';
import { useAuth } from '@/hooks';
import { Task } from '@/types';

// 4. Relative imports
import { TaskCard } from './TaskCard';
```

## Development Workflow

### Adding New Components
1. **Create types** in `@/types` if needed
2. **Add store** in `@/store` for state management
3. **Create UI component** in `@/components/ui` (pure, no business logic)
4. **Build feature component** in appropriate directory
5. **Add translations** to all language files
6. **Ensure accessibility** compliance
7. **Test with all themes**

### Layout System Migration
When updating components with hardcoded layouts:
1. **Identify layout patterns**: Find divs with flex/grid classes
2. **Replace with GridLayout components**: Use FlexLayout, GridLayout, SplitLayout
3. **Update responsive behavior**: Use responsive props instead of Tailwind classes
4. **Test all breakpoints**: Ensure responsive design works

### Design Token Migration
When updating components with hardcoded styling:
1. **Identify hardcoded values**: Colors, spacing, dimensions
2. **Map to design tokens**: Use semantic color classes, professional sizing
3. **Enhance professionally**: Upgrade to larger, modern sizing standards
4. **Test themes**: Verify compatibility with all sector themes

## Code Quality Checklist

Before submitting any component:
- [ ] **TypeScript strict** compliance (no `any` types)
- [ ] **GridLayout system** usage only (no hardcoded div layouts)
- [ ] **Design token** compliance (no hardcoded styling)
- [ ] **Professional sizing** standards (h-16+ for inputs/buttons)
- [ ] **Accessibility** requirements met (WCAG AAA)
- [ ] **Internationalization** support (translation keys)
- [ ] **Norwegian compliance** features if applicable
- [ ] **Theme compatibility** across all variants
- [ ] **Proper imports** and file organization
- [ ] **Component structure** follows conventions

## Common Patterns

### Form Components
```typescript
export const TaskForm = ({ onSubmit, initialData }: TaskFormProps): JSX.Element => {
  const { t } = useUI();
  const { errors, handleSubmit } = useFormValidation({
    schema: taskSchema,
    onSubmit,
  });

  return (
    <Container size="md">
      <FlexLayout direction="column" gap="lg">
        <Input
          label={t('tasks.title')}
          error={errors.title}
          className="h-16 w-full"
        />
        <Button
          type="submit"
          className="h-16 px-8"
        >
          {t('common.save')}
        </Button>
      </FlexLayout>
    </Container>
  );
};
```

### Grid Layouts
```typescript
export const TaskGrid = ({ tasks }: TaskGridProps): JSX.Element => {
  return (
    <GridLayout 
      columns={{ mobile: 1, tablet: 2, desktop: 3 }} 
      gap="lg"
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </GridLayout>
  );
};
```

### Modal Components
```typescript
export const TaskModal = ({ isOpen, onClose }: TaskModalProps): JSX.Element => {
  const { t } = useUI();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-8">
        <FlexLayout direction="column" gap="lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {t('tasks.edit')}
            </DialogTitle>
          </DialogHeader>
          {/* Content */}
        </FlexLayout>
      </DialogContent>
    </Dialog>
  );
};
```

## Emergency Fixes

### Common Issues
1. **Layout not working**: Check if using GridLayout system components correctly
2. **Styling not applying**: Verify design token usage, check for hardcoded values
3. **Theme issues**: Ensure semantic color classes are used
4. **Type errors**: Add explicit types, remove any `any` usage
5. **Accessibility problems**: Check ARIA labels, keyboard navigation
6. **i18n missing**: Add translations to all supported languages

## CRITICAL REMINDERS

1. **GridLayout System**: NEVER use hardcoded div elements for layouts
2. **Design Tokens**: NEVER use hardcoded styling values
3. **Professional Sizing**: Minimum h-12 for buttons, h-16 preferred
4. **Accessibility First**: WCAG AAA compliance is mandatory
5. **TypeScript Strict**: No `any` types, explicit return types
6. **Norwegian Compliance**: Personal number validation, GDPR features
7. **Multi-language**: Always use translation keys
8. **Theme Compatibility**: Test with all sector themes

This application maintains high production standards. Every component must meet these requirements for consistency, accessibility, and maintainability.