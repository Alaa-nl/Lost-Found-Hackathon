# Implementation Plan: TODO Integration

Source spec: [spec.md](./spec.md)

Wire `/` to `TodoPage` and Server Actions so add/edit/delete persist, document the integration conventions in `AGENTS.md`, and replace the Prisma-setup Playwright smoke with a todo e2e flow.

## Technical context

- Next.js 16 / React 19 / Prisma 7 (SQLite) / Storybook 10 / Vitest browser + node / Playwright Chromium
- `src/app/page.tsx` is the Prisma write/read test page (`Prisma setup test`; `dynamic = "force-dynamic"`)
- `TodoPage` (`"use client"`) owns in-memory `todos` from `initialTodos?: Todo[]` (default `[]`), appends on add, fabricates `id` / `createdAt`. `PageTemplate` → `TodoList`
- `TodoForm` / `TodoItem` / `TodoList` are fully controlled; callbacks are sync `void`. Form clears and item exits edit immediately after calling the callback
- Actions (do not change): `listTodos`, `createTodo`, `updateTodo`, `deleteTodo` under `src/actions/todo/{actionName}/{actionName}.ts`. Import the file (no barrels). `listTodos` is newest-first. Create/update return the saved `Todo`; delete returns `void` and throws if missing
- Row type in UI: Prisma browser `Todo` from `@/generated/prisma/browser`. Do not import the Prisma client in UI
- Playwright: `tests/e2e/home.spec.ts`, Chromium, `baseURL` `http://localhost:3000`, `webServer` `npm run dev` against `prisma/dev.db`. Keep `playwright.config.ts` unchanged
- No app-wiring / e2e-isolation conventions in `AGENTS.md` yet
- No Route Handlers, barrels, new npm packages, `revalidatePath` / cache APIs, or Button `loading` for pending

## Target structure

```
src/app/page.tsx
src/components/pages/TodoPage/TodoPage.tsx
src/components/pages/TodoPage/TodoPage.stories.tsx
src/components/pages/TodoPage/TodoPage.test.tsx
src/components/organisms/TodoList/TodoList.tsx
src/components/organisms/TodoList/TodoList.stories.tsx
src/components/organisms/TodoList/TodoList.test.tsx
src/components/molecules/TodoForm/TodoForm.tsx
src/components/molecules/TodoForm/TodoForm.stories.tsx
src/components/molecules/TodoForm/TodoForm.test.tsx
src/components/molecules/TodoItem/TodoItem.tsx
src/components/molecules/TodoItem/TodoItem.stories.tsx
src/components/molecules/TodoItem/TodoItem.test.tsx
tests/e2e/todo.spec.ts                              (new; delete tests/e2e/home.spec.ts)
AGENTS.md                                           (append Integration)
```

Do not change atoms, `PageTemplate`, Header/Footer, `layout.tsx`, Prisma schema, action files, action tests, `.storybook/preview.tsx`, or `playwright.config.ts`. Do not add `__mocks__`, Route Handlers, barrels, or extra helper files.

## App page

**File:** `src/app/page.tsx`

Async Server Component. Remove the Prisma test UI and all `prisma.todo.create` / `findUnique` / `findMany` usage.

```ts
import { createTodo } from "@/actions/todo/createTodo/createTodo";
import { deleteTodo } from "@/actions/todo/deleteTodo/deleteTodo";
import { listTodos } from "@/actions/todo/listTodos/listTodos";
import { updateTodo } from "@/actions/todo/updateTodo/updateTodo";
import { TodoPage } from "@/components/pages/TodoPage/TodoPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialTodos = await listTodos();
  return (
    <TodoPage
      initialTodos={initialTodos}
      createTodo={createTodo}
      updateTodo={updateTodo}
      deleteTodo={deleteTodo}
    />
  );
}
```

- Keep `export const dynamic = "force-dynamic"`
- No other routes. Do not call Prisma from this file

## TodoPage persistence

**File:** `src/components/pages/TodoPage/TodoPage.tsx`

