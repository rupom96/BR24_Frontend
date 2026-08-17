// /* eslint-disable operator-assignment */
// /* eslint-disable no-plusplus */
// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable no-param-reassign */
// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable react/jsx-props-no-spreading */
// import {
//   Autocomplete,
//   Box,
//   IconButton,
//   Input,
//   InputAdornment,
//   Modal,
//   Popper,
//   Slider,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { Controller, useForm, useWatch } from 'react-hook-form';
// import { toast } from 'react-toastify';
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
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';
// import { ExportToCsv } from 'export-to-csv';

// import { Delete, Edit } from '@mui/icons-material';
// import CloseIcon from '@mui/icons-material/Close';
// import Swal from 'sweetalert2';
// import {
//   useGetSupplierForComboByCompanyLocationIdQuery,
//   useLazyGetSupplierByCompanyLocationIdQuery,
//   // useLazyGetSupplierGroupByCompanySupplierSalesPersonDepartmentIdQuery,
// } from '../../../infrastructure/api/SupplierApiSlice';
// // import { ISupplierGroup } from '../../../domain/interfaces/SupplierGroupInterface';
// import { ISupplier } from '../../../domain/interfaces/SupplierInterface';
// import { ISalesPersonComboBox } from '../../../domain/interfaces/SalesPersonInterface';
// import { IDepartment } from '../../../domain/interfaces/DepartmentInterface';
// import {
//   ICreatePurchaseReturnDetailSerialCommand,
//   ICreatePurchaseReturnDetailCommand,
//   ICreatePurchaseReturnDetailTaxCommand,
//   IDeletePurchaseReturnDetailSerialCommand,
//   IDeletePurchaseReturnCommand,
//   IDeletePurchaseReturnDetailCommand,
//   IDeletePurchaseReturnDetailTaxCommand,
//   IGetPurchaseReturnInfoFilterDto,
//   IPurchaseReturn,
//   IPurchaseReturnDetailInfo,
//   IPurchaseReturnInfo,
//   IPurchaseReturnProcessCommandsVM,
//   IUpdatePurchaseReturnCommand,
//   IUpdatePurchaseReturnDetailCommand,
//   IUpdatePurchaseReturnDetailTaxCommand,
// } from '../../../domain/interfaces/PurchaseReturnInterface';
// // import { useLazyGetSalesPersonByCompanyLocationSupplierIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
// import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';
// import { useLazyGetPaymentModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';
// import {
//   useLazyGetPurchaseReturnInfoQuery,
//   useProcessSavePurchaseReturnMutation,
// } from '../../../infrastructure/api/PurchaseReturnApiSlice';
// import PurchaseReturnDetail from './PurchaseReturnDetail/PurchaseReturnDetail';

// type Props = {};

// const SalesReturnEdit = ({
//   modalPageOpenerClose,
//   clickedCardInfo,
//   operationMode,
// }: any) => {
//   const biznessEventName = clickedCardInfo?.biznessEventName.replace(
//     /([A-Z])(?=[A-Z][a-z])/g,
//     '$1 '
//   );

//   // const {
//   //   register,
//   //   getValues,
//   //   reset,
//   //   control,
//   //   watch,
//   //   setValue,
//   //   setError,
//   //   clearErrors,
//   //   handleSubmit,
//   //   trigger,
//   //   formState: { errors },
//   // } = useForm<FormValues>({
//   //   mode: 'onChange', // Validation will trigger on blur
//   //   defaultValues: {
//   //     supplier: null,
//   //     salesPerson: null,
//   //     supplierGroup: null,
//   //     department: null,
//   //     dateFrom: dayjs().format(),
//   //     dateTo: dayjs().format(),
//   //   },
//   // });
//   const {
//     register,
//     getValues,
//     reset,
//     control,
//     watch,
//     setValue,
//     setError,
//     clearErrors,
//     handleSubmit,
//     trigger,
//     formState: { errors },
//   } = useForm();

//   // Watch for changes in the entire form
//   const watchedFields = useWatch({ control });
//   const navigate = useNavigate();
//   let userInfo: any;
//   const jsonUserInfo = localStorage.getItem('userInfo');
//   if (jsonUserInfo) {
//     userInfo = JSON.parse(jsonUserInfo);
//   }

//   if (!userInfo?.securityUserId) {
//     if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('brFeature');
//     }
//     navigate('/loginUsername');
//   }

//   //   const [selectedSupplier, setSelectedSupplier] = useState();
//   //   const [selectedSupplierGroup, setSelectedSupplierGroup] = useState();
//   //   const [selectedDepartment, setSelectedDepartment] = useState();
//   //   const [selectedSalesPerson, setSelectedSalesPerson] = useState();
//   //   const [dateFrom, setDateFrom] = useState();
//   //   const [dateTo, setDateTo] = useState();

//   const [purchaseReturnGrid, setPurchaseReturnGrid] = useState<
//     IPurchaseReturnInfo[]
//   >([]);
//   const [purchaseReturnGridPrev, setPurchaseReturnGridPrev] = useState<
//     IPurchaseReturnInfo[]
//   >([]);
//   // const [deletedPurchaseReturnRows, setDeletedPurchaseReturnRows] = useState<
//   //   IDeletePurchaseReturnCommand[]
//   // >([]);

//   const [columnVisibility, setColumnVisibility] = useState<any>([]);

//   const [purchaseReturnDetailRows, setPurchaseReturnDetailRows] = useState<
//     IPurchaseReturnDetailInfo[]
//   >([]);
//   const [deletedPurchaseReturnDetailRows, setDeletedPurchaseReturnDetailRows] =
//     useState<IDeletePurchaseReturnDetailCommand[]>([]);

//   const [
//     deletedPurchaseReturnDetailSerialRows,
//     setDeletedPurchaseReturnDetailSerialRows,
//   ] = useState<IDeletePurchaseReturnDetailSerialCommand[]>([]);

//   const [
//     deletedPurchaseReturnDetailTaxRows,
//     setDeletedPurchaseReturnDetailTaxRows,
//   ] = useState<IDeletePurchaseReturnDetailTaxCommand[]>([]);

//   // type FormValues = {
//   //   supplierGroup: ISupplierGroup | null;
//   //   supplier: ISupplier | null;
//   //   salesPerson: ISalesPersonComboBox | null;
//   //   department: IDepartment | null;
//   //   dateFrom: string | null;
//   //   dateTo: string | null;
//   // };

//   //   grid virtualization states
//   const [isPurchaseReturnGridLoading, setIsPurchaseReturnGridLoading] =
//     useState(true);
//   const [sortingPurchaseReturnGrid, setSortingPurchaseReturnGrid] =
//     useState<MRT_SortingState>([]);

//   const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

//   const [deletedSerials, setDeletedSerials] = useState<
//     IDeletePurchaseReturnDetailSerialCommand[]
//   >([]);

//   const taxOverTemp = useWatch({ control, name: 'taxOver' });
//   const taxUnderTemp = useWatch({ control, name: 'taxUnder' });
//   const amountOverTemp = useWatch({ control, name: 'amountOver' });
//   const amountUnderTemp = useWatch({ control, name: 'amountUnder' });
//   const profitabilityTemp = useWatch({ control, name: 'profitability' });

//   // -----------------------------------API HOOK INIT-----------------------------------------

//   const [
//     triggerGetSupplier,
//     {
//       data: supplierOptionsData,
//       error: supplierOptionsError,
//       isError: supplierOptionsIsError,
//       isSuccess: supplierOptionsIsSuccess,
//       isLoading: supplierOptionsIsLoading,
//       isFetching: supplierOptionsIsFetching,
//     },
//   ] = useLazyGetSupplierByCompanyLocationIdQuery(); // RTK Query lazy fetch

//   useEffect(() => {
//     if (supplierOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching supplierOptionsData, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching supplierOptionsData, see console--->:'
//       );
//       console.log(supplierOptionsError);
//     }
//     if (supplierOptionsIsSuccess) {
//       console.log('supplierOptionsIsSuccess');

//       // // ---- here if the selected autocomp options isn't available in the options, then set null.......
//       // const { supplier } = watchedFields;
//       // if (supplier?.supplierId) {
//       //   const exists = supplierOptionsData?.some(
//       //     (supplierRow) => supplierRow.supplierId === supplier.supplierId
//       //   );
//       //   if (!exists && supplier != null && supplier.supplierId !== 0) {
//       //     setValue('supplier', null);
//       //   }
//       // }
//       // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

//       // // ---- here if the result only contains one result, autoSet.......
//       // if (
//       //   supplierOptionsData &&
//       //   supplierOptionsData?.length === 1 &&
//       //   supplierOptionsData?.[0].supplierId !== supplier?.supplierId &&
//       //   // supplier != null &&
//       //   supplier?.supplierId !== 0
//       // ) {
//       //   setValue('supplier', supplierOptionsData[0]);
//       // }
//       // // ---- here if the result only contains one result, autoSet----- ENDS...

//       console.log(supplierOptionsData);
//     }
//   }, [
//     supplierOptionsData,
//     supplierOptionsIsLoading,
//     supplierOptionsError,
//     supplierOptionsIsError,
//     supplierOptionsIsFetching,
//     supplierOptionsIsSuccess,
//   ]);

//   // const [
//   //   triggerGetSupplierGroup,
//   //   {
//   //     data: supplierGroupOptionsData,
//   //     error: supplierGroupOptionsError,
//   //     isError: supplierGroupOptionsIsError,
//   //     isSuccess: supplierGroupOptionsIsSuccess,
//   //     isLoading: supplierGroupOptionsIsLoading,
//   //     isFetching: supplierGroupOptionsIsFetching,
//   //   },
//   // ] = useLazyGetSupplierGroupByCompanySupplierSalesPersonDepartmentIdQuery(); // RTK Query lazy fetch

