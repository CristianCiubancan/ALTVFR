# Plugins Directory

This directory contains plugin modules for the Alt:V React Framework.

## Directory Structure

Each plugin should have the following structure:

```
my-plugin/
├── manifest.json         # Plugin metadata
├── server.ts             # Server-side code (optional)
├── client.ts             # Client-side code (optional)
└── ui/                   # UI components (optional)
    ├── components/       # Plugin-specific React components
    ├── pages/            # Plugin page components
    ├── index.tsx         # Plugin UI entry point
    └── index.css         # Plugin styles with TailwindCSS
```

## Plugin Manifest

Each plugin must have a `manifest.json` file with the following structure:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Example plugin",
  "author": "Your Name",
  "dependencies": {
    "other-plugin": "^1.0.0"
  },
  "entry": {
    "server": "server.ts",
    "client": "client.ts"
  },
  "ui": {
    "main": "ui/index.tsx",
    "routes": [
      {
        "path": "/my-plugin",
        "component": "ui/pages/Main.tsx"
      }
    ]
  }
}
```

## Creating a Plugin

To create a new plugin, use the provided script:

```bash
npm run create-plugin my-plugin
```

This will generate a new plugin with the basic structure and boilerplate code.

## Plugin Guidelines

1. Follow the structure outlined above
2. Keep plugins focused on a specific functionality
3. Use dependency injection for services
4. Document all public APIs
5. Write unit tests for critical functionality
6. Use TypeScript for type safety
7. Follow the same code style as the framework