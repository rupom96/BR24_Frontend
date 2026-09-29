// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable @typescript-eslint/no-shadow */
// /* eslint-disable no-param-reassign */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable react/no-unstable-nested-components */
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   MaterialReactTable,
//   MRT_ColumnDef,
//   MRT_ShowHideColumnsButton,
//   MRT_ToggleFiltersButton,
//   MRT_ToggleFullScreenButton,
//   MRT_ToggleGlobalFilterButton,
//   MRT_TableInstance,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { Autocomplete, TextField } from '@mui/material';
// import { toast } from 'react-toastify';
// import { Controller, useForm } from 'react-hook-form';
// import {
//   GetTenderCostingDetailDto,
//   GetTenderCostingDto,
// } from '../../../domain/interfaces/TenderCostingInterface';
// import {
//   useGetAllTenderNoQuery,
//   useLazyGetTenderCostingQuery,
// } from '../../../infrastructure/api/TenderApiSlice';
// import { ITenderNoComboBox } from '../../../domain/interfaces/ProcurementTenderInterface';
// import { CostingForm } from './CostingFormTabular';

// // ===== Frontend view models (single source of truth) =====

// type TenderCostingDetailRow = GetTenderCostingDetailDto & {
//   totalFob: number;
//   lc: number;
//   lpPerProduct?: number | null; // ensure present in state
//   profitPerProduct: number; // virtual
//   unitCostPerProduct: number; // virtual

//   // Virtual / derived pricing layers
//   unitPriceWithoutVTOtherExpPerProduct: number; // virtual
//   unitPriceWithVTPerProduct: number; // virtual
//   unitPriceWithSePerProduct: number; // virtual
//   unitPriceWithAgPerProduct: number; // virtual
//   unitPriceWithTv2SeAgPerProduct: number; // virtual

//   // Virtual totals per-row
//   totalAmountOnePerProduct: number; // virtual
//   totalVatTaxPerProduct: number; // virtual
// };

// type TenderCostingState = Omit<
//   GetTenderCostingDto,
//   'getTenderCostingDetailDtos'
// > & {
//   sumOfUnit: number;
//   sumOfTotalFOB: number;

//   // Virtual profit fields (not from DB)
//   profitP: number;
//   profitT: number;

//   unitCostT: number; // virtual total

//   unitPriceWithVTT: number; // virtual total for Unit Price With VAT&TAX
//   unitPriceWithSeT: number; // virtual total for Unit Price With SE
//   unitPriceWithAgT: number; // virtual total for Unit Price With AG
//   unitPriceWithTv2SeAgT: number; // virtual total for Unit Price(TaxVat2+SE+AG)
//   totalAmountOneT: number; // virtual total for Total Amount One
//   totalVatTaxT: number; // virtual total for Total Vat & Tax

//   // PG section derived amounts (virtual)
//   pgBankFinanceChargeA: number;
//   pgTotalYearsA: number;
//   pgPerQtChargeA: number;
//   pgTotalQtChargeA: number;
//   pgTotalQtChargeAWithPgTotalYearsA: number;
//   fixedExpWithPgTotalQtChargeAWithPgTotalYearsA: number;
//   pgValuePerUnit: number;

//   getTenderCostingDetailDtos: TenderCostingDetailRow[];
// };

// const round2 = (n: number): number =>
//   Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;

// // ===== Helper: recompute PG section only =====

// const recomputePgSection = (state: TenderCostingState): TenderCostingState => {
//   const totalAmountOneT = state.totalAmountOneT ?? 0;
//   const sumOfUnit = state.sumOfUnit ?? 0;

//   const performanceGuaranteeP = state.performanceGuaranteeP ?? 0;
//   const pgMarginP = state.pgMarginP ?? 0;
//   const pgBankFinanceChargeP = state.pgBankFinanceChargeP ?? 0;
//   const pgTotalYears = state.pgTotalYears ?? 0;
//   const pgPerQtChargeP = state.pgPerQtChargeP ?? 0;
//   const pgFixedExpense = state.pgFixedExpense ?? 0;

//   // 1) PG Amount (BDT)
//   const performanceGuaranteeA = round2(
//     totalAmountOneT * (performanceGuaranteeP / 100)
//   );

//   // 2) PG Margin Amount (BDT)
//   const pgMarginAmount = round2(performanceGuaranteeA * (pgMarginP / 100));

//   // 3) PG Bank Finance Charge (BDT)
//   const pgBankFinanceChargeA = round2(
//     performanceGuaranteeA * (pgBankFinanceChargeP / 100)
//   );

//   // 4) PG Total Years Amount (BDT)
//   const pgTotalYearsA = round2(pgTotalYears * pgBankFinanceChargeA);

//   // 5) PG Total Quarter Count (unitless)
//   const pgTotalQuarter = pgTotalYears * 4 + 1;

//   // 6) PG Per Quarter Charge Amount (BDT)
//   const pgPerQtChargeA = round2(performanceGuaranteeA * (pgPerQtChargeP / 100));

//   // 7) PG Total Quarter Charge Amount (BDT)
//   const pgTotalQtChargeA = round2(pgTotalQuarter * pgPerQtChargeA);

//   // 8) PG Total Qt + Years Amount (BDT)
//   const pgTotalQtChargeAWithPgTotalYearsA = round2(
//     pgTotalQtChargeA + pgTotalYearsA
//   );

//   // 9) Fixed Exp + PG charges (BDT)
//   const fixedExpWithPgTotalQtChargeAWithPgTotalYearsA = round2(
//     pgFixedExpense + pgTotalQtChargeAWithPgTotalYearsA
//   );

//   // 10) PG Value Per Unit
//   const pgValuePerUnit =
//     sumOfUnit > 0
//       ? round2(fixedExpWithPgTotalQtChargeAWithPgTotalYearsA / sumOfUnit)
//       : 0;

//   return {
//     ...state,
//     performanceGuaranteeA,
//     pgMarginAmount,
//     pgBankFinanceChargeA,
//     pgTotalYearsA,
//     pgTotalQuarter,
//     pgPerQtChargeA,
//     pgTotalQtChargeA,
//     pgTotalQtChargeAWithPgTotalYearsA,
//     fixedExpWithPgTotalQtChargeAWithPgTotalYearsA,
//     pgValuePerUnit,
//   };
// };

// // ===== Build initial state from backend DTO =====

