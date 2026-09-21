# Todo App Components

## Context

- Sample app for illustration; keep the UI and APIs simple.
- Shared UI conventions live in `AGENTS.md`. Canonical atom: `src/components/atoms/Button`.
- Only `atoms` exists today (`Button`). `molecules` / `organisms` / `templates` directories must not be created empty; create a layer folder when that layer’s first component is added.
- Prisma `Todo` (see `prisma/schema.prisma`): `id` (`Int`), `createdAt` (`DateTime`), `title` (`String`), `description` (`String?`). No completed/status field.
- Browser-safe Prisma types: import `{ type Todo }` from `@/generated/prisma/browser`. Do not import the Prisma client in these components.
- Home page (`src/app/page.tsx`) is a Prisma write/read test page. This spec does not change `src/app` or Prisma.

## Goals

- Shared todo-list UI under `src/components`: list, add, edit, delete.
- Stories and colocated tests for every new shared component, following `AGENTS.md`.
- Controlled components that emit events for later backend integration (no persistence here).

## Requirements

### Scope
- Add the components below (and only those), plus colocated `*.stories.tsx` and `*.test.tsx` for each.
- Reuse existing `Button`. Do not change Button’s API or styles.
- Do not wire the home page, layouts, routes, or any file outside `src/components`.
- Do not call Prisma or otherwise persist todos.
- Do not update `AGENTS.md` (no new global conventions).

### Conventions (from `AGENTS.md`)
- One folder per component; main file PascalCase matching the folder. Colocate stories, tests, and any other component files.
- Named export and default export of the same component. No barrel files. App imports use `@/components/{layer}/{Name}/{Name}`. Stories and tests: named import from `./ComponentName`.
- Server Components by default; `"use client"` only when the component needs handlers, state, or browser APIs.
- `forwardRef`, extend native element props, export `*Props` from the same file as the component. Props only (no compound components).
- No CVA / clsx / tailwind-merge / `cn`. Concatenate caller `className` last with simple string joining.
- Styling: placeholder Tailwind aligned with Button (zinc/black, light mode). No dark-mode styles, no icon library.
- Accessibility: native semantics and keyboard behavior; visible focus ring required. No extra key handling (no Escape-to-cancel, etc.).
- Stories: CSF3, `title: "{Layer}/{Name}"`, `tags: ["autodocs"]`, one `Default` export with a `play` function. These components all use `layout: "centered"`. Curate controls as specified per component; hide `className`, event handlers, and other native HTML props not listed.
- Tests: Vitest browser + `vitest-browser-react`; query with `getByRole`. No Testing Library / jsdom.

### Data & events
- Item type is Prisma’s browser `Todo`: `{ id: number; createdAt: Date; title: string; description: string | null }`.
- Fully controlled: parent owns `todos: Todo[]`. Display order is the array order.
- Callbacks (parent applies the change):
  - `onAdd({ title, description })` where `description` is `string | null`
  - `onUpdate(todo: Todo)` — full item after edit (`id` and `createdAt` unchanged)
  - `onDelete(id: number)`
- Trim `title` and `description` on submit. After trim, empty description is `null` (not `""`). After trim, empty title is invalid (do not fire the event).
- No complete/toggle.

### Component tree
- Atoms: `Input`, `Textarea` (plus existing `Button`).
- Molecules: `TodoItem`, `TodoForm`.
- Organism: `TodoList`.
- No template.

### Input
- Location: `src/components/atoms/Input/Input.tsx`.
- Native `<input>` only (not polymorphic). Default `type="text"`.
- No `size` / `variant` / `label` props. Callers supply a `<label htmlFor>` or `aria-label`.
- `"use client"` not required (presentational).
- Story `Default` args include `aria-label: "Title"` so the control has an accessible name. Controls: `type`, `disabled`, `placeholder`. `play`: type into the textbox.
- Test: renders a textbox (accessible name from `aria-label` in the test).

### Textarea
- Location: `src/components/atoms/Textarea/Textarea.tsx`.
- Native `<textarea>` only (not polymorphic).
- No `size` / `variant` / `label` props. Callers supply a `<label htmlFor>` or `aria-label`.
- `"use client"` not required (presentational).
- Story `Default` args include `aria-label: "Description"`. Controls: `disabled`, `placeholder`. `play`: type into the textbox.
- Test: renders a textbox (accessible name from `aria-label` in the test).

### TodoForm
- Location: `src/components/molecules/TodoForm/TodoForm.tsx`.
- Add-only. Props: `onAdd`.
- `"use client"` (local draft state).
- Native `<form>` with labeled `Input` (Title) and `Textarea` (Description) and a primary `Button` labeled `Add`.
- Local draft until submit; then `onAdd` and reset the draft.
- `Add` is native-disabled (and `aria-disabled`) while the trimmed title is empty. Do not fire `onAdd` for a blank title.
- Native Enter-to-submit via the form. Description is optional.
- Story: `onAdd` is `fn()`. Hide `onAdd` from controls. `play`: type a title and click Add.
- Tests:
  - Add is disabled when the title is empty.
  - Submitting with a title calls `onAdd` with `{ title, description: null }` (or the trimmed description when filled).

### TodoItem
- Location: `src/components/molecules/TodoItem/TodoItem.tsx`.
- Props: `todo: Todo`, `onUpdate`, `onDelete`.
- `"use client"` (local view/edit state).
- View mode (default): show `title`, `description` if not null, `createdAt` as a locale date string. Buttons: secondary `Edit`, secondary `Delete`.
- Edit mode (after Edit): `Input` + `Textarea` for title/description; `createdAt` stays display-only. Buttons: primary `Save`, secondary `Cancel`. Hide Edit/Delete while editing.
- Save emits `onUpdate` with the same `id` / `createdAt` and the trimmed fields. `Save` is disabled while the trimmed title is empty. Cancel discards the draft and returns to view mode.
- Each item owns its own edit state (more than one item may be editing at once).
- Delete emits `onDelete(todo.id)`. No confirm dialog.
- Story: one sample `todo`; `onUpdate` / `onDelete` are `fn()`. Hide those callbacks from controls. `play`: click Edit.
- Tests:
  - Renders the todo title.
  - Delete calls `onDelete` with the todo’s `id`.
  - Edit → change title → Save calls `onUpdate` with the updated `Todo`.

### TodoList
- Location: `src/components/organisms/TodoList/TodoList.tsx`.
- Props: `todos: Todo[]`, `onAdd`, `onUpdate`, `onDelete`.
- `"use client"` (passes function props into child client components).
- Renders `TodoForm` (wired to `onAdd`) and a native list (`<ul>` / `<li>`) of `TodoItem`.
- When `todos` is empty, still show the form, plus a short message: `No todos yet.`
- Does not keep todo state of its own.
- Story: two sample todos; callbacks are `fn()`. Hide callbacks from controls. `play`: type a title in the form and click Add (assert `onAdd` was called).
- Tests:
  - Empty `todos` shows `No todos yet.`
  - Non-empty `todos` renders each title and does not show the empty message.

### Button usage
- Add and Save: `variant="primary"`.
- Edit, Cancel, Delete: `variant="secondary"`.

## Out of scope

- `src/app`, Prisma schema/client, database writes, API routes.
- Mark complete / incomplete.
- Templates, extra atoms (Checkbox, etc.), icon library.
- Changing Button or `AGENTS.md`.
- Dark mode, design tokens, CVA/clsx/`cn`.
- Delete confirmation, Escape-to-cancel, or other extra keyboard behavior.
- Backend integration beyond the `onAdd` / `onUpdate` / `onDelete` props.
