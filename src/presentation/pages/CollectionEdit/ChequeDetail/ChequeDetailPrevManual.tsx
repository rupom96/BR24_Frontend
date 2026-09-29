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
// import { Delete, Edit } from '@mui/icons-material';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { useGetProductByCompanyProductGroupIdQuery } from '../../../../infrastructure/api/ProductApiSlice';

// import {
//   IChequeDetailInfo,
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
//   // deletedChequeHistoryRows: IDeleteChequeHistoryCommand[];
//   // setDeletedChequeHistoryRows: React.Dispatch<React.SetStateAction<any[]>>;
//   // deletedChequeAWBRows: IDeleteChequeAWBCommand[];
//   // setDeletedChequeAWBRows: React.Dispatch<React.SetStateAction<any[]>>;
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
//   // deletedChequeHistoryRows,
//   // setDeletedChequeHistoryRows,
//   // deletedChequeAWBRows,
//   // setDeletedChequeAWBRows
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
//     // defaultValues: {
//     //   salesOrder: null,
//     //   buyer: null,
//     // },
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
//         });
//       }
//       setChequeDetailGrid([...data]);
//       setChequeDetailGridPrev([]);

//       setIsChequeDetailGridLoading(false);
//     }

//     if (
//       // maane ei salesOrder row er jonno jodi chequeDetail aager theke user set met koira thakle oidai load hoibo... na thakle db/api theke load hobe
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
//       //   buyerGroupId: buyerGroup?.buyerGroupId || null,
//       // departmentId: department?.departmentId || null,
//     });
//   }, [detailEditModalInfo?.collectionId]);

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

//   const saveChequeDetail = () => {
//     console.log('ChequeDetail');
//     console.log(chequeDetailGrid);

//     console.log('DeletedRowChequeDetail');
//     console.log(deletedRowChequeDetail);

//     const tempChequeDetailRows: IChequeDetailInfo[] = JSON.parse(
//       JSON.stringify([...chequeDetailGrid])
//     );

//     const tempChequeDetailRowsWithoutEmpty = tempChequeDetailRows.filter(
//       (obj) => obj.chequeNo && obj.chequeAmount
//     );

//     if (
//       JSON.stringify(tempChequeDetailRowsWithoutEmpty) ===
//       JSON.stringify(chequeDetailGridPrev)
//     ) {
//       toast.info('No changes to save!');
//       return;
//     }

//     // alert('helloww');
//     // console.log('current tempChequeDetailRowsWithoutEmpty');
//     // console.log(tempChequeDetailRowsWithoutEmpty);

//     // storing deletedRowChequeDetail to deletedSalesDetailRows(global)
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

//     // storing chequeDetailGrid to chequeDetailRows

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

//     setChequeDetailRows([...tempChequeDetailRowsWithoutEmpty]);
//     // console.log(chequeDetailRows);
//     setCollectionGrid([...collectionGrid]);
//     // handleDetailEditModalClose();
//   };

//   //   ----------------------------------FUNCTIONS------------------------------------

//   // ---------------------AUTOCOMPLETE POPPER INITIALIZATION-------------------------------

//   interface AutoCompResStyles {
//     popper: {
//       maxWidth: string;
//       // minWidth: string;
//       fontSize: string;
//     };
//   }
//   const autoCompResStyles: AutoCompResStyles = {
//     popper: {
//       maxWidth: 'fit-content',
//       // minWidth: 'inherit',
//       fontSize: '0.75rem',
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

//     // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
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

//     // --------[Getting the data of excel without those columns which are hidden ]----------
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

//     // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

//     const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
//       const sortedItem: any = {};
//       visibleGridDataTbColXcel.forEach((column: any) => {
//         sortedItem[column.id] = item[column.id];
//       });
//       return sortedItem;
//     });

//     console.log('gridDataTbXCELSorted');
//     console.log(gridDataTbXCELSorted);

//     // ---[csv er settings]---
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
//     F: 'Fresh Check', // transform reponse koira thik kore nish, j chequeNo ase, kintu cqdCollected null, tahole, cqdCollected er value F boshaya nish. Same vabe save er shomoy F paile null banaya db te pathabi
//     S: 'Sent to Bank',
//     H: 'Honor',
//     D: 'Dishonor',
//     B: 'Adjusted with Balance',
//   };

