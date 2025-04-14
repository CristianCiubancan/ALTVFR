import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, join } from 'path';
import fs from 'fs';

// Ensure dist client directory exists
const DIST_CLIENT_DIR = resolve('dist', 'client');
if (!fs.existsSync(DIST_CLIENT_DIR)) {
  fs.mkdirSync(DIST_CLIENT_DIR, { recursive: true });
}

// Find all plugin directories - handle case where plugins folder doesn't exist yet
let pluginDirs: string[] = [];
try {
  const pluginsDir = resolve('plugins');
  if (fs.existsSync(pluginsDir)) {
    pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }
} catch (error) {
  console.error(`Error reading plugins directory: ${error instanceof Error ? error.message : String(error)}`);
}

// Create input entries for each plugin's client code with error handling
const input: Record<string, string> = {};

for (const plugin of pluginDirs) {
  try {
    const hasTsClient = fs.existsSync(join('plugins', plugin, 'client.ts'));
    const hasJsClient = fs.existsSync(join('plugins', plugin, 'client.js'));
    
    if (hasTsClient || hasJsClient) {
      const clientFile = hasTsClient ? 'client.ts' : 'client.js';
      input[`${plugin}/client`] = resolve('plugins', plugin, clientFile);
    }
  } catch (error) {
    console.error(`Error processing plugin ${plugin}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Production-specific options
const productionOptions = {
  minify: true,
  sourcemap: false,
};

// Development-specific options
const developmentOptions = {
  minify: false,
  sourcemap: true,
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@framework': resolve('src'),
      '@plugins': resolve('plugins'),
    },
  },
  build: {
    outDir: DIST_CLIENT_DIR,
    emptyOutDir: true,
    lib: {
      entry: input,
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
      external: ['alt-client'],
    },
    ...(process.env.NODE_ENV === 'production' ? productionOptions : developmentOptions),
  },
});