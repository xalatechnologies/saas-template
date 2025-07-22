# Layout Architecture

## Overview

The layout system follows SOLID principles with a composition-based architecture. All layouts use the GridLayout system for consistent spacing and alignment.

## Core Components

### 1. BaseLayout
- **Purpose**: Abstract common layout patterns
- **Features**: Handles skip links, header/footer/sidebar composition
- **Variants**: web, dashboard, auth, minimal

### 2. Layout Implementations

#### WebLayout
- Uses BaseLayout with "web" variant
- Boxed header and footer
- Marketing navigation
- No global search

#### DashboardLayout  
- Uses BaseLayout with "dashboard" variant
- Full-width header with global search
- Fixed sidebar navigation
- Language selector

#### AuthLayout
- Split-screen design for authentication pages
- Marketing content on left (desktop only)
- Form area on right

### 3. Shared Components

#### Header
- **Variants**: boxed (web), full (dashboard)
- **Props**: showLogo, navigation, showSearch
- Responsive with mobile menu

#### Footer
- Marketing footer with company info
- Uses GridLayout for responsive columns
- All text from i18n

#### Container
- Consistent max-width wrapper
- Sizes: sm, md, lg, xl, full
- Used for content containment

#### MainContent
- Semantic <main> wrapper
- Variants: web, dashboard, auth, fullscreen
- Handles flex growth and overflow

### 4. GridLayout System

#### GridLayout
- Responsive grid with design token gaps
- Columns: mobile, tablet, desktop
- Gap sizes: sm, md, lg, xl

#### FlexLayout
- Flexible box layout
- Direction: row, column
- Align/justify with design tokens

#### SplitLayout
- Two-column layouts
- Split ratios: 50/50, 60/40, 70/30
- Responsive stacking

## Usage Examples

```tsx
// Web page
<WebLayout>
  <Container size="xl">
    <PageContent />
  </Container>
</WebLayout>

// Dashboard page
<DashboardLayout>
  <GridLayout columns={{ mobile: 1, desktop: 3 }}>
    <Card />
    <Card />
    <Card />
  </GridLayout>
</DashboardLayout>
```

## Design Principles

1. **Composition over Inheritance**: Use BaseLayout as foundation
2. **Single Responsibility**: Each component has one clear purpose
3. **Open/Closed**: Extend through props, not modification
4. **Dependency Inversion**: Layouts accept content as props
5. **DRY**: Shared components prevent duplication