# TASK-20260928-theme-login-polish

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-theme-login-polish |
| Title | Light/dark theme tokens + attractive theme-aware login + shell consistency |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

Consistent light/dark across shell; login clearer in light mode and premium in both; Framer Motion + theme-aware particles; keep pages fast (no Three.js).

## Important decisions

| Decision | Why |
|----------|-----|
| Framer Motion for login enter | Light motion; respects `useReducedMotion` |
| Theme-aware tsparticles (teal) | Readable light mode + premium dark; fpsLimit 48 |
| Skip Three.js / heavy Lottie | User: keep login fast |
| Shared `LoginShell` | Username + password layers share stage/card/fields |
| CSS vars in `premium-ui.css` | One token set for light `.light` / dark `.dark` |

## Files changed (high level)

- `package.json` — `framer-motion`
- `src/presentation/styles/premium-ui.css` — light/dark tokens + login stage
- `src/presentation/components/LoginShell.tsx` — shared shell + particle/field helpers
- `LoginUsernameLayer.tsx` / `LoginPasswordLayer.tsx` — shell + theme particles
- `Navbar.tsx` / `Sidebar.tsx` / `UserProfile.tsx` — dark: hover/text consistency

## Tests

- `npm run build` — pass

## Remaining

- Optional: OTP / forgot-password / secret-question on same `LoginShell`
- Smoke-test light + dark login + profile panel
