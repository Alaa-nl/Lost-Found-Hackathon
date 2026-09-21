# Implementation Plan: Todo App Components

Source spec: [spec.md](./spec.md)

Add controlled todo-list UI under `src/components` (Input, Textarea, TodoForm, TodoItem, TodoList) with colocated stories and tests. Do not wire a page or persist data. Exception: a one-line Button a11y tweak so `disabled` also sets `aria-disabled`.

## Technical context

- Next.js 16 / React 19 / Tailwind 4 / Storybook 10 / Vitest browser
- Path alias `@/*` → `./src/*`
- Canonical atom: `src/components/atoms/Button` (`Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`)
- Only `src/components/atoms` exists. Create `molecules` / `organisms` when that layer’s first component is added. Do not create `templates`.
- No `clsx`, `cva`, `cn` — do not add them
- Prisma browser `Todo`: `{ id: number; createdAt: Date; title: string; description: string | null }` from `@/generated/prisma/browser`. Components import that type only — never the Prisma client
- Button default `type="button"`; `aria-disabled` today is set only when `loading`. This plan extends that to native `disabled` as well
- Stories glob already picks up colocated `*.stories.tsx`. Vitest `components` project already includes `src/components/**/*.test.tsx`
- Home page stays the Prisma test page

## Target structure

```
src/components/atoms/Button/Button.tsx              (aria-disabled tweak only)
src/components/atoms/Button/Button.test.tsx         (one extra disabled case)
src/components/atoms/Input/Input.tsx
src/components/atoms/Input/Input.stories.tsx
src/components/atoms/Input/Input.test.tsx
src/components/atoms/Textarea/Textarea.tsx
src/components/atoms/Textarea/Textarea.stories.tsx
src/components/atoms/Textarea/Textarea.test.tsx
src/components/molecules/TodoForm/TodoForm.tsx
src/components/molecules/TodoForm/TodoForm.stories.tsx
src/components/molecules/TodoForm/TodoForm.test.tsx
src/components/molecules/TodoItem/TodoItem.tsx
src/components/molecules/TodoItem/TodoItem.stories.tsx
src/components/molecules/TodoItem/TodoItem.test.tsx
src/components/organisms/TodoList/TodoList.tsx
src/components/organisms/TodoList/TodoList.stories.tsx
src/components/organisms/TodoList/TodoList.test.tsx
```

Rules:

- One folder per component; colocate `ComponentName.tsx` + `.stories.tsx` + `.test.tsx`. No barrels, no `types.ts`, no `index.ts`
- Named + default export of the same component
- App/component imports: `@/components/{layer}/{Name}/{Name}`. Stories and tests: named import from `./ComponentName` only (no `@/` in those files)
- Dual export shape matches Button

## Button a11y tweak

**Files:** `Button.tsx`, `Button.test.tsx`

Do not change Button API, styles, stories, or `AGENTS.md`.

In `Button.tsx`, treat `disabled` and `loading` the same for `aria-disabled`:

```ts
const isDisabled = Boolean(disabled) || loading;
// ...
disabled={isDisabled}
aria-disabled={isDisabled ? true : undefined}
```

Add one test next to the existing loading case: `<Button disabled>Save</Button>` → native disabled and `aria-disabled="true"`. Keep the existing two tests.

## Shared field styles

Input and Textarea: `forwardRef`, `Omit<ComponentProps<"input" | "textarea">, "ref">`, no extra variant/size/label props, no `"use client"`. Always `w-full`. Append caller `className` last. Light mode only (no `dark:`).

```ts
const baseClasses =
  "w-full border border-zinc-200 bg-white px-4 py-2 text-base text-black placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed";
```

Textarea adds `min-h-24` on top of `baseClasses`.

## Input

**File:** `src/components/atoms/Input/Input.tsx`

- Native `<input>` only. Default `type="text"`
- Export `InputProps` from the same file
- Same `forwardRef` + dual-export pattern as Button

**Stories:** `title: "Atoms/Input"`, `layout: "centered"`, `tags: ["autodocs"]`. Controls include only `type`, `disabled`, `placeholder`. Hide `className` and other native props. Default args: `aria-label: "Title"` (do not set `value`, so typing works). `play`: `userEvent.type` the textbox named `"Title"` with any short string.

**Test:** render `<Input aria-label="Title" />`; assert a visible textbox named `"Title"`.

## Textarea

**File:** `src/components/atoms/Textarea/Textarea.tsx`

- Native `<textarea>` only
- Export `TextareaProps` from the same file
- Same export pattern as Input

**Stories:** `title: "Atoms/Textarea"`. Controls include only `disabled`, `placeholder`. Default args: `aria-label: "Description"`. `play`: type into the textbox named `"Description"`.

**Test:** render `<Textarea aria-label="Description" />`; assert a visible textbox named `"Description"`.

## Sample todos (inline in stories/tests)

Do not add a shared fixture file. Copy objects as needed. Do not import `@/` from stories/tests.

```ts
const sampleTodo = {
  id: 1,
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  title: "Buy peppers",
  description: "Habanero and jalapeño",
};

const sampleTodos = [
  sampleTodo,
  {
    id: 2,
    createdAt: new Date("2026-01-16T00:00:00.000Z"),
    title: "Label bottles",
    description: null,
  },
];
```

## TodoForm

**File:** `src/components/molecules/TodoForm/TodoForm.tsx`

- `"use client"`
- Domain props only (no `forwardRef`, no native `<form>` prop spread — avoids `onSubmit` clashes):

```ts
export type TodoFormProps = {
  onAdd: (item: { title: string; description: string | null }) => void;
};
```