Keep `"use client"`, `PageTemplate` → `max-w-2xl` wrapper → `TodoList`. Do not import action modules (stories/tests must not load Prisma).

```ts
export type TodoPageProps = {
  initialTodos?: Todo[];
  createTodo: (input: {
    title: string;
    description: string | null;
  }) => Promise<Todo>;
  updateTodo: (input: {
    id: number;
    title: string;
    description: string | null;
  }) => Promise<Todo>;
  deleteTodo: (id: number) => Promise<void>;
};
```

Inline those signatures in this file. Action props are required (no defaults).

Local helper (same file, not exported):

```ts
function toClientTodo(todo: Todo): Todo {
  return { ...todo, createdAt: new Date(todo.createdAt) };
}
```

- `useState<Todo[]>(() => (initialTodos ?? []).map(toClientTodo))` — mount only; coerce `createdAt`
- `errorMessage: string | null` state, default `null`

Handlers are async. Await the prop. Do not refetch `listTodos`. Do not use optimistic/fake rows. Do not fabricate `id` / `createdAt`.

- `onAdd({ title, description })` → `await createTodo({ title, description })`. On success, **prepend** `toClientTodo(returned)`, clear `errorMessage`
- `onUpdate(todo)` → `await updateTodo({ id: todo.id, title: todo.title, description: todo.description })` only. On success, replace that item with `toClientTodo(returned)`, clear `errorMessage`. Do not change `id` / `createdAt` except as returned
- `onDelete(id)` → `await deleteTodo(id)`. On success, remove that item, clear `errorMessage`

On throw: do not change `todos`. Set `errorMessage` to `Something went wrong. Try again.` (do not use `error.message`). **Rethrow** the same error.

Alert: inside the `max-w-2xl` wrapper, **above** `TodoList`. Render only when `errorMessage` is set:

```tsx
{errorMessage ? (
  <p className="mb-4 text-red-600" role="alert">
    {errorMessage}
  </p>
) : null}
```

Clear the alert only on the next **successful** mutation. Leave it visible across failed retries.

## TodoForm / TodoItem / TodoList

Callback return types: `void | Promise<void>`. `TodoList` only forwards; no extra behavior. Do not call Server Actions or Prisma from these components. Do not use Button `loading`.

**TodoForm:** `handleSubmit` becomes `async`. Await `onAdd`. Clear title/description only after it fulfills. On reject, keep the fields. Local `adding` state: disable Add with native `disabled` while pending (`disabled={title.trim() === "" || adding}`). Re-enable in `finally` so retries work:

```ts
setAdding(true);
try {
  await onAdd({ title: trimmedTitle, description: ... });
  setTitle("");
  setDescription("");
} finally {
  setAdding(false);
}
```

**TodoItem:** Await `onUpdate` / `onDelete`. Exit edit mode only after `onUpdate` fulfills; on reject, stay in edit mode with current field values. On `onDelete` reject, the row stays (parent list unchanged). Separate `saving` and `deleting` flags. Disable Save while saving (`disabled={title.trim() === "" || saving}`). Disable Delete while deleting. Cancel stays enabled during Save. Re-enable in `finally`.

**TodoList:** Widen `onAdd` / `onUpdate` / `onDelete` to `void | Promise<void>` only.

## Stories and component tests

Story files still named-import from `./ComponentName` only (no `@/`). Do not add persistence mocks in TodoForm / TodoItem / TodoList files. Sync `fn()` / `vi.fn()` is enough there. Keep existing plays/tests; types accept async.

**TodoPage stories/tests must not hit Prisma or the real actions.** Pass mocks as props (no `vi.mock` / `sb.mock` / `__mocks__`).

Plausible mock: resolve with `{ id, createdAt: new Date(...), title, description }` from the input. `deleteTodo` resolves `void`.

```ts
createTodo: fn(async (input) => ({
  id: 100,
  createdAt: new Date("2026-01-17T00:00:00.000Z"),
  title: input.title,
  description: input.description,
})),
updateTodo: fn(async (input) => ({
  id: input.id,
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  title: input.title,
  description: input.description,
})),
deleteTodo: fn(async () => {}),
```

