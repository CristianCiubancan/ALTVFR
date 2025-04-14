# Alt:V React Framework Directory Structure

## Overview

This document provides a detailed explanation of the Alt:V React Framework directory structure to help maintainers and contributors understand the organization of the codebase.

## Root Directory

```
altv-react-framework/
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.client.config.ts     # Vite configuration for client-side code
├── rollup.server.config.js   # Rollup configuration for server-side code
├── astro.config.mjs          # Astro configuration for UI
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .editorconfig             # Editor configuration for consistent code style
├── .gitignore                # Git ignore file
├── README.md                 # Main project documentation
├── CONTRIBUTING.md           # Contribution guidelines
├── CHANGELOG.md              # Project changelog
├── DIRECTORY_STRUCTURE.md    # This file
└── ...
```

## Source Code

```
src/
├── core/                     # Framework core functionality
│   ├── common/               # Shared code between client and server
│   │   ├── constants/        # Shared constants
│   │   ├── utils/            # Shared utility functions
│   │   └── interfaces/       # Shared interfaces
│   ├── plugin-system/        # Plugin management system
│   │   ├── interfaces/       # Plugin system interfaces
│   │   ├── types.ts          # Plugin system type definitions
│   │   └── validators/       # Plugin manifest validators
│   ├── server/               # Server-side framework code
│   │   ├── api/              # Server-side API endpoints
│   │   ├── events/           # Server-side event handlers
│   │   ├── services/         # Server-side services
│   │   ├── index.ts          # Main server entry point
│   │   └── plugin-manager.ts # Server plugin manager implementation
│   └── client/               # Client-side framework code
│       ├── api/              # Client-side API calls
│       ├── events/           # Client-side event handlers
│       ├── services/         # Client-side services
│       ├── index.ts          # Main client entry point
│       └── plugin-manager.ts # Client plugin manager implementation
├── ui/                       # UI framework components
│   ├── components/           # Shared React components
│   │   ├── common/           # Generic UI components
│   │   ├── layout/           # Layout components
│   │   └── providers/        # React context providers
│   ├── hooks/                # Custom React hooks
│   │   └── useAltV.ts        # Hook for Alt:V CEF integration  
│   ├── styles/               # Global styles
│   │   └── theme.css         # Theme variables
│   └── utils/                # UI utility functions
├── types/                    # TypeScript type definitions
│   ├── global.d.ts           # Global type declarations
│   ├── vite-env.d.ts         # Vite-specific type declarations
│   └── alt-v.d.ts            # Alt:V specific type extensions
└── tests/                    # Test utilities and shared test code
    ├── mocks/                # Mock objects for testing
    ├── fixtures/             # Test fixtures
    └── utils/                # Test utility functions
```

## Plugins

```
plugins/
├── my-plugin/                # Example plugin
│   ├── manifest.json         # Plugin metadata and configuration
│   ├── server.ts             # Server-side plugin code
│   ├── client.ts             # Client-side plugin code
│   └── ui/                   # Plugin UI components
│       ├── components/       # Plugin-specific React components
│       │   └── App.tsx       # Main plugin component
│       ├── pages/            # Plugin page components
│       │   └── Main.tsx      # Main plugin page
│       ├── index.tsx         # Plugin UI entry point
│       └── index.css         # Plugin styles with TailwindCSS
└── ...
```

## Scripts

```
scripts/
├── build-resources.js        # Script to build Alt:V resources
├── create-plugin.js          # Script to create new plugins
├── create-plugin.cmd         # Windows wrapper for create-plugin
├── create-plugin.sh          # Linux/macOS wrapper for create-plugin
├── ensure-dirs.js            # Script to ensure required directories exist
├── platform-utils.js         # Cross-platform utilities
├── plugin-loader.js          # Plugin manifest loader
├── start-server.js           # Script to start the Alt:V server
├── watch-server.js           # Script for hot-reloading server code
├── windows-setup.cmd         # Windows setup script
└── linux-setup.sh            # Linux/macOS setup script
```

## Build Output

```
dist/                         # Build output directories
├── client/                   # Compiled client-side code
├── server/                   # Compiled server-side code
└── ui/                       # Compiled UI code

resources/                    # Generated Alt:V resources
└── [plugin-name]/            # One resource per plugin
    ├── resource.toml         # Alt:V resource configuration
    ├── server.js             # Compiled server-side code
    ├── client/               # Client-side code directory
    │   └── index.js          # Compiled client-side code
    └── ui/                   # UI assets directory
        ├── index.html        # UI entry point
        ├── bundle.js         # Compiled UI code
        └── styles.css        # Compiled styles
```

## Usage Notes

- **Adding new plugins**: Use the `create-plugin` script to generate new plugins with the correct structure
- **Framework extension**: New core features should be added to the appropriate subdirectory in `src/core/`
- **UI components**: Shared UI components should be placed in `src/ui/components/`
- **Type definitions**: Global types should be defined in `src/types/global.d.ts`
- **Build process**: The build process is configured in `vite.client.config.ts` and `rollup.server.config.js`

## Maintainer Guidelines

1. Keep related code together in the directory structure
2. Maintain clear separation between framework code and plugin code
3. Use consistent naming conventions throughout the codebase
4. Update this document when making significant structural changes
5. Follow the TypeScript module pattern for better code organization