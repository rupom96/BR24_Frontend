# TASK-20260928-fe-deps-ui-premium

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-fe-deps-ui-premium |
| Title | React/deps upgrade + premium Login/Navbar/Sidebar |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

Upgrade FE dependencies including React; premium Login + shell UI with motion.

## Important decisions

| Decision | Why |
|----------|-----|
| React 19 + Vite 6 + RTK 2 | User requested React + modern deps; build-stable |
| Keep MUI 5 + MRT 2 | MUI 6/MRT 3 caused widespread ListItem/DatePicker/ExportToCsv TS breaks — deferred to dedicated migration |
| Keep react-router 6 | v7 is separate router rewrite |
| Keep Tailwind 3 | v4 needs PostCSS/config overhaul |
| Login look: slate + teal | Avoid purple/cream AI clichés; brand-forward |

## Files changed (high level)

- `package.json` / lockfile
- LoginUsernameLayer, LoginPasswordLayer
- Navbar, Sidebar, premium-ui.css, main.tsx
- docs stack snapshot + ai-work

## Tests

- `npm run build` — pass (React 19 + Vite 6 + UI)

## Remaining

- MUI 6 + MRT 3 migration (separate task)
- React Router 7 / Tailwind 4 (separate)
- Other login layers (OTP/phone) can adopt same card later
- `xlsx` residual vulnerability (no upstream fix)
