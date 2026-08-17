// /* eslint-disable import/prefer-default-export */
// /* eslint-disable @typescript-eslint/no-use-before-define */
// // CostingForm.tsx
// import * as React from 'react';
// import { Box, TextField } from '@mui/material';

// export const CostingForm: React.FC = () => {
//   const commonInputProps = {
//     disableUnderline: true,
//     sx: {
//       fontSize: 12,
//       paddingY: 0,
//       '.MuiInputBase-input': {
//         padding: 0,
//       },
//     },
//   } as const;

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
//               {/* BG row */}
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
//               <HeaderCell className="text-right">BDT 1,041,718</HeaderCell>

//               {/* PG Amount */}
//               <Cell label="PG Amount">
//                 <span className="font-semibold">10%</span>
//               </Cell>
//               <PlainCell>BDT 104,172</PlainCell>

//               {/* PG Margin */}
//               <Cell label="PG Margin">
//                 <span className="font-semibold">10%</span>
//               </Cell>
//               <PlainCell>BDT 10,417</PlainCell>

//               {/* BFC(Y) */}
//               <Cell label="BFC(Y)">
//                 <span className="font-semibold">13.50%</span>
//               </Cell>
//               <PlainCell>BDT 1,406</PlainCell>

//               {/* Total Years */}
//               <Cell label="Tota Years">
//                 <span className="font-semibold">3</span>
//               </Cell>
//               <PlainCell>BDT 4,219</PlainCell>

//               {/* PER QTC */}
//               <Cell label="PER QTC">
//                 <span className="text-blue-500 font-semibold">0.50%</span>
//               </Cell>
//               <PlainCell>BDT 520.9</PlainCell>

//               {/* TOTAL QTC */}
//               <Cell label="TOTAL QTC">
//                 <span className="font-semibold">13</span>
//               </Cell>
//               <PlainCell>BDT 6,771.2</PlainCell>

//               {/* Row with only BDT 10,990.1 */}
//               <Cell label="" />
//               <PlainCell>BDT 10,990.1</PlainCell>

//               {/* Fixed Exp. row */}
//               <Cell label="Fixed Exp." />
//               <PlainCell>2000</PlainCell>

//               {/* Row with BDT 12,990.1 */}
//               <Cell label="" />
//               <PlainCell className="font-bold">BDT 12,990.1</PlainCell>

//               {/* QTY row */}
//               <Cell label="QTY" />
//               <PlainCell>62</PlainCell>

//               {/* PG Value PU row */}
//               <Cell label="PG Value PU" />
//               <PlainCell>BDT 209.5</PlainCell>
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

//       {/* Bottom total row */}
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
