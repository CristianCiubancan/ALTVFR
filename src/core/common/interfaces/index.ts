/**
 * Common interfaces shared between server and client
 */

/**
 * Basic plugin metadata interface
 */
export interface PluginMeta {
  name: string;
  version: string;
  description: string;
  author: string;
}

/**
 * Basic configuration interface
 */
export interface Configuration {
  [key: string]: any;
}

/**
 * System service interface
 */
export interface Service {
  name: string;
  initialize: () => Promise<void> | void;
  shutdown: () => Promise<void> | void;
}

/**
 * Event handler interface
 */
export interface EventHandler<T = any> {
  event: string;
  handler: (data: T) => void;
}

/**
 * API endpoint interface
 */
export interface APIEndpoint<T = any, R = any> {
  name: string;
  handler: (data: T) => Promise<R> | R;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  code: number;
  message: string;
  details?: any;
}

/**
 * Success response interface
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * API response type
 */
export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse;