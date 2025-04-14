import { resolve } from 'path';
import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs';

// Find all plugin directories
const pluginDirs = fs.readdirSync(resolve('plugins'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Create a set of config objects for each plugin with a server entry point
const configs = pluginDirs
  .filter(plugin => 
    fs.existsSync(resolve('plugins', plugin, 'server.ts')) ||
    fs.existsSync(resolve('plugins', plugin, 'server.js'))
  )
  .map(plugin => {
    const input = fs.existsSync(resolve('plugins', plugin, 'server.ts')) 
      ? resolve('plugins', plugin, 'server.ts')
      : resolve('plugins', plugin, 'server.js');
    
    return {
      input,
      output: {
        file: resolve('dist', 'server', plugin, 'server.js'),
        format: 'esm',
        sourcemap: process.env.NODE_ENV !== 'production',
      },
      external: [
        'alt-server',
        // Add other external dependencies here
      ],
      plugins: [
        esbuild({
          target: 'es2020',
          minify: process.env.NODE_ENV === 'production',
        }),
      ],
    };
  });

// Add the core server code to the configs
configs.push({
  input: resolve('src', 'core', 'server', 'index.ts'),
  output: {
    file: resolve('dist', 'server', 'start.js'),
    format: 'esm',
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  external: [
    'alt-server',
    'fs',
    'path',
    // Add other external dependencies here
  ],
  plugins: [
    esbuild({
      target: 'es2020',
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
});

export default configs;