# TASK-20260929-sidebar-particles-page-motion

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260929-sidebar-particles-page-motion |
| Title | Subtle sidebar particles + premium route page transitions |
| Started | 2026-09-29 |
| Completed | 2026-09-29 |
| Status | completed |

## Changes

- `SidebarParticles.tsx` — low-count, low-opacity, `pointer-events: none`, theme accent, reduced-motion off
- `Sidebar.tsx` — particles behind `br24-sidebar-content`
- `PageTransition.tsx` — Framer Motion fade/slide on `location.pathname`
- `App.tsx` — wraps routes with `PageTransition`
- `premium-ui.css` — sidebar particle + page transition styles

## Tests

- `npm run build` — pass
