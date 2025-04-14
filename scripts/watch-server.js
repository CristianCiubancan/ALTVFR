#!/usr/bin/env node

import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to watch
const SERVER_DIR = path.join(__dirname, '..', 'src', 'core', 'server');
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');

// Build server files
function buildServer() {
  console.log('Building server files...');
  
  exec('rollup -c rollup.server.config.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Build error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Build stderr: ${stderr}`);
      return;
    }
    
    console.log('Server build complete');
  });
}

// Initial build
buildServer();

// Watch for changes in server files
console.log('Watching server files for changes...');

// Watch core server files
watch(SERVER_DIR, { recursive: true }, (event, filename) => {
  if (filename) {
    console.log(`${filename} changed, rebuilding...`);
    buildServer();
  }
});

// Watch plugin server files
watch(PLUGINS_DIR, { recursive: true }, (event, filename) => {
  if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
    // Only rebuild if it's a server file or manifest
    if (
      filename.includes('server.') ||
      filename.includes('manifest.json')
    ) {
      console.log(`Plugin file ${filename} changed, rebuilding...`);
      buildServer();
    }
  }
});