//   const chequeDetailGridColumns = useMemo<MRT_ColumnDef<IChequeDetailInfo>[]>(
//     () => [
//       {
//         id: 'delete', // access nested data with dot notation
//         header: '',
//         size: 1, // small column
//         grow: false,
//         // muiTableBodyCellProps: ({ cell, column, row }) => {
//         //   let bgCellColor = 'fafafc';
//         //   if (
//         //     isTheFieldDisabled(
//         //       // row.original.productGroupId || 0,
//         //       row.original.productId || 0
//         //       // row.original.brandId || 0
//         //     )
//         //   ) {
//         //     bgCellColor = '#f0f0f0';
//         //   }

//         //   return {
//         //     sx: {
//         //       backgroundColor: `${bgCellColor}`,
//         //     },
//         //   };
//         // },
//         // enableSorting: false,
//         // enableColumnActions: false,
//         // enableResizing: false,
//         // enableColumnFilter: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => (
//           <div className="w-full flex justify-center">
//             <Tooltip
//               className={
//                 // row.original.productGroupId ||
//                 row.original.chequeNo ? 'visible' : 'invisible'
//               }
//               arrow
//               placement="right"
//               title="Delete"
//             >
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   // handleDeleteRow(row.index, row.original);
//                   if (row.original.chequeDetailId) {
//                     const tempDeletedObj: IDeleteChequeDetailCommand = {
//                       chequeDetailId: row.original.chequeDetailId,
//                       collectionId: detailEditModalInfo?.collectionId,
//                       chequeNo: row.original.chequeNo,
//                     };

//                     // // tax/vat delete from chequeDetailTax
//                     // const deleteArrayChequeDetailTax: IDeleteChequeDetailTaxCommand[] =
//                     //   [];
//                     // if (row.original.taxRowId) {
//                     //   const tempObj: IDeleteChequeDetailTaxCommand = {
//                     //     chequeDetailTaxId: row.original.taxRowId,
//                     //     salesOrderId: row.original.salesOrderId,
//                     //   };
//                     //   deleteArrayChequeDetailTax.push(tempObj);
//                     // }

//                     // if (row.original.vatRowId) {
//                     //   const tempObj: IDeleteChequeDetailTaxCommand = {
//                     //     chequeDetailTaxId: row.original.vatRowId,
//                     //     salesOrderId: row.original.salesOrderId,
//                     //   };
//                     //   deleteArrayChequeDetailTax.push(tempObj);
//                     // }
//                     // // tax/vat delete from chequeDetailTax...ENDS....

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
//         accessorFn: (row) => row.chequeNo ?? '', // access nested data with dot notation
//         id: 'chequeNo',
//         enableGlobalFilter: columnVisibility?.chequeNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         // size: 200,
//         header: 'Cheque No',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: '0.8125rem' },
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
//                 chequeDetailGrid[row.index].chequeNo = e.target.value;
//                 checkAndSetChequeDetailTableValues(row.index);
//                 // checkAndSetTableValues(row.index);
//               }}
//             />
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.bankName ?? '',
//         id: 'bankName',
//         enableGlobalFilter: columnVisibility?.bankName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         header: 'Bank Name',
//         // muiTableBodyCellProps: ({ cell, column, row }) => {
//         //   let bgCellColor = 'fafafc';
//         //   if (
//         //     isTheFieldDisabled(
//         //       row.original.productGroupId || 0,
//         //       row.original.productId || 0,
//         //       row.original.brandId || 0
//         //     )
//         //   ) {
//         //     bgCellColor = '#f0f0f0';
//         //   }

//         //   return {
//         //     sx: {
//         //       backgroundColor: `${bgCellColor}`,
//         //     },
//         //   };
//         // },
//         Cell: ({ cell, row }) => {
//           // ekhane error er value and message set korbi

