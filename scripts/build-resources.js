#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const RESOURCES_DIR = path.join(__dirname, '..', 'resources');

// Ensure resources directory exists
if (!fs.existsSync(RESOURCES_DIR)) {
  fs.mkdirSync(RESOURCES_DIR, { recursive: true });
}

// Load all plugin manifests
const plugins = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => {
    const name = dirent.name;
    const manifestPath = path.join(PLUGINS_DIR, name, 'manifest.json');
    
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

console.log(`Building resources for ${plugins.length} plugins...`);

// Create a resource for each plugin
for (const plugin of plugins) {
  try {
    buildResource(plugin);
  } catch (error) {
    console.error(`Failed to build resource for plugin ${plugin.name}:`, error);
  }
}

/**
 * Build a resource for a plugin
 */
function buildResource(plugin) {
  const resourceDir = path.join(RESOURCES_DIR, plugin.name);
  
  // Create resource directory
  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true });
  }
  
  // Create client directory if needed
  if (plugin.entry.client) {
    const clientDir = path.join(resourceDir, 'client');
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    
    // Copy client bundle
    const clientSourcePath = path.join(DIST_DIR, 'client', `${plugin.name}/client.js`);
    const clientDestPath = path.join(clientDir, 'index.js');
    
    if (fs.existsSync(clientSourcePath)) {
      fs.copyFileSync(clientSourcePath, clientDestPath);
    } else {
      console.warn(`Client bundle not found for plugin ${plugin.name}`);
    }
  }
  
  // Copy server bundle if needed
  if (plugin.entry.server) {
    const serverSourcePath = path.join(DIST_DIR, 'server', plugin.name, 'server.js');
    const serverDestPath = path.join(resourceDir, 'server.js');
    
    if (fs.existsSync(serverSourcePath)) {
      fs.copyFileSync(serverSourcePath, serverDestPath);
    } else {
      console.warn(`Server bundle not found for plugin ${plugin.name}`);
    }
  }
  
  // Copy UI files if needed
  if (plugin.ui) {
    const uiDir = path.join(resourceDir, 'ui');
    if (!fs.existsSync(uiDir)) {
      fs.mkdirSync(uiDir, { recursive: true });
    }
    
    // Copy UI bundle - in production we would use the Astro build output
    // For now, simplify by just creating a placeholder
    const indexPath = path.join(uiDir, 'index.html');
    const indexContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${plugin.name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script defer src="bundle.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
    
    fs.writeFileSync(indexPath, indexContent);
    
    // Copy or create placeholder CSS
    const cssPath = path.join(uiDir, 'styles.css');
    fs.writeFileSync(cssPath, '/* Generated styles for ' + plugin.name + ' */');
    
    // Create placeholder JS
    const jsPath = path.join(uiDir, 'bundle.js');
    fs.writeFileSync(jsPath, '// Generated bundle for ' + plugin.name);
  }
  
  // Generate resource.toml
  const resourceConfig = generateResourceConfig(plugin);
  fs.writeFileSync(
    path.join(resourceDir, 'resource.toml'),
    resourceConfig
  );
  
  console.log(`Resource built for plugin ${plugin.name}`);
}

/**
 * Generate resource.toml content for a plugin
 */
function generateResourceConfig(plugin) {
  let config = `# Resource configuration for ${plugin.name}\n\n`;
  
  // Basic resource info
  config += `type = "js"\n`;
  config += `main = "server.js"\n\n`;
  
  // Client script
  if (plugin.entry.client) {
    config += `client-type = "js"\n`;
    config += `client-main = "client/index.js"\n\n`;
  }
  
  // Client files
  if (plugin.ui) {
    config += `client-files = [\n`;
    config += `  "ui/*"\n`;
    config += `]\n\n`;
  }
  
  // Dependencies
  if (plugin.dependencies && Object.keys(plugin.dependencies).length > 0) {
    config += `deps = [\n`;
    for (const dep of Object.keys(plugin.dependencies)) {
      config += `  "${dep}"\n`;
    }
    config += `]\n`;
  }
  
  return config;
}