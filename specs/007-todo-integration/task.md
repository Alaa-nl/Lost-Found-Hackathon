# Tasks: TODO Integration

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not change atoms, `PageTemplate`, Header/Footer, `layout.tsx`, Prisma schema, action files, action tests, `.storybook/preview.tsx`, or `playwright.config.ts`. Do not add Route Handlers, barrels, `__mocks__`, extra helper files, new npm packages, `revalidatePath`, optimistic UI, or Button `loading` for pending. Do not import the Prisma client in UI. Do not import action modules from `TodoPage` / `TodoForm` / `TodoItem` / `TodoList`.

## 1. TodoForm / TodoItem / TodoList async callbacks

- [x] Widen `onAdd` / `onUpdate` / `onDelete` to `void | Promise<void>` on TodoForm, TodoItem, and TodoList. TodoList only forwards; no extra behavior.
- [x] Do not call Server Actions or Prisma from these three components.
- [x] TodoForm: `handleSubmit` is `async`; await `onAdd`; clear title/description only after fulfill; on reject keep the fields.
- [x] TodoForm: local `adding` flag; Add `disabled={title.trim() === "" || adding}`; re-enable in `finally`. Do not use Button `loading`.
- [x] TodoItem: await `onUpdate` / `onDelete`; exit edit only after `onUpdate` fulfills; on reject stay in edit with current values; on `onDelete` reject the row stays.
- [x] TodoItem: separate `saving` / `deleting` flags; disable Save while saving (`title.trim() === "" || saving`); disable Delete while deleting; Cancel stays enabled during Save; re-enable in `finally`.
- [x] Update Form/Item/List stories and tests only as required for the async return type. Keep `fn()` / `vi.fn()`. Do not add persistence mocks in those files. Do not add reject/delay tests.

## 2. TodoPage persistence and error

- [x] Keep `"use client"`, `initialTodos`, `PageTemplate` → `max-w-2xl` → `TodoList`. Dual export unchanged.
- [x] Add required props `createTodo` / `updateTodo` / `deleteTodo` with the inline signatures in the plan. Do not import action files. No default implementations.
- [x] Local unexported `toClientTodo`: `{ ...todo, createdAt: new Date(todo.createdAt) }`.
- [x] Init `todos` from `(initialTodos ?? []).map(toClientTodo)` on mount only.
- [x] `onAdd` awaits `createTodo({ title, description })`; on success **prepend** `toClientTodo(returned)`. Do not fabricate `id` / `createdAt`.
- [x] `onUpdate` awaits `updateTodo({ id, title, description })` only; on success replace that item with `toClientTodo(returned)`.
- [x] `onDelete` awaits `deleteTodo(id)`; on success remove that item.
- [x] Do not refetch `listTodos`. Do not use optimistic/fake rows.
- [x] On throw: do not change `todos`; set alert copy `Something went wrong. Try again.` (not `error.message`); **rethrow**. Clear the alert only on the next successful mutation.
- [x] Alert: inside the `max-w-2xl` wrapper, above `TodoList`, only when set: `<p className="mb-4 text-red-600" role="alert">`.

## 3. TodoPage stories and tests

- [x] Named import from `./TodoPage` only (no `@/`). Do not `vi.mock` / `sb.mock` action modules. Do not mock `listTodos`.
- [x] Pass `fn()` / `vi.fn()` mocks that resolve with plausible `Todo` values (`id`, `Date` `createdAt`, given title/description); `deleteTodo` resolves `void`. Helper stays in the story/test file.
- [x] Hide `createTodo`, `updateTodo`, `deleteTodo`, and `initialTodos` from controls.
- [x] Keep existing `Default` play and tests (empty → `No todos yet.`; `initialTodos` titles; add from empty; play types `Make sauce` and expects it visible). Update for required mocks and prepend-on-add as needed.
- [x] Do not add new named stories or error-path tests.

## 4. App page

- [x] `src/app/page.tsx`: async Server Component; keep `export const dynamic = "force-dynamic"`.
- [x] Remove Prisma test UI and all direct `prisma.todo.create` / `findUnique` / `findMany` usage.
- [x] `await listTodos()` from `@/actions/todo/listTodos/listTodos`. Render `TodoPage` from `@/components/pages/TodoPage/TodoPage` with `initialTodos` plus `createTodo` / `updateTodo` / `deleteTodo` imported by file path.
- [x] No other routes. Do not call Prisma from this file.

## 5. Playwright e2e

- [x] Delete `tests/e2e/home.spec.ts`. Add `tests/e2e/todo.spec.ts`. Do not change `playwright.config.ts`. No dedicated e2e DB and no wipe of `dev.db`.
- [x] One sequential test. Unique title `` `e2e-todo-${Date.now()}` ``. Do not assume an empty list. Do not assert `No todos yet.` Scope Edit/Save/Delete to the `listitem` that has that title.
- [x] `/`: heading `Todoish` visible; `Prisma setup test` not present.
- [x] Add the unique title; it appears. `page.goto("/")`; it still appears.
- [x] Edit that row’s title to `` `${title}-edited` ``; updated text visible. `page.goto("/")`; edited title still visible.
- [x] Delete that row; edited title gone. `page.goto("/")`; still gone.

## 6. Document conventions

- [x] Insert an **Integration** section in `AGENTS.md` after Backend and before `<!-- BEGIN:nextjs-agent-rules -->`. Do not remove or rewrite the Next.js agent block, UI, Stories, Testing, or Backend sections.
- [x] Document: `page.tsx` loads via `listTodos` and renders `TodoPage` with `initialTodos`; it imports mutation actions by file path and passes them as props.
- [x] Document: mutations are called only from `TodoPage` (not Form/Item/List, not Prisma in UI); `TodoPage` does not import action modules.
- [x] Document: import actions by file path (`@/actions/todo/createTodo/createTodo`); no barrels; no Route Handlers.
- [x] Document: apply returned rows locally (prepend on create); coerce `createdAt` to `Date`.
- [x] Document: page mutations set the inline `role="alert"` error and rethrow; molecules await callbacks and only reset local UI on success.
- [x] Document: tests/stories mock TodoPage action props only; Playwright e2e uses unique titles against `dev.db`.

## 7. Verify

- [x] Typecheck (`npx tsc --noEmit` or project equivalent).
- [x] `npm test` (storybook, components, actions).
- [x] `npm run test:e2e`.
- [x] Confirm no changes to atoms, `PageTemplate`, Header/Footer, `layout.tsx`, action implementations, `tests/actions`, `.storybook/preview.tsx`, or `playwright.config.ts`.
