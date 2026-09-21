# Tasks: Page Template

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not mount these components in `src/app`. Do not change Button, Input, Textarea, TodoForm, TodoItem, or TodoList. Do not change Prisma, e2e, or Storybook/Vitest config. Do not add barrels, `index.ts`, `types.ts`, or CVA/clsx/`cn`. Do not import the Prisma client. Stories and tests: named import from `./ComponentName` only (no `@/`). Do not create empty layer folders.

## 1. Header organism

- [x] Create `src/components/organisms/Header/` (`Header.tsx`, `Header.stories.tsx`, `Header.test.tsx`).
- [x] No `"use client"`. `forwardRef` native `<header>` only. Export `HeaderProps` (`Omit<ComponentProps<"header">, "ref">`). Dual named + default export.
- [x] Static `<h1>Todoish</h1>`. No title/content props. Concatenate caller `className` last. Classes from the plan. No `dark:` classes.
- [x] Stories: `Organisms/Header`, autodocs, `layout: "centered"`, one `Default`. `controls.include: []`. `play`: heading `"Todoish"` is visible.
- [x] Test: renders a visible heading named `"Todoish"`.

## 2. Footer organism

- [x] Create `src/components/organisms/Footer/` (`Footer.tsx`, `Footer.stories.tsx`, `Footer.test.tsx`).
- [x] No `"use client"`. `forwardRef` native `<footer>` only. Export `FooterProps`. Dual named + default export.
- [x] One row: `<p>© 2026 Todoish</p>` left; `<nav aria-label="Footer">` with `Terms` and `Privacy` (`href="#"`) right. Link focus ring from the plan. Concatenate caller `className` last.
- [x] Stories: `Organisms/Footer`, autodocs, centered, one `Default`. `controls.include: []`. `play`: click the `Terms` link.
- [x] Tests: copyright text visible; `Terms` and `Privacy` links with `href="#"`.

## 3. PageTemplate template

- [x] Create `src/components/templates/PageTemplate/` (this creates `templates/`). Do not create `pages/` yet.
- [x] No `"use client"`. `forwardRef` outer `<div>`. Export `PageTemplateProps` (`Omit<ComponentProps<"div">, "ref">` plus required `children`). Dual named + default export.
- [x] Always `Header`, then `<main className="flex-1 px-6 py-8">{children}</main>`, then `Footer`. Outer classes from the plan. Pull `children` out of the div spread. Import Header/Footer via `@/components/organisms/...`.
- [x] Stories: `Templates/PageTemplate`, autodocs, `layout: "fullscreen"`, one `Default`. Args: `children: <p>Page content</p>`. Controls include only `children`. `play`: heading `"Todoish"` and text `"Page content"` visible.
- [x] Tests: banner + contentinfo visible; given children, those children are inside `main`.

## 4. TodoPage page

- [x] Create `src/components/pages/TodoPage/` (this creates `pages/`).
- [x] `"use client"`. Import `{ type Todo }` from `@/generated/prisma/browser` (type only). No Prisma client, no API. Dual named + default export. Export `TodoPageProps` (`initialTodos?: Todo[]` only). No `forwardRef`.
- [x] `useState(initialTodos ?? [])` on mount only; do not sync if the prop changes later.
- [x] Render `PageTemplate` → max-width wrapper (`mx-auto w-full max-w-2xl`) → `TodoList` with `todos` / `onAdd` / `onUpdate` / `onDelete` from local state. Import via `@/` file paths.
- [x] `onAdd`: append `id` = `1` if empty else `max(id) + 1`, `createdAt: new Date()`, given `title` / `description`. `onUpdate`: replace same `id`. `onDelete`: remove that `id`.
- [x] Stories: `Pages/TodoPage`, autodocs, `layout: "fullscreen"`, one `Default`. Args: two sample todos from the plan. Hide `initialTodos` from controls. `play`: type `"Make sauce"`, click Add, assert `"Make sauce"` is visible (not a spy).
- [x] Tests: empty shows `No todos yet.`, Add, and heading `Todoish`; non-empty shows those titles; add from empty makes the new title visible and removes the empty message.

## 5. AGENTS.md

- [x] Update the atomic folder map to `src/components/{atoms,molecules,organisms,templates,pages}`.
- [x] Sidebar grouping: Layer includes `Pages` (example `Pages/TodoPage`). Keep `Templates/PageTemplate`. Button stays the canonical atom.
- [x] Story layout: atoms / molecules / organisms stay `centered` unless a spec says otherwise; templates and pages use `fullscreen`.
- [x] Do not remove or rewrite the Next.js agent block. Do not add a second canonical example.

## 6. Verify

- [x] Typecheck (`npx tsc --noEmit`).
- [x] `npm test` (Vitest components + storybook projects) exits 0.
- [x] Confirm no files changed outside `src/components` and `AGENTS.md`.
- [x] Confirm Button, Input, Textarea, TodoForm, TodoItem, and TodoList are unchanged.
- [x] Confirm none of the new components are mounted in `src/app`.
