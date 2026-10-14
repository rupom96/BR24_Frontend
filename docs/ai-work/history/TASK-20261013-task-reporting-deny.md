# TASK-20261013 — TaskReporting Deny

## Objective

Add a **Deny** button on TaskReporting that saves via the same `POST api/BiznessEvent_PCTrack/process` path as Save, with `Denied = true` and `ProgressPReported` fixed to the onload (history) value.

## Contract (agreed)

| | Save | Deny |
|---|---|---|
| Endpoint | `POST .../BiznessEvent_PCTrack/process` | same |
| `progressPReported` | live slider | onload last-history progress (or 0) |
| `denied` | `null` | `true` |
| `note` | form note | form note + ` - DENIED`, or `DENIED` if empty |
| Validation | end-time Swal, etc. | same |
| Confirm | none | Swal before submit |
| Success UX | toast + close modal | same |
| Email if 100% | yes | **never** |
| History UI | unchanged | flag stored only |

DB column `BiznessEvent_PCTrack.Denied` (nullable bool) already exists — no schema work.

## Changes

### Backend (explicit user authorization)

- `BR24.Domain/Entities/BiznessEvent_PCTrack.cs` — `bool? Denied`
- `CreateBiznessEvent_PCTrackCommand` — `bool? Denied` (AutoMapper maps to entity)

### Frontend

- `ICreateBiznessEventPCTrackCommand.denied?: boolean | null`
- `TaskReporting.tsx`:
  - `initialProgressRef` set in `initiateChartDataAndSlider`
  - `processDataToSave(..., { denied, progressPReported })`
  - Deny button + Swal confirm + same end-time rules as Save
  - Success path skips email when `emailInfoState.denied`

## Out of scope

- History/list display of Denied
- Chain progression changes beyond persisting the flag
- Backup TaskReporting copies (`*B4AttachmentMod*`, `*PuranHudai*`)
