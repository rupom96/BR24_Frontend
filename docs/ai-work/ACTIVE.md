# Task Identity

- **Task ID:** TASK-20261008-tender-approval-top-sheet-rpt
- **Task title:** Tender Approval Top Sheet Rpt page
- **Started date:** 2026-10-08
- **Last updated:** 2026-10-08

# Objective

New FE page: Tender No autocomplete + Report Download calling `GET ProcurementTender/getTenderApprovalTopSheet?TenderNo=` (binary `.xlsx`). Chain-modal props like TenderExpenseForSalesPerson.

# Current State

**Implemented (FE):**

- API: `getTenderApprovalTopSheet` lazy query in `TenderApiSlice` (blob + ProblemDetails error parse)
- Page: `src/presentation/pages/TenderApprovalTopSheetRpt/TenderApprovalTopSheetRpt.tsx`
- Route: `/tenderApprovalTopSheetRpt` in `App.tsx`
- Chain modal: `DynamicPageDeclaration` → `TenderApprovalTopSheetRpt`

# Next Action

1. Smoke-test: select Tender No → Report Download → `.xlsx` saves.
2. Error cases: empty TenderNo (client warn), unknown tender → toast shows BE `title` (404).
3. User adds static menu **"Tender Approval Top Sheet Rpt"** if needed — FE route ready.

# Notes / contract

- Query param is **`TenderNo`** (string), not tenderId.
- Success: `File` / `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- Errors via ExceptionMiddleware ProblemDetails (`title`): 400 `TenderNo is required.`, 404 `Tender ({no}) was not found.`
- Autocomplete: `useGetAllTenderNoQuery` / `ITenderNoComboBox`.
