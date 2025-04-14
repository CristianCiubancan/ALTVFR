import * as alt from 'alt-server';
import { serverPluginManager } from './plugin-manager';
import { ServerPlugin } from '../plugin-manager/types';

// Initialize server-side framework
alt.on('resourceStart', () => {
  alt.log('alt:V React Framework initializing...');
  serverPluginManager.initialize();
  
  // Register server events
  registerServerEvents();
});

// Register a server plugin with the framework
export function registerServerPlugin(plugin: ServerPlugin): ServerPlugin {
  return plugin;
}

// Register server-side event handlers
function registerServerEvents() {
  // Handle plugin list requests from clients
  alt.onClient('plugin:requestList', (player) => {
    alt.emitClient(player, 'plugin:list', serverPluginManager.getPlugins());
  });
  
  // Other framework events can be registered here
}

// Cleanup on resource stop
alt.on('resourceStop', () => {
  alt.log('alt:V React Framework shutting down...');
  serverPluginManager.shutdown();
});