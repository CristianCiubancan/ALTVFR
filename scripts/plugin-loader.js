import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load all plugin manifests
 */
export function loadPluginManifests() {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  
  if (!fs.existsSync(pluginsDir)) {
    console.log('Plugins directory does not exist yet.');
    return [];
  }
  
  try {
    return fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const name = dirent.name;
        const manifestPath = path.join(pluginsDir, name, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          try {
            return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          } catch (error) {
            console.error(`Failed to parse manifest for plugin ${name}:`, error);
            return null;
          }
        } else {
          console.log(`No manifest found for ${name}`);
        }
        
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error loading plugin manifests:', error);
    return [];
  }
}

/**
 * Get plugin paths for build system
 * Uses platform-safe path operations
 */
export function getPluginPaths() {
  const plugins = loadPluginManifests();
  
  return plugins.map(plugin => {
    try {
      return {
        name: plugin.name,
        server: plugin.entry?.server 
          ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.entry.server)
          : null,
        client: plugin.entry?.client
          ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.entry.client)
          : null,
        ui: plugin.ui?.main
          ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.ui.main)
          : null,
      };
    } catch (error) {
      console.error(`Error getting paths for plugin ${plugin.name}:`, error);
      return {
        name: plugin.name,
        server: null,
        client: null,
        ui: null
      };
    }
  });
}

/**
 * Create plugins directory if it doesn't exist
 */
export function ensurePluginsDirectory() {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  
  if (!fs.existsSync(pluginsDir)) {
    console.log('Creating plugins directory...');
    fs.mkdirSync(pluginsDir, { recursive: true });
  }
}

// Allow running this script directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ensurePluginsDirectory();
  console.log(JSON.stringify(loadPluginManifests(), null, 2));
}