// /* eslint-disable react/jsx-no-duplicate-props */
// /* eslint-disable no-plusplus */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable no-param-reassign */
// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// import {
//   Autocomplete,
//   Box,
//   IconButton,
//   Modal,
//   Popper,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import CloseIcon from '@mui/icons-material/Close';
// import UndoIcon from '@mui/icons-material/Undo';
// import {
//   MaterialReactTable,
//   MRT_ColumnDef,
//   MRT_ShowHideColumnsButton,
//   MRT_SortingState,
//   MRT_TableInstance,
//   MRT_ToggleFiltersButton,
//   MRT_ToggleFullScreenButton,
//   MRT_ToggleGlobalFilterButton,
//   MRT_Virtualizer,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { toast } from 'react-toastify';
// import { ExportToCsv } from 'export-to-csv';
// import { Delete } from '@mui/icons-material';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { useGetProductByCompanyProductGroupIdQuery } from '../../../../infrastructure/api/ProductApiSlice';

// import {
//   IChequeDetailInfo,
//   IChequeHistory,
//   ICollectionInfo,
//   IDeleteChequeAWBCommand,
//   IDeleteChequeDetailCommand,
//   IDeleteChequeHistoryCommand,
// } from '../../../../domain/interfaces/CollectionInterface';
// import { useLazyGetChequeDetailByCollectionIdQuery } from '../../../../infrastructure/api/CollectionApiSlice';
// import { useGetBanksComboOptionsQuery } from '../../../../infrastructure/api/GetBanksForChequeBookApiSlice';
// import ChequeHistory from './ChequeHistory/ChequeHistory';

// // import ChequeHistory from './ChequeHistory';

// interface ChequeDetailProps {
//   collectionGrid: ICollectionInfo[];
//   setCollectionGrid: React.Dispatch<React.SetStateAction<any[]>>;

//   chequeDetailRows: IChequeDetailInfo[];
//   setChequeDetailRows: React.Dispatch<React.SetStateAction<any[]>>;

//   deletedChequeDetailRows: IDeleteChequeDetailCommand[];
//   setDeletedChequeDetailRows: React.Dispatch<React.SetStateAction<any[]>>;
//   detailEditModalInfo: any;
//   setDetailEditModalInfo: React.Dispatch<React.SetStateAction<any[]>>;
//   handleDetailEditModalClose: () => void;
// }

// const ChequeDetail: React.FC<ChequeDetailProps> = ({
//   collectionGrid,
//   setCollectionGrid,
//   chequeDetailRows,
//   setChequeDetailRows,
//   deletedChequeDetailRows,
//   setDeletedChequeDetailRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
//   handleDetailEditModalClose,
// }) => {
//   const { control } = useForm({ mode: 'onBlur' });

//   const [chequeDetailGrid, setChequeDetailGrid] = useState<IChequeDetailInfo[]>(
//     []
//   );
//   const [chequeDetailGridPrev, setChequeDetailGridPrev] = useState<
//     IChequeDetailInfo[]
//   >([]);

//   const [deletedRowChequeDetail, setDeletedRowChequeDetail] = useState<
//     IDeleteChequeDetailCommand[]
//   >([]);

//   const [deletedChequeHistoryRows, setDeletedChequeHistoryRows] = useState<
//     IDeleteChequeHistoryCommand[]
//   >([]);

//   const [deletedChequeAWBRows, setDeletedChequeAWBRows] = useState<
//     IDeleteChequeAWBCommand[]
//   >([]);

//   const [columnVisibility, setColumnVisibility] = useState<any>([]);
//   const [isChequeDetailGridLoading, setIsChequeDetailGridLoading] =
//     useState(true);
//   const [sortingChequeDetailGrid, setSortingChequeDetailGrid] =
//     useState<MRT_SortingState>([]);

