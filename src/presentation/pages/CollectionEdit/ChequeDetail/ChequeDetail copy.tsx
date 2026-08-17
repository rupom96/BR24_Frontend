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
// import dayjs, { Dayjs } from 'dayjs';
// import { useGetProductByCompanyProductGroupIdQuery } from '../../../../infrastructure/api/ProductApiSlice';

// import {
//   IChequeAWB,
//   IChequeDetailInfo,
//   IChequeHistory,
//   ICollectionInfo,
//   IDeleteChequeDetailCommand,
// } from '../../../../domain/interfaces/CollectionInterface';
// import { useLazyGetChequeDetailByCollectionIdQuery } from '../../../../infrastructure/api/CollectionApiSlice';
// import { useGetBanksComboOptionsQuery } from '../../../../infrastructure/api/GetBanksForChequeBookApiSlice';

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
//   const {
//     register,
//     getValues,
//     reset,
//     control,
//     setValue,
//     setError,
//     clearErrors,
//     handleSubmit,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     mode: 'onBlur', // Validation will trigger on blur
//   });

//   const [chequeDetailGrid, setChequeDetailGrid] = useState<IChequeDetailInfo[]>(
//     []
//   );
//   const [chequeDetailGridPrev, setChequeDetailGridPrev] = useState<
//     IChequeDetailInfo[]
//   >([]);

//   const [deletedRowChequeDetail, setDeletedRowChequeDetail] = useState<
//     IDeleteChequeDetailCommand[]
//   >([]);

//   const [columnVisibility, setColumnVisibility] = useState<any>([]);
//   //   grid virtualization states
//   const [isChequeDetailGridLoading, setIsChequeDetailGridLoading] =
//     useState(true);
//   const [sortingChequeDetailGrid, setSortingChequeDetailGrid] =
//     useState<MRT_SortingState>([]);

//   // Modal state for Status column
//   const [statusModalOpen, setStatusModalOpen] = useState(false);
//   const [statusModalRowIndex, setStatusModalRowIndex] = useState<number | null>(
//     null
//   );
//   const [statusModalStatus, setStatusModalStatus] = useState<string | null>(
//     null
//   );
//   const [statusModalDate, setStatusModalDate] = useState<Dayjs | null>(null);

//   let userInfo: any;
//   const jsonUserInfo = localStorage.getItem('userInfo');
//   if (jsonUserInfo) {
//     userInfo = JSON.parse(jsonUserInfo);
//   }
//   // -----------------------------------API HOOK INIT-----------------------------------------

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
//   ] = useLazyGetChequeDetailByCollectionIdQuery(); // RTK Query lazy fetch

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
//       console.log(
//         'Something wrong from backend while fetching chequeDetailInfoData, see console--->:'
//       );
//       console.log(chequeDetailInfoError);

//       const data: IChequeDetailInfo[] = [];

//       // Fill remaining with empty rows
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
//         });
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
//       console.log('existingChequeDetailRows');
//       console.log(existingChequeDetailRows);

//       const data: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...existingChequeDetailRows])
//       );
//       const data2: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...existingChequeDetailRows])
//       );

//       // Fill remaining with empty rows
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
//         });
//       }

//       const dataCopy = JSON.parse(JSON.stringify([...data]));
//       const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

//       setChequeDetailGrid([...dataCopy]);
//       setChequeDetailGridPrev([...dataCopy2]);
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
//       console.log('chequeDetailInfoIsSuccess');
//       console.log(chequeDetailInfoData);

//       const data: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...(chequeDetailInfoData ?? [])])
//       );
//       const data2: IChequeDetailInfo[] = JSON.parse(
//         JSON.stringify([...(chequeDetailInfoData ?? [])])
//       );

//       // Fill remaining with empty rows
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
//         });
//       }

//       const dataCopy = JSON.parse(JSON.stringify([...data]));
//       const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

//       setChequeDetailGrid([...dataCopy]);
//       setChequeDetailGridPrev([...dataCopy2]);
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
//     // chequeDetailRows,
//     // deletedChequeDetailRows,
//     detailEditModalInfo?.collectionId,
//   ]);

//   const {
//     data: bankComboOptions,
//     isLoading: bankComboOptionsLoading,
//     error: bankComboOptionsError,
//     isError: bankComboOptionsIsError,
//     isFetching: bankComboOptionsIsFetching,
//     refetch: bankComboOptionsRefetch,
//   } = useGetBanksComboOptionsQuery({
//     companyId: userInfo?.companyId || 0,
//   });
//   useEffect(() => {
//     if (bankComboOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching bankComboOptions for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching bankComboOptions for autocomplete, see console--->:'
//       );
//       console.log(bankComboOptionsError);
//     }
//   }, [
//     bankComboOptionsLoading,
//     bankComboOptionsIsError,
//     bankComboOptionsError,
//     bankComboOptions,
//     bankComboOptionsIsFetching,
//   ]);

