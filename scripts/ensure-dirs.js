import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensurePluginsDirectory } from './plugin-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to ensure exist
const dirs = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', 'dist', 'client'),
  path.join(__dirname, '..', 'dist', 'server'),
  path.join(__dirname, '..', 'dist', 'ui'),
  path.join(__dirname, '..', 'resources'),
];

// Create directories if they don't exist
for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}: ${error.message}`);
    }
  }
}

// Ensure plugins directory exists
try {
  ensurePluginsDirectory();
} catch (error) {
  console.error(`Error ensuring plugins directory: ${error.message}`);
}

console.log('All directories are ready.');