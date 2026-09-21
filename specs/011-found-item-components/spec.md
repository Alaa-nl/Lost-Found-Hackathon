# Found item components

## Context

- Spec 010 is done. Row type FoundItem from @/generated/prisma/browser.
- Atoms Button, Input, Textarea exist.

## Goals

- Presentational components with stories and tests: StatusBadge (atom),
  FoundItemForm (molecule), FoundItemCard (molecule), FoundItemList (organism).

## Requirements

- StatusBadge: prop status; orange "Waiting", green "Claimed".
- FoundItemForm: fields name, location, room number, notes; onAdd callback;
  clears only after success; Add disabled while pending or when name/location
  is empty.
- FoundItemCard: shows name, location, room, notes, date found, badge, claimed
  date; buttons "Mark claimed" / "Undo" and "Delete" call onSetStatus /
  onDelete.
- FoundItemList: renders the form and a list of cards (key = item.id); empty
  state text "No items yet".
- Follow AGENTS.md component, story (one Default story with play) and test rules.

## Out of scope

- Calling actions or Prisma. Wiring into page.tsx. Filters and search.