//   //   ----------API Calls(Lazy)--------------------------
//   // Trigger GetChequeDetail RTK Query whenever a form field changes
//   useEffect(() => {
//     // Trigger your RTK Query
//     triggerGetChequeDetailInfo({
//       collectionId: detailEditModalInfo?.collectionId,
//       biznessEventId: 1,
//       companyId: userInfo?.companyId,
//       userId: userInfo?.securityUserId,
//     });
//   }, []);

//   //   ----------------------------------FUNCTIONS------------------------------------
//   const checkAndSetChequeDetailTableValues = useCallback(
//     (index: number) => {
//       if (index === chequeDetailGrid.length - 1) {
//         const emptyChequeDetail: IChequeDetailInfo = {
//           chequeDetailId: '',
//           collectionId: '',
//           chequeNo: '',
//           bankId: 0,
//           bankName: '',
//           chequeDate: '',
//           chequeAmount: 0,
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
//         };
//         setChequeDetailGrid([...chequeDetailGrid, emptyChequeDetail]);
//       } else {
//         setChequeDetailGrid([...chequeDetailGrid]);
//       }
//     },
//     [chequeDetailGrid]
//   );

//   // const saveChequeDetail = () => {
//   //   console.log('ChequeDetail');
//   //   console.log(chequeDetailGrid);

//   //   console.log('DeletedRowChequeDetail');
//   //   console.log(deletedRowChequeDetail);

//   //   const tempChequeDetailRows: IChequeDetailInfo[] = JSON.parse(
//   //     JSON.stringify([...chequeDetailGrid])
//   //   );

//   //   const tempChequeDetailRowsWithoutEmpty = tempChequeDetailRows.filter(
//   //     (obj) => obj.chequeNo && obj.chequeAmount
//   //   );

//   //   if (
//   //     JSON.stringify(tempChequeDetailRowsWithoutEmpty) ===
//   //     JSON.stringify(chequeDetailGridPrev)
//   //   ) {
//   //     toast.info('No changes to save!');
//   //     return;
//   //   }

//   //   // storing deletedRowChequeDetail to deletedSalesDetailRows(global)
//   //   const deletedChequeDetailArray: IDeleteChequeDetailCommand[] = JSON.parse(
//   //     JSON.stringify([...deletedChequeDetailRows])
//   //   );
//   //   for (let i = 0; i < deletedRowChequeDetail.length; i++) {
//   //     const tempDeleteObj: IDeleteChequeDetailCommand = {
//   //       chequeDetailId: deletedRowChequeDetail[i].chequeDetailId,
//   //       collectionId: deletedRowChequeDetail[i].collectionId,
//   //       chequeNo: deletedRowChequeDetail[i].chequeNo,
//   //     };
//   //     deletedChequeDetailArray.push(tempDeleteObj);
//   //   }
//   //   setDeletedChequeDetailRows([...new Set(deletedChequeDetailArray)]);

//   //   // storing chequeDetailGrid to chequeDetailRows

//   //   const collectedAmount = tempChequeDetailRowsWithoutEmpty.reduce(
//   //     (sum, obj) => {
//   //       return sum + (obj.chequeAmount || 0);
//   //     },
//   //     0
//   //   );

//   //   console.log('collectedAmount');
//   //   console.log(collectedAmount);

//   //   collectionGrid[
//   //     detailEditModalInfo?.collectionInfoGridIndex
//   //   ].collectedAmount = collectedAmount;

//   //   console.log('setting the chequeDetail Array--->');
//   //   console.log(tempChequeDetailRowsWithoutEmpty);

//   //   setChequeDetailRows([...tempChequeDetailRowsWithoutEmpty]);
//   //   setCollectionGrid([...collectionGrid]);
//   // };

//   //   ----------------------------------FUNCTIONS------------------------------------

//   // ---------------------AUTOCOMPLETE POPPER INITIALIZATION-------------------------------

//   const saveChequeDetail = () => {
//     console.log('ChequeDetail');
//     console.log(chequeDetailGrid);

//     console.log('DeletedRowChequeDetail');
//     console.log(deletedRowChequeDetail);

//     // Deep copy so we don't mutate state directly
//     const tempChequeDetailRows: IChequeDetailInfo[] = JSON.parse(
//       JSON.stringify([...chequeDetailGrid])
//     );

//     const dbRows: IChequeDetailInfo[] = chequeDetailInfoData ?? [];

//     // ---- helpers for unique push (by id + chequeNo + collectionId) ----
//     const pushUniqueHistory = (
//       existing: IChequeHistory[] | null | undefined,
//       entry: IChequeHistory
//     ): IChequeHistory[] => {
//       const list = existing || [];
//       const exists = list.some(
//         (h) =>
//           (h.chequeHistoryId || 0) === (entry.chequeHistoryId || 0) &&
//           h.chequeNo === entry.chequeNo &&
//           h.collectionId === entry.collectionId
//       );
//       return exists ? list : [...list, entry];
//     };

//     const pushUniqueAwb = (
//       existing: IChequeAWB[] | null | undefined,
//       entry: IChequeAWB
//     ): IChequeAWB[] => {
//       const list = existing || [];
//       const exists = list.some(
//         (a) =>
//           (a.chequeAWBId || 0) === (entry.chequeAWBId || 0) &&
//           a.chequeNo === entry.chequeNo &&
//           a.collectionId === entry.collectionId
//       );
//       return exists ? list : [...list, entry];
//     };