In `TodoPage.test.tsx`, same shape with `vi.fn` instead of `fn`. Put a small helper in that test file (and args on the story `meta`); do not add a shared fixture module.

- Keep existing TodoPage `Default` play (type `Make sauce`, click Add, expect that text visible) and existing tests (empty list → `No todos yet.`; titles from `initialTodos`; add from empty). Update them to pass the three mocks and for prepend-on-add as needed
- Hide `createTodo`, `updateTodo`, `deleteTodo`, and `initialTodos` from Storybook controls
- Do not add new named stories. Do not add error-path or delayed-promise tests. Do not mock `listTodos`

## Playwright e2e

Delete `tests/e2e/home.spec.ts`. Add `tests/e2e/todo.spec.ts`. Keep `playwright.config.ts` as-is (Chromium, `baseURL`, `npm run dev`, `prisma/dev.db`). No dedicated e2e DB and no wipe.

One sequential test. Unique title: `` `e2e-todo-${Date.now()}` ``. Do not assume the list is empty; do not assert `No todos yet.` Scope Edit/Save/Delete to `page.getByRole("listitem").filter({ hasText: title })`.

Cover `/`:

1. Chrome: heading `Todoish` visible; `Prisma setup test` not present
2. Add the unique title; it appears
3. `page.goto("/")`; that title still visible
4. Edit that row’s title to `` `${title}-edited` ``; updated text visible
5. `page.goto("/")`; edited title still visible
6. Delete that row; edited title gone
7. `page.goto("/")`; edited title still gone

## AGENTS.md

Insert an **Integration** section after Backend and before `<!-- BEGIN:nextjs-agent-rules -->`. Do not remove or rewrite the Next.js agent block, UI, Stories, Testing, or Backend sections.

Document:

- `src/app/page.tsx` (Server Component) loads via `listTodos` and renders `TodoPage` with `initialTodos`. It also imports `createTodo` / `updateTodo` / `deleteTodo` by file path and passes them as props
- Mutation actions are **called** only from `TodoPage`, not from `TodoForm` / `TodoItem` / `TodoList`, and not via Prisma in UI. `TodoPage` does not import action modules
- Import actions by file path (`@/actions/todo/createTodo/createTodo`). No barrels. No Route Handlers
- Apply returned rows locally (prepend on create); coerce `createdAt` to `Date` on `initialTodos` and every action result
- Page mutations: set the inline `role="alert"` error and rethrow; molecules await callbacks and only reset local UI on success
- Component tests/stories mock the TodoPage action props only (`fn()` / `vi.fn()`); Playwright e2e uses unique titles against `dev.db`

## Implementation order

1. Widen TodoForm / TodoItem / TodoList callback types; await in Form/Item; pending disable + `finally`
2. TodoPage: action props, `toClientTodo`, prepend/replace/remove, alert + rethrow
3. Update TodoPage (and Form/Item/List as needed) stories and tests
4. Replace `src/app/page.tsx`
5. Replace e2e: add `tests/e2e/todo.spec.ts`, delete `tests/e2e/home.spec.ts`
6. Append Integration to `AGENTS.md`
7. Typecheck, `npm test`, `npm run test:e2e`

## Out of scope

- Atoms, `PageTemplate`, Header/Footer, `layout.tsx` (including site title metadata)
- Button `loading` spinner / pending indicator (disable the fired control only)
- Optimistic UI; refetch-after-mutation; `revalidatePath` / `router.refresh`
- Route Handlers, get-by-id, auth, Prisma schema changes, complete/toggle
- Dedicated e2e DB or wiping `dev.db`
- Changing action implementations or `tests/actions`
- Custom error classes or showing raw exception messages
- Dark mode, design tokens, extra libraries
- `__mocks__`, `sb.mock`, changes to `.storybook/preview.tsx` or `playwright.config.ts`
