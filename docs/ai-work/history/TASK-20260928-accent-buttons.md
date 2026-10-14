# TASK-20260928-accent-buttons

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-accent-buttons |
| Title | Remap default blueish buttons to ThemeSettings accent |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

All default blueish buttons project-wide follow ThemeSettings accent (teal default).

## Approach

Central remap (not file-by-file):
1. `tailwind.config.js` — `blue.500–900` → `--br24-accent*` CSS vars
2. MUI `ThemeProvider` — `palette.primary` + Button/Checkbox/Radio/Switch overrides from `currentColor`
3. `premium-ui.css` — safety overrides for `bg-blue-*` / MUI primary
4. `applyAccentCssVars` — sets hover/strong/soft-fill tokens

## Tests

- `npm run build` — pass
