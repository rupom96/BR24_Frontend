# TASK-20260929 — Glass Navbar / ThemeSettings / UserProfile

**Status:** done  
**Date:** 2026-09-29

## Goal

Match sidebar frosted-glass look on Navbar, ThemeSettings, and UserProfile.

## Done

- `premium-ui.css`: `.br24-shell-navbar`, `.br24-profile-panel` (+ card/icon/save helpers), `.br24-theme-panel` (+ mode toggle, preview, FAB, close hover)
- `App.tsx`: navbar shell wrapper `bg-transparent`
- `Navbar.tsx`: `br24-nav-icon-btn` on menu + profile chip
- `UserProfile.tsx`: glass card structure; accent vars instead of teal hardcodes
- ThemeSettings: already on panel classes; CSS deepened

## Verify

`npm run build` — pass
