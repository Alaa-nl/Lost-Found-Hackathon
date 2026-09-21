# TODO integration

## Context

- Frontend is complete. Top-level UI: `src/components/pages/TodoPage/TodoPage.tsx` (`"use client"`). It owns in-memory `todos` from `initialTodos?: Todo[]` (default `[]`), and wires `TodoList` with `onAdd` / `onUpdate` / `onDelete`. It currently fabricates `id` / `createdAt` and **appends** on add. Initialize from `initialTodos` on mount only.
- `TodoList` / `TodoForm` / `TodoItem` are fully controlled. Callbacks are sync `void`. Today `TodoForm` clears fields and `TodoItem` exits edit mode immediately after calling the callback (this spec changes that wait/reset behavior).
- Backend actions exist (no Route Handlers): `listTodos`, `createTodo`, `updateTodo`, `deleteTodo` under `src/actions/todo/{actionName}/{actionName}.ts`. Import the file (no barrels). `listTodos` returns newest-first (`createdAt` desc). Create/update return the saved `Todo`; delete returns `void` and throws if `id` is missing.
- Row type is Prisma browser `Todo` from `@/generated/prisma/browser`. Do not import the Prisma client in UI.
- Home (`src/app/page.tsx`) is still the Prisma write/read test page (`Prisma setup test` heading; writes a row on every visit; `dynamic = "force-dynamic"`). Playwright: `tests/e2e/home.spec.ts` asserts that heading. Chromium only; `npm run test:e2e`; `webServer` is `npm run dev` against `prisma/dev.db`.
- `AGENTS.md` has UI, stories, testing, and backend conventions. No app-wiring / e2e-isolation conventions yet.
- Shared UI, stories, and tests follow `AGENTS.md` (no barrels; `@/` in app code; named import from `./ComponentName` in stories/tests).

## Goals

- Wire `/` to the todo UI and Server Actions so add/edit/delete persist in the database.
- Document the integration conventions in `AGENTS.md`.
- Replace the Prisma-setup Playwright smoke with e2e that covers the real todo app.

## Requirements

### Scope
- Change `src/app/page.tsx`, `TodoPage`, `TodoList`, `TodoForm`, and `TodoItem` (plus their stories/tests as needed), `tests/e2e`, and `AGENTS.md`.
- Do not change atoms, `PageTemplate`, Header/Footer, `layout.tsx`, Prisma schema, action APIs, or action tests.
- Do not add Route Handlers, a service/repo layer, barrels, new npm packages, or `revalidatePath` / cache APIs.
- One global list (no auth).

### App page
- `src/app/page.tsx` is an async Server Component. Remove the Prisma test UI and the direct `prisma.todo.create` / `findUnique` / `findMany` usage.
- Call `listTodos` from `@/actions/todo/listTodos/listTodos`. Render `TodoPage` from `@/components/pages/TodoPage/TodoPage` with `initialTodos` set to that result.
- Keep `export const dynamic = "force-dynamic"` so `/` always reads the current DB (required for reload assertions).
- No other routes.

### TodoPage persistence
- Keep `"use client"`, `initialTodos`, and local `todos` state. Still render `PageTemplate` → `TodoList` as today.
- Handlers call the mutation actions (import each file; do not call Prisma):
  - `onAdd({ title, description })` → `createTodo`. On success, **prepend** the returned `Todo` (newest first). Do not fabricate `id` / `createdAt`.
  - `onUpdate(todo)` → `updateTodo({ id, title, description })` only. On success, replace the item with the returned `Todo`. Do not change `id` / `createdAt` locally except as returned.
  - `onDelete(id)` → `deleteTodo(id)`. On success, remove that item.
- Await each action. Do not refetch `listTodos` after mutations. Do not use optimistic/fake rows.
- Server Action results serialize `Date`. Coerce `createdAt` to a `Date` on `initialTodos` and on every action result before putting it in state (`TodoItem` calls `toLocaleDateString()`).

