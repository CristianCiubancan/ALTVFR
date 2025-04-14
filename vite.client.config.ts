import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Find all plugin directories
const pluginDirs = fs.readdirSync(resolve(__dirname, 'plugins'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Create input entries for each plugin's client code
const input = Object.fromEntries(
  pluginDirs
    .filter(plugin => 
      fs.existsSync(resolve(__dirname, 'plugins', plugin, 'client.ts')) ||
      fs.existsSync(resolve(__dirname, 'plugins', plugin, 'client.js'))
    )
    .map(plugin => [
      `${plugin}/client`, 
      resolve(__dirname, 'plugins', plugin, fs.existsSync(resolve(__dirname, 'plugins', plugin, 'client.ts')) ? 'client.ts' : 'client.js')
    ])
);

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
      '@framework': resolve(__dirname, 'src'),
      '@plugins': resolve(__dirname, 'plugins'),
    },
  },
  build: {
    outDir: 'dist/client',
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