# Tasks: Storybook configuration

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not change `Button.tsx`. Do not mount `Button` on a page. Do not add, remove, or configure Storybook addons. Do not change `.storybook/main.ts`. Do not create `molecules` / `organisms` / `templates` directories.

## 1. Remove starter kit

- [x] Delete `src/stories` entirely (example components, stories, CSS, assets).

## 2. Preview CSS and fonts

- [x] In `.storybook/preview.tsx`, import `../src/app/globals.css`.
- [x] Import `Geist` and `Geist_Mono` from `next/font/google` with the same `variable` / `subsets` options as `src/app/layout.tsx`.
- [x] Apply `${geistSans.variable} ${geistMono.variable} antialiased` on the Storybook iframe `<html>` (`document.documentElement.classList.add`). Do not wrap stories in an extra div. Do not add `h-full`.
- [x] Remove `parameters.controls.matchers`. Omit `parameters` if it would be empty.
- [x] Do not add a theme switcher or dark-mode Button styles.

## 3. Button stories

- [x] Add `src/components/atoms/Button/Button.stories.tsx` only (always `.tsx`).
- [x] CSF3: `Meta` / `StoryObj` from `@storybook/nextjs-vite`; default-export `meta`; `satisfies Meta<typeof Button>`.
- [x] Named import `{ Button }` from `"./Button"` (not `@/`).
- [x] `title: "Atoms/Button"`; `component: Button`; `tags: ["autodocs"]`; `layout: "centered"`.
- [x] One named story export: `Default`. No extra named stories. No `play` functions, interaction tests, or `fn()` spies.
- [x] Meta `args`: `variant: "primary"`, `size: "md"`, `loading: false`, `fullWidth: false`, `children: "Button"`. Do not set `type` in args. `Default` inherits meta args (`export const Default: Story = {}`).
- [x] Expose only these controls: `variant`, `size`, `loading`, `fullWidth`, `disabled`, `children`, `type` via `parameters.controls.include`.
- [x] Hide all other native HTML props from Autodocs with `argTypes.<name>.table.disable: true` (at least `className`; add any other extracted native rows until only those 7 remain).
- [x] Let Storybook infer control widgets. Set `children: { control: "text" }` only if inference fails.
- [x] No min-width decorator for `fullWidth`.

## 4. Document conventions

- [x] Append a Stories section in `AGENTS.md` below the existing Shared UI components section. Do not remove or rewrite the Next.js agent block or the Shared UI section.
- [x] Point to `src/components/atoms/Button/Button.stories.tsx` as the canonical example.
- [x] Document colocated `ComponentName.stories.tsx`; required for every new shared component; CSF3 `.tsx`; `Meta` / `StoryObj` from `@storybook/nextjs-vite`; named import from `./ComponentName`.
- [x] Document explicit `title`: `{Layer}/{ComponentName}`; layer PascalCase (`Atoms`, `Molecules`, `Organisms`, `Templates`).
- [x] Document one `Default` story; coverage via controls and Autodocs; no extra named stories; no `play` / `fn()` spies.
- [x] Document `tags: ["autodocs"]`; atoms `layout: "centered"`; curated props `variant`, `size`, `loading`, `fullWidth`, `disabled`, `children`, `type`; hide all other native HTML props from controls and Autodocs.

## 5. Verify

- [x] Typecheck (`npx tsc --noEmit` or project equivalent).
- [x] Run `npm run storybook`. Sidebar shows `Atoms/Button` only (no starter-kit Button/Header/Page).
- [x] Default story renders with primary / md / children `"Button"`. Controls and Autodocs show only the 7 curated props.
- [x] Tailwind/CSS variables apply; iframe `<html>` has Geist font variables and `antialiased`.
- [x] Confirm `Button.tsx` is unchanged and `Button` is not mounted on a page.
- [x] Confirm `.storybook/main.ts` is unchanged.
