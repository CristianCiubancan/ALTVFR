# Alt:V React Framework Architecture

## Overview

This framework enables the development of modular, hot-reloadable React plugins for Alt:V that automatically build to native Alt:V resources. The architecture accounts for Alt:V's environment limitations and React's dynamic module import constraints.

## Core Features

- TypeScript support throughout
- Hot module reloading for development
- Automatic resource building
- React for UI components
- TailwindCSS v3 for styling
- Astro for static site generation and component islands
- Plugin system with dynamic loading

## Project Structure

```
altv-react-framework/
├── package.json              # Root package with build scripts
├── tsconfig.json             # TypeScript configuration
├── rollup.config.js          # Bundling configuration
├── vite.config.ts            # Vite development server config
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS for TailwindCSS
├── src/
│   ├── core/                 # Framework core functionality
│   │   ├── plugin-manager/   # Plugin loading and management
│   │   ├── server/           # Alt:V server integration
│   │   ├── client/           # Alt:V client integration
│   │   └── utils/            # Shared utilities
│   ├── ui/                   # Shared UI components
│   │   ├── components/       # Base React components
│   │   └── layouts/          # Layout templates
│   └── types/                # TypeScript type definitions
├── plugins/                  # Plugin modules
│   ├── my-plugin/
│   │   ├── package.json      # Plugin metadata
│   │   ├── server.ts         # Server-side code
│   │   ├── client.ts         # Client-side code
│   │   ├── ui/               # React components
│   │   │   ├── components/   # UI components
│   │   │   └── pages/        # UI pages
│   │   └── manifest.json     # Plugin manifest
│   └── [other-plugins]/
└── resources/                # Built Alt:V resources (output)
    └── [plugin-resources]/   # One resource per plugin
```

## Technical Design

### Plugin System

Each plugin is a self-contained module with:
- Server-side code (TypeScript/JavaScript)
- Client-side code (TypeScript/JavaScript)
- React components for UI
- Plugin manifest defining metadata, dependencies and entry points

### Resource Building

1. Each plugin compiles to a standalone Alt:V resource
2. A custom rollup/vite plugin processes plugins and creates required Alt:V structure
3. Automatically generates `resource.toml` configuration
4. Bundles client & server code separately
5. Optimizes React components for CEF

### Hot Module Reloading

1. Development server watches for changes
2. Client-side HMR for React components via custom websocket
3. Server-side HMR using Alt:V's restart capabilities
4. Auto-refresh of CEF instances when UI changes

### React UI Integration

1. CEF browser instances for React UI rendering
2. Custom communication bridge between Alt:V and React
3. Precompiled React bundles for production
4. Component islands via Astro for better performance

### Dynamic Plugin Loading

1. Plugin registry with version control
2. Runtime plugin discovery and loading
3. Inter-plugin dependencies resolution
4. Plugin lifecycle hooks (init, start, stop, etc.)

## Implementation Details

### Plugin Registration

```typescript
// In plugin manifest.json
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

### UI Component Example

```tsx
// In plugins/my-plugin/ui/components/MyComponent.tsx
import React, { useEffect, useState } from 'react';
import { useAltV } from '@framework/hooks';

export const MyComponent: React.FC = () => {
  const { events } = useAltV();
  const [data, setData] = useState<string>('');
  
  useEffect(() => {
    // Listen to events from Alt:V
    const unsubscribe = events.on('myPlugin:getData', (newData) => {
      setData(newData);
    });
    
    // Request data from client
    events.emit('myPlugin:requestData');
    
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-2">My Plugin</h2>
      <p>{data}</p>
    </div>
  );
};
```

### Client-Side Code Example

```typescript
// In plugins/my-plugin/client.ts
import * as alt from 'alt-client';
import { registerClientPlugin } from '@framework/client';

const plugin = registerClientPlugin({
  name: 'my-plugin',
  
  onStart() {
    // Plugin initialization
    console.log('My plugin started on client');
    
    // Register UI event handlers
    alt.onServer('myPlugin:sendDataToUI', (data) => {
      alt.emit('cef:myPlugin:getData', data);
    });
    
    alt.on('cef:myPlugin:requestData', () => {
      alt.emitServer('myPlugin:requestData');
    });
  },
  
  onStop() {
    // Cleanup when plugin is stopped
    console.log('My plugin stopped on client');
  }
});

export default plugin;
```

### Server-Side Code Example

```typescript
// In plugins/my-plugin/server.ts
import * as alt from 'alt-server';
import { registerServerPlugin } from '@framework/server';

const plugin = registerServerPlugin({
  name: 'my-plugin',
  
  onStart() {
    // Plugin initialization
    console.log('My plugin started on server');
    
    // Register event handlers
    alt.onClient('myPlugin:requestData', (player) => {
      const data = 'Hello from server!';
      alt.emitClient(player, 'myPlugin:sendDataToUI', data);
    });
  },
  
  onStop() {
    // Cleanup when plugin is stopped
    console.log('My plugin stopped on server');
  }
});

export default plugin;
```

## NPM Scripts

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development vite build --watch",
    "build": "cross-env NODE_ENV=production vite build",
    "start": "node dist/server/start.js",
    "clean": "rimraf resources/* dist/*",
    "lint": "eslint --ext .ts,.tsx src plugins",
    "typecheck": "tsc --noEmit",
    "create-plugin": "node scripts/create-plugin.js",
    "build-plugin": "node scripts/build-plugin.js",
    "test": "vitest run"
  }
}
```

## Development Workflow

1. Create a new plugin: `npm run create-plugin my-plugin`
2. Develop plugin with hot reloading: `npm run dev`
3. Test plugin in Alt:V environment
4. Build for production: `npm run build`
5. Start Alt:V server with plugins: `npm run start`