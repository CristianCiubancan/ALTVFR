#!/usr/bin/env node

import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to watch
const SERVER_DIR = path.join(__dirname, '..', 'src', 'core', 'server');
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const DIST_DIR = path.join(__dirname, '..', 'dist', 'server');

// Ensure dist directories exist
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Build server files
function buildServer() {
  console.log('Building server files...');
  
  exec('rollup -c rollup.server.config.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Build error: ${error.message}`);
      return;
    }
    
    if (stderr && stderr.trim() !== '') {
      console.error(`Build stderr: ${stderr}`);
      return;
    }
    
    if (stdout && stdout.trim() !== '') {
      console.log(stdout);
    }
    
    console.log('Server build complete');
  });
}

// Initial build
buildServer();

// Watch for changes in server files
console.log('Watching server files for changes...');

// Watch core server files
try {
  watch(SERVER_DIR, { recursive: true }, (event, filename) => {
    if (filename) {
      console.log(`${filename} changed, rebuilding...`);
      buildServer();
    }
  });
} catch (error) {
  console.error(`Error watching server directory: ${error.message}`);
}

// Watch plugin server files
try {
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
} catch (error) {
  console.error(`Error watching plugins directory: ${error.message}`);
}

process.on('SIGINT', () => {
  console.log('Stopping server watch...');
  process.exit(0);
});