//   // new: ChequeHistory modal state
//   const [chequeHistoryOpen, setChequeHistoryOpen] = useState(false);
//   const [chequeHistoryRows, setChequeHistoryRows] = useState<IChequeHistory[]>(
//     []
//   );
//   const [chequeHistoryTitle, setChequeHistoryTitle] = useState<string>('');

//   let userInfo: any;
//   const jsonUserInfo = localStorage.getItem('userInfo');
//   if (jsonUserInfo) userInfo = JSON.parse(jsonUserInfo);

//   const [
//     triggerGetChequeDetailInfo,
//     {
//       data: chequeDetailInfoData,
//       error: chequeDetailInfoError,
//       isError: chequeDetailInfoIsError,
//       isSuccess: chequeDetailInfoIsSuccess,
//       isLoading: chequeDetailInfoIsLoading,
//       isFetching: chequeDetailInfoIsFetching,
//     },
//   ] = useLazyGetChequeDetailByCollectionIdQuery();

//   useEffect(() => {
//     const chequeDetailRowsCopy: IChequeDetailInfo[] = JSON.parse(
//       JSON.stringify(chequeDetailRows)
//     );
//     const existingChequeDetailRows = chequeDetailRowsCopy.filter(
//       (row) => row.collectionId === detailEditModalInfo?.collectionId
//     );
//     const existingChequeDetailDeletedRows = deletedChequeDetailRows.filter(
//       (row) => row.collectionId === detailEditModalInfo?.collectionId
//     );

//     if (chequeDetailInfoIsError) {
//       toast.error(
//         'Something wrong from backend while fetching chequeDetailInfoData, see console!'
//       );
//       console.log(chequeDetailInfoError);

//       const data: IChequeDetailInfo[] = [];
//       while (data.length < 10) {
//         data.push({
//           chequeDetailId: '',
//           collectionId: '',
//           chequeNo: '',
//           bankId: null,
//           bankName: '',
//           chequeDate: '',
//           chequeAmount: null,
//           cqdCollected: null,
//           sendDate: '',
//           honorDate: null,
//           date: null,
//           dateOfEntry: '',
//           sendBankId: null,
//           sendBankName: '',
//           disreason: null,
//           remarks: null,
//           chequeHistories: [],
//           chequeAWBs: [],
//         } as any);
//       }
//       setChequeDetailGrid([...data]);
//       setChequeDetailGridPrev([]);
//       setIsChequeDetailGridLoading(false);
//     }

//     if (
//       (existingChequeDetailRows.length ||
//         existingChequeDetailDeletedRows.length) &&
//       chequeDetailInfoIsSuccess &&
//       typeof window !== 'undefined' &&
//       !chequeDetailInfoIsLoading &&
//       !chequeDetailInfoIsError &&
//       !chequeDetailInfoIsFetching
//     ) {
//       const data: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...existingChequeDetailRows])
//       );
//       const data2: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...existingChequeDetailRows])
//       );

//       while (data.length < 10) {
//         data.push({
//           chequeDetailId: '',
//           collectionId: '',
//           chequeNo: '',
//           bankId: null,
//           bankName: '',
//           chequeDate: '',
//           chequeAmount: null,
//           cqdCollected: null,
//           sendDate: '',
//           honorDate: null,
//           date: null,
//           dateOfEntry: '',
//           sendBankId: null,
//           sendBankName: '',
//           disreason: null,
//           remarks: null,
//           chequeHistories: [],
//           chequeAWBs: [],
//         } as any);
//       }

//       setChequeDetailGrid(JSON.parse(JSON.stringify([...data])));
//       setChequeDetailGridPrev(JSON.parse(JSON.stringify([...data2])));
//       setIsChequeDetailGridLoading(false);
//     } else if (
//       !existingChequeDetailRows.length &&
//       !existingChequeDetailDeletedRows.length &&
//       chequeDetailInfoIsSuccess &&
//       typeof window !== 'undefined' &&
//       !chequeDetailInfoIsLoading &&
//       !chequeDetailInfoIsError &&
//       !chequeDetailInfoIsFetching
//     ) {
//       const data: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...(chequeDetailInfoData ?? [])])
//       );
//       const data2: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...(chequeDetailInfoData ?? [])])
//       );