//           const currentBank = {
//             bankId: row.original.bankId || 0,
//             bankName: row.original.bankName || '',
//           };
//           // setValue(`product_row${row.index}`, currentProduct);
//           return (
//             <Controller
//               name={`bank_row${row.index}`}
//               control={control}
//               rules={
//                 {
//                   // required: '*Required',
//                   // validate: (value) => validateProduct(value, row.original),
//                 }
//               }
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
//                   } // making sure that the array is unique by bankName, else autocomplete search ultapalta behave kore
//                   value={currentBank}
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   // disabled={isTheFieldDisabled(
//                   //   row.original.productGroupId || 0,
//                   //   row.original.productId || 0,
//                   //   row.original.brandId || 0
//                   // )}
//                   clearOnEscape
//                   // disableClearable
//                   freeSolo
//                   // loading={row.original.loading || false}
//                   onChange={(event, selectedOption: any) => {
//                     // handleProductChange(newValue as string, row.index)

//                     chequeDetailGrid[row.index].bankId =
//                       selectedOption?.bankId || null;
//                     chequeDetailGrid[row.index].bankName =
//                       selectedOption?.bankName || '';

//                     checkAndSetChequeDetailTableValues(row.index);
//                     // setValue(`product_row${row.index}`, selectedOption);
//                     onChange(selectedOption);
//                   }}
//                   onBlur={onBlur} // Trigger validation on blur
//                   isOptionEqualToValue={(options, selectedOption) =>
//                     options.productId === selectedOption.productId
//                   }
//                   getOptionLabel={(option: any) =>
//                     option ? option.productName : ''
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       // label="Product"

//                       // onFocus={() => handleProductFocus(row.index)}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: '0.8125rem' },
//                         disableUnderline: true,
//                         // endAdornment: (
//                         //   <>
//                         //     {row.original.loading ? (
//                         //       <CircularProgress color="inherit" size={20} />
//                         //     ) : null}
//                         //     {params.InputProps.endAdornment}
//                         //   </>
//                         // ),
//                       }}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: '0.625rem', // Set the font size
//                           marginTop: 0, // Set the margin
//                           color: 'red', // Set the color (example)
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

//                       // Remove underline
//                       '& .MuiInputBase-root:before, & .MuiInputBase-root:after':
//                         {
//                           borderBottom: 'none',
//                         },

//                       // Hide placeholder by default
//                       '& .MuiInputBase-input::placeholder': {
//                         opacity: 0,
//                         color: '#bdbdbd', // light grey placeholder
//                         transition: 'opacity .2s ease',
//                       },

//                       // Show placeholder only on hover
//                       '&:hover .MuiInputBase-input::placeholder': {
//                         opacity: 1,
//                       },

//                       // Hide icon by default
//                       '& .MuiIconButton-root': {
//                         opacity: 0,
//                         transition: 'opacity .2s ease',
//                       },

//                       // Show icon on hover
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
//                       placeholder: 'dd/mm/yyyy', // we override it manually
//                     }}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.chequeAmount ?? '', // access nested data with dot notation
//         id: 'chequeAmount',
//         enableGlobalFilter: columnVisibility?.chequeAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
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
//                 style: { fontSize: '0.8125rem' },
//                 disableUnderline: true,
//                 // readOnly: isTheFieldDisabled(
//                 //   row.original.productGroupId || 0,
//                 //   row.original.productId || 0,
//                 //   row.original.brandId || 0
//                 // ),
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
//         enableGlobalFilter: columnVisibility?.cqdCollected, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         header: 'Status',
//         // muiTableBodyCellProps: ({ cell, column, row }) => {
//         //   let bgCellColor = 'fafafc';
//         //   if (
//         //     isTheFieldDisabled(
//         //       row.original.productGroupId || 0,
//         //       row.original.productId || 0,
//         //       row.original.brandId || 0
//         //     )
//         //   ) {
//         //     bgCellColor = '#f0f0f0';
//         //   }

//         //   return {
//         //     sx: {
//         //       backgroundColor: `${bgCellColor}`,
//         //     },
//         //   };
//         // },
//         Cell: ({ cell, row }) => {
//           // ekhane error er value and message set korbi
//           // S: 'Sent to Bank',
//           //     H: 'Honor',
//           //     D: 'Dishonor',
//           //     B: 'Adjusted with Balance',
//           const currentStatus = {
//             cqdCollectedId: row.original.cqdCollected || 0,
//             cqdCollectedName: statusMap[row.original.cqdCollected || ''] || '',
//           };

