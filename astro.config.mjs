import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import { loadPluginManifests } from './scripts/plugin-loader.js';

// Load plugin UI routes dynamically
const plugins = loadPluginManifests();

// Create dynamic routes for plugin UIs
const routes = plugins.flatMap(plugin => 
  plugin.ui?.routes?.map(route => ({
    pattern: route.path,
    entrypoint: `./plugins/${plugin.name}/${route.component}`
  })) || []
);

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  outDir: './dist/ui',
  server: {
    port: 3000,
  },
  vite: {
    resolve: {
      alias: {
        '@framework': '/src',
        '@plugins': '/plugins',
      },
    },
    optimizeDeps: {
      exclude: ['@altv/types-client', '@altv/types-server', '@altv/types-natives'],
    },
  },
  // Add dynamic routes
  routes,
});