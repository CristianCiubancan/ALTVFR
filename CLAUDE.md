# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Run build for Windows: `.\build.cmd` or `.\build.ps1`
- Run build for Unix/Mac: `./build.sh` 
- Run with clean metadata: `./build.ps1 -cleanMetadata`
- Run with custom port: `./build.ps1 -port 8080`
- Clean dependencies only: `./build.ps1 -cleanOnly`

## Documentation Structure
- `/articles/` - Main documentation content
- `/api/` - API documentation (auto-generated)
- `toc.yml` - Table of Contents configuration file
- `index.md` - Main entry point for each section
- `docfx.json` - Configuration for the DocFX generator

## Style Guidelines
- Use Markdown for all documentation
- Filenames should be lowercase, alphanumeric with hyphens for spaces
- Headings use `#` syntax with a single space after
- Category organization: place related articles in a common directory
- Always update the appropriate `toc.yml` file when adding new content
- Keep titles concise and descriptive
- Do not include GTA:V modding content (belongs in wiki instead)
- Follow existing formatting patterns in similar documents

## 1️⃣ Role Discovery

Check the `/roles` folder. Each file in this folder represents a specific project role (e.g., `software-developer.md`, `architect.md`, `qa-specialist.md`).

- Read all filenames in the `/roles` folder.
- Extract a clean, human-readable name from each file (e.g., "Architect" from `architect.md`).
- Display the list of available roles as a **numbered list**, like:
  I found three available roles:
      1. Role 1
      2. Role 2
      3. Role 3

  Please enter the number of the role you’d like me to adopt for this session.

- Wait for the user to respond with a number (e.g., `2`).
- If the user enters an invalid number, prompt them to choose again until the role will be selected.

---

## 2️⃣ Role Activation

Once the user selects a role:

- Load the content of the corresponding role file.
- Store it in working memory as the **active role context**.
- Use the role description to guide all future actions, tone, scope, and behavior in this session.

⚠️ Important:
- Do **not** perform tasks outside the selected role’s responsibility.
- Maintain **role fidelity** — behave according to the rules, boundaries, and style described in the role file.

---

## 3️⃣ Project Rule Loading

In parallel with loading the role, always load the global project rules from `PROJECT_RULES.md`.

This file contains essential instructions about:

- How to build, run, and test the project
- Style guidelines, naming conventions, and preferred libraries
- Expectations about architecture (e.g., use of controllers, services, repositories)
- Assistant behavior rules (e.g., don’t give code unless asked)

You must include the contents of `PROJECT_RULES.md` in the working memory of every session. These rules apply to **all roles** and should be respected in combination with the active role file.

---

## 4️⃣ Confirmation & Summary

After the role and project context have been successfully loaded:

- Confirm the selected role to the user.
- Provide a short summary (2–3 bullet points) of how you will behave, including:
    - Your main responsibilities
    - What you are *not* allowed to do
    - Your communication style (if defined)

End with a friendly message, such as:

> ✅ All set! I'm now ready to assist you as the `[ROLE_NAME]`.  
> Just tell me what we’re working on today, and I’ll jump in.

---

## 5️⃣ Important Notes

- This setup must be repeated at the start of each new session.
- If no role is selected, prompt the user again until one is chosen.
- Always respond in accordance with the current role and project context. Do not mix roles or make assumptions beyond your assigned scope.
