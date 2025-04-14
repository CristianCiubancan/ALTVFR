#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { 
  isWindows, 
  isLinux, 
  getAltVExecutableName,
  normalizePath
} from './platform-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build resources first
console.log('Building resources...');
const buildProcess = spawn('node', [path.join(__dirname, 'build-resources.js')], {
  stdio: 'inherit',
  shell: isWindows // Use shell on Windows for better compatibility
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('Build failed');
    process.exit(code);
  }
  
  console.log('Resources built successfully');
  
  // Create server.toml if it doesn't exist
  const serverConfigPath = path.join(__dirname, '..', 'server.toml');
  if (!fs.existsSync(serverConfigPath)) {
    console.log('Creating default server configuration...');
    
    // Get the resource directories
    let resourceEntries = [];
    try {
      const resourcesDir = path.join(__dirname, '..', 'resources');
      if (fs.existsSync(resourcesDir)) {
        resourceEntries = fs.readdirSync(resourcesDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => `  "${dirent.name}"`);
      }
    } catch (error) {
      console.warn('Error reading resources directory:', error.message);
    }
    
    const defaultConfig = `# alt:V Server Configuration
name = "alt:V React Framework"
host = "0.0.0.0"
port = 7788
players = 128
password = ""
announce = false
gamemode = "Freeroam"
website = ""
language = "en"
description = "alt:V React Framework Server"
modules = [ "js-module" ]
resources = [
${resourceEntries.join(',\n')}
]
`;
    fs.writeFileSync(serverConfigPath, defaultConfig);
  }
  
  // Check if alt:V server executable exists
  const serverExecutable = getAltVExecutableName();
  const serverExecutablePath = path.join(__dirname, '..', serverExecutable);
  
  if (fs.existsSync(serverExecutablePath)) {
    console.log(`Starting alt:V server: ${serverExecutablePath}`);
    
    // Set executable permission on Linux
    if (isLinux) {
      try {
        fs.chmodSync(serverExecutablePath, '755');
      } catch (error) {
        console.warn(`Failed to set executable permissions: ${error.message}`);
      }
    }
    
    // Start the actual server
    const serverProcess = spawn(
      normalizePath(serverExecutablePath),
      [],
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
        shell: isWindows // Use shell on Windows for better compatibility
      }
    );
    
    serverProcess.on('error', (error) => {
      console.error(`Error starting alt:V server: ${error.message}`);
    });
    
    serverProcess.on('close', (code) => {
      console.log(`alt:V server exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle termination signals
    process.on('SIGINT', () => {
      console.log('Stopping alt:V server...');
      serverProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('Stopping alt:V server...');
      serverProcess.kill('SIGTERM');
    });
  } else {
    console.log(`alt:V server executable not found: ${serverExecutablePath}`);
    console.log('');
    console.log('To run a real alt:V server:');
    console.log('1. Download the alt:V server from https://altv.mp/#/downloads');
    console.log(`2. Place the ${serverExecutable} file in your project root`);
    console.log('3. Run this script again');
    console.log('');
    console.log('Server resources have been built and are ready for use.');
  }
});