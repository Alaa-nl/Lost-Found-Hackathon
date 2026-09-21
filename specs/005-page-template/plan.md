# Implementation Plan: Page Template

Source spec: [spec.md](./spec.md)

Add page chrome (`Header`, `Footer`), a `PageTemplate` shell, and a client `TodoPage` that owns in-memory todo state and controls `TodoList`. Update `AGENTS.md` for the `pages` layer and template/page story layout. Do not wire `src/app`, Prisma, or e2e.

## Technical context

- Next.js 16 / React 19 / Tailwind 4 / Storybook 10 / Vitest browser
- Path alias `@/*` → `./src/*`
- Canonical atom: `src/components/atoms/Button` (`Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`)
- Existing layers: `atoms`, `molecules`, `organisms` (`TodoList` already lives under organisms). Create `templates/` with `PageTemplate` and `pages/` with `TodoPage`. Do not create empty layer folders.
- No `clsx`, `cva`, `cn` — do not add them
- Prisma browser `Todo`: `{ id: number; createdAt: Date; title: string; description: string | null }` from `@/generated/prisma/browser`. Import that type only — never the Prisma client
- `TodoList` is fully controlled (`todos`, `onAdd`, `onUpdate`, `onDelete`). Do not change Button, Input, Textarea, TodoForm, TodoItem, or TodoList APIs or styles
- Stories glob already: `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)`. Vitest `components` project already: `src/components/**/*.test.tsx`. Do not change Storybook or Vitest config
- Home page stays the Prisma test page. Do not mount these components in `src/app`

## Target structure

```
src/components/organisms/Header/Header.tsx
src/components/organisms/Header/Header.stories.tsx
src/components/organisms/Header/Header.test.tsx
src/components/organisms/Footer/Footer.tsx
src/components/organisms/Footer/Footer.stories.tsx
src/components/organisms/Footer/Footer.test.tsx
src/components/templates/PageTemplate/PageTemplate.tsx
src/components/templates/PageTemplate/PageTemplate.stories.tsx
src/components/templates/PageTemplate/PageTemplate.test.tsx
src/components/pages/TodoPage/TodoPage.tsx
src/components/pages/TodoPage/TodoPage.stories.tsx
src/components/pages/TodoPage/TodoPage.test.tsx
AGENTS.md
```

Rules:

- One folder per component; colocate `ComponentName.tsx` + `.stories.tsx` + `.test.tsx`. No barrels, no `types.ts`, no `index.ts`
- Named + default export of the same component. Export `*Props` from the same file
- App/component imports: `@/components/{layer}/{Name}/{Name}`. Stories and tests: named import from `./ComponentName` only (no `@/` in those files)
- Dual export shape matches Button
- Header, Footer, PageTemplate: `forwardRef` + `Omit<ComponentProps<"el">, "ref">`, same as Button/Input
- TodoPage: no `forwardRef`; domain props only

## Shared chrome styles

Light mode only (no `dark:`). Append caller `className` last with `.filter(Boolean).join(" ")`.

Link focus ring (Footer): `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`

## Sample todos (inline in stories/tests)

Do not add a shared fixture file. Copy objects as needed (same objects as TodoList stories). Do not import `@/` from stories/tests.

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

## Header

**File:** `src/components/organisms/Header/Header.tsx`

- No `"use client"`
- Native `<header>` only. No title/content props

```ts
export type HeaderProps = Omit<ComponentProps<"header">, "ref">;
```

```ts
const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { className, ...props },
  ref,
) {
  const classes = [
    "border-b border-zinc-200 bg-white px-6 py-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header {...props} ref={ref} className={classes}>
      <h1 className="text-xl font-semibold text-black">Todoish</h1>
    </header>
  );
});
```

JSX children win over any `children` in `props`. Dual named + default export.

**Stories:** `title: "Organisms/Header"`, `layout: "centered"`, `tags: ["autodocs"]`. No documented custom props: `controls.include: []`. One `Default`. `play`: `expect.element` the heading named `"Todoish"` is visible (`expect` from `storybook/test`).

**Test:** render `<Header />`; assert a visible heading named `"Todoish"`.

## Footer

**File:** `src/components/organisms/Footer/Footer.tsx`

- No `"use client"`
- Native `<footer>` only. No content props

```ts
export type FooterProps = Omit<ComponentProps<"footer">, "ref">;
```

```ts
const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { className, ...props },
  ref,
) {
  const classes = [
    "flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const linkClasses =
    "text-black underline underline-offset-2 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  return (
    <footer {...props} ref={ref} className={classes}>
      <p className="text-sm text-zinc-600">© 2026 Todoish</p>
      <nav aria-label="Footer" className="flex gap-4">
        <a href="#" className={linkClasses}>
          Terms
        </a>
        <a href="#" className={linkClasses}>
          Privacy
        </a>
      </nav>
    </footer>
  );
});
```

One row: copyright left, links right. Dual named + default export.

**Stories:** `title: "Organisms/Footer"`, `layout: "centered"`, `tags: ["autodocs"]`. `controls.include: []`. One `Default`. `play`: click the `Terms` link.

