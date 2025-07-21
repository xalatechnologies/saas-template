# Task Management Web Application

A comprehensive, production-ready task management application built with Next.js 14, featuring Norwegian compliance standards, multi-language support, and a sophisticated internal package architecture.

## 🌟 Features

### Core Functionality

- **Complete Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Multi-language Support**: Norwegian Bokmål (primary), English, French, and Arabic with RTL support
- **Theme System**: Light and dark themes with design token system
- **User Authentication**: Secure login system with proper state management
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Norwegian Compliance**: Built-in support for Norwegian personal number validation and security classifications

### Technical Excellence

- **Type-Safe Architecture**: Strict TypeScript with explicit return types and no `any` usage
- **Modular Package System**: Internal packages for types, store, UI components, and utilities
- **State Management**: Zustand with Immer for immutable updates
- **Internationalization**: i18next with React integration
- **Design Token System**: Automated CSS variable generation from JSON tokens
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## 🏗️ Architecture

### Project Structure

```
task-management-web-app/
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # Application components
│   └── packages/              # Internal package modules
│       ├── types/             # Shared TypeScript types
│       ├── store/             # Zustand state management
│       ├── localization/      # i18n with Norwegian support
│       ├── utils/             # Shared utilities
│       ├── libs/              # API clients and services
│       ├── ui-system/         # Reusable UI components
│       ├── providers/         # React context providers
│       └── design-tokens/     # Design system tokens
├── public/tokens/             # Generated CSS variables
└── package.json
```

### Internal Packages

#### `@task-management/types`

Comprehensive TypeScript definitions for all application entities including tasks, users, authentication, and Norwegian-specific types.

#### `@task-management/store`

Zustand stores with Immer middleware for:

- Authentication state management
- Task CRUD operations with optimistic updates
- UI state (theme, language, sidebar, notifications)

#### `@task-management/ui-system`

Pure, presentational React components built with:

- Semantic HTML for accessibility
- Design token integration via CSS variables
- SSR-safe implementation
- No internal state hooks (useState, useEffect)

#### `@task-management/utils`

Utilities including:

- Norwegian personal number validation
- Form validation with Zod schemas
- Date formatting with locale support
- Error handling classes

#### `@task-management/localization`

Complete i18n setup with:

- Norwegian Bokmål (primary language)
- English, French, and Arabic translations
- RTL support for Arabic
- Context-aware translations

#### `@task-management/providers`

React context providers for:

- Theme management with system preference detection
- Language switching with RTL support
- React Query configuration
- Application-wide provider composition

#### `@task-management/design-tokens`

Token-based design system with:

- Global tokens (colors, spacing, typography)
- Semantic tokens (text, background, border colors)
- Theme variations (light/dark)
- Automated CSS variable generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-management-web-app
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Generate design tokens:

```bash
node src/packages/design-tokens/generate-tokens.js
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- Email: `demo@example.com`
- Password: `password123`

## 🛠️ Development

### Code Standards

- **TypeScript**: Strict mode with explicit return types
- **ESLint**: Next.js best practices with custom rules
- **Prettier**: Consistent code formatting
- **Import Organization**: Alphabetical with grouped imports

### Design System

The application uses a comprehensive design system with:

- 8px spacing grid
- Consistent color palette with semantic meanings
- Typography scale with proper line heights
- Component variants for different use cases

### State Management

Zustand stores provide:

- Type-safe state updates with Immer
- Optimistic UI updates
- Error handling and loading states
- Persistent storage for user preferences

### Internationalization

Multi-language support includes:

- Complete Norwegian translations (primary)
- Support for English, French, and Arabic
- RTL layout support for Arabic
- Date/time localization

## 🌍 Norwegian Compliance

### Features

- Personal number validation (Fødselsnummer)
- Postal code validation
- Security classification levels
- Norwegian government design inspiration
- GDPR-compliant data handling

### Validation Utilities

```typescript
import { validateNorwegianPersonalNumber } from '@task-management/utils';

const isValid = validateNorwegianPersonalNumber('12345678901');
```

## 📱 Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Features

- Mobile-first CSS approach
- Touch-friendly interactive elements
- Optimized layouts for each screen size
- Accessible navigation patterns

## 🔒 Security

### Authentication

- Secure login flow with JWT tokens
- Protected routes with automatic redirects
- Token refresh mechanism
- Proper logout handling

### Data Protection

- Client-side input validation
- XSS protection
- CSRF protection through Next.js
- Secure HTTP-only cookies (when using real backend)

## 🧪 Testing

### Type Safety

- Strict TypeScript configuration
- Comprehensive type definitions
- Runtime validation with Zod schemas

### Error Handling

- Application-wide error boundaries
- User-friendly error messages
- Proper HTTP error handling
- Fallback UI states

## 🚢 Deployment

The application is configured for static export and can be deployed to:

- Netlify (recommended)
- Vercel
- GitHub Pages
- Any static hosting provider

Build for production:

```bash
npm run build
```

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a demonstration project. For real-world usage, please follow these guidelines:

1. Maintain the established architecture patterns
2. Follow the TypeScript and code quality standards
3. Add comprehensive tests for new features
4. Update documentation for significant changes

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to localhost:3001/api)

### Custom Configuration

- Modify `next.config.js` for build settings
- Update `tailwind.config.ts` for design system changes
- Adjust `tsconfig.json` for TypeScript preferences