//   // useEffect(() => {
//   //   if (supplierGroupOptionsIsError) {
//   //     toast.error(
//   //       'Something wrong from backend while fetching supplierGroupOptionsData, see console!'
//   //     );
//   //     console.log(
//   //       'Something wrong from backend while fetching supplierGroupOptionsData, see console--->:'
//   //     );
//   //     console.log(supplierGroupOptionsError);
//   //   }
//   //   if (supplierGroupOptionsIsSuccess) {
//   //     console.log('supplierGroupOptionsIsSuccess');
//   //     console.log(supplierGroupOptionsData);
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
//   //     // const { supplierGroup } = watchedFields;
//   //     // if (supplierGroupOptionsData && supplierGroup?.supplierGroupId) {
//   //     //   const exists = supplierGroupOptionsData?.some(
//   //     //     (supplierGroupRow) =>
//   //     //       supplierGroupRow.supplierGroupId === supplierGroup.supplierGroupId
//   //     //   );
//   //     //   if (!exists && supplierGroup != null && supplierGroup.supplierGroupId !== 0) {
//   //     //     setValue('supplierGroup', null);
//   //     //   }
//   //     // }
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
//   //     // // ---- here if the result only contains one result, autoSet.......
//   //     // if (
//   //     //   supplierGroupOptionsData &&
//   //     //   supplierGroupOptionsData.length === 1 &&
//   //     //   supplierGroupOptionsData?.[0].supplierGroupId !== supplierGroup?.supplierGroupId &&
//   //     //   // supplierGroup != null &&
//   //     //   supplierGroup?.supplierGroupId !== 0
//   //     // ) {
//   //     //   setValue('supplierGroup', supplierGroupOptionsData?.[0]);
//   //     // }
//   //     // // ---- here if the result only contains one result, autoSet----- ENDS...
//   //   }
//   // }, [
//   //   supplierGroupOptionsData,
//   //   supplierGroupOptionsIsLoading,
//   //   supplierGroupOptionsError,
//   //   supplierGroupOptionsIsError,
//   //   supplierGroupOptionsIsFetching,
//   //   supplierGroupOptionsIsSuccess,
//   // ]);

//   // const [
//   //   triggerGetSalesPerson,
//   //   {
//   //     data: salesPersonOptionsData,
//   //     error: salesPersonOptionsError,
//   //     isError: salesPersonOptionsIsError,
//   //     isSuccess: salesPersonOptionsIsSuccess,
//   //     isLoading: salesPersonOptionsIsLoading,
//   //     isFetching: salesPersonOptionsIsFetching,
//   //   },
//   // ] = useLazyGetSalesPersonByCompanyLocationSupplierIdQuery(); // RTK Query lazy fetch

//   // useEffect(() => {
//   //   if (salesPersonOptionsIsError) {
//   //     toast.error(
//   //       'Something wrong from backend while fetching salesPersonOptionsData, see console!'
//   //     );
//   //     console.log(
//   //       'Something wrong from backend while fetching salesPersonOptionsData, see console--->:'
//   //     );
//   //     console.log(salesPersonOptionsError);
//   //   }
//   //   if (salesPersonOptionsIsSuccess) {
//   //     console.log('salesPersonOptionsIsSuccess');
//   //     console.log(salesPersonOptionsData);
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
//   //     // const { salesPerson } = watchedFields;
//   //     // if (salesPersonOptionsData && salesPerson?.employeeId) {
//   //     //   const exists = salesPersonOptionsData?.some(
//   //     //     (salesPersonRow) =>
//   //     //       salesPersonRow.employeeId === salesPerson.employeeId
//   //     //   );
//   //     //   if (!exists && salesPerson != null && salesPerson.employeeId !== 0) {
//   //     //     setValue('salesPerson', null);
//   //     //   }
//   //     // }
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
//   //     // // ---- here if the result only contains one result, autoSet.......
//   //     // if (
//   //     //   salesPersonOptionsData &&
//   //     //   salesPersonOptionsData?.length === 1 &&
//   //     //   salesPersonOptionsData?.[0].employeeId !== salesPerson?.employeeId &&
//   //     //   // salesPerson != null &&
//   //     //   salesPerson?.employeeId !== 0
//   //     // ) {
//   //     //   setValue('salesPerson', salesPersonOptionsData?.[0]);
//   //     // }
//   //     // // ---- here if the result only contains one result, autoSet----- ENDS...
//   //   }
//   // }, [
//   //   salesPersonOptionsData,
//   //   salesPersonOptionsIsLoading,
//   //   salesPersonOptionsError,
//   //   salesPersonOptionsIsError,
//   //   salesPersonOptionsIsFetching,
//   //   salesPersonOptionsIsSuccess,
//   // ]);

//   // const [
//   //   triggerGetPaymentModeOptions,
//   //   {
//   //     data: paymentModeOptionsData,
//   //     error: paymentModeOptionsError,
//   //     isError: paymentModeOptionsIsError,
//   //     isSuccess: paymentModeOptionsIsSuccess,
//   //     isLoading: paymentModeOptionsIsLoading,
//   //     isFetching: paymentModeOptionsIsFetching,
//   //   },
//   // ] = useLazyGetPaymentModeQuery(); // RTK Query lazy fetch

//   // useEffect(() => {
//   //   if (paymentModeOptionsIsError) {
//   //     toast.error(
//   //       'Something wrong from backend while fetching paymentModeOptionsData, see console!'
//   //     );
//   //     console.log(
//   //       'Something wrong from backend while fetching paymentModeOptionsData, see console--->:'
//   //     );
//   //     console.log(paymentModeOptionsError);
//   //   }
//   //   if (paymentModeOptionsIsSuccess) {
//   //     console.log('paymentModeOptionsIsSuccess');
//   //     console.log(paymentModeOptionsData);
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
//   //     // const { paymentMode } = watchedFields;
//   //     // if (paymentModeOptionsData && paymentMode?.employeeId) {
//   //     //   const exists = paymentModeOptionsData?.some(
//   //     //     (paymentModeRow) =>
//   //     //       paymentModeRow.employeeId === paymentMode.employeeId
//   //     //   );
//   //     //   if (!exists && paymentMode != null && paymentMode.employeeId !== 0) {
//   //     //     setValue('paymentMode', null);
//   //     //   }
//   //     // }
//   //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
//   //     // // ---- here if the result only contains one result, autoSet.......
//   //     // if (
//   //     //   paymentModeOptionsData &&
//   //     //   paymentModeOptionsData?.length === 1 &&
//   //     //   paymentModeOptionsData?.[0].employeeId !== paymentMode?.employeeId &&
//   //     //   // paymentMode != null &&
//   //     //   paymentMode?.employeeId !== 0
//   //     // ) {
//   //     //   setValue('paymentMode', paymentModeOptionsData?.[0]);
//   //     // }
//   //     // // ---- here if the result only contains one result, autoSet----- ENDS...
//   //   }
//   // }, [
//   //   paymentModeOptionsData,
//   //   paymentModeOptionsIsLoading,
//   //   paymentModeOptionsError,
//   //   paymentModeOptionsIsError,
//   //   paymentModeOptionsIsFetching,
//   //   paymentModeOptionsIsSuccess,
//   // ]);

//   const [
//     triggerGetPurchaseReturnInfo,
//     {
//       data: purchaseReturnInfoData,
//       error: purchaseReturnInfoError,
//       isError: purchaseReturnInfoIsError,
//       isSuccess: purchaseReturnInfoIsSuccess,
//       isLoading: purchaseReturnInfoIsLoading,
//       isFetching: purchaseReturnInfoIsFetching,
//     },
//   ] = useLazyGetPurchaseReturnInfoQuery(); // RTK Query lazy fetch

//   useEffect(() => {
//     if (purchaseReturnInfoIsError) {
//       toast.error(
//         'Something wrong from backend while fetching purchaseReturnInfoData, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching purchaseReturnInfoData, see console--->:'
//       );
//       console.log(purchaseReturnInfoError);

//       const data: IPurchaseReturnInfo[] = [];

//       // Fill remaining with empty rows
//       while (data.length < 10) {
//         data.push({
//           purchaseReturnId: '',
//           purchaseReturnNo: '',
//           // purchaseOrderNo: '',
//           dateOfEntry: '',
//           supplierId: 0,
//           supplierName: '',
//           // supplierGroupId: 0,
//           // supplierGroupName: '',
//           total: null,
//           vat: null,
//           tax: null,
//           remarks: '',
//           locationId: null,
//         });
//       }
//       setPurchaseReturnGrid([...data]);
//       setPurchaseReturnGridPrev([]);

//       setIsPurchaseReturnGridLoading(false);
//     }
//     if (
//       purchaseReturnInfoIsSuccess &&
//       typeof window !== 'undefined' &&
//       !purchaseReturnInfoIsLoading &&
//       !purchaseReturnInfoIsError &&
//       !purchaseReturnInfoIsFetching
//     ) {
//       console.log('purchaseReturnInfoIsSuccess');
//       console.log(purchaseReturnInfoData);

//       const data: IPurchaseReturnInfo[] = JSON.parse(
//         JSON.stringify([...(purchaseReturnInfoData || [])])
//       );
//       const data2: IPurchaseReturnInfo[] = JSON.parse(
//         JSON.stringify([...(purchaseReturnInfoData || [])])
//       );

//       // Fill remaining with empty rows
//       while (data.length < 10) {
//         data.push({
//           purchaseReturnId: '',
//           purchaseReturnNo: '',
//           // purchaseOrderNo: '',
//           dateOfEntry: '',
//           supplierId: 0,
//           supplierName: '',
//           // supplierGroupId: 0,
//           // supplierGroupName: '',
//           total: null,
//           totalVat: null,
//           totalTax: null,
//           remarks: '',
//           locationId: null,
//         });
//       }

//       const dataCopy = JSON.parse(JSON.stringify([...data]));
//       const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

//       setPurchaseReturnGrid([...dataCopy]);
//       setPurchaseReturnGridPrev([...dataCopy2]);
//       setIsPurchaseReturnGridLoading(false);
//     } else if (typeof window === 'undefined') {
//       setIsPurchaseReturnGridLoading(true);
//     }
//   }, [
//     purchaseReturnInfoData,
//     purchaseReturnInfoIsLoading,
//     purchaseReturnInfoError,
//     purchaseReturnInfoIsError,
//     purchaseReturnInfoIsFetching,
//     purchaseReturnInfoIsSuccess,
//   ]);

//   const {
//     data: locationOptions,
//     isLoading: locationOptionsLoading,
//     error: locationOptionsError,
//     isSuccess: locationOptionsIsSuccess,
//     isError: locationOptionsIsError,
//     isFetching: locationOptionsIsFetching,
//     refetch: locationOptionsRefetch,
//   } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

//   useEffect(() => {
//     if (locationOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
//       );
//       console.log(locationOptionsError);
//     }
//     if (locationOptionsIsSuccess) {
//       console.log('locationOptions');
//       console.log(locationOptions);
//     }
//   }, [
//     locationOptionsLoading,
//     locationOptionsIsFetching,
//     locationOptionsError,
//     locationOptionsIsError,
//     locationOptions,
//     locationOptionsIsSuccess,
//   ]);

//   const {
//     data: supplierComboForGridOptions,
//     isLoading: supplierComboForGridOptionsLoading,
//     error: supplierComboForGridOptionsError,
//     isSuccess: supplierComboForGridOptionsIsSuccess,
//     isError: supplierComboForGridOptionsIsError,
//     isFetching: supplierComboForGridOptionsIsFetching,
//     refetch: supplierComboForGridOptionsRefetch,
//   } = useGetSupplierForComboByCompanyLocationIdQuery({
//     companyId: userInfo?.companyId,
//   });

