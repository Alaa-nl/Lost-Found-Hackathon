# Tasks: Testing setup

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Do not change `Button.tsx`. Do not change `.storybook/main.ts`. Do not add `@testing-library/*`, jsdom, or coverage scripts. Do not add extra named stories. Do not create `molecules` / `organisms` / `templates` directories. Do not run `tests/e2e` through Vitest.

## 1. Dependencies

- [x] Add `vitest-browser-react` and `@playwright/test` as devDependencies (`"latest"`, matching existing test packages).
- [x] Do not add `@testing-library/*`, jsdom, or `@vitejs/plugin-react`.
- [x] Install Playwright Chromium if missing (`npx playwright install chromium`).

## 2. Vitest config

- [x] Keep the existing `storybook` project in `vitest.config.ts` unchanged.
- [x] Add a second project named `components`: `include: ["src/components/**/*.test.tsx"]`, browser Chromium, headless, `provider: playwright({})`.
- [x] Do not add a root include that would pick up `tests/e2e`. No coverage config. No setup file. No CSS import in Vitest.

## 3. Button component tests

- [x] Add `src/components/atoms/Button/Button.test.tsx` only.
- [x] Named import `{ Button }` from `"./Button"` (not `@/`).
- [x] Mount with `render` from `vitest-browser-react`. Query/assert with Vitest browser locators and `expect.element`.
- [x] Test: renders the given `children` (visible button named `"Save"`).
- [x] Test: `loading` → native disabled and `aria-disabled="true"`. Query `getByRole("button")` without requiring an accessible name (loading children use `invisible`).
- [x] No variant/size/`fullWidth`/`type`/click-spy cases.

## 4. Button story `play`

- [x] Keep one named story export: `Default`. Do not add extra stories.
- [x] Do not change curated controls/Autodocs/`argTypes`/`args` from spec 002.
- [x] Add `play` on `Default`: `canvas.getByRole("button", { name: "Button" })`, then `userEvent.click`. Use play args `canvas` and `userEvent` (Storybook 10). No `fn()` on Button.

## 5. Playwright e2e

- [x] Add `playwright.config.ts` at repo root: `testDir: "tests/e2e"`, Chromium only, `baseURL: "http://localhost:3000"`.
- [x] `webServer`: `command: "npm run dev"`, `url: "http://localhost:3000"`, `reuseExistingServer: !process.env.CI`.
- [x] Do not add Firefox/WebKit projects.
- [x] Add `tests/e2e/home.spec.ts`: `page.goto("/")`, assert heading `"Prisma setup test"` is visible.
- [x] Add to `.gitignore` under testing: `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`.

## 6. Scripts

- [x] `test`: `vitest run` (both Vitest projects; exits, no watch).
- [x] `test:e2e`: `playwright test`.
- [x] Do not add coverage scripts or a watch-mode test script.

## 7. Document conventions

- [x] In `AGENTS.md` Stories → Story content: remove the ban on `play` / interaction tests / `fn()` spies. Require a `play` function on `Default`. Still one named story; still no variant/size/state story matrix.
- [x] Append a Testing section after Stories and before the Next.js agent block. Do not remove or rewrite that block.
- [x] Document colocated `*.test.tsx` required; named import from `./ComponentName`; Vitest browser + `vitest-browser-react` (not Testing Library / jsdom); Playwright in `tests/e2e/`; scripts `test` and `test:e2e`; Storybook addon-vitest runs stories including `play`.
- [x] Point to `Button.test.tsx` and `Button.stories.tsx` as canonical examples.

## 8. Verify

- [x] Typecheck (`npx tsc --noEmit` or project equivalent).
- [x] `npm test` runs both Vitest projects (components + storybook) and exits 0.
- [x] `npm run test:e2e` visits `/` and passes (DB write on home is expected).
- [x] Confirm `Button.tsx` and `.storybook/main.ts` are unchanged.
- [x] Confirm Autodocs/controls still show only the 7 curated Button props.
- [x] Confirm no Testing Library, jsdom, or coverage scripts were added.