**Tests:**

- Renders visible text `© 2026 Todoish`
- `Terms` and `Privacy` are links with `href="#"`

## PageTemplate

**File:** `src/components/templates/PageTemplate/PageTemplate.tsx`

- No `"use client"` (creates `templates/`)
- Import Header/Footer via `@/components/organisms/Header/Header` and `@/components/organisms/Footer/Footer`

```ts
export type PageTemplateProps = Omit<ComponentProps<"div">, "ref"> & {
  children: React.ReactNode;
};
```

`children` is required. Pull `children` and `className` out so `children` is not also spread onto the outer `div`.

```ts
const PageTemplate = forwardRef<HTMLDivElement, PageTemplateProps>(
  function PageTemplate({ children, className, ...props }, ref) {
    const classes = [
      "flex min-h-screen flex-col bg-zinc-50",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div {...props} ref={ref} className={classes}>
        <Header />
        <main className="flex-1 px-6 py-8">{children}</main>
        <Footer />
      </div>
    );
  },
);
```

Always Header, then `<main>` wrapping `children`, then Footer. Dual named + default export.

**Stories:** `title: "Templates/PageTemplate"`, `layout: "fullscreen"`, `tags: ["autodocs"]`. Args: `children: <p>Page content</p>`. Controls include only `children`. `play`: assert heading `"Todoish"` and text `"Page content"` are visible.

**Tests:**

- Renders banner (`getByRole("banner")`) and contentinfo (`getByRole("contentinfo")`)
- Given children (e.g. `<p>Slot content</p>`), that text is inside `main` (nested locator: `getByRole("main").getByText("Slot content")`)

## TodoPage

**File:** `src/components/pages/TodoPage/TodoPage.tsx`

- `"use client"` (creates `pages/`)
- Import `{ type Todo }` from `@/generated/prisma/browser`
- Import `PageTemplate` and `TodoList` via `@/` file paths
- No Prisma client, no API calls

```ts
export type TodoPageProps = {
  initialTodos?: Todo[];
};
```

No `forwardRef`, no native HTML prop spread.

- `useState<Todo[]>(initialTodos ?? [])` — initialize on mount only; do not sync if `initialTodos` changes later
- Render:

```tsx
<PageTemplate>
  <div className="mx-auto w-full max-w-2xl">
    <TodoList
      todos={todos}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  </div>
</PageTemplate>
```

Callbacks:

- `onAdd({ title, description })`: append `{ id, createdAt: new Date(), title, description }` where `id` is `1` if the list is empty, otherwise `Math.max(...current.map((t) => t.id)) + 1`
- `onUpdate(todo)`: replace the item with the same `id`
- `onDelete(id)`: remove that item

Dual named + default export.

**Stories:** `title: "Pages/TodoPage"`, `layout: "fullscreen"`, `tags: ["autodocs"]`. Args: `initialTodos: sampleTodos`. Hide `initialTodos` from controls (`argTypes.initialTodos.table.disable`). One `Default`. `play`: type `"Make sauce"` into the Title textbox, click Add, assert `"Make sauce"` is visible (state updated, not a spy). Do not use `"Buy peppers"` / `"Label bottles"` in this play — those are already on screen.

**Tests:**

- Default / empty `initialTodos`: `No todos yet.` visible, Add button visible, heading `Todoish` visible
- `initialTodos={sampleTodos}`: both titles visible
- Empty start, type a title, click Add: that title visible; `No todos yet.` gone

## AGENTS.md

Edit in place. Do not remove or rewrite the Next.js agent block (`<!-- BEGIN:nextjs-agent-rules -->` … `<!-- END:nextjs-agent-rules -->`). Button remains the canonical atom; do not add a second canonical example.

1. **Atomic folder map** — change to `src/components/{atoms,molecules,organisms,templates,pages}`
2. **Sidebar grouping** — Layer is PascalCase: `Atoms`, `Molecules`, `Organisms`, `Templates`, `Pages`. Keep examples `Atoms/Button` and `Templates/PageTemplate`. Add `Pages/TodoPage`
3. **Story layout** — replace the atoms-only centered line with: atoms, molecules, and organisms stay `layout: "centered"` unless a spec says otherwise; templates and pages use `layout: "fullscreen"`

## Implementation order

1. Header (component, stories, test)
2. Footer (component, stories, test)
3. PageTemplate (creates `templates/`)
4. TodoPage (creates `pages/`)
5. AGENTS.md edits
6. Typecheck and `npm test`

## Out of scope

- `src/app`, Prisma schema/client, database writes, API routes, Playwright e2e
- Changing Button, Input, Textarea, TodoForm, TodoItem, or TodoList
- Configurable header/footer copy, real `/terms` or `/privacy` routes, extra nav in the header
- A separate Content component
- Mark complete / incomplete, delete confirmation, extra keyboard behavior
- Dark mode, design tokens, CVA/clsx/`cn`, icon library
- Shared fixture module, per-component `index.ts` / `types.ts`
- Storybook / Vitest config changes
- Mounting `TodoPage` (or Header/Footer/PageTemplate) on a route
