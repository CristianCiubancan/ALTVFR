import { describe, it, expect } from 'vitest';
import { normalizePath, isWindows } from '../../../scripts/platform-utils';
import path from 'path';

// Sample test file to demonstrate testing setup
describe('Platform utilities', () => {
  it('should normalize paths correctly', () => {
    const testPath = '/test/path/to/file.txt';
    const normalized = normalizePath(testPath);
    
    // Make sure normalized path respects platform separator
    expect(normalized).toBe(path.resolve(testPath));
  });
  
  it('should detect platform correctly', () => {
    // This is a simple check to ensure the platform detection is working
    const platform = process.platform;
    expect(isWindows).toBe(platform === 'win32');
  });
});