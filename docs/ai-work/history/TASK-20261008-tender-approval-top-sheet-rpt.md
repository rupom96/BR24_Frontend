# TASK-20261008 — Tender Approval Top Sheet Rpt

## Goal

Simple report page: Tender No autocomplete + **Report Download** for ProcurementTender `getTenderApprovalTopSheet`.

## Delivered (FE)

| Area | Path |
|------|------|
| API | `src/infrastructure/api/TenderApiSlice.ts` → `getTenderApprovalTopSheet` |
| Page | `src/presentation/pages/TenderApprovalTopSheetRpt/TenderApprovalTopSheetRpt.tsx` |
| Route | `App.tsx` → `tenderApprovalTopSheetRpt` |
| Dynamic page | `DynamicPageDeclaration.ts` → `TenderApprovalTopSheetRpt` |

## Contract

- `GET getTenderApprovalTopSheet?TenderNo={string}` → `.xlsx` file
- Errors: ProblemDetails JSON (`title`); FE parses blob errors and toasts `title`
- Props: `clickedCardInfo`, `modalPageOpenerClose`, `operationMode` (chain preselect via `eventNo`)

## Out of scope

- Static menu row (user configures)
- No BE/DB changes (API already existed)
