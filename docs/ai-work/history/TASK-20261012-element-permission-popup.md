# TASK-20261012 — Element Permission Popup

## Summary

EventsOfAChain cards show a permission icon (not on Entry New). Hover loads element coverage for ProcurementTender events: Product Group / Product rows with Authorized To, Status, Done By.

## Backend

- Controller: `BiznessEvent_PCTrackController`
- Routes:
  - `getElementPermissionStatusByEvent`
  - `getProductGroupAndBrandByProductId`
- Repository: `BiznessEvent_PCTrackRepository.GetElementPermissionStatusByEvent` / `GetProductGroupAndBrandByProductId`
- No DB schema or SP changes
- Locked rules: no locationId param; PCTrack filtered by eventNo + firstEventNo + OriginalSequence + bepcId; Tender gate = `ControllerPath == component#TenderRequisition` (not BiznessEvent.Name); FE icon when eventNo + controllerPathType=component + controllerPath=TenderRequisition (slice splits `#`); PG cover = PG permission (empty = all); Product cover = AND of non-empty PG/Brand/Product tables

## Frontend

- `src/domain/interfaces/ElementPermissionStatusInterface.ts`
- Endpoints in `BiznessEventPCTrackVMForJobHistoryApiSlice.ts`
- `src/presentation/pages/EventsOfAChain/ElementPermissionPopover.tsx`
- Wired in `EventsOfAChain.tsx` badge row

## Response extras

- `elementId` included so Product hover can call API-2
