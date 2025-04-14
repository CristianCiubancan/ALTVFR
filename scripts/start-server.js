#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build resources first
console.log('Building resources...');
const buildProcess = spawn('node', [path.join(__dirname, 'build-resources.js')], {
  stdio: 'inherit'
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
    const defaultConfig = `
# alt:V Server Configuration
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
  # List your plugin resources here
]
`;
    fs.writeFileSync(serverConfigPath, defaultConfig);
  }
  
  // Start alt:V server
  console.log('Starting alt:V server...');
  
  // NOTE: In a real implementation, you would start the actual alt:V server here
  // For this example, we'll just simulate it
  console.log('This is a placeholder for starting the actual alt:V server.');
  console.log('In a real implementation, you would run the altv-server executable here.');
  console.log('Server started! Press Ctrl+C to stop.');
});