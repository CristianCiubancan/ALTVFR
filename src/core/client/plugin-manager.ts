import * as alt from 'alt-client';
import { ClientPlugin, PluginStatus } from '../plugin-manager/types';

class ClientPluginManager {
  private plugins = new Map<string, ClientPlugin>();
  private pluginStatus = new Map<string, PluginStatus>();
  private isInitialized = false;

  /**
   * Initialize the client plugin manager
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }

    alt.log('Initializing client plugin manager');
    
    // Register event handlers
    this.registerEvents();
    
    // Request plugin information from server
    alt.emitServer('plugin:requestList');
    
    this.isInitialized = true;
    alt.log('Client plugin manager initialized');
  }

  /**
   * Register a client plugin
   */
  registerPlugin(plugin: ClientPlugin) {
    if (this.plugins.has(plugin.name)) {
      alt.logWarning(`Plugin ${plugin.name} is already registered`);
      return false;
    }
    
    alt.log(`Registering client plugin: ${plugin.name} v${plugin.version}`);
    
    this.plugins.set(plugin.name, plugin);
    this.pluginStatus.set(plugin.name, PluginStatus.REGISTERED);
    
    // Call lifecycle hook
    if (plugin.onRegister) {
      try {
        plugin.onRegister();
      } catch (error) {
        alt.logError(`Error in onRegister hook for plugin ${plugin.name}: ${error}`);
      }
    }
    
    // Request start from server
    alt.emitServer('plugin:requestStart', plugin.name);
    
    return true;
  }

  /**
   * Start a client plugin
   */
  startPlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      alt.logError(`Plugin ${pluginName} is not registered`);
      return false;
    }
    
    if (this.pluginStatus.get(pluginName) === PluginStatus.STARTED) {
      alt.logWarning(`Plugin ${pluginName} is already started`);
      return true;
    }
    
    try {
      // Call lifecycle hook
      if (plugin.onStart) {
        plugin.onStart();
      }
      
      // Update status
      this.pluginStatus.set(pluginName, PluginStatus.STARTED);
      
      alt.log(`Plugin ${pluginName} started`);
      return true;
    } catch (error) {
      this.pluginStatus.set(pluginName, PluginStatus.ERROR);
      alt.logError(`Failed to start plugin ${pluginName}: ${error}`);
      return false;
    }
  }

  /**
   * Stop a client plugin
   */
  stopPlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      alt.logError(`Plugin ${pluginName} is not registered`);
      return false;
    }
    
    if (this.pluginStatus.get(pluginName) !== PluginStatus.STARTED) {
      alt.logWarning(`Plugin ${pluginName} is not started`);
      return true;
    }
    
    try {
      // Call lifecycle hook
      if (plugin.onStop) {
        plugin.onStop();
      }
      
      // Update status
      this.pluginStatus.set(pluginName, PluginStatus.STOPPED);
      
      alt.log(`Plugin ${pluginName} stopped`);
      return true;
    } catch (error) {
      this.pluginStatus.set(pluginName, PluginStatus.ERROR);
      alt.logError(`Failed to stop plugin ${pluginName}: ${error}`);
      return false;
    }
  }

  /**
   * Register event handlers
   */
  private registerEvents() {
    // Listen for plugin start signals from server
    alt.onServer('plugin:start', (pluginName: string) => {
      this.startPlugin(pluginName);
    });
    
    // Listen for plugin stop signals from server
    alt.onServer('plugin:stop', (pluginName: string) => {
      this.stopPlugin(pluginName);
    });
    
    // Listen for plugin list from server
    alt.onServer('plugin:list', (pluginList: {name: string, version: string, status: string}[]) => {
      // Update local plugin status based on server information
      for (const {name, status} of pluginList) {
        if (this.plugins.has(name) && status === PluginStatus.STARTED) {
          this.startPlugin(name);
        }
      }
    });
    
    // Listen for resource stop to cleanup plugins
    alt.on('disconnect', () => {
      this.shutdown();
    });
  }

  /**
   * Shutdown all plugins
   */
  shutdown() {
    // Stop all plugins
    for (const [name] of this.plugins) {
      this.stopPlugin(name);
    }
    
    alt.log('All client plugins stopped');
  }

  /**
   * Get plugin status
   */
  getPluginStatus(pluginName: string) {
    return this.pluginStatus.get(pluginName) || PluginStatus.REGISTERED;
  }
}

// Create singleton instance
export const clientPluginManager = new ClientPluginManager();