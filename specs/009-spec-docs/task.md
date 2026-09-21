# Tasks: Update SDD docs

Source: [plan.md](./plan.md) · [spec.md](./spec.md)

Edit `README.md` only. Do not edit `AGENTS.md`, `.agents/skills`, `specs/spec_template.md`, specs `001`–`008`, or app code. Do not add a separate SDD markdown file. Do not mention git, commit, or GitHub.

## 1. File structure tree

- [x] Keep the existing File structure entries and shape. Change only the `specs/` comment to `SDD specs`.
- [x] Do not add `spec_template.md`, per-spec files, or `.agents/skills` to the tree.
- [x] Leave the notes already under File structure (after the tree) in place.

## 2. New README section

- [x] Append one section after the entire File structure section (including those notes), at the end of the README. Do not rewrite opening, Stack, Setup, Scripts, or the `AGENTS.md` pointer.
- [x] Heading: `## Adding a feature (spec-driven development)`. Concise. Audience: students using Cursor.
- [x] Three `###` headings in this order: Spec layout, Skills, Add-a-feature process.
- [x] Cite paths with backticks only (no markdown links).
- [x] Do not copy `AGENTS.md` into the README. Do not catalog specs `001`–`008`. Do not mention instructor-only extras. Do not mention git, commit, or GitHub.

## 3. Spec layout

- [x] Nested markdown bullets (not an ASCII tree): `specs/spec_template.md`; `specs/NNN-kebab-slug/` with `spec.md`, `plan.md`, `task.md` and the one-line roles from the plan; `.agents/skills/spec-grill-me/`, `spec-plan/`, `spec-execute/`.
- [x] State that `plan.md` is written by **spec-plan**, not by hand during grill; `task.md` is written by **spec-plan** and executed by **spec-execute**.
- [x] State new folder names: next unused 3-digit prefix, then a kebab-case slug. Use the `NNN-kebab-slug` placeholder; do not invent a concrete example folder.

## 4. Skills

- [x] State that each skill must be invoked explicitly.
- [x] Document these invoke forms as backtick lines (in this subsection only): `/spec-grill-me @specs/NNN-slug/spec.md`, `/spec-plan @specs/NNN-slug/spec.md`, `/spec-execute @specs/NNN-slug/task.md`.
- [x] **spec-grill-me** — questions in rounds, then updates `spec.md` in place until Requirements and Out of scope are implementable. Does not implement. Does not create `plan.md` or `task.md`.
- [x] **spec-plan** — reads an implementable `spec.md` and writes colocated `plan.md` and `task.md`. Does not implement. Does not edit the spec. If those files already exist, ask before overwriting.
- [x] **spec-execute** — implements remaining unchecked items in `task.md` in order (including Verify) and marks them `[x]` as it goes. Does not rewrite spec, plan, or tasks (except checkboxes).
- [x] If `spec.md` is still too vague, **spec-plan** should stop and tell the student to run **spec-grill-me** first. If `task.md` is missing or too vague, **spec-execute** should stop and tell the student to run **spec-plan** first.

## 5. Add-a-feature process

- [x] Numbered canonical flow; always this order; do not skip **spec-grill-me**. Name the skills in steps 2–4; do not paste the `/spec-...` lines here.
- [x] 1. Copy `specs/spec_template.md` to `specs/NNN-kebab-slug/spec.md` and draft the headings (can be rough).
- [x] 2. Run **spec-grill-me** on that spec until Requirements and Out of scope are specific enough to implement without guessing (or the student says stop).
- [x] 3. Run **spec-plan** on that spec → `plan.md` and `task.md`.
- [x] 4. Run **spec-execute** on that spec’s `task.md` → implement remaining tasks, including Verify.
- [x] 5. Encode only **durable** conventions in `AGENTS.md` (leave the Next.js block at the bottom unchanged). Do not dump the whole spec into `AGENTS.md`.
- [x] After the list: one skill at a time. Do not hand-write `plan.md` / `task.md` instead of **spec-plan**.

## 6. Verify

- [x] Existing README sections (opening, Stack, Setup, Scripts, File structure tree entries, `AGENTS.md` pointer) are unchanged except the `specs/` comment.
- [x] New section is last, uses the headings and facts from the plan, and has no git/commit/GitHub, no `001`–`008` catalog, and no `AGENTS.md` dump.
- [x] No edits outside `README.md`.