//   useEffect(() => {
//     if (supplierComboForGridOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching supplierComboForGridOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching supplierComboForGridOptions for autocomplete, see console--->:'
//       );
//       console.log(supplierComboForGridOptionsError);
//     }
//     if (supplierComboForGridOptionsIsSuccess) {
//       console.log('supplierComboForGridOptions');
//       console.log(supplierComboForGridOptions);
//     }
//   }, [
//     supplierComboForGridOptionsLoading,
//     supplierComboForGridOptionsIsFetching,
//     supplierComboForGridOptionsError,
//     supplierComboForGridOptionsIsError,
//     supplierComboForGridOptions,
//     supplierComboForGridOptionsIsSuccess,
//   ]);

//   const [
//     processSavePurchaseReturn,
//     {
//       isLoading: processSavePurchaseReturnIsLoading,
//       isError: processSavePurchaseReturnIsError,
//       error: processSavePurchaseReturnError,
//       isSuccess: processSavePurchaseReturnIsSuccess,
//       data: processSavePurchaseReturnData,
//     },
//   ] = useProcessSavePurchaseReturnMutation();

//   useEffect(() => {
//     // if (!processSavePurchaseReturnIsLoading) {
//     //   // loading kisu dekha
//     //   setLoaderSpinner(true);
//     // } else {
//     //   setLoaderSpinner(false);
//     // }

//     if (processSavePurchaseReturnIsSuccess) {
//       // setLoaderSpinnerForThisPage(false);
//       Swal.fire({
//         title: `Sales Returns have been saved successfully!`,
//         text: '',
//         showDenyButton: false,
//         allowOutsideClick: false,
//         // target: 'body',
//         icon: 'success',
//         showCancelButton: false,
//         confirmButtonText: 'OK!',
//         // denyButtonText: `No, I will set it manually!`,
//       }).then((result) => {
//         /* Read more about isConfirmed, isDenied below */
//         if (result.isConfirmed) {
//           // modalPageOpenerClose();
//           console.log('check data after success, see console---->');
//           console.log(processSavePurchaseReturnData);
//           setDeletedPurchaseReturnDetailSerialRows([]);
//           setDeletedPurchaseReturnDetailRows([]);
//           setPurchaseReturnDetailRows([]);
//         }
//       });
//     } else if (processSavePurchaseReturnIsError) {
//       // setLoaderSpinnerForThisPage(false);
//       toast.error(
//         'Something is wrong in backend while saving PurchaseReturn data, see console---->'
//       );
//       console.log(
//         'Something is wrong in backend while saving PurchaseReturn data, see console---->'
//       );
//       console.log(processSavePurchaseReturnError);
//     }
//   }, [
//     processSavePurchaseReturnIsLoading,
//     processSavePurchaseReturnIsError,
//     processSavePurchaseReturnData,
//     processSavePurchaseReturnError,
//     processSavePurchaseReturnIsSuccess,
//   ]);

//   // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

//   // -----------------------------------API CALL (LAZY)-----------------------------------------

//   // Trigger GetSupplierGroup RTK Query whenever a form field changes
//   // useEffect(() => {
//   //   const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
//   //     watchedFields;

//   //   console.log('watchedFields');
//   //   console.log(watchedFields);

//   //   // Trigger your RTK Query
//   //   triggerGetSupplierGroup({
//   //     companyId: userInfo?.companyId,
//   //     supplierId: supplier?.supplierId || null,
//   //     salesPersonId: salesPerson?.employeeId || null,
//   //     //   supplierGroupId: supplierGroup?.supplierGroupId || null,
//   //     // departmentId: department?.departmentId || null,
//   //   });
//   // }, [
//   //   watchedFields.supplier,
//   //   watchedFields.salesPerson,
//   //   watchedFields.department,
//   //   userInfo?.companyId,
//   //   triggerGetSupplierGroup,
//   // ]);

//   // Trigger GetSupplier RTK Query whenever a form field changes
//   useEffect(() => {
//     const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
//       watchedFields;

//     console.log('watchedFields');
//     console.log(watchedFields);

//     // Trigger your RTK Query
//     triggerGetSupplier({
//       companyId: userInfo?.companyId,
//       // supplierGroupId: supplierGroup?.supplierGroupId || null,
//       // salesPersonId: salesPerson?.employeeId || null,
//       //   supplierGroupId: supplierGroup?.supplierGroupId || null,
//       // departmentId: department?.departmentId || null,

//       // purchaseReturnId: purchaseReturn?.purchaseReturnId || null,
//     });
//   }, [
//     // watchedFields.supplierGroup,
//     // watchedFields.salesPerson,
//     // watchedFields.department,
//     userInfo?.companyId,
//     triggerGetSupplier,
//   ]);

//   // Trigger GetSalesPerson RTK Query whenever a form field changes
//   // useEffect(() => {
//   //   const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
//   //     watchedFields;

//   //   console.log('watchedFields');
//   //   console.log(watchedFields);

//   //   // Trigger your RTK Query
//   //   triggerGetSalesPerson({
//   //     companyId: userInfo?.companyId,
//   //     supplierGroupId: supplierGroup?.supplierGroupId || null,
//   //     supplierId: supplier?.supplierId || null,
//   //     // departmentId: department?.departmentId || null,
//   //   });
//   // }, [
//   //   watchedFields.supplierGroup,
//   //   watchedFields.supplier,
//   //   watchedFields.department,
//   //   userInfo?.companyId,
//   //   triggerGetSupplier,
//   // ]);

//   // Trigger GetPaymentModeOptions RTK Query whenever a form field changes
//   // useEffect(() => {
//   //   const { location, paymentMode } = watchedFields;

//   //   console.log('watchedFields');
//   //   console.log(watchedFields);

//   //   // Trigger your RTK Query
//   //   triggerGetPaymentModeOptions({
//   //     companyId: userInfo?.companyId,
//   //     locationId: location?.locationId || userInfo?.companyId,
//   //   });
//   // }, [watchedFields.location, userInfo?.companyId]);

//   // Trigger GetPurchaseReturnInfo RTK Query whenever a form field changes
//   useEffect(() => {
//     const {
//       supplier,
//       // salesPerson,
//       // supplierGroup,
//       dateFrom,
//       dateTo,
//       taxOver,
//       taxUnder,
//       amountOver,
//       amountUnder,
//       location,
//       purchaseReturn,
//       paymentMode,
//     } = watchedFields;

//     // if (!dateFrom) {
//     //   toast.error('Date From cannot be empty');
//     // }
//     // if (!dateTo) {
//     //   toast.error('Date To cannot be empty');
//     // }
//     // if (dateFrom && dateTo && dayjs(dateFrom) > dayjs(dateTo)) {
//     //   toast.error('Date From cannot be greater than Date To');
//     // }

//     // checking if any error exist in useForm errors
//     // if (Object.keys(errors).length > 0) {
//     //   // console.log('Validation errors exist:', errors);
//     //   return;
//     // }

//     // Trigger your RTK Query
//     if (
//       // dateFrom &&
//       // dateTo &&
//       // dayjs(dateFrom) <= dayjs(dateTo) &&
//       // !(Object.keys(errors).length > 0)
//       true
//     ) {
//       const getParams: IGetPurchaseReturnInfoFilterDto = {
//         supplierId: supplier?.supplierId || null,
//         // supplierGroupId: supplierGroup?.supplierGroupId || null,
//         fromDate: dayjs(dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS'),
//         toDate: dayjs(dateTo).format('YYYY-MM-DDTHH:mm:ss.SSS'),
//         taxOver: taxOver || null,
//         taxUnder: taxUnder || null,
//         amountOver: amountOver || null,
//         amountUnder: amountUnder || null,
//         // employeeId: salesPerson?.employeeId || null,
//         locationId: location?.locationId || userInfo?.locationId || null,
//         purchaseReturnId: purchaseReturn?.purchaseReturnId || null,
//       };

//       triggerGetPurchaseReturnInfo({
//         filter: getParams,
//       });
//     } else {
//       const data: IPurchaseReturnInfo[] = [];

//       // Fill remaining with empty rows
//       while (data.length < 10) {
//         data.push({
//           purchaseReturnId: '',
//           purchaseReturnNo: '',
//           // purchaseOrderNo: '',
//           dateOfEntry: '',
//           supplierId: 0,
//           supplierName: '',
//           // supplierGroupId: 0,
//           // supplierGroupName: '',
//           total: null,
//           vat: null,
//           tax: null,
//           remarks: '',
//           locationId: null,
//         });
//       }
//       setPurchaseReturnGrid([...data]);
//     }
//   }, [
//     watchedFields.dateFrom,
//     watchedFields.dateTo,
//     // watchedFields.supplierGroup,
//     watchedFields.supplier,
//     // watchedFields.salesPerson,
//     watchedFields.amountOver,
//     watchedFields.amountUnder,
//     watchedFields.taxOver,
//     watchedFields.taxUnder,
//     watchedFields.location,
//     watchedFields.purchaseReturn, // eita baaki, autocomplete boshano
//     // watchedFields.paymentMode,
//   ]);

//   // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

//   // --------FUNCTIONS-------------

//   const handleEditDetail = (index: number, row: IPurchaseReturnInfo) => {
//     const objTemp = {
//       purchaseReturnInfoGridIndex: index,
//       purchaseReturnInfoGridRow: row,
//       purchaseReturnId: row.purchaseReturnId,
//       editModalOpen: true,
//     };

//     setDetailEditModalInfo(objTemp);
//   };

//   const handleDetailEditModalClose = () => {
//     const objTemp = {
//       purchaseReturnInfoGridIndex: null,
//       purchaseReturnInfoGridRow: null,
//       purchaseReturnId: null,
//       editModalOpen: false,
//     };

//     setDetailEditModalInfo(objTemp);
//   };

//   const savePurchaseReturn = () => {
//     console.log(purchaseReturnGrid); // eita abar purata ashbena, shudhu selected gula ashbe
//     console.log(deletedPurchaseReturnDetailRows);

//     console.log(purchaseReturnDetailRows);
//     console.log(deletedPurchaseReturnDetailSerialRows);

//     console.log(deletedPurchaseReturnDetailSerialRows);

//     /// ----Selected PurchaseReturns--------

//     const selectedRows =
//       purchaseReturnGridInitializer.getSelectedRowModel().rows;
//     const selectedPurchaseReturnRows = selectedRows.map((row) => row.original);
//     // console.log(selectedData);

//     if (selectedPurchaseReturnRows.length === 0) {
//       toast.warning('Select rows to save!');
//       return;
//     }

//     /// /////////--------PurchaseReturn Save ---------
//     const updatePurchaseReturn: IUpdatePurchaseReturnCommand[] = [];

//     const createPurchaseReturnDetail: ICreatePurchaseReturnDetailCommand[] = [];
//     const updatePurchaseReturnDetail: IUpdatePurchaseReturnDetailCommand[] = [];
//     const deletePurchaseReturnDetail: IDeletePurchaseReturnDetailCommand[] = [];

