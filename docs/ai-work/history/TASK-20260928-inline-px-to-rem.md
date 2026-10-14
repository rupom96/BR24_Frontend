# TASK-20260928-inline-px-to-rem

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-inline-px-to-rem |
| Title | Convert inline px font/size styles to rem (density ×0.8) |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

Inline `fontSize` / width / height / Tailwind `[Npx]` across pages follow `html { font-size: 80% }` via rem.

## Approach

Codemod: `docs/scripts/convert-inline-px-to-rem.mjs`

- ~145 files, ~2600 replacements
- `fontSize: 13` → `'0.8125rem'`; `'14px'` → rem; `[150px]` → `[9.375rem]`
- Skips MUI spacing numbers, non-integer theme `fontSize`, tsparticles density 1920/1080

## Fixes after codemod

- SwitchCustom borderRadius arithmetic restored
- Login tsparticles `density.width/height` and `stroke.width` restored to numbers

## Tests

- `npm run build` — pass