//     // ---- Build chequeHistories & chequeAWBs based on DB comparison ----
//     tempChequeDetailRows.forEach((row) => {
//       // Only process non-empty rows
//       if (!row.chequeNo || row.chequeAmount == null) return;

//       const currentStatus: string | null = row.cqdCollected || null;

//       // Determine original row from DB using chequeDetailId
//       let originalStatus: string | null = null;

//       if (row.chequeDetailId) {
//         const originalRow = dbRows.find(
//           (dbRow) => dbRow.chequeDetailId === row.chequeDetailId
//         );
//         originalStatus = originalRow?.cqdCollected || null;
//       } else {
//         // New row: no DB record
//         originalStatus = null;
//       }

//       // If status is unchanged or still null → CLEAR histories/awbs and do nothing
//       if (!currentStatus || currentStatus === originalStatus) {
//         row.chequeHistories = [];
//         row.chequeAWBs = [];
//         return;
//       }
//       // Only react to S, H, D, B
//       if (!['S', 'H', 'D', 'B'].includes(currentStatus)) return;

//       // Decide which date we will use based on current status
//       let statusDate: string | null = null;
//       if (currentStatus === 'S') {
//         statusDate = row.sendDate ?? null;
//       } else if (currentStatus === 'H') {
//         statusDate = row.honorDate ?? null;
//       } else if (currentStatus === 'D' || currentStatus === 'B') {
//         statusDate = row.date ?? null;
//       }

//       if (!statusDate) {
//         // Fallback if date missing for some reason
//         statusDate = dayjs(statusModalDate).format(
//           'YYYY-MM-DD[T]HH:mm:00.000[Z]'
//         );
//       }

//       // const treatmentLabel = statusMap[currentStatus] ?? currentStatus;

//       // ---------- chequeHistories entry ----------
//       const newHistory: IChequeHistory = {
//         chequeHistoryId: 0, // new row (DB will assign real id)
//         chequeType: 'C',
//         collectionId: row.collectionId,
//         chequeNo: row.chequeNo,
//         chequeDate: row.chequeDate,
//         bankId: row.bankId ?? 0,
//         treatment: currentStatus,
//         treatmentDate: statusDate,
//         sendBankId: row.sendBankId ?? null,
//         date: statusDate,
//         enteredBy: userInfo?.securityUserId ?? 0,
//         dateOfEntry: dayjs(statusModalDate).format(
//           'YYYY-MM-DD[T]HH:mm:00.000[Z]'
//         ),
//         voucherId: null,
//       };

//       row.chequeHistories = pushUniqueHistory(row.chequeHistories, newHistory);

//       // ---------- chequeAWBs entry (only when status = 'B') ----------
//       if (currentStatus === 'B') {
//         const buyerId =
//           detailEditModalInfo?.collectionInfoGridRow?.buyerId ??
//           collectionGrid[detailEditModalInfo?.collectionInfoGridIndex]
//             ?.buyerId ??
//           0;

//         const newAwb: IChequeAWB = {
//           chequeAWBId: 0, // new row (DB will assign real id)
//           collectionId: row.collectionId,
//           chequeNo: row.chequeNo,
//           chequeAmount: row.chequeAmount ?? 0,
//           chequeDate: row.chequeDate,
//           bankId: row.bankId ?? 0,
//           adjustmentDate: statusDate,
//           buyerId,
//           enteredBy: userInfo?.securityUserId ?? 0,
//           dateOfEntry: dayjs(statusModalDate).format(
//             'YYYY-MM-DD[T]HH:mm:00.000[Z]'
//           ),
//           companyId: userInfo?.companyId ?? 0,
//           locationId: userInfo?.locationId ?? 0,
//         };

//         row.chequeAWBs = pushUniqueAwb(row.chequeAWBs, newAwb);
//       }
//     });

//     // Filter out empty rows (no chequeNo or amount)
//     const tempChequeDetailRowsWithoutEmpty = tempChequeDetailRows.filter(
//       (obj) => obj.chequeNo && obj.chequeAmount
//     );

//     // If absolutely nothing changed vs previous in-memory grid, bail out
//     if (
//       JSON.stringify(tempChequeDetailRowsWithoutEmpty) ===
//       JSON.stringify(chequeDetailGridPrev)
//     ) {
//       toast.info('No changes to save!');
//       return;
//     }

//     // ---- Push deleted rows into global deletedChequeDetailRows ----
//     const deletedChequeDetailArray: IDeleteChequeDetailCommand[] = JSON.parse(
//       JSON.stringify([...deletedChequeDetailRows])
//     );

//     for (let i = 0; i < deletedRowChequeDetail.length; i++) {
//       const tempDeleteObj: IDeleteChequeDetailCommand = {
//         chequeDetailId: deletedRowChequeDetail[i].chequeDetailId,
//         collectionId: deletedRowChequeDetail[i].collectionId,
//         chequeNo: deletedRowChequeDetail[i].chequeNo,
//       };
//       deletedChequeDetailArray.push(tempDeleteObj);
//     }