//       while (data.length < 10) {
//         data.push({
//           chequeDetailId: '',
//           collectionId: '',
//           chequeNo: '',
//           bankId: null,
//           bankName: '',
//           chequeDate: '',
//           chequeAmount: null,
//           cqdCollected: null,
//           sendDate: '',
//           honorDate: null,
//           date: null,
//           dateOfEntry: '',
//           sendBankId: null,
//           sendBankName: '',
//           disreason: null,
//           remarks: null,
//           chequeHistories: [],
//           chequeAWBs: [],
//         } as any);
//       }

//       setChequeDetailGrid(JSON.parse(JSON.stringify([...data])));
//       setChequeDetailGridPrev(JSON.parse(JSON.stringify([...data2])));
//       setIsChequeDetailGridLoading(false);
//     } else if (typeof window === 'undefined') {
//       setIsChequeDetailGridLoading(true);
//     }
//   }, [
//     chequeDetailInfoData,
//     chequeDetailInfoIsLoading,
//     chequeDetailInfoError,
//     chequeDetailInfoIsError,
//     chequeDetailInfoIsFetching,
//     chequeDetailInfoIsSuccess,
//     detailEditModalInfo?.collectionId,
//   ]);

//   const {
//     data: bankComboOptions,
//     isError: bankComboOptionsIsError,
//     error: bankComboOptionsError,
//   } = useGetBanksComboOptionsQuery({
//     companyId: userInfo?.companyId || 0,
//   });

//   useEffect(() => {
//     if (bankComboOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching bankComboOptions for autocomplete, see console!'
//       );
//       console.log(bankComboOptionsError);
//     }
//   }, [bankComboOptionsIsError, bankComboOptionsError]);

//   useEffect(() => {
//     triggerGetChequeDetailInfo({
//       collectionId: detailEditModalInfo?.collectionId,
//       biznessEventId: 1,
//       companyId: userInfo?.companyId,
//       userId: userInfo?.securityUserId,
//     });
//   }, []);

//   //  helper: open history modal for a row
//   const openHistoryModalForRow = useCallback(
//     (rowIndex: number) => {
//       const row = chequeDetailGrid[rowIndex];
//       if (!row || !row.chequeNo) return;

//       const rows = (row.chequeHistories ?? []) as IChequeHistory[];
//       setChequeHistoryRows([...rows]);
//       setChequeHistoryTitle(
//         `Cheque History — Cheque: ${row.chequeNo} | Collection: ${
//           row.collectionId || ''
//         }`
//       );
//       setChequeHistoryOpen(true);
//     },
//     [chequeDetailGrid]
//   );

//   const statusMap: Record<string, string> = {
//     F: 'Fresh Cheque',
//     S: 'Sent to Bank',
//     H: 'Honor',
//     D: 'Dishonor',
//     B: 'Adjusted with Balance',
//   };

//   interface AutoCompResStyles {
//     popper: { maxWidth: string; fontSize: string };
//   }
//   const autoCompResStyles: AutoCompResStyles = {
//     popper: { maxWidth: 'fit-content', fontSize: '0.75rem' },
//   };

//   const PopperMy = useCallback(
//     (propsPopper: any) => {
//       return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
//     },
//     [autoCompResStyles.popper]
//   );

//   const handleExportData = (gridData: any[], gridColumns: any) => {
//     if (!gridData.length) {
//       toast.info('No data to download');
//       return;
//     }

//     const falsePropertiesArr = Object.keys(columnVisibility).filter(
//       (property) => columnVisibility[property] === false
//     );

