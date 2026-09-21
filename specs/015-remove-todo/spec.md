# Remove the Todo code

## Context

- Specs 010 to 014 are done. `/` is the Lost & Found app.
- The Todoish sample code is still in the repo but nothing renders it.

## Goals

- Delete the Todo model, actions, components and tests.
- Fix the UI problems found while demoing the app.

## Requirements

- Remove the `Todo` Prisma model and add a migration that drops the table.
- Remove `src/actions/todo/`, the Todo components, and `tests/actions/todo/`.
- Remove the Todo cleanup from `tests/actions/setup.ts`.
- Keep Button, Input, Textarea, Header, Footer and PageTemplate: the Lost &
  Found app uses them.
- The form fields must say what they are for: mark the two required fields and
  give every field a placeholder example.
- Remove the "Undo" button; an item that is claimed stays claimed.
- Search must match the item name, case-insensitive and trimmed.

## Out of scope

- Dark mode. New packages. Changing the Lost & Found data model.
