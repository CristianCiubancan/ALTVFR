/**
 * Alt:V API mocks for testing
 */

/**
 * Mock Alt:V client API
 */
export const mockAltClient = {
  /**
   * Event handlers
   */
  _eventHandlers: new Map<string, Function[]>(),
  
  /**
   * Server event handlers
   */
  _serverEventHandlers: new Map<string, Function[]>(),
  
  /**
   * Emit an event to the server
   */
  emitServer: jest.fn((event: string, ...args: any[]) => {
    console.log(`[MockAltClient] emitServer: ${event}`, args);
  }),
  
  /**
   * Emit an event
   */
  emit: jest.fn((event: string, ...args: any[]) => {
    console.log(`[MockAltClient] emit: ${event}`, args);
    
    // Call event handlers
    const handlers = mockAltClient._eventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(...args);
    }
  }),
  
  /**
   * Register an event handler for server events
   */
  onServer: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltClient] onServer: ${event}`);
    
    // Add handler to server event handlers
    const handlers = mockAltClient._serverEventHandlers.get(event) || [];
    handlers.push(callback);
    mockAltClient._serverEventHandlers.set(event, handlers);
  }),
  
  /**
   * Register an event handler
   */
  on: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltClient] on: ${event}`);
    
    // Add handler to event handlers
    const handlers = mockAltClient._eventHandlers.get(event) || [];
    handlers.push(callback);
    mockAltClient._eventHandlers.set(event, handlers);
  }),
  
  /**
   * Trigger a server event
   */
  triggerServerEvent: (event: string, ...args: any[]) => {
    console.log(`[MockAltClient] triggerServerEvent: ${event}`, args);
    
    // Call server event handlers
    const handlers = mockAltClient._serverEventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(...args);
    }
  },
  
  /**
   * Trigger an event
   */
  triggerEvent: (event: string, ...args: any[]) => {
    console.log(`[MockAltClient] triggerEvent: ${event}`, args);
    
    // Call event handlers
    const handlers = mockAltClient._eventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(...args);
    }
  },
  
  /**
   * Log to console
   */
  log: jest.fn((message: string) => {
    console.log(`[MockAltClient] log: ${message}`);
  }),
  
  /**
   * Log error to console
   */
  logError: jest.fn((message: string) => {
    console.error(`[MockAltClient] logError: ${message}`);
  }),
  
  /**
   * Reset mock
   */
  reset: () => {
    mockAltClient._eventHandlers.clear();
    mockAltClient._serverEventHandlers.clear();
    jest.clearAllMocks();
  },
};

/**
 * Mock Alt:V server API
 */
export const mockAltServer = {
  /**
   * Event handlers
   */
  _eventHandlers: new Map<string, Function[]>(),
  
  /**
   * Client event handlers
   */
  _clientEventHandlers: new Map<string, Function[]>(),
  
  /**
   * Emit an event to a specific client
   */
  emitClient: jest.fn((player: any, event: string, ...args: any[]) => {
    console.log(`[MockAltServer] emitClient: ${event}`, player, args);
  }),
  
  /**
   * Emit an event to all clients
   */
  emitAllClients: jest.fn((event: string, ...args: any[]) => {
    console.log(`[MockAltServer] emitAllClients: ${event}`, args);
  }),
  
  /**
   * Register an event handler for client events
   */
  onClient: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltServer] onClient: ${event}`);
    
    // Add handler to client event handlers
    const handlers = mockAltServer._clientEventHandlers.get(event) || [];
    handlers.push(callback);
    mockAltServer._clientEventHandlers.set(event, handlers);
  }),
  
  /**
   * Register an event handler
   */
  on: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltServer] on: ${event}`);
    
    // Add handler to event handlers
    const handlers = mockAltServer._eventHandlers.get(event) || [];
    handlers.push(callback);
    mockAltServer._eventHandlers.set(event, handlers);
  }),
  
  /**
   * Trigger a client event
   */
  triggerClientEvent: (player: any, event: string, ...args: any[]) => {
    console.log(`[MockAltServer] triggerClientEvent: ${event}`, player, args);
    
    // Call client event handlers
    const handlers = mockAltServer._clientEventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(player, ...args);
    }
  },
  
  /**
   * Trigger an event
   */
  triggerEvent: (event: string, ...args: any[]) => {
    console.log(`[MockAltServer] triggerEvent: ${event}`, args);
    
    // Call event handlers
    const handlers = mockAltServer._eventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(...args);
    }
  },
  
  /**
   * Log to console
   */
  log: jest.fn((message: string) => {
    console.log(`[MockAltServer] log: ${message}`);
  }),
  
  /**
   * Log error to console
   */
  logError: jest.fn((message: string) => {
    console.error(`[MockAltServer] logError: ${message}`);
  }),
  
  /**
   * Reset mock
   */
  reset: () => {
    mockAltServer._eventHandlers.clear();
    mockAltServer._clientEventHandlers.clear();
    jest.clearAllMocks();
  },
};

/**
 * Mock Alt:V Window API for CEF
 */
export const mockAltWindow = {
  /**
   * Event handlers
   */
  _eventHandlers: new Map<string, Function[]>(),
  
  /**
   * Emit an event
   */
  emit: jest.fn((event: string, ...args: any[]) => {
    console.log(`[MockAltWindow] emit: ${event}`, args);
  }),
  
  /**
   * Register an event handler
   */
  on: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltWindow] on: ${event}`);
    
    // Add handler to event handlers
    const handlers = mockAltWindow._eventHandlers.get(event) || [];
    handlers.push(callback);
    mockAltWindow._eventHandlers.set(event, handlers);
  }),
  
  /**
   * Remove an event handler
   */
  off: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltWindow] off: ${event}`);
    
    // Remove handler from event handlers
    const handlers = mockAltWindow._eventHandlers.get(event) || [];
    const index = handlers.indexOf(callback);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    mockAltWindow._eventHandlers.set(event, handlers);
  }),
  
  /**
   * Register a one-time event handler
   */
  once: jest.fn((event: string, callback: Function) => {
    console.log(`[MockAltWindow] once: ${event}`);
    
    // Create a wrapper that calls the callback and then removes itself
    const wrapper = (...args: any[]) => {
      callback(...args);
      mockAltWindow.off(event, wrapper);
    };
    
    // Add wrapper to event handlers
    mockAltWindow.on(event, wrapper);
  }),
  
  /**
   * Trigger an event
   */
  triggerEvent: (event: string, ...args: any[]) => {
    console.log(`[MockAltWindow] triggerEvent: ${event}`, args);
    
    // Call event handlers
    const handlers = mockAltWindow._eventHandlers.get(event) || [];
    for (const handler of handlers) {
      handler(...args);
    }
  },
  
  /**
   * Reset mock
   */
  reset: () => {
    mockAltWindow._eventHandlers.clear();
    jest.clearAllMocks();
  },
};