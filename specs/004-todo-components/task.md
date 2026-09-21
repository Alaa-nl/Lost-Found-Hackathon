# Tasks: Todo App Components

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not mount these components on a page. Do not change `src/app`, Prisma, or `AGENTS.md`. Do not add barrels, `index.ts`, `types.ts`, CVA/clsx/`cn`, or a `templates` directory. Do not import the Prisma client. Stories and tests: named import from `./ComponentName` only (no `@/`).

## 1. Button a11y tweak

- [x] In `Button.tsx` only: `aria-disabled` is true when `disabled` or `loading`; otherwise omit it. Keep `disabled={disabled || loading}`.
- [x] Do not change Button API, styles, stories, or `AGENTS.md`.
- [x] Add one Button test: `disabled` → native disabled and `aria-disabled="true"`. Keep the existing two tests.

## 2. Input atom

- [x] Create `src/components/atoms/Input/Input.tsx` (no extra files besides stories/test).
- [x] `forwardRef` native `<input>` only. Export `InputProps` (`Omit<ComponentProps<"input">, "ref">`). Default `type="text"`. No `"use client"`. No size/variant/label props.
- [x] Base classes from the plan, including `w-full`. Append caller `className` last. No `dark:` classes.
- [x] Dual export: named `{ Input }` and `export default Input`.
- [x] Stories: `Atoms/Input`, autodocs, `layout: "centered"`, one `Default`. Controls: `type`, `disabled`, `placeholder` only. Args: `aria-label: "Title"` (no `value`). `play`: type into the Title textbox.
- [x] Test: renders a visible textbox named `"Title"`.

## 3. Textarea atom

- [x] Create `src/components/atoms/Textarea/Textarea.tsx`.
- [x] `forwardRef` native `<textarea>` only. Export `TextareaProps`. No `"use client"`. No size/variant/label props.
- [x] Same base classes as Input plus `min-h-24`. Dual named + default export.
- [x] Stories: `Atoms/Textarea`, autodocs, centered, one `Default`. Controls: `disabled`, `placeholder`. Args: `aria-label: "Description"`. `play`: type into that textbox.
- [x] Test: renders a visible textbox named `"Description"`.

## 4. TodoForm molecule

- [x] Create `src/components/molecules/TodoForm/` (this creates `molecules/`). Do not create empty layer folders.
- [x] `"use client"`. Props: `onAdd({ title, description })` with `description: string | null`. Domain props only (no `forwardRef`, no native form prop spread). Dual export. Export `TodoFormProps` from the same file.
- [x] Native `<form>` with labeled Title `Input` and Description `Textarea` (`htmlFor` / `id` as in the plan). Primary submit `Button` labeled `Add` with `type="submit"`.
- [x] Local draft state; trim on submit; empty description → `null`; empty title → do not call `onAdd`; then reset drafts.
- [x] Add is `disabled` while `title.trim()` is empty (Button will also set `aria-disabled`).
- [x] Import atoms via `@/components/atoms/...`.
- [x] Stories: `Molecules/TodoForm`, centered, autodocs. `onAdd: fn()`. Hide `onAdd` from controls. `play`: type a title, click Add.
- [x] Tests: Add disabled (+ `aria-disabled`) when title empty; submit with a title calls `onAdd` with `{ title, description: null }`.

## 5. TodoItem molecule

- [x] Create `src/components/molecules/TodoItem/`. `"use client"`. Import `{ type Todo }` from `@/generated/prisma/browser`.
- [x] Props: `todo`, `onUpdate(todo)`, `onDelete(id)`. Dual export. Export `TodoItemProps`. Root `<div>` (not `<li>`).
- [x] Stacked layout: title, description if present, locale date, then buttons.
- [x] View: secondary Edit + Delete. Edit: Input + Textarea (unique ids from the plan), display-only date, primary Save + secondary Cancel; hide Edit/Delete. Independent per-item edit state.
- [x] Save uses the same trim rules; `onUpdate` keeps `id` / `createdAt`. Save disabled on empty trimmed title. Cancel discards draft. Delete calls `onDelete(todo.id)` with no confirm.
- [x] Stories: `Molecules/TodoItem`, sample todo from the plan, `fn()` spies, hide callbacks. `play`: click Edit.
- [x] Tests: renders title; Delete → `onDelete(1)`; Edit → change title → Save → `onUpdate` with updated `Todo`.

## 6. TodoList organism

- [x] Create `src/components/organisms/TodoList/` (this creates `organisms/`). Do not create `templates/`.
- [x] `"use client"`. Props: `todos`, `onAdd`, `onUpdate`, `onDelete` (inline `onAdd` payload type, same shape as TodoForm). No local todo state.
- [x] Render TodoForm, then `<ul>` / `<li key={todo.id}>` wrapping TodoItem. Empty: form + `No todos yet.` Non-empty: no empty message. Root `min-w-80`.
- [x] Import molecules via `@/components/molecules/...`. Import `{ type Todo }` from `@/generated/prisma/browser`.
- [x] Stories: `Organisms/TodoList`, two sample todos from the plan, `fn()` spies, hide callbacks. `play`: type a title, click Add, assert `onAdd` was called.
- [x] Tests: empty list shows `No todos yet.` and the form; non-empty shows both titles and not the empty message.

## 7. Verify

- [x] Typecheck (`npx tsc --noEmit`).
- [x] `npm test` (Vitest components + storybook projects) exits 0.
- [x] Confirm no files changed outside `src/components`.
- [x] Confirm Button stories/API/styles/`AGENTS.md` are unchanged aside from the `aria-disabled` line and the extra Button test.
- [x] Confirm none of the new components are mounted on a page.
