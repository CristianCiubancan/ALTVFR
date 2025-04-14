# Alt:V React Framework

A modular, hot-reloadable React plugin framework for Alt:V multiplayer.

## Features

- TypeScript support throughout
- Hot module reloading for development
- Automatic resource building
- React for UI components
- TailwindCSS v3 for styling
- Astro for static site generation and component islands
- Plugin system with dynamic loading

## Requirements

- Node.js 16+
- npm or yarn
- Alt:V server installation

## Quick Start

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/altv-react-framework.git
   cd altv-react-framework
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create your first plugin:
   ```
   npm run create-plugin my-plugin
   ```

4. Start development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

6. Start server:
   ```
   npm run start
   ```

## Project Structure

```
altv-react-framework/
├── package.json              # Root package with build scripts
├── tsconfig.json             # TypeScript configuration
├── rollup.config.js          # Bundling configuration
├── vite.config.ts            # Vite development server config
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS for TailwindCSS
├── src/                      # Framework core functionality
├── plugins/                  # Plugin modules
└── resources/                # Built Alt:V resources (output)
```

## Creating Plugins

To create a new plugin, run:

```
npm run create-plugin my-plugin
```

This will create a new plugin with the necessary structure:

```
plugins/my-plugin/
├── manifest.json             # Plugin metadata
├── server.ts                 # Server-side code (optional)
├── client.ts                 # Client-side code (optional)
└── ui/                       # React components (optional)
    ├── components/
    ├── pages/
    └── index.tsx
```

Each plugin is built into a separate Alt:V resource that can be loaded by the server.

## Development Workflow

1. Create plugins with `npm run create-plugin`
2. Run `npm run dev` to start the development server
3. Changes to plugin files will automatically trigger rebuilds
4. UI changes are hot-reloaded in real-time
5. Run `npm run build` to create production resources

## Documentation

- [Alt:V Documentation](https://docs.altv.mp/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Astro Documentation](https://docs.astro.build/en/getting-started/)

## License

MIT