//           // setValue(`product_row${row.index}`, currentProduct);
//           return (
//             <Controller
//               name={`cqdCollected_row${row.index}`}
//               control={control}
//               rules={
//                 {
//                   // required: '*Required',
//                   // validate: (value) => validateProduct(value, row.original),
//                 }
//               }
//               render={({
//                 field: { onChange, onBlur, value, ref },
//                 fieldState: { error },
//               }) => (
//                 <Autocomplete
//                   options={[
//                     { cqdCollectedId: 'F', cqdCollectedName: 'Fresh Check' },
//                     { cqdCollectedId: 'S', cqdCollectedName: 'Sent to Bank' },
//                     { cqdCollectedId: 'H', cqdCollectedName: 'Honor' },
//                     { cqdCollectedId: 'D', cqdCollectedName: 'Dishonor' },
//                     {
//                       cqdCollectedId: 'B',
//                       cqdCollectedName: 'Adjusted with Balance',
//                     },
//                   ]} // making sure that the array is unique by bankName, else autocomplete search ultapalta behave kore
//                   value={currentStatus}
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   // disabled={isTheFieldDisabled(
//                   //   row.original.productGroupId || 0,
//                   //   row.original.productId || 0,
//                   //   row.original.brandId || 0
//                   // )}
//                   clearOnEscape
//                   // disableClearable
//                   freeSolo
//                   // loading={row.original.loading || false}
//                   onChange={(event, selectedOption: any) => {
//                     // handleProductChange(newValue as string, row.index)

//                     chequeDetailGrid[row.index].cqdCollected =
//                       selectedOption?.cqdCollectedId || null;

//                     checkAndSetChequeDetailTableValues(row.index);
//                     // setValue(`product_row${row.index}`, selectedOption);
//                     onChange(selectedOption);
//                   }}
//                   onBlur={onBlur} // Trigger validation on blur
//                   isOptionEqualToValue={(options, selectedOption) =>
//                     options.productId === selectedOption.productId
//                   }
//                   getOptionLabel={(option: any) =>
//                     option ? option.productName : ''
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       // label="Product"

//                       // onFocus={() => handleProductFocus(row.index)}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: '0.8125rem' },
//                         disableUnderline: true,
//                         // endAdornment: (
//                         //   <>
//                         //     {row.original.loading ? (
//                         //       <CircularProgress color="inherit" size={20} />
//                         //     ) : null}
//                         //     {params.InputProps.endAdornment}
//                         //   </>
//                         // ),
//                       }}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: '0.625rem', // Set the font size
//                           marginTop: 0, // Set the margin
//                           color: 'red', // Set the color (example)
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
//         accessorFn: (row) => row.sendBankName ?? '',
//         id: 'sendBankName',
//         enableGlobalFilter: columnVisibility?.sendBankName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         header: 'Send Bank Name',
//         // muiTableBodyCellProps: ({ cell, column, row }) => {
//         //   let bgCellColor = 'fafafc';
//         //   if (
//         //     isTheFieldDisabled(
//         //       row.original.productGroupId || 0,
//         //       row.original.productId || 0,
//         //       row.original.brandId || 0
//         //     )
//         //   ) {
//         //     bgCellColor = '#f0f0f0';
//         //   }

//         //   return {
//         //     sx: {
//         //       backgroundColor: `${bgCellColor}`,
//         //     },
//         //   };
//         // },
//         Cell: ({ cell, row }) => {
//           // ekhane error er value and message set korbi

//           const currentSendBank = {
//             bankId: row.original.sendBankId || 0,
//             bankName: row.original.sendBankName || '',
//           };
//           // setValue(`product_row${row.index}`, currentProduct);
//           return (
//             <Controller
//               name={`sendbank_row${row.index}`}
//               control={control}
//               rules={
//                 {
//                   // required: '*Required',
//                   // validate: (value) => validateProduct(value, row.original),
//                 }
//               }
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
//                   } // making sure that the array is unique by bankName, else autocomplete search ultapalta behave kore
//                   value={currentSendBank}
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   // disabled={isTheFieldDisabled(
//                   //   row.original.productGroupId || 0,
//                   //   row.original.productId || 0,
//                   //   row.original.brandId || 0
//                   // )}
//                   clearOnEscape
//                   // disableClearable
//                   freeSolo
//                   // loading={row.original.loading || false}
//                   onChange={(event, selectedOption: any) => {
//                     // handleProductChange(newValue as string, row.index)

