# TASK-20260928-soft-neutrals

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-soft-neutrals |
| Title | Soften pure white/black to UI-friendly neutrals |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Approach

| Layer | Change |
|-------|--------|
| CSS tokens | `--br24-white: #f8f9fb`, `--br24-black: #0f172a`; elevated surfaces off-white |
| Tailwind | `white` / `black` → CSS vars; soft main-bg / dark shells |
| MUI | `common`, `background.paper/default`, `text`, `primary.contrastText` |
| Safety CSS | `.bg-white` / `.text-white` / `.bg-black` / `.text-black` |

## Tests

- `npm run build` — pass