// const buildInitialStateFromDto = (
//   dto: GetTenderCostingDto
// ): TenderCostingState => {
//   console.log('dto---->');
//   console.log(dto);

//   const rows: TenderCostingDetailRow[] = dto.getTenderCostingDetailDtos.map(
//     (d) => {
//       const quantity = d.quantity ?? 0;
//       const price = d.price ?? 0;
//       const factor = d.initialFactor ?? 0;

//       const totalFob = quantity && price ? round2(quantity * price) : 0;

//       const distMarginPerProduct = d.distMarginPerProduct ?? 0;
//       const lpPerProduct = d.lpPerProduct ?? 0;

//       const lc =
//         price && factor ? round2((price + distMarginPerProduct) * factor) : 0;

//       // Profit is virtual; start at 0
//       const profitPerProduct = 0;
//       const dpPerProduct = d.dpPerProduct ?? 0;

//       const unitCostPerProduct = round2(
//         (lc || 0) +
//           (lpPerProduct || 0) +
//           (dpPerProduct || 0) +
//           (profitPerProduct || 0)
//       );

//       // “Other Costs” per-row fields
//       const deliveryPerProduct = d.deliveryPerProduct ?? 0;
//       const installationPerProduct = d.installationPerProduct ?? 0;
//       const preShipmentInspectionPerProduct =
//         d.preShipmentInspectionPerProduct ?? 0;
//       const trainingPerProduct = d.trainingPerProduct ?? 0;
//       const softwareOSOfficePerProduct = d.softwareOSOfficePerProduct ?? 0;
//       const hardwareAccessoriesPerProduct =
//         d.hardwareAccessoriesPerProduct ?? 0;
//       const bufferWarrantyPerProduct = d.bufferWarrantyPerProduct ?? 0;

//       // Tax & VAT One per row (non-virtual, DB-backed)
//       const taxAndVATOnePerProduct = d.taxAndVATOnePerProduct ?? 0;

//       // Unit Price (No V&T + Others)
//       const unitPriceWithoutVTOtherExpPerProduct = round2(
//         unitCostPerProduct +
//           (deliveryPerProduct || 0) +
//           (installationPerProduct || 0) +
//           (preShipmentInspectionPerProduct || 0) +
//           (trainingPerProduct || 0) +
//           (softwareOSOfficePerProduct || 0) +
//           (hardwareAccessoriesPerProduct || 0) +
//           (bufferWarrantyPerProduct || 0)
//       );

//       const unitPriceWithVTPerProduct = round2(
//         unitPriceWithoutVTOtherExpPerProduct + (taxAndVATOnePerProduct || 0)
//       );

//       const salesExpensePerProduct = d.salesExpensePerProduct ?? 0;

//       const unitPriceWithSePerProduct = round2(
//         unitPriceWithVTPerProduct + (salesExpensePerProduct || 0)
//       );

//       const agExpensePerProduct = d.agExpensePerProduct ?? 0;

//       const unitPriceWithAgPerProduct = round2(
//         unitPriceWithSePerProduct + (agExpensePerProduct || 0)
//       );

//       const taxAndVATTwoPerProduct = d.taxAndVATTwoPerProduct ?? 0;

//       const unitPriceWithTv2SeAgPerProduct = round2(
//         unitPriceWithAgPerProduct + (taxAndVATTwoPerProduct || 0)
//       );

//       const totalAmountOnePerProduct = round2(
//         (quantity || 0) * (unitPriceWithTv2SeAgPerProduct || 0)
//       );

//       const totalVatTaxPerProduct = round2(
//         (taxAndVATOnePerProduct + taxAndVATTwoPerProduct) * (quantity || 0)
//       );

//       return {
//         ...d,
//         distMarginPerProduct,
//         lpPerProduct,
//         totalFob,
//         lc,
//         profitPerProduct,
//         dpPerProduct,
//         unitCostPerProduct,
//         deliveryPerProduct,
//         installationPerProduct,
//         preShipmentInspectionPerProduct,
//         trainingPerProduct,
//         softwareOSOfficePerProduct,
//         hardwareAccessoriesPerProduct,
//         bufferWarrantyPerProduct,
//         taxAndVATOnePerProduct,
//         unitPriceWithoutVTOtherExpPerProduct,
//         unitPriceWithVTPerProduct,
//         salesExpensePerProduct,
//         unitPriceWithSePerProduct,
//         agExpensePerProduct,
//         unitPriceWithAgPerProduct,
//         taxAndVATTwoPerProduct,
//         unitPriceWithTv2SeAgPerProduct,
//         totalAmountOnePerProduct,
//         totalVatTaxPerProduct,
//       };
//     }
//   );

//   let sumOfUnit = 0;
//   let sumOfTotalFOB = 0;
//   let sumLP = 0;
//   let sumDP = 0;
//   let sumUnitCost = 0;

//   // sums for “Other Costs”
//   let sumDelivery = 0;
//   let sumInstallation = 0;
//   let sumPSI = 0;
//   let sumTraining = 0;
//   let sumSoftware = 0;
//   let sumHardware = 0;
//   let sumBuffer = 0;

//   // Tax & VAT One total
//   let sumTaxAndVATOne = 0;

//   // Unit Price With VAT&TAX total
//   let sumUnitPriceWithVT = 0;

//   // Sales Expense + Unit Price With SE
//   let sumSalesExpense = 0;
//   let sumUnitPriceWithSe = 0;

//   // AG Expense + Unit Price With AG
//   let sumAgExpense = 0;
//   let sumUnitPriceWithAg = 0;

//   // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
//   let sumTaxAndVATTwo = 0;
//   let sumUnitPriceWithTv2SeAg = 0;

//   // Total Amount One + Total Vat & Tax
//   let sumTotalAmountOne = 0;
//   let sumTotalVatTax = 0;

//   rows.forEach((r) => {
//     sumOfUnit += r.quantity || 0;
//     sumOfTotalFOB += r.totalFob || 0;
//     sumLP += r.lpPerProduct || 0;
//     sumDP += r.dpPerProduct || 0;
//     sumUnitCost += r.unitCostPerProduct || 0;

//     sumDelivery += r.deliveryPerProduct || 0;
//     sumInstallation += r.installationPerProduct || 0;
//     sumPSI += r.preShipmentInspectionPerProduct || 0;
//     sumTraining += r.trainingPerProduct || 0;
//     sumSoftware += r.softwareOSOfficePerProduct || 0;
//     sumHardware += r.hardwareAccessoriesPerProduct || 0;
//     sumBuffer += r.bufferWarrantyPerProduct || 0;

