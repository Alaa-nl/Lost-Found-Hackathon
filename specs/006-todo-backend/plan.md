# Implementation Plan: TODO Backend

Source spec: [spec.md](./spec.md)

Add thin Prisma Server Actions for list/create/update/delete todos, Vitest node tests against `prisma/test.db`, and backend conventions in `AGENTS.md`. Do not wire the UI or change the schema.

## Technical context

- Next.js 16 / React 19 / Prisma 7 (SQLite) / Vitest (two browser projects today)
- Path alias `@/*` → `./src/*` in `tsconfig.json` and `vitest.config.ts`
- Prisma schema (`prisma/schema.prisma`): `Todo` with `id` (Int, autoincrement), `createdAt` (DateTime, default now()), `title` (String), `description` (String?). No completed/status. No User. Do not change schema or generated client
- Existing migration: `prisma/migrations/20260826133321_init_todos/`
- Prisma singleton: `src/prisma/prismaClient.ts` — `PrismaBetterSqlite3` + `process.env.DATABASE_URL ?? "file:./prisma/dev.db"`. Import from `@/prisma/prismaClient`. Do not change its default URL
- Generated client: `src/generated/prisma`. Server `Todo` type: `import type { Todo } from "@/generated/prisma/client"`. UI already uses `@/generated/prisma/browser` — leave UI imports alone
- `prisma.config.ts` reads `DATABASE_URL` via `env()` after `dotenv/config`
- Todo UI exists under `src/components` (controlled, not persisted). Home (`src/app/page.tsx`) is a Prisma write/read test page. Playwright e2e visits `/`
- No Route Handlers, Server Actions, or backend tests yet
- Vitest: `vitest.config.ts` projects `storybook` and `components` (browser). `npm test` is `vitest run`. Do not run `tests/e2e` through Vitest
- `.gitignore` already has `*.db` (covers `prisma/test.db`). No gitignore change
- No new npm packages. No Zod. No service/repo layer. No `revalidatePath` / cache APIs

## Target structure

```
src/actions/todo/helpers.ts
src/actions/todo/listTodos/listTodos.ts
src/actions/todo/createTodo/createTodo.ts
src/actions/todo/updateTodo/updateTodo.ts
src/actions/todo/deleteTodo/deleteTodo.ts
tests/actions/globalSetup.ts
tests/actions/setup.ts
tests/actions/todo/listTodos/listTodos.test.ts
tests/actions/todo/createTodo/createTodo.test.ts
tests/actions/todo/updateTodo/updateTodo.test.ts
tests/actions/todo/deleteTodo/deleteTodo.test.ts
vitest.config.ts                                    (add actions project)
AGENTS.md                                           (append Backend; amend Testing scripts bullet)
```

Rules:

- One folder per action; file matches folder (`createTodo/createTodo.ts`)
- No barrels (`index.ts`) at any actions level. Import the file: `@/actions/todo/createTodo/createTodo`
- Each action file: `"use server"` first; one async named export only (no default export)
- `helpers.ts` is not a Server Action (no `"use server"`). Named export `parseTodoFields` only — no other exports, no helpers folder
- Action tests under `tests/actions/`, mirroring action folders. Import actions with `@/`. No colocated tests under `src/`. No `parseTodoFields` test file

## Vitest node project

**File:** `vitest.config.ts`

Keep `storybook` and `components` unchanged. Add a third project. Do not add a root `test.include`.

```ts
{
  extends: true,
  test: {
    name: "actions",
    environment: "node",
    include: ["tests/actions/**/*.test.ts"],
    globalSetup: "./tests/actions/globalSetup.ts",
    setupFiles: "./tests/actions/setup.ts",
    env: {
      DATABASE_URL: "file:./prisma/test.db",
    },
    fileParallelism: false,
    maxWorkers: 1,
    pool: "forks",
  },
  server: {
    deps: {
      external: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
    },
  },
}
```

- `env.DATABASE_URL` must be set on this project so `prismaClient` is not constructed against `dev.db`
- Do not read or write `prisma/dev.db` from these tests
- No browser provider. Do not include Storybook or `src/components/**/*.test.tsx` here
- `npm test` stays `vitest run` (all three projects). No new npm script

## Test database

**File:** `tests/actions/globalSetup.ts`

On every `actions` project start, apply the existing migration to `prisma/test.db`. Do not add a migration. Do not import `prismaClient` here.

```ts
import { execSync } from "node:child_process";

export default function globalSetup() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: "file:./prisma/test.db",
    },
  });
}
```

dotenv will not override the `DATABASE_URL` already set on the child env.

**File:** `tests/actions/setup.ts`

```ts
import { afterAll, beforeEach } from "vitest";
import { prisma } from "@/prisma/prismaClient";

beforeEach(async () => {
  await prisma.todo.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

Tests may import `prisma` from `@/prisma/prismaClient` for seeding and assertions.

## Helpers

**File:** `src/actions/todo/helpers.ts`

```ts
export function parseTodoFields(input: {
  title: string;
  description: string | null;
}): { title: string; description: string | null } {
  const title = input.title.trim();
  if (title === "") {
    throw new Error("Title is required");
  }
  const description =
    input.description === null ? null : input.description.trim() || null;
  return { title, description };
}
```

- Empty title after trim → throw; do not write
- `description` `null` stays `null`. String: trim; empty after trim → `null` (not `""`)
- Ordinary `Error`. Tests assert rejection only — not class or message. The message above is an implementation detail, not a contract

Used by `createTodo` and `updateTodo` only.

## Server Actions

Call `prisma` from `@/prisma/prismaClient`. No `revalidatePath` / `revalidateTag`. No extra validation library. Let Prisma throw on missing `id` for update/delete (do not upsert, do not wrap in a custom class).

Return type is Prisma `Todo` (`id: number`, `createdAt: Date`, `title: string`, `description: string | null`). Infer it from Prisma, or annotate with `import type { Todo } from "@/generated/prisma/client"`. Do not import `@/generated/prisma/browser` in actions.

### `listTodos`

**File:** `src/actions/todo/listTodos/listTodos.ts`

Args: none. `findMany` ordered by `createdAt` descending.

```ts
"use server";

