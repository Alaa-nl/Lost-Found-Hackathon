# Found item backend

## Context

- Todoish sample app. Todo backend pattern exists (see AGENTS.md Backend and specs/006-todo-backend).
- Hotel reception needs to log items guests leave behind.

## Goals

- Prisma model FoundItem + migration.
- Server Actions: listFoundItems, createFoundItem, setFoundItemStatus, deleteFoundItem.
- Vitest node tests for each action against prisma/test.db.

## Requirements

- FoundItem fields: id, createdAt, name (required), location (required),
  roomNumber (optional), notes (optional), status ("waiting" | "claimed",
  default "waiting"), claimedAt (optional).
- `status` is a plain String column. TypeScript narrows it to the union
  `FoundItemStatus = "waiting" | "claimed"`.
- helpers.ts: `parseFoundItemFields` trims text; empty name or location throws;
  empty optional fields become null. `isFoundItemStatus` narrows an unknown
  string to the union.
- listFoundItems: newest first (`createdAt` desc).
- setFoundItemStatus({ id, status }): "claimed" sets claimedAt to now;
  "waiting" sets claimedAt to null. Unknown id or unknown status throws.
- deleteFoundItem(id): unknown id throws.
- Follow the Todo action folder and test layout.

## Out of scope

- UI, page.tsx, e2e. Removing Todo. Editing name/location after create.
