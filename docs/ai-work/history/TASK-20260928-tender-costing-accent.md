# TASK-20260928-tender-costing-accent

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-tender-costing-accent |
| Title | TenderCosting blues → ThemeSettings accent |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Changes

- `TenderCosting.tsx`: table header/footer (`#ECEFF9` / `#F6F7FF`) + indigo summary panel → `hexToRgba(currentColor, …)`
- `CostingFormTabular.tsx`: BG/PG/SD bands + total (`#ced1f2` / `#e3e3fc`) → accent soft fills
- Save button already uses `bg-blue-600` (global accent remap)

## Tests

- `tsc --noEmit` — clean for these files