### Errors
- If a mutation throws: do not change `todos`. Show a simple inline error in the `TodoPage` content column (the `max-w-2xl` wrapper).
- Copy: generic `Something went wrong. Try again.` Do not show `error.message` (Prisma/action text is not a UI contract).
- Placement: above `TodoList`. Use `role="alert"`.
- Clear the error on the next **successful** mutation. Leave it visible across failed retries.
- After setting the alert, **rethrow** so `TodoForm` / `TodoItem` can keep their local UI (values / edit mode).

### TodoForm / TodoItem / TodoList
- Callback types allow async: `void | Promise<void>` (Storybook `fn()` / `vi.fn()` stay valid).
- `TodoList` only forwards the callbacks; no extra behavior.
- `TodoForm` / `TodoItem` **await** the callback.
  - Add: clear title/description only after `onAdd` fulfills. On reject, keep the fields.
  - Save: exit edit mode only after `onUpdate` fulfills. On reject, stay in edit mode with the current field values.
  - Delete: await `onDelete`. On reject, the row stays (parent list unchanged).
- While that callback is pending, disable the control that fired it (Add, Save, or Delete) with native `disabled`. Do not use Button `loading`. Cancel stays enabled during Save.
- Do not call Server Actions or Prisma from these components.

### Stories and component tests
- `TodoPage` stories and `TodoPage.test.tsx` must not hit Prisma or the real actions.
- Mock `createTodo` / `updateTodo` / `deleteTodo` (and `listTodos` if imported) so they resolve with plausible `Todo` values (`id`, `Date` `createdAt`, given title/description).
- Keep existing `TodoPage` story `play` and tests, updated for prepend-on-add and mocked actions as needed. Empty list still shows `No todos yet.`
- Update `TodoForm` / `TodoItem` / `TodoList` stories and tests only as required for async callbacks (clear/exit-edit after await). Sync `fn()` / `vi.fn()` is enough; do not add persistence mocks in those files.

### Playwright e2e
- Replace `tests/e2e/home.spec.ts`. Do not keep the `Prisma setup test` assertion. File may be renamed (e.g. `tests/e2e/todo.spec.ts`) if the old name is misleading.
- Keep existing Playwright config (Chromium, `baseURL`, `npm run dev`, `prisma/dev.db`). No dedicated e2e database and no wipe.
- Isolate with unique titles (e.g. include a timestamp). Do not assume the list is empty; other rows may exist.
- Cover `/`:
  - App chrome: heading `Todoish` is visible; `Prisma setup test` is not.
  - Add: submit a unique title; it appears in the list.
  - Edit: change that item’s title and/or description; the updated text is visible.
  - Delete: delete that item; it is gone.
  - Reload: after add, and after edit, `page.goto("/")` (or reload) still shows the persisted title/description; after delete, reload still does not show it.

### AGENTS.md
- Append an integration section. Do not remove the Next.js agent block or existing UI / stories / testing / backend sections.
- Document:
  - `src/app/page.tsx` (Server Component) loads via `listTodos` and renders `TodoPage` with `initialTodos`.
  - Mutation actions are called only from `TodoPage`, not from `TodoForm` / `TodoItem` / `TodoList`, and not via Prisma in UI.
  - Import actions by file path (`@/actions/todo/createTodo/createTodo`). No barrels. No Route Handlers.
  - Apply returned rows locally (prepend on create); coerce `createdAt` to `Date`.
  - Page mutations: set the inline error and rethrow; molecules await callbacks and only reset local UI on success.
  - Component tests/stories mock actions on `TodoPage` only; Playwright e2e uses unique titles against `dev.db`.

## Out of scope

- Changing atoms, `PageTemplate`, Header/Footer, or `layout.tsx` (including site title metadata).
- Button `loading` spinner / pending indicator (disable the fired control only).
- Optimistic UI; refetch-after-mutation; `revalidatePath` / `router.refresh`.
- Route Handlers, get-by-id, auth, Prisma schema changes, complete/toggle.
- Dedicated e2e DB or wiping `dev.db`.
- Changing action implementations or `tests/actions`.
- Custom error classes or showing raw exception messages.
- Dark mode, design tokens, extra libraries.
