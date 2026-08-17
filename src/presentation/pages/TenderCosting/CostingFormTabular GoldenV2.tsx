// /* eslint-disable react/no-unused-prop-types */
// /* eslint-disable import/prefer-default-export */
// /* eslint-disable @typescript-eslint/no-use-before-define */
// // CostingFormTabular.tsx
// import * as React from 'react';
// import { Box, TextField } from '@mui/material';

// type CostingFormSummary = {
//   bgAmount: number;
//   sumOfUnit: number;

//   totalAmountOneT: number;

//   performanceGuaranteeP: number;
//   performanceGuaranteeA: number;

//   pgMarginP: number;
//   pgMarginAmount: number;

//   pgBankFinanceChargeP: number;
//   pgBankFinanceChargeA: number;

//   pgTotalYears: number;
//   pgTotalYearsA: number;

//   pgPerQtChargeP: number;
//   pgPerQtChargeA: number;

//   pgTotalQuarter: number;
//   pgTotalQtChargeA: number;
//   pgTotalQtChargeAWithPgTotalYearsA: number;

//   pgFixedExpense: number;
//   fixedExpWithPgTotalQtChargeAWithPgTotalYearsA: number;

//   pgValuePerUnit: number;
// };

// type CostingFormChangeHandlers = {
//   onPerformanceGuaranteePChange: (raw: string) => void;
//   onPgMarginPChange: (raw: string) => void;
//   onPgBankFinanceChargePChange: (raw: string) => void;
//   onPgTotalYearsChange: (raw: string) => void;
//   onPgPerQtChargePChange: (raw: string) => void;
//   onPgFixedExpenseChange: (raw: string) => void;
// };

// type CostingFormProps = {
//   summary: CostingFormSummary;
//   onChange: CostingFormChangeHandlers;
// };

// export const CostingForm: React.FC<CostingFormProps> = ({
//   summary,
//   onChange,
// }) => {
//   const commonInputProps = {
//     disableUnderline: true,
//     sx: {
//       fontSize: 12,
//       paddingY: 0,
//       '.MuiInputBase-input': {
//         padding: 0,
//         textAlign: 'right',
//       },
//     },
//   } as const;

//   const fmtMoney = (n: number) =>
//     `BDT ${Number.isFinite(n) ? n.toFixed(1) : '0.0'}`;

//   return (
//     <Box className="p-2 sm:p-4 bg-white border border-gray-300 shadow-sm max-w-full mx-auto">
//       <div className="overflow-x-auto">
//         {/* Top 3 blocks: BG / PG / SD */}
//         <div className="min-w-[640px] md:min-w-0 grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300 text-[11px] sm:text-xs">
//           {/* ------------ BG ------------- */}
//           <div className="border-b md:border-b-0 md:border-r border-gray-300">
//             <div className="bg-[#f7c398] text-center font-bold py-1 border-b border-gray-300">
//               BG
//             </div>
//             <div className="grid grid-cols-[80px_1fr]">
//               {/* BG row (still hard-coded for now) */}
//               <Cell label="BG">
//                 <TextField
//                   variant="standard"
//                   fullWidth
//                   defaultValue={3500}
//                   InputProps={commonInputProps}
//                 />
//               </Cell>

//               {/* QTY row */}
//               <Cell label="QTY">
//                 <TextField
//                   variant="standard"
//                   fullWidth
//                   defaultValue={62}
//                   InputProps={commonInputProps}
//                 />
//               </Cell>

//               {/* Per-unit row */}
//               <Cell label="">
//                 <TextField
//                   variant="standard"
//                   fullWidth
//                   defaultValue={56.4516129}
//                   InputProps={commonInputProps}
//                 />
//               </Cell>
//             </div>
//           </div>

//           {/* ------------ PG ------------- */}
//           <div className="border-b md:border-b-0 md:border-r border-gray-300">
//             <div className="bg-[#f9e39a] text-center font-bold py-1 border-b border-gray-300">
//               PG
//             </div>

//             <div className="grid grid-cols-[120px_70px_1fr]">
//               {/* Total row */}
//               <HeaderCell>Total</HeaderCell>
//               <HeaderCell />
//               <HeaderCell className="text-right">
//                 {fmtMoney(summary.totalAmountOneT)}
//               </HeaderCell>

//               {/* PG Amount */}
//               <Cell label="PG Amount">
//                 <div className="flex items-center justify-end gap-1 w-full">
//                   <TextField
//                     key={summary.performanceGuaranteeP}
//                     variant="standard"
//                     type="number"
//                     fullWidth
//                     defaultValue={summary.performanceGuaranteeP}
//                     InputProps={commonInputProps}
//                     onBlur={(e) =>
//                       onChange.onPerformanceGuaranteePChange(e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         (e.target as HTMLInputElement).blur();
//                       }
//                     }}
//                   />
//                   <span>%</span>
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.performanceGuaranteeA)}</PlainCell>

//               {/* PG Margin */}
//               <Cell label="PG Margin">
//                 <div className="flex items-center justify-end gap-1 w-full">
//                   <TextField
//                     key={summary.pgMarginP}
//                     variant="standard"
//                     type="number"
//                     fullWidth
//                     defaultValue={summary.pgMarginP}
//                     InputProps={commonInputProps}
//                     onBlur={(e) => onChange.onPgMarginPChange(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         (e.target as HTMLInputElement).blur();
//                       }
//                     }}
//                   />
//                   <span>%</span>
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgMarginAmount)}</PlainCell>

