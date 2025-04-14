# Contributing to Alt:V React Framework

Thank you for your interest in contributing to the Alt:V React Framework! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Focus on problem-solving rather than personalities
- Provide constructive feedback
- Follow the project's technical standards

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment using the setup scripts provided
4. Create a new branch for your feature or bugfix

## Project Structure

Please maintain the established project structure:

```
altv-react-framework/
├── src/                      # Core framework code
│   ├── core/                 # Framework internals
│   ├── ui/                   # Shared UI components
│   └── types/                # TypeScript type definitions
├── plugins/                  # Plugin modules (each in its own folder)
├── scripts/                  # Build and utility scripts
└── resources/                # Built Alt:V resources (output)
```

## Coding Standards

We use ESLint and Prettier to maintain code quality:

- Run `npm run lint` before submitting a pull request
- Run `npm run typecheck` to ensure TypeScript compliance
- Follow the established coding style in the existing codebase
- Use meaningful variable and function names
- Add appropriate comments for complex code sections
- Include JSDoc comments for public API methods

## Git Commit Guidelines

- Use meaningful commit messages that describe the change
- Start with a verb in the present tense (e.g., "Add feature", "Fix bug")
- Reference issue numbers when appropriate
- Keep commits focused on a single change
- Use conventional commit format:
  - `feat: add new feature`
  - `fix: correct issue with X`
  - `docs: update documentation`
  - `refactor: improve code structure`
  - `test: add test for feature Y`

## Pull Requests

1. Ensure your code passes linting and typechecking
2. Update documentation if necessary
3. Include tests for new features
4. Make sure your branch is up to date with the main branch
5. Submit a pull request with a clear description of the changes

## Cross-platform Compatibility

Ensure your code works on both Windows and Linux systems:

- Use platform-agnostic path handling with `path.join()` and `path.resolve()`
- Use the platform utilities provided in `platform-utils.js`
- Test on both Windows and Linux if possible
- Use the `.editorconfig` settings

## Documentation

- Update the README.md if your changes affect user-facing functionality
- Document new features, configuration options, or API changes
- Include examples of usage

## Testing

- Write unit tests for new functionality
- Ensure existing tests pass with your changes
- Test your changes in a real Alt:V environment if possible

Thank you for contributing to the Alt:V React Framework!