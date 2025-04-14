# Core Framework Directory

This directory contains the core functionality of the Alt:V React Framework.

## Directory Structure

- **common/** - Shared code between client and server
  - **constants/** - Framework constants
  - **utils/** - Shared utility functions
  - **interfaces/** - Shared interfaces
  
- **plugin-system/** - Plugin management system
  - **interfaces/** - Plugin system interfaces
  - **validators/** - Plugin manifest validators
  
- **server/** - Server-side framework code
  - **api/** - Server-side API endpoints
  - **events/** - Server-side event handlers
  - **services/** - Server-side services
  
- **client/** - Client-side framework code
  - **api/** - Client-side API calls
  - **events/** - Client-side event handlers
  - **services/** - Client-side services

## Coding Guidelines

1. Use interfaces for all public APIs
2. Follow the single responsibility principle
3. Use dependency injection where appropriate
4. Document all public functions and classes with JSDoc comments
5. Organize related functionality into appropriate subdirectories
6. Write unit tests for all critical functionality