/**
 * Global type declarations for Alt:V React Framework
 */

declare namespace AltVReactFramework {
  /**
   * Plugin manifest structure
   */
  interface PluginManifest {
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
   * Plugin lifecycle interface
   */
  interface PluginLifecycle {
    onRegister?: () => void | Promise<void>;
    onStart?: () => void | Promise<void>;
    onStop?: () => void | Promise<void>;
    onUnregister?: () => void | Promise<void>;
  }

  /**
   * Server-side plugin interface
   */
  interface ServerPlugin extends PluginLifecycle {
    name: string;
    version: string;
  }

  /**
   * Client-side plugin interface
   */
  interface ClientPlugin extends PluginLifecycle {
    name: string;
    version: string;
  }

  /**
   * Plugin status enum
   */
  enum PluginStatus {
    REGISTERED = 'registered',
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error'
  }

  /**
   * Event system interface
   */
  interface EventSystem {
    on: (event: string, callback: (...args: any[]) => void) => () => void;
    emit: (event: string, ...args: any[]) => void;
  }

  /**
   * UI system interface
   */
  interface UISystem {
    show: (route: string, options?: { fullscreen?: boolean }) => void;
    hide: () => void;
    emit: (event: string, ...args: any[]) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
  }
}

/**
 * Alt:V specific window interface extensions for CEF
 */
declare interface Window {
  alt?: {
    emit: (event: string, ...args: any[]) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    once: (event: string, callback: (...args: any[]) => void) => void;
  };
}