//     const visibleGridDataTbColXcel = gridColumns
//       .filter(
//         (column: any) =>
//           column?.id &&
//           column?.id !== 'Actions' &&
//           column?.id !== 'delete' &&
//           !falsePropertiesArr.includes(column.id)
//       )
//       .map(({ id, header }: any) => ({ id, header }));

//     const gridDataTbXCEL = gridData.map((item: any) => {
//       return Object.keys(item).reduce((acc: any, key: any) => {
//         if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
//           acc[key] = item[key];
//         }
//         return acc;
//       }, {});
//     });

//     const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
//       const sortedItem: any = {};
//       visibleGridDataTbColXcel.forEach((column: any) => {
//         sortedItem[column.id] = item[column.id];
//       });
//       return sortedItem;
//     });

//     const csvOptions = {
//       fieldSeparator: ',',
//       quoteStrings: '"',
//       decimalSeparator: '.',
//       showLabels: true,
//       useBom: true,
//       useKeysAsHeaders: false,
//       headers: visibleGridDataTbColXcel.map((c: any) => c.header),
//     };
//     const csvExporter = new ExportToCsv(csvOptions);
//     csvExporter.generateCsv(gridDataTbXCELSorted);
//   };

//   const chequeDetailGridColumns = useMemo<MRT_ColumnDef<IChequeDetailInfo>[]>(
//     () => [
//       // delete column kept as-is (you can disable later if CEO says)
//       {
//         id: 'delete',
//         header: '',
//         size: 1,
//         grow: false,
//         muiTableHeadCellProps: () => ({ align: 'left' }),
//         Cell: ({ row }) => (
//           <div className="w-full flex justify-center">
//             <Tooltip
//               className={row.original.chequeNo ? 'visible' : 'invisible'}
//               arrow
//               placement="right"
//               title="Delete"
//             >
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   if (row.original.chequeDetailId) {
//                     const tempDeletedObj: IDeleteChequeDetailCommand = {
//                       chequeDetailId: row.original.chequeDetailId,
//                       collectionId: detailEditModalInfo?.collectionId,
//                       chequeNo: row.original.chequeNo,
//                     };
//                     deletedRowChequeDetail?.push(tempDeletedObj);
//                   }
//                   chequeDetailGrid?.splice(row.index, 1);
//                   if (chequeDetailGrid) {
//                     setChequeDetailGrid([...chequeDetailGrid]);
//                     setDeletedRowChequeDetail([...deletedRowChequeDetail]);
//                   } else {
//                     setChequeDetailGrid([]);
//                   }
//                 }}
//               >
//                 <Delete />
//               </IconButton>
//             </Tooltip>
//           </div>
//         ),
//       },

//       {
//         accessorFn: (row) => row.chequeNo ?? '',
//         id: 'chequeNo',
//         enableGlobalFilter: columnVisibility?.chequeNo,
//         header: 'Cheque No',
//         Cell: ({ renderedCellValue }) => (
//           <TextField
//             type="text"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={renderedCellValue as any}
//           />
//         ),
//       },

//       {
//         accessorFn: (row) => row.bankName ?? '',
//         id: 'bankName',
//         enableGlobalFilter: columnVisibility?.bankName,
//         header: 'Bank Name',
//         Cell: ({ renderedCellValue }) => (
//           <TextField
//             type="text"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={renderedCellValue as any}
//           />
//         ),
//       },

//       {
//         accessorFn: (row) => row.chequeDate ?? '',
//         enableGlobalFilter: columnVisibility?.chequeDate,
//         id: 'chequeDate',
//         header: 'Cheque Date',
//         Cell: ({ row }) => (
//           <TextField
//             type="text"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={
//               row.original.chequeDate ? dayjs(row.original.chequeDate) : null
//             }
//           />
//         ),
//       },

//       {
//         accessorFn: (row) => row.chequeAmount ?? '',
//         id: 'chequeAmount',
//         enableGlobalFilter: columnVisibility?.chequeAmount,
//         header: 'Cheque Amount',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: () => ({ align: 'left' }),
//         Cell: ({ renderedCellValue }) => (
//           <TextField
//             type="number"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={renderedCellValue as any}
//           />
//         ),
//       },

//       //  Status + UNDO icon (opens history modal)
//       {
//         accessorFn: (row) => row.cqdCollected ?? '',
//         id: 'cqdCollected',
//         enableGlobalFilter: columnVisibility?.cqdCollected,
//         header: 'Status',
//         Cell: ({ row }) => {
//           if (!row.original.chequeNo) {
//             return (
//               <Box
//                 sx={{
//                   width: '100%',
//                   minHeight: '2rem',
//                   display: 'flex',
//                   alignItems: 'center',
//                   px: 1,
//                   fontSize: '0.8125rem',
//                 }}
//               />
//             );
//           }

//           const code = row.original.cqdCollected || '';
//           const label = statusMap[code] || '';

//           return (
//             <Box
//               sx={{
//                 width: '100%',
//                 minHeight: '2rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 px: 1,
//                 fontSize: '0.8125rem',
//               }}
//             >
//               <span>
//                 {label || <span style={{ color: '#bdbdbd' }}>—</span>}
//               </span>

//               <Tooltip title="Undo / View History">
//                 <IconButton
//                   size="small"
//                   onClick={() => openHistoryModalForRow(row.index)}
//                 >
//                   <UndoIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.sendBankName ?? '',
//         id: 'sendBankName',
//         enableGlobalFilter: columnVisibility?.sendBankName,
//         header: 'Send Bank Name',
//         Cell: ({ row }) => {
//           const currentSendBank = {
//             bankId: row.original.sendBankId || 0,
//             bankName: row.original.sendBankName || '',
//           };
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: '0.8125rem' },
//                 disableUnderline: true,
//                 readOnly: true, //  read-only
//               }}
//               variant="standard"
//               size="small"
//               value={
//                 row.original.sendBankName ? row.original.sendBankName : null
//               }
//             />
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.disreason ?? '',
//         id: 'disreason',
//         enableGlobalFilter: columnVisibility?.disreason,
//         header: 'Disreason',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: () => ({ align: 'left' }),
//         Cell: ({ renderedCellValue }) => (
//           <TextField
//             type="text"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={renderedCellValue as any}
//           />
//         ),
//       },

