# Tasks: TODO Backend

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not wire the UI, `src/app`, layouts, or e2e. Do not change the Prisma schema, generated client, or `prismaClient`’s default URL. Do not add Route Handlers, a service/repo layer, barrels, new npm packages, Zod, `revalidatePath`, or a `parseTodoFields` test file. Do not read or write `prisma/dev.db` from tests.

## 1. Vitest node project and test DB

- [x] Keep `storybook` and `components` projects in `vitest.config.ts` unchanged. Do not add a root `test.include`.
- [x] Add project `actions`: `environment: "node"`, `include: ["tests/actions/**/*.test.ts"]`, `env.DATABASE_URL` = `file:./prisma/test.db`, `fileParallelism: false`, `maxWorkers: 1`, `pool: "forks"`.
- [x] Externalize `better-sqlite3` and `@prisma/adapter-better-sqlite3` on that project (`server.deps.external`).
- [x] Add `tests/actions/globalSetup.ts`: default export runs `npx prisma migrate deploy` with `DATABASE_URL=file:./prisma/test.db`. Do not import `prismaClient`. Do not add a migration.
- [x] Add `tests/actions/setup.ts`: `beforeEach` → `prisma.todo.deleteMany()`; `afterAll` → `prisma.$disconnect()`.
- [x] Leave `npm test` as `vitest run` (all three projects). No new test script. No gitignore change (`*.db` already covers `prisma/test.db`).

## 2. Helpers

- [x] Create `src/actions/todo/helpers.ts` only (no helpers folder, no `"use server"`).
- [x] Named export `parseTodoFields` only. Args `{ title: string; description: string | null }`; return the same shape.
- [x] Trim `title`; empty after trim throws (ordinary `Error`). `description` `null` stays `null`; string is trimmed; empty after trim → `null`.

## 3. Server Actions

- [x] Create the four action files under `src/actions/todo/{actionName}/{actionName}.ts`. No `index.ts`.
- [x] Each action file starts with `"use server"`. One async named export; no default export.
- [x] Import `prisma` from `@/prisma/prismaClient`. No `revalidatePath` / cache APIs. No Zod. If annotating `Todo`, import from `@/generated/prisma/client` (not browser).
- [x] `listTodos`: no args; `findMany` `orderBy: { createdAt: "desc" }`; returns `Todo[]`.
- [x] `createTodo`: parse via `parseTodoFields`, then `prisma.todo.create`; returns the created `Todo`. Do not accept `id` / `createdAt`.
- [x] `updateTodo`: parse `title` / `description`; `prisma.todo.update` only those fields for `id`; returns the updated `Todo`. Missing row: let Prisma throw (no upsert).
- [x] `deleteTodo`: args `id: number`; `prisma.todo.delete`; returns `void`. Missing row: let Prisma throw.

## 4. Action tests

- [x] Add the four files under `tests/actions/todo/{actionName}/{actionName}.test.ts`. Import the named action with `@/`. No tests under `src/`. No Testing Library / jsdom.
- [x] `listTodos`: seed with `prisma.todo.create` and explicit staggered `createdAt`; assert newest-first. Do not seed via `createTodo` for this case.
- [x] `createTodo`: persists and returns generated `id` / `createdAt`; trims fields; empty description → `null`; empty title throws and writes nothing.
- [x] `updateTodo`: updates title/description and returns the saved `Todo`; unknown `id` throws (`rejects.toThrow()` only).
- [x] `deleteTodo`: removes the row; unknown `id` throws (`rejects.toThrow()` only).

## 5. Document conventions

- [x] Insert a Backend section in `AGENTS.md` after Testing and before `<!-- BEGIN:nextjs-agent-rules -->`. Do not remove or rewrite the Next.js agent block, UI, Stories, or Testing sections.
- [x] In Testing, update the scripts bullet so `test` is Vitest run of all projects (`storybook`, `components`, `actions`).
- [x] Document: `src/actions/{resource}/{actionName}/{actionName}.ts`; one folder per action; `"use server"`; named export only; no barrels; thin Prisma; `src/actions/{resource}/helpers.ts` (not a Server Action); no Route Handlers; trim/empty-title rules; Vitest node tests under `tests/actions/{resource}/{actionName}/{actionName}.test.ts` against `prisma/test.db`.
- [x] Canonical example: `src/actions/todo/createTodo/createTodo.ts`.

## 6. Verify

- [x] Typecheck (`npx tsc --noEmit` or project equivalent).
- [x] Run `npm test` (storybook, components, and actions). Confirm actions tests use `prisma/test.db` only.
- [x] Confirm no UI / `src/app` / e2e / schema wiring was added.
