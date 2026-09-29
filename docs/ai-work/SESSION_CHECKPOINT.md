# Session checkpoint

**Last updated:** 2026-09-29

## Current task

none (idle) — auto build version + stamp on Navbar

## Completed

- `scripts/bump-build-info.mjs` + `prebuild` bumps last version segment + Dhaka date/time
- Navbar reads `APP_VERSION` / `APP_BUILD_STAMP` from `buildInfo.ts`

## Exact next action

User: `npm run build` once — confirm Navbar shows new version + stamp.
