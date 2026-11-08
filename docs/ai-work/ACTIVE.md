# Task Identity

- **Task ID:** TASK-20261104-chain-flow-all-tracks
- **Task title:** Chain flow chart — all PCTrack rows + sequence badge + Note
- **Started date:** 2026-11-04
- **Last updated:** 2026-11-04

# Objective

Change existing `getChainFlowChart` + `reactFlowExp2`: list chains from any PCTrack; return all tracks; sequence badge on first of each OriginalSequence; Note on boxes; pending kept with dedupe; sequenceNo filter still last-completed==N.

# Current State

**Done (this session):**

- BE: discovery without requiring 100%; sequenceNo still 100%-only last-completed; Step C all tracks + pending dedupe; denied filter any progress; task order helper.
- FE: unique node ids, consecutive edges, sequence badge, Note (truncate/hover), In Progress status, Denied+Enable unchanged.
- Docs: history task file.

# Next Action

1. Rebuild/restart API (Persistence).
2. Smoke per `docs/ai-work/history/TASK-20261104-chain-flow-all-tracks.md`.

# Notes

- Prior: TASK-20261104-tender-costing-null-cost-fallback (done earlier same day).
- History: `docs/ai-work/history/TASK-20261104-chain-flow-all-tracks.md`
