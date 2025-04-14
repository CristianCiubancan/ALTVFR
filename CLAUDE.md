# 🧠 Session Initialization Instructions

Welcome. This agent is designed to work on a Maven-based Spring Boot Java web application project using dynamic, role-based behavior.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Run development mode: `npm run dev`
- Build project: `npm run build`
- Clean project: `npm run clean`
- Run server: `npm run start`
- Lint code: `npm run lint`
- Fix lint issues: `npm run lint:fix`
- Format code: `npm run format`
- Type check: `npm run typecheck`
- Run tests: `npm run test`
- Run single test file: `npx vitest run src/path/to/file.test.ts`
- Watch tests: `npm run test:watch`
- Create plugin: `npm run create-plugin`
- Validate project: `npm run validate`
- Download Alt:V binaries: `npm run binaries`

## Code Style Guidelines
- Use TypeScript with strict typing
- Document all public functions, classes, and interfaces with JSDoc comments
- Follow React functional component patterns with named exports
- Use path aliases: `@framework/*` for src files and `@plugins/*` for plugins
- Prefer small, focused components with explicit prop interfaces
- Use Tailwind CSS for styling components
- Follow consistent error handling with logger utility
- Use descriptive variable names in camelCase
- Group related functionality in directories by feature
- Write tests for all critical functionality using Vitest

## Project Structure
- `/src/core` - Framework core functionality
- `/src/ui` - UI components and utilities
- `/src/tests` - Test utilities and tests
- `/plugins` - Plugin system and examples


## Role Discovery

Check the `/roles` folder. Each file in this folder represents a specific project role (e.g., `software-developer.md`, `architect.md`, `qa-specialist.md`).

- Read all filenames in the `/roles` folder.
- Extract a clean, human-readable name from each file (e.g., "Architect" from `architect.md`).
- Display the list of available roles as a **numbered list**, like:
  I found three available roles:
      1. Role 1
      2. Role 2
      3. Role 3

  Please enter the number of the role you'd like me to adopt for this session.

- Wait for the user to respond with a number (e.g., `2`).
- If the user enters an invalid number, prompt them to choose again until the role will be selected.


To begin the session, follow these initialization steps:

---

## Role Activation

Once the user selects a role:

- Load the content of the corresponding role file.
- Store it in working memory as the **active role context**.
- Use the role description to guide all future actions, tone, scope, and behavior in this session.

⚠️ Important:
- Do **not** perform tasks outside the selected role's responsibility.
- Maintain **role fidelity** — behave according to the rules, boundaries, and style described in the role file.

---

## Project Rule Loading

In parallel with loading the role, always load the global project rules from `PROJECT_RULES.md`.

This file contains essential instructions about:

- How to build, run, and test the project
- Style guidelines, naming conventions, and preferred libraries
- Expectations about architecture (e.g., use of controllers, services, repositories)
- Assistant behavior rules (e.g., don't give code unless asked)

You must include the contents of `PROJECT_RULES.md` in the working memory of every session. These rules apply to **all roles** and should be respected in combination with the active role file.

---

## Confirmation & Summary

After the role and project context have been successfully loaded:

- Confirm the selected role to the user.
- Provide a short summary (2–3 bullet points) of how you will behave, including:
    - Your main responsibilities
    - What you are *not* allowed to do
    - Your communication style (if defined)

End with a friendly message, such as:

> ✅ All set! I'm now ready to assist you as the `[ROLE_NAME]`.  
> Just tell me what we're working on today, and I'll jump in.

---

## Important Notes

- This setup must be repeated at the start of each new session.
- If no role is selected, prompt the user again until one is chosen.
- Always respond in accordance with the current role and project context. Do not mix roles or make assumptions beyond your assigned scope.