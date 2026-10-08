# TASK-20261007 — TenderExpenseForSalesPerson

## Goal

Sales-person tender expense entry page (Excel draft → Option B UI), wired to ProcurementTender get/process APIs, chain-modal compatible like TenderCosting.

## Delivered (FE)

| Area | Path |
|------|------|
| DTO / VM | `src/domain/interfaces/TenderExpenseForSalesPersonInterface.ts` |
| API | `src/infrastructure/api/TenderApiSlice.ts` |
| Page | `src/presentation/pages/TenderExpenseForSalesPerson/TenderExpenseForSalesPerson.tsx` |
| Route | `App.tsx` → `tenderExpenseForSalesPerson` |
| Dynamic page | `DynamicPageDeclaration.ts` → `TenderExpenseForSalesPerson` |

## Contract highlights

- GET `getTenderExpenseForSalesPerson?procurementTenderId=`
- POST `ProcessTenderExpenseForSalesPerson` with `{ tenderExpenseForSalesPersonData, createBiznessEventPCTrackCommand }`
- Sales Expense Amount|% exclusive mode; AG…Buffer/Others onBlur exclusive
- `vatTaxP = vat + tax`; naming `securityDeposit*`

## Out of scope / deferred

- Static menu row (user: no BE/DB prompt)
- Pre Work / Budget fields (dropped)
