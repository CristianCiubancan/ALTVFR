#!/usr/bin/env node

/**
 * Script to set up Husky git hooks
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isWindows, makeExecutable } from './platform-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Check if git repository exists
if (!fs.existsSync(path.join(rootDir, '.git'))) {
  console.log('No .git directory found. Initializing git repository...');
  
  try {
    // Initialize git repository
    const gitInit = spawn('git', ['init'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: isWindows
    });
    
    gitInit.on('close', (code) => {
      if (code !== 0) {
        console.error('Failed to initialize git repository');
        process.exit(1);
      }
      
      setupHusky();
    });
  } catch (error) {
    console.error('Failed to initialize git repository:', error.message);
    process.exit(1);
  }
} else {
  setupHusky();
}

function setupHusky() {
  console.log('Setting up Husky git hooks...');
  
  // Create .husky directory if it doesn't exist
  const huskyDir = path.join(rootDir, '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
  }
  
  // Create pre-commit hook if it doesn't exist
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  if (!fs.existsSync(preCommitPath)) {
    const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
`;
    
    fs.writeFileSync(preCommitPath, preCommitContent);
    makeExecutable(preCommitPath)
      .then(() => {
        console.log('Created pre-commit hook');
      })
      .catch((error) => {
        console.error('Failed to make pre-commit hook executable:', error.message);
      });
  }
  
  // Create _/.husky.sh file
  const huskyShDir = path.join(huskyDir, '_');
  if (!fs.existsSync(huskyShDir)) {
    fs.mkdirSync(huskyShDir, { recursive: true });
  }
  
  const huskyShPath = path.join(huskyShDir, 'husky.sh');
  if (!fs.existsSync(huskyShPath)) {
    const huskyShContent = `#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  export readonly husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  exit $exitCode
fi
`;
    
    fs.writeFileSync(huskyShPath, huskyShContent);
    makeExecutable(huskyShPath)
      .then(() => {
        console.log('Created husky.sh');
      })
      .catch((error) => {
        console.error('Failed to make husky.sh executable:', error.message);
      });
  }
  
  console.log('Husky git hooks have been set up successfully!');
}