/**
 * Alt:V React Framework
 * Main entrypoint file
 */

// Export server-side functionality
export * from './core/server';

// Export client-side functionality
export * from './core/client';

// Export common utilities
export * from './core/common/utils/logger';

// Export plugin system types
export * from './core/plugin-system/interfaces';

// Main framework version
export const VERSION = '0.1.0';