//     const createPurchaseReturnDetailSerial: ICreatePurchaseReturnDetailSerialCommand[] =
//       [];
//     const deletePurchaseReturnDetailSerial: IDeletePurchaseReturnDetailSerialCommand[] =
//       [];
//     const createPurchaseReturnDetailTax: ICreatePurchaseReturnDetailTaxCommand[] =
//       [];
//     const updatePurchaseReturnDetailTax: IUpdatePurchaseReturnDetailTaxCommand[] =
//       [];
//     const deletePurchaseReturnDetailTax: IDeletePurchaseReturnDetailTaxCommand[] =
//       [];

//     const processPurchaseReturnDetail = (purchaseReturnId: string) => {
//       /// /////////--------PurchaseReturnDetail Save(Also purchaseReturnDetailSerial save cz nested) ---------

//       const selectedSODRows = purchaseReturnDetailRows.filter(
//         (w) => w.purchaseReturnId === purchaseReturnId
//       );

//       // alert('selectedSODRows');
//       // console.log('selectedSODRows');
//       // console.log(selectedSODRows);
//       // console.log(purchaseReturnDetailRows);

//       const purchaseReturnDetailRowsSelected: IPurchaseReturnDetailInfo[] =
//         Array.isArray(selectedSODRows) ? selectedSODRows : [];

//       for (let i = 0; i < purchaseReturnDetailRowsSelected.length; i++) {
//         // update purchaseReturnDetail
//         if (purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId) {
//           const obj: IUpdatePurchaseReturnDetailCommand = {
//             purchaseReturnDetailId:
//               purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId,
//             purchaseReturnId:
//               purchaseReturnDetailRowsSelected[i].purchaseReturnId,
//             lPurchaseId: purchaseReturnDetailRowsSelected[i].lPurchaseId,
//             productId: purchaseReturnDetailRowsSelected[i].productId,
//             quantity: purchaseReturnDetailRowsSelected[i].quantiy,
//             price: purchaseReturnDetailRowsSelected[i].price,
//             unitTypeId: purchaseReturnDetailRowsSelected[i].unitTypeId,
//             // discount: purchaseReturnDetailRowsSelected[i].discount || 0,
//             locationId:
//               purchaseReturnDetailRowsSelected[i].locationId ||
//               userInfo?.locationId ||
//               null,
//           };

//           // create purchaseReturnDetailSerial-Bairerta(serial)
//           for (
//             let j = 0;
//             j <
//             purchaseReturnDetailRowsSelected[i]
//               .purchaseReturnDetailSerialInfoDto.length;
//             j++
//           ) {
//             if (
//               !purchaseReturnDetailRowsSelected[i]
//                 .purchaseReturnDetailSerialInfoDto[j]
//                 .purchaseReturnDetailSerialId
//             ) {
//               const tempObj: ICreatePurchaseReturnDetailSerialCommand = {
//                 purchaseReturnDetailId:
//                   purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId,
//                 purchaseReturnId:
//                   purchaseReturnDetailRowsSelected[i]
//                     .purchaseReturnDetailSerialInfoDto[j].purchaseReturnId ||
//                   '',
//                 serialNo:
//                   purchaseReturnDetailRowsSelected[i]
//                     .purchaseReturnDetailSerialInfoDto[j].serialNo,
//               };
//               createPurchaseReturnDetailSerial.push(tempObj);
//             }
//           }

//           // create purchaseReturnDetailTax-Process Model moddhei jeita open, Bairerta
//           if (!purchaseReturnDetailRowsSelected[i].taxRowId) {
//             const tempObj: ICreatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailId:
//                 purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId,
//               taxId: 1,
//               taxAmount: purchaseReturnDetailRowsSelected[i].taxAmount || 0,
//             };
//             createPurchaseReturnDetailTax.push(tempObj);
//           }

//           if (!purchaseReturnDetailRowsSelected[i].vatRowId) {
//             const tempObj: ICreatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailId:
//                 purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId,
//               taxId: 2,
//               taxAmount: purchaseReturnDetailRowsSelected[i].vatAmount || 0,
//             };
//             createPurchaseReturnDetailTax.push(tempObj);
//           }
//           // create purchaseReturnDetailTax-Process Model moddhei jeita open, Bairerta---ENDS---

//           // update purchaseReturnDetailTax-Process Model moddhei jeita open, Bairerta
//           if (purchaseReturnDetailRowsSelected[i].taxRowId) {
//             const tempObj: IUpdatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailTaxId:
//                 purchaseReturnDetailRowsSelected[i].taxRowId,
//               taxAmount: purchaseReturnDetailRowsSelected[i].taxAmount || 0,
//             };
//             updatePurchaseReturnDetailTax.push(tempObj);
//           }

//           if (purchaseReturnDetailRowsSelected[i].vatRowId) {
//             const tempObj: IUpdatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailTaxId:
//                 purchaseReturnDetailRowsSelected[i].vatRowId,
//               taxAmount: purchaseReturnDetailRowsSelected[i].vatAmount || 0,
//             };
//             updatePurchaseReturnDetailTax.push(tempObj);
//           }
//           // update purchaseReturnDetailTax-Process Model moddhei jeita open, Bairerta----ENDS---

//           updatePurchaseReturnDetail.push(obj);
//         }

//         // create PurchaseReturnDetail
//         if (!purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId) {
//           const obj: ICreatePurchaseReturnDetailCommand = {
//             purchaseReturnId:
//               purchaseReturnDetailRowsSelected[i].purchaseReturnId,
//             productId: purchaseReturnDetailRowsSelected[i].productId,
//             quantiy: purchaseReturnDetailRowsSelected[i].quantiy,
//             lPurchaseId: purchaseReturnDetailRowsSelected[i].lPurchaseId,
//             price: purchaseReturnDetailRowsSelected[i].price,
//             createPurchaseReturnDetailSerialCommand: [],
//             createPurchaseReturnDetail_TaxCommand: [],
//             unitTypeId: purchaseReturnDetailRowsSelected[i].unitTypeId,
//             // companyId: userInfo?.companyId,
//             locationId: userInfo?.locationId,
//             // discount: purchaseReturnDetailRowsSelected[i].discount || 0,
//           };

//           // create purchaseReturnDetailSerial(serial) vitorer ta, purchaseReturnDetailCreate er moddhe
//           for (
//             let j = 0;
//             j <
//             purchaseReturnDetailRowsSelected[i]
//               .purchaseReturnDetailSerialInfoDto.length;
//             j++
//           ) {
//             const tempObj: ICreatePurchaseReturnDetailSerialCommand = {
//               purchaseReturnDetailId: null,
//               purchaseReturnId:
//                 purchaseReturnDetailRowsSelected[i]
//                   .purchaseReturnDetailSerialInfoDto[j].purchaseReturnId || '',
//               serialNo:
//                 purchaseReturnDetailRowsSelected[i]
//                   .purchaseReturnDetailSerialInfoDto[j].serialNo,
//             };
//             obj.createPurchaseReturnDetailSerialCommand?.push(tempObj);
//           }

//           // create purchaseReturnDetailTax-Process Model er purchaseReturnDetail er moddhe jeita, peter vetorerta
//           if (
//             !purchaseReturnDetailRowsSelected[i].taxRowId &&
//             !purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId
//           ) {
//             const tempObj: ICreatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailId: null,
//               taxId: 1,
//               taxAmount: purchaseReturnDetailRowsSelected[i].taxAmount || 0,
//             };
//             obj.createPurchaseReturnDetail_TaxCommand?.push(tempObj);
//           }

//           if (
//             !purchaseReturnDetailRowsSelected[i].vatRowId &&
//             !purchaseReturnDetailRowsSelected[i].purchaseReturnDetailId
//           ) {
//             const tempObj: ICreatePurchaseReturnDetailTaxCommand = {
//               purchaseReturnDetailId: null,
//               taxId: 2,
//               taxAmount: purchaseReturnDetailRowsSelected[i].vatAmount || 0,
//             };
//             obj.createPurchaseReturnDetail_TaxCommand?.push(tempObj);
//           }
//           // create purchaseReturnDetailTax-Process Model er purchaseReturnDetail er moddhe jeita, peter vetorerta---ENDS---

//           createPurchaseReturnDetail.push(obj);
//         }
//       }

//       // delete purchaseReturnDetail, selected ones
//       if (deletedPurchaseReturnDetailRows.length) {
//         const deletedPurchaseReturnDetailRowsSelected: IDeletePurchaseReturnDetailCommand[] =
//           deletedPurchaseReturnDetailRows.filter(
//             (w) => w.purchaseReturnId === purchaseReturnId
//           );

//         for (
//           let i = 0;
//           i < deletedPurchaseReturnDetailRowsSelected.length;
//           i++
//         ) {
//           const obj: IDeletePurchaseReturnDetailCommand = {
//             purchaseReturnDetailId:
//               deletedPurchaseReturnDetailRowsSelected[i].purchaseReturnDetailId,
//           };
//           deletePurchaseReturnDetail.push(obj);
//         }
//       }
//       // delete purchaseReturnDetailSerial, selected ones
//       if (deletedPurchaseReturnDetailSerialRows.length) {
//         const deletedPurchaseReturnDetailSerialRowsSelected: IDeletePurchaseReturnDetailSerialCommand[] =
//           deletedPurchaseReturnDetailSerialRows.filter(
//             (w) => w.purchaseReturnId === purchaseReturnId
//           );

//         for (
//           let i = 0;
//           i < deletedPurchaseReturnDetailSerialRowsSelected.length;
//           i++
//         ) {
//           const obj: IDeletePurchaseReturnDetailSerialCommand = {
//             purchaseReturnDetailSerialId:
//               deletedPurchaseReturnDetailSerialRowsSelected[i]
//                 .purchaseReturnDetailSerialId,
//           };
//           deletePurchaseReturnDetailSerial.push(obj);
//         }
//       }

//       // delete purchaseReturnDetailTax, selected ones
//       if (deletedPurchaseReturnDetailTaxRows.length) {
//         const deletedPurchaseReturnDetailTaxRowsSelected: IDeletePurchaseReturnDetailTaxCommand[] =
//           deletedPurchaseReturnDetailTaxRows.filter(
//             (w) => w.purchaseReturnId === purchaseReturnId
//           );

//         for (
//           let i = 0;
//           i < deletedPurchaseReturnDetailTaxRowsSelected.length;
//           i++
//         ) {
//           const obj: IDeletePurchaseReturnDetailTaxCommand = {
//             purchaseReturnDetailTaxId:
//               deletedPurchaseReturnDetailTaxRowsSelected[i]
//                 .purchaseReturnDetailTaxId,
//           };
//           deletePurchaseReturnDetailTax.push(obj);
//         }
//       }
//     };

//     // Update purchaseReturn