//     sumTaxAndVATOne += r.taxAndVATOnePerProduct || 0;
//     sumUnitPriceWithVT += r.unitPriceWithVTPerProduct || 0;

//     sumSalesExpense += r.salesExpensePerProduct || 0;
//     sumUnitPriceWithSe += r.unitPriceWithSePerProduct || 0;

//     sumAgExpense += r.agExpensePerProduct || 0;
//     sumUnitPriceWithAg += r.unitPriceWithAgPerProduct || 0;

//     sumTaxAndVATTwo += r.taxAndVATTwoPerProduct || 0;
//     sumUnitPriceWithTv2SeAg += r.unitPriceWithTv2SeAgPerProduct || 0;

//     sumTotalAmountOne += r.totalAmountOnePerProduct || 0;
//     sumTotalVatTax += r.totalVatTaxPerProduct || 0;
//   });

//   const base: TenderCostingState = {
//     ...dto,
//     sumOfUnit: round2(sumOfUnit),
//     sumOfTotalFOB: round2(sumOfTotalFOB),

//     // Respect backend DistMarginT initially, but totals will be recomputed later
//     distMarginT: dto.distMarginT,

//     // LP total from per-row LP (overriding dto.lpt)
//     lpt: round2(sumLP),

//     // Profit virtuals start at 0
//     profitP: dto.distMarginP ? 0 : 0,
//     profitT: 0,

//     dpt: round2(sumDP),

//     unitCostT: round2(sumUnitCost),

//     // override the T’s with row sums (editable cells drive totals)
//     deliveryT: round2(sumDelivery),
//     installationT: round2(sumInstallation),
//     preShipmentInspectionT: round2(sumPSI),
//     trainingT: round2(sumTraining),
//     softwareOSOfficeT: round2(sumSoftware),
//     hardwareAccessoriesT: round2(sumHardware),
//     bufferWarrantyT: round2(sumBuffer),

//     // Tax & VAT One total from per-row values
//     taxAndVATOneT: round2(sumTaxAndVATOne),
//     unitPriceWithVTT: round2(sumUnitPriceWithVT),

//     // Sales Expense + Unit Price With SE
//     salesExpenseT: round2(sumSalesExpense),
//     unitPriceWithSeT: round2(sumUnitPriceWithSe),

//     // AG Expense + Unit Price With AG
//     agExpenseT: round2(sumAgExpense),
//     unitPriceWithAgT: round2(sumUnitPriceWithAg),

//     // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
//     taxAndVATTwoT: round2(sumTaxAndVATTwo),
//     unitPriceWithTv2SeAgT: round2(sumUnitPriceWithTv2SeAg),

//     // Total Amount One + Total Vat & Tax
//     totalAmountOneT: round2(sumTotalAmountOne),
//     totalVatTaxT: round2(sumTotalVatTax),

//     // PG virtuals – will be filled by recomputePgSection
//     pgBankFinanceChargeA: 0,
//     pgTotalYearsA: 0,
//     pgPerQtChargeA: 0,
//     pgTotalQtChargeA: 0,
//     pgTotalQtChargeAWithPgTotalYearsA: 0,
//     fixedExpWithPgTotalQtChargeAWithPgTotalYearsA: 0,
//     pgValuePerUnit: 0,

//     getTenderCostingDetailDtos: rows,
//   };

//   return recomputePgSection(base);
// };

// // ===== Recompute all (on any edit / DistMargin% / Profit% / Tax&VAT / Expenses / PG change) =====

// const recomputeAll = (state: TenderCostingState): TenderCostingState => {
//   const distPct = state.distMarginP ?? 0;
//   const profitPct = state.profitP ?? 0;
//   const taxAndVATOnePct = state.taxAndVATOneP ?? 0;
//   const salesExpensePct = state.salesExpenseP ?? 0;
//   const agExpensePct = state.agExpenseP ?? 0;
//   const taxAndVATTwoPct = state.taxAndVATTwoP ?? 0;

//   let sumOfUnit = 0;
//   let sumOfTotalFOB = 0;
//   let distMarginT = 0;
//   let sumLP = 0;
//   let sumProfit = 0;
//   let sumDP = 0;
//   let sumUnitCost = 0;

//   // “Other Costs” totals
//   let sumDelivery = 0;
//   let sumInstallation = 0;
//   let sumPSI = 0;
//   let sumTraining = 0;
//   let sumSoftware = 0;
//   let sumHardware = 0;
//   let sumBuffer = 0;

//   // Tax & VAT One total
//   let sumTaxAndVATOne = 0;

//   // Unit Price With VAT&TAX + Sales Expense + Unit Price With SE
//   let sumUnitPriceWithVT = 0;
//   let sumSalesExpense = 0;
//   let sumUnitPriceWithSe = 0;

//   // AG Expense + Unit Price With AG
//   let sumAgExpense = 0;
//   let sumUnitPriceWithAg = 0;

//   // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
//   let sumTaxAndVATTwo = 0;
//   let sumUnitPriceWithTv2SeAg = 0;

//   // Total Amount One + Total Vat & Tax
//   let sumTotalAmountOne = 0;
//   let sumTotalVatTax = 0;

//   const nextRows: TenderCostingDetailRow[] =
//     state.getTenderCostingDetailDtos.map((row) => {
//       const quantity = row.quantity ?? 0;
//       const price = row.price ?? 0;
//       const factor = row.initialFactor ?? 0;

//       const totalFob = quantity && price ? round2(quantity * price) : 0;

//       const distMarginPerProduct =
//         price && distPct ? round2(price * (distPct / 100)) : 0;

//       const lpPerProduct = row.lpPerProduct ?? 0;

//       const lc =
//         price && factor ? round2((price + distMarginPerProduct) * factor) : 0;

//       const profitBase = (lc || 0) + (lpPerProduct || 0);
//       const profitPerProduct =
//         profitPct && profitBase ? round2(profitBase * (profitPct / 100)) : 0;

//       const dpPerProduct = row.dpPerProduct ?? 0;

//       const unitCostPerProduct = round2(
//         (lc || 0) +
//           (lpPerProduct || 0) +
//           (dpPerProduct || 0) +
//           (profitPerProduct || 0)
//       );

