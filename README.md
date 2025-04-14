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

## Repository Status

[![Lint Status](https://img.shields.io/badge/lint-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![React](https://img.shields.io/badge/React-18.2-61dafb)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## Quick Start

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/altv-react-framework.git
   cd altv-react-framework
   ```

2. Run the platform-specific setup script:

   **Windows:**
   ```
   windows-setup.cmd
   ```

   **Linux/macOS:**
   ```
   chmod +x linux-setup.sh
   ./linux-setup.sh
   ```

   Or manually install dependencies:
   ```
   # Using npm
   npm install
   
   # OR using pnpm (recommended for better performance)
   pnpm install
   
   # OR using yarn
   yarn install
   ```

3. Create your first plugin:

   **Windows:**
   ```
   scripts\create-plugin.cmd my-plugin
   ```

   **Linux/macOS:**
   ```
   ./scripts/create-plugin.sh my-plugin
   ```

   **Any platform (npm):**
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

## Cross-Platform Compatibility

This framework is designed to work on Windows, Linux, and macOS (for development).

### Windows Notes

If you encounter any path-related errors on Windows:

1. Make sure you're using the latest Node.js LTS version (16+)
2. Check that all required directories exist by running:
   ```
   npm run ensure-dirs
   ```
3. Try using pnpm instead of npm, which often handles Windows paths better:
   ```
   pnpm build
   ```
4. Use the provided Windows command scripts:
   ```
   scripts\create-plugin.cmd my-plugin
   ```

### Linux Notes

1. Make sure to set executable permissions on the scripts:
   ```bash
   chmod +x scripts/*.sh
   ```
2. You can use the shell script version of the plugin creator:
   ```bash
   ./scripts/create-plugin.sh my-plugin
   ```
3. When running the Alt:V server, make sure the binary has proper permissions:
   ```bash
   chmod +x altv-server
   ```

### macOS Notes

macOS is supported for development purposes only, as Alt:V server does not officially support macOS for hosting. You can still build resources and develop plugins on macOS that will be deployed to Windows or Linux servers.

1. Follow the same steps as Linux for script permissions
2. For testing the UI components locally:
   ```bash
   npm run dev:ui
   ```

## Project Structure

The framework follows a clean, organized, and maintainable structure:

```
altv-react-framework/
├── package.json              # Root package with build scripts
├── tsconfig.json             # TypeScript configuration
├── rollup.server.config.js   # Server bundling configuration
├── vite.client.config.ts     # Client bundling configuration
├── astro.config.mjs          # Astro configuration
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS for TailwindCSS
├── src/                      # Framework core functionality
│   ├── core/                 # Core framework code
│   │   ├── common/           # Shared utilities and constants
│   │   ├── plugin-system/    # Plugin management system
│   │   ├── server/           # Server-side framework code
│   │   └── client/           # Client-side framework code
│   ├── ui/                   # UI framework components
│   │   ├── components/       # Reusable React components
│   │   ├── hooks/            # Custom React hooks
│   │   └── styles/           # Global styles and themes
│   ├── types/                # TypeScript type definitions
│   └── tests/                # Framework tests
├── plugins/                  # Plugin modules (example included)
│   └── example-plugin/       # Example plugin implementation
├── scripts/                  # Build and utility scripts
└── resources/                # Built Alt:V resources (output)
```

Each directory contains its own README.md with detailed documentation.

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