//                     chequeDetailGrid[row.index].sendBankId =
//                       selectedOption?.bankId || null;
//                     chequeDetailGrid[row.index].sendBankName =
//                       selectedOption?.bankName || '';

//                     checkAndSetChequeDetailTableValues(row.index);
//                     // setValue(`product_row${row.index}`, selectedOption);
//                     onChange(selectedOption);
//                   }}
//                   onBlur={onBlur} // Trigger validation on blur
//                   isOptionEqualToValue={(options, selectedOption) =>
//                     options.productId === selectedOption.productId
//                   }
//                   getOptionLabel={(option: any) =>
//                     option ? option.productName : ''
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       // label="Product"

//                       // onFocus={() => handleProductFocus(row.index)}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: '0.8125rem' },
//                         disableUnderline: true,
//                         // endAdornment: (
//                         //   <>
//                         //     {row.original.loading ? (
//                         //       <CircularProgress color="inherit" size={20} />
//                         //     ) : null}
//                         //     {params.InputProps.endAdornment}
//                         //   </>
//                         // ),
//                       }}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: '0.625rem', // Set the font size
//                           marginTop: 0, // Set the margin
//                           color: 'red', // Set the color (example)
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
//         accessorFn: (row) => row.disreason ?? '', // access nested data with dot notation
//         // accessorKey: 'approved', // access nested data with dot notation
//         id: 'taxAmount',
//         enableGlobalFilter: columnVisibility?.taxAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         header: 'Disreason',
//         // size: 1, // smalldisreasoncolumn
//         size: 120,
//         // muiTableBodyCellProps: ({ cell, column, row }) => {
//         //   let bgCellColor = 'fafafc';
//         //   if (
//         //     isTheFieldDisabled(
//         //       row.original.productGroupId || 0,
//         //       row.original.productId || 0,
//         //       row.original.brandId || 0
//         //     )
//         //   ) {
//         //     bgCellColor = '#f0f0f0';
//         //   }

//         //   return {
//         //     sx: {
//         //       backgroundColor: `${bgCellColor}`,
//         //     },
//         //   };
//         // },
//         grow: false,
//         // enableSorting: false,
//         // enableColumnActions: false,
//         // enableResizing: false,
//         // enableColumnFilter: false,

//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),

//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: '0.8125rem' },
//                 disableUnderline: true,
//                 // readOnly: isTheFieldDisabled(
//                 //   row.original.productGroupId || 0,
//                 //   row.original.productId || 0,
//                 //   row.original.brandId || 0
//                 // ),
//                 readOnly:
//                   !row.original.chequeNo && row.original.cqdCollected !== 'D',
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
//         accessorFn: (row) => row.remarks ?? '', // access nested data with dot notation
//         // accessorKey: 'approved', // access nested data with dot notation
//         id: 'remarks',
//         enableGlobalFilter: columnVisibility?.remarks, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         header: 'Remarks',
//         // size: 1, // small column
//         size: 120,
//         grow: false,
//         // enableSorting: false,
//         // enableColumnActions: false,
//         // enableResizing: false,
//         // enableColumnFilter: false,

//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),

//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: '0.8125rem' },
//                 disableUnderline: true,
//                 // readOnly: isTheFieldDisabled(
//                 //   row.original.productGroupId || 0,
//                 //   row.original.productId || 0,
//                 //   row.original.brandId || 0
//                 // ),
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
//       // PopperMy,
//       // checkAndSetChequeDetailTableValues,
//       // columnVisibility?.price,
//       // columnVisibility?.productName,
//       // columnVisibility?.quantity,
//       // control,
//       // deletedRowChequeDetail,
//       // productComboOptions,
//       // chequeDetailGrid,
//       PopperMy,
//       checkAndSetChequeDetailTableValues,
//       chequeDetailGrid,
//     ]
//   );

//   // ---------- material table virtualization---------