//       {
//         accessorFn: (row) => row.remarks ?? '',
//         id: 'remarks',
//         enableGlobalFilter: columnVisibility?.remarks,
//         header: 'Remarks',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: () => ({ align: 'left' }),
//         Cell: ({ renderedCellValue }) => (
//           <TextField
//             type="text"
//             sx={{ width: '100%' }}
//             InputProps={{
//               style: { fontSize: '0.8125rem' },
//               disableUnderline: true,
//               readOnly: true, //  read-only
//             }}
//             variant="standard"
//             size="small"
//             value={renderedCellValue as any}
//           />
//         ),
//       },
//     ],
//     [
//       PopperMy,
//       bankComboOptions,
//       chequeDetailGrid,
//       chequeDetailGridPrev,
//       columnVisibility?.chequeNo,
//       columnVisibility?.bankName,
//       columnVisibility?.collectionDate,
//       columnVisibility?.chequeAmount,
//       columnVisibility?.cqdCollected,
//       columnVisibility?.sendBankName,
//       columnVisibility?.taxAmount,
//       columnVisibility?.remarks,
//       control,
//       deletedRowChequeDetail,
//       detailEditModalInfo?.collectionId,
//       openHistoryModalForRow,
//       statusMap,
//     ]
//   );

//   const rowVirtualizerInstanceRef =
//     useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

//   useEffect(() => {
//     try {
//       rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [sortingChequeDetailGrid]);

