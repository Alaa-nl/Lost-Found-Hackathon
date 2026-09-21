# Page Template

## Context

- Sample app for illustration; keep the UI and APIs simple.
- Shared UI conventions live in `AGENTS.md`. Canonical atom: `src/components/atoms/Button`.
- Todo UI already exists: atoms `Button`, `Input`, `Textarea`; molecules `TodoForm`, `TodoItem`; organism `TodoList`. No `templates` or `pages` folders yet. Do not create layer folders empty; create a layer folder when that layer’s first component is added.
- `TodoList` is fully controlled: parent owns `todos: Todo[]` and `onAdd` / `onUpdate` / `onDelete`. Item type is Prisma’s browser `Todo` from `@/generated/prisma/browser`. Do not import the Prisma client in these components.
- Home page (`src/app/page.tsx`) is a Prisma write/read test page. This spec does not change `src/app`, Prisma, or e2e.
- `AGENTS.md` currently documents layers `atoms` / `molecules` / `organisms` / `templates` only, and `layout: "centered"` only for atoms. This spec adds a `pages` layer and a fullscreen story layout for templates and pages.

## Goals

- Page chrome (header, footer) and a page template that composes them around a content slot.
- A page component that uses that template, owns in-memory todo state, and controls `TodoList`.
- Stories and colocated tests for every new shared component, following `AGENTS.md` (including updates from this spec).
- Document the new `pages` layer and template/page story layout in `AGENTS.md`.

## Requirements

### Scope
- Add the components below (and only those), plus colocated `*.stories.tsx` and `*.test.tsx` for each.
- Reuse existing `Header`/`Footer` consumers: `PageTemplate` renders `Header` and `Footer`; `TodoPage` renders `PageTemplate` with `TodoList` as children. Do not change Button, Input, Textarea, TodoForm, TodoItem, or TodoList APIs or styles.
- Do not wire `src/app`, layouts, routes, Prisma, or e2e.
- Do not persist todos.

### Conventions (from `AGENTS.md`, plus this spec)
- One folder per component; main file PascalCase matching the folder. Colocate stories, tests, and any other component files.
- Named export and default export of the same component. No barrel files. App imports use `@/components/{layer}/{Name}/{Name}`. Stories and tests: named import from `./ComponentName`.
- Server Components by default; `"use client"` only when the component needs handlers, state, or browser APIs.
- Props only (no compound components). No CVA / clsx / tailwind-merge / `cn`. Concatenate caller `className` last with simple string joining.
- Styling: placeholder Tailwind aligned with Button (zinc/black, light mode). No dark-mode styles, no icon library.
- Accessibility: native landmarks and keyboard behavior; visible focus ring on links. No extra key handling.
- Stories: CSF3, `title: "{Layer}/{Name}"`, `tags: ["autodocs"]`, one `Default` export with a `play` function. Curate controls per component; hide `className`, event handlers, and other native HTML props not listed.
- Tests: Vitest browser + `vitest-browser-react`; query with `getByRole`. No Testing Library / jsdom.

### Component tree
- Organisms: `Header`, `Footer`.
- Templates: `PageTemplate`.
- Pages: `TodoPage`.
- No new atoms or molecules. No separate Content component (`PageTemplate` children are the content slot).

### Header
- Location: `src/components/organisms/Header/Header.tsx`.
- Native `<header>`. Static copy: an `<h1>` with text `Todoish`.
- No title/content props. Accept native `<header>` props and concatenate `className`.
- `"use client"` not required.
- Story: `title: "Organisms/Header"`, `layout: "centered"`. Hide native HTML props from controls. `play`: assert the heading `Todoish` is visible.
- Test: renders a heading with name `Todoish`.

### Footer
- Location: `src/components/organisms/Footer/Footer.tsx`.
- Native `<footer>`. Static copy: `© 2026 Todoish`, plus placeholder links `Terms` and `Privacy` (`<a href="#">`). Put the links in a `<nav>` with accessible name `Footer`.
- No content props. Accept native `<footer>` props and concatenate `className`.
- `"use client"` not required.
- Story: `title: "Organisms/Footer"`, `layout: "centered"`. Hide native HTML props from controls. `play`: click the `Terms` link.
- Tests:
  - Renders the copyright text.
  - Renders `Terms` and `Privacy` links with `href="#"`.

### PageTemplate
- Location: `src/components/templates/PageTemplate/PageTemplate.tsx`.
- Presentational shell: always renders `Header`, then `<main>` wrapping `children`, then `Footer`.
- Props: `children` (required). Accept native wrapper-element props and concatenate `className` on the outer element.
- Layout: column flex so header and footer frame the main slot (main grows). Placeholder Tailwind only.
- `"use client"` not required (no handlers/state).
- Story: `title: "Templates/PageTemplate"`, `layout: "fullscreen"`. Default `children`: a short paragraph `Page content`. Hide native HTML props from controls; `children` may stay in args. `play`: assert the heading `Todoish` and the main text `Page content` are visible.
- Tests:
  - Renders banner (`Header`) and contentinfo (`Footer`).
  - Given children, those children are inside `main`.

### TodoPage
- Location: `src/components/pages/TodoPage/TodoPage.tsx`.
- `"use client"` (in-memory list state).
- Props: `initialTodos?: Todo[]` (default `[]`). Initialize state from `initialTodos` on mount only; do not sync if that prop changes later.
- Renders `PageTemplate` with `TodoList` as children. Wire `todos` and callbacks from local state.
- `onAdd({ title, description })`: append a `Todo` with `id` = max existing `id` + 1 (or `1` if the list is empty), `createdAt` = `new Date()` at add time, and the given `title` / `description`.
- `onUpdate(todo)`: replace the item with the same `id`.
- `onDelete(id)`: remove that item.
- Do not call Prisma or any API.
- Story: `title: "Pages/TodoPage"`, `layout: "fullscreen"`. Args: two sample todos (same shape as `TodoList` stories). Hide `initialTodos` from controls. `play`: type a title in the form, click Add, assert that title is visible in the page (state updated, not only a spy).
- Tests:
  - Default / empty `initialTodos` shows `No todos yet.` and the add form, plus header `Todoish`.
  - Non-empty `initialTodos` renders those titles.
  - Adding a todo with a title appends it to the list (title visible; empty message gone).

### AGENTS.md
- Update the atomic folder map to `src/components/{atoms,molecules,organisms,templates,pages}`.
- Sidebar grouping: Layer is PascalCase including `Pages` (example: `Pages/TodoPage`). Keep `Templates/PageTemplate`.
- Story layout: atoms, molecules, and organisms stay `centered` unless a spec says otherwise. Templates and pages use `layout: "fullscreen"`.
- Do not remove the existing Next.js agent block.
- Do not add a second canonical example; Button remains the canonical atom.

## Out of scope

- `src/app`, Prisma schema/client, database writes, API routes, Playwright e2e.
- Changing Button, Input, Textarea, TodoForm, TodoItem, or TodoList.
- Configurable header/footer copy, real `/terms` or `/privacy` routes, extra nav in the header.
- A separate Content component.
- Mark complete / incomplete, delete confirmation, extra keyboard behavior.
- Dark mode, design tokens, CVA/clsx/`cn`, icon library.