//   // optionally access the underlying virtualizer instance
//   const rowVirtualizerInstanceRef =
//     useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
//   // useEffect(() => {
//   //   if (typeof window !== 'undefined' && tableDataLoading === false) {
//   //     // setData(makeData(10_000));
//   //     setIsLoading(false);
//   //   }
//   // }, [tableDataLoading]);   //--------ei code ta getGridData anar j api, oitay ei if er condition ta add koira dite hobe
//   useEffect(() => {
//     // scroll to the top of the table when the sorting changes
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
//       //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//       data: chequeDetailGrid || [],
//       state: {
//         // isLoading:
//         //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
//         columnVisibility,
//         isLoading: isChequeDetailGridLoading,
//         sorting: sortingChequeDetailGrid,
//         // rowSelection: selectedBepcRow,
//       },
//       // enableRowOrdering: true,
//       positionToolbarAlertBanner: 'none',
//       // enableSorting: false, // usually you do not want to sort when re-ordering
//       onColumnVisibilityChange: setColumnVisibility,
//       muiSkeletonProps: {
//         animation: 'pulse',
//         height: '1.875rem',
//       },
//       //   enableRowSelection: (row) => {
//       //     // if (row.original.lastProcessedDate) {
//       //     //   toast.warning(
//       //     //     'You cannot select/calculate commission for this buyer, as this is already processed before'
//       //     //   );
//       //     // }
//       //     return !!row.original.salesOrderId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
//       //   }, // enable row selection conditionally per row
//       // enableRowSelection: true,
//       enableRowVirtualization: true,
//       enableBottomToolbar: false,
//       enableColumnResizing: true,
//       enableGlobalFilterModes: true,
//       enableFilterMatchHighlighting: false, // disable filter match highlighting
//       enablePagination: false,
//       enableRowNumbers: false,
//       enableColumnPinning: true,
//       enableStickyHeader: true,
//       layoutMode: 'grid',
//       initialState: {
//         density: 'compact',
//       },
//       muiTablePaperProps: {
//         elevation: 0, // change the mui box shadow
//         // customize paper styles
//         sx: {
//           borderRadius: '0',
//           border: '1px dashed #e0e0e0',
//         },
//       },
//       muiTableBodyCellProps: {
//         sx: {
//           // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
//           fontSize: '0.8125rem',
//           color: '#ea1143',
//         },
//       },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0', // add a border between columns
//           // borderLeft: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           // borderBottom: '1px solid #e0e0e0',
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
//           {/* built-in buttons (must pass in table prop for them to work!) */}
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
//               onClick={() => {
//                 //   handleExportData(
//                 //     buyerSalesRptGridState,
//                 //     salesOrderGridColumns
//                 //   );
//                 // const buyerSalesRptGridInfoWithoutEmpty =
//                 //   buyerSalesRptGridInfo.filter(
//                 //     (row) => row.employeeId
//                 //   );
//                 handleExportData(chequeDetailGrid, chequeDetailGridColumns);
//               }}
//             >
//               <i className="fas fa-file-excel" />
//             </button>
//           </div>
//           {/* add your own custom print button or something */}
//         </>
//       ),

//       //   renderTopToolbarCustomActions: ({ table }) => (
//       //     <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">

//       //     </div>
//       //   ),
//       onSortingChange: setSortingChequeDetailGrid,
//       rowVirtualizerInstanceRef, // optional
//       rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
//     });

//   return (
//     <div className="mt-16 md:mt-2">
//       <div className="m-2 flex justify-center">
//         <div className="block w-[100%]">
//           {/* Main Card */}
//           <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//             <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//               {/* -----[Laboratory experimental place starts here]----- */}
//               <div className="font-semibold">Sales Order Detail</div>
//               <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
//                 Collection No:{' '}
//                 {detailEditModalInfo?.collectionInfoGridRow?.collectionNo}
//               </div>
//               <div className="text-sm font-thin text-gray-600 dark:text-gray-400">
//                 Buyer: {detailEditModalInfo?.collectionInfoGridRow?.buyerName}
//               </div>
//               {/* ---//--[Laboratory experimental place ENDS here]----- */}
//             </div>
//             {/* Main Card header--/-- */}

//             {/* Main Card body */}
//             <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
//               <div className="w-full m-1 modifiedEditTable">
//                 <MaterialReactTable table={chequeDetailGridInitializer} />
//               </div>
//             </div>
//             {/* Main Card Body--/-- */}

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
//             {/* Main Card footer--/-- */}
//           </div>
//           {/* Main Card--/-- */}
//         </div>
//       </div>

//       {/* // modals --- out of html normal body/position */}

//       {/* // modals --- out of html normal body/position */}
//     </div>
//   );
// };

// export default ChequeDetail;
