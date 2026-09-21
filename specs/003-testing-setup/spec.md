# Testing setup

## Context

- Packages already installed: `vitest`, `playwright`, `@storybook/addon-vitest`, `@vitest/browser-playwright`, `@vitest/coverage-v8`. Not installed: `@playwright/test`, `@testing-library/react`, `vitest-browser-react`.
- Vitest is partly wired: `vitest.config.ts` already has a Storybook project (`storybookTest` plugin, Chromium, headless). `vitest.shims.d.ts` exists. `@storybook/addon-vitest` is already in `.storybook/main.ts`.
- No npm test scripts, no test files, no `playwright.config` currently exist.
- Shared UI: only `src/components/atoms/Button`. Related files colocate in the component folder; no barrels. Named import from `./ComponentName` in colocated files.
- Stories: CSF3, one `Default` export, colocated `ComponentName.stories.tsx`. Spec 002 / `AGENTS.md` currently forbid `play` functions, interaction tests, and `fn()` spies — this spec reverses that and requires a `play` function.
- Home page (`src/app/page.tsx`) writes a Prisma todo on every visit. The heading text is `Prisma setup test`.
- No CI. Coverage tooling is installed but unused.

## Goals

- Colocated Vitest browser tests for every new shared component.
- A `play` function on each component’s `Default` story so the Storybook test UI has a real interaction test.
- Playwright e2e, including a smoke visit to `/`.
- npm scripts for Vitest and Playwright.
- Document the testing conventions in `AGENTS.md` (including amending the Stories section).

## Requirements

### Scope
- Wire Vitest (colocated component tests + existing Storybook project), Playwright e2e, npm scripts, and `AGENTS.md`.
- Add `vitest-browser-react` (mount helper for Vitest browser) and `@playwright/test`. Do not add Testing Library or jsdom.
- Write the canonical Button examples: `Button.test.tsx` and a `play` function on `Default`.
- Add a Playwright smoke test that visits `/` (the page mutates the DB; that is accepted).

### Component tests (Vitest)
- Colocate as `src/components/{layer}/{ComponentName}/{ComponentName}.test.tsx`.
- Button: `src/components/atoms/Button/Button.test.tsx`.
- Required for every new shared component under `src/components`.
- Named import from `./ComponentName` (same as stories). Do not use `@/` in these files.
- Run in Vitest **browser** mode (Playwright Chromium, headless), not jsdom.
- Mount with `vitest-browser-react`. Query/assert with Vitest browser locators (e.g. `getByRole`). No `@testing-library/*`.
- Button example (small, not a variant/size matrix):
  - Renders the given `children`.
  - When `loading` is true: native `disabled` and `aria-disabled="true"`.

### Vitest config
- Keep the existing Storybook project in `vitest.config.ts`.
- Add a second project for colocated `src/components/**/*.test.tsx` (browser Chromium, headless).
- Do not run `tests/e2e` through Vitest.

### Stories / Storybook
- Keep one named story export: `Default`. Do not add extra named stories for tests.
- Every shared-component `Default` story must include a `play` function that exercises a basic interaction.
- `fn()` spies and Storybook test utilities (`expect`, `userEvent`, etc.) are allowed.
- Button `Default` `play`: find the button by role (accessible name `"Button"` from existing args) and click it.
- Do not change the curated controls/Autodocs surface from spec 002.
- Keep `@storybook/addon-vitest` in `.storybook/main.ts` so stories (including `play`) run from the Storybook test UI.

### Playwright e2e
- Config at the repo root. Tests live in `tests/e2e/` (e.g. `tests/e2e/home.spec.ts`).
- Chromium only.
- `webServer` starts the Next app so the smoke test is self-contained (`reuseExistingServer` when a server is already running).
- Smoke: visit `/` and assert the `Prisma setup test` heading is visible.
- Ignore Playwright output dirs (`test-results`, `playwright-report`, and the usual Playwright cache) in `.gitignore` if not already ignored.

### Scripts
- `test`: Vitest run (both Vitest projects; exits, no watch).
- `test:e2e`: Playwright e2e.

### AGENTS.md
- Amend the existing Stories “Story content” bullets: remove the ban on `play` / interaction tests / `fn()` spies. Require a `play` function on `Default`. Still one named story; still no variant/size/state story matrix.
- Append a testing section (do not remove the Next.js agent block).
- Document: colocated `*.test.tsx` required; Vitest browser + `vitest-browser-react` (not Testing Library / jsdom); Playwright in `tests/e2e/`; scripts above; Storybook addon runs stories including `play`.
- Canonical examples: `Button.test.tsx` and `Button.stories.tsx`.

## Out of scope

- `@testing-library/*`, jsdom, and a third Vitest environment.
- Coverage reports, coverage npm scripts, and coverage thresholds (`@vitest/coverage-v8` stays unused).
- CI.
- Chromatic / visual regression.
- Extra named stories for tests (no `Interaction` story, no variant matrix).
- Thorough Button coverage (variants, sizes, `fullWidth`, `type`, click spies) beyond the two cases above.
- E2e flows other than the `/` smoke.
- Changing Button API or styles.
- Implementing `molecules` / `organisms` / `templates`.