//     setDeletedChequeDetailRows([...new Set(deletedChequeDetailArray)]);

//     // ---- Recalculate collectedAmount for this collection row ----
//     const collectedAmount = tempChequeDetailRowsWithoutEmpty.reduce(
//       (sum, obj) => {
//         return sum + (obj.chequeAmount || 0);
//       },
//       0
//     );

//     console.log('collectedAmount');
//     console.log(collectedAmount);

//     collectionGrid[
//       detailEditModalInfo?.collectionInfoGridIndex
//     ].collectedAmount = collectedAmount;

//     console.log('setting the chequeDetail Array--->');
//     console.log(tempChequeDetailRowsWithoutEmpty);

//     // Update parent-level state and local grid
//     setChequeDetailRows([...tempChequeDetailRowsWithoutEmpty]);
//     setCollectionGrid([...collectionGrid]);
//     setChequeDetailGrid([...tempChequeDetailRows]);
//   };

//   interface AutoCompResStyles {
//     popper: {
//       maxWidth: string;
//       fontSize: string;
//     };
//   }
//   const autoCompResStyles: AutoCompResStyles = {
//     popper: {
//       maxWidth: 'fit-content',
//       fontSize: '12px',
//     },
//   };

//   const PopperMy = useCallback(
//     (propsPopper: any) => {
//       return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
//     },
//     [autoCompResStyles.popper]
//   );
//   // ---------------------AUTOCOMPLETE POPPER INITIALIZATION--------------ENDSS-----------------

//   // --------------------------------------------excel csv-----------------------------------

//   const handleExportData = (gridData: any[], gridColumns: any) => {
//     if (!gridData.length) {
//       toast.info('No data to download');
//       return;
//     }

//     console.log('handleExportData');

//     console.log('gridData');
//     console.log(gridData);

//     console.log('columnVisibility');
//     console.log(columnVisibility);

//     // --------[Getting the hidden columns as property names in an array]----------
//     const falsePropertiesArr = Object.keys(columnVisibility).filter(
//       (property) => columnVisibility[property] === false
//     );
//     console.log('falsePropertiesArr');
//     console.log(falsePropertiesArr);

//     console.log('gridColumns');
//     console.log(gridColumns);

//     const visibleGridDataTbColXcel = gridColumns
//       .filter(
//         (column: any) =>
//           column?.id &&
//           column?.id !== 'Actions' &&
//           column?.id !== 'delete' &&
//           !falsePropertiesArr.includes(column.id)
//       )
//       .map(({ id, header }: any) => ({ id, header }));

//     console.log('visibleGridDataTbColXcel');
//     console.log(visibleGridDataTbColXcel);

//     const gridDataTbXCEL = gridData.map((item: any) => {
//       return Object.keys(item).reduce((acc: any, key: any) => {
//         if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
//           acc[key] = item[key];
//         }
//         return acc;
//       }, {});
//     });

//     console.log('gridDataTbXCEL');
//     console.log(gridDataTbXCEL);

//     const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
//       const sortedItem: any = {};
//       visibleGridDataTbColXcel.forEach((column: any) => {
//         sortedItem[column.id] = item[column.id];
//       });
//       return sortedItem;
//     });

//     console.log('gridDataTbXCELSorted');
//     console.log(gridDataTbXCELSorted);

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

//   // ------------------------------------excel csv-----------------END------------------

//   const statusMap: Record<string, string> = {
//     F: 'Fresh Check',
//     S: 'Sent to Bank',
//     H: 'Honor',
//     D: 'Dishonor',
//     B: 'Adjusted with Balance',
//   };

//   const statusOptions = [
//     { cqdCollectedId: 'F', cqdCollectedName: 'Fresh Check' },
//     { cqdCollectedId: 'S', cqdCollectedName: 'Sent to Bank' },
//     { cqdCollectedId: 'H', cqdCollectedName: 'Honor' },
//     { cqdCollectedId: 'D', cqdCollectedName: 'Dishonor' },
//     { cqdCollectedId: 'B', cqdCollectedName: 'Adjusted with Balance' },
//   ];

//   const getOriginalStatus = useCallback(
//     (rowIndex: number): string | null => {
//       const row = chequeDetailGrid[rowIndex];
//       if (!row || !row.chequeDetailId || !chequeDetailInfoData) return null;

//       // Find the original DB row by chequeDetailId
//       const originalRow = chequeDetailInfoData.find(
//         (dbRow) => dbRow.chequeDetailId === row.chequeDetailId
//       );

//       return originalRow?.cqdCollected ?? null;
//     },
//     [chequeDetailGrid, chequeDetailInfoData]
//   );

//   const isStatusReadOnly = useCallback(
//     (rowIndex: number) => {
//       const original = getOriginalStatus(rowIndex);
//       return original === 'H' || original === 'B';
//     },
//     [getOriginalStatus]
//   );

//   const getAllowedStatusOptions = useCallback(
//     (rowIndex: number) => {
//       const original = getOriginalStatus(rowIndex);

