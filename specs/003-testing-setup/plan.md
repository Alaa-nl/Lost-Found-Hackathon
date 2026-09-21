# Implementation Plan: Testing setup

Source spec: [spec.md](./spec.md)

Wire Vitest (colocated component tests + existing Storybook project), Playwright e2e, npm scripts, and `AGENTS.md`. Add canonical Button test + `Default` `play`. Do not change the Button API or styles.

## Technical context

- Next.js 16 / React 19 / Vitest (browser) / Storybook 10 (`@storybook/nextjs-vite`)
- Already installed: `vitest`, `playwright`, `@storybook/addon-vitest`, `@vitest/browser-playwright`, `@vitest/coverage-v8`
- Not installed (add as devDependencies, `"latest"` like the other test packages): `vitest-browser-react`, `@playwright/test`
- Do not add `@testing-library/*`, jsdom, `@vitejs/plugin-react`, or coverage scripts
- `vitest.config.ts` already has one project: `storybook` (`storybookTest` plugin, Chromium, headless). Keep it. `vitest.shims.d.ts` exists
- `@storybook/addon-vitest` is already in `.storybook/main.ts` — do not change `main.ts`
- No npm test scripts, no test files, no `playwright.config`
- Only shared UI: `src/components/atoms/Button/` (`Button.tsx`, `Button.stories.tsx`)
- Stories: CSF3, one `Default` export, meta args `children: "Button"`. Curated controls/Autodocs from spec 002 stay as-is
- Home (`src/app/page.tsx`) heading: `Prisma setup test`. Page writes a Prisma todo on every visit — accepted
- App default URL: `http://localhost:3000` (`npm run dev`)
- `.gitignore` has `/coverage`; no Playwright output dirs yet
- CI is out of scope; `@vitest/coverage-v8` stays unused

## Target structure

```
vitest.config.ts                                    (add components project)
playwright.config.ts                                (new)
tests/e2e/home.spec.ts                              (new)
src/components/atoms/Button/Button.test.tsx         (new)
src/components/atoms/Button/Button.stories.tsx      (add Default play)
package.json                                        (deps + scripts)
.gitignore                                          (Playwright output dirs)
AGENTS.md                                           (amend Stories; append Testing)
```

Do not create `molecules` / `organisms` / `templates`. Do not change `Button.tsx` or `.storybook/main.ts`.

## Dependencies

```json
"vitest-browser-react": "latest",
"@playwright/test": "latest"
```

DevDependencies only. After install, browsers for `@playwright/test` if missing: `npx playwright install chromium`.

## Vitest config

**File:** `vitest.config.ts`

Keep the existing `storybook` project unchanged. Add a second project. Do not set a root `test.include` that would pick up `tests/e2e`.

```ts
{
  extends: true,
  test: {
    name: "components",
    include: ["src/components/**/*.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" }],
    },
  },
}
```

- No setup file, no CSS import, no extra Vite React plugin (Vitest/esbuild JSX is enough)
- No coverage config or thresholds
- Storybook project continues to run stories (including `play`) via `storybookTest`

## Button component tests

**File:** `src/components/atoms/Button/Button.test.tsx`

Named import `{ Button }` from `"./Button"`. Do not use `@/`. Mount with `render` from `vitest-browser-react`. Query/assert with Vitest browser locators + `expect.element`. Two tests only:

```tsx
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./Button";

test("renders children", async () => {
  const screen = await render(<Button>Save</Button>);
  await expect
    .element(screen.getByRole("button", { name: "Save" }))
    .toBeVisible();
});

test("loading sets native disabled and aria-disabled", async () => {
  const screen = await render(<Button loading>Save</Button>);
  // children use `invisible` when loading, so do not require an accessible name
  const button = screen.getByRole("button");
  await expect.element(button).toBeDisabled();
  await expect.element(button).toHaveAttribute("aria-disabled", "true");
});
```

No variant/size/`fullWidth`/`type`/click-spy matrix.

## Button story `play`

**File:** `src/components/atoms/Button/Button.stories.tsx`

Keep one named export `Default`. Do not add stories. Do not change `meta` controls/Autodocs/`argTypes`/`args`. Use Storybook 10 play args (`canvas`, `userEvent`); no `fn()` on Button (would add a control/Autodocs row).

```tsx
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Button" }),
    );
  },
};
```

## Playwright e2e

**File:** `playwright.config.ts` (repo root)

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

Chromium only — do not add Firefox/WebKit projects. No extra reporters, retries, or traces.

**File:** `tests/e2e/home.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("home shows Prisma setup test heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Prisma setup test" }),
  ).toBeVisible();
});
```

## Scripts

In `package.json`:

```json
"test": "vitest run",
"test:e2e": "playwright test"
```

`vitest run` exits (no watch) and runs both Vitest projects.

## gitignore

Under the existing `# testing` section, add:

```
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

## AGENTS.md

Do not remove or rewrite the Next.js agent block.

**Stories → Story content** (replace the ban):

- One named story export: `Default`. Coverage via controls and Autodocs, not extra named stories for variants, sizes, or states.
- Every shared-component `Default` story must include a `play` function that exercises a basic interaction.
- `fn()` spies and Storybook test utilities (`expect`, `userEvent`, etc.) are allowed.

**Testing** section — insert after Stories (before the Next.js agent block). Canonical examples: `Button.test.tsx` and `Button.stories.tsx`.

Document:

1. Colocated `src/components/{layer}/{ComponentName}/{ComponentName}.test.tsx` required for every new shared component
2. Named import from `./ComponentName` (not `@/`)
3. Vitest **browser** (Playwright Chromium, headless) + `vitest-browser-react`; query with Vitest locators (`getByRole`). No Testing Library, no jsdom
4. Playwright e2e in `tests/e2e/`; config at repo root; Chromium only
5. Scripts: `test` (Vitest run, both projects), `test:e2e` (Playwright)
6. `@storybook/addon-vitest` runs stories including `play` from the Storybook test UI

## Implementation order

1. Install `vitest-browser-react` and `@playwright/test`. Install Chromium for Playwright if needed.
2. Add the `components` project to `vitest.config.ts`.
3. Add `Button.test.tsx`.
4. Add `Default` `play` to `Button.stories.tsx`.
5. Add `playwright.config.ts` and `tests/e2e/home.spec.ts`.
6. Add gitignore entries and npm scripts.
7. Amend Stories + append Testing in `AGENTS.md`.
8. Typecheck. Run `npm test` and `npm run test:e2e`.

## Out of scope

- `@testing-library/*`, jsdom, a third Vitest environment, `@vitejs/plugin-react`
- Coverage reports, coverage npm scripts, coverage thresholds
- CI
- Chromatic / visual regression
- Extra named stories; Button variant/size/`fullWidth`/`type`/click-spy coverage
- E2e flows other than `/` smoke
- Changing Button API or styles; `"use client"`
- Implementing `molecules` / `organisms` / `templates`
- Changing `.storybook/main.ts`
