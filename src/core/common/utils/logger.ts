/**
 * Framework logger
 * Provides consistent logging functionality across the framework
 */

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// Log level configuration - can be changed at runtime
let currentLogLevel = LogLevel.INFO;

// Set the current log level
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

// Get the current log level
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

// Format log message with timestamp and module name
function formatMessage(module: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${module}] ${message}`;
}

// Log debug message
export function debug(module: string, message: string, ...args: any[]): void {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.debug(formatMessage(module, message), ...args);
  }
}

// Log info message
export function info(module: string, message: string, ...args: any[]): void {
  if (currentLogLevel <= LogLevel.INFO) {
    console.info(formatMessage(module, message), ...args);
  }
}

// Log warning message
export function warn(module: string, message: string, ...args: any[]): void {
  if (currentLogLevel <= LogLevel.WARN) {
    console.warn(formatMessage(module, message), ...args);
  }
}

// Log error message
export function error(module: string, message: string, ...args: any[]): void {
  if (currentLogLevel <= LogLevel.ERROR) {
    console.error(formatMessage(module, message), ...args);
  }
}

// Create a logger for a specific module
export function createLogger(module: string) {
  return {
    debug: (message: string, ...args: any[]) => debug(module, message, ...args),
    info: (message: string, ...args: any[]) => info(module, message, ...args),
    warn: (message: string, ...args: any[]) => warn(module, message, ...args),
    error: (message: string, ...args: any[]) => error(module, message, ...args),
  };
}

// Default logger
export default {
  setLogLevel,
  getLogLevel,
  debug,
  info,
  warn,
  error,
  createLogger,
};