- Local draft strings `title` and `description`, both `""` initially
- Markup: `<form>` with `onSubmit` that `preventDefault`s, then:
  1. `const trimmedTitle = title.trim()`
  2. `const trimmedDescription = description.trim()`
  3. If `trimmedTitle` is empty, return (do not call `onAdd`)
  4. `onAdd({ title: trimmedTitle, description: trimmedDescription === "" ? null : trimmedDescription })`
  5. Reset both drafts to `""`
- Labeled fields: `<label htmlFor="todo-form-title">Title</label>` + `<Input id="todo-form-title" />`; `<label htmlFor="todo-form-description">Description</label>` + `<Textarea id="todo-form-description" />`. Visible label text is `Title` and `Description`
- Add `Button`: `type="submit"` (override default), `variant="primary"`, children `Add`, `disabled={title.trim() === ""}`
- Stack fields vertically with a simple `flex flex-col gap-3` (and labels `text-sm font-medium`)

**Stories:** `title: "Molecules/TodoForm"`, `layout: "centered"`. `args.onAdd: fn()` from `storybook/test`. Hide `onAdd` from controls/Autodocs (`controls.include: []` or `argTypes.onAdd.table.disable`). `play`: type a title into the Title textbox, click Add.

**Tests** (`vi.fn()` from `vitest`):

- Empty title: Add is disabled and `aria-disabled="true"`
- Type `"Buy peppers"`, click Add: `onAdd` called with `{ title: "Buy peppers", description: null }`
- Optional third case is not required: description-filled submit can wait; if included, expect trimmed description string

## TodoItem

**File:** `src/components/molecules/TodoItem/TodoItem.tsx`

- `"use client"`
- Import `{ type Todo }` from `@/generated/prisma/browser`

```ts
export type TodoItemProps = {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};
```

- No `forwardRef`. Root is a `<div>` (not `<li>` — `TodoList` wraps `<li>` so the Storybook canvas is valid HTML)
- Local `editing` boolean, plus draft `title` / `description` strings. Initialize drafts when entering edit (from `todo.title` and `todo.description ?? ""`)
- Stacked layout: title, description (if not null), date, then action buttons (`flex flex-col gap-2`)
- View mode: title as `<p className="font-semibold">`; description as `<p className="text-zinc-600">` only when not null; `createdAt` via `todo.createdAt.toLocaleDateString()` in a `<p className="text-sm text-zinc-500">`. Buttons: secondary `Edit`, secondary `Delete`
- Edit mode: labeled `Input` / `Textarea` with unique ids `todo-item-title-${todo.id}` and `todo-item-description-${todo.id}`. `createdAt` stays display-only. Buttons: primary `Save`, secondary `Cancel`. Hide Edit/Delete
- Save: same trim rules as TodoForm; if trimmed title empty, do not call `onUpdate`. Else `onUpdate({ ...todo, title: trimmedTitle, description })` and `editing = false`
- Save `disabled={title.trim() === ""}`. Cancel restores view mode and discards drafts
- Delete: `onDelete(todo.id)` with no confirm
- Each item’s edit state is independent

**Stories:** `title: "Molecules/TodoItem"`. Args: `todo: sampleTodo`, `onUpdate` / `onDelete`: `fn()`. Hide the two callbacks from controls. `play`: click Edit.

**Tests:**

- Renders `sampleTodo.title` (visible)
- Click Delete: `onDelete` called with `1`
- Click Edit, change the Title textbox, click Save: `onUpdate` called with `{ ...sampleTodo, title: "<new title>" }`

## TodoList

**File:** `src/components/organisms/TodoList/TodoList.tsx`

- `"use client"`
- Import `{ type Todo }` from `@/generated/prisma/browser`

```ts
export type TodoListProps = {
  todos: Todo[];
  onAdd: (item: { title: string; description: string | null }) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};
```

- No local todo state. Pass `onAdd` into `TodoForm`; pass `onUpdate` / `onDelete` into each `TodoItem`
- Layout: `flex flex-col gap-6` with the form first, then `<ul>` of `<li key={todo.id}><TodoItem ... /></li>`
- When `todos.length === 0`, still render the form, plus `<p>No todos yet.</p>` (do not render that message when the list is non-empty)
- `min-w-80` on the root so the centered Storybook canvas has width

**Stories:** `title: "Organisms/TodoList"`. Args: `todos: sampleTodos`, callbacks `fn()`. Hide the three callbacks from controls. `play`: type a title in the form’s Title field, click Add, `expect(args.onAdd).toHaveBeenCalled()` (`expect` / `fn` from `storybook/test`).

**Tests:**

- `todos={[]}`: `No todos yet.` is visible; form (Add button) is still visible
- `todos={sampleTodos}`: both titles visible; empty message not present

## Button usage

- Add, Save: `variant="primary"`
- Edit, Cancel, Delete: `variant="secondary"`
- Add is `type="submit"`; all other buttons use Button’s default `type="button"`

## Implementation order

1. Button `aria-disabled` tweak + extra `disabled` test
2. Input (component, stories, test)
3. Textarea (component, stories, test)
4. TodoForm (creates `molecules/`)
5. TodoItem
6. TodoList (creates `organisms/`)
7. Typecheck and `npm test`

## Out of scope

- `src/app`, Prisma schema/client, database writes, API routes
- Mounting any of these components on a page
- Mark complete / incomplete; templates; Checkbox or other extra atoms
- Changing Button API or styles (a11y `aria-disabled` line only)
- Updating `AGENTS.md`
- Dark mode, design tokens, CVA/clsx/`cn`, icon library
- Delete confirmation, Escape-to-cancel, extra keyboard behavior
- Shared fixture module, per-component `index.ts` / `types.ts`
- Playwright e2e beyond the existing `/` smoke (page is unchanged)
