/**
 * Platform utilities to help with cross-platform compatibility
 * between Windows, Linux, and macOS
 */
import { platform } from 'os';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Check if running on Windows
 */
export const isWindows = platform() === 'win32';

/**
 * Check if running on Linux
 */
export const isLinux = platform() === 'linux';

/**
 * Check if running on macOS
 */
export const isMacOS = platform() === 'darwin';

/**
 * Normalize paths to the current platform format
 * @param {string} inputPath - Path to normalize
 * @returns {string} Normalized path for current platform
 */
export function normalizePath(inputPath) {
  // Convert path separators to platform-specific ones
  // and resolve any relative paths
  return path.resolve(inputPath.replace(/[\/\\]/g, path.sep));
}

/**
 * Normalize a glob pattern for the current platform
 * @param {string} pattern - Glob pattern
 * @returns {string} Platform-specific glob pattern
 */
export function normalizeGlob(pattern) {
  // On Windows, we need to handle path separators in glob patterns
  if (isWindows) {
    return pattern.replace(/\//g, '\\\\');
  }
  return pattern;
}

/**
 * Convert a path for proper use in command line args based on platform
 * @param {string} inputPath - Path to convert
 * @returns {string} Path formatted for command line use
 */
export function toCommandLineArg(inputPath) {
  const normalizedPath = normalizePath(inputPath);
  
  // On Windows, wrap paths with spaces in double quotes
  if (isWindows && normalizedPath.includes(' ')) {
    return `"${normalizedPath}"`;
  }
  
  return normalizedPath;
}

/**
 * Get platform-appropriate npm run command
 * @param {string} script - Script name to run
 * @returns {string} Full command for executing the npm script
 */
export function getNpmRunCommand(script) {
  return isWindows ? `npm.cmd run ${script}` : `npm run ${script}`;
}

/**
 * Create a shebang line appropriate for the current platform
 * @returns {string} Platform-appropriate shebang line
 */
export function getShebang() {
  return isWindows ? '@echo off\r\n' : '#!/usr/bin/env node\n';
}

/**
 * Get the file extension for executable scripts on the current platform
 * @returns {string} Extension including the dot, or empty string on Unix
 */
export function getScriptExtension() {
  return isWindows ? '.cmd' : '';
}

/**
 * Get the Alt:V server executable name for the current platform
 * @returns {string} Platform-specific executable name
 */
export function getAltVExecutableName() {
  if (isWindows) {
    return 'altv-server.exe';
  } else if (isLinux) {
    return 'altv-server';
  } else {
    // macOS is not officially supported by Alt:V, but we'll handle it anyway
    return 'altv-server';
  }
}

/**
 * Make a file executable (Linux/macOS only)
 * @param {string} filePath - Path to the file to make executable
 */
export function makeExecutable(filePath) {
  if (isWindows) {
    // No need to make files executable on Windows
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    fs.chmod(filePath, '755', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Run a command with platform-specific considerations
 * @param {string} command - Command to run
 * @param {string[]} args - Command arguments
 * @param {object} options - Additional options for spawn
 * @returns {Promise<{stdout: string, stderr: string, code: number}>} Command result
 */
export function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    // Use shell on Windows for better compatibility
    const spawnOptions = {
      ...options,
      shell: isWindows,
    };
    
    const process = spawn(command, args, spawnOptions);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('error', (error) => {
      reject(error);
    });
    
    process.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });
  });
}

/**
 * Check if Node.js version is compatible
 * @param {number} minMajor - Minimum major version required 
 * @returns {Promise<boolean>} True if Node.js version is compatible
 */
export async function checkNodeVersion(minMajor = 16) {
  try {
    const { stdout } = await execPromise('node -v');
    const version = stdout.trim().replace('v', '');
    const major = parseInt(version.split('.')[0], 10);
    return major >= minMajor;
  } catch (error) {
    // If there's an error, Node.js might not be installed
    return false;
  }
}

/**
 * Ensure consistent line endings in a text file
 * @param {string} filePath - Path to the file
 * @param {boolean} useCRLF - Whether to use CRLF (Windows) line endings
 */
export function ensureLineEndings(filePath, useCRLF = isWindows) {
  try {
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Normalize to LF first
    content = content.replace(/\r\n/g, '\n');
    
    // Then convert to CRLF if needed
    if (useCRLF) {
      content = content.replace(/\n/g, '\r\n');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error ensuring line endings for ${filePath}: ${error.message}`);
  }
}