//     for (let i = 0; i < selectedPurchaseReturnRows.length; i++) {
//       const prevRecordPurchaseReturnRow = purchaseReturnGridPrev.find(
//         (w) =>
//           w.purchaseReturnId === selectedPurchaseReturnRows[i].purchaseReturnId
//       );

//       if (prevRecordPurchaseReturnRow !== selectedPurchaseReturnRows[i]) {
//         const tempUpdateSO: IUpdatePurchaseReturnCommand = {
//           purchaseReturnId: selectedPurchaseReturnRows[i].purchaseReturnId,
//           total: selectedPurchaseReturnRows[i].total,
//           supplierId: selectedPurchaseReturnRows[i].supplierId,
//           // paymentModeId: selectedPurchaseReturnRows[i].paymentModeId,
//           // purchaseDiscount: selectedPurchaseReturnRows[i].purchaseDiscount,
//         };
//         updatePurchaseReturn.push(tempUpdateSO);
//       }
//       processPurchaseReturnDetail(
//         selectedPurchaseReturnRows[i].purchaseReturnId
//       );
//     }

//     // --------------- The sending Obj to api----------------
//     const sendingObj: IPurchaseReturnProcessCommandsVM = {
//       updatePurchaseReturnCommand: [...updatePurchaseReturn],
//       deletePurchaseReturnCommand: [],
//       createPurchaseReturnDetailCommand: [...createPurchaseReturnDetail],
//       updatePurchaseReturnDetailCommand: [...updatePurchaseReturnDetail],
//       deletePurchaseReturnDetailCommand: [...deletePurchaseReturnDetail],
//       // createPurchaseReturnAdditionalCostCommand: [],

//       //  updatePurchaseReturnAdditionalCostCommand: [],

//       // deletePurchaseReturnAdditionalCostCommand: [],
//       createBiznessEventPCTrackCommand: null,
//       purchaseReturnId: null,
//       createPurchaseReturnDetailSerialCommand: [
//         ...createPurchaseReturnDetailSerial,
//       ],
//       deletePurchaseReturnDetailSerialCommand: [
//         ...deletePurchaseReturnDetailSerial,
//       ],
//       createPurchaseReturnDetail_TaxCommand: [...createPurchaseReturnDetailTax],
//       updatePurchaseReturnDetail_TaxCommand: [...updatePurchaseReturnDetailTax],
//       deletePurchaseReturnDetail_TaxCommand: [],
//       // deletePurchaseReturnDetailTaxCommand: [...deletePurchaseReturnDetailTax], // eita lagbena, cz individually tax/vat delete korar option nei, purchaseReturnDetail delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
//     };

//     console.log('------The ultimate Object to send------');
//     console.log(sendingObj);

//     if (
//       !sendingObj.updatePurchaseReturnCommand?.length &&
//       !sendingObj.createPurchaseReturnDetailCommand?.length &&
//       !sendingObj.updatePurchaseReturnDetailCommand?.length &&
//       !sendingObj.deletePurchaseReturnDetailCommand?.length &&
//       !sendingObj.createPurchaseReturnDetailSerialCommand?.length &&
//       !sendingObj.deletePurchaseReturnDetailSerialCommand?.length
//     ) {
//       toast.info('No changes to save');
//     } else {
//       // API CALL HOBE
//       processSavePurchaseReturn(sendingObj);
//     }
//   };

//   const deletePurchaseReturn = () => {
//     const selectedRows =
//       purchaseReturnGridInitializer.getSelectedRowModel().rows;
//     const selectedData = selectedRows.map((row) => row.original);
//     console.log(selectedData);

//     const deletedPurchaseReturns: IDeletePurchaseReturnCommand[] = [];
//     for (let i = 0; i < selectedData.length; i++) {
//       const obj: IDeletePurchaseReturnCommand = {
//         purchaseReturnId: selectedData[i].purchaseReturnId,
//       };
//       deletedPurchaseReturns.push(obj);
//     }

//     const sendingObj: IPurchaseReturnProcessCommandsVM = {
//       updatePurchaseReturnCommand: [],
//       deletePurchaseReturnCommand: deletedPurchaseReturns,
//       createPurchaseReturnDetailCommand: [],
//       updatePurchaseReturnDetailCommand: [],
//       deletePurchaseReturnDetailCommand: [],
//       // createPurchaseReturnAdditionalCostCommand: [],

//       // updatePurchaseReturnAdditionalCostCommand: [],

//       // deletePurchaseReturnAdditionalCostCommand: [],
//       createBiznessEventPCTrackCommand: null,
//       purchaseReturnId: null,
//       createPurchaseReturnDetailSerialCommand: [],
//       deletePurchaseReturnDetailSerialCommand: [],
//     };

//     if (deletedPurchaseReturns.length > 0) {
//       processSavePurchaseReturn(sendingObj);
//     }
//   };

//   // --------FUNCTIONS--------ENDS-----

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

//     // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Supplier Number', id: 'SupplierNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, SupplierNumber: 49 },{VoucherNo: 456, SupplierNumber: 60 }]. Unfortunately jodi [{SupplierNumber: 49, VoucherNo: 123,  },{SupplierNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

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

//   const purchaseReturnGridColumns = useMemo<
//     MRT_ColumnDef<IPurchaseReturnInfo>[]
//   >(
//     () => [
//       {
//         id: 'editDetail', // access nested data with dot notation
//         header: 'Edit Detail',
//         size: 50, // small column
//         grow: false,
//         enableSorting: false,
//         enableColumnActions: false,
//         // enableResizing: false,
//         enableColumnFilter: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => (
//           <div className="w-full flex justify-center">
//             <Tooltip
//               className={
//                 row.original.purchaseReturnId ? 'visible' : 'invisible'
//               }
//               arrow
//               placement="right"
//               title="Edit Detail"
//             >
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   handleEditDetail(row.index, row.original);
//                 }}
//               >
//                 <Edit />
//               </IconButton>
//             </Tooltip>
//           </div>
//         ),
//       },
//       {
//         accessorFn: (row) => row.supplierName ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.supplierName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'supplierName',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Buyer Name',
//         Cell: ({ renderedCellValue, row }) => {
//           const currentSupplier = {
//             supplierId: purchaseReturnGrid[row.index].supplierId || null,
//             supplierName: purchaseReturnGrid[row.index].supplierName || '',
//           };
//           const isDisabled = !purchaseReturnGrid[row.index].purchaseReturnId;
//           return (
//             <Controller
//               name={`supplierName_row${row.index}`}
//               control={control}
//               // rules={{
//               //   // required: '*Required',
//               //   validate: (value) => validateAccounts(value, row.original),
//               // }}
//               render={({
//                 field: { onChange, onBlur, value, ref },
//                 fieldState: { error },
//               }) => (
//                 <Autocomplete
//                   id=""
//                   size="small"
//                   sx={{ width: '100%' }}
//                   PopperComponent={PopperMy}
//                   clearOnEscape
//                   disabled={isDisabled}
//                   // disableClearable
//                   freeSolo
//                   // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
//                   options={
//                     Array.from(
//                       new Map(
//                         supplierComboForGridOptions?.map(
//                           (supplierComboForGridOptionRow) => [
//                             supplierComboForGridOptionRow.supplierId,
//                             supplierComboForGridOptionRow,
//                           ]
//                         )
//                       ).values()
//                     ) || []
//                   } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
//                   value={currentSupplier}
//                   onChange={(event, selectedOption: any) => {
//                     if (selectedOption) {
//                       purchaseReturnGrid[row.index].supplierId =
//                         selectedOption?.supplierId || null;
//                       purchaseReturnGrid[row.index].supplierName =
//                         selectedOption?.supplierName || '';
//                       // -----------------setting groupName&Id------------
//                       // purchaseReturnGrid[row.index].supplierGroupName =
//                       //   selectedOption?.supplierGroupName || '';
//                       // purchaseReturnGrid[row.index].supplierGroupId =
//                       //   selectedOption?.supplierGroupId || '';

//                       setPurchaseReturnGrid([...purchaseReturnGrid]);