//       // keep editable “Other Costs” as-is
//       const deliveryPerProduct = row.deliveryPerProduct ?? 0;
//       const installationPerProduct = row.installationPerProduct ?? 0;
//       const preShipmentInspectionPerProduct =
//         row.preShipmentInspectionPerProduct ?? 0;
//       const trainingPerProduct = row.trainingPerProduct ?? 0;
//       const softwareOSOfficePerProduct = row.softwareOSOfficePerProduct ?? 0;
//       const hardwareAccessoriesPerProduct =
//         row.hardwareAccessoriesPerProduct ?? 0;
//       const bufferWarrantyPerProduct = row.bufferWarrantyPerProduct ?? 0;

//       // Unit Price (No V&T + Others)
//       const unitPriceWithoutVTOtherExpPerProduct = round2(
//         unitCostPerProduct +
//           (deliveryPerProduct || 0) +
//           (installationPerProduct || 0) +
//           (preShipmentInspectionPerProduct || 0) +
//           (trainingPerProduct || 0) +
//           (softwareOSOfficePerProduct || 0) +
//           (hardwareAccessoriesPerProduct || 0) +
//           (bufferWarrantyPerProduct || 0)
//       );

//       // Tax & VAT One per row (non-virtual)
//       const taxAndVATOnePerProduct =
//         taxAndVATOnePct && unitPriceWithoutVTOtherExpPerProduct
//           ? round2(
//               unitPriceWithoutVTOtherExpPerProduct * (taxAndVATOnePct / 100)
//             )
//           : 0;

//       const unitPriceWithVTPerProduct = round2(
//         unitPriceWithoutVTOtherExpPerProduct + (taxAndVATOnePerProduct || 0)
//       );

//       const salesExpensePerProduct =
//         salesExpensePct && unitPriceWithVTPerProduct
//           ? round2(unitPriceWithVTPerProduct * (salesExpensePct / 100))
//           : 0;

//       const unitPriceWithSePerProduct = round2(
//         unitPriceWithVTPerProduct + (salesExpensePerProduct || 0)
//       );

//       const agExpensePerProduct =
//         agExpensePct && unitPriceWithSePerProduct
//           ? round2(unitPriceWithSePerProduct * (agExpensePct / 100))
//           : 0;

//       const unitPriceWithAgPerProduct = round2(
//         unitPriceWithSePerProduct + (agExpensePerProduct || 0)
//       );

//       const taxAndVATTwoPerProduct =
//         taxAndVATTwoPct && unitPriceWithAgPerProduct
//           ? round2(unitPriceWithAgPerProduct * (taxAndVATTwoPct / 100))
//           : 0;

//       const unitPriceWithTv2SeAgPerProduct = round2(
//         unitPriceWithAgPerProduct + (taxAndVATTwoPerProduct || 0)
//       );

//       const totalAmountOnePerProduct = round2(
//         (quantity || 0) * (unitPriceWithTv2SeAgPerProduct || 0)
//       );

//       const totalVatTaxPerProduct = round2(
//         (taxAndVATOnePerProduct + taxAndVATTwoPerProduct) * (quantity || 0)
//       );

//       sumOfUnit += quantity || 0;
//       sumOfTotalFOB += totalFob || 0;
//       distMarginT += distMarginPerProduct || 0;
//       sumLP += lpPerProduct || 0;
//       sumProfit += profitPerProduct || 0;
//       sumDP += dpPerProduct || 0;
//       sumUnitCost += unitCostPerProduct || 0;

//       sumDelivery += deliveryPerProduct || 0;
//       sumInstallation += installationPerProduct || 0;
//       sumPSI += preShipmentInspectionPerProduct || 0;
//       sumTraining += trainingPerProduct || 0;
//       sumSoftware += softwareOSOfficePerProduct || 0;
//       sumHardware += hardwareAccessoriesPerProduct || 0;
//       sumBuffer += bufferWarrantyPerProduct || 0;

//       sumTaxAndVATOne += taxAndVATOnePerProduct || 0;
//       sumUnitPriceWithVT += unitPriceWithVTPerProduct || 0;

//       sumSalesExpense += salesExpensePerProduct || 0;
//       sumUnitPriceWithSe += unitPriceWithSePerProduct || 0;

//       sumAgExpense += agExpensePerProduct || 0;
//       sumUnitPriceWithAg += unitPriceWithAgPerProduct || 0;

//       sumTaxAndVATTwo += taxAndVATTwoPerProduct || 0;
//       sumUnitPriceWithTv2SeAg += unitPriceWithTv2SeAgPerProduct || 0;

//       sumTotalAmountOne += totalAmountOnePerProduct || 0;
//       sumTotalVatTax += totalVatTaxPerProduct || 0;

//       return {
//         ...row,
//         totalFob,
//         distMarginPerProduct,
//         lpPerProduct,
//         lc,
//         profitPerProduct,
//         dpPerProduct,
//         unitCostPerProduct,
//         deliveryPerProduct,
//         installationPerProduct,
//         preShipmentInspectionPerProduct,
//         trainingPerProduct,
//         softwareOSOfficePerProduct,
//         hardwareAccessoriesPerProduct,
//         bufferWarrantyPerProduct,
//         unitPriceWithoutVTOtherExpPerProduct,
//         taxAndVATOnePerProduct,
//         unitPriceWithVTPerProduct,
//         salesExpensePerProduct,
//         unitPriceWithSePerProduct,
//         agExpensePerProduct,
//         unitPriceWithAgPerProduct,
//         taxAndVATTwoPerProduct,
//         unitPriceWithTv2SeAgPerProduct,
//         totalAmountOnePerProduct,
//         totalVatTaxPerProduct,
//       };
//     });

