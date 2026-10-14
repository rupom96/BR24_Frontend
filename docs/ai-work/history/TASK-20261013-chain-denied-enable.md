# TASK-20261013-chain-denied-enable

## Summary

Surface `BiznessEvent_PCTrack.Denied` on Available Chain Status flowchart; enable via batch clear.

## API

- `getChainFlowChart` task field: `denied` (`bool?`)
- `POST api/BiznessEvent_PCTrack/clearDenied`  
  Body: `{ "biznessEventPCTrackIds": [1, 2, ...] }` → each row `Denied = false`

## FE

- Node (denied): reddish + “Denied” + Enable → `[thatId]`
- Card header (any denied): indicator + Enable → all denied ids in chain
- Same mutation; Swal confirm; then `refetchChainFlowchart()` (lazy local state)

## Key files

- BE: `ClearDeniedCommand`, `BiznessEvent_PCTrackController`, `GetChainFlowChart` map, VM `Denied`
- FE: `ChainDataInterface`, `BiznessEventPCTrackVMForJobHistoryApiSlice`, `ReactFlowExp2`