//                       onChange(selectedOption);
//                     }
//                   }} // React-hook-form manages the state
//                   onBlur={onBlur} // Trigger validation on blur
//                   getOptionLabel={(option: any) =>
//                     option ? option.supplierName : ''
//                   }
//                   isOptionEqualToValue={(option, selectedValue) =>
//                     option.supplierId === selectedValue?.supplierId
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       variant="standard"
//                       size="small"
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       FormHelperTextProps={{
//                         sx: {
//                           fontSize: 10, // Set the font size
//                           marginTop: 0, // Set the margin
//                           color: 'red', // Set the color (example)
//                         },
//                       }}
//                       InputProps={{
//                         ...params.InputProps,
//                         style: { fontSize: 13 },
//                         disableUnderline: true,
//                       }}
//                       sx={{ width: '100%' }}
//                       // inputRef={ref}
//                       inputRef={(node) => {
//                         if (node) {
//                           // eslint-disable-next-line no-param-reassign
//                           node.value = renderedCellValue;
//                         }
//                       }}
//                       // onBlur={() => { console.log(this) }}
//                     />
//                   )}
//                 />
//               )}
//             />
//           );
//         },
//       },

//       // {
//       //   accessorFn: (row) => row.supplierGroupName ?? '', // access nested data with dot notation
//       //   enableGlobalFilter: columnVisibility?.supplierGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//       //   id: 'supplierGroupName',
//       //   // accessorKey: 'transactionName', // access nested data with dot notation
//       //   header: 'Supplier Group',
//       //   Cell: ({ renderedCellValue, row }) => {
//       //     return (
//       //       <div className="w-full flex justify-between items-center">
//       //         <TextField
//       //           type="text"
//       //           sx={{ width: '100%' }}
//       //           InputProps={{
//       //             style: { fontSize: 13 },
//       //             disableUnderline: true,
//       //             readOnly: true,
//       //           }}
//       //           //   onBlur={(e) => {}}
//       //           variant="standard"
//       //           size="small"
//       //           inputRef={(node) => {
//       //             if (node) {
//       //               node.value = renderedCellValue;
//       //             }
//       //           }}
//       //         />
//       //       </div>
//       //     );
//       //   },
//       // },

//       {
//         accessorFn: (row) => row.purchaseReturnNo ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.purchaseReturnNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'purchaseReturnNo',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Sales Return No',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <div className="w-full flex justify-between items-center">
//               <TextField
//                 type="text"
//                 sx={{ width: '100%' }}
//                 InputProps={{
//                   style: { fontSize: 13 },
//                   disableUnderline: true,
//                   readOnly: true,
//                 }}
//                 //   onBlur={(e) => {}}
//                 variant="standard"
//                 size="small"
//                 inputRef={(node) => {
//                   if (node) {
//                     node.value = renderedCellValue;
//                   }
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.total ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.total, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'total',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Amount',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <div className="w-full flex justify-between items-center">
//               <TextField
//                 type="text"
//                 sx={{ width: '100%' }}
//                 InputProps={{
//                   style: { fontSize: 13 },
//                   disableUnderline: true,
//                   readOnly: true,
//                 }}
//                 //   onBlur={(e) => {}}
//                 variant="standard"
//                 size="small"
//                 inputRef={(node) => {
//                   if (node) {
//                     node.value = renderedCellValue;
//                   }
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//       // {
//       //   accessorFn: (row) => row.paymentModeName ?? '', // access nested data with dot notation
//       //   enableGlobalFilter: columnVisibility?.paymentModeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//       //   id: 'paymentModeName',
//       //   // accessorKey: 'transactionName', // access nested data with dot notation
//       //   header: 'Payment Mode',
//       //   Cell: ({ renderedCellValue, row }) => {
//       //     const currentPaymentMode = {
//       //       paymentModeId: purchaseReturnGrid[row.index].paymentModeId || null,
//       //       paymentModeName:
//       //         purchaseReturnGrid[row.index].paymentModeName || '',
//       //     };
//       //     const isDisabled = !purchaseReturnGrid[row.index].purchaseReturnId;
//       //     return (
//       //       <Controller
//       //         name={`paymentMode_row${row.index}`}
//       //         control={control}
//       //         // rules={{
//       //         //   // required: '*Required',
//       //         //   validate: (value) => validateAccounts(value, row.original),
//       //         // }}
//       //         render={({
//       //           field: { onChange, onBlur, value, ref },
//       //           fieldState: { error },
//       //         }) => (
//       //           <Autocomplete
//       //             id=""
//       //             size="small"
//       //             sx={{ width: '100%' }}
//       //             PopperComponent={PopperMy}
//       //             clearOnEscape
//       //             // disableClearable
//       //             disabled={isDisabled}
//       //             freeSolo
//       //             // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
//       //             options={
//       //               Array.from(
//       //                 new Map(
//       //                   paymentModeOptionsData?.map((paymentModeOptionRow) => [
//       //                     paymentModeOptionRow.paymentModeId,
//       //                     paymentModeOptionRow,
//       //                   ])
//       //                 ).values()
//       //               ) || []
//       //             } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
//       //             value={currentPaymentMode}
//       //             onChange={(event, selectedOption: any) => {
//       //               purchaseReturnGrid[row.index].paymentModeId =
//       //                 selectedOption?.paymentModeId || null;
//       //               purchaseReturnGrid[row.index].paymentModeName =
//       //                 selectedOption?.paymentModeName || '';
//       //               setPurchaseReturnGrid([...purchaseReturnGrid]);
//       //               onChange(selectedOption);
//       //             }} // React-hook-form manages the state
//       //             onBlur={onBlur} // Trigger validation on blur
//       //             getOptionLabel={(option: any) =>
//       //               option ? option.paymentModeName : ''
//       //             }
//       //             isOptionEqualToValue={(option, selectedValue) =>
//       //               option.paymentModeId === selectedValue?.paymentModeId
//       //             }
//       //             renderInput={(params) => (
//       //               <TextField
//       //                 {...params}
//       //                 variant="standard"
//       //                 size="small"
//       //                 error={!!error}
//       //                 helperText={error ? error.message : null}
//       //                 FormHelperTextProps={{
//       //                   sx: {
//       //                     fontSize: 10, // Set the font size
//       //                     marginTop: 0, // Set the margin
//       //                     color: 'red', // Set the color (example)
//       //                   },
//       //                 }}
//       //                 InputProps={{
//       //                   ...params.InputProps,
//       //                   style: { fontSize: 13 },
//       //                   disableUnderline: true,
//       //                 }}
//       //                 sx={{ width: '100%' }}
//       //                 // inputRef={ref}
//       //                 inputRef={(node) => {
//       //                   if (node) {
//       //                     // eslint-disable-next-line no-param-reassign
//       //                     node.value = renderedCellValue;
//       //                   }
//       //                 }}
//       //                 // onBlur={() => { console.log(this) }}
//       //               />
//       //             )}
//       //           />
//       //         )}
//       //       />
//       //     );
//       //   },
//       // },
//       {
//         accessorFn: (row) => row.totalVat ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.totalVat, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'totalVat',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Vat',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <div className="w-full flex justify-between items-center">
//               <TextField
//                 type="text"
//                 sx={{ width: '100%' }}
//                 InputProps={{
//                   style: { fontSize: 13 },
//                   disableUnderline: true,
//                   readOnly: true,
//                 }}
//                 //   onBlur={(e) => {}}
//                 variant="standard"
//                 size="small"
//                 inputRef={(node) => {
//                   if (node) {
//                     node.value = renderedCellValue;
//                   }
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.totalTax ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.totalTax, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'totalTax',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Tax',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <div className="w-full flex justify-between items-center">
//               <TextField
//                 type="text"
//                 sx={{ width: '100%' }}
//                 InputProps={{
//                   style: { fontSize: 13 },
//                   disableUnderline: true,
//                   readOnly: true,
//                 }}
//                 //   onBlur={(e) => {}}
//                 variant="standard"
//                 size="small"
//                 inputRef={(node) => {
//                   if (node) {
//                     node.value = renderedCellValue;
//                   }
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//       // {
//       //   accessorFn: (row) => row.purchaseDiscount ?? '', // access nested data with dot notation
//       //   enableGlobalFilter: columnVisibility?.purchaseDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//       //   id: 'purchaseDiscount',
//       //   // accessorKey: 'transactionName', // access nested data with dot notation
//       //   header: 'Invoice Discount',
//       //   Cell: ({ renderedCellValue, row }) => {
//       //     return (
//       //       <div className="w-full flex justify-between items-center">
//       //         <TextField
//       //           type="text"
//       //           sx={{ width: '100%' }}
//       //           InputProps={{
//       //             style: { fontSize: 13 },
//       //             disableUnderline: true,
//       //             // readOnly: true,
//       //           }}
//       //           //   onBlur={(e) => {}}
//       //           onBlur={(e) => {
//       //             const discountTemp = Number.isNaN(
//       //               parseInt(e.target.value, 10)
//       //             )
//       //               ? null
//       //               : Math.abs(parseInt(e.target.value, 10));
//       //             purchaseReturnGrid[row.index].purchaseDiscount = discountTemp;
//       //             setPurchaseReturnGrid([...purchaseReturnGrid]);
//       //           }}
//       //           variant="standard"
//       //           size="small"
//       //           inputRef={(node) => {
//       //             if (node) {
//       //               node.value = renderedCellValue;
//       //             }
//       //           }}
//       //         />
//       //       </div>
//       //     );
//       //   },
//       // },
//       // {
//       //   accessorFn: (row) => row.purchaseDiscount ?? '', // access nested data with dot notation
//       //   enableGlobalFilter: columnVisibility?.purchaseDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//       //   id: 'purchaseDiscount',
//       //   // accessorKey: 'transactionName', // access nested data with dot notation
//       //   header: 'Purchase Discount',
//       //   Cell: ({ renderedCellValue, row }) => {
//       //     return (
//       //       <div className="w-full flex justify-between items-center">
//       //         <TextField
//       //           type="text"
//       //           sx={{ width: '100%' }}
//       //           InputProps={{
//       //             style: { fontSize: 13 },
//       //             disableUnderline: true,
//       //             // readOnly: true,
//       //           }}
//       //           //   onBlur={(e) => {}}
//       //           onBlur={(e) => {
//       //             const discountTemp = Number.isNaN(parseFloat(e.target.value))
//       //               ? null
//       //               : Math.abs(parseFloat(e.target.value));
//       //             // const totalAmountTemp = Number.isNaN(
//       //             //   parseFloat(purchaseReturnGrid[row.index]?.totalAmount || 0)
//       //             // )
//       //             //   ? null
//       //             //   : Math.abs(parseFloat(e.target.value));
//       //             purchaseReturnGrid[row.index].purchaseDiscount =
//       //               discountTemp || 0;
//       //             purchaseReturnGrid[row.index].totalAmount =
//       //               (purchaseReturnGrid[row.index]
//       //                 .totalAmountWithoutPurchaseDiscount || 0) -
//       //               (discountTemp || 0);
//       //             // (purchaseReturnGrid[row.index]?.totalAmount || 0) -
//       //             // (discountTemp || 0);

//       //             setPurchaseReturnGrid([...purchaseReturnGrid]);
//       //           }}
//       //           variant="standard"
//       //           size="small"
//       //           inputRef={(node) => {
//       //             if (node) {
//       //               node.value = renderedCellValue;
//       //             }
//       //           }}
//       //         />
//       //       </div>
//       //     );
//       //   },
//       // },
//     ],
//     [PopperMy]
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
//   }, [sortingPurchaseReturnGrid]);

//   // ---------- material table virtualization---------

//   const purchaseReturnGridInitializer: MRT_TableInstance<IPurchaseReturnInfo> =
//     useMaterialReactTable({
//       columns: purchaseReturnGridColumns,
//       //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//       data: purchaseReturnGrid || [],
//       state: {
//         // isLoading:
//         //   supplierSalesRptGridInfoIsFetching || supplierSalesRptGridInfoLoading,
//         columnVisibility,
//         isLoading: isPurchaseReturnGridLoading,
//         sorting: sortingPurchaseReturnGrid,
//         // rowSelection: selectedBepcRow,
//       },
//       // enableRowOrdering: true,
//       positionToolbarAlertBanner: 'none',
//       // enableSorting: false, // usually you do not want to sort when re-ordering
//       onColumnVisibilityChange: setColumnVisibility,
//       muiSkeletonProps: {
//         animation: 'pulse',
//         height: 30,
//       },
//       enableRowSelection: (row) => {
//         // if (row.original.lastProcessedDate) {
//         //   toast.warning(
//         //     'You cannot select/calculate commission for this supplier, as this is already processed before'
//         //   );
//         // }
//         return !!row.original.purchaseReturnId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
//       }, // enable row selection conditionally per row
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
//           fontSize: '13px',
//           color: '#ea1143',
//         },
//       },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0', // add a border between columns
//           // borderLeft: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           // borderBottom: '1px solid #e0e0e0',
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
//               className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//               onClick={() => {
//                 //   handleExportData(
//                 //     supplierSalesRptGridState,
//                 //     purchaseReturnGridColumns
//                 //   );
//                 // const supplierSalesRptGridInfoWithoutEmpty =
//                 //   supplierSalesRptGridInfo.filter(
//                 //     (row) => row.employeeId
//                 //   );
//                 handleExportData(purchaseReturnGrid, purchaseReturnGridColumns);
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
//       onSortingChange: setSortingPurchaseReturnGrid,
//       rowVirtualizerInstanceRef, // optional
//       rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
//     });
//   return (
//     // return wrapper div
//     <div className="mt-16 md:mt-2">
//       <div className="flex justify-center">
//         <div className="block w-[98%]">
//           {/* Main Card */}
//           {/* <form onSubmit={handleSubmit(downloadReport)}> */}
//           <form>
//             <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//               {/* Main Card header */}
//               <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//                 {/* -----[TransactionEventVoucher experimental place starts here]----- */}
//                 {biznessEventName
//                   ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
//                   : 'Sales Return Edit'}
//                 {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
//               </div>
//               {/* Main Card header--/-- */}

//               {/* Main Card body */}
//               <div className="px-6 pb-4 text-start grid grid-cols-2 gap-y-1 gap-x-6 mt-5">
//                 <div className=" grid grid-cols-2 gap-x-4">
//                   <Controller
//                     name="dateFrom"
//                     control={control}
//                     rules={{
//                       required: '*Required',
//                     }}
//                     render={({
//                       field: { onChange, onBlur, value, ref },
//                       fieldState: { error },
//                     }) => (
//                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                           label="Date From"
//                           inputFormat="DD/MM/YYYY"
//                           value={value}
//                           onChange={(newValue) => {
//                             console.log(newValue);
//                             onChange(newValue);
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               sx={{ width: '100%', marginTop: 1 }}
//                               InputProps={{
//                                 ...params.InputProps,
//                                 style: { fontSize: 13 },
//                               }}
//                               InputLabelProps={{
//                                 ...params.InputLabelProps,
//                                 style: { fontSize: 14 },
//                               }}
//                               variant="standard"
//                               size="small"
//                               error={!!error}
//                               helperText={error ? error.message : null}
//                             />
//                           )}
//                         />
//                       </LocalizationProvider>
//                     )}
//                   />
//                   <Controller
//                     name="dateTo"
//                     rules={{
//                       required: '*Required',
//                     }}
//                     control={control}
//                     render={({
//                       field: { onChange, onBlur, value, ref },
//                       fieldState: { error },
//                     }) => (
//                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                           label="Date To"
//                           inputFormat="DD/MM/YYYY"
//                           value={value}
//                           onChange={(newValue) => {
//                             console.log(newValue);
//                             onChange(newValue);
//                           }}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               sx={{ width: '100%', marginTop: 1 }}
//                               InputProps={{
//                                 ...params.InputProps,
//                                 style: { fontSize: 13 },
//                               }}
//                               InputLabelProps={{
//                                 ...params.InputLabelProps,
//                                 style: { fontSize: 14 },
//                               }}
//                               variant="standard"
//                               size="small"
//                               error={!!error}
//                               helperText={error ? error.message : null}
//                             />
//                           )}
//                         />
//                       </LocalizationProvider>
//                     )}
//                   />
//                 </div>

//                 {/* <Controller
//                   name="supplierGroup"
//                   control={control}
//                   // rules={{
//                   //   required: '*Required',
//                   // }}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <Autocomplete
//                       id=""
//                       size="small"
//                       loading={false}
//                       options={[
//                         { supplierGroupId: 0, supplierGroupName: 'All' },
//                         ...(Array.from(
//                           new Map(
//                             supplierGroupOptionsData?.map(
//                               (supplierGroupOption) => [
//                                 supplierGroupOption.supplierGroupName,
//                                 supplierGroupOption,
//                               ]
//                             )
//                           ).values()
//                         ) || []),
//                       ]}
//                       value={value || null}
//                       // onChange={(event, item) => {}} // React-hook-form manages the state
//                       onChange={(event, selectedItem) => {
//                         onChange(selectedItem);
//                       }}
//                       onBlur={onBlur} // Trigger validation on blur
//                       getOptionLabel={(option) =>
//                         option ? option.supplierGroupName : ''
//                       }
//                       isOptionEqualToValue={(option, selectedValue) =>
//                         option.supplierGroupName ===
//                           selectedValue?.supplierGroupName &&
//                         option.supplierGroupId ===
//                           selectedValue?.supplierGroupId
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Supplier Group"
//                           variant="standard"
//                           error={!!error}
//                           helperText={error ? error.message : null}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: 14 },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: 13 },
//                             // endAdornment: (
//                             //   <>
//                             //     {supplierOptionsAutoCompLoading ? (
//                             //       <CircularProgress color="inherit" size={20} />
//                             //     ) : null}
//                             //     {params.InputProps.endAdornment}
//                             //   </>
//                             // ),
//                           }}
//                           sx={{ width: '100%', marginTop: 1 }}
//                           inputRef={ref}
//                         />
//                       )}
//                     />
//                   )}
//                 /> */}

//                 <Controller
//                   name="supplier"
//                   control={control}
//                   // rules={{
//                   //   required: '*Required',
//                   // }}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <Autocomplete
//                       id=""
//                       size="small"
//                       loading={false}
//                       // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
//                       options={[
//                         { supplierId: 0, supplierName: 'All' },
//                         ...(Array.from(
//                           new Map(
//                             supplierOptionsData?.map((supplierOption) => [
//                               supplierOption.supplierName,
//                               supplierOption,
//                             ])
//                           ).values()
//                         ) || []),
//                       ]} // Make sure tenderComboOptions is defined
//                       value={value || null}
//                       // onChange={(event, item) => {}} // React-hook-form manages the state
//                       onChange={(event, selectedItem) => {
//                         onChange(selectedItem);
//                       }}
//                       onBlur={onBlur} // Trigger validation on blur
//                       getOptionLabel={(option) =>
//                         option ? option.supplierName : ''
//                       }
//                       isOptionEqualToValue={(option, selectedValue) =>
//                         option.supplierName === selectedValue?.supplierName &&
//                         option.supplierId === selectedValue?.supplierId
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Buyer"
//                           variant="standard"
//                           error={!!error}
//                           helperText={error ? error.message : null}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: 14 },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: 13 },
//                             // endAdornment: (
//                             //   <>
//                             //     {supplierOptionsAutoCompLoading ? (
//                             //       <CircularProgress color="inherit" size={20} />
//                             //     ) : null}
//                             //     {params.InputProps.endAdornment}
//                             //   </>
//                             // ),
//                           }}
//                           sx={{ width: '100%', marginTop: 1 }}
//                           inputRef={ref}
//                         />
//                       )}
//                     />
//                   )}
//                 />

//                 {/* <Controller
//                   name="salesPerson"
//                   control={control}
//                   // rules={{
//                   //   required: '*Required',
//                   // }}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <Autocomplete
//                       id=""
//                       size="small"
//                       loading={false}
//                       // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
//                       options={[
//                         { employeeId: 0, employeeName: 'All' },
//                         ...(Array.from(
//                           new Map(
//                             salesPersonOptionsData?.map((salesPerson) => [
//                               salesPerson.employeeName,
//                               salesPerson,
//                             ])
//                           ).values()
//                         ) || []),
//                       ]} // Make sure it is unique
//                       value={value || null}
//                       // onChange={(event, item) => {}} // React-hook-form manages the state
//                       onChange={(event, selectedItem) => {
//                         onChange(selectedItem);
//                       }}
//                       onBlur={onBlur} // Trigger validation on blur
//                       getOptionLabel={(option) =>
//                         option ? option.employeeName : ''
//                       }
//                       isOptionEqualToValue={(option, selectedValue) =>
//                         option.employeeName === selectedValue?.employeeName &&
//                         option.employeeId === selectedValue?.employeeId
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Sales Person"
//                           variant="standard"
//                           error={!!error}
//                           helperText={error ? error.message : null}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: 14 },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: 13 },
//                             // endAdornment: (
//                             //   <>
//                             //     {supplierOptionsAutoCompLoading ? (
//                             //       <CircularProgress color="inherit" size={20} />
//                             //     ) : null}
//                             //     {params.InputProps.endAdornment}
//                             //   </>
//                             // ),
//                           }}
//                           sx={{ width: '100%', marginTop: 1 }}
//                           inputRef={ref}
//                         />
//                       )}
//                     />
//                   )}
//                 /> */}

//                 <Controller
//                   name="location"
//                   control={control}
//                   // rules={{
//                   //   required: '*Required',
//                   // }}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <Autocomplete
//                       id=""
//                       size="small"
//                       loading={false}
//                       // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
//                       // options={[
//                       //   { locationId: 0, locationName: 'Logged in Location' },
//                       //   ...(Array.from(
//                       //     new Map(
//                       //       locationOptions?.data?.map((locationRow) => [
//                       //         locationRow.locationId,
//                       //         locationRow,
//                       //       ])
//                       //     ).values()
//                       //   ) || []),
//                       // ]} // Make sure it is unique
//                       options={[
//                         { locationId: 0, locationName: 'Logged in Location' },
//                         ...(Array.from(
//                           new Map(
//                             locationOptions?.data
//                               ?.map(({ locationId, locationName }) => ({
//                                 locationId,
//                                 locationName,
//                               }))
//                               .map((location) => [
//                                 location.locationId,
//                                 location,
//                               ]) // ensures uniqueness
//                           ).values()
//                         ) || []),
//                       ]}
//                       value={value || null}
//                       // onChange={(event, item) => {}} // React-hook-form manages the state
//                       onChange={(event, selectedItem) => {
//                         onChange(selectedItem);
//                       }}
//                       onBlur={onBlur} // Trigger validation on blur
//                       getOptionLabel={(option) =>
//                         option ? option.locationName : ''
//                       }
//                       isOptionEqualToValue={(option, selectedValue) =>
//                         option.locationName === selectedValue?.locationName &&
//                         option.locationId === selectedValue?.locationId
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Location"
//                           variant="standard"
//                           error={!!error}
//                           helperText={error ? error.message : null}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: 14 },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: 13 },
//                             // endAdornment: (
//                             //   <>
//                             //     {supplierOptionsAutoCompLoading ? (
//                             //       <CircularProgress color="inherit" size={20} />
//                             //     ) : null}
//                             //     {params.InputProps.endAdornment}
//                             //   </>
//                             // ),
//                           }}
//                           sx={{ width: '100%', marginTop: 1 }}
//                           inputRef={ref}
//                         />
//                       )}
//                     />
//                   )}
//                 />

//                 {/* <Controller
//                   name="paymentMode"
//                   control={control}
//                   // rules={{
//                   //   required: '*Required',
//                   // }}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <Autocomplete
//                       id=""
//                       size="small"
//                       loading={false}
//                       // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
//                       options={[
//                         { paymentModeId: 0, paymentModeName: 'All' },
//                         ...(Array.from(
//                           new Map(
//                             paymentModeOptionsData?.map(
//                               (paymentModeOptionRow) => [
//                                 paymentModeOptionRow.paymentModeName,
//                                 paymentModeOptionRow,
//                               ]
//                             )
//                           ).values()
//                         ) || []),
//                       ]} // Make sure tenderComboOptions is defined
//                       value={value || null}
//                       // onChange={(event, item) => {}} // React-hook-form manages the state
//                       onChange={(event, selectedItem) => {
//                         onChange(selectedItem);
//                       }}
//                       onBlur={onBlur} // Trigger validation on blur
//                       getOptionLabel={(option) =>
//                         option ? option.paymentModeName : ''
//                       }
//                       isOptionEqualToValue={(option, selectedValue) =>
//                         option.paymentModeName ===
//                           selectedValue?.paymentModeName &&
//                         option.paymentModeId === selectedValue?.paymentModeId
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Payment Mode"
//                           variant="standard"
//                           error={!!error}
//                           helperText={error ? error.message : null}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: 14 },
//                           }}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: 13 },
//                             // endAdornment: (
//                             //   <>
//                             //     {supplierOptionsAutoCompLoading ? (
//                             //       <CircularProgress color="inherit" size={20} />
//                             //     ) : null}
//                             //     {params.InputProps.endAdornment}
//                             //   </>
//                             // ),
//                           }}
//                           sx={{ width: '100%', marginTop: 1 }}
//                           inputRef={ref}
//                         />
//                       )}
//                     />
//                   )}
//                 /> */}

//                 <div className="grid grid-cols-2 gap-x-4">
//                   {/* Tax Over */}
//                   <Controller
//                     name="taxOver"
//                     control={control}
//                     rules={{
//                       // required: 'Tax Over is required',
//                       validate: (value) =>
//                         taxUnderTemp === undefined ||
//                         value <= taxUnderTemp ||
//                         'Tax Over must be less than or equal to Tax Under',
//                     }}
//                     render={({
//                       field: { onChange, onBlur, value },
//                       fieldState: { error },
//                     }) => (
//                       <TextField
//                         label="Tax Over"
//                         type="number"
//                         value={value || ''}
//                         onChange={onChange}
//                         onBlur={() => {
//                           onBlur();
//                           trigger(['taxOver', 'taxUnder']); // validate both
//                         }}
//                         error={!!error}
//                         helperText={error ? error.message : null}
//                         variant="standard"
//                         size="small"
//                         InputProps={{ style: { fontSize: 13 } }}
//                         InputLabelProps={{
//                           style: { fontSize: 14 },
//                           shrink: !!value,
//                         }}
//                         className="w-full"
//                       />
//                     )}
//                   />

//                   {/* Tax Under */}
//                   <Controller
//                     name="taxUnder"
//                     control={control}
//                     rules={{
//                       // required: 'Tax Under is required',
//                       validate: (value) =>
//                         taxOverTemp === undefined ||
//                         value >= taxOverTemp ||
//                         'Tax Under must be greater than or equal to Tax Over',
//                     }}
//                     render={({
//                       field: { onChange, onBlur, value },
//                       fieldState: { error },
//                     }) => (
//                       <TextField
//                         label="Tax Under"
//                         type="number"
//                         value={value || ''}
//                         onChange={onChange}
//                         onBlur={() => {
//                           onBlur();
//                           trigger(['taxUnder', 'taxOver']); // validate both
//                         }}
//                         error={!!error}
//                         helperText={error ? error.message : null}
//                         variant="standard"
//                         size="small"
//                         InputProps={{ style: { fontSize: 13 } }}
//                         InputLabelProps={{
//                           style: { fontSize: 14 },
//                           shrink: !!value,
//                         }}
//                         className="w-full"
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-x-4">
//                   {/* Amount Under */}
//                   <Controller
//                     name="amountOver"
//                     control={control}
//                     rules={{
//                       // required: 'Amount Under is required',
//                       validate: (value) =>
//                         amountUnderTemp === undefined ||
//                         value <= amountUnderTemp ||
//                         'Amount Over must be less than or equal to Amount Under',
//                     }}
//                     render={({
//                       field: { onChange, onBlur, value },
//                       fieldState: { error },
//                     }) => (
//                       <TextField
//                         label="Amount Over"
//                         type="number"
//                         value={value || ''}
//                         onChange={onChange}
//                         onBlur={() => {
//                           onBlur();
//                           trigger(['amountUnder', 'amountOver']); // validate both
//                         }}
//                         error={!!error}
//                         helperText={error ? error.message : null}
//                         variant="standard"
//                         size="small"
//                         InputProps={{ style: { fontSize: 13 } }}
//                         InputLabelProps={{
//                           style: { fontSize: 14 },
//                           shrink: !!value,
//                         }}
//                         className="w-full"
//                       />
//                     )}
//                   />

//                   {/* Amount Over */}
//                   <Controller
//                     name="amountUnder"
//                     control={control}
//                     rules={{
//                       // required: 'Amount Over is required',
//                       validate: (value) =>
//                         amountOverTemp === undefined ||
//                         value >= amountOverTemp ||
//                         'Amount Under must be greater than or equal to Amount Over',
//                     }}
//                     render={({
//                       field: { onChange, onBlur, value },
//                       fieldState: { error },
//                     }) => (
//                       <TextField
//                         label="Amount Under"
//                         type="number"
//                         value={value || ''}
//                         onChange={onChange}
//                         onBlur={() => {
//                           onBlur();
//                           trigger(['amountUnder', 'amountOver']); // validate both
//                         }}
//                         error={!!error}
//                         helperText={error ? error.message : null}
//                         variant="standard"
//                         size="small"
//                         InputProps={{ style: { fontSize: 13 } }}
//                         InputLabelProps={{
//                           style: { fontSize: 14 },
//                           shrink: !!value,
//                         }}
//                         className="w-full"
//                       />
//                     )}
//                   />
//                 </div>

//                 {/* ------------SLIDER-------------- */}

//                 {/* <div className="w-full col-span-2 mt-4 grid grid-cols-12 gap-x-3 gap-y-0">
//                   <div className="col-span-12 text-start">
//                     <p className="text-[13px]">Profitability %:</p>
//                   </div>

//                   <div className="md:col-span-10 col-span-9">
//                     <Slider
//                       value={(profitability as number) ?? 0} // use ?? to handle undefined/null safely
//                       onChange={(_, val: number | number[]) => {
//                         // val can be number or array (range slider), but you have single value slider
//                         setValue('profitability', val as number);
//                       }}
//                       min={0}
//                       max={100}
//                       step={1}
//                       aria-labelledby="input-slider"
//                     />
//                   </div>

//                   <div className="md:col-span-2 col-span-3">
//                     <Controller
//                       name="profitability"
//                       control={control}
//                       rules={{
//                         // required: 'Profitability is required',
//                         min: { value: 0, message: 'Minimum is 0%' },
//                         max: { value: 100, message: 'Maximum is 100%' },
//                       }}
//                       render={({
//                         field: { onChange, onBlur, value },
//                         fieldState: { error },
//                       }) => (
//                         <Input
//                           value={value ?? ''}
//                           size="small"
//                           onChange={(e) => onChange(Number(e.target.value))}
//                           onBlur={() => {
//                             const corrected = Math.max(
//                               0,
//                               Math.min(100, Number(value))
//                             );
//                             setValue('profitability', corrected);
//                             trigger('profitability');
//                             onBlur();
//                           }}
//                           error={!!error}
//                           endAdornment={
//                             <InputAdornment position="end">
//                               <span className="font-extrabold">%</span>
//                             </InputAdornment>
//                           }
//                           inputProps={{
//                             step: 1,
//                             min: 0,
//                             max: 100,
//                             type: 'number',
//                             'aria-labelledby': 'input-slider',
//                             style: { fontSize: 13, fontWeight: 'bold' },
//                           }}
//                         />
//                       )}
//                     />
//                   </div>
//                 </div> */}
//                 {/* ------------SLIDER-------ENDS------- */}
//                 <div className="w-full mt-4 mb-5 col-span-2 modifiedEditTable">
//                   <MaterialReactTable table={purchaseReturnGridInitializer} />
//                 </div>
//               </div>
//               {/* Main Card Body--/-- */}

//               {/* Main Card footer */}
//               <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//                 <div className="flex gap-x-3">
//                   <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       savePurchaseReturn();
//                     }}
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       deletePurchaseReturn();
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//               {/* Main Card footer--/-- */}
//             </div>
//           </form>
//           {/* Main Card--/-- */}
//         </div>
//       </div>
//       {/* // modals --- out of html normal body/position */}

//       <Modal
//         open={detailEditModalInfo?.editModalOpen} // leaf view modal
//         onClose={handleDetailEditModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         style={{
//           display: 'flex',
//           margin: 0,
//           padding: 0,
//           alignItems: 'center',
//           justifyContent: 'center',

//           // transition: 'transform 0.9s ease-in',
//           // transform: PreviewModalOpen ? 'translateY(0)' : 'translateY(100%)',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'relative',
//             width: '95vw', // Set the width of the modal to full screen
//             // height: '95vh', // Set the height of the modal to full screen
//             // backgroundColor: 'white',
//             // overflow: 'hidden',
//             // borderRadius: '20px 20px 20px 20px',
//             // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
//             // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
//           }}
//         >
//           {/* <div className="bg-red-500">RUPOM</div> */}
//           <IconButton
//             aria-label="close"
//             onClick={handleDetailEditModalClose}
//             sx={{
//               position: 'absolute',
//               top: { xs: '10%', md: '2%' },
//               right: { xs: '4%', md: '1%' },
//               color: 'gray',
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           {/* <ChequeBookLeaf
//             chequeBookInfo={currentChequeBookRow}
//             chequeBookMasterRefetch={chequeBookMasterRefetch}
//           /> */}

//           <PurchaseReturnDetail
//             purchaseReturnGrid={purchaseReturnGrid}
//             setPurchaseReturnGrid={setPurchaseReturnGrid}
//             purchaseReturnDetailRows={purchaseReturnDetailRows}
//             setPurchaseReturnDetailRows={setPurchaseReturnDetailRows}
//             deletedPurchaseReturnDetailRows={deletedPurchaseReturnDetailRows}
//             setDeletedPurchaseReturnDetailRows={
//               setDeletedPurchaseReturnDetailRows
//             }
//             deletedPurchaseReturnDetailSerialRows={
//               deletedPurchaseReturnDetailSerialRows
//             }
//             setDeletedPurchaseReturnDetailSerialRows={
//               setDeletedPurchaseReturnDetailSerialRows
//             }
//             deletedPurchaseReturnDetailTaxRows={
//               deletedPurchaseReturnDetailTaxRows
//             }
//             setDeletedPurchaseReturnDetailTaxRows={
//               setDeletedPurchaseReturnDetailTaxRows
//             }
//             detailEditModalInfo={detailEditModalInfo}
//             setDetailEditModalInfo={setDetailEditModalInfo}
//             handleDetailEditModalClose={handleDetailEditModalClose}
//           />
//         </Box>
//       </Modal>
//     </div>

//     // return wrapper div--/--
//   );
// };

// export default SalesReturnEdit;