//   const base: TenderCostingState = {
//     ...state,
//     getTenderCostingDetailDtos: nextRows,
//     sumOfUnit: round2(sumOfUnit),
//     sumOfTotalFOB: round2(sumOfTotalFOB),
//     distMarginT: round2(distMarginT),
//     lpt: round2(sumLP),
//     profitT: round2(sumProfit),
//     dpt: round2(sumDP),
//     unitCostT: round2(sumUnitCost),
//     // “Other Costs” totals
//     deliveryT: round2(sumDelivery),
//     installationT: round2(sumInstallation),
//     preShipmentInspectionT: round2(sumPSI),
//     trainingT: round2(sumTraining),
//     softwareOSOfficeT: round2(sumSoftware),
//     hardwareAccessoriesT: round2(sumHardware),
//     bufferWarrantyT: round2(sumBuffer),
//     // Tax & VAT One total
//     taxAndVATOneT: round2(sumTaxAndVATOne),
//     unitPriceWithVTT: round2(sumUnitPriceWithVT),
//     // Sales Expense + Unit Price With SE
//     salesExpenseT: round2(sumSalesExpense),
//     unitPriceWithSeT: round2(sumUnitPriceWithSe),
//     // AG Expense + Unit Price With AG
//     agExpenseT: round2(sumAgExpense),
//     unitPriceWithAgT: round2(sumUnitPriceWithAg),
//     // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
//     taxAndVATTwoT: round2(sumTaxAndVATTwo),
//     unitPriceWithTv2SeAgT: round2(sumUnitPriceWithTv2SeAg),
//     // Total Amount One + Total Vat & Tax
//     totalAmountOneT: round2(sumTotalAmountOne),
//     totalVatTaxT: round2(sumTotalVatTax),
//   };

//   return recomputePgSection(base);
// };

// // ===== Props =====

// interface TenderCostingProps {
//   modalPageOpenerClose?: () => void;
//   clickedCardInfo?: any;
//   operationMode?: 'view' | 'edit' | string;
// }

// // ===== Component =====

// const TenderCosting: React.FC<TenderCostingProps> = ({
//   modalPageOpenerClose,
//   clickedCardInfo,
// }) => {
//   const biznessEventName = clickedCardInfo?.biznessEventName?.replace(
//     /([A-Z])(?=[A-Z][a-z])/g,
//     '$1 '
//   );

//   // destructuring nested formProps
//   const { control } = useForm();

//   const [tenderInfo, setTenderInfo] = useState<ITenderNoComboBox | null>(null);
//   const [tenderCostingState, setTenderCostingState] =
//     useState<TenderCostingState | null>(null);

//   // --------------RTK Query initialization-----------
//   const {
//     data: tenderComboOptions,
//     isLoading: tenderComboOptionsLoading,
//     isSuccess: tenderComboOptionsIsSuccess,
//     error: tenderComboOptionsError,
//     isError: tenderComboOptionsIsError,
//     isFetching: tenderComboOptionIsFetching,
//   } = useGetAllTenderNoQuery();

//   useEffect(() => {
//     if (tenderComboOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching tenderNo options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching TENDER NO options for autocomplete, see console--->:'
//       );
//       console.log(tenderComboOptionsError);
//     } else if (
//       tenderComboOptionsIsSuccess &&
//       !tenderComboOptionsIsError &&
//       !tenderComboOptionsLoading &&
//       !tenderComboOptionIsFetching &&
//       tenderComboOptions
//     ) {
//       if (clickedCardInfo?.eventNo) {
//         const tenderObj = tenderComboOptions.find(
//           (row) => row.tenderNo === clickedCardInfo?.eventNo
//         );
//         const tenderObjTemp = tenderObj || null;
//         setTenderInfo(tenderObjTemp);
//       }
//     }
//   }, [
//     tenderComboOptionsLoading,
//     tenderComboOptionsIsError,
//     tenderComboOptionsError,
//     tenderComboOptionsIsSuccess,
//     tenderComboOptions,
//     clickedCardInfo?.eventNo,
//   ]);

//   const [
//     triggerGetTenderCosting,
//     {
//       data: tenderCostingData,
//       error: tenderCostingError,
//       isError: tenderCostingIsError,
//       isSuccess: tenderCostingIsSuccess,
//       isLoading: tenderCostingIsLoading,
//       isFetching: tenderCostingIsFetching,
//     },
//   ] = useLazyGetTenderCostingQuery(); // RTK Query lazy fetch

//   useEffect(() => {
//     if (tenderCostingIsError) {
//       toast.error(
//         'Something wrong from backend while fetching tenderCostingData, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching tenderCostingData, see console--->:'
//       );
//       console.log(tenderCostingError);
//     }
//     if (tenderCostingIsSuccess) {
//       console.log('tenderCostingIsSuccess');
//       console.log(tenderCostingData);

//       const tenderCostingDataCopy = JSON.parse(
//         JSON.stringify(tenderCostingData)
//       );

//       if (tenderCostingDataCopy?.getTenderCostingDetailDtos) {
//         setTenderCostingState(
//           buildInitialStateFromDto(tenderCostingDataCopy as GetTenderCostingDto)
//         );
//       } else {
//         setTenderCostingState(null);
//       }
//     }
//   }, [
//     tenderCostingData,
//     tenderCostingIsLoading,
//     tenderCostingError,
//     tenderCostingIsError,
//     tenderCostingIsFetching,
//     tenderCostingIsSuccess,
//   ]);

//   const [columnVisibility, setColumnVisibility] = useState<any>({});
//   const [isLoading] = useState(false);

//   const rows = tenderCostingState?.getTenderCostingDetailDtos ?? [];

//   // ---- handlers ----

//   const handleDistMarginPercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, distMarginP: next }) : prev
//     );
//   };

//   const handleProfitPercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, profitP: next }) : prev
//     );
//   };

//   const handleTaxAndVATOnePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, taxAndVATOneP: next }) : prev
//     );
//   };

//   const handleSalesExpensePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, salesExpenseP: next }) : prev
//     );
//   };

//   const handleAgExpensePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, agExpenseP: next }) : prev
//     );
//   };

//   const handleTaxAndVATTwoPercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, taxAndVATTwoP: next }) : prev
//     );
//   };

//   // --- PG section blur handlers (call recomputeAll so PG block updates) ---

//   const handlePerformanceGuaranteePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, performanceGuaranteeP: next }) : prev
//     );
//   };

//   const handlePgMarginPercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, pgMarginP: next }) : prev
//     );
//   };

//   const handlePgBankFinanceChargePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, pgBankFinanceChargeP: next }) : prev
//     );
//   };

//   const handlePgTotalYearsBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, pgTotalYears: next }) : prev
//     );
//   };

//   const handlePgPerQtChargePercentBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, pgPerQtChargeP: next }) : prev
//     );
//   };

//   const handlePgFixedExpenseBlur = (raw: string) => {
//     if (!tenderCostingState) return;
//     const val = Number(raw);
//     const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
//     setTenderCostingState((prev) =>
//       prev ? recomputeAll({ ...prev, pgFixedExpense: next }) : prev
//     );
//   };

