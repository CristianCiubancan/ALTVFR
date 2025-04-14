# Types Directory

This directory contains TypeScript type definitions for the Alt:V React Framework.

## Files

- **global.d.ts** - Global type declarations
- **vite-env.d.ts** - Vite-specific type declarations
- **alt-v.d.ts** - Alt:V specific type extensions

## Type Guidelines

1. Use descriptive, consistent naming for types
2. Use interfaces for object types that can be implemented or extended
3. Use type aliases for union types, intersection types, and mapped types
4. Document all types with JSDoc comments
5. Keep types clean and focused on a single responsibility
6. Export types that need to be used across modules
7. Group related types in namespace declarations when appropriate

## Best Practices

1. Use strict typing and avoid `any` when possible
2. Use TypeScript's utility types (e.g., `Partial<T>`, `Pick<T>`, `Omit<T>`)
3. Ensure all event payloads are properly typed
4. Use discriminated unions for state management
5. Keep type definitions in sync with API contracts

## Example

```typescript
/**
 * Configuration options for a plugin
 */
export interface PluginConfig {
  /** The plugin name */
  name: string;
  /** The plugin version */
  version: string;
  /** Whether the plugin is enabled */
  enabled: boolean;
  /** Plugin-specific options */
  options?: Record<string, unknown>;
}

/**
 * Plugin state
 */
export type PluginState = 
  | { status: 'loading' }
  | { status: 'loaded'; config: PluginConfig }
  | { status: 'error'; error: Error };
```