//       switch (original) {
//         case 'F':
//         case null:
//           // Treat null (new row) like Fresh Check -> can pick Fresh Check or Sent to Bank
//           return statusOptions.filter((o) =>
//             ['F', 'S'].includes(o.cqdCollectedId)
//           );
//         case 'S':
//           // From Sent to Bank -> can go to Honor or Dishonor
//           return statusOptions.filter((o) =>
//             ['H', 'D'].includes(o.cqdCollectedId)
//           );
//         case 'H':
//           // Honor is final
//           return statusOptions.filter((o) => o.cqdCollectedId === 'H');
//         case 'D':
//           // Dishonor -> Sent to Bank or Adjusted with Balance
//           return statusOptions.filter((o) =>
//             ['S', 'B'].includes(o.cqdCollectedId)
//           );
//         case 'B':
//           // Adjusted with Balance is final
//           return statusOptions.filter((o) => o.cqdCollectedId === 'B');
//         default:
//           return statusOptions;
//       }
//     },
//     [getOriginalStatus]
//   );

//   const handleStatusModalClose = useCallback(() => {
//     setStatusModalOpen(false);
//     setStatusModalRowIndex(null);
//     setStatusModalStatus(null);
//     setStatusModalDate(null);
//   }, []);

//   const handleOpenStatusModal = useCallback(
//     (rowIndex: number) => {
//       const row = chequeDetailGrid[rowIndex];
//       if (!row) return;

//       // Prefer current grid status; if empty, fallback to original (DB) or F
//       const currentStatus =
//         row.cqdCollected || getOriginalStatus(rowIndex) || 'F';

//       setStatusModalRowIndex(rowIndex);
//       setStatusModalStatus(currentStatus);

//       let dateStr: string | null = null;
//       if (currentStatus === 'S') {
//         dateStr = row.sendDate ?? null;
//       } else if (currentStatus === 'H') {
//         dateStr = row.honorDate ?? null;
//       } else if (currentStatus === 'D' || currentStatus === 'B') {
//         dateStr = row.date ?? null;
//       }

//       setStatusModalDate(
//         dateStr ? dayjs(dateStr) : dayjs() //  default to today
//       );
//       setStatusModalOpen(true);
//     },
//     [chequeDetailGrid, getOriginalStatus]
//   );

//   const handleStatusModalSave = useCallback(() => {
//     if (statusModalRowIndex === null || !statusModalStatus) {
//       handleStatusModalClose();
//       return;
//     }

//     const idx = statusModalRowIndex;
//     const row = { ...chequeDetailGrid[idx] };

//     // // What came from DB for this row
//     // const originalRow = chequeDetailGridPrev[idx];
//     // const originalStatus = originalRow?.cqdCollected ?? null;

//     //  Get the original DB row using chequeDetailId
//     let originalRow: IChequeDetailInfo | undefined;
//     let originalStatus: string | null = null;

//     if (row.chequeDetailId && chequeDetailInfoData) {
//       originalRow = chequeDetailInfoData.find(
//         (dbRow) => dbRow.chequeDetailId === row.chequeDetailId
//       );
//       originalStatus = originalRow?.cqdCollected ?? null;
//     }

//     // // If user is going back to the original DB status
//     // if (originalRow && statusModalStatus === originalStatus) {
//     //   // Restore original status & date fields from DB
//     //   row.cqdCollected = originalStatus;

//     //   row.sendDate = originalRow.sendDate ?? null;
//     //   row.honorDate = originalRow.honorDate ?? null;
//     //   row.date = originalRow.date ?? null;
//     // } else {
//     //   // Normal case: user is selecting a "new" status (different from DB)
//     //   row.cqdCollected = statusModalStatus;

//     //   if (statusModalDate) {
//     //     const formattedDate = dayjs(statusModalDate).format(
//     //       'YYYY-MM-DD[T]HH:mm:00.000[Z]'
//     //     );

//     //     if (statusModalStatus === 'S') {
//     //       row.sendDate = formattedDate;
//     //     } else if (statusModalStatus === 'H') {
//     //       row.honorDate = formattedDate;
//     //     } else if (statusModalStatus === 'D' || statusModalStatus === 'B') {
//     //       row.date = formattedDate;
//     //     }
//     //   }
//     // }

//     // If user is going back to the original DB status
//     if (originalRow && statusModalStatus === originalStatus) {
//       //  Restore original status & all associated fields from DB
//       row.cqdCollected = originalStatus;

//       // Common fields (F/null case and others)
//       row.sendDate = originalRow.sendDate || null;
//       row.sendBankId = originalRow.sendBankId || null;
//       row.sendBankName = originalRow.sendBankName || '';

//       console.log('DEKH RUPOM-------->');
//       console.log(originalRow.sendBankId);
//       console.log(originalRow.sendBankName);

//       row.honorDate = originalRow.honorDate || null;
//       row.date = originalRow.date || null;
//       row.disreason = originalRow.disreason || null;
//       // (remarks you're not tying to status, so leaving as-is)
//     } else {
//       // Normal case: user is selecting a "new" status (different from DB)
//       row.cqdCollected = statusModalStatus;

