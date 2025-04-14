# UI Framework Directory

This directory contains UI components and utilities for the Alt:V React Framework.

## Directory Structure

- **components/** - React components
  - **common/** - Generic UI components
  - **layout/** - Layout components
  - **providers/** - React context providers
  
- **hooks/** - Custom React hooks
  - **useAltV.ts** - Hook for Alt:V CEF integration
  
- **styles/** - Global styles
  - **theme.css** - Theme variables
  
- **utils/** - UI utility functions

## Component Guidelines

1. Create functional components with TypeScript types
2. Use the component naming convention `PascalCase`
3. Define props interfaces for all components
4. Document components with JSDoc comments
5. Use proper semantic HTML elements
6. Use TailwindCSS for styling
7. Make components responsive by default
8. Follow accessibility best practices

## Styling Guidelines

1. Use TailwindCSS utility classes for component styling
2. Use CSS variables for theming in `theme.css`
3. Organize related utilities with `@apply` in component classes
4. Keep components visually consistent
5. Support both light and dark modes
6. Consider mobile-first design

## Testing

1. Write tests for all components
2. Test all interactive functionality
3. Test accessibility
4. Test responsive behavior