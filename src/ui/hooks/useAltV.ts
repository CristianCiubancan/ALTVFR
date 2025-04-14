import { useEffect, useState, useCallback } from 'react';

/**
 * Interface for the alt:V event system
 */
interface AltVEvents {
  on: (event: string, callback: (data: any) => void) => () => void;
  emit: (event: string, data?: any) => void;
}

/**
 * Hook to interact with alt:V through CEF
 */
export function useAltV() {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Check if running in alt:V CEF environment
    const isAltV = 'alt' in window;
    setIsConnected(isAltV);
    
    if (isAltV) {
      // Send ready event to alt:V
      (window as any).alt.emit('ui:ready');
    }
  }, []);
  
  /**
   * Event system for communication with alt:V
   */
  const events: AltVEvents = {
    /**
     * Register an event handler
     * @returns Cleanup function to remove the event handler
     */
    on: useCallback((event: string, callback: (data: any) => void) => {
      if (!('alt' in window)) {
        console.warn('Not running in alt:V environment');
        return () => {};
      }
      
      const handler = (data: any) => {
        callback(data);
      };
      
      (window as any).alt.on(`${event}`, handler);
      
      return () => {
        (window as any).alt.off(`${event}`, handler);
      };
    }, []),
    
    /**
     * Emit an event to alt:V
     */
    emit: useCallback((event: string, data?: any) => {
      if (!('alt' in window)) {
        console.warn('Not running in alt:V environment');
        return;
      }
      
      (window as any).alt.emit(`${event}`, data);
    }, [])
  };
  
  return {
    isConnected,
    events
  };
}