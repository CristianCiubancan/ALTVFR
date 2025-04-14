# Scripts Directory

This directory contains build and utility scripts for the Alt:V React Framework.

## Scripts

- **build-resources.js** - Builds Alt:V resources from plugins
- **create-plugin.js** - Creates a new plugin with the basic structure
- **create-plugin.cmd** - Windows wrapper for create-plugin.js
- **create-plugin.sh** - Linux/macOS wrapper for create-plugin.js
- **ensure-dirs.js** - Ensures required directories exist
- **platform-utils.js** - Cross-platform utilities
- **plugin-loader.js** - Loads plugin manifests
- **setup-husky.js** - Sets up Husky git hooks
- **start-server.js** - Starts the Alt:V server
- **watch-server.js** - Watches for changes and rebuilds server code

## Usage

Most scripts are run through npm scripts defined in `package.json`:

```bash
# Create a new plugin
npm run create-plugin my-plugin

# Build resources
npm run build

# Start development server
npm run dev

# Start Alt:V server
npm run start
```

## Script Guidelines

1. Use ES modules for all scripts
2. Handle errors properly
3. Provide meaningful error messages
4. Use platform-utils.js for cross-platform compatibility
5. Document all functions with JSDoc comments
6. Use async/await for asynchronous code
7. Add console output for important operations

## Cross-Platform Compatibility

All scripts should work on both Windows and Linux/macOS platforms. Use the utilities in platform-utils.js to handle platform-specific differences.