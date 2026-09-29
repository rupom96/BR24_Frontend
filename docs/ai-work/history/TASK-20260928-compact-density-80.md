# TASK-20260928-compact-density-80

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-compact-density-80 |
| Title | Compact UI density ≈ Chrome 80% zoom at 100% zoom |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

At browser 100% zoom, UI should match former look at Chrome 80% zoom — by changing physical sizes (not `transform: scale`).

## Approach (ratio ×0.8)

| Layer | Change |
|-------|--------|
| `main.css` | `html { font-size: 80%; }` — all Tailwind rem (spacing, fonts, `w-72`, …) |
| `tailwind.config.js` | Custom px widths/heights/`fontSize.14` → rem |
| MUI `createTheme` | `spacing: 6.4`, `htmlFontSize: 12.8`, `fontSize: 11.2` |
| `App.css` | MRT input font 13px → `0.8125rem` |

## Note

Inline `style={{ fontSize: N }}` / hard-coded `px` in page files are **not** fully rewritten; rem-based shell + Tailwind + MUI cover most of the chrome. Remaining px hotspots can be converted to rem later if needed.

## Tests

- `npm run build` — pass
- Manual: Chrome zoom 100% should feel like previous 80%