//       if (statusModalDate) {
//         const formattedDate = dayjs(statusModalDate).format(
//           'YYYY-MM-DD[T]HH:mm:00.000[Z]'
//         );

//         if (statusModalStatus === 'S') {
//           row.sendDate = formattedDate;
//           // keep sendBankId as user selected via Send Bank column
//         } else if (statusModalStatus === 'H') {
//           row.honorDate = formattedDate;
//         } else if (statusModalStatus === 'D' || statusModalStatus === 'B') {
//           row.date = formattedDate;
//         }
//       }
//     }

//     // update state – no extra checkAndSet here
//     setChequeDetailGrid((prev) => {
//       const copy = [...prev];
//       copy[idx] = row;
//       return copy;
//     });

//     handleStatusModalClose();
//   }, [
//     statusModalRowIndex,
//     statusModalStatus,
//     statusModalDate,
//     chequeDetailGrid,
//     chequeDetailGridPrev,
//     setChequeDetailGrid,
//     handleStatusModalClose,
//   ]);

//   const chequeDetailGridColumns = useMemo<MRT_ColumnDef<IChequeDetailInfo>[]>(
//     () => [
//       {
//         id: 'delete',
//         header: '',
//         size: 1,
//         grow: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
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
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: 13 },
//                 disableUnderline: true,
//               }}
//               variant="standard"
//               size="small"
//               inputRef={(node) => {
//                 if (node) {
//                   node.value = renderedCellValue;
//                 }
//               }}
//               onBlur={(e) => {
//                 const value = e.target.value.trim();

//                 // set chequeNo
//                 chequeDetailGrid[row.index].chequeNo = value;

//                 // if a cheque number exists and status is empty, default to Fresh Check
//                 if (value && !chequeDetailGrid[row.index].cqdCollected) {
//                   chequeDetailGrid[row.index].cqdCollected = 'F'; // Fresh Check
//                   chequeDetailGrid[row.index].collectionId =
//                     detailEditModalInfo?.collectionId;
//                 }

//                 checkAndSetChequeDetailTableValues(row.index);
//               }}
//             />
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.bankName ?? '',
//         id: 'bankName',
//         enableGlobalFilter: columnVisibility?.bankName,
//         header: 'Bank Name',
//         Cell: ({ row }) => {
//           const currentBank = {
//             bankId: row.original.bankId || 0,
//             bankName: row.original.bankName || '',
//           };
//           return (
//             <Controller
//               name={`bank_row${row.index}`}
//               control={control}
//               render={({
//                 field: { onChange, onBlur, value, ref },
//                 fieldState: { error },
//               }) => (
//                 <Autocomplete
//                   options={
//                     Array.from(
//                       new Map(
//                         bankComboOptions?.map((bankOption) => [
//                           bankOption.bankName,
//                           bankOption,
//                         ])
//                       ).values()
//                     ) || []
//                   }
//                   value={currentBank}
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   clearOnEscape
//                   freeSolo
//                   onChange={(event, selectedOption: any) => {
//                     chequeDetailGrid[row.index].bankId =
//                       selectedOption?.bankId || null;
//                     chequeDetailGrid[row.index].bankName =
//                       selectedOption?.bankName || '';
//                     checkAndSetChequeDetailTableValues(row.index);
//                     onChange(selectedOption);
//                   }}
//                   onBlur={onBlur}
//                   isOptionEqualToValue={(options, selectedOption) =>
//                     options.bankId === selectedOption.bankId
//                   }
//                   getOptionLabel={(option: any) =>
//                     option ? option.bankName : ''
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: 13 },
//                         disableUnderline: true,
//                       }}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: 10,
//                           marginTop: 0,
//                           color: 'red',
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               )}
//             />
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.chequeDate ?? '',
//         enableGlobalFilter: columnVisibility?.collectionDate,
//         id: 'chequeDate',
//         header: 'Cheque Date',
//         Cell: ({ row }) => {
//           return (
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label=""
//                 inputFormat="DD/MM/YYYY"
//                 value={
//                   row.original.chequeDate
//                     ? dayjs(row.original.chequeDate)
//                     : null
//                 }
//                 onChange={(newValue) => {
//                   chequeDetailGrid[row.index].chequeDate = newValue
//                     ? dayjs(newValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
//                     : '';
//                   checkAndSetChequeDetailTableValues(row.index);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="standard"
//                     size="small"
//                     sx={{
//                       width: '100%',
//                       mt: 1,
//                       '& .MuiInputBase-root:before, & .MuiInputBase-root:after':
//                         {
//                           borderBottom: 'none',
//                         },
//                       '& .MuiInputBase-input::placeholder': {
//                         opacity: 0,
//                         color: '#bdbdbd',
//                         transition: 'opacity .2s ease',
//                       },
//                       '&:hover .MuiInputBase-input::placeholder': {
//                         opacity: 1,
//                       },
//                       '& .MuiIconButton-root': {
//                         opacity: 0,
//                         transition: 'opacity .2s ease',
//                       },
//                       '&:hover .MuiIconButton-root': {
//                         opacity: 1,
//                       },
//                     }}
//                     InputProps={{
//                       ...params.InputProps,
//                       disableUnderline: true,
//                     }}
//                     inputProps={{
//                       ...params.inputProps,
//                       placeholder: 'dd/mm/yyyy',
//                     }}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.chequeAmount ?? '',
//         id: 'chequeAmount',
//         enableGlobalFilter: columnVisibility?.chequeAmount,
//         header: 'Cheque Amount',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="number"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: 13 },
//                 disableUnderline: true,
//               }}
//               variant="standard"
//               size="small"
//               inputRef={(node) => {
//                 if (node) {
//                   node.value = renderedCellValue;
//                 }
//               }}
//               onBlur={(e) => {
//                 chequeDetailGrid[row.index].chequeAmount = Number.isNaN(
//                   parseFloat(e.target.value)
//                 )
//                   ? 0
//                   : Math.abs(parseFloat(e.target.value));
//                 checkAndSetChequeDetailTableValues(row.index);
//               }}
//             />
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.cqdCollected ?? '',
//         id: 'cqdCollected',
//         enableGlobalFilter: columnVisibility?.cqdCollected,
//         header: 'Status',
//         Cell: ({ row }) => {
//           // if no chequeNo, show empty cell and do nothing on click
//           if (!row.original.chequeNo) {
//             return (
//               <Box
//                 sx={{
//                   width: '100%',
//                   minHeight: 32,
//                   display: 'flex',
//                   alignItems: 'center',
//                   px: 1,
//                   fontSize: 13,
//                 }}
//               />
//             );
//           }

