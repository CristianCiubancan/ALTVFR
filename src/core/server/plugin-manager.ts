import * as alt from 'alt-server';
import { PluginManifest, PluginRegistry, PluginStatus, ServerPlugin } from '../plugin-manager/types';
import fs from 'fs';
import path from 'path';

class ServerPluginManager {
  private registry: PluginRegistry = new Map();
  private isInitialized = false;

  /**
   * Initialize the plugin manager
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    alt.log('Initializing server plugin manager');
    
    // Load plugin manifests
    await this.loadPlugins();
    
    // Register built-in events
    this.registerEvents();
    
    this.isInitialized = true;
    alt.log('Server plugin manager initialized');
  }

  /**
   * Load all plugins from the plugins directory
   */
  private async loadPlugins() {
    const pluginsDir = './plugins';
    
    try {
      const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const pluginDir of pluginDirs) {
        try {
          const manifestPath = path.join(pluginsDir, pluginDir, 'manifest.json');
          
          if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PluginManifest;
            
            // Register the plugin
            this.registerPlugin(manifest);
          }
        } catch (error) {
          alt.logError(`Failed to load plugin ${pluginDir}: ${error}`);
        }
      }
      
      // Resolve dependencies and start plugins
      this.resolveDependencies();
      
    } catch (error) {
      alt.logError(`Failed to load plugins: ${error}`);
    }
  }

  /**
   * Register a plugin with the manager
   */
  registerPlugin(manifest: PluginManifest) {
    if (this.registry.has(manifest.name)) {
      alt.logWarning(`Plugin ${manifest.name} is already registered`);
      return false;
    }
    
    alt.log(`Registering plugin: ${manifest.name} v${manifest.version}`);
    
    this.registry.set(manifest.name, {
      manifest,
      status: PluginStatus.REGISTERED
    });
    
    return true;
  }

  /**
   * Start a plugin
   */
  async startPlugin(pluginName: string) {
    const entry = this.registry.get(pluginName);
    
    if (!entry) {
      alt.logError(`Plugin ${pluginName} is not registered`);
      return false;
    }
    
    if (entry.status === PluginStatus.STARTED) {
      alt.logWarning(`Plugin ${pluginName} is already started`);
      return true;
    }
    
    try {
      // Check if server entry exists
      if (!entry.manifest.entry.server) {
        // No server component, just mark as started
        entry.status = PluginStatus.STARTED;
        return true;
      }
      
      // Import the plugin
      const pluginPath = path.join('../dist/server', pluginName, 'server.js');
      const pluginModule = await import(pluginPath);
      
      // Get the plugin instance
      const pluginInstance = pluginModule.default as ServerPlugin;
      
      if (!pluginInstance) {
        throw new Error(`Plugin ${pluginName} does not export a default instance`);
      }
      
      // Store the instance
      entry.instance = pluginInstance;
      
      // Call lifecycle hooks
      if (pluginInstance.onStart) {
        await pluginInstance.onStart();
      }
      
      // Update status
      entry.status = PluginStatus.STARTED;
      
      alt.log(`Plugin ${pluginName} started`);
      return true;
    } catch (error) {
      entry.status = PluginStatus.ERROR;
      entry.error = error as Error;
      alt.logError(`Failed to start plugin ${pluginName}: ${error}`);
      return false;
    }
  }

  /**
   * Stop a plugin
   */
  async stopPlugin(pluginName: string) {
    const entry = this.registry.get(pluginName);
    
    if (!entry) {
      alt.logError(`Plugin ${pluginName} is not registered`);
      return false;
    }
    
    if (entry.status !== PluginStatus.STARTED) {
      alt.logWarning(`Plugin ${pluginName} is not started`);
      return true;
    }
    
    try {
      // Call lifecycle hooks if instance exists
      if (entry.instance && 'onStop' in entry.instance) {
        await entry.instance.onStop();
      }
      
      // Update status
      entry.status = PluginStatus.STOPPED;
      
      alt.log(`Plugin ${pluginName} stopped`);
      return true;
    } catch (error) {
      entry.status = PluginStatus.ERROR;
      entry.error = error as Error;
      alt.logError(`Failed to stop plugin ${pluginName}: ${error}`);
      return false;
    }
  }

  /**
   * Resolve dependencies and start plugins in correct order
   */
  private async resolveDependencies() {
    // Create a map of plugins to their dependencies
    const dependencyMap = new Map<string, string[]>();
    
    // Fill dependency map
    for (const [name, entry] of this.registry.entries()) {
      const dependencies = entry.manifest.dependencies || {};
      dependencyMap.set(name, Object.keys(dependencies));
    }
    
    // Helper function to check for circular dependencies
    const isCircular = (name: string, stack: string[] = []): boolean => {
      if (stack.includes(name)) {
        return true;
      }
      
      const deps = dependencyMap.get(name) || [];
      for (const dep of deps) {
        if (isCircular(dep, [...stack, name])) {
          return true;
        }
      }
      
      return false;
    };
    
    // Check for circular dependencies
    for (const name of dependencyMap.keys()) {
      if (isCircular(name)) {
        alt.logError(`Circular dependency detected for plugin ${name}`);
        return;
      }
    }
    
    // Helper function to get plugin start order
    const getStartOrder = (): string[] => {
      const order: string[] = [];
      const visited = new Set<string>();
      
      const visit = (name: string) => {
        if (visited.has(name)) return;
        visited.add(name);
        
        const deps = dependencyMap.get(name) || [];
        for (const dep of deps) {
          visit(dep);
        }
        
        order.push(name);
      };
      
      for (const name of dependencyMap.keys()) {
        visit(name);
      }
      
      return order;
    };
    
    // Start plugins in correct order
    const startOrder = getStartOrder();
    for (const name of startOrder) {
      await this.startPlugin(name);
    }
  }

  /**
   * Register event handlers
   */
  private registerEvents() {
    // Listen for resource stop to cleanup plugins
    alt.on('resourceStop', () => {
      this.shutdown();
    });
    
    // Listen for client plugin messages
    alt.onClient('plugin:requestStart', (player, pluginName) => {
      const entry = this.registry.get(pluginName);
      if (entry && entry.status === PluginStatus.STARTED) {
        alt.emitClient(player, 'plugin:start', pluginName);
      }
    });
  }

  /**
   * Shutdown all plugins
   */
  async shutdown() {
    // Stop all plugins in reverse dependency order
    const startOrder = Array.from(this.registry.keys());
    
    for (let i = startOrder.length - 1; i >= 0; i--) {
      await this.stopPlugin(startOrder[i]);
    }
    
    alt.log('All plugins stopped');
  }

  /**
   * Get all registered plugins
   */
  getPlugins() {
    return Array.from(this.registry.entries()).map(([name, entry]) => ({
      name,
      version: entry.manifest.version,
      status: entry.status
    }));
  }
}

// Create singleton instance
export const serverPluginManager = new ServerPluginManager();