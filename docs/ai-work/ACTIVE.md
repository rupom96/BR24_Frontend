# Task Identity

- **Task ID:** TASK-20261013-chain-denied-filter-header
- **Task title:** Chain Status — TE header + deniedFilter
- **Started date:** 2026-10-13
- **Last updated:** 2026-10-13

# Objective

Match Available Chain Status header to Tender Expense For SP; add `deniedFilter=all|enabled|denied` on `getChainFlowChart`.

# Current State

**Backend (done):** `getChainFlowChart?deniedFilter=` — all (omit/null), enabled (no Denied==true on chain), denied (at least one Denied==true)

**Frontend (done):** TE-style header (accent bar + title, no subtitle); 5th filter Denied status; RTK passes `deniedFilter`

# Next Action

1. Restart API (DLL lock if IIS Express running).
2. Smoke: header looks like TE; Only Denied / Only Enabled / All.

# Notes

- Related: TASK-20261013-chain-denied-enable
