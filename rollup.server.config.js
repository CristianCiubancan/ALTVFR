import { resolve, join } from 'path';
import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs';

// Create dist directories if they don't exist
const DIST_SERVER_DIR = resolve('dist', 'server');
if (!fs.existsSync(DIST_SERVER_DIR)) {
  fs.mkdirSync(DIST_SERVER_DIR, { recursive: true });
}

// Find all plugin directories - handle case where plugins folder doesn't exist yet
let pluginDirs = [];
try {
  const pluginsDir = resolve('plugins');
  if (fs.existsSync(pluginsDir)) {
    pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
} catch (error) {
  console.error(`Error reading plugins directory: ${error.message}`);
}

// Create a set of config objects for each plugin with a server entry point
const configs = pluginDirs
  .filter(plugin => {
    try {
      return fs.existsSync(join('plugins', plugin, 'server.ts')) ||
             fs.existsSync(join('plugins', plugin, 'server.js'));
    } catch (error) {
      console.error(`Error checking for server file in plugin ${plugin}: ${error.message}`);
      return false;
    }
  })
  .map(plugin => {
    try {
      const pluginServerDir = resolve(DIST_SERVER_DIR, plugin);
      if (!fs.existsSync(pluginServerDir)) {
        fs.mkdirSync(pluginServerDir, { recursive: true });
      }
      
      const input = fs.existsSync(join('plugins', plugin, 'server.ts')) 
        ? resolve('plugins', plugin, 'server.ts')
        : resolve('plugins', plugin, 'server.js');
      
      return {
        input,
        output: {
          file: resolve(DIST_SERVER_DIR, plugin, 'server.js'),
          format: 'esm',
          sourcemap: process.env.NODE_ENV !== 'production',
        },
        external: [
          'alt-server',
          'fs',
          'path',
          'url',
          'child_process',
          // Add other external dependencies here
        ],
        plugins: [
          esbuild({
            target: 'es2020',
            minify: process.env.NODE_ENV === 'production',
          }),
        ],
      };
    } catch (error) {
      console.error(`Error creating config for plugin ${plugin}: ${error.message}`);
      return null;
    }
  })
  .filter(Boolean); // Remove any null configs

// Add the core server code to the configs
try {
  configs.push({
    input: resolve('src', 'core', 'server', 'index.ts'),
    output: {
      file: resolve(DIST_SERVER_DIR, 'start.js'),
      format: 'esm',
      sourcemap: process.env.NODE_ENV !== 'production',
    },
    external: [
      'alt-server',
      'fs',
      'path',
      'url',
      'child_process',
      // Add other external dependencies here
    ],
    plugins: [
      esbuild({
        target: 'es2020',
        minify: process.env.NODE_ENV === 'production',
      }),
    ],
  });
} catch (error) {
  console.error(`Error creating config for core server: ${error.message}`);
}

export default configs;