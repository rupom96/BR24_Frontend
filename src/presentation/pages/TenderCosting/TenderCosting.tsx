/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from 'material-react-table';
import type {
  MRT_ColumnDef,
  MRT_TableInstance,
  MRT_ColumnPinningState,
} from 'material-react-table';
import {
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { ExportToCsv } from 'export-to-csv';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

import {
  GetTenderCostingDetailDto,
  GetTenderCostingDto,
  TenderCostingCommandsVM,
} from '../../../domain/interfaces/TenderCostingInterface';
import {
  useLazyGetTenderCostingQuery,
  useProcessTenderCostingMutation,
} from '../../../infrastructure/api/TenderApiSlice';
import { IBuyer } from '../../../domain/interfaces/BuyerInterface';
import { ITenderNoComboBox2 } from '../../../domain/interfaces/ProcurementTenderInterface';
import { CostingForm } from './CostingFormTabular';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { useAppSelector } from '../../../application/Redux/store/store';
import { hexToRgba } from '../../Utils/colorUtils';

const API_BASE_URL = (window as any).API_BASE_URL;

// ===== Frontend view models (single source of truth) =====

type TenderCostingDetailRow = GetTenderCostingDetailDto & {
  totalFob: number;
  lc: number;

  unitCostPerProduct: number; // virtual

  // Virtual / derived pricing layers
  unitPriceWithoutVTOtherExpPerProduct: number; // virtual
  unitPriceWithVTPerProduct: number; // virtual
  unitPriceWithSePerProduct: number; // virtual
  unitPriceWithAgPerProduct: number; // virtual
  unitPriceWithTv2SeAgPerProduct: number; // virtual

  // Virtual totals per-row
  totalAmountOnePerProduct: number; // virtual
  totalVatTaxPerProduct: number; // virtual

  // Tax & VAT Three + final pricing
  taxAndVATThreePerProduct: number; // percentage driven from Tax&VATThreeP
  totalAmountTwoPerProduct: number; // virtual

  /** DB Price at load — used on save when productSource is not FOB/LOCAL/STOCK */
  originalPrice: number | null;

  /** Per-row % (virtual) — drives Dist/Profit values */
  distMarginPercent: number;
  profitPercent: number;
};

const isFobSource = (s?: string | null): boolean => s === 'FOB';
const isLpSource = (s?: string | null): boolean =>
  s === 'LOCAL' || s === 'STOCK';

export type TenderCostingState = Omit<
  GetTenderCostingDto,
  'getTenderCostingDetailDtos'
> & {
  sumOfUnit: number;
  sumOfTotalFOB: number;

  unitCostT: number; // virtual total

  unitPriceWithVTT: number; // virtual total for Unit Price With VAT&TAX
  unitPriceWithSeT: number; // virtual total for Unit Price With SE
  unitPriceWithAgT: number; // virtual total for Unit Price With AG
  unitPriceWithTv2SeAgT: number; // virtual total for Unit Price(TaxVat2+SE+AG)
  totalAmountOneT: number; // virtual total for Total Amount One
  totalVatTaxT: number; // virtual total for Total Vat & Tax
  totalAmountTwoT: number; // virtual total for Total Amount Two

  // PG derived (virtual) fields
  pgBankFinanceChargeA: number;
  pgTotalYearsA: number;
  pgPerQtChargeA: number;
  pgTotalQuarter: number;
  pgTotalQtChargeA: number;
  pgTotalQtChargeAWithPgTotalYearsA: number;
  fixedExpWithPgTotalQtChargeAWithPgTotalYearsA: number;
  pgValuePerUnit: number;

  // BG derived
  bgValuePerUnit: number;

  // SD derived
  securityDepositA: number;
  sdBankFinanceChargeA: number;
  sdTotalYearsA: number;
  sdValuePerUnit: number;

  // Combined BG + PG + SD
  bgAndPgAndSd: number;

  getTenderCostingDetailDtos: TenderCostingDetailRow[];
};

const round2 = (n: number): number =>
  Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;

// ===== Recompute all (single source of truth) =====

const recomputeAll = (state: TenderCostingState): TenderCostingState => {
  const taxAndVATOnePct = state.taxAndVATOneP ?? 0;
  const salesExpensePct = state.salesExpenseP ?? 0;
  const agExpensePct = state.agExpenseP ?? 0;
  const taxAndVATTwoPct = state.taxAndVATTwoP ?? 0;
  const taxAndVATThreePct = state.taxAndVATThreeP ?? 0;

  let sumOfUnit = 0;
  let sumOfTotalFOB = 0;
  let distMarginT = 0;
  let sumDistMarginPercent = 0;
  let sumLP = 0;
  let sumProfit = 0;
  let sumProfitPercent = 0;
  let sumDP = 0;
  let sumUnitCost = 0;

  // “Other Costs” totals
  let sumDelivery = 0;
  let sumInstallation = 0;
  let sumPSI = 0;
  let sumTraining = 0;
  let sumSoftware = 0;
  let sumHardware = 0;
  let sumBuffer = 0;

  // Tax & VAT One total
  let sumTaxAndVATOne = 0;

  // Unit Price With VAT&TAX + Sales Expense + Unit Price With SE
  let sumUnitPriceWithVT = 0;
  let sumSalesExpense = 0;
  let sumUnitPriceWithSe = 0;

  // AG Expense + Unit Price With AG
  let sumAgExpense = 0;
  let sumUnitPriceWithAg = 0;

  // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
  let sumTaxAndVATTwo = 0;
  let sumUnitPriceWithTv2SeAg = 0;

  // Total Amount One + Total Vat & Tax
  let sumTotalAmountOne = 0;
  let sumTotalVatTax = 0;

  // ---- Pass 1: compute all row values up to TotalAmountOne / TotalVatTax ----
  const firstPassRows: TenderCostingDetailRow[] =
    state.getTenderCostingDetailDtos.map((row) => {
      const quantity = row.quantity ?? 0;
      const price = row.price ?? 0;
      const factor = row.initialFactor ?? 0;

      const totalFob = quantity && price ? round2(quantity * price) : 0;

      const distMarginPercent = row.distMarginPercent ?? 0;
      const profitPercent = row.profitPercent ?? 0;

      // FOB: Dist value from row %; non-FOB: keep stored Dist cost
      const distMarginPerProduct = isFobSource(row.productSource)
        ? price && distMarginPercent
          ? round2(price * (distMarginPercent / 100))
          : 0
        : row.distMarginPerProduct ?? 0;

      const lpPerProduct = row.lpPerProduct ?? 0;

      const lc =
        price && factor ? round2((price + distMarginPerProduct) * factor) : 0;

      const profitBase = (lc || 0) + (lpPerProduct || 0);
      const profitPerProduct =
        profitPercent && profitBase
          ? round2(profitBase * (profitPercent / 100))
          : 0;

      const dpPerProduct = row.dpPerProduct ?? 0;

      const unitCostPerProduct = round2(
        (lc || 0) +
          (lpPerProduct || 0) +
          (dpPerProduct || 0) +
          (profitPerProduct || 0)
      );

      // keep editable “Other Costs” as-is
      const deliveryPerProduct = row.deliveryPerProduct ?? 0;
      const installationPerProduct = row.installationPerProduct ?? 0;
      const preShipmentInspectionPerProduct =
        row.preShipmentInspectionPerProduct ?? 0;
      const trainingPerProduct = row.trainingPerProduct ?? 0;
      const softwareOSOfficePerProduct = row.softwareOSOfficePerProduct ?? 0;
      const hardwareAccessoriesPerProduct =
        row.hardwareAccessoriesPerProduct ?? 0;
      const bufferWarrantyPerProduct = row.bufferWarrantyPerProduct ?? 0;

      // Unit Price (No V&T + Others)
      const unitPriceWithoutVTOtherExpPerProduct = round2(
        unitCostPerProduct +
          (deliveryPerProduct || 0) +
          (installationPerProduct || 0) +
          (preShipmentInspectionPerProduct || 0) +
          (trainingPerProduct || 0) +
          (softwareOSOfficePerProduct || 0) +
          (hardwareAccessoriesPerProduct || 0) +
          (bufferWarrantyPerProduct || 0)
      );

      // Tax & VAT One per row (non-virtual)
      const taxAndVATOnePerProduct =
        taxAndVATOnePct && unitPriceWithoutVTOtherExpPerProduct
          ? round2(
              unitPriceWithoutVTOtherExpPerProduct * (taxAndVATOnePct / 100)
            )
          : 0;

      const unitPriceWithVTPerProduct = round2(
        unitPriceWithoutVTOtherExpPerProduct + (taxAndVATOnePerProduct || 0)
      );

      const salesExpensePerProduct =
        salesExpensePct && unitPriceWithVTPerProduct
          ? round2(unitPriceWithVTPerProduct * (salesExpensePct / 100))
          : 0;

      const unitPriceWithSePerProduct = round2(
        unitPriceWithVTPerProduct + (salesExpensePerProduct || 0)
      );

      const agExpensePerProduct =
        agExpensePct && unitPriceWithSePerProduct
          ? round2(unitPriceWithSePerProduct * (agExpensePct / 100))
          : 0;

      const unitPriceWithAgPerProduct = round2(
        unitPriceWithSePerProduct + (agExpensePerProduct || 0)
      );

      const taxAndVATTwoPerProduct =
        taxAndVATTwoPct && (agExpensePerProduct || salesExpensePerProduct)
          ? round2(
              (agExpensePerProduct + salesExpensePerProduct) *
                (taxAndVATTwoPct / 100)
            )
          : 0;

      const unitPriceWithTv2SeAgPerProduct = round2(
        unitPriceWithAgPerProduct + (taxAndVATTwoPerProduct || 0)
      );

      const totalAmountOnePerProduct = round2(
        (quantity || 0) * (unitPriceWithTv2SeAgPerProduct || 0)
      );

      const totalVatTaxPerProduct = round2(
        (taxAndVATOnePerProduct + taxAndVATTwoPerProduct) * (quantity || 0)
      );

      sumOfUnit += quantity || 0;
      sumOfTotalFOB += totalFob || 0;
      distMarginT += distMarginPerProduct || 0;
      sumDistMarginPercent += distMarginPercent || 0;
      sumLP += lpPerProduct || 0;
      sumProfit += profitPerProduct || 0;
      sumProfitPercent += profitPercent || 0;
      sumDP += dpPerProduct || 0;
      sumUnitCost += unitCostPerProduct || 0;

      sumDelivery += deliveryPerProduct || 0;
      sumInstallation += installationPerProduct || 0;
      sumPSI += preShipmentInspectionPerProduct || 0;
      sumTraining += trainingPerProduct || 0;
      sumSoftware += softwareOSOfficePerProduct || 0;
      sumHardware += hardwareAccessoriesPerProduct || 0;
      sumBuffer += bufferWarrantyPerProduct || 0;

      sumTaxAndVATOne += taxAndVATOnePerProduct || 0;
      sumUnitPriceWithVT += unitPriceWithVTPerProduct || 0;

      sumSalesExpense += salesExpensePerProduct || 0;
      sumUnitPriceWithSe += unitPriceWithSePerProduct || 0;

      sumAgExpense += agExpensePerProduct || 0;
      sumUnitPriceWithAg += unitPriceWithAgPerProduct || 0;

      sumTaxAndVATTwo += taxAndVATTwoPerProduct || 0;
      sumUnitPriceWithTv2SeAg += unitPriceWithTv2SeAgPerProduct || 0;

      sumTotalAmountOne += totalAmountOnePerProduct || 0;
      sumTotalVatTax += totalVatTaxPerProduct || 0;

      return {
        ...row,
        totalFob,
        distMarginPercent,
        distMarginPerProduct,
        lpPerProduct,
        lc,
        profitPercent,
        profitPerProduct,
        dpPerProduct,
        unitCostPerProduct,
        deliveryPerProduct,
        installationPerProduct,
        preShipmentInspectionPerProduct,
        trainingPerProduct,
        softwareOSOfficePerProduct,
        hardwareAccessoriesPerProduct,
        bufferWarrantyPerProduct,
        unitPriceWithoutVTOtherExpPerProduct,
        taxAndVATOnePerProduct,
        unitPriceWithVTPerProduct,
        salesExpensePerProduct,
        unitPriceWithSePerProduct,
        agExpensePerProduct,
        unitPriceWithAgPerProduct,
        taxAndVATTwoPerProduct,
        unitPriceWithTv2SeAgPerProduct,
        totalAmountOnePerProduct,
        totalVatTaxPerProduct,
      };
    });

  const sumOfUnitSafe = sumOfUnit || 0;
  const totalAmountOneTSafe = sumTotalAmountOne || 0;

  // ---- PG, BG, SD derived (state-level) ----

  // BG
  const bgAmount = state.bgAmount ?? 0;
  const bgValuePerUnit = sumOfUnitSafe ? round2(bgAmount / sumOfUnitSafe) : 0;

  // PG core fields
  const performanceGuaranteeP = state.performanceGuaranteeP ?? 0;
  const pgMarginP = state.pgMarginP ?? 0;
  const pgBankFinanceChargeP = state.pgBankFinanceChargeP ?? 0;
  const pgTotalYears = state.pgTotalYears ?? 0;
  const pgPerQtChargeP = state.pgPerQtChargeP ?? 0;
  const pgFixedExpense = state.pgFixedExpense ?? 0;

  const performanceGuaranteeA = round2(
    (performanceGuaranteeP / 100) * totalAmountOneTSafe
  );
  const pgMarginAmount = round2((pgMarginP / 100) * performanceGuaranteeA);
  const pgBankFinanceChargeA = round2(
    (pgBankFinanceChargeP / 100) * pgMarginAmount
  );
  const pgTotalYearsA = round2(pgTotalYears * pgBankFinanceChargeA);
  const pgPerQtChargeA = round2((pgPerQtChargeP / 100) * performanceGuaranteeA);

  const pgTotalQuarter = pgTotalYears * 4 + 1;
  const pgTotalQtChargeA = round2(pgTotalQuarter * pgPerQtChargeA);
  const pgTotalQtChargeAWithPgTotalYearsA = round2(
    pgTotalQtChargeA + pgTotalYearsA
  );
  const fixedExpWithPgTotalQtChargeAWithPgTotalYearsA = round2(
    pgFixedExpense + pgTotalQtChargeAWithPgTotalYearsA
  );
  const pgValuePerUnit = sumOfUnitSafe
    ? round2(fixedExpWithPgTotalQtChargeAWithPgTotalYearsA / sumOfUnitSafe)
    : 0;

  // SD
  const securityDeposit = state.securityDeposit ?? 0;
  const securityDepositP = state.securityDepositP ?? 0;
  const sdBankFinanceChargeP = state.sdBankFinanceChargeP ?? 0;
  const sdTotalYears = state.sdTotalYears ?? 0;

  const securityDepositA = round2((securityDepositP / 100) * securityDeposit);
  const sdBankFinanceChargeA = round2(
    (sdBankFinanceChargeP / 100) * securityDepositA
  );
  const sdTotalYearsA = round2(sdTotalYears * sdBankFinanceChargeA);
  const sdValuePerUnit = sumOfUnitSafe
    ? round2(sdTotalYearsA / sumOfUnitSafe)
    : 0;

  // Combined BG + PG + SD
  const bgAndPgAndSd = round2(bgValuePerUnit + pgValuePerUnit + sdValuePerUnit);

  // ---- Pass 2: Tax & VAT Three, Unit Price(Calculated), Total Amount Two ----
  let sumTaxAndVATThree = 0;
  let sumTotalAmountTwo = 0;

  const finalRows: TenderCostingDetailRow[] = firstPassRows.map((row) => {
    const quantity = row.quantity ?? 0;

    const taxAndVATThreePerProduct =
      taxAndVATThreePct && bgAndPgAndSd
        ? round2(bgAndPgAndSd * (taxAndVATThreePct / 100))
        : 0;

    const calculatedPrice = round2(
      (row.unitPriceWithTv2SeAgPerProduct || 0) +
        bgAndPgAndSd +
        (taxAndVATThreePerProduct || 0)
    );

    const totalAmountTwoPerProduct = round2(quantity * (calculatedPrice || 0));

    const calculatedProfit = round2(quantity * (row.profitPerProduct || 0));

    sumTaxAndVATThree += taxAndVATThreePerProduct || 0;
    sumTotalAmountTwo += totalAmountTwoPerProduct || 0;

    return {
      ...row,
      taxAndVATThreePerProduct,
      calculatedPrice,
      totalAmountTwoPerProduct,
      calculatedProfit,
    };
  });

  return {
    ...state,
    getTenderCostingDetailDtos: finalRows,
    sumOfUnit: round2(sumOfUnit),
    sumOfTotalFOB: round2(sumOfTotalFOB),
    distMarginP: round2(sumDistMarginPercent),
    distMarginT: round2(distMarginT),
    lpt: round2(sumLP),
    profitP: round2(sumProfitPercent),
    profitT: round2(sumProfit),
    dpt: round2(sumDP),
    unitCostT: round2(sumUnitCost),
    // “Other Costs” totals
    deliveryT: round2(sumDelivery),
    installationT: round2(sumInstallation),
    preShipmentInspectionT: round2(sumPSI),
    trainingT: round2(sumTraining),
    softwareOSOfficeT: round2(sumSoftware),
    hardwareAccessoriesT: round2(sumHardware),
    bufferWarrantyT: round2(sumBuffer),
    // Tax & VAT One total
    taxAndVATOneT: round2(sumTaxAndVATOne),
    unitPriceWithVTT: round2(sumUnitPriceWithVT),
    // Sales Expense + Unit Price With SE
    salesExpenseT: round2(sumSalesExpense),
    unitPriceWithSeT: round2(sumUnitPriceWithSe),
    // AG Expense + Unit Price With AG
    agExpenseT: round2(sumAgExpense),
    unitPriceWithAgT: round2(sumUnitPriceWithAg),
    // Tax & VAT Two + Unit Price(TaxVat2+SE+AG)
    taxAndVATTwoT: round2(sumTaxAndVATTwo),
    unitPriceWithTv2SeAgT: round2(sumUnitPriceWithTv2SeAg),
    // Total Amount One + Total Vat & Tax
    totalAmountOneT: round2(sumTotalAmountOne),
    totalVatTaxT: round2(sumTotalVatTax),
    // Tax & VAT Three T
    taxAndVATThreeT: round2(sumTaxAndVATThree),
    // Total Amount Two
    totalAmountTwoT: round2(sumTotalAmountTwo),

    // PG derived
    performanceGuaranteeA,
    pgMarginAmount,
    pgBankFinanceChargeA,
    pgTotalYearsA,
    pgPerQtChargeA,
    pgTotalQuarter,
    pgTotalQtChargeA,
    pgTotalQtChargeAWithPgTotalYearsA,
    fixedExpWithPgTotalQtChargeAWithPgTotalYearsA,
    pgValuePerUnit,

    // BG derived
    bgValuePerUnit,

    // SD derived
    securityDepositA,
    sdBankFinanceChargeA,
    sdTotalYearsA,
    sdValuePerUnit,

    // Combined
    bgAndPgAndSd,
  } as TenderCostingState;
};

// ===== Build initial state from backend DTO (then fully recompute) =====

const buildInitialStateFromDto = (
  dto: GetTenderCostingDto
): TenderCostingState => {
  const rows: TenderCostingDetailRow[] = dto.getTenderCostingDetailDtos.map(
    (d) => {
      const originalPrice = d.price ?? null;
      const productSource = d.productSource ?? null;
      const apiPrice = d.price ?? 0;
      const distCost = d.distMarginPerProduct ?? 0;
      const profitCost = d.profitPerProduct ?? 0;
      const factor = d.initialFactor ?? 0;

      // LOCAL/STOCK: Price displays & calculates as LP; FOB-side price = 0
      // FOB: Price stays in FOB; LP from AdditionalCost as returned
      // other: leave as returned; both columns read-only later
      let price = apiPrice;
      let lpPerProduct = d.lpPerProduct ?? 0;
      if (isLpSource(productSource)) {
        lpPerProduct = originalPrice ?? 0;
        price = 0;
      }

      // Dist %: reverse from Cost/price when price > 0 (API price before LOCAL remap)
      let distMarginPercent = 0;
      if (apiPrice > 0 && distCost) {
        distMarginPercent = round2((distCost / apiPrice) * 100);
      }
      if (isLpSource(productSource)) {
        distMarginPercent = 0;
      }

      // Provisional Dist for Profit % reverse (FOB uses %; else keep API cost)
      const provisionalDist = isFobSource(productSource)
        ? price && distMarginPercent
          ? round2(price * (distMarginPercent / 100))
          : 0
        : distCost;
      const provisionalLc =
        price && factor ? round2((price + provisionalDist) * factor) : 0;
      const profitBase = (provisionalLc || 0) + (lpPerProduct || 0);
      let profitPercent = dto.profitP ?? 0;
      if (profitBase > 0 && profitCost) {
        profitPercent = round2((profitCost / profitBase) * 100);
      }

      return {
        ...d,
        productSource,
        price,
        lpPerProduct,
        originalPrice,
        distMarginPercent,
        distMarginPerProduct: distCost,
        profitPercent,
        totalFob: 0,
        lc: 0,
        profitPerProduct: profitCost,
        unitCostPerProduct: 0,
        unitPriceWithoutVTOtherExpPerProduct: 0,
        unitPriceWithVTPerProduct: 0,
        unitPriceWithSePerProduct: 0,
        unitPriceWithAgPerProduct: 0,
        unitPriceWithTv2SeAgPerProduct: 0,
        totalAmountOnePerProduct: 0,
        totalVatTaxPerProduct: 0,
        taxAndVATThreePerProduct: d.taxAndVATThreePerProduct ?? 0,
        calculatedPrice: d.calculatedPrice ?? 0,
        totalAmountTwoPerProduct: 0,
        calculatedProfit: d.calculatedProfit ?? 0,
      };
    }
  );

  const baseState: TenderCostingState = {
    ...dto,
    sumOfUnit: 0,
    sumOfTotalFOB: 0,
    // Profit % and total from DB (totals will be recomputed)
    profitP: dto.profitP ?? 0,
    profitT: dto.profitT ?? 0,
    unitCostT: 0,
    unitPriceWithVTT: 0,
    unitPriceWithSeT: 0,
    unitPriceWithAgT: 0,
    unitPriceWithTv2SeAgT: 0,
    totalAmountOneT: 0,
    totalVatTaxT: 0,
    totalAmountTwoT: 0,
    // PG derived defaults
    pgBankFinanceChargeA: 0,
    pgTotalYearsA: 0,
    pgPerQtChargeA: 0,
    pgTotalQuarter: dto.pgTotalQuarter ?? 0,
    pgTotalQtChargeA: 0,
    pgTotalQtChargeAWithPgTotalYearsA: 0,
    fixedExpWithPgTotalQtChargeAWithPgTotalYearsA: 0,
    pgValuePerUnit: 0,
    // BG
    bgValuePerUnit: 0,
    // SD
    securityDepositA: 0,
    sdBankFinanceChargeA: 0,
    sdTotalYearsA: 0,
    sdValuePerUnit: 0,
    // Combined
    bgAndPgAndSd: 0,
    getTenderCostingDetailDtos: rows,
  };

  // Single source of truth: recompute everything once
  return recomputeAll(baseState);
};

// ===== Props =====

interface TenderCostingProps {
  modalPageOpenerClose?: () => void;
  clickedCardInfo?: any;
  operationMode?: 'view' | 'edit' | string;
}

// ===== CSV export helper =====

const handleExportAllData = (
  table: MRT_TableInstance<TenderCostingDetailRow>,
  state: TenderCostingState | null
) => {
  const rowModel = table.getRowModel();
  if (!rowModel.rows?.length) {
    toast.warn('No data to export');
    return;
  }

  const leafColumns = table.getAllLeafColumns();

  const headerRow: Record<string, any> = {};
  const subHeaderRow: Record<string, any> = {};

  // ---------- Header row (parent headers) + Subheader row (leaf headers / %) ----------
  leafColumns.forEach((col) => {
    const parentHeader =
      typeof col.parent?.columnDef.header === 'string'
        ? col.parent?.columnDef.header
        : '';

    const ownHeader =
      typeof col.columnDef.header === 'string' && col.columnDef.header.trim()
        ? col.columnDef.header
        : col.id;

    headerRow[col.id] = parentHeader || '';
    subHeaderRow[col.id] = ownHeader;

    switch (parentHeader) {
      case 'Tax & VAT ': // 'Tax & VAT ' here, it was 'Tax & VAT One', but cant show that 'One' to client, so name 'One' has been replaced by a space
        subHeaderRow[col.id] = `${state?.taxAndVATOneP ?? 0}%`;
        break;
      case 'Sales Expense':
        subHeaderRow[col.id] = `${state?.salesExpenseP ?? 0}%`;
        break;
      case 'AG Expense':
        subHeaderRow[col.id] = `${state?.agExpenseP ?? 0}%`;
        break;
      case 'Tax & VAT  ': // 'Tax & VAT  ' here, it was 'Tax & VAT Two', but cant show that 'Two' to client, so name 'Two' has been replaced by two spaces
        subHeaderRow[col.id] = `${state?.taxAndVATTwoP ?? 0}%`;
        break;
      case 'Tax & VAT   ': // 'Tax & VAT   ' here, it was 'Tax & VAT Three', but cant show that 'Three' to client, so name 'Three' has been replaced by three spaces
        subHeaderRow[col.id] = `${state?.taxAndVATThreeP ?? 0}%`;
        break;
      default:
        break;
    }
  });

  const dataRows = rowModel.rows.map((row) => {
    const rowData: Record<string, any> = {};

    row.getVisibleCells().forEach((cell) => {
      let value: any;

      if (cell.column.id === 'sn') {
        value = row.index + 1;
      } else {
        value = cell.getValue();
        if (value === undefined || value === null) {
          const rendered = cell.renderValue();
          if (typeof rendered === 'number' || typeof rendered === 'string') {
            value = rendered;
          } else {
            value = '';
          }
        }
      }

      rowData[cell.column.id] = value;
    });

    return rowData;
  });

  const totalsRow: Record<string, any> = {};
  const sumCalculatedProfit = rowModel.rows.reduce((acc, r) => {
    const v = (r.original as TenderCostingDetailRow).calculatedProfit ?? 0;
    return acc + v;
  }, 0);

  leafColumns.forEach((col) => {
    const id = col.id;
    let val: any = '';

    if (!state) {
      totalsRow[id] = '';
      return;
    }

    switch (id) {
      case 'sn':
        val = 'Total';
        break;
      case 'productName':
        val = 'TOTAL';
        break;
      case 'quantity':
        val = state.sumOfUnit ?? 0;
        break;
      case 'totalFob':
        val = state.sumOfTotalFOB ?? 0;
        break;
      case 'distMarginPercent':
        val = (state as any).distMarginP ?? 0;
        break;
      case 'distMarginPerProduct':
        val = (state as any).distMarginT ?? 0;
        break;
      case 'lpPerProduct':
        val = (state as any).lpt ?? 0;
        break;
      case 'profitPercent':
        val = state.profitP ?? 0;
        break;
      case 'profitPerProduct':
        val = state.profitT ?? 0;
        break;
      case 'dpPerProduct':
        val = (state as any).dpt ?? 0;
        break;
      case 'unitCostPerProduct':
        val = state.unitCostT ?? 0;
        break;

      case 'deliveryPerProduct':
        val = (state as any).deliveryT ?? 0;
        break;
      case 'installationPerProduct':
        val = (state as any).installationT ?? 0;
        break;
      case 'preShipmentInspectionPerProduct':
        val = (state as any).preShipmentInspectionT ?? 0;
        break;
      case 'trainingPerProduct':
        val = (state as any).trainingT ?? 0;
        break;
      case 'softwareOSOfficePerProduct':
        val = (state as any).softwareOSOfficeT ?? 0;
        break;
      case 'hardwareAccessoriesPerProduct':
        val = (state as any).hardwareAccessoriesT ?? 0;
        break;
      case 'bufferWarrantyPerProduct':
        val = (state as any).bufferWarrantyT ?? 0;
        break;

      case 'taxAndVATOnePerProduct':
        val = (state as any).taxAndVATOneT ?? 0;
        break;
      case 'unitPriceWithVTPerProduct':
        val = state.unitPriceWithVTT ?? 0;
        break;

      case 'salesExpensePerProduct':
        val = (state as any).salesExpenseT ?? 0;
        break;
      case 'unitPriceWithSePerProduct':
        val = state.unitPriceWithSeT ?? 0;
        break;

      case 'agExpensePerProduct':
        val = (state as any).agExpenseT ?? 0;
        break;
      case 'unitPriceWithAgPerProduct':
        val = state.unitPriceWithAgT ?? 0;
        break;

      case 'taxAndVATTwoPerProduct':
        val = (state as any).taxAndVATTwoT ?? 0;
        break;
      case 'unitPriceWithTv2SeAgPerProduct':
        val = state.unitPriceWithTv2SeAgT ?? 0;
        break;

      case 'totalAmountOnePerProduct':
        val = state.totalAmountOneT ?? 0;
        break;
      case 'totalVatTaxPerProduct':
        val = state.totalVatTaxT ?? 0;
        break;
      case 'taxAndVATThreePerProduct':
        val = (state as any).taxAndVATThreeT ?? 0;
        break;
      case 'totalAmountTwoPerProduct':
        val = state.totalAmountTwoT ?? 0;
        break;
      case 'calculatedProfit':
        val = sumCalculatedProfit;
        break;

      default:
        val = '';
        break;
    }

    totalsRow[id] =
      typeof val === 'number' && Number.isFinite(val)
        ? Number(val.toFixed(2))
        : val;
  });

  const exporter = new ExportToCsv({
    fieldSeparator: ',',
    decimalSeparator: '.',
    filename: 'tender-costing',
    useKeysAsHeaders: false,
  });

  const exportData = [headerRow, subHeaderRow, ...dataRows, totalsRow];
  exporter.generateCsv(exportData);
};

// ===== Component =====

const TenderCosting: React.FC<TenderCostingProps> = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}) => {
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const accentSoft = hexToRgba(currentColor, 0.08);
  const accentHeader = hexToRgba(currentColor, 0.16);

  const biznessEventName = clickedCardInfo?.biznessEventName?.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  const { control, setValue, watch, getValues } = useForm({
    mode: 'onBlur',
  });

  const [tenderCostingState, setTenderCostingState] =
    useState<TenderCostingState | null>(null);

  // user info for axios Authorization
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  // buyer & tender options (like TenderWon)
  const [buyerOptionsAutoCompLoading, setBuyerOptionsAutoCompLoading] =
    useState<boolean>(false);
  const [buyerOptions, setBuyerOptions] = useState<IBuyer[]>([]);
  const [tenderOptionsAutoCompLoading, setTenderOptionsAutoCompLoading] =
    useState<boolean>(false);
  const [tenderOptions, setTenderOptions] = useState<ITenderNoComboBox2[]>([]);
  const [selectedTender, setSelectedTender] =
    useState<ITenderNoComboBox2 | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<IBuyer | null>(null);

  const [
    triggerGetTenderCosting,
    {
      data: tenderCostingData,
      error: tenderCostingError,
      isError: tenderCostingIsError,
      isSuccess: tenderCostingIsSuccess,
      isLoading: tenderCostingIsLoading,
      isFetching: tenderCostingIsFetching,
    },
  ] = useLazyGetTenderCostingQuery();

  // fetch buyers from backend (same API as TenderWon)
  const fetchBuyerOptions = async () => {
    const dateFrom = getValues('dateFrom')
      ? getValues('dateFrom').format('YYYY-MM-DD 00:00:00.000')
      : '';
    const dateTo = getValues('dateTo')
      ? getValues('dateTo').format('YYYY-MM-DD 23:59:00.000')
      : '';
    const tenderNo = selectedTender?.tenderNo ? selectedTender.tenderNo : '';

    try {
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementTender/getBuyersOfTenderByDateFromDateToTenderNo?dateFrom=${dateFrom}&dateTo=${dateTo}&tenderNo=${tenderNo}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );
      setSelectedBuyer(null);
      return response.data as IBuyer[];
    } catch (error) {
      toast.error('Error fetching Buyer/Customer Options from backend');
      console.log('Error fetching Buyer Options from backend');
      console.log(error);
      return [];
    }
  };

  // fetch tenders from backend (same API as TenderWon)
  const fetchTenderOptions = async () => {
    const dateFrom = getValues('dateFrom')
      ? getValues('dateFrom').format('YYYY-MM-DD 00:00:00.000')
      : '';
    const dateTo = getValues('dateTo')
      ? getValues('dateTo').format('YYYY-MM-DD 23:59:00.000')
      : '';
    const buyerId = selectedBuyer?.buyerId ? selectedBuyer.buyerId : 0;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementTender/getTenderInfoByTenderNoBuyerIdDateFromDateTo?dateFrom=${dateFrom}&dateTo=${dateTo}&buyerId=${buyerId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );

      const options = response.data as ITenderNoComboBox2[];
      setTenderOptions(options);

      // if opened from chain, pre-select flowed tender & load costing
      if (clickedCardInfo?.eventNo) {
        const flowedTender = options.find(
          (t) => t.tenderNo === clickedCardInfo.eventNo
        );
        if (flowedTender) {
          setSelectedTender(flowedTender);
          setValue('tenderNo', flowedTender as any);

          const anyTender: any = flowedTender;

          if (anyTender.buyerId && anyTender.buyerName) {
            const buyerFromTender: IBuyer = {
              buyerId: anyTender.buyerId,
              buyerName: anyTender.buyerName,
            } as any;
            setSelectedBuyer(buyerFromTender);
            setValue('buyer', buyerFromTender as any);
          }

          const tenderDateRaw =
            anyTender.tenderDate ||
            anyTender.tenderOpeningDate ||
            anyTender.tenderDateFrom ||
            anyTender.tenderDateTo;

          if (tenderDateRaw) {
            const d = dayjs(tenderDateRaw);
            if (d.isValid()) {
              setValue('dateFrom', d);
              setValue('dateTo', d);
            }
          }

          triggerGetTenderCosting({
            tenderId: flowedTender.procurementTenderId || 0,
          });
        }
      }

      return options;
    } catch (error) {
      toast.error('Error fetching Tender Options from backend');
      console.log('Error fetching Tender Options from backend');
      console.log(error);
      return [];
    }
  };

  const handleBuyerFocus = async () => {
    setBuyerOptions([]);
    setBuyerOptionsAutoCompLoading(true);
    const buyerOptionsFetched = await fetchBuyerOptions();
    setBuyerOptions([...buyerOptionsFetched]);
    setBuyerOptionsAutoCompLoading(false);
  };

  const handleTenderFocus = async () => {
    setTenderOptions([]);
    setTenderOptionsAutoCompLoading(true);
    const tenderOptionsFetched = await fetchTenderOptions();
    setTenderOptions([...tenderOptionsFetched]);
    setTenderOptionsAutoCompLoading(false);
  };

  // Initial date + options (TenderWon-style)
  useEffect(() => {
    const init = async () => {
      await fetchBuyerOptions();
      await fetchTenderOptions();

      // for menu-open case, default to today
      if (!clickedCardInfo?.biznessEventProcessConfigurationId) {
        setValue('dateFrom', dayjs());
        setValue('dateTo', dayjs());
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tenderCostingIsError) {
      toast.error(
        'Something wrong from backend while fetching tenderCostingData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching tenderCostingData, see console--->:'
      );
      console.log(tenderCostingError);
    }
    if (tenderCostingIsSuccess) {
      const tenderCostingDataCopy = JSON.parse(
        JSON.stringify(tenderCostingData)
      );

      if (tenderCostingDataCopy?.getTenderCostingDetailDtos) {
        const built = buildInitialStateFromDto(
          tenderCostingDataCopy as GetTenderCostingDto
        );
        setTenderCostingState(built);

        // auto-assign customer from tender
        if (built.buyerId && built.buyerName) {
          const buyerFromTender: IBuyer = {
            buyerId: built.buyerId,
            buyerName: built.buyerName,
          } as any;
          setSelectedBuyer(buyerFromTender);
          setValue('buyer', buyerFromTender as any);
        }
      } else {
        setTenderCostingState(null);
      }
    }
  }, [
    tenderCostingData,
    tenderCostingIsLoading,
    tenderCostingError,
    tenderCostingIsError,
    tenderCostingIsFetching,
    tenderCostingIsSuccess,
  ]);

  const [
    processTenderCosting,
    {
      isLoading: processTenderCostingIsLoading,
      isError: processTenderCostingIsError,
      error: processTenderCostingError,
      isSuccess: processTenderCostingIsSuccess,
      data: processTenderCostingData,
    },
  ] = useProcessTenderCostingMutation();

  useEffect(() => {
    if (processTenderCostingIsSuccess) {
      Swal.fire({
        title: 'Tender Costing has been saved successfully!',
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('check data after success, see console---->');
          console.log(processTenderCostingData);
        }
      });
    } else if (processTenderCostingError) {
      toast.error(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(processTenderCostingError);
    }
  }, [
    processTenderCostingIsLoading,
    processTenderCostingIsError,
    processTenderCostingData,
    processTenderCostingError,
    processTenderCostingIsSuccess,
  ]);

  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [columnPinning, setColumnPinning] = useState<MRT_ColumnPinningState>(
    {}
  );
  const [isLoading] = useState(false);

  const rows = tenderCostingState?.getTenderCostingDetailDtos ?? [];

  // ---- handlers for header % fields (Tax/SE/AG still header-level) ----

  const handleTaxAndVATOnePercentBlur = (raw: string) => {
    if (!tenderCostingState) return;
    const val = Number(raw);
    const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
    setTenderCostingState((prev) =>
      prev ? recomputeAll({ ...prev, taxAndVATOneP: next }) : prev
    );
  };

  const handleSalesExpensePercentBlur = (raw: string) => {
    if (!tenderCostingState) return;
    const val = Number(raw);
    const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
    setTenderCostingState((prev) =>
      prev ? recomputeAll({ ...prev, salesExpenseP: next }) : prev
    );
  };

  const handleAgExpensePercentBlur = (raw: string) => {
    if (!tenderCostingState) return;
    const val = Number(raw);
    const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
    setTenderCostingState((prev) =>
      prev ? recomputeAll({ ...prev, agExpenseP: next }) : prev
    );
  };

  const handleTaxAndVATTwoPercentBlur = (raw: string) => {
    if (!tenderCostingState) return;
    const val = Number(raw);
    const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
    setTenderCostingState((prev) =>
      prev ? recomputeAll({ ...prev, taxAndVATTwoP: next }) : prev
    );
  };

  const handleTaxAndVATThreePercentBlur = (raw: string) => {
    if (!tenderCostingState) return;
    const val = Number(raw);
    const next = !raw || Number.isNaN(val) ? 0 : Math.max(0, val);
    setTenderCostingState((prev) =>
      prev ? recomputeAll({ ...prev, taxAndVATThreeP: next }) : prev
    );
  };

  // ---- generic header field blur for BG / PG / SD (CostingForm) ----
  const handleHeaderFieldBlur = (
    field: keyof TenderCostingState,
    raw: string
  ) => {
    setTenderCostingState((prev) => {
      if (!prev) return prev;
      const v = Number(raw);
      const next = raw === '' || Number.isNaN(v) ? 0 : v;
      const updated: TenderCostingState = {
        ...prev,
        [field]: next,
      } as TenderCostingState;
      return recomputeAll(updated);
    });
  };

  const updateCell = (
    rowIndex: number,
    key: keyof TenderCostingDetailRow,
    value: any
  ) => {
    if (!tenderCostingState) return;
    setTenderCostingState((prev) => {
      if (!prev) return prev;
      const nextRows = [...prev.getTenderCostingDetailDtos];
      nextRows[rowIndex] = {
        ...nextRows[rowIndex],
        [key]: value,
      } as TenderCostingDetailRow;
      return recomputeAll({ ...prev, getTenderCostingDetailDtos: nextRows });
    });
  };

  const textCell =
    (key: keyof TenderCostingDetailRow) =>
    ({ row, renderedCellValue }: any) => (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
          defaultValue={renderedCellValue ?? ''}
          onBlur={(e) => {
            const value = e.target.value || null;
            updateCell(row.index, key, value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );

  const numberCell =
    (key: keyof TenderCostingDetailRow) =>
    ({ row, renderedCellValue }: any) => (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          type="number"
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
          defaultValue={renderedCellValue ?? ''}
          onBlur={(e) => {
            const v = e.target.value;
            const num =
              v === '' || Number.isNaN(Number(v)) ? null : Math.abs(Number(v));
            updateCell(row.index, key, num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );

  // FOB: editable only when productSource === FOB; otherwise empty read-only
  const fobCell = ({ row }: any) => {
    const detail = rows[row.index];
    const editable = isFobSource(detail?.productSource);
    if (!editable) {
      return (
        <div className="w-full py-1 flex justify-between items-center">
          <span style={{ fontSize: '0.8125rem' }} />
        </div>
      );
    }
    const val = detail?.price;
    return (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          key={`fob-${row.index}-${val ?? ''}`}
          type="number"
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
          defaultValue={val ?? ''}
          onBlur={(e) => {
            const v = e.target.value;
            const num =
              v === '' || Number.isNaN(Number(v)) ? null : Math.abs(Number(v));
            updateCell(row.index, 'price', num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );
  };

  // LP: editable only when LOCAL/STOCK; otherwise read-only display
  const lpCell = ({ row }: any) => {
    const detail = rows[row.index];
    const editable = isLpSource(detail?.productSource);
    const val = detail?.lpPerProduct;
    if (!editable) {
      return (
        <div className="w-full py-1 flex justify-between items-center">
          <span style={{ fontSize: '0.8125rem' }}>
            {val == null ? '' : Number(val).toFixed(2)}
          </span>
        </div>
      );
    }
    return (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          key={`lp-${row.index}-${val ?? ''}`}
          type="number"
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
          defaultValue={val ?? ''}
          onBlur={(e) => {
            const v = e.target.value;
            const num =
              v === '' || Number.isNaN(Number(v)) ? null : Math.abs(Number(v));
            updateCell(row.index, 'lpPerProduct', num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );
  };

  // Dist Margin %: editable only when productSource === FOB
  const distMarginPercentCell = ({ row }: any) => {
    const detail = rows[row.index];
    const editable = isFobSource(detail?.productSource);
    const val = detail?.distMarginPercent;
    if (!editable) {
      return (
        <div className="w-full py-1 flex justify-between items-center">
          <span style={{ fontSize: '0.8125rem' }}>
            {val == null || val === 0 ? '' : Number(val).toFixed(2)}
          </span>
        </div>
      );
    }
    return (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          key={`distPct-${row.index}-${val ?? ''}`}
          type="number"
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{
            style: { fontSize: '0.8125rem' },
            disableUnderline: true,
            endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
          }}
          defaultValue={val ?? ''}
          onBlur={(e) => {
            const v = e.target.value;
            const num =
              v === '' || Number.isNaN(Number(v)) ? 0 : Math.max(0, Number(v));
            updateCell(row.index, 'distMarginPercent', num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );
  };

  // Profit %: editable on all rows
  const profitPercentCell = ({ row }: any) => {
    const detail = rows[row.index];
    const val = detail?.profitPercent;
    return (
      <div className="w-full py-1 flex justify-between items-center">
        <TextField
          key={`profitPct-${row.index}-${val ?? ''}`}
          type="number"
          variant="standard"
          size="small"
          sx={{ width: '100%' }}
          InputProps={{
            style: { fontSize: '0.8125rem' },
            disableUnderline: true,
            endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
          }}
          defaultValue={val ?? ''}
          onBlur={(e) => {
            const v = e.target.value;
            const num =
              v === '' || Number.isNaN(Number(v)) ? 0 : Math.max(0, Number(v));
            updateCell(row.index, 'profitPercent', num);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    );
  };

  const readonlyNumberCell =
    (key: keyof TenderCostingDetailRow) =>
    ({ row }: any) => {
      const val = rows[row.index][key];
      return (
        <div className="w-full py-1 flex justify-between items-center">
          <span style={{ fontSize: '0.8125rem' }}>
            {val == null ? '' : Number(val).toFixed(2)}
          </span>
        </div>
      );
    };

  // ---- columns & footers ----

  const columns = useMemo<MRT_ColumnDef<TenderCostingDetailRow>[]>(() => {
    return [
      {
        id: 'sn',
        header: 'S/N',
        size: 60,
        Cell: ({ row }) => row.index + 1,
        enableColumnFilter: false,
        enableSorting: false,
        enableEditing: false,
        Footer: () => null,
      },
      {
        accessorKey: 'productName',
        header: 'Item',
        size: 220,
        Cell: textCell('productName'),
        Footer: () => <strong>TOTAL</strong>,
      },
      {
        accessorKey: 'quantity',
        header: 'Unit',
        size: 90,
        Cell: numberCell('quantity'),
        Footer: () => (tenderCostingState?.sumOfUnit ?? 0).toFixed(2),
      },
      {
        accessorKey: 'price',
        header: 'FOB',
        size: 110,
        Cell: fobCell,
        Footer: () => null,
      },
      {
        accessorKey: 'totalFob',
        header: 'Total FOB',
        size: 120,
        Cell: readonlyNumberCell('totalFob'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.sumOfTotalFOB ?? 0).toFixed(2),
      },
      {
        accessorKey: 'distMarginPercent',
        header: 'Dist Margin %',
        size: 120,
        Cell: distMarginPercentCell,
        Footer: () =>
          ((tenderCostingState as any)?.distMarginP ?? 0).toFixed(2),
      },
      {
        accessorKey: 'distMarginPerProduct',
        header: 'Dist Margin',
        size: 120,
        Cell: readonlyNumberCell('distMarginPerProduct' as any),
        enableEditing: false,
        Footer: () =>
          ((tenderCostingState as any)?.distMarginT ?? 0).toFixed(2),
      },
      {
        accessorKey: 'initialFactor',
        header: 'Factor',
        size: 110,
        Cell: numberCell('initialFactor'),
        Footer: () => null,
      },
      {
        accessorKey: 'lc',
        header: 'L/C',
        size: 120,
        Cell: readonlyNumberCell('lc'),
        enableEditing: false,
        Footer: () => null,
      },
      {
        accessorKey: 'lpPerProduct',
        header: 'LP',
        size: 110,
        Cell: lpCell,
        enableEditing: true,
        Footer: () => ((tenderCostingState as any)?.lpt ?? 0).toFixed(2),
      },
      {
        accessorKey: 'profitPercent',
        header: 'Profit %',
        size: 110,
        Cell: profitPercentCell,
        Footer: () => (tenderCostingState?.profitP ?? 0).toFixed(2),
      },
      {
        accessorKey: 'profitPerProduct',
        header: 'Profit',
        size: 120,
        Cell: readonlyNumberCell('profitPerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.profitT ?? 0).toFixed(2),
      },
      {
        accessorKey: 'dpPerProduct',
        header: 'DP',
        size: 110,
        Cell: numberCell('dpPerProduct'),
        enableEditing: true,
        Footer: () => ((tenderCostingState as any)?.dpt ?? 0).toFixed(2),
      },
      {
        accessorKey: 'unitCostPerProduct',
        header: 'Unit Cost',
        size: 130,
        Cell: readonlyNumberCell('unitCostPerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.unitCostT ?? 0).toFixed(2),
      },
      {
        header: 'Other Costs',
        columns: [
          {
            accessorKey: 'deliveryPerProduct',
            header: 'Delivery',
            size: 120,
            Cell: numberCell('deliveryPerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.deliveryT ?? 0).toFixed(2),
          },
          {
            accessorKey: 'installationPerProduct',
            header: 'Installation',
            size: 140,
            Cell: numberCell('installationPerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.installationT ?? 0).toFixed(2),
          },
          {
            accessorKey: 'preShipmentInspectionPerProduct',
            header: 'Pre Shipment Inspection',
            size: 180,
            Cell: numberCell('preShipmentInspectionPerProduct'),
            enableEditing: true,
            Footer: () =>
              (
                (tenderCostingState as any)?.preShipmentInspectionT ?? 0
              ).toFixed(2),
          },
          {
            accessorKey: 'trainingPerProduct',
            header: 'Training',
            size: 120,
            Cell: numberCell('trainingPerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.trainingT ?? 0).toFixed(2),
          },
          {
            accessorKey: 'softwareOSOfficePerProduct',
            header: 'Software (OS/Office)',
            size: 170,
            Cell: numberCell('softwareOSOfficePerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.softwareOSOfficeT ?? 0).toFixed(2),
          },
          {
            accessorKey: 'hardwareAccessoriesPerProduct',
            header: 'Hardware/Accessories',
            size: 180,
            Cell: numberCell('hardwareAccessoriesPerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.hardwareAccessoriesT ?? 0).toFixed(
                2
              ),
          },
          {
            accessorKey: 'bufferWarrantyPerProduct',
            header: 'Buffer (warranty)',
            size: 160,
            Cell: numberCell('bufferWarrantyPerProduct'),
            enableEditing: true,
            Footer: () =>
              ((tenderCostingState as any)?.bufferWarrantyT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'unitPriceWithoutVTOtherExpPerProduct',
        header: 'Unit Price (No V&T + Others)',
        size: 190,
        Cell: readonlyNumberCell('unitPriceWithoutVTOtherExpPerProduct'),
        enableEditing: false,
        Footer: () => null,
      },
      {
        header: 'Tax & VAT ', // 'Tax & VAT ' here, it was 'Tax & VAT One', but cant show that 'One' to client, so name 'One' has been replaced by a space
        columns: [
          {
            accessorKey: 'taxAndVATOnePerProduct',
            header: '',
            Header: (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%' }}
              >
                <TextField
                  key={tenderCostingState?.taxAndVATOneP ?? 0}
                  defaultValue={tenderCostingState?.taxAndVATOneP ?? 0}
                  type="number"
                  variant="standard"
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
                    style: { fontSize: '0.8125rem' },
                  }}
                  sx={{ width: '100%' }}
                  onBlur={(e) => handleTaxAndVATOnePercentBlur(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ),
            size: 150,
            Cell: readonlyNumberCell('taxAndVATOnePerProduct' as any),
            enableEditing: false,
            Footer: () =>
              ((tenderCostingState as any)?.taxAndVATOneT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'unitPriceWithVTPerProduct',
        header: 'Unit Price With VAT&TAX',
        size: 190,
        Cell: readonlyNumberCell('unitPriceWithVTPerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.unitPriceWithVTT ?? 0).toFixed(2),
      },
      {
        header: 'Sales Expense',
        columns: [
          {
            accessorKey: 'salesExpensePerProduct',
            header: '',
            Header: (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%' }}
              >
                <TextField
                  key={tenderCostingState?.salesExpenseP ?? 0}
                  defaultValue={tenderCostingState?.salesExpenseP ?? 0}
                  type="number"
                  variant="standard"
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
                    style: { fontSize: '0.8125rem' },
                  }}
                  sx={{ width: '100%' }}
                  onBlur={(e) => handleSalesExpensePercentBlur(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ),
            size: 150,
            Cell: readonlyNumberCell('salesExpensePerProduct' as any),
            enableEditing: false,
            Footer: () =>
              ((tenderCostingState as any)?.salesExpenseT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'unitPriceWithSePerProduct',
        header: 'Unit Price With SE',
        size: 180,
        Cell: readonlyNumberCell('unitPriceWithSePerProduct'),
        enableEditing: false,
        Footer: () => null,
      },
      {
        header: 'AG Expense',
        columns: [
          {
            accessorKey: 'agExpensePerProduct',
            header: '',
            Header: (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%' }}
              >
                <TextField
                  key={tenderCostingState?.agExpenseP ?? 0}
                  defaultValue={tenderCostingState?.agExpenseP ?? 0}
                  type="number"
                  variant="standard"
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
                    style: { fontSize: '0.8125rem' },
                  }}
                  sx={{ width: '100%' }}
                  onBlur={(e) => handleAgExpensePercentBlur(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ),
            size: 150,
            Cell: readonlyNumberCell('agExpensePerProduct' as any),
            enableEditing: false,
            Footer: () =>
              ((tenderCostingState as any)?.agExpenseT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'unitPriceWithAgPerProduct',
        header: 'Unit Price With AG',
        size: 180,
        Cell: readonlyNumberCell('unitPriceWithAgPerProduct'),
        enableEditing: false,
        Footer: () => null,
      },
      {
        header: 'Tax & VAT  ', // 'Tax & VAT  ' here, it was 'Tax & VAT Two', but cant show that 'Two' to client, so name 'Two' has been replaced by two spaces
        columns: [
          {
            accessorKey: 'taxAndVATTwoPerProduct',
            header: '',
            Header: (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%' }}
              >
                <TextField
                  key={tenderCostingState?.taxAndVATTwoP ?? 0}
                  defaultValue={tenderCostingState?.taxAndVATTwoP ?? 0}
                  type="number"
                  variant="standard"
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
                    style: { fontSize: '0.8125rem' },
                  }}
                  sx={{ width: '100%' }}
                  onBlur={(e) => handleTaxAndVATTwoPercentBlur(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ),
            size: 160,
            Cell: readonlyNumberCell('taxAndVATTwoPerProduct' as any),
            enableEditing: false,
            Footer: () =>
              ((tenderCostingState as any)?.taxAndVATTwoT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'unitPriceWithTv2SeAgPerProduct',
        header: 'Unit Price(TaxVat2+SE+AG)',
        size: 210,
        Cell: readonlyNumberCell('unitPriceWithTv2SeAgPerProduct'),
        enableEditing: false,
        Footer: () =>
          (tenderCostingState?.unitPriceWithTv2SeAgT ?? 0).toFixed(2),
      },
      {
        accessorKey: 'totalAmountOnePerProduct',
        header: 'Total Amount One',
        size: 180,
        Cell: readonlyNumberCell('totalAmountOnePerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.totalAmountOneT ?? 0).toFixed(2),
      },
      {
        accessorKey: 'totalVatTaxPerProduct',
        header: 'Total Vat & Tax',
        size: 180,
        Cell: readonlyNumberCell('totalVatTaxPerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.totalVatTaxT ?? 0).toFixed(2),
      },
      {
        id: 'bgPgSd',
        header: 'BG&PG&SD',
        size: 150,
        Cell: () => {
          const val = tenderCostingState?.bgAndPgAndSd ?? 0;
          return (
            <div className="w-full py-1 flex justify-between items-center">
              <span style={{ fontSize: '0.8125rem' }}>
                {val === 0 ? '' : val.toFixed(2)}
              </span>
            </div>
          );
        },
        enableEditing: false,
        Footer: () => null,
      },
      {
        header: 'Tax & VAT   ', // 'Tax & VAT   ' here, it was 'Tax & VAT Three', but cant show that 'Three' to client, so name 'Three' has been replaced by three spaces
        columns: [
          {
            accessorKey: 'taxAndVATThreePerProduct',
            header: '',
            Header: (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ width: '100%' }}
              >
                <TextField
                  key={tenderCostingState?.taxAndVATThreeP ?? 0}
                  defaultValue={tenderCostingState?.taxAndVATThreeP ?? 0}
                  type="number"
                  variant="standard"
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: <span style={{ marginLeft: 4 }}>%</span>,
                    style: { fontSize: '0.8125rem' },
                  }}
                  sx={{ width: '100%' }}
                  onBlur={(e) =>
                    handleTaxAndVATThreePercentBlur(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ),
            size: 170,
            Cell: readonlyNumberCell('taxAndVATThreePerProduct' as any),
            enableEditing: false,
            Footer: () =>
              ((tenderCostingState as any)?.taxAndVATThreeT ?? 0).toFixed(2),
          },
        ],
      },
      {
        accessorKey: 'calculatedPrice',
        header: 'Unit Price(Calculated)',
        size: 190,
        Cell: readonlyNumberCell('calculatedPrice'),
        enableEditing: false,
        Footer: () => null,
      },
      {
        accessorKey: 'totalAmountTwoPerProduct',
        header: 'Total Amount Two',
        size: 190,
        Cell: readonlyNumberCell('totalAmountTwoPerProduct'),
        enableEditing: false,
        Footer: () => (tenderCostingState?.totalAmountTwoT ?? 0).toFixed(2),
      },
      {
        accessorKey: 'calculatedProfit',
        header: 'Profit(Calculated)',
        size: 190,
        Cell: readonlyNumberCell('calculatedProfit'),
        enableEditing: false,
        Footer: () => {
          const sum = rows.reduce(
            (acc, r) => acc + (r.calculatedProfit || 0),
            0
          );
          return sum.toFixed(2);
        },
      },
    ];
  }, [rows, tenderCostingState]);

  const table: MRT_TableInstance<TenderCostingDetailRow> =
    useMaterialReactTable({
      columns,
      data: rows,
      state: { columnVisibility, isLoading, columnPinning },
      onColumnVisibilityChange: setColumnVisibility,
      onColumnPinningChange: setColumnPinning,
      layoutMode: 'semantic',
      enableStickyHeader: true,
      enableTableFooter: true,
      enableStickyFooter: true,
      enableRowVirtualization: false,
      enableBottomToolbar: false,
      enablePagination: false,
      enableColumnResizing: true,
      enableColumnPinning: true,
      muiTableContainerProps: ({ table: t }) => ({
        sx: {
          maxHeight: t.getState().isFullScreen
            ? 'calc(100dvh - 6.5rem)'
            : '25rem',
          overflow: 'auto',
          position: 'relative',
        },
      }),
      muiTableFooterProps: {
        sx: {
          position: 'sticky',
          bottom: '0',
          zIndex: 2,
          backgroundColor: accentSoft,
        },
      },
      muiTableFooterCellProps: {
        sx: {
          backgroundColor: accentSoft,
          fontWeight: 800,
          fontSize: '0.8125rem',
          borderTop: '1px solid #e0e0e0',
          borderRight: '1px solid #e0e0e0',
        },
      },
      muiTablePaperProps: {
        elevation: 0,
        sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
      },
      muiTableBodyCellProps: { sx: { fontSize: '0.8125rem', color: '#1c1c1c' } },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          backgroundColor: accentHeader,
          color: '#1c1c1c',
          fontWeight: 800,
        },
      },
      renderToolbarInternalActions: ({ table }) => (
        <>
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <Tooltip title="Download Excel (CSV)">
            <IconButton
              size="small"
              onClick={() => handleExportAllData(table, tenderCostingState)}
              sx={{ ml: 1 }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    });

  const handleTenderChange = (
    selectedItem: ITenderNoComboBox2 | null,
    onChange: (value: any) => void
  ) => {
    onChange(selectedItem);
    setSelectedTender(selectedItem || null);

    if (selectedItem) {
      // load costing
      triggerGetTenderCosting({
        tenderId: selectedItem.procurementTenderId || 0,
      });
    } else {
      setTenderCostingState(null);
    }
  };

  const saveFunct = () => {
    console.log('TenderCostingState ➜', tenderCostingState);

    const tenderCostingStateCopy: TenderCostingState | null = tenderCostingState
      ? JSON.parse(JSON.stringify(tenderCostingState))
      : null;

    let mappedGetTenderCostingDto: GetTenderCostingDto | null = null;

    if (tenderCostingStateCopy) {
      const {
        sumOfUnit,
        sumOfTotalFOB,
        unitCostT,
        unitPriceWithVTT,
        unitPriceWithSeT,
        unitPriceWithAgT,
        unitPriceWithTv2SeAgT,
        totalAmountOneT,
        totalVatTaxT,
        totalAmountTwoT,

        pgBankFinanceChargeA,
        pgTotalYearsA,
        pgPerQtChargeA,
        pgTotalQuarter,
        pgTotalQtChargeA,
        pgTotalQtChargeAWithPgTotalYearsA,
        fixedExpWithPgTotalQtChargeAWithPgTotalYearsA,
        pgValuePerUnit,

        bgValuePerUnit,

        securityDepositA,
        sdBankFinanceChargeA,
        sdTotalYearsA,
        sdValuePerUnit,

        bgAndPgAndSd,

        getTenderCostingDetailDtos,

        ...headerDtoPart
      } = tenderCostingStateCopy;

      const cleanedDetails: GetTenderCostingDetailDto[] =
        getTenderCostingDetailDtos.map(
          ({
            totalFob,
            lc,
            unitCostPerProduct,
            unitPriceWithoutVTOtherExpPerProduct,
            unitPriceWithVTPerProduct,
            unitPriceWithSePerProduct,
            unitPriceWithAgPerProduct,
            unitPriceWithTv2SeAgPerProduct,
            totalAmountOnePerProduct,
            totalVatTaxPerProduct,
            totalAmountTwoPerProduct,
            originalPrice,
            distMarginPercent,
            profitPercent,
            ...detailDtoPart
          }) => {
            const source = detailDtoPart.productSource;
            let price = detailDtoPart.price;

            if (isLpSource(source)) {
              // LOCAL/STOCK: Price column in DB follows edited LP
              price = detailDtoPart.lpPerProduct ?? 0;
            } else if (!isFobSource(source)) {
              // Neither FOB nor LOCAL/STOCK: keep loaded Price unchanged
              price = originalPrice;
            }
            // FOB: price stays as edited FOB value

            return {
              ...detailDtoPart,
              price,
            };
          }
        );

      mappedGetTenderCostingDto = {
        ...(headerDtoPart as Omit<
          GetTenderCostingDto,
          'getTenderCostingDetailDtos'
        >),
        getTenderCostingDetailDtos: cleanedDetails,
      };

      console.log(
        'mappedGetTenderCostingDto(sendingObj) ➜',
        mappedGetTenderCostingDto
      );

      let pcTrackToSave: ICreateBiznessEventPCTrackCommand | null = null;

      if (clickedCardInfo?.biznessEventProcessConfigurationId) {
        pcTrackToSave = {
          eventNo: clickedCardInfo.eventNo,
          performedBy: userInfo.securityUserId,
          startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          note: operationMode === 'edit' ? 'Edited' : 'Added',
          progressPReported: 100,
          originalSequence: clickedCardInfo.sequence,
          nextSequence: clickedCardInfo.sequence + 1,
          complete: false,
          biznessEventProcessConfigurationId:
            clickedCardInfo.biznessEventProcessConfigurationId,
          firstEventNo: clickedCardInfo.firstEventNo,
          locationId:
            clickedCardInfo.eventLocationId || userInfo.locationId || 0,
        };
      }

      const sendingObj: TenderCostingCommandsVM = {
        tenderCostingData: mappedGetTenderCostingDto,
        createBiznessEventPCTrackCommand: pcTrackToSave,
      };

      processTenderCosting(sendingObj);
    }
  };

  // I already have these values in the tenderCostingState
  const summations = {
    quotedAmount: tenderCostingState?.totalAmountOneT ?? 0,
    vatTax: tenderCostingState?.totalVatTaxT ?? 0,
    salesExpense: tenderCostingState?.salesExpenseT ?? 0,
    agExpense: tenderCostingState?.agExpenseT ?? 0,
    delivery: tenderCostingState?.deliveryT ?? 0,
    installation: tenderCostingState?.installationT ?? 0,
    training: tenderCostingState?.trainingT ?? 0,
    pis: tenderCostingState?.preShipmentInspectionT ?? 0,
  };
  // We still use watch just so RHF tracks fields; values are controlled via controllers
  watch(['dateFrom', 'dateTo', 'buyer', 'tenderNo']);

  return (
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <form>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {biznessEventName ?? 'Tender Costing Breakdown'}
              </div>

              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1 mt-5">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-1">
                  {/* Left side: Date range + Customer + Tender No (TenderWon-style) */}
                  <div className="space-y-2">
                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-2">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateFrom"
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <DatePicker
                              label="Date From"
                              inputFormat="DD/MM/YYYY"
                              value={value || null}
                              onChange={(newValue) => onChange(newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ width: '100%', marginTop: 1 }}
                                  InputProps={{
                                    ...params.InputProps,
                                    style: { fontSize: '0.8125rem' },
                                  }}
                                  InputLabelProps={{
                                    ...params.InputLabelProps,
                                    style: { fontSize: '0.875rem' },
                                  }}
                                  variant="standard"
                                  size="small"
                                  error={!!error}
                                  helperText={error ? error.message : null}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name="dateTo"
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <DatePicker
                              label="Date To"
                              inputFormat="DD/MM/YYYY"
                              value={value || null}
                              onChange={(newValue) => onChange(newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ width: '100%', marginTop: 1 }}
                                  InputProps={{
                                    ...params.InputProps,
                                    style: { fontSize: '0.8125rem' },
                                  }}
                                  InputLabelProps={{
                                    ...params.InputLabelProps,
                                    style: { fontSize: '0.875rem' },
                                  }}
                                  variant="standard"
                                  size="small"
                                  error={!!error}
                                  helperText={error ? error.message : null}
                                />
                              )}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>

                    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-2">
                      <Controller
                        name="buyer"
                        control={control}
                        render={({
                          field: { onChange, value, ref },
                          fieldState: { error },
                        }) => (
                          <Autocomplete
                            id="buyer-autocomplete"
                            size="small"
                            options={buyerOptions || []}
                            loading={buyerOptionsAutoCompLoading}
                            value={value || null}
                            onChange={(event, selectedItem) => {
                              setSelectedBuyer(selectedItem);
                              setSelectedTender(null);
                              setTenderOptions([]);
                              onChange(selectedItem);
                              setTenderCostingState(null);
                            }}
                            getOptionLabel={(option: any) =>
                              option ? option.buyerName : ''
                            }
                            isOptionEqualToValue={(
                              option: any,
                              selected: any
                            ) =>
                              option.buyerId === selected?.buyerId &&
                              option.buyerName === selected?.buyerName
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onFocus={() => handleBuyerFocus()}
                                label="Customer"
                                variant="standard"
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputLabelProps={{
                                  ...params.InputLabelProps,
                                  style: { fontSize: '0.875rem' },
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  style: { fontSize: '0.8125rem' },
                                  endAdornment: (
                                    <>
                                      {buyerOptionsAutoCompLoading && (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      )}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                                sx={{ width: '100%', marginTop: 1 }}
                                inputRef={ref}
                              />
                            )}
                          />
                        )}
                      />

                      <TextField
                        label="Sales Person"
                        variant="standard"
                        size="small"
                        value={tenderCostingState?.salesPersonName || ''}
                        sx={{ width: '100%', marginTop: 1 }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
                        }}
                        InputProps={{
                          style: { fontSize: '0.8125rem' },
                          readOnly: true,
                        }}
                      />
                    </div>

                    <Controller
                      name="tenderNo"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          id="tender-autocomplete"
                          size="small"
                          readOnly={
                            !!clickedCardInfo?.biznessEventProcessConfigurationId
                          }
                          options={tenderOptions || []}
                          loading={tenderOptionsAutoCompLoading}
                          value={value || null}
                          onChange={(event, item) =>
                            handleTenderChange(item, onChange)
                          }
                          onBlur={onBlur}
                          getOptionLabel={(option: any) =>
                            option ? option.tenderNo : ''
                          }
                          isOptionEqualToValue={(option: any, selected: any) =>
                            option.tenderNo === selected?.tenderNo &&
                            option.procurementTenderId ===
                              selected?.procurementTenderId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onFocus={() => handleTenderFocus()}
                              label="Tender No"
                              variant="standard"
                              error={!!error}
                              helperText={error ? error.message : null}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                                endAdornment: (
                                  <>
                                    {tenderOptionsAutoCompLoading && (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                              sx={{ width: '100%', marginTop: 1 }}
                              inputRef={ref}
                            />
                          )}
                        />
                      )}
                    />
                    <div className=" h-8 "> </div>
                    {/* hhohohoho */}
                    <div
                      className="border-2 border-spacing-3 grid md:grid-cols-2 grid-cols-1 md:gap-x-2 px-2"
                      style={{ backgroundColor: accentSoft }}
                    >
                      <div>
                        <span className=" text-14 font-semibold">
                          Quoted Amount:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.quotedAmount.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">
                          Vat & Tax:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.vatTax.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">
                          Sales Expense:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.salesExpense.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">AG: </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.agExpense.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">
                          Delivery:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.delivery.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">
                          Installation:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.installation.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">
                          Training:{' '}
                        </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.training.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <span className=" text-14 font-semibold">PIS: </span>
                        <TextField
                          variant="standard"
                          size="small"
                          value={summations.pis.toFixed(2)}
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: '0.8125rem' },
                          }}
                          sx={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right side: existing Costing form (BG/PG/SD etc.) */}
                  <div className="col-span-2">
                    <CostingForm
                      key={
                        tenderCostingState
                          ? `${tenderCostingState.procurementTenderId}-${tenderCostingState.buyerId}`
                          : 'no-tender'
                      }
                      state={tenderCostingState}
                      onFieldBlur={handleHeaderFieldBlur}
                    />
                  </div>
                </div>

                <div className="w-full mt-4 mb-5 modifiedEditTable">
                  <MaterialReactTable table={table} />
                </div>
              </div>

              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="button"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded-md shadow hover:bg-blue-700 active:bg-blue-800 transition"
                    onClick={() => {
                      saveFunct();
                    }}
                    disabled={processTenderCostingIsLoading}
                  >
                    {processTenderCostingIsLoading ? 'Saving...' : 'Save'}
                  </button>

                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold text-sm rounded-md shadow hover:bg-gray-400 active:bg-gray-500 transition"
                    onClick={() => {
                      modalPageOpenerClose?.();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenderCosting;
