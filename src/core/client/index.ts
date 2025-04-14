import * as alt from 'alt-client';
import { clientPluginManager } from './plugin-manager';
import { ClientPlugin } from '../plugin-manager/types';

// Initialize client-side framework
alt.on('connectionComplete', () => {
  alt.log('alt:V React Framework initializing...');
  clientPluginManager.initialize();
});

/**
 * Register a client-side plugin with the framework
 */
export function registerClientPlugin(plugin: ClientPlugin): ClientPlugin {
  // Register the plugin
  clientPluginManager.registerPlugin(plugin);
  return plugin;
}

/**
 * UI event system for communication with CEF
 */
export const ui = {
  /**
   * Show a specific UI route
   */
  show(route: string, options?: { fullscreen?: boolean }) {
    // TODO: Implement CEF browser creation/management
    alt.log(`UI showing route: ${route}`);
    alt.emit('framework:ui:show', route, options);
  },
  
  /**
   * Hide the currently visible UI
   */
  hide() {
    alt.emit('framework:ui:hide');
  },
  
  /**
   * Send an event to the UI
   */
  emit(event: string, ...args: any[]) {
    alt.emit('framework:ui:event', event, ...args);
  },
  
  /**
   * Register a handler for UI events
   */
  on(event: string, callback: (...args: any[]) => void) {
    alt.on(`framework:ui:${event}`, callback);
  },
  
  /**
   * Remove a handler for UI events
   */
  off(event: string, callback: (...args: any[]) => void) {
    alt.off(`framework:ui:${event}`, callback);
  }
};