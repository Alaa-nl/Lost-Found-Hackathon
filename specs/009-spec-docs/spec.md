# Update spec driven development (SDD) docs

## Context

- This repo is sample code for a 4th-year IT class. The running app is a single-user todo list named **Todoish**.
- `README.md` is already a student clone/setup guide from spec 008 (what Todoish is, stack, setup, scripts, file-structure tree, pointer to `AGENTS.md`). Keep those sections. Spec 008 excluded an SDD tutorial; this spec **adds** one as a new README section.
- Audience for the new section: students adding a feature with Cursor, not instructors and not first-clone setup.
- Specs live under `specs/`. Template: `specs/spec_template.md` (headings: Context, Goals, Requirements, Out of scope).
- Existing spec folders use `specs/NNN-kebab-slug/` with colocated `spec.md`, `plan.md`, and `task.md` (`NNN` is a 3-digit, zero-padded, sequential prefix).
- SDD skills live under `.agents/skills/`: `spec-grill-me`, `spec-plan`, `spec-execute` (each has a `SKILL.md`). They set `disable-model-invocation: true`, so students must invoke them explicitly.
- `AGENTS.md` holds durable coding conventions after a spec is implemented. It is not the SDD tutorial. This spec does not edit `AGENTS.md`.

## Goals

- A student-facing README section that outlines the SDD file/folder pattern, documents the three skills, and states the canonical add-a-feature process.

## Requirements

### README.md

- Keep the existing 008 sections (opening, Stack, Setup, Scripts, File structure, `AGENTS.md` pointer). Do not rewrite them as an SDD guide.
- In the File structure tree, keep the same entries and shape. Change only the `specs/` comment to `SDD specs`. Do not add `spec_template.md`, per-spec files, or `.agents/skills` to the tree.
- Append one new section after the entire File structure section (including any notes under that heading), at the end of the README.
- Heading: `## Adding a feature (spec-driven development)`
- Concise. Audience: students using Cursor.
- Do not copy `AGENTS.md` into the README. Do not catalog specs `001`–`008`.
- Do not mention instructor-only extras that some spec folders may contain.
- Do not mention git, commit, or GitHub.

### Spec layout to document

Document this pattern in the new section only (not a list of past specs):

- `specs/spec_template.md` — starting headings for a new spec
- `specs/NNN-kebab-slug/` — one folder per spec
  - `spec.md` — what to build and constraints (Context, Goals, Requirements, Out of scope)
  - `plan.md` — how to build (files, APIs, order); written by **spec-plan**, not by hand during grill
  - `task.md` — checkable implementer work; written by **spec-plan**, executed by **spec-execute**
- `.agents/skills/spec-grill-me/`, `spec-plan/`, `spec-execute/` — the SDD skills

New folder names: next unused 3-digit prefix, then a kebab-case slug.

### Skills to document

Name each skill, what it writes or changes, and that it must be invoked explicitly. Document these invoke forms:

- `/spec-grill-me @specs/NNN-slug/spec.md`
- `/spec-plan @specs/NNN-slug/spec.md`
- `/spec-execute @specs/NNN-slug/task.md`

- **spec-grill-me** — questions in rounds, then updates `spec.md` in place until Requirements and Out of scope are implementable. Does not implement. Does not create `plan.md` or `task.md`.
- **spec-plan** — reads an implementable `spec.md` and writes colocated `plan.md` and `task.md`. Does not implement. Does not edit the spec. If those files already exist, ask before overwriting.
- **spec-execute** — implements remaining unchecked items in `task.md` in order (including Verify) and marks them `[x]` as it goes. Does not rewrite spec, plan, or tasks (except checkboxes).

If `spec.md` is still too vague, **spec-plan** should stop and tell the student to run **spec-grill-me** first. If `task.md` is missing or too vague, **spec-execute** should stop and tell the student to run **spec-plan** first.

### Add-a-feature process

Document this sequence as the canonical flow (always this order; do not skip **spec-grill-me**):

1. Copy `specs/spec_template.md` to `specs/NNN-kebab-slug/spec.md` and draft the headings (can be rough).
2. Run **spec-grill-me** on that spec until Requirements and Out of scope are specific enough to implement without guessing (or the student says stop).
3. Run **spec-plan** on that spec → `plan.md` and `task.md`.
4. Run **spec-execute** on that spec’s `task.md` → implement remaining tasks, including Verify.
5. Encode only **durable** conventions in `AGENTS.md` (leave the Next.js block at the bottom unchanged). Do not dump the whole spec into `AGENTS.md`.

One skill at a time. Do not hand-write `plan.md` / `task.md` instead of **spec-plan**.

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
