# TODO Backend

## Context

- Sample app for illustration; keep APIs simple.
- Prisma `Todo` (`prisma/schema.prisma`): `id` (`Int`, autoincrement), `createdAt` (`DateTime`, default `now()`), `title` (`String`), `description` (`String?`). No completed/status field. No User model.
- Prisma client singleton: `src/prisma/prismaClient.ts` (reads `DATABASE_URL`, default `file:./prisma/dev.db`). Generated client: `src/generated/prisma`.
- Todo UI exists under `src/components` (add/edit/delete via `onAdd` / `onUpdate` / `onDelete`). It is not wired to persistence. Item type is Prisma’s browser `Todo` from `@/generated/prisma/browser`.
- Home page (`src/app/page.tsx`) is a Prisma write/read test page. Playwright e2e visits `/` and asserts the `Prisma setup test` heading.
- No Route Handlers, Server Actions, or backend tests exist. Vitest has two browser projects only (Storybook + `src/components/**/*.test.tsx`).
- `AGENTS.md` documents shared UI, stories, and component tests only. No backend conventions yet.

## Goals

- Server Actions for todo list, create, update, and delete against Prisma.
- Thin actions that call Prisma directly (no service or repository layer).
- Vitest node tests for those actions, against a dedicated SQLite file.
- Document backend conventions in `AGENTS.md`.

## Requirements

### Scope
- Add the Server Actions below (and only those), the shared helpers file, plus Vitest node tests for each action under `tests/`.
- One global todo list (no auth, no owner/userId field).
- Do not change the Prisma schema or generated client.
- Do not wire the UI, `src/app/page.tsx`, layouts, routes, or e2e.
- Do not add Route Handlers / REST endpoints.
- Do not add a service or repository layer.
- Do not add new npm packages.

### Folder & files
- Actions live under `src/actions/todo/`, one folder per action named after the exported function. The action file matches the folder:
  - `src/actions/todo/listTodos/listTodos.ts`
  - `src/actions/todo/createTodo/createTodo.ts`
  - `src/actions/todo/updateTodo/updateTodo.ts`
  - `src/actions/todo/deleteTodo/deleteTodo.ts`
- Each action file starts with `"use server"`. Runtime export is one async named function (no default export).
- Required helpers file: `src/actions/todo/helpers.ts`. This file is **not** a Server Action (no `"use server"`). Named export `parseTodoFields` only. Do not put helpers in their own folder.
- No barrel files (`index.ts`) at any actions level. Import the file: `@/actions/todo/createTodo/createTodo`.
- Do not add a service/repo folder or extra layers.
- Tests live under `tests/actions/`, mirroring the action folders (e.g. `tests/actions/todo/createTodo/createTodo.test.ts`). No dedicated test file for `parseTodoFields`.

### Data
- Row type is Prisma `Todo`: `{ id: number; createdAt: Date; title: string; description: string | null }`.
- `id` and `createdAt` are Prisma-generated. Callers must not supply them on create. Update and delete must not change `id` or `createdAt`.
- Input rules (match the UI), implemented in `parseTodoFields` and used by `createTodo` and `updateTodo`:
  - Args: `{ title: string; description: string | null }`.
  - Trim `title`. After trim, empty `title` is invalid — throw. Do not write the row.
  - `description` `null` stays `null`. If it is a string, trim it; empty after trim becomes `null` (not `""`).
  - Return `{ title: string; description: string | null }`.
- Throws are ordinary exceptions. Tests assert rejection only — not a specific class or message.
- No complete/toggle. No extra fields.

### Server Actions

#### `listTodos`
- Location: `src/actions/todo/listTodos/listTodos.ts`.
- Args: none.
- Returns `Todo[]` ordered by `createdAt` descending (newest first).

#### `createTodo`
- Location: `src/actions/todo/createTodo/createTodo.ts`.
- Args: `{ title: string; description: string | null }`.
- Run `parseTodoFields` from `src/actions/todo/helpers.ts`, then insert via Prisma. Returns the created `Todo`.

