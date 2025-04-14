/**
 * Plugin manifest interface 
 * Defines metadata for a plugin
 */
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: Record<string, string>;
  entry: {
    server?: string;
    client?: string;
  };
  ui?: {
    main?: string;
    routes?: {
      path: string;
      component: string;
    }[];
  };
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
  onRegister?: () => void | Promise<void>;
  onStart?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
  onUnregister?: () => void | Promise<void>;
}

/**
 * Client-side plugin instance
 */
export interface ClientPlugin extends PluginLifecycle {
  name: string;
  version: string;
}

/**
 * Server-side plugin instance
 */
export interface ServerPlugin extends PluginLifecycle {
  name: string;
  version: string;
}

/**
 * Plugin loading status
 */
export enum PluginStatus {
  REGISTERED = 'registered',
  STARTED = 'started',
  STOPPED = 'stopped',
  ERROR = 'error'
}

/**
 * Plugin registry entry
 */
export interface PluginRegistryEntry {
  manifest: PluginManifest;
  status: PluginStatus;
  instance?: ClientPlugin | ServerPlugin;
  error?: Error;
}

/**
 * Plugin registry
 */
export type PluginRegistry = Map<string, PluginRegistryEntry>;