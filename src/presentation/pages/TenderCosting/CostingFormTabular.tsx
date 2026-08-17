/* eslint-disable react/no-unused-prop-types */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { Box, TextField } from '@mui/material';
import type { TenderCostingState } from './TenderCosting'; // adjust import path if needed

type CostingFormProps = {
  state: TenderCostingState | null;
  onFieldBlur: (field: keyof TenderCostingState, raw: string) => void;
};

const fmt = (v: number | null | undefined): string =>
  v == null ? '' : v.toFixed(2);

export const CostingForm: React.FC<CostingFormProps> = ({
  state,
  onFieldBlur,
}) => {
  const commonInputProps = {
    disableUnderline: true,
    sx: {
      fontSize: 12,
      paddingY: 0,
      '.MuiInputBase-input': {
        padding: 0,
      },
    },
  } as const;

  const sumOfUnit = state?.sumOfUnit ?? 0;

  const handleEnterBlur = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Box className="p-2 sm:p-4 bg-white border border-gray-300 shadow-sm max-w-full mx-auto">
      <div className="overflow-x-auto">
        {/* Top 3 blocks: BG / PG / SD */}
        <div className="min-w-[640px] md:min-w-0 grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300 text-[11px] sm:text-xs">
          {/* ------------ BG ------------- */}
          <div className="border-b md:border-b-0 md:border-r border-gray-300">
            <div className="bg-[#ced1f2] text-center font-bold py-1 border-b border-gray-300">
              BG
            </div>

            <div className="grid grid-cols-[80px_1fr]">
              {/* BG row */}
              <Cell label="BG">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.bgAmount ?? ''}
                  InputProps={commonInputProps}
                  type="number"
                  onBlur={(e) => onFieldBlur('bgAmount', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>

              {/* QTY row */}
              <Cell label="QTY">
                <span className="text-right w-full">
                  {sumOfUnit ? sumOfUnit.toFixed(2) : ''}
                </span>
              </Cell>

              {/* Per-unit row — LAST ROW → ADD BORDER-B */}
              <Cell label="" lastRow>
                <span className="text-right w-full">
                  {fmt(state?.bgValuePerUnit)}
                </span>
              </Cell>
            </div>
          </div>

          {/* ------------ PG ------------- */}
          <div className="border-b md:border-b-0 md:border-r border-gray-300">
            <div className="bg-[#e3e3fc] text-center font-bold py-1 border-b border-gray-300">
              PG
            </div>

            <div className="grid grid-cols-[120px_70px_1fr]">
              {/* Total row */}
              <HeaderCell>Total</HeaderCell>
              <HeaderCell />
              <HeaderCell className="text-right">
                BDT {fmt(state?.totalAmountOneT ?? 0)}
              </HeaderCell>

              {/* PG Amount */}
              <Cell label="PG Amount">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.performanceGuaranteeP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1">%</span>,
                  }}
                  onBlur={(e) =>
                    onFieldBlur('performanceGuaranteeP', e.target.value)
                  }
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.performanceGuaranteeA)}</PlainCell>

              {/* PG Margin */}
              <Cell label="PG Margin">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.pgMarginP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1">%</span>,
                  }}
                  onBlur={(e) => onFieldBlur('pgMarginP', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.pgMarginAmount)}</PlainCell>

              {/* BFC(Y) */}
              <Cell label="BFC(Y)">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.pgBankFinanceChargeP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1">%</span>,
                  }}
                  onBlur={(e) =>
                    onFieldBlur('pgBankFinanceChargeP', e.target.value)
                  }
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.pgBankFinanceChargeA)}</PlainCell>

              {/* Total Years */}
              <Cell label="Total Years">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.pgTotalYears ?? ''}
                  type="number"
                  InputProps={commonInputProps}
                  onBlur={(e) => onFieldBlur('pgTotalYears', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.pgTotalYearsA)}</PlainCell>

              {/* PER QTC */}
              <Cell label="PER QTC">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.pgPerQtChargeP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1 font-semibold">%</span>,
                  }}
                  onBlur={(e) => onFieldBlur('pgPerQtChargeP', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.pgPerQtChargeA)}</PlainCell>

              {/* TOTAL QTC */}
              <Cell label="TOTAL QTC">
                <span className="font-semibold">
                  {state?.pgTotalQuarter ?? ''}
                </span>
              </Cell>
              <PlainCell>BDT {fmt(state?.pgTotalQtChargeA)}</PlainCell>

              {/* BDT total */}
              <Cell label="" />
              <PlainCell>
                BDT {fmt(state?.pgTotalQtChargeAWithPgTotalYearsA)}
              </PlainCell>

              {/* Fixed Exp. */}
              <Cell label="Fixed Exp.">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.pgFixedExpense ?? ''}
                  type="number"
                  InputProps={commonInputProps}
                  onBlur={(e) => onFieldBlur('pgFixedExpense', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>
                BDT {fmt(state?.fixedExpWithPgTotalQtChargeAWithPgTotalYearsA)}
              </PlainCell>

              {/* QTY */}
              <Cell label="QTY" />
              <PlainCell>{sumOfUnit ? sumOfUnit.toFixed(2) : ''}</PlainCell>

              {/* PG Value PU — LAST ROW */}
              <Cell label="PG Value PU" lastRow />
              <PlainCell lastRow>BDT {fmt(state?.pgValuePerUnit)}</PlainCell>
            </div>
          </div>

          {/* ------------ SD ------------- */}
          <div className="border-b md:border-b-0 border-gray-300">
            <div className="bg-[#ced1f2] text-center font-bold py-1 border-b border-gray-300">
              SD
            </div>

            <div className="grid grid-cols-[120px_70px_1fr]">
              {/* Total row */}
              <HeaderCell>Total</HeaderCell>
              <HeaderCell />
              <HeaderCell className="text-right">
                <div className="flex justify-end items-center">
                  <span className="mr-1">BDT</span>
                  <TextField
                    variant="standard"
                    fullWidth
                    defaultValue={state?.securityDeposit ?? ''}
                    type="number"
                    InputProps={commonInputProps}
                    onBlur={(e) =>
                      onFieldBlur('securityDeposit', e.target.value)
                    }
                    onKeyDown={handleEnterBlur}
                  />
                </div>
              </HeaderCell>

              {/* SD Amount */}
              <Cell label="SD AMOUNT">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.securityDepositP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1">%</span>,
                  }}
                  onBlur={(e) =>
                    onFieldBlur('securityDepositP', e.target.value)
                  }
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>{fmt(state?.securityDepositA)}</PlainCell>

              {/* BFC Per Year */}
              <Cell label="BFC(Per Year)">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.sdBankFinanceChargeP ?? ''}
                  type="number"
                  InputProps={{
                    ...commonInputProps,
                    endAdornment: <span className="ml-1">%</span>,
                  }}
                  onBlur={(e) =>
                    onFieldBlur('sdBankFinanceChargeP', e.target.value)
                  }
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.sdBankFinanceChargeA)}</PlainCell>

              {/* No. Year */}
              <Cell label="N0. Year">
                <TextField
                  variant="standard"
                  fullWidth
                  defaultValue={state?.sdTotalYears ?? ''}
                  type="number"
                  InputProps={commonInputProps}
                  onBlur={(e) => onFieldBlur('sdTotalYears', e.target.value)}
                  onKeyDown={handleEnterBlur}
                />
              </Cell>
              <PlainCell>BDT {fmt(state?.sdTotalYearsA)}</PlainCell>

              {/* No. of Unit — LAST ROW */}
              <Cell label="No. of Unit" lastRow>
                <span className="font-semibold">
                  {sumOfUnit ? sumOfUnit.toFixed(2) : ''}
                </span>
              </Cell>
              <PlainCell lastRow>BDT {fmt(state?.sdValuePerUnit)}</PlainCell>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom total row */}
      <Box className="mt-2 bg-[#ced1f2] py-2 text-center font-semibold text-xs sm:text-sm tracking-wide border border-gray-300">
        Total BG + PG + SD &nbsp;&nbsp; BDT {fmt(state?.bgAndPgAndSd ?? 0)}
      </Box>
    </Box>
  );
};

// ---------- Components with border-b support ----------

type CellProps = {
  label?: string;
  children?: React.ReactNode;
  className?: string;
  lastRow?: boolean;
};

const baseCell =
  'border-t border-gray-300 px-2 py-1 flex items-center text-[11px] sm:text-xs min-h-[26px]';

const Cell: React.FC<CellProps> = ({ label, children, lastRow }) => (
  <>
    <div className={`${baseCell} ${lastRow ? 'border-b' : ''}`}>{label}</div>
    <div
      className={`${baseCell} border-l justify-end ${
        lastRow ? 'border-b' : ''
      }`}
    >
      {children}
    </div>
  </>
);

const PlainCell: React.FC<CellProps> = ({ children, className, lastRow }) => (
  <div
    className={`${baseCell} border-l justify-end ${lastRow ? 'border-b' : ''} ${
      className || ''
    }`}
  >
    {children}
  </div>
);

const HeaderCell: React.FC<CellProps> = ({ children, className }) => (
  <div
    className={`border-b border-gray-300 px-2 py-1 text-[11px] sm:text-xs font-semibold ${
      className || ''
    }`}
  >
    {children}
  </div>
);
