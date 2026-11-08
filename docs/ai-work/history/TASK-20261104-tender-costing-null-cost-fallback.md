# TASK-20261104 — Tender Costing Dist/Profit null Cost → header % on load

## Objective

On `getTenderCosting` fetch: if AdditionalCostDetail Dist Margin / Profit `Cost` is NULL, pass `null` to FE (not 0). FE seeds that row’s % from header AdditionalCost Percentage. Save path unchanged.

## Changes

### Backend

- `ProcurementTenderRepository.GetTenderCosting`: `DistMarginPerProduct` and `ProfitPerProduct` use `select ptacd.Cost` (no `?? 0`). Other costs still coerce to 0.

### Frontend

- `TenderCosting.tsx` `buildInitialStateFromDto`:
  - Keep `distCost` / `profitCost` nullable from DTO.
  - Dist: null Cost → `dto.distMarginP` (skipped for LOCAL/STOCK; still forced 0%). Non-null → reverse from Cost/price as before.
  - Profit: null Cost → keep `dto.profitP`; non-null → reverse from Cost/base.
  - FOB / non-FOB Dist recompute & editability unchanged.

### Docs

- `TENDER_COSTING.md` item 11.

## Out of scope

- Save/update null persistence
- Seed / InsertMissing handlers
