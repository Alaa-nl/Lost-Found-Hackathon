# Implementation Plan: Storybook configuration

Source spec: [spec.md](./spec.md)

Remove the Storybook starter kit, add colocated Button stories, wire preview CSS/fonts, and document story conventions in `AGENTS.md`. Do not change the Button component.

## Technical context

- Storybook 10 with `@storybook/nextjs-vite`; scripts: `storybook`, `build-storybook`
- Config: `.storybook/main.ts`, `.storybook/preview.tsx`
- `main.ts` stories glob already: `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` — keep it. Do not change addons or `staticDirs`.
- Starter kit leftovers in `src/stories` (CSS, assets). Delete the whole directory.
- Only shared UI component: `src/components/atoms/Button/Button.tsx`
- Button API: `variant` (`primary` | `secondary`), `size` (`sm` | `md` | `lg`), `loading`, `fullWidth`, plus native `<button>` props. Dual named + default export. Do not change this file.
- App CSS: `src/app/globals.css`. Fonts: Geist Sans/Mono via `next/font/google` in `src/app/layout.tsx` (`--font-geist-sans`, `--font-geist-mono`, `antialiased` on `<html>`).
- `.storybook/preview.tsx` does not import app CSS or fonts. It currently has starter `controls.matchers` — remove them.
- Testing addons are installed; do not add, remove, or configure addons (including Vitest/Chromatic/MCP).

## Target structure

```
.storybook/main.ts          (unchanged)
.storybook/preview.tsx      (CSS + fonts; drop matchers)
src/components/atoms/Button/Button.stories.tsx
AGENTS.md                   (append Stories section)
```

Delete:

```
src/stories/                (entire directory)
```

Do not create `molecules` / `organisms` / `templates` directories.

## Preview & fonts

**File:** `.storybook/preview.tsx`

- Import `../src/app/globals.css`.
- Import `Geist` and `Geist_Mono` from `next/font/google` with the same options as `src/app/layout.tsx`: `variable: "--font-geist-sans"` / `"--font-geist-mono"`, `subsets: ["latin"]`.
- Apply font variable classes and `antialiased` on the Storybook iframe `<html>` (`document.documentElement`). Do not wrap stories in an extra div. Do not add `h-full`.
- Remove `parameters.controls.matchers`. If `parameters` is then empty, omit it.

```tsx
import type { Preview } from "@storybook/nextjs-vite";
import { Geist, Geist_Mono } from "next/font/google";
import "../src/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add(
        geistSans.variable,
        geistMono.variable,
        "antialiased",
      );
      return <Story />;
    },
  ],
};

export default preview;
```

No theme switcher. No dark-mode Button styles.

## Button stories

**File:** `src/components/atoms/Button/Button.stories.tsx`

CSF3: `Meta` / `StoryObj` from `@storybook/nextjs-vite`; default-export `meta`. Named import `{ Button }` from `"./Button"`. Always `.tsx`.

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const documentedProps = [
  "variant",
  "size",
  "loading",
  "fullWidth",
  "disabled",
  "children",
  "type",
] as const;

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [...documentedProps],
    },
  },
  args: {
    variant: "primary",
    size: "md",
    loading: false,
    fullWidth: false,
    children: "Button",
  },
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

Rules:

- One named story export: `Default`. No extra stories for variants, sizes, or states.
- `args` live on `meta`; `Default` inherits them. Do not set `type` in args (component default `type="button"`).
- Let Storybook infer control widgets. Set `children: { control: "text" }` only if inference fails.
- Controls include only the 7 `documentedProps`. Hide every other native HTML prop from Autodocs with `argTypes.<name>.table.disable: true`. Start with `className`; add any other extracted native rows until Autodocs shows only those 7.
- No `play` functions, interaction tests, or `fn()` spies.
- No min-width decorator for `fullWidth`.

## AGENTS.md

Append a **Stories** section below the existing Shared UI components section (after Accessibility). Do not remove or rewrite the Next.js agent block or the Shared UI section.

Canonical example: `src/components/atoms/Button/Button.stories.tsx`.

Document:

1. **File location & format** — `src/components/{layer}/{ComponentName}/{ComponentName}.stories.tsx`; required for every new shared component; always `.tsx`; CSF3; `Meta` / `StoryObj` from `@storybook/nextjs-vite`; default-export `meta`; named import from `./ComponentName`.
2. **Sidebar grouping** — explicit `title`: `{Layer}/{ComponentName}`; layer is PascalCase (`Atoms`, `Molecules`, `Organisms`, `Templates`); Button: `Atoms/Button`.
3. **Story content** — one named export `Default`; coverage via controls and Autodocs, not extra named stories; no `play` / interaction tests / `fn()` spies.
4. **Autodocs & controls** — `tags: ["autodocs"]`; atoms use `layout: "centered"`; expose only `variant`, `size`, `loading`, `fullWidth`, `disabled`, `children`, `type`; hide all other native HTML props from controls and Autodocs.

## Implementation order

1. Delete `src/stories` entirely.
2. Update `.storybook/preview.tsx` (CSS import, Geist on iframe `<html>`, remove matchers). Leave `.storybook/main.ts` unchanged.
3. Add `src/components/atoms/Button/Button.stories.tsx`.
4. Append the Stories section to `AGENTS.md`.
5. Typecheck. Run Storybook and confirm sidebar, Default story, Autodocs/controls, CSS, and fonts.

## Out of scope

- Changing Button (API, styles, `"use client"`)
- Mounting Button on a page
- Stories for any component other than Button; starter-kit Header/Page
- Implementing `molecules` / `organisms` / `templates` (or their stories)
- Testing (play functions, Vitest addon setup, Chromatic, visual/regression tests)
- MDX docs, extra named stories, variant × size matrices, canvas decorators for `fullWidth`
- Design tokens, Storybook theming, dark-mode Button styles
- Adding, removing, or configuring Storybook addons
- Changing `.storybook/main.ts` (glob, addons, `staticDirs`)