//               {/* BFC(Y) */}
//               <Cell label="BFC(Y)">
//                 <div className="flex items-center justify-end gap-1 w-full">
//                   <TextField
//                     key={summary.pgBankFinanceChargeP}
//                     variant="standard"
//                     type="number"
//                     fullWidth
//                     defaultValue={summary.pgBankFinanceChargeP}
//                     InputProps={commonInputProps}
//                     onBlur={(e) =>
//                       onChange.onPgBankFinanceChargePChange(e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         (e.target as HTMLInputElement).blur();
//                       }
//                     }}
//                   />
//                   <span>%</span>
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgBankFinanceChargeA)}</PlainCell>

//               {/* Total Years */}
//               <Cell label="Tota Years">
//                 <TextField
//                   key={summary.pgTotalYears}
//                   variant="standard"
//                   type="number"
//                   fullWidth
//                   defaultValue={summary.pgTotalYears}
//                   InputProps={commonInputProps}
//                   onBlur={(e) => onChange.onPgTotalYearsChange(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgTotalYearsA)}</PlainCell>

//               {/* PER QTC */}
//               <Cell label="PER QTC">
//                 <div className="flex items-center justify-end gap-1 w-full">
//                   <TextField
//                     key={summary.pgPerQtChargeP}
//                     variant="standard"
//                     type="number"
//                     fullWidth
//                     defaultValue={summary.pgPerQtChargeP}
//                     InputProps={commonInputProps}
//                     onBlur={(e) =>
//                       onChange.onPgPerQtChargePChange(e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         (e.target as HTMLInputElement).blur();
//                       }
//                     }}
//                   />
//                   <span>%</span>
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgPerQtChargeA)}</PlainCell>

//               {/* TOTAL QTC */}
//               <Cell label="TOTAL QTC">
//                 <div className="flex items-center justify-end w-full">
//                   {summary.pgTotalQuarter}
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgTotalQtChargeA)}</PlainCell>

//               {/* Row with only BDT (Qt + Years) */}
//               <Cell label="" />
//               <PlainCell>
//                 {fmtMoney(summary.pgTotalQtChargeAWithPgTotalYearsA)}
//               </PlainCell>

//               {/* Fixed Exp. row */}
//               <Cell label="Fixed Exp.">
//                 <TextField
//                   key={summary.pgFixedExpense}
//                   variant="standard"
//                   type="number"
//                   fullWidth
//                   defaultValue={summary.pgFixedExpense}
//                   InputProps={commonInputProps}
//                   onBlur={(e) =>
//                     onChange.onPgFixedExpenseChange(e.target.value)
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       (e.target as HTMLInputElement).blur();
//                     }
//                   }}
//                 />
//               </Cell>
//               <PlainCell>
//                 {fmtMoney(
//                   summary.fixedExpWithPgTotalQtChargeAWithPgTotalYearsA
//                 )}
//               </PlainCell>

//               {/* Row with PG Value PU total */}
//               <Cell label="QTY">
//                 <div className="flex items-center justify-end w-full">
//                   {summary.sumOfUnit}
//                 </div>
//               </Cell>
//               <PlainCell>{fmtMoney(summary.pgValuePerUnit)}</PlainCell>
//             </div>
//           </div>

//           {/* ------------ SD ------------- */}
//           <div className="border-b md:border-b-0 border-gray-300">
//             <div className="bg-[#f7c398] text-center font-bold py-1 border-b border-gray-300">
//               SD
//             </div>

//             <div className="grid grid-cols-[120px_70px_1fr]">
//               {/* Total row */}
//               <HeaderCell>Total</HeaderCell>
//               <HeaderCell />
//               <HeaderCell className="text-right">BDT 228,520</HeaderCell>

//               {/* SD Amount */}
//               <Cell label="SD AMOUNT">
//                 <span className="font-semibold">5.00%</span>
//               </Cell>
//               <PlainCell>11425.99985</PlainCell>

//               {/* BFC(Per Year) */}
//               <Cell label="BFC(Per Year)">
//                 <span className="font-semibold">13.50%</span>
//               </Cell>
//               <PlainCell>BDT 1,543</PlainCell>

//               {/* No. Year */}
//               <Cell label="N0. Year">
//                 <span className="font-semibold">2</span>
//               </Cell>
//               <PlainCell>BDT 3,085</PlainCell>

//               {/* No. of Unit */}
//               <Cell label="No. of Unit">
//                 <span className="font-semibold">62</span>
//               </Cell>
//               <PlainCell>BDT 49.8</PlainCell>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom total row (kept static for now) */}
//       <Box className="mt-2 bg-[#ffc800] py-2 text-center font-semibold text-xs sm:text-sm tracking-wide">
//         Total BG + PG + SD &nbsp;&nbsp; BDT 315.7
//       </Box>
//     </Box>
//   );
// };

// // ---------- Small helper components ----------

// type CellProps = {
//   label?: string;
//   children?: React.ReactNode;
//   className?: string;
// };

// const baseCell =
//   'border-t border-gray-300 px-2 py-1 flex items-center text-[11px] sm:text-xs min-h-[26px]';

// const Cell: React.FC<CellProps> = ({ label, children }) => (
//   <>
//     <div className={baseCell}>{label}</div>
//     <div className={`${baseCell} border-l justify-end`}>{children}</div>
//   </>
// );

// const PlainCell: React.FC<CellProps> = ({ children, className }) => (
//   <div className={`${baseCell} border-l justify-end ${className || ''}`}>
//     {children}
//   </div>
// );

// const HeaderCell: React.FC<CellProps> = ({ children, className }) => (
//   <div
//     className={`border-b border-gray-300 px-2 py-1 text-[11px] sm:text-xs font-semibold ${
//       className || ''
//     }`}
//   >
//     {children}
//   </div>
// );
