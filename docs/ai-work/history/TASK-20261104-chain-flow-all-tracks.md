# TASK-20261104-chain-flow-all-tracks

## Summary

`getChainFlowChart` + `reactFlowExp2`: show all PCTrack rows (not only 100%), sequence badge on first of each `OriginalSequence`, Note on nodes, keep pending with dedupe.

## Decisions

- Chain inclusion **B**: any PCTrack lists a chain.
- `sequenceNo` filter: still **last completed (ProgressPReported == 100) == N**.
- Pending: keep from `SA_NextEventForChainFlowChart`; drop if same chain already has PCTrack at that Sequence.
- Denied: any progress; Enable unchanged when `Denied == true` (incl. in-progress).
- Order: walk NextSequence groups; within same OriginalSequence → BiznessEventPCTrackId ASC; pending inserted by Sequence.
- Scope: change existing API + page (no parallel mode).
- Note: `BiznessEvent_PCTrack.Note`; hide if empty; >8 chars → `...` + hover full text; accent bold.
- In-progress status: `In Progress- {ProgressPReported} %` (Denied still shows Denied + Enable).

## Key files

- BE: `BiznessEvent_PCTrackRepository.GetChainFlowChart` (+ `OrderChainFlowChartTasks`, denied filter any progress)
- FE: `ReactFlowExp2.tsx` / `.css`

## Smoke

1. Rebuild/restart API.
2. Chain with duplicate OriginalSequence + Notes → badge only on first; Note truncated; hover full.
3. In-progress track → status `In Progress- n %`; click opens completed preview.
4. Denied in-progress → Denied + Enable.
5. Pending only when no PCTrack at that sequence.
6. Sequence filter still “last completed == N”.
