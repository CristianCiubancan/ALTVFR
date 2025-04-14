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
    return [];
  }
  
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
      }
      
      return null;
    })
    .filter(Boolean);
}

/**
 * Get plugin paths for build system
 */
export function getPluginPaths() {
  const plugins = loadPluginManifests();
  
  return plugins.map(plugin => ({
    name: plugin.name,
    server: plugin.entry.server 
      ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.entry.server)
      : null,
    client: plugin.entry.client
      ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.entry.client)
      : null,
    ui: plugin.ui?.main
      ? path.join(__dirname, '..', 'plugins', plugin.name, plugin.ui.main)
      : null,
  }));
}

// Allow running this script directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(loadPluginManifests(), null, 2));
}