//   const updateCell = (
//     rowIndex: number,
//     key: keyof TenderCostingDetailRow,
//     value: any
//   ) => {
//     if (!tenderCostingState) return;
//     setTenderCostingState((prev) => {
//       if (!prev) return prev;
//       const nextRows = [...prev.getTenderCostingDetailDtos];
//       nextRows[rowIndex] = {
//         ...nextRows[rowIndex],
//         [key]: value,
//       } as TenderCostingDetailRow;
//       return recomputeAll({ ...prev, getTenderCostingDetailDtos: nextRows });
//     });
//   };

//   // ---- cell renderers ----

//   const textCell =
//     (key: keyof TenderCostingDetailRow) =>
//     ({ row, renderedCellValue }: any) => (
//       <div className="w-full py-1 flex justify-between items-center">
//         <TextField
//           variant="standard"
//           size="small"
//           sx={{ width: '100%' }}
//           InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
//           defaultValue={renderedCellValue ?? ''}
//           onBlur={(e) => {
//             const value = e.target.value || null;
//             updateCell(row.index, key, value);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               (e.target as HTMLInputElement).blur();
//             }
//           }}
//         />
//       </div>
//     );

//   const numberCell =
//     (key: keyof TenderCostingDetailRow) =>
//     ({ row, renderedCellValue }: any) => (
//       <div className="w-full py-1 flex justify-between items-center">
//         <TextField
//           type="number"
//           variant="standard"
//           size="small"
//           sx={{ width: '100%' }}
//           InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
//           defaultValue={renderedCellValue ?? ''}
//           onBlur={(e) => {
//             const v = e.target.value;
//             const num =
//               v === '' || Number.isNaN(Number(v)) ? null : Math.abs(Number(v));
//             updateCell(row.index, key, num);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               (e.target as HTMLInputElement).blur();
//             }
//           }}
//         />
//       </div>
//     );

//   const readonlyNumberCell =
//     (key: keyof TenderCostingDetailRow) =>
//     ({ row }: any) => {
//       const val = rows[row.index][key];
//       return (
//         <div className="w-full py-1 flex justify-between items-center">
//           <span style={{ fontSize: '0.8125rem' }}>
//             {val == null ? '' : Number(val).toFixed(2)}
//           </span>
//         </div>
//       );
//     };

//   // ---- columns & footers ----

