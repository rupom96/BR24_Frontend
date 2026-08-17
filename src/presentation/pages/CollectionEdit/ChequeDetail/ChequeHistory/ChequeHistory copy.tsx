// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-param-reassign */
// import React, { useMemo, useRef, useState } from 'react';
// import { Box, IconButton, Modal, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import UndoIcon from '@mui/icons-material/Undo';
// import {
//   MaterialReactTable,
//   MRT_ColumnDef,
//   MRT_RowSelectionState,
//   MRT_TableInstance,
//   MRT_ToggleFiltersButton,
//   MRT_ToggleFullScreenButton,
//   MRT_ToggleGlobalFilterButton,
//   MRT_ShowHideColumnsButton,
//   MRT_Virtualizer,
//   useMaterialReactTable,
// } from 'material-react-table';
// import dayjs from 'dayjs';
// import { IChequeHistory } from '../../../../../domain/interfaces/CollectionInterface';

// interface ChequeHistoryProps {
//   open: boolean;
//   onClose: () => void;

//   // the history rows you want to show in grid
//   histories: IChequeHistory[];

//   // when user clicks UNDO button from toolbar
//   onUndo: (targetHistory: IChequeHistory) => void;

//   // optional title info
//   title?: string;
// }

// const ChequeHistory: React.FC<ChequeHistoryProps> = ({
//   open,
//   onClose,
//   histories,
//   onUndo,
//   title = 'Cheque History',
// }) => {
//   const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
//   const [hoverFromIndex, setHoverFromIndex] = useState<number | null>(null);

//   // We need a stable table ref to read visible row order
//   const tableRef = useRef<MRT_TableInstance<IChequeHistory> | null>(null);

//   const columns = useMemo<MRT_ColumnDef<IChequeHistory>[]>(
//     () => [
//       {
//         accessorKey: 'treatment',
//         header: 'Status',
//         size: 80,
//       },
//       {
//         accessorKey: 'treatmentDate',
//         header: 'Status Date',
//         size: 140,
//         Cell: ({ cell }) => {
//           const v = cell.getValue<string>();
//           return v ? dayjs(v).format('DD/MM/YYYY') : '';
//         },
//       },
//       {
//         accessorKey: 'chequeNo',
//         header: 'Cheque No',
//         size: 140,
//       },
//       {
//         accessorKey: 'bankName',
//         header: 'Bank Name',
//         size: 80,
//       },
//       {
//         accessorKey: 'sendBankName',
//         header: 'Send Bank',
//         size: 100,
//       },
//       {
//         accessorKey: 'dateOfEntry',
//         header: 'Entry Date',
//         size: 140,
//         Cell: ({ cell }) => {
//           const v = cell.getValue<string>();
//           return v ? dayjs(v).format('DD/MM/YYYY') : '';
//         },
//       },
//       {
//         accessorKey: 'enteredBy',
//         header: 'Entered By',
//         size: 90,
//       },
//     ],
//     []
//   );

//   // -----------------------------
//   // Selection cascading behavior:
//   // - when user selects a row -> all rows under it become selected too
//   // - when user unselects a row -> that row & rows under become unselected
//   // -----------------------------
//   const cascadeSelectionFromVisibleIndex = (
//     visibleIndex: number,
//     shouldSelect: boolean
//   ) => {
//     const table = tableRef.current;
//     if (!table) return;

//     const visibleRows = table.getRowModel().rows; // filtered+sorted visible order
//     const nextSelection: MRT_RowSelectionState = { ...rowSelection };

//     for (let i = visibleIndex; i < visibleRows.length; i += 1) {
//       const rid = visibleRows[i].id;
//       if (shouldSelect) nextSelection[rid] = true;
//       else delete nextSelection[rid];
//     }

//     setRowSelection(nextSelection);
//   };

//   const getUndoTarget = (): IChequeHistory | null => {
//     const table = tableRef.current;
//     if (!table) return null;

//     const visibleRows = table.getRowModel().rows;
//     if (!visibleRows.length) return null;