//   const chequeDetailGridInitializer: MRT_TableInstance<IChequeDetailInfo> =
//     useMaterialReactTable({
//       columns: chequeDetailGridColumns,
//       data: chequeDetailGrid || [],
//       state: {
//         columnVisibility,
//         isLoading: isChequeDetailGridLoading,
//         sorting: sortingChequeDetailGrid,
//       },
//       positionToolbarAlertBanner: 'none',
//       onColumnVisibilityChange: setColumnVisibility,
//       muiSkeletonProps: { animation: 'pulse', height: '1.875rem' },
//       enableRowVirtualization: true,
//       enableBottomToolbar: false,
//       enableColumnResizing: true,
//       enableGlobalFilterModes: true,
//       enableFilterMatchHighlighting: false,
//       enablePagination: false,
//       enableRowNumbers: false,
//       enableColumnPinning: true,
//       enableStickyHeader: true,
//       layoutMode: 'grid',
//       initialState: { density: 'compact' },
//       muiTablePaperProps: {
//         elevation: 0,
//         sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
//       },
//       muiTableBodyCellProps: {
//         sx: { fontSize: '0.8125rem', color: '#ea1143' },
//       },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           fontSize: '0.8125rem',
//           whiteSpace: 'nowrap',
//           backgroundColor: '#ECEFF9',
//           color: '#1c1c1c',
//           fontWeight: '800',
//         },
//       },
//       muiTableContainerProps: { sx: { maxHeight: '25rem' } },
//       renderToolbarInternalActions: ({ table }) => (
//         <>
//           <MRT_ToggleGlobalFilterButton table={table} />
//           <MRT_ShowHideColumnsButton table={table} />
//           <MRT_ToggleFullScreenButton table={table} />
//           <MRT_ToggleFiltersButton table={table} />
//           <div className="mx-2">
//             <button
//               type="button"
//               data-mdb-ripple="true"
//               data-mdb-ripple-color="light"
//               className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//               onClick={() =>
//                 handleExportData(chequeDetailGrid, chequeDetailGridColumns)
//               }
//             >
//               <i className="fas fa-file-excel" />
//             </button>
//           </div>
//         </>
//       ),
//       onSortingChange: setSortingChequeDetailGrid,
//       rowVirtualizerInstanceRef,
//       rowVirtualizerOptions: { overscan: 10 },
//     });

//   return (
//     <div className="mt-16 md:mt-2">
//       <div className="m-2 flex justify-center">
//         <div className="block w-[100%]">
//           <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//             <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//               <div className="font-semibold">Cheque Detail</div>
//               <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
//                 Collection No:{' '}
//                 {detailEditModalInfo?.collectionInfoGridRow?.collectionNo}
//               </div>
//               <div className="text-sm font-thin text-gray-600 dark:text-gray-400">
//                 Buyer: {detailEditModalInfo?.collectionInfoGridRow?.buyerName}
//               </div>
//             </div>

//             <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
//               <div className="w-full m-1 modifiedEditTable">
//                 <MaterialReactTable table={chequeDetailGridInitializer} />
//               </div>
//             </div>

//             <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//               <div className="flex gap-x-3">
//                 {/* Save button kept as-is for now; you can change later */}
//                 <button
//                   type="button"
//                   data-mdb-ripple="true"
//                   data-mdb-ripple-color="light"
//                   className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                   onClick={() => {
//                     toast.info(
//                       'Read-only grid. Edit flow will be handled via UNDO/history as per new requirement.'
//                     );
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/*  ChequeHistory Modal */}
//       <ChequeHistory
//         open={chequeHistoryOpen}
//         onClose={() => setChequeHistoryOpen(false)}
//         histories={chequeHistoryRows}
//         title={chequeHistoryTitle}
//         onUndo={(targetHistory) => {
//           //  For now, just returning selected history row to parent logic.
//           // You said: “chequeDetail will get edited/updated, how I will describe later.”
//           console.log('UNDO target history:', targetHistory);
//           toast.info(`UNDO clicked for status: ${targetHistory.treatment}`);
//           setChequeHistoryOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default ChequeDetail;