//   const columns = useMemo<MRT_ColumnDef<TenderCostingDetailRow>[]>(() => {
//     return [
//       {
//         id: 'sn',
//         header: 'S/N',
//         size: 60,
//         Cell: ({ row }) => row.index + 1,
//         enableColumnFilter: false,
//         enableSorting: false,
//         enableEditing: false,
//         Footer: () => null,
//       },
//       {
//         accessorKey: 'productName',
//         header: 'Item',
//         size: 220,
//         Cell: textCell('productName'),
//         Footer: () => <strong>TOTAL</strong>,
//       },
//       {
//         accessorKey: 'quantity',
//         header: 'Unit',
//         size: 90,
//         Cell: numberCell('quantity'),
//         Footer: () => (tenderCostingState?.sumOfUnit ?? 0).toFixed(2),
//       },
//       {
//         accessorKey: 'price',
//         header: 'FOB',
//         size: 110,
//         Cell: numberCell('price'),
//         Footer: () => null,
//       },
//       {
//         accessorKey: 'totalFob',
//         header: 'Total FOB',
//         size: 120,
//         Cell: readonlyNumberCell('totalFob'),
//         enableEditing: false,
//         Footer: () => (tenderCostingState?.sumOfTotalFOB ?? 0).toFixed(2),
//       },
//       {
//         header: 'Dist Margin',
//         columns: [
//           {
//             accessorKey: 'distMarginPerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.distMarginP ?? 0}
//                   defaultValue={tenderCostingState?.distMarginP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleDistMarginPercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 130,
//             Cell: readonlyNumberCell('distMarginPerProduct' as any),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.distMarginT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'initialFactor',
//         header: 'Factor',
//         size: 110,
//         Cell: numberCell('initialFactor'),
//         Footer: () => null,
//       },
//       {
//         accessorKey: 'lc',
//         header: 'L/C',
//         size: 120,
//         Cell: readonlyNumberCell('lc'),
//         enableEditing: false,
//         Footer: () => null,
//       },
//       {
//         accessorKey: 'lpPerProduct',
//         header: 'LP',
//         size: 110,
//         Cell: numberCell('lpPerProduct'),
//         enableEditing: true,
//         Footer: () => (tenderCostingState?.lpt ?? 0).toFixed(2),
//       },
//       {
//         header: 'Profit',
//         columns: [
//           {
//             accessorKey: 'profitPerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.profitP ?? 0}
//                   defaultValue={tenderCostingState?.profitP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleProfitPercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 130,
//             Cell: readonlyNumberCell('profitPerProduct'),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.profitT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'dpPerProduct',
//         header: 'DP',
//         size: 110,
//         Cell: numberCell('dpPerProduct'),
//         enableEditing: true,
//         Footer: () => (tenderCostingState?.dpt ?? 0).toFixed(2),
//       },
//       {
//         accessorKey: 'unitCostPerProduct',
//         header: 'Unit Cost',
//         size: 130,
//         Cell: readonlyNumberCell('unitCostPerProduct'),
//         enableEditing: false,
//         Footer: () => (tenderCostingState?.unitCostT ?? 0).toFixed(2),
//       },
//       {
//         header: 'Other Costs',
//         columns: [
//           {
//             accessorKey: 'deliveryPerProduct',
//             header: 'Delivery',
//             size: 120,
//             Cell: numberCell('deliveryPerProduct'),
//             enableEditing: true,
//             Footer: () => (tenderCostingState?.deliveryT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'installationPerProduct',
//             header: 'Installation',
//             size: 140,
//             Cell: numberCell('installationPerProduct'),
//             enableEditing: true,
//             Footer: () => (tenderCostingState?.installationT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'preShipmentInspectionPerProduct',
//             header: 'Pre Shipment Inspection',
//             size: 180,
//             Cell: numberCell('preShipmentInspectionPerProduct'),
//             enableEditing: true,
//             Footer: () =>
//               (tenderCostingState?.preShipmentInspectionT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'trainingPerProduct',
//             header: 'Training',
//             size: 120,
//             Cell: numberCell('trainingPerProduct'),
//             enableEditing: true,
//             Footer: () => (tenderCostingState?.trainingT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'softwareOSOfficePerProduct',
//             header: 'Software (OS/Office)',
//             size: 170,
//             Cell: numberCell('softwareOSOfficePerProduct'),
//             enableEditing: true,
//             Footer: () =>
//               (tenderCostingState?.softwareOSOfficeT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'hardwareAccessoriesPerProduct',
//             header: 'Hardware/Accessories',
//             size: 180,
//             Cell: numberCell('hardwareAccessoriesPerProduct'),
//             enableEditing: true,
//             Footer: () =>
//               (tenderCostingState?.hardwareAccessoriesT ?? 0).toFixed(2),
//           },
//           {
//             accessorKey: 'bufferWarrantyPerProduct',
//             header: 'Buffer (warranty)',
//             size: 160,
//             Cell: numberCell('bufferWarrantyPerProduct'),
//             enableEditing: true,
//             Footer: () => (tenderCostingState?.bufferWarrantyT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'unitPriceWithoutVTOtherExpPerProduct',
//         header: 'Unit Price (No V&T + Others)',
//         size: 190,
//         Cell: readonlyNumberCell('unitPriceWithoutVTOtherExpPerProduct'),
//         enableEditing: false,
//         Footer: () => null,
//       },
//       {
//         header: 'Tax & VAT One',
//         columns: [
//           {
//             accessorKey: 'taxAndVATOnePerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.taxAndVATOneP ?? 0}
//                   defaultValue={tenderCostingState?.taxAndVATOneP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleTaxAndVATOnePercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 150,
//             Cell: readonlyNumberCell('taxAndVATOnePerProduct' as any),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.taxAndVATOneT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'unitPriceWithVTPerProduct',
//         header: 'Unit Price With VAT&TAX',
//         size: 190,
//         Cell: readonlyNumberCell('unitPriceWithVTPerProduct'),
//         enableEditing: false,
//         Footer: () => (tenderCostingState?.unitPriceWithVTT ?? 0).toFixed(2),
//       },
//       {
//         header: 'Sales Expense',
//         columns: [
//           {
//             accessorKey: 'salesExpensePerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.salesExpenseP ?? 0}
//                   defaultValue={tenderCostingState?.salesExpenseP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleSalesExpensePercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 150,
//             Cell: readonlyNumberCell('salesExpensePerProduct' as any),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.salesExpenseT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'unitPriceWithSePerProduct',
//         header: 'Unit Price With SE',
//         size: 180,
//         Cell: readonlyNumberCell('unitPriceWithSePerProduct'),
//         enableEditing: false,
//         Footer: () => null,
//       },
//       {
//         header: 'AG Expense',
//         columns: [
//           {
//             accessorKey: 'agExpensePerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.agExpenseP ?? 0}
//                   defaultValue={tenderCostingState?.agExpenseP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleAgExpensePercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 150,
//             Cell: readonlyNumberCell('agExpensePerProduct' as any),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.agExpenseT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'unitPriceWithAgPerProduct',
//         header: 'Unit Price With AG',
//         size: 180,
//         Cell: readonlyNumberCell('unitPriceWithAgPerProduct'),
//         enableEditing: false,
//         Footer: () => null,
//       },
//       {
//         header: 'Tax & VAT Two',
//         columns: [
//           {
//             accessorKey: 'taxAndVATTwoPerProduct',
//             header: (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onPointerDown={(e) => e.stopPropagation()}
//                 style={{ width: '100%' }}
//               >
//                 <TextField
//                   key={tenderCostingState?.taxAndVATTwoP ?? 0}
//                   defaultValue={tenderCostingState?.taxAndVATTwoP ?? 0}
//                   type="number"
//                   variant="standard"
//                   size="small"
//                   InputProps={{
//                     disableUnderline: true,
//                     endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
//                     style: { fontSize: '0.8125rem' },
//                   }}
//                   sx={{ width: '100%' }}
//                   onBlur={(e) => handleTaxAndVATTwoPercentBlur(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </div>
//             ),
//             size: 160,
//             Cell: readonlyNumberCell('taxAndVATTwoPerProduct' as any),
//             enableEditing: false,
//             Footer: () => (tenderCostingState?.taxAndVATTwoT ?? 0).toFixed(2),
//           },
//         ],
//       },
//       {
//         accessorKey: 'unitPriceWithTv2SeAgPerProduct',
//         header: 'Unit Price(TaxVat2+SE+AG)',
//         size: 210,
//         Cell: readonlyNumberCell('unitPriceWithTv2SeAgPerProduct'),
//         enableEditing: false,
//         Footer: () =>
//           (tenderCostingState?.unitPriceWithTv2SeAgT ?? 0).toFixed(2),
//       },
//       {
//         accessorKey: 'totalAmountOnePerProduct',
//         header: 'Total Amount One',
//         size: 180,
//         Cell: readonlyNumberCell('totalAmountOnePerProduct'),
//         enableEditing: false,
//         Footer: () => (tenderCostingState?.totalAmountOneT ?? 0).toFixed(2),
//       },
//       {
//         accessorKey: 'totalVatTaxPerProduct',
//         header: 'Total Vat & Tax',
//         size: 180,
//         Cell: readonlyNumberCell('totalVatTaxPerProduct'),
//         enableEditing: false,
//         Footer: () => (tenderCostingState?.totalVatTaxT ?? 0).toFixed(2),
//       },
//     ];
//   }, [rows, tenderCostingState]);

