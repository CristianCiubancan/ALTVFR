/**
 * Framework constants
 * Centralized location for all constant values used throughout the framework
 */

// Event names
export const EVENTS = {
  // Plugin system events
  PLUGIN: {
    REGISTER: 'plugin:register',
    START: 'plugin:start',
    STOP: 'plugin:stop',
    LIST: 'plugin:list',
    REQUEST_START: 'plugin:requestStart',
    REQUEST_LIST: 'plugin:requestList',
  },
  
  // UI events
  UI: {
    SHOW: 'framework:ui:show',
    HIDE: 'framework:ui:hide',
    EVENT: 'framework:ui:event',
    READY: 'ui:ready',
  },
  
  // System events
  SYSTEM: {
    RESOURCE_START: 'resourceStart',
    RESOURCE_STOP: 'resourceStop',
    CONNECTION_COMPLETE: 'connectionComplete',
    DISCONNECT: 'disconnect',
  },
};

// Status codes
export const STATUS = {
  REGISTERED: 'registered',
  STARTED: 'started',
  STOPPED: 'stopped',
  ERROR: 'error',
};

// Default configuration values
export const DEFAULTS = {
  SERVER: {
    PORT: 7788,
    MAX_PLAYERS: 128,
    LANGUAGE: 'en',
    GAME_MODE: 'Freeroam',
  },
  
  // UI configuration defaults
  UI: {
    DEFAULT_ROUTE: '/home',
    FULLSCREEN: false,
  },
};

// Plugin system constants
export const PLUGIN = {
  DEFAULT_VERSION: '0.1.0',
  MANIFEST_FILENAME: 'manifest.json',
  REQUIRED_FIELDS: ['name', 'version', 'description', 'author'],
};