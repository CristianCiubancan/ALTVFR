/**
 * Alt:V specific type definitions
 */

/**
 * Alt:V window interface for CEF
 */
declare interface Window {
  /**
   * Alt:V API available in CEF windows
   */
  alt?: {
    /**
     * Emit an event to the client
     */
    emit: (event: string, ...args: any[]) => void;
    
    /**
     * Register an event handler
     */
    on: (event: string, callback: (...args: any[]) => void) => void;
    
    /**
     * Remove an event handler
     */
    off: (event: string, callback: (...args: any[]) => void) => void;
    
    /**
     * Register a one-time event handler
     */
    once: (event: string, callback: (...args: any[]) => void) => void;
  };
}

/**
 * Alt:V client-side API
 */
declare namespace AltClientAPI {
  /**
   * Emit an event to the server
   */
  function emitServer(event: string, ...args: any[]): void;
  
  /**
   * Emit an event to the CEF
   */
  function emit(event: string, ...args: any[]): void;
  
  /**
   * Register an event handler for server events
   */
  function onServer(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * Register an event handler for client events
   */
  function on(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * Log a message to the console
   */
  function log(message: string): void;
  
  /**
   * Log an error message to the console
   */
  function logError(message: string): void;
}

/**
 * Alt:V server-side API
 */
declare namespace AltServerAPI {
  /**
   * Emit an event to a specific client
   */
  function emitClient(player: Player, event: string, ...args: any[]): void;
  
  /**
   * Emit an event to all clients
   */
  function emitAllClients(event: string, ...args: any[]): void;
  
  /**
   * Register an event handler for client events
   */
  function onClient(event: string, callback: (player: Player, ...args: any[]) => void): void;
  
  /**
   * Register an event handler for server events
   */
  function on(event: string, callback: (...args: any[]) => void): void;
  
  /**
   * Log a message to the console
   */
  function log(message: string): void;
  
  /**
   * Log an error message to the console
   */
  function logError(message: string): void;
}

/**
 * Alt:V player
 */
declare interface Player {
  id: number;
  name: string;
  ip: string;
  ping: number;
  
  // Add more properties as needed
}