//           const currentCode = row.original.cqdCollected || '';
//           const label = statusMap[currentCode] || '';
//           const readOnly = isStatusReadOnly(row.index);

//           return (
//             <Box
//               sx={{
//                 width: '100%',
//                 minHeight: 32,
//                 display: 'flex',
//                 alignItems: 'center',
//                 px: 1,
//                 cursor: 'pointer',
//                 fontSize: 13,
//                 color: readOnly ? '#6e6e6e' : 'black',
//               }}
//               onClick={() => {
//                 if (!row.original.chequeNo) return; // extra safety
//                 handleOpenStatusModal(row.index);
//               }}
//             >
//               {label || <span style={{ color: '#bdbdbd' }}>Select status</span>}
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
//             <Controller
//               name={`sendbank_row${row.index}`}
//               control={control}
//               render={({
//                 field: { onChange, onBlur, value, ref },
//                 fieldState: { error },
//               }) => (
//                 <Autocomplete
//                   options={
//                     Array.from(
//                       new Map(
//                         bankComboOptions?.map((bankOption) => [
//                           bankOption.bankName,
//                           bankOption,
//                         ])
//                       ).values()
//                     ) || []
//                   }
//                   disabled={row.original.cqdCollected !== 'S'} //  Full grey style
//                   value={currentSendBank}
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   clearOnEscape
//                   freeSolo
//                   onChange={(event, selectedOption: any) => {
//                     chequeDetailGrid[row.index].sendBankId =
//                       selectedOption?.bankId || null;
//                     chequeDetailGrid[row.index].sendBankName =
//                       selectedOption?.bankName || '';
//                     checkAndSetChequeDetailTableValues(row.index);
//                     onChange(selectedOption);
//                   }}
//                   onBlur={onBlur}
//                   isOptionEqualToValue={(options, selectedOption) =>
//                     options.bankId === selectedOption.bankId
//                   }
//                   getOptionLabel={(option: any) =>
//                     option ? option.bankName : ''
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: 13 },
//                         disableUnderline: true,
//                       }}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: 10,
//                           marginTop: 0,
//                           color: 'red',
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               )}
//             />
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.disreason ?? '',
//         id: 'taxAmount',
//         enableGlobalFilter: columnVisibility?.taxAmount,
//         header: 'Disreason',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: 13 },
//                 disableUnderline: true,
//                 readOnly:
//                   !row.original.chequeNo || row.original.cqdCollected !== 'D',
//               }}
//               variant="standard"
//               size="small"
//               inputRef={(node) => {
//                 if (node) {
//                   node.value = renderedCellValue;
//                 }
//               }}
//               onBlur={(e) => {
//                 chequeDetailGrid[row.index].disreason = e.target.value;
//                 checkAndSetChequeDetailTableValues(row.index);
//               }}
//             />
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.remarks ?? '',
//         id: 'remarks',
//         enableGlobalFilter: columnVisibility?.remarks,
//         header: 'Remarks',
//         size: 120,
//         grow: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),

//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: 13 },
//                 disableUnderline: true,
//                 readOnly: !row.original.chequeNo,
//               }}
//               variant="standard"
//               size="small"
//               inputRef={(node) => {
//                 if (node) {
//                   node.value = renderedCellValue;
//                 }
//               }}
//               onBlur={(e) => {
//                 chequeDetailGrid[row.index].remarks = e.target.value;
//                 checkAndSetChequeDetailTableValues(row.index);
//               }}
//             />
//           );
//         },
//       },
//     ],
//     [
//       PopperMy,
//       bankComboOptions,
//       chequeDetailGrid,
//       chequeDetailGridPrev,
//       checkAndSetChequeDetailTableValues,
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
//       isStatusReadOnly,
//       handleOpenStatusModal,
//       statusMap,
//     ]
//   );

