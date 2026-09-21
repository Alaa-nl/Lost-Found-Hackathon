# Filter and search

## Goals

- FilterBar molecule: status tabs (All / Waiting / Claimed) and a search input.
- Counter text "X waiting, Y claimed" above the list.

## Requirements

- Filtering happens in LostFoundPage state on the client (no new actions).
- Search matches name, case-insensitive, trimmed.
- Empty result text: "No items match your filter".
- Story + test for FilterBar; update LostFoundPage test and e2e.

## Out of scope

- Sorting options, URL query params, server-side search.
