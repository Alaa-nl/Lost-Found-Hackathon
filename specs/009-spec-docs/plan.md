# Implementation Plan: Update SDD docs

Source spec: [spec.md](./spec.md)

Append a student-facing spec-driven-development section to `README.md`, and change only the `specs/` tree comment. Do not rewrite existing sections.

## Technical context

- Next.js 16 / React 19 / Prisma 7 (SQLite) / Storybook 10 / Tailwind 4 / Vitest / Playwright
- App is a single-user todo list named **Todoish** at `/` only
- `README.md` is already the student clone/setup guide from spec 008 (opening, Stack, Setup, Scripts, File structure, `AGENTS.md` pointer). Keep those sections as they are.
- Current File structure tree comment: `specs/                           # application specs` — change this comment only
- Notes already under File structure (after the tree) stay; the new section goes after them, at the end of the file
- Specs live under `specs/`. Template: `specs/spec_template.md` (Context, Goals, Requirements, Out of scope)
- Spec folders: `specs/NNN-kebab-slug/` with colocated `spec.md`, `plan.md`, `task.md` (`NNN` is 3-digit, zero-padded, sequential)
- SDD skills: `.agents/skills/spec-grill-me/`, `spec-plan/`, `spec-execute/` (each has `SKILL.md`; students must invoke them explicitly)
- `AGENTS.md` holds durable coding conventions — do not edit it in this spec

## Target structure

```
README.md    (edit only: specs/ tree comment + append one section)
```

Do not add, move, or edit `AGENTS.md`, `.agents/skills/`, `specs/spec_template.md`, specs `001`–`008`, app code, or a separate SDD markdown file.

## README.md

### File structure tree

Keep the same entries and shape. Change only the `specs/` comment:

```
├── specs/                           # SDD specs
```

Do not add `spec_template.md`, per-spec files, or `.agents/skills` to the tree.

### New section

Append after the entire File structure section (including the notes under that heading), at the end of the README.

Heading: `## Adding a feature (spec-driven development)`

Audience: students adding a feature with Cursor. Concise. No `AGENTS.md` dump, no catalog of specs `001`–`008`, no instructor-only extras, no git/commit/GitHub.

Cite paths with backticks only (no markdown links). Three `###` headings below, in this order.

### Spec layout

Nested markdown bullets (not an ASCII tree). Document the pattern only — not a list of past specs:

- `specs/spec_template.md` — starting headings for a new spec
- `specs/NNN-kebab-slug/` — one folder per spec
  - `spec.md` — what to build and constraints (Context, Goals, Requirements, Out of scope)
  - `plan.md` — how to build (files, APIs, order); written by **spec-plan**, not by hand during grill
  - `task.md` — checkable implementer work; written by **spec-plan**, executed by **spec-execute**
- `.agents/skills/spec-grill-me/`, `spec-plan/`, `spec-execute/` — the SDD skills

Then: new folder names use the next unused 3-digit prefix, then a kebab-case slug. Use the `NNN-kebab-slug` placeholder — do not invent a concrete example folder.

### Skills

Must be invoked explicitly. Document these invoke forms as backtick lines (here only — not repeated in the process list):

- `/spec-grill-me @specs/NNN-slug/spec.md`
- `/spec-plan @specs/NNN-slug/spec.md`
- `/spec-execute @specs/NNN-slug/task.md`

Then one bullet per skill (name, what it writes or changes):

- **spec-grill-me** — questions in rounds, then updates `spec.md` in place until Requirements and Out of scope are implementable. Does not implement. Does not create `plan.md` or `task.md`.
- **spec-plan** — reads an implementable `spec.md` and writes colocated `plan.md` and `task.md`. Does not implement. Does not edit the spec. If those files already exist, ask before overwriting.
- **spec-execute** — implements remaining unchecked items in `task.md` in order (including Verify) and marks them `[x]` as it goes. Does not rewrite spec, plan, or tasks (except checkboxes).

Then the stop rules: if `spec.md` is still too vague, **spec-plan** should stop and tell the student to run **spec-grill-me** first. If `task.md` is missing or too vague, **spec-execute** should stop and tell the student to run **spec-plan** first.

### Add-a-feature process

Canonical flow — always this order; do not skip **spec-grill-me**. Numbered list; name the skills in steps 2–4, do not paste the `/spec-...` lines here:

1. Copy `specs/spec_template.md` to `specs/NNN-kebab-slug/spec.md` and draft the headings (can be rough).
2. Run **spec-grill-me** on that spec until Requirements and Out of scope are specific enough to implement without guessing (or the student says stop).
3. Run **spec-plan** on that spec → `plan.md` and `task.md`.
4. Run **spec-execute** on that spec’s `task.md` → implement remaining tasks, including Verify.
5. Encode only **durable** conventions in `AGENTS.md` (leave the Next.js block at the bottom unchanged). Do not dump the whole spec into `AGENTS.md`.

After the list: one skill at a time. Do not hand-write `plan.md` / `task.md` instead of **spec-plan**.

## Implementation order

1. Change the `specs/` comment in the File structure tree to `SDD specs`.
2. Append the new section at the end of `README.md` as specified above.
3. Confirm existing README sections are unchanged except that comment, and that no other files were edited.

## Out of scope

- Editing `AGENTS.md`, `.agents/skills`, or `specs/spec_template.md`
- Rewriting specs `001`–`008` (or their `plan.md` / `task.md`)
- A catalog of existing specs
- A separate SDD markdown file
- App/product/code changes, new routes, new npm packages
- Changing Stack, Setup, or Scripts
- Expanding the File structure tree (only the `specs/` comment changes)
- How to add a component (that stays in `AGENTS.md`)
- Git / commit / GitHub instructions