#### `updateTodo`
- Location: `src/actions/todo/updateTodo/updateTodo.ts`.
- Args: `{ id: number; title: string; description: string | null }`.
- Run `parseTodoFields` from `src/actions/todo/helpers.ts` on `title` / `description`. Update only `title` and `description` for that `id`.
- If no row exists for `id`, throw. Do not create a row.
- Returns the updated `Todo`.

#### `deleteTodo`
- Location: `src/actions/todo/deleteTodo/deleteTodo.ts`.
- Args: `id: number`.
- Deletes the row. Returns `void`.
- If no row exists for `id`, throw.

### Conventions
- Call the existing `prisma` singleton from `@/prisma/prismaClient`. Do not change its default URL.
- No `revalidatePath` / `revalidateTag` / cache APIs (nothing in `src/app` consumes these actions yet).
- No extra validation library (no Zod, etc.).
- TypeScript: existing project `tsconfig` only.

### Tests
- Add a Vitest **node** project (not browser). Include `tests/actions/**/*.test.ts` only. Do not run these through the Storybook or components browser projects. Do not run `tests/e2e` through Vitest.
- Place tests under `tests/actions/`, mirroring each action folder: `tests/actions/todo/{actionName}/{actionName}.test.ts`.
  - `tests/actions/todo/listTodos/listTodos.test.ts`
  - `tests/actions/todo/createTodo/createTodo.test.ts`
  - `tests/actions/todo/updateTodo/updateTodo.test.ts`
  - `tests/actions/todo/deleteTodo/deleteTodo.test.ts`
- Import the named action with `@/` (e.g. `import { createTodo } from "@/actions/todo/createTodo/createTodo"`). Do not colocate action tests under `src/`.
- Do not add Testing Library or jsdom.
- Dedicated DB: `prisma/test.db`. Set `DATABASE_URL` to `file:./prisma/test.db` on the Vitest node project **in config** (so the Prisma singleton is not created against `dev.db`). Do not read or write `prisma/dev.db` from these tests.
- Apply the existing schema/migrations to `prisma/test.db` so `Todo` exists. Do not add a new migration. Gitignore `prisma/test.db`.
- Wipe all `Todo` rows before each test. Do not run node tests in parallel against that file (SQLite).
- Minimum cases:
  - `listTodos`: returns todos newest-first (`createdAt` descending).
  - `createTodo`: persists and returns a `Todo` with generated `id` / `createdAt`; trims fields; empty description becomes `null`; empty title throws and writes nothing.
  - `updateTodo`: updates title/description and returns the saved `Todo`; unknown `id` throws.
  - `deleteTodo`: removes the row; unknown `id` throws.

### AGENTS.md
- Append a backend section below the existing content. Do not remove the Next.js agent block or the UI / stories / testing sections.
- Document: Server Actions under `src/actions/{resource}/{actionName}/{actionName}.ts`; one folder per action; `"use server"`; named export only; no barrels; thin Prisma (no service/repo); shared helpers file `src/actions/{resource}/helpers.ts` (not a Server Action); no Route Handlers for this app’s backend; input trim/empty-title rules; Vitest node tests under `tests/actions/{resource}/{actionName}/{actionName}.test.ts` against `prisma/test.db`.
- Canonical example: `src/actions/todo/createTodo/createTodo.ts`.

## Out of scope

- Wiring TodoPage or any UI to these actions.
- Route Handlers / REST.
- Get-by-id.
- Auth, User model, per-user lists.
- Prisma schema changes; mark complete / status.
- Service or repository layer.
- Changing `src/app/page.tsx`, layouts, or Playwright e2e.
- Changing shared UI components or their tests/stories.
- Dark mode, design tokens, extra validation libraries.
- `revalidatePath` / cache invalidation.
- Custom error classes or fixed error messages.
