# TASK-20261102 — Auto TenderNo from Tender-######## series

## Problem

`api/ProcurementTender/process` create with `tenderNo: null` NRE/fail in `CreateProcurementTenderCommandHandler` line ~70: auto-gen took **max ProcurementTenderId** row and parsed `TenderNo` as `Prefix-N`. Latest row can be typed/custom/null → crash. ExceptionMiddleware also NRE on `ex.InnerException!.Message` (masks original).

## Fix (BE)

Auto path only: among rows whose `TenderNo` starts with `Tender-` (ignore case) and suffix parses as int → next = max+1 (`D8`). None → `Tender-00000001`. Typed path unchanged.

File: `BR24.Application/.../CreateProcurementTender/CreateProcurementTenderCommand.cs`

## Verify

Create tender with empty tenderNo after a custom/non-`Tender-*` latest row → should get next `Tender-########`, not throw.
