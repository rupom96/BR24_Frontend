# TASK-20260928-theme-settings-accent

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-theme-settings-accent |
| Title | ThemeSettings UX + teal default + login accent sync |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |

## Objective

Modern ThemeSettings panel; hide FAB on login; single accent (teal default) across app including login; ThemeSettings color changes drive login too.

## Important decisions

| Decision | Why |
|----------|-----|
| Default accent `#0d9488` | Match login teal; user asked whole-project consistency |
| CSS vars `--br24-accent*` from Redux | Login CTA/particles/shell follow ThemeSettings |
| Hide FAB on AUTH_PATHS | Settings only after login |
| Persist `colorMode` / `themeMode` in localStorage on slice init | Survives refresh on login + app |

## Files

- `ThemeSettings.tsx`, `premium-ui.css`, `App.tsx`
- `CurrentColorSlice.ts`, `CurrentModeSlice.ts`
- `LoginShell.tsx`, login username/password layers
- `colorUtils.ts`

## Tests

- `npm run build` — pass