import { prisma } from "@/prisma/prismaClient";

export async function listTodos() {
  return prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
}
```

### `createTodo`

**File:** `src/actions/todo/createTodo/createTodo.ts`

Args: `{ title: string; description: string | null }`. Parse, then `prisma.todo.create`. Callers must not pass `id` / `createdAt`. Returns the created row.

```ts
"use server";

import { parseTodoFields } from "@/actions/todo/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function createTodo(input: {
  title: string;
  description: string | null;
}) {
  const data = parseTodoFields(input);
  return prisma.todo.create({ data });
}
```

### `updateTodo`

**File:** `src/actions/todo/updateTodo/updateTodo.ts`

Args: `{ id: number; title: string; description: string | null }`. Parse `title` / `description`. Update only those two fields for `id`. Do not change `id` or `createdAt`. Missing row: Prisma throws. Returns the updated row.

```ts
"use server";

import { parseTodoFields } from "@/actions/todo/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function updateTodo(input: {
  id: number;
  title: string;
  description: string | null;
}) {
  const { title, description } = parseTodoFields(input);
  return prisma.todo.update({
    where: { id: input.id },
    data: { title, description },
  });
}
```

### `deleteTodo`

**File:** `src/actions/todo/deleteTodo/deleteTodo.ts`

Args: `id: number`. `prisma.todo.delete`. Returns `void`. Missing row: Prisma throws.

```ts
"use server";

import { prisma } from "@/prisma/prismaClient";

export async function deleteTodo(id: number): Promise<void> {
  await prisma.todo.delete({ where: { id } });
}
```

## Tests

Import `{ expect, test }` from `vitest` (and `prisma` where needed). Import the named action with `@/` (e.g. `import { createTodo } from "@/actions/todo/createTodo/createTodo"`). No Testing Library, no jsdom.

Unknown `id`: use a number that is not in the table (e.g. `999_999`). Assert `rejects.toThrow()` only.

### `listTodos.test.ts`

Seed with `prisma.todo.create` and explicit staggered `createdAt` values (do not rely on `createTodo` insertion order). Assert titles newest-first.

### `createTodo.test.ts`

- Persists and returns a `Todo` with generated `id` (number) and `createdAt` (`Date`)
- Trims `title` and `description`
- `description` whitespace-only becomes `null`; `null` stays `null`
- Empty / whitespace-only `title` throws and writes nothing (`prisma.todo.count()` stays `0`)

### `updateTodo.test.ts`

- Updates `title` / `description` and returns the saved `Todo` (same `id`)
- Unknown `id` throws

### `deleteTodo.test.ts`

- Removes the row (`findUnique` is `null`)
- Unknown `id` throws

## AGENTS.md

Insert a **Backend** section after Testing and before `<!-- BEGIN:nextjs-agent-rules -->`. Do not remove or rewrite the Next.js agent block, UI, Stories, or Testing sections.

In Testing, change the scripts bullet from “both projects” to all Vitest projects (`storybook`, `components`, `actions`).

Document:

1. Server Actions under `src/actions/{resource}/{actionName}/{actionName}.ts`; one folder per action
2. `"use server"`; named export only; no default; no barrels; import `@/actions/todo/createTodo/createTodo`
3. Thin Prisma (no service/repo). Call `@/prisma/prismaClient` directly
4. Shared helpers file `src/actions/{resource}/helpers.ts` (not a Server Action)
5. No Route Handlers for this app’s backend
6. Input rules: trim `title`; empty title throws and does not write; `description` null stays null; trimmed empty description → `null`
7. Vitest node tests under `tests/actions/{resource}/{actionName}/{actionName}.test.ts` against `prisma/test.db`

Canonical example: `src/actions/todo/createTodo/createTodo.ts`.

## Implementation order

1. Add the `actions` Vitest project, `globalSetup.ts`, and `setup.ts`.
2. Add `src/actions/todo/helpers.ts`.
3. Add the four Server Action files.
4. Add the four test files.
5. Append Backend to `AGENTS.md`; amend the Testing scripts bullet.
6. Typecheck. Run `npm test` (all three Vitest projects).

## Out of scope

- Wiring TodoPage or any UI to these actions
- Route Handlers / REST; get-by-id
- Auth, User model, per-user lists
- Prisma schema changes; mark complete / status
- Service or repository layer
- Changing `src/app/page.tsx`, layouts, or Playwright e2e
- Changing shared UI components or their tests/stories
- Dark mode, design tokens, extra validation libraries
- `revalidatePath` / cache invalidation
- Custom error classes or fixed error-message contracts
- New npm packages or a dedicated `test:actions` script
- Changing `prismaClient`’s default `DATABASE_URL`
