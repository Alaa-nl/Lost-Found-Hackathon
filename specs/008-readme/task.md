# Tasks: Readme update

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Replace `README.md` entirely. Do not edit or move `specs/008-readme/docs.md/tooling_lecture.md`. Do not rewrite `AGENTS.md`. Do not change Header/Footer copy, `package.json` `name`, `.env.example`, or existing tests.

## 1. README.md

- [x] Delete the current scratch notes and default `create-next-app` README. Write a new student-facing `README.md` only.
- [x] H1: `# Todoish — course sample`. Opening paragraph: **Todoish** is a single-user todo sample for the course, not a production app.
- [x] Point at `AGENTS.md` for coding conventions. Do not copy `AGENTS.md` into the README.
- [x] Do not name, path, or link `tooling_lecture.md`. No “Learn More”, no “Deploy on Vercel”, no CI/CD, no SDD/spec-authoring tutorial, no how-to-add-a-component.
- [x] `## Stack` as markdown bullets (not a table), lecture order, each tool name linked (except SQLite). One-line role + file pointer as in the plan: React 19, Next.js, Prisma, Storybook, Atomic Design, Tailwind CSS, Vite, Vitest, Playwright, SQLite.
- [x] Vite line must say it is the Storybook/Vitest toolchain, not the Next.js bundler.
- [x] SQLite: no lecture URL; local DB used by Prisma; `prisma/dev.db` is gitignored and created on migrate; pointer `prisma/schema.prisma`.
- [x] `## Setup` numbered in this order only: Node/npm + clone → `npm install` → copy `.env.example` to `.env` (do not commit `.env`) → `npm run prisma:generate` → `npm run prisma:migrate` (applies existing migrations; creates `prisma/dev.db`) → `npm run dev` → http://localhost:3000/.
- [x] Do not list `npx playwright install` as a first-run step.
- [x] `## Scripts` after setup, not as first-run steps. Name + one line: `dev`, `storybook` (port 6006), `test`, `test:e2e`, `prisma:generate`, `prisma:migrate`.
- [x] `## File structure` ASCII tree with a one-line note per entry. Include the spec paths plus `page.tsx`, `layout.tsx`, `globals.css`, `vitest.config.ts`, `playwright.config.ts` as in the plan tree.
- [x] After the tree: action tests must not use `prisma/dev.db`; e2e uses `prisma/dev.db` and unique titles. Do not tell students to wipe the DB.

## 2. Student-visible labels

- [x] In `src/app/layout.tsx`, set `metadata.title` to `Todoish` and `metadata.description` to `A single-user todo app used as sample code for a frontend course.`
- [x] Do not change Header/Footer copy.
- [x] Do not change `package.json` `name`.

## 3. Code comments

- [x] Short `/* */` blocks only. Name the tool and the role of the file. Do not tutorialize. Do not comment `src/generated/prisma/`.
- [x] `src/app/page.tsx`: Next.js App Router route for `/`; loads todos and injects Server Actions into the page component.
- [x] `src/components/atoms/Button/Button.tsx`: Atomic Design atom; Tailwind variants in this file.
- [x] `src/actions/todo/createTodo/createTodo.ts`: `"use server"` stays first; comment immediately after — Server Action; Prisma write for a new todo.
- [x] `src/prisma/prismaClient.ts`: Prisma client for server code only; do not import from UI.
- [x] `.storybook/main.ts`: Storybook config; uses Vite (`@storybook/nextjs-vite`), not the Next.js bundler.
- [x] `vitest.config.ts`: add a role comment for projects `storybook`, `components`, and `actions` **above** the existing Storybook URL comment; keep that existing comment.

## 4. Verify

- [x] README has no leftover create-next-app / scratch-note content and does not mention `tooling_lecture.md`.
- [x] Running app document title is `Todoish`; description matches the metadata string above.
- [x] Header/Footer still say Todoish; `package.json` `name` is still `todoish`.
- [x] Existing Todoish tests unchanged.