//   // ---------- material table virtualization---------

//   const rowVirtualizerInstanceRef =
//     useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

//   useEffect(() => {
//     try {
//       rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [sortingChequeDetailGrid]);

//   // ---------- material table virtualization---------

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
//       muiSkeletonProps: {
//         animation: 'pulse',
//         height: 30,
//       },
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
//       initialState: {
//         density: 'compact',
//       },
//       muiTablePaperProps: {
//         elevation: 0,
//         sx: {
//           borderRadius: '0',
//           border: '1px dashed #e0e0e0',
//         },
//       },
//       muiTableBodyCellProps: {
//         sx: {
//           fontSize: '13px',
//           color: '#ea1143',
//         },
//       },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           fontSize: '13px',
//           whiteSpace: 'nowrap',
//           backgroundColor: '#ECEFF9',
//           color: '#1c1c1c',
//           fontWeight: '800',
//         },
//       },

//       muiTableContainerProps: { sx: { maxHeight: '400px' } },
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
//               className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//               onClick={() => {
//                 handleExportData(chequeDetailGrid, chequeDetailGridColumns);
//               }}
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

//   const isModalReadOnly =
//     statusModalRowIndex === null ? true : isStatusReadOnly(statusModalRowIndex);

//   const modalStatusOptions =
//     statusModalRowIndex === null
//       ? statusOptions
//       : getAllowedStatusOptions(statusModalRowIndex);

//   return (
//     <div className="mt-16 md:mt-2">
//       <div className="m-2 flex justify-center">
//         <div className="block w-[100%]">
//           {/* Main Card */}
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

//             {/* Main Card body */}
//             <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
//               <div className="w-full m-1 modifiedEditTable">
//                 <MaterialReactTable table={chequeDetailGridInitializer} />
//               </div>
//             </div>

//             {/* Main Card footer */}
//             <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//               <div className="flex gap-x-3">
//                 <button
//                   type="button"
//                   data-mdb-ripple="true"
//                   data-mdb-ripple-color="light"
//                   className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                   onClick={() => {
//                     saveChequeDetail();
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* Main Card--/-- */}
//         </div>
//       </div>

//       {/* Status Modal */}
//       <Modal open={statusModalOpen} onClose={handleStatusModalClose}>
//         <Box
//           sx={{
//             position: 'absolute' as const,
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 420,
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 3,
//             borderRadius: 2,
//           }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Update Cheque Status</h2>
//             <IconButton size="small" onClick={handleStatusModalClose}>
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </div>

//           <div className="space-y-4">
//             <Autocomplete
//               options={modalStatusOptions}
//               getOptionLabel={(option) => option?.cqdCollectedName || ''}
//               isOptionEqualToValue={(opt, val) =>
//                 opt.cqdCollectedId === val.cqdCollectedId
//               }
//               value={
//                 statusModalStatus
//                   ? modalStatusOptions.find(
//                       (o) => o.cqdCollectedId === statusModalStatus
//                     ) || null
//                   : null
//               }
//               onChange={(event, newValue: any) => {
//                 const nextStatus = newValue?.cqdCollectedId || null;
//                 setStatusModalStatus(nextStatus);

//                 //  If Fresh Check selected, clear the date
//                 if (nextStatus === 'F') {
//                   setStatusModalDate(null);
//                 } else {
//                   //  Always default today's date when switching to S/H/D/B
//                   setStatusModalDate(dayjs());
//                 }
//               }}
//               disabled={isModalReadOnly}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Status"
//                   variant="standard"
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     style: { fontSize: 13 },
//                   }}
//                 />
//               )}
//             />
//             {/*
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Status Date"
//                 inputFormat="DD/MM/YYYY"
//                 value={statusModalDate}
//                 onChange={(newValue) => setStatusModalDate(newValue)}
//                 disabled={isModalReadOnly}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="standard"
//                     fullWidth
//                     InputProps={{
//                       ...params.InputProps,
//                       style: { fontSize: 13 },
//                     }}
//                   />
//                 )}
//               />
//             </LocalizationProvider> */}

//             {statusModalStatus !== 'F' && (
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DatePicker
//                   label="Status Date"
//                   inputFormat="DD/MM/YYYY"
//                   value={statusModalDate}
//                   onChange={(newValue) => setStatusModalDate(newValue)}
//                   disabled={isModalReadOnly}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       variant="standard"
//                       fullWidth
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: 13 },
//                       }}
//                     />
//                   )}
//                 />
//               </LocalizationProvider>
//             )}
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               className="px-4 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100"
//               onClick={handleStatusModalClose}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-1.5 text-xs rounded text-white ${
//                 isModalReadOnly || !statusModalStatus
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//               onClick={handleStatusModalSave}
//               disabled={isModalReadOnly || !statusModalStatus}
//             >
//               Save
//             </button>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default ChequeDetail;
