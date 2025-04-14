import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Alt:V context interface
 */
interface AltVContextType {
  /**
   * Whether connected to Alt:V
   */
  isConnected: boolean;
  
  /**
   * Event system for communication with Alt:V
   */
  events: {
    /**
     * Register an event handler
     * @returns Cleanup function to remove the event handler
     */
    on: (event: string, callback: (data: any) => void) => () => void;
    
    /**
     * Emit an event to Alt:V
     */
    emit: (event: string, data?: any) => void;
  };
}

/**
 * Alt:V context with default values
 */
const AltVContext = createContext<AltVContextType>({
  isConnected: false,
  events: {
    on: () => () => {},
    emit: () => {},
  },
});

/**
 * Alt:V provider props
 */
interface AltVProviderProps {
  children: React.ReactNode;
}

/**
 * Alt:V context provider
 * Provides Alt:V communication context to React components
 */
export const AltVProvider: React.FC<AltVProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if running in Alt:V CEF environment
    const isAltV = 'alt' in window;
    setIsConnected(isAltV);
    
    if (isAltV) {
      // Send ready event to Alt:V
      (window as any).alt.emit('ui:ready');
    }
  }, []);
  
  /**
   * Register an event handler
   * @returns Cleanup function to remove the event handler
   */
  const on = (event: string, callback: (data: any) => void) => {
    if (!('alt' in window)) {
      console.warn('Not running in Alt:V environment');
      return () => {};
    }
    
    const handler = (data: any) => {
      callback(data);
    };
    
    (window as any).alt.on(`${event}`, handler);
    
    return () => {
      (window as any).alt.off(`${event}`, handler);
    };
  };
  
  /**
   * Emit an event to Alt:V
   */
  const emit = (event: string, data?: any) => {
    if (!('alt' in window)) {
      console.warn('Not running in Alt:V environment');
      return;
    }
    
    (window as any).alt.emit(`${event}`, data);
  };
  
  const value: AltVContextType = {
    isConnected,
    events: {
      on,
      emit,
    },
  };
  
  return (
    <AltVContext.Provider value={value}>
      {children}
    </AltVContext.Provider>
  );
};

/**
 * Hook to use Alt:V context
 * @returns Alt:V context values and methods
 */
export const useAltV = () => useContext(AltVContext);