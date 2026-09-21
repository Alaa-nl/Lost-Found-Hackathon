# Lost & Found page

## Context

- Specs 010 and 011 are done. `/` still shows Todoish.

## Goals

- `/` shows the Lost & Found app with data saved in the database.

## Requirements

- New client page component LostFoundPage (pages layer), same pattern as
  TodoPage: initialItems, createFoundItem, setFoundItemStatus, deleteFoundItem
  as props; coerce createdAt and claimedAt to Date; generic role="alert" error;
  no refetch.
- src/app/page.tsx loads listFoundItems and renders LostFoundPage.
  Keep force-dynamic.
- Replace tests/e2e/todo.spec.ts with tests/e2e/lostFound.spec.ts: add item,
  mark claimed, reload, delete (unique timestamped names).

## Out of scope

- Filters, search, styling polish. Deleting Todo code.
