# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is **Review Triage** — a single Next.js 16 application (React 19, TypeScript, Tailwind CSS v4) for design feedback on preview deployments. There is no backend, database, or external service; all data is mock data in `src/mock/`.

### Commands

Standard commands are in `package.json`:

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` (ESLint) |
| Build | `npm run build` |

### Notes

- There is no test framework configured — no unit or integration tests exist.
- Both `package-lock.json` (npm) and `bun.lock` (Bun) are present; use **npm** since Bun is not pre-installed in the cloud VM.
- The project uses the React Compiler (`babel-plugin-react-compiler`) and `@base-ui/react` for UI components.
- Biome is configured (`biome.json`) but is not wired into `package.json` scripts; only ESLint is used via `npm run lint`.
