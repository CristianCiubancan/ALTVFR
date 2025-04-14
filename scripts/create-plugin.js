#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { ensurePluginsDirectory } from './plugin-loader.js';
import { isWindows, getNpmRunCommand } from './platform-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure plugins directory exists
ensurePluginsDirectory();

// Get plugin name from command line arguments
const pluginName = process.argv[2];

if (!pluginName) {
  console.error('Please provide a plugin name');
  console.error('Usage: npm run create-plugin my-plugin');
  process.exit(1);
}

// Validate plugin name
if (!/^[a-z0-9-]+$/.test(pluginName)) {
  console.error('Plugin name must contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get plugin details from user
rl.question('Plugin description: ', (description) => {
  rl.question('Author: ', (author) => {
    rl.question('Include server-side code? (y/n): ', (hasServer) => {
      rl.question('Include client-side code? (y/n): ', (hasClient) => {
        rl.question('Include UI components? (y/n): ', (hasUI) => {
          // Create plugin
          try {
            createPlugin(pluginName, {
              description: description || `${pluginName} plugin for alt:V`,
              author: author || 'Anonymous',
              hasServer: hasServer.toLowerCase() === 'y',
              hasClient: hasClient.toLowerCase() === 'y',
              hasUI: hasUI.toLowerCase() === 'y'
            });
          } catch (error) {
            console.error(`Error creating plugin: ${error.message}`);
            process.exit(1);
          }
          
          rl.close();
        });
      });
    });
  });
});

/**
 * Create a new plugin
 */
function createPlugin(name, options) {
  const pluginDir = path.join(__dirname, '..', 'plugins', name);
  
  // Check if plugin already exists
  if (fs.existsSync(pluginDir)) {
    console.error(`Plugin ${name} already exists`);
    process.exit(1);
  }
  
  // Create plugin directory
  fs.mkdirSync(pluginDir, { recursive: true });
  
  // Create manifest.json
  const manifest = {
    name,
    version: '0.1.0',
    description: options.description,
    author: options.author,
    dependencies: {},
    entry: {}
  };
  
  // Add server entry if needed
  if (options.hasServer) {
    manifest.entry.server = 'server.ts';
    
    // Create server.ts
    const serverPath = path.join(pluginDir, 'server.ts');
    const serverTemplate = `import * as alt from 'alt-server';
import { registerServerPlugin } from '@framework/core/server';

const plugin = registerServerPlugin({
  name: '${name}',
  version: '0.1.0',
  
  onStart() {
    alt.log('${name} plugin started on server');
    
    // TODO: Add your server-side code here
  },
  
  onStop() {
    alt.log('${name} plugin stopped on server');
    
    // TODO: Add cleanup code here
  }
});

export default plugin;
`;
    
    fs.writeFileSync(serverPath, serverTemplate);
  }
  
  // Add client entry if needed
  if (options.hasClient) {
    manifest.entry.client = 'client.ts';
    
    // Create client.ts
    const clientPath = path.join(pluginDir, 'client.ts');
    const clientTemplate = `import * as alt from 'alt-client';
import { registerClientPlugin, ui } from '@framework/core/client';

const plugin = registerClientPlugin({
  name: '${name}',
  version: '0.1.0',
  
  onStart() {
    alt.log('${name} plugin started on client');
    
    // TODO: Add your client-side code here
    
    // Example: Show UI when a key is pressed
    alt.on('keyup', (key) => {
      if (key === 0x4B) { // K key
        ui.show('/${name}');
      }
    });
  },
  
  onStop() {
    alt.log('${name} plugin stopped on client');
    
    // TODO: Add cleanup code here
  }
});

export default plugin;
`;
    
    fs.writeFileSync(clientPath, clientTemplate);
  }
  
  // Add UI components if needed
  if (options.hasUI) {
    manifest.ui = {
      main: 'ui/index.tsx',
      routes: [
        {
          path: `/${name}`,
          component: 'ui/pages/Main.tsx'
        }
      ]
    };
    
    // Create UI directories
    const uiDir = path.join(pluginDir, 'ui');
    const componentsDir = path.join(uiDir, 'components');
    const pagesDir = path.join(uiDir, 'pages');
    
    fs.mkdirSync(uiDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.mkdirSync(pagesDir, { recursive: true });
    
    // Create index.tsx
    const indexPath = path.join(uiDir, 'index.tsx');
    const indexTemplate = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    
    fs.writeFileSync(indexPath, indexTemplate);
    
    // Create index.css with TailwindCSS imports
    const cssPath = path.join(uiDir, 'index.css');
    const cssTemplate = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-altv-background text-white;
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
`;
    
    fs.writeFileSync(cssPath, cssTemplate);
    
    // Create App.tsx
    const appPath = path.join(componentsDir, 'App.tsx');
    const appTemplate = `import React, { useState, useEffect } from 'react';
import { useAltV } from '@framework/ui/hooks/useAltV';

export default function App() {
  const { isConnected, events } = useAltV();
  const [clickCount, setClickCount] = useState(0);
  
  // Platform detection
  const [platform, setPlatform] = useState<string>('unknown');
  
  useEffect(() => {
    // Try to detect platform from user agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('windows')) {
      setPlatform('Windows');
    } else if (userAgent.includes('linux')) {
      setPlatform('Linux');
    } else if (userAgent.includes('mac')) {
      setPlatform('macOS');
    }
    
    // Listen for click events from the client
    if (isConnected) {
      const unsubscribe = events.on('${name}:buttonResponse', () => {
        setClickCount(prev => prev + 1);
      });
      
      return () => unsubscribe();
    }
  }, [isConnected, events]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-altv-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-altv-primary">${name}</h1>
        <p className="text-gray-300 mb-2">
          {isConnected 
            ? 'Connected to alt:V' 
            : 'Not connected to alt:V - running in browser mode'}
        </p>
        <p className="text-gray-400 mb-4 text-sm">
          Running on {platform}
        </p>
        <button
          className="bg-altv-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            events.emit('${name}:buttonClicked');
            if (!isConnected) {
              // In browser mode, simulate the response
              setClickCount(prev => prev + 1);
            }
          }}
        >
          Click Me
        </button>
        {clickCount > 0 && (
          <p className="mt-4 text-green-400">
            Button clicked {clickCount} {clickCount === 1 ? 'time' : 'times'}
          </p>
        )}
      </div>
    </div>
  );
}
`;
    
    fs.writeFileSync(appPath, appTemplate);
    
    // Create Main.tsx
    const mainPath = path.join(pagesDir, 'Main.tsx');
    const mainTemplate = `import React from 'react';
import App from '../components/App';

export default function Main() {
  return <App />;
}
`;
    
    fs.writeFileSync(mainPath, mainTemplate);
  }
  
  // Write manifest.json
  fs.writeFileSync(
    path.join(pluginDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`Plugin ${name} created successfully!`);
  console.log(`Next steps:`);
  console.log(`1. Customize your plugin code in plugins/${name}/`);
  
  // Platform-specific commands
  const devCommand = isWindows ? 'npm run dev' : 'npm run dev';
  const buildCommand = isWindows ? 'npm run build' : 'npm run build';
  
  console.log(`2. Run \`${devCommand}\` to start development server`);
  console.log(`3. Run \`${buildCommand}\` to build for production`);
}