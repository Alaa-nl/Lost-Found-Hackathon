# Lost & Found

A small web app for a hotel reception: staff log items guests leave behind and
mark them as claimed when the owner picks them up.

Next.js App Router, React 19, Prisma 7 on SQLite, Tailwind 4, Storybook 10,
Vitest and Playwright. Started from the Todoish course sample.

## Features

- Add a found item: name, where it was found, optional room number and notes.
- See all items as cards, newest first, with a status badge
  (orange = Waiting, green = Claimed).
- Mark an item claimed. The card shows the claim date and the button goes away.
- Delete an item.
- Filter by status (All / Waiting / Claimed) and search by name.
- A counter at the top, for example "3 waiting, 1 claimed".

## Requirements

Node 24 (see `.nvmrc`). Prisma 7 does not support Node 23, and `better-sqlite3`
is a native module that must be built against the Node version you run.

```bash
nvm use
```

## Getting started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The app runs at http://localhost:3000.

## Checks

```bash
npm test
npm run test:e2e
npm run lint
npm run build
npm run storybook
```

## How it is built

Each feature went through a spec in `specs/`:

| Spec | What it added |
| --- | --- |
| `010-found-item-backend` | `FoundItem` model, migration, four Server Actions, action tests |
| `011-found-item-components` | StatusBadge, FoundItemForm, FoundItemCard, FoundItemList |
| `012-lost-found-page` | `/` wired to the database, LostFoundPage, e2e test |
| `013-filter-search` | FilterBar, client-side filtering and search, counter |
| `014-polish` | App name, metadata, card grid, muted claimed cards |
| `015-remove-todo` | Removed the Todo sample, clearer form, one-way claiming |

## Architecture

- `src/app/page.tsx` is a Server Component. It loads the items and passes the
  Server Actions down as props.
- `src/components/pages/LostFoundPage` is the only stateful component. It never
  imports Prisma or the actions.
- Components follow Atomic Design under `src/components/{atoms,molecules,organisms,templates,pages}`,
  each with a `.tsx`, a `.stories.tsx` and a `.test.tsx`.

See `AGENTS.md` for the full conventions.
