# Storybook configuration

## Context

- Storybook 10 is already in the project (`storybook`, `@storybook/nextjs-vite`). Scripts: `storybook`, `build-storybook`.
- Config lives in `.storybook/main.ts` and `.storybook/preview.tsx`.
- `main.ts` already globs `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` (colocated files are picked up).
- Starter-kit stories live in `src/stories` (example Button, Header, Page, CSS, assets). Those are not the app Button.
- The only shared UI component is `src/components/atoms/Button/Button.tsx`.
- Shared UI lives under `src/components/{atoms,molecules,organisms,templates}`; one folder per component; colocate related files; no barrels; named + default exports. Import app code as `@/components/atoms/Button/Button`.
- Button API: `variant` (`primary` | `secondary`), `size` (`sm` | `md` | `lg`), `loading`, `fullWidth`, plus native `<button>` props (`disabled`, `type`, `children`, and the rest).
- Button is Tailwind-styled. App CSS is `src/app/globals.css`. App fonts are Geist Sans/Mono from `src/app/layout.tsx`.
- `.storybook/preview.tsx` does not import app CSS or fonts.
- Testing addons (`@storybook/addon-vitest`, Chromatic, MCP) are installed; this spec does not configure or use them.

## Goals

- Colocate stories with their components.
- Define a comprehensive story for only the Button component.
- Group components in Storybook by atomic design layer.
- Define standards for how stories are implemented in this project.
- Update `AGENTS.md` with the story conventions established here.

## Requirements

### Scope
- Remove the Storybook starter kit, add colocated Button stories, wire preview CSS/fonts, and document conventions.
- Do not change the Button component API or styles.
- Do not add stories for any component other than Button in this spec.
- Do not add, remove, or configure Storybook addons.

### Starter kit
- Delete `src/stories` entirely (example components, stories, CSS, assets).

### File location & format
- Colocate stories as `src/components/{layer}/{ComponentName}/{ComponentName}.stories.tsx`.
- Button: `src/components/atoms/Button/Button.stories.tsx`.
- Always `.tsx`, even when the file is args-only.
- CSF3: `Meta` / `StoryObj` from `@storybook/nextjs-vite`; default-export `meta`.
- Import the colocated component with a named import from `./ComponentName` (e.g. `import { Button } from "./Button"`).
- Every new component under `src/components` must include this stories file.
- Do not create empty `molecules` / `organisms` / `templates` directories just to hold stories.

### Sidebar grouping
- Set an explicit `title`: `{Layer}/{ComponentName}`.
- Layer is the PascalCase atomic name: `Atoms`, `Molecules`, `Organisms`, `Templates`.
- Button: `Atoms/Button`.

### Story content
- One named story export: `Default`.
- No extra named stories for variants, sizes, or states.
- Default `args` match component defaults: `variant: "primary"`, `size: "md"`, `loading: false`, `fullWidth: false`, plus `children: "Button"`.
- Coverage is via Storybook controls and Autodocs, not a matrix or per-state stories.
- No `play` functions, interaction tests, or `fn()` spies.

### Autodocs & controls
- Every story file sets `tags: ["autodocs"]` on `meta`.
- Atoms (including Button) use `layout: "centered"`. Do not add a min-width decorator; `fullWidth` may look like a no-op in the canvas.
- Expose only this control/docs surface: `variant`, `size`, `loading`, `fullWidth`, `disabled`, `children`, `type`.
- Hide all other native HTML props from controls and Autodocs.

### Preview & config
- Keep the existing `.storybook/main.ts` stories glob. Do not change addons or `staticDirs`.
- In `.storybook/preview.tsx`, import `src/app/globals.css` so Tailwind and CSS variables apply.
- Apply the same Geist Sans and Geist Mono CSS variables/classes as `src/app/layout.tsx` so stories match the app fonts.
- Do not add a Storybook theme switcher or dark-mode Button styles.

### AGENTS.md
- Append a stories section below the existing Shared UI components section (do not remove the Next.js agent block).
- Document: colocated `ComponentName.stories.tsx`; required for every shared component; CSF3 `.tsx`; title `{Layer}/{ComponentName}`; autodocs; Default + controls; curated props listed above; `layout: "centered"` for atoms; named import from `./ComponentName`.
- Canonical example: `src/components/atoms/Button/Button.stories.tsx`.

## Out of scope

- Anything related to testing (play functions, Vitest addon setup, Chromatic, visual/regression tests). Testing will be covered in a separate spec.
- Changing Button (API, styles, `"use client"`).
- Stories for the starter-kit Header/Page or any component other than Button.
- Implementing `molecules` / `organisms` / `templates` (or their stories).
- MDX docs, extra named stories, variant × size matrices, or canvas decorators for `fullWidth`.
- Design tokens, Storybook theming, or dark-mode Button styles.
- Adding or removing Storybook addons.