//     // find the FIRST selected row in visible order (top-most)
//     for (let i = 0; i < visibleRows.length; i += 1) {
//       const rid = visibleRows[i].id;
//       if (rowSelection[rid]) {
//         return visibleRows[i].original;
//       }
//     }
//     return null;
//   };

//   // -----------------------------
//   // Hover cascading behavior:
//   // - when hovering a row -> that row + rows under it show hover style
//   // -----------------------------
//   const isRowInHoverRange = (rowIndex: number): boolean => {
//     if (hoverFromIndex === null) return false;
//     return rowIndex >= hoverFromIndex;
//   };

//   // virtualization ref
//   const rowVirtualizerInstanceRef =
//     useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

//   const table = useMaterialReactTable({
//     columns,
//     data: histories || [],
//     enableRowSelection: true,
//     enableMultiRowSelection: true,
//     enableSelectAll: false,

//     state: { rowSelection },
//     onRowSelectionChange: setRowSelection,

//     enablePagination: false,
//     enableBottomToolbar: false,
//     enableColumnResizing: true,
//     enableRowVirtualization: true,
//     rowVirtualizerInstanceRef,
//     rowVirtualizerOptions: { overscan: 10 },

//     layoutMode: 'grid',
//     initialState: { density: 'compact' },

//     muiTablePaperProps: {
//       elevation: 0,
//       sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
//     },

//     muiTableHeadCellProps: {
//       sx: {
//         borderRight: '1px solid #e0e0e0',
//         borderTop: '1px solid #e0e0e0',
//         fontSize: '13px',
//         whiteSpace: 'nowrap',
//         backgroundColor: '#ECEFF9',
//         color: '#1c1c1c',
//         fontWeight: '800',
//       },
//     },

//     muiTableBodyCellProps: {
//       sx: {
//         fontSize: '13px',
//       },
//     },

//     //  Cascade hover (row + below)
//     muiTableBodyRowProps: ({ row }) => ({
//       onMouseEnter: () => setHoverFromIndex(row.index),
//       onMouseLeave: () => setHoverFromIndex(null),
//       sx: {
//         cursor: 'pointer',
//         ...(isRowInHoverRange(row.index) ? { backgroundColor: '#f5f7ff' } : {}),
//       },
//     }),

//     //  Cascade selection on checkbox click (row + below)
//     muiSelectCheckboxProps: ({ row }) => ({
//       onChange: (e) => {
//         const checked = (e.target as HTMLInputElement).checked;
//         cascadeSelectionFromVisibleIndex(row.index, checked);
//       },
//     }),

//     // store table instance to read visible rows order
//     onStateChange: (updater) => {
//       // let MRT handle internal updates, we only keep reference
//       // (no need to do anything here)
//     },

//     renderToolbarInternalActions: ({ table: t }) => {
//       // keep table ref
//       tableRef.current = t;

//       const undoTarget = getUndoTarget();
//       const undoDisabled = !undoTarget;

//       return (
//         <>
//           <MRT_ToggleGlobalFilterButton table={t} />
//           <MRT_ShowHideColumnsButton table={t} />
//           <MRT_ToggleFullScreenButton table={t} />
//           <MRT_ToggleFiltersButton table={t} />

//           <Tooltip title={undoDisabled ? 'Select a row to UNDO' : 'UNDO'}>
//             <span>
//               <IconButton
//                 onClick={() => {
//                   const target = getUndoTarget();
//                   if (!target) return;
//                   onUndo(target);
//                 }}
//                 disabled={undoDisabled}
//                 size="small"
//                 sx={{ ml: 1 }}
//               >
//                 <UndoIcon />
//               </IconButton>
//             </span>
//           </Tooltip>
//         </>
//       );
//     },
//   });

//   // keep latest table ref (important when modal opens first time)
//   tableRef.current = table;

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute' as const,
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '80vw',
//           maxWidth: 1100,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 2,
//           borderRadius: 2,
//         }}
//       >
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <IconButton size="small" onClick={onClose}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </div>

//         <div className="modifiedEditTable">
//           <MaterialReactTable table={table} />
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// export default ChequeHistory;
