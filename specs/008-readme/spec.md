# Readme update

## Context

- This repo is sample code for a 4th-year IT class on React and Next.js. It is educational, not a production app.
- The running app is a single-user todo list named **Todoish** (`/` only). `package.json` `name` is already `todoish`. `src/app/layout.tsx` metadata is still the Create Next App default. Header/Footer already say Todoish.
- Current `README.md` is scratch notes plus the default `create-next-app` README. Replace it entirely. Do not preserve that content.
- In-class tooling slides live at `specs/008-readme/docs.md/tooling_lecture.md` (Marp). They are source material for what the README must cover. Do not move or edit that file in this spec.
- Stack (also listed in the lecture): React 19, Next.js 16 App Router, Prisma 7 (SQLite), Storybook 10, Atomic Design, Tailwind 4, Vite (Storybook/Vitest, not the Next bundler), Vitest, Playwright. Agent conventions live in `AGENTS.md`.
- SQLite DB files (`*.db`) and `.env` are gitignored. First clone is not `npm install` alone.

## Goals

- A student-facing `README.md`: what Todoish is, the stack, first-run setup, a repo map, npm scripts, and a pointer to `AGENTS.md`.
- Light comments on a small set of canonical source files so those files match the README map.
- Student-visible document title/description say Todoish.

## Requirements

### README.md

- Audience: students cloning this repo. Concise. No SDD/spec-authoring tutorial, no how-to-add-a-component, no copy of `AGENTS.md`.
- Open with: this is **Todoish**, a single-user todo sample for the course, not a production app.
- Point at `AGENTS.md` for coding conventions.
- Cover the same stack as the in-class tooling lecture. Do not link, path, or name `tooling_lecture.md` in the README (implementer/instructor source only).
- Stack section: every tool on the lecture “The Stack” slide, with a one-line “what it is here” and a file pointer. Cover:
  - React 19 — UI library; `src/components/`
  - Next.js — App Router; `src/app/page.tsx`, `src/app/layout.tsx`
  - Prisma — SQLite ORM; `prisma/schema.prisma`, `src/prisma/prismaClient.ts`
  - Storybook — UI in isolation; `.storybook/`, colocated `*.stories.tsx`
  - Atomic Design — `src/components/{atoms,molecules,organisms,templates,pages}`
  - Tailwind CSS — utility classes; `src/app/globals.css`
  - Vite — Storybook and Vitest toolchain, not the Next.js bundler; `.storybook/main.ts`, `vitest.config.ts`
  - Vitest — component/story/action tests; colocated `*.test.tsx`, `tests/actions/`
  - Playwright — e2e; `tests/e2e/`, `playwright.config.ts`
  - SQLite — local DB used by Prisma; schema in `prisma/schema.prisma`; `prisma/dev.db` is gitignored and created on migrate
- Setup (first run), in order:
  1. Node/npm (lecture). Clone this repo.
  2. `npm install`
  3. Copy `.env.example` to `.env` (do not commit `.env`)
  4. `npm run prisma:generate`
  5. `npm run prisma:migrate` (applies existing migrations; creates `prisma/dev.db`)
  6. `npm run dev` → [http://localhost:3000/](http://localhost:3000/)
- After setup, list these scripts (name + one line). Do not treat them as first-run steps: `dev`, `storybook` (port 6006), `test`, `test:e2e`, `prisma:generate`, `prisma:migrate`.
- File-structure outline (tree + one-line each). Include at least:
  - `src/app/` — routes (`page.tsx` is `/`)
  - `src/components/` — atomic UI; example `src/components/atoms/Button/Button.tsx`
  - `src/actions/` — Server Actions; example `src/actions/todo/createTodo/createTodo.ts`
  - `src/prisma/prismaClient.ts` — Prisma client used by actions
  - `src/generated/prisma/` — generated client; do not edit
  - `prisma/` — schema and migrations
  - `.storybook/` — Storybook config
  - `tests/actions/` — action tests (`prisma/test.db`)
  - `tests/e2e/` — Playwright (`prisma/dev.db`)
  - `specs/` — course specs
  - `AGENTS.md` — conventions for this repo
- Mention: action tests must not use `prisma/dev.db`; e2e uses `prisma/dev.db` and unique titles. Do not tell students to wipe the DB.
- No default Next.js “Learn More” / “Deploy on Vercel” sections. No CI/CD.

### Student-visible labels

- `src/app/layout.tsx` metadata `title`: `Todoish`. `description`: `A single-user todo app used as sample code for a frontend course.`
- Header/Footer already say Todoish; do not change them.
- Do not change `package.json` `name` (already `todoish`).

### Code comments

Add short comments only in these files (a few lines each). Name the tool and the role of the file. Do not tutorialize the whole file.

- `src/app/page.tsx` — Next.js route; loads todos and injects Server Actions into the page component
- `src/components/atoms/Button/Button.tsx` — Atomic Design atom; Tailwind variants in-file
- `src/actions/todo/createTodo/createTodo.ts` — Server Action; Prisma write
- `src/prisma/prismaClient.ts` — Prisma client for server code only
- `.storybook/main.ts` — Storybook + Vite
- `vitest.config.ts` — Vitest projects (storybook, components, actions)

Do not add comments to `src/generated/prisma/`.

## Out of scope

- Editing or moving `specs/008-readme/docs.md/tooling_lecture.md`
- Rewriting `AGENTS.md`, adding README rules there, or documenting the spec/skills workflow
- Component/convention how-tos (those stay in `AGENTS.md`)
- New npm packages, new routes, auth, extra product pages
- CI/CD, Vercel, Chromatic
- `npx playwright install` as a required first-run step
- Changing Header/Footer copy or existing Todoish tests
- Renaming `package.json` `name` (already `todoish`)