//   const table: MRT_TableInstance<TenderCostingDetailRow> =
//     useMaterialReactTable({
//       columns,
//       data: rows,
//       state: { columnVisibility, isLoading },
//       onColumnVisibilityChange: setColumnVisibility,
//       layoutMode: 'semantic',
//       enableStickyHeader: true,
//       enableTableFooter: true,
//       enableStickyFooter: true,
//       enableRowVirtualization: false,
//       enableBottomToolbar: false,
//       enablePagination: false,
//       enableColumnResizing: true,
//       muiTableContainerProps: {
//         sx: { maxHeight: '25rem', overflow: 'auto', position: 'relative' },
//       },
//       muiTableFooterProps: {
//         sx: {
//           position: 'sticky',
//           bottom: '0',
//           zIndex: 2,
//           backgroundColor: '#F6F7FF',
//         },
//       },
//       muiTableFooterCellProps: {
//         sx: {
//           backgroundColor: '#F6F7FF',
//           fontWeight: 800,
//           fontSize: '0.8125rem',
//           borderTop: '1px solid #e0e0e0',
//           borderRight: '1px solid #e0e0e0',
//         },
//       },
//       muiTablePaperProps: {
//         elevation: 0,
//         sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
//       },
//       muiTableBodyCellProps: { sx: { fontSize: '0.8125rem', color: '#1c1c1c' } },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           fontSize: '0.8125rem',
//           whiteSpace: 'nowrap',
//           backgroundColor: '#ECEFF9',
//           color: '#1c1c1c',
//           fontWeight: 800,
//         },
//       },
//       renderToolbarInternalActions: ({ table }) => (
//         <>
//           <MRT_ToggleGlobalFilterButton table={table} />
//           <MRT_ShowHideColumnsButton table={table} />
//           <MRT_ToggleFullScreenButton table={table} />
//           <MRT_ToggleFiltersButton table={table} />
//         </>
//       ),
//     });

//   // functions
//   const handleTenderChange = (
//     selectedItem: ITenderNoComboBox | null,
//     onChange: any
//   ) => {
//     onChange(selectedItem);
//     setTenderInfo(selectedItem);
//     triggerGetTenderCosting({
//       tenderId: selectedItem?.procurementTenderId || 0,
//     });
//   };

//   const summary = {
//     bgAmount: tenderCostingState?.bgAmount ?? 0,
//     sumOfUnit: tenderCostingState?.sumOfUnit ?? 0,
//     totalAmountOneT: tenderCostingState?.totalAmountOneT ?? 0,
//     performanceGuaranteeP: tenderCostingState?.performanceGuaranteeP ?? 0,
//     performanceGuaranteeA: tenderCostingState?.performanceGuaranteeA ?? 0,
//     pgMarginP: tenderCostingState?.pgMarginP ?? 0,
//     pgMarginAmount: tenderCostingState?.pgMarginAmount ?? 0,
//     pgBankFinanceChargeP: tenderCostingState?.pgBankFinanceChargeP ?? 0,
//     pgBankFinanceChargeA: tenderCostingState?.pgBankFinanceChargeA ?? 0,
//     pgTotalYears: tenderCostingState?.pgTotalYears ?? 0,
//     pgTotalYearsA: tenderCostingState?.pgTotalYearsA ?? 0,
//     pgPerQtChargeP: tenderCostingState?.pgPerQtChargeP ?? 0,
//     pgPerQtChargeA: tenderCostingState?.pgPerQtChargeA ?? 0,
//     pgTotalQuarter: tenderCostingState?.pgTotalQuarter ?? 0,
//     pgTotalQtChargeA: tenderCostingState?.pgTotalQtChargeA ?? 0,
//     pgTotalQtChargeAWithPgTotalYearsA:
//       tenderCostingState?.pgTotalQtChargeAWithPgTotalYearsA ?? 0,
//     pgFixedExpense: tenderCostingState?.pgFixedExpense ?? 0,
//     fixedExpWithPgTotalQtChargeAWithPgTotalYearsA:
//       tenderCostingState?.fixedExpWithPgTotalQtChargeAWithPgTotalYearsA ?? 0,
//     pgValuePerUnit: tenderCostingState?.pgValuePerUnit ?? 0,
//   };

//   return (
//     <div className="mt-16 md:mt-2">
//       <div className="flex justify-center">
//         <div className="block w-[98%]">
//           <form>
//             <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
//               <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//                 {biznessEventName ?? 'Tender Costing Breakdown'}
//               </div>

//               <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1 mt-5">
//                 <div className="grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-1">
//                   <div>
//                     <div>
//                       <Controller
//                         name="tenderNo"
//                         control={control}
//                         render={({
//                           field: { onChange, onBlur, value, ref },
//                           fieldState: { error },
//                         }) => (
//                           <Autocomplete
//                             id=""
//                             size="small"
//                             readOnly={
//                               !!clickedCardInfo?.biznessEventProcessConfigurationId
//                             }
//                             options={tenderComboOptions || []}
//                             value={value || null}
//                             onChange={(event, item) =>
//                               handleTenderChange(item, onChange)
//                             }
//                             onBlur={onBlur}
//                             getOptionLabel={(option) =>
//                               option ? option.tenderNo : ''
//                             }
//                             isOptionEqualToValue={(option, selectedValue) =>
//                               option.tenderNo === selectedValue?.tenderNo &&
//                               option.procurementTenderId ===
//                                 selectedValue?.procurementTenderId
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Tender No"
//                                 variant="standard"
//                                 error={!!error}
//                                 helperText={error ? error.message : null}
//                                 InputLabelProps={{
//                                   ...params.InputLabelProps,
//                                   style: { fontSize: '0.875rem' },
//                                 }}
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   style: { fontSize: '0.8125rem' },
//                                 }}
//                                 sx={{ width: '100%', marginTop: 1 }}
//                                 inputRef={ref}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-span-2">
//                     <CostingForm
//                       summary={summary}
//                       onChange={{
//                         onPerformanceGuaranteePChange:
//                           handlePerformanceGuaranteePercentBlur,
//                         onPgMarginPChange: handlePgMarginPercentBlur,
//                         onPgBankFinanceChargePChange:
//                           handlePgBankFinanceChargePercentBlur,
//                         onPgTotalYearsChange: handlePgTotalYearsBlur,
//                         onPgPerQtChargePChange: handlePgPerQtChargePercentBlur,
//                         onPgFixedExpenseChange: handlePgFixedExpenseBlur,
//                       }}
//                     />
//                   </div>
//                   <div>{/* reserved for future header info */}</div>
//                 </div>

//                 <div className="w-full mt-4 mb-5 modifiedEditTable">
//                   <MaterialReactTable table={table} />
//                 </div>
//               </div>

//               <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//                 <div className="flex gap-x-3">
//                   <button
//                     type="button"
//                     className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded-md shadow hover:bg-blue-700 active:bg-blue-800 transition"
//                     onClick={() => {
//                       console.log('TenderCostingState ➜', tenderCostingState);
//                     }}
//                   >
//                     Save
//                   </button>

//                   <button
//                     type="button"
//                     className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold text-sm rounded-md shadow hover:bg-gray-400 active:bg-gray-500 transition"
//                     onClick={() => {
//                       modalPageOpenerClose?.();
//                     }}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TenderCosting;
