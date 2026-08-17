/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable operator-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Box,
  IconButton,
  Input,
  InputAdornment,
  Modal,
  Popper,
  Slider,
  TextField,
  Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_Virtualizer,
  useMaterialReactTable,
} from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ExportToCsv } from 'export-to-csv';

import { Delete, Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import {
  useGetSupplierForComboByCompanyLocationIdQuery,
  useLazyGetSupplierByCompanyLocationIdQuery,
  useLazyGetSupplierGroupByCompanySupplierIdQuery,
} from '../../../infrastructure/api/SupplierApiSlice';

import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';

import {
  useLazyGetPaymentInfoQuery,
  useProcessSavePaymentMutation,
} from '../../../infrastructure/api/PaymentApiSlice';

import {
  useLazyGetBrandByCompanyIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductGroupByCompanyIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';

import {
  IChequeDetailPaymentInfo,
  IPaymentInfo,
  IPaymentProcessCommandsVM,
  ICreateChequeDetailPaymentCommand,
  IDeleteChequeAWBPaymentCommand,
  IDeleteChequeDetailPaymentCommand,
  IDeleteChequeHistoryPaymentCommand,
  IDeletePaymentCommand,
  IGetPaymentInfoFilterDto,
  IUpdateChequeDetailPaymentCommand,
  IUpdatePaymentCommand,
} from '../../../domain/interfaces/PaymentInterface';
import ChequeDetailPayment from './ChequeDetailPayment/ChequeDetailPayment';
import { useLazyGetPaymentModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';

type Props = {};

const PaymentEdit = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  const {
    register,
    getValues,
    reset,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });
  const navigate = useNavigate();
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  if (!userInfo?.securityUserId) {
    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    navigate('/loginUsername');
  }

  //   const [selectedSupplier, setSelectedSupplier] = useState();
  //   const [selectedSupplierGroup, setSelectedSupplierGroup] = useState();

  //   const [dateFrom, setDateFrom] = useState();
  //   const [dateTo, setDateTo] = useState();

  const [paymentGrid, setPaymentGrid] = useState<IPaymentInfo[]>([]);
  const [paymentGridPrev, setPaymentGridPrev] = useState<IPaymentInfo[]>([]);
  // const [deletedPaymentRows, setDeletedPaymentRows] = useState<
  //   IDeletePaymentCommand[]
  // >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [chequeDetailPaymentRows, setChequeDetailPaymentRows] = useState<
    IChequeDetailPaymentInfo[]
  >([]);
  const [deletedChequeDetailPaymentRows, setDeletedChequeDetailPaymentRows] =
    useState<IDeleteChequeDetailPaymentCommand[]>([]);

  const [deletedChequeHistoryRows, setDeletedChequeHistoryRows] = useState<
    IDeleteChequeHistoryPaymentCommand[]
  >([]);

  const [deletedChequeAWBPaymentRows, setDeletedChequeAWBPaymentRows] =
    useState<IDeleteChequeAWBPaymentCommand[]>([]);

  // type FormValues = {
  //   supplierGroup: ISupplierGroup | null;
  //   supplier: ISupplier | null;
  //   dateFrom: string | null;
  //   dateTo: string | null;
  // };

  //   grid virtualization states
  const [isPaymentGridLoading, setIsPaymentGridLoading] = useState(true);
  const [sortingPaymentGrid, setSortingPaymentGrid] =
    useState<MRT_SortingState>([]);

  const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

  // const [deletedSerials, setDeletedSerials] = useState<
  //   IDeleteChequeHistoryCommand[]
  // >([]);

  const amountOverTemp = useWatch({ control, name: 'amountOver' });
  const amountUnderTemp = useWatch({ control, name: 'amountUnder' });

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetSupplier,
    {
      data: supplierOptionsData,
      error: supplierOptionsError,
      isError: supplierOptionsIsError,
      isSuccess: supplierOptionsIsSuccess,
      isLoading: supplierOptionsIsLoading,
      isFetching: supplierOptionsIsFetching,
    },
  ] = useLazyGetSupplierByCompanyLocationIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (supplierOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching supplierOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching supplierOptionsData, see console--->:'
      );
      console.log(supplierOptionsError);
    }
    if (supplierOptionsIsSuccess) {
      console.log('supplierOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { supplier } = watchedFields;
      // if (supplier?.supplierId) {
      //   const exists = supplierOptionsData?.some(
      //     (supplierRow) => supplierRow.supplierId === supplier.supplierId
      //   );
      //   if (!exists && supplier != null && supplier.supplierId !== 0) {
      //     setValue('supplier', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   supplierOptionsData &&
      //   supplierOptionsData?.length === 1 &&
      //   supplierOptionsData?.[0].supplierId !== supplier?.supplierId &&
      //   // supplier != null &&
      //   supplier?.supplierId !== 0
      // ) {
      //   setValue('supplier', supplierOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(supplierOptionsData);
    }
  }, [
    supplierOptionsData,
    supplierOptionsIsLoading,
    supplierOptionsError,
    supplierOptionsIsError,
    supplierOptionsIsFetching,
    supplierOptionsIsSuccess,
  ]);

  const [
    triggerGetSupplierGroup,
    {
      data: supplierGroupOptionsData,
      error: supplierGroupOptionsError,
      isError: supplierGroupOptionsIsError,
      isSuccess: supplierGroupOptionsIsSuccess,
      isLoading: supplierGroupOptionsIsLoading,
      isFetching: supplierGroupOptionsIsFetching,
    },
  ] = useLazyGetSupplierGroupByCompanySupplierIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (supplierGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching supplierGroupOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching supplierGroupOptionsData, see console--->:'
      );
      console.log(supplierGroupOptionsError);
    }
    if (supplierGroupOptionsIsSuccess) {
      console.log('supplierGroupOptionsIsSuccess');
      console.log(supplierGroupOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { supplierGroup } = watchedFields;
      // if (supplierGroupOptionsData && supplierGroup?.supplierGroupId) {
      //   const exists = supplierGroupOptionsData?.some(
      //     (supplierGroupRow) =>
      //       supplierGroupRow.supplierGroupId === supplierGroup.supplierGroupId
      //   );
      //   if (!exists && supplierGroup != null && supplierGroup.supplierGroupId !== 0) {
      //     setValue('supplierGroup', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   supplierGroupOptionsData &&
      //   supplierGroupOptionsData.length === 1 &&
      //   supplierGroupOptionsData?.[0].supplierGroupId !== supplierGroup?.supplierGroupId &&
      //   // supplierGroup != null &&
      //   supplierGroup?.supplierGroupId !== 0
      // ) {
      //   setValue('supplierGroup', supplierGroupOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    supplierGroupOptionsData,
    supplierGroupOptionsIsLoading,
    supplierGroupOptionsError,
    supplierGroupOptionsIsError,
    supplierGroupOptionsIsFetching,
    supplierGroupOptionsIsSuccess,
  ]);

  const [
    triggerGetPaymentModeOptions,
    {
      data: paymentModeOptionsData,
      error: paymentModeOptionsError,
      isError: paymentModeOptionsIsError,
      isSuccess: paymentModeOptionsIsSuccess,
      isLoading: paymentModeOptionsIsLoading,
      isFetching: paymentModeOptionsIsFetching,
    },
  ] = useLazyGetPaymentModeQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (paymentModeOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching paymentModeOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching paymentModeOptionsData, see console--->:'
      );
      console.log(paymentModeOptionsError);
    }
    if (paymentModeOptionsIsSuccess) {
      console.log('paymentModeOptionsIsSuccess');
      console.log(paymentModeOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { paymentMode } = watchedFields;
      // if (paymentModeOptionsData && paymentMode?.employeeId) {
      //   const exists = paymentModeOptionsData?.some(
      //     (paymentModeRow) =>
      //       paymentModeRow.employeeId === paymentMode.employeeId
      //   );
      //   if (!exists && paymentMode != null && paymentMode.employeeId !== 0) {
      //     setValue('paymentMode', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   paymentModeOptionsData &&
      //   paymentModeOptionsData?.length === 1 &&
      //   paymentModeOptionsData?.[0].employeeId !== paymentMode?.employeeId &&
      //   // paymentMode != null &&
      //   paymentMode?.employeeId !== 0
      // ) {
      //   setValue('paymentMode', paymentModeOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    paymentModeOptionsData,
    paymentModeOptionsIsLoading,
    paymentModeOptionsError,
    paymentModeOptionsIsError,
    paymentModeOptionsIsFetching,
    paymentModeOptionsIsSuccess,
  ]);

  const [
    triggerGetPaymentInfo,
    {
      data: paymentInfoData,
      error: paymentInfoError,
      isError: paymentInfoIsError,
      isSuccess: paymentInfoIsSuccess,
      isLoading: paymentInfoIsLoading,
      isFetching: paymentInfoIsFetching,
    },
  ] = useLazyGetPaymentInfoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (paymentInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching paymentInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching paymentInfoData, see console--->:'
      );
      console.log(paymentInfoError);

      const data: IPaymentInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          paymentId: 0,
          supplierId: 0,
          supplierName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          paymentNo: '',
          paymentAgainst: '',
          paymentDate: '',
          paidAmount: null,
          paymentModeId: 0,
          paymentModeName: '',
          voucherId: null,
        });
      }
      setPaymentGrid([...data]);
      setPaymentGridPrev([]);

      setIsPaymentGridLoading(false);
    }
    if (
      paymentInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !paymentInfoIsLoading &&
      !paymentInfoIsError &&
      !paymentInfoIsFetching
    ) {
      console.log('paymentInfoIsSuccess');
      console.log(paymentInfoData);

      const data: IPaymentInfo[] = JSON.parse(
        JSON.stringify([...(paymentInfoData || [])])
      );
      const data2: IPaymentInfo[] = JSON.parse(
        JSON.stringify([...(paymentInfoData || [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          paymentId: 0,
          supplierId: 0,
          supplierName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          paymentNo: '',
          paymentAgainst: '',
          paymentDate: '',
          paidAmount: null,
          paymentModeId: 0,
          paymentModeName: '',
          voucherId: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setPaymentGrid([...dataCopy]);
      setPaymentGridPrev([...dataCopy2]);
      setIsPaymentGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsPaymentGridLoading(true);
    }
  }, [
    paymentInfoData,
    paymentInfoIsLoading,
    paymentInfoError,
    paymentInfoIsError,
    paymentInfoIsFetching,
    paymentInfoIsSuccess,
  ]);

  const {
    data: locationOptions,
    isLoading: locationOptionsLoading,
    error: locationOptionsError,
    isSuccess: locationOptionsIsSuccess,
    isError: locationOptionsIsError,
    isFetching: locationOptionsIsFetching,
    refetch: locationOptionsRefetch,
  } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

  useEffect(() => {
    if (locationOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
      );
      console.log(locationOptionsError);
    }
    if (locationOptionsIsSuccess) {
      console.log('locationOptions');
      console.log(locationOptions);
    }
  }, [
    locationOptionsLoading,
    locationOptionsIsFetching,
    locationOptionsError,
    locationOptionsIsError,
    locationOptions,
    locationOptionsIsSuccess,
  ]);

  const {
    data: supplierComboForGridOptions,
    isLoading: supplierComboForGridOptionsLoading,
    error: supplierComboForGridOptionsError,
    isSuccess: supplierComboForGridOptionsIsSuccess,
    isError: supplierComboForGridOptionsIsError,
    isFetching: supplierComboForGridOptionsIsFetching,
    refetch: supplierComboForGridOptionsRefetch,
  } = useGetSupplierForComboByCompanyLocationIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (supplierComboForGridOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching supplierComboForGridOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching supplierComboForGridOptions for autocomplete, see console--->:'
      );
      console.log(supplierComboForGridOptionsError);
    }
    if (supplierComboForGridOptionsIsSuccess) {
      console.log('supplierComboForGridOptions');
      console.log(supplierComboForGridOptions);
    }
  }, [
    supplierComboForGridOptionsLoading,
    supplierComboForGridOptionsIsFetching,
    supplierComboForGridOptionsError,
    supplierComboForGridOptionsIsError,
    supplierComboForGridOptions,
    supplierComboForGridOptionsIsSuccess,
  ]);

  const [
    processSavePayment,
    {
      isLoading: processSavePaymentIsLoading,
      isError: processSavePaymentIsError,
      error: processSavePaymentError,
      isSuccess: processSavePaymentIsSuccess,
      data: processSavePaymentData,
    },
  ] = useProcessSavePaymentMutation();

  useEffect(() => {
    // if (!processSavePaymentIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSavePaymentIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Payments have been saved successfully!`,
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        // target: 'body',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
        // denyButtonText: `No, I will set it manually!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // modalPageOpenerClose();
          console.log('check data after success, see console---->');
          paymentGridInitializer.resetRowSelection();
          console.log(processSavePaymentData);
          setDeletedChequeDetailPaymentRows([]);
          setDeletedChequeHistoryRows([]);
          setDeletedChequeAWBPaymentRows([]);
          setChequeDetailPaymentRows([]);
        }
      });
    } else if (processSavePaymentIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving Payment data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Payment data, see console---->'
      );
      console.log(processSavePaymentError);
      paymentGridInitializer.resetRowSelection();
    }
  }, [
    processSavePaymentIsLoading,
    processSavePaymentIsError,
    processSavePaymentData,
    processSavePaymentError,
    processSavePaymentIsSuccess,
  ]);

  /// ///////////----New filter API Hook Init Starts-----/////////////////////////

  const [
    triggerGetProductGroup,
    {
      data: productGroupOptionsData,
      error: productGroupOptionsError,
      isError: productGroupOptionsIsError,
      isSuccess: productGroupOptionsIsSuccess,
      isLoading: productGroupOptionsIsLoading,
      isFetching: productGroupOptionsIsFetching,
    },
  ] = useLazyGetProductGroupByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (productGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productGroupOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productGroupOptionsData, see console--->:'
      );
      console.log(productGroupOptionsError);
    }
    if (productGroupOptionsIsSuccess) {
      console.log('productGroupOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { supplier } = watchedFields;
      // if (supplier?.supplierId) {
      //   const exists = supplierOptionsData?.some(
      //     (supplierRow) => supplierRow.supplierId === supplier.supplierId
      //   );
      //   if (!exists && supplier != null && supplier.supplierId !== 0) {
      //     setValue('supplier', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   supplierOptionsData &&
      //   supplierOptionsData?.length === 1 &&
      //   supplierOptionsData?.[0].supplierId !== supplier?.supplierId &&
      //   // supplier != null &&
      //   supplier?.supplierId !== 0
      // ) {
      //   setValue('supplier', supplierOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(productGroupOptionsData);
    }
  }, [
    productGroupOptionsData,
    productGroupOptionsIsLoading,
    productGroupOptionsError,
    productGroupOptionsIsError,
    productGroupOptionsIsFetching,
    productGroupOptionsIsSuccess,
  ]);

  const [
    triggerGetBrand,
    {
      data: brandOptionsData,
      error: brandOptionsError,
      isError: brandOptionsIsError,
      isSuccess: brandOptionsIsSuccess,
      isLoading: brandOptionsIsLoading,
      isFetching: brandOptionsIsFetching,
    },
  ] = useLazyGetBrandByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (brandOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching brandOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching brandOptionsData, see console--->:'
      );
      console.log(brandOptionsError);
    }
    if (brandOptionsIsSuccess) {
      console.log('brandOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { supplier } = watchedFields;
      // if (supplier?.supplierId) {
      //   const exists = supplierOptionsData?.some(
      //     (supplierRow) => supplierRow.supplierId === supplier.supplierId
      //   );
      //   if (!exists && supplier != null && supplier.supplierId !== 0) {
      //     setValue('supplier', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   supplierOptionsData &&
      //   supplierOptionsData?.length === 1 &&
      //   supplierOptionsData?.[0].supplierId !== supplier?.supplierId &&
      //   // supplier != null &&
      //   supplier?.supplierId !== 0
      // ) {
      //   setValue('supplier', supplierOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(brandOptionsData);
    }
  }, [
    brandOptionsData,
    brandOptionsIsLoading,
    brandOptionsError,
    brandOptionsIsError,
    brandOptionsIsFetching,
    brandOptionsIsSuccess,
  ]);

  const [
    triggerGetProduct,
    {
      data: productOptionsData,
      error: productOptionsError,
      isError: productOptionsIsError,
      isSuccess: productOptionsIsSuccess,
      isLoading: productOptionsIsLoading,
      isFetching: productOptionsIsFetching,
    },
  ] = useLazyGetProductByCompanyProductGroupIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (productOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productOptionsData, see console--->:'
      );
      console.log(productOptionsError);
    }
    if (productOptionsIsSuccess) {
      console.log('productOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { supplier } = watchedFields;
      // if (supplier?.supplierId) {
      //   const exists = supplierOptionsData?.some(
      //     (supplierRow) => supplierRow.supplierId === supplier.supplierId
      //   );
      //   if (!exists && supplier != null && supplier.supplierId !== 0) {
      //     setValue('supplier', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   supplierOptionsData &&
      //   supplierOptionsData?.length === 1 &&
      //   supplierOptionsData?.[0].supplierId !== supplier?.supplierId &&
      //   // supplier != null &&
      //   supplier?.supplierId !== 0
      // ) {
      //   setValue('supplier', supplierOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(productOptionsData);
    }
  }, [
    productOptionsData,
    productOptionsIsLoading,
    productOptionsError,
    productOptionsIsError,
    productOptionsIsFetching,
    productOptionsIsSuccess,
  ]);

  /// ///////////----New filter API Hook Init ENDS-----/////////////////////////

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  // Trigger GetSupplierGroup RTK Query whenever a form field changes
  useEffect(() => {
    const { supplier, supplierGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSupplierGroup({
      companyId: userInfo?.companyId,
      supplierId: supplier?.supplierId || null,
      //   supplierGroupId: supplierGroup?.supplierGroupId || null,
    });
  }, [watchedFields.supplier, userInfo?.companyId, triggerGetSupplierGroup]);

  // Trigger GetSupplier RTK Query whenever a form field changes
  useEffect(() => {
    const { supplier, supplierGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSupplier({
      companyId: userInfo?.companyId,
      supplierGroupId: supplierGroup?.supplierGroupId || null,

      //   supplierGroupId: supplierGroup?.supplierGroupId || null,
    });
  }, [watchedFields.supplierGroup, userInfo?.companyId, triggerGetSupplier]);

  // Trigger GetPaymentModeOptions RTK Query whenever a form field changes
  useEffect(() => {
    const { location, paymentMode } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetPaymentModeOptions({
      companyId: userInfo?.companyId,
      locationId: location?.locationId || userInfo?.locationId,
    });
  }, [watchedFields.location, userInfo?.locationId]);

  // Trigger GetPaymentInfo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      supplier,
      supplierGroup,
      dateFrom,
      dateTo,
      amountOver,
      amountUnder,
      location,
      paymentMode,
    } = watchedFields;

    // if (!dateFrom) {
    //   toast.error('Date From cannot be empty');
    // }
    // if (!dateTo) {
    //   toast.error('Date To cannot be empty');
    // }
    // if (dateFrom && dateTo && dayjs(dateFrom) > dayjs(dateTo)) {
    //   toast.error('Date From cannot be greater than Date To');
    // }

    // checking if any error exist in useForm errors
    // if (Object.keys(errors).length > 0) {
    //   // console.log('Validation errors exist:', errors);
    //   return;
    // }

    // Trigger your RTK Query
    if (
      // dateFrom &&
      // dateTo &&
      // dayjs(dateFrom) <= dayjs(dateTo) &&
      // !(Object.keys(errors).length > 0)
      true
    ) {
      const getParams: IGetPaymentInfoFilterDto = {
        paymentModeId: paymentMode?.paymentModeId || null,
        supplierId: supplier?.supplierId || null,
        supplierGroupId: supplierGroup?.supplierGroupId || null,
        fromDate: dayjs(dateFrom)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS'),
        toDate: dayjs(dateTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
        amountOver: amountOver || null,
        amountUnder: amountUnder || null,
        locationId: location?.locationId || 0,
      };

      triggerGetPaymentInfo({
        filter: getParams,
        biznessEventId: 1,
        companyId: userInfo?.companyId,
        userId: userInfo?.securityUserId,
      });
    } else {
      const data: IPaymentInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          paymentId: 0,
          supplierId: 0,
          supplierName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          paymentNo: '',
          paymentAgainst: '',
          paymentDate: '',
          paidAmount: null,
          paymentModeId: 0,
          paymentModeName: '',
          voucherId: null,
        });
      }
      setPaymentGrid([...data]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.supplierGroup,
    watchedFields.supplier,
    watchedFields.amountOver,
    watchedFields.amountUnder,
    watchedFields.location,
    watchedFields.paymentMode,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const handleEditDetail = (index: number, row: IPaymentInfo) => {
    const objTemp = {
      paymentInfoGridIndex: index,
      paymentInfoGridRow: row,
      paymentId: row.paymentId,
      editModalOpen: true,
    };

    setDetailEditModalInfo(objTemp);
  };

  const handleDetailEditModalClose = () => {
    const objTemp = {
      paymentInfoGridIndex: null,
      paymentInfoGridRow: null,
      paymentId: null,
      editModalOpen: false,
    };

    setDetailEditModalInfo(objTemp);
  };

  // const savePaymentFollowed = () => {
  //   console.log(paymentGrid); // eita abar purata ashbena, shudhu selected gula ashbe
  //   console.log(deletedChequeDetailPaymentRows);

  //   console.log(chequeDetailPaymentRows);

  //   /// ----Selected Payments--------

  //   const selectedRows = paymentGridInitializer.getSelectedRowModel().rows;
  //   const selectedPaymentRows = selectedRows.map((row) => row.original);
  //   // console.log(selectedData);

  //   if (selectedPaymentRows.length === 0) {
  //     toast.warning('Select rows to save!');
  //     return;
  //   }

  //   /// /////////--------Payment Save ---------
  //   const updatePayment: IUpdatePaymentCommand[] = [];

  //   const createChequeDetailPayment: ICreateChequeDetailPaymentCommand[] = [];
  //   const updateChequeDetailPayment: IUpdateChequeDetailPaymentCommand[] = [];
  //   const deleteChequeDetailPayment: IDeleteChequeDetailPaymentCommand[] = [];

  //   const createChequeHistory: ICreateChequeHistoryCommand[] = [];

  //   const createChequeAWBPayment: ICreateChequeAWBPaymentCommand[] = [];

  //   const processChequeDetailPayment = (paymentId: string) => {
  //     /// /////////--------ChequeDetailPayment Save(Also chequeHistory save cz nested) ---------

  //     const selectedCDRows = chequeDetailPaymentRows.filter(
  //       (w) => w.paymentId === paymentId
  //     );

  //     // alert('selectedCDRows');
  //     // console.log('selectedCDRows');
  //     // console.log(selectedCDRows);
  //     // console.log(chequeDetailPaymentRows);

  //     const chequeDetailPaymentRowsSelected: IChequeDetailPaymentInfo[] = Array.isArray(
  //       selectedCDRows
  //     )
  //       ? selectedCDRows
  //       : [];

  //     for (let i = 0; i < chequeDetailPaymentRowsSelected.length; i++) {
  //       // update chequeDetailPayment
  //       if (chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId) {
  //         const obj: IUpdateChequeDetailPaymentCommand = {
  //           chequeDetailPaymentId: chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
  //           chequeNo: chequeDetailPaymentRowsSelected[i].chequeNo,
  //           bankId: chequeDetailPaymentRowsSelected[i].bankId,
  //           chequeDate: chequeDetailPaymentRowsSelected[i].chequeDate,
  //           chequeAmount: chequeDetailPaymentRowsSelected[i].chequeAmount,
  //           cqdCollected: chequeDetailPaymentRowsSelected[i].cqdCollected || null,
  //           sendDate: chequeDetailPaymentRowsSelected[i].sendDate || null,
  //           honorDate: chequeDetailPaymentRowsSelected[i].honorDate || null,
  //           date: chequeDetailPaymentRowsSelected[i].date || null,
  //           sendBankId: chequeDetailPaymentRowsSelected[i].sendBankId || null,
  //           dateofentry: chequeDetailPaymentRowsSelected[i].dateOfEntry || '',
  //           disreason: chequeDetailPaymentRowsSelected[i].disreason || '',
  //           remarks: chequeDetailPaymentRowsSelected[i].remarks || '',
  //         };

  //         // create chequeHistory-Bairerta(serial)
  //         for (
  //           let j = 0;
  //           j < chequeDetailPaymentRowsSelected[i].chequeHistories.length;
  //           j++
  //         ) {
  //           if (
  //             !chequeDetailPaymentRowsSelected[i].chequeHistories[j].chequeHistoryId
  //           ) {
  //             const tempObj: ICreateChequeHistoryCommand = {
  //               chequeDetailPaymentId: chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
  //               paymentId:
  //                 chequeDetailPaymentRowsSelected[i]
  //                   .paymentId || '',
  //               chequeType: 'C',
  //               paymentId: chequeDetailPaymentRowsSelected[i].paymentId,
  //               chequeNo: chequeDetailPaymentRowsSelected[i].chequeNo,
  //               chequeDate: chequeDetailPaymentRowsSelected[i].chequeDate,
  //               bankId: chequeDetailPaymentRowsSelected[i].bankId,
  //               treatment: chequeDetailPaymentRowsSelected[i].cqdCollected,
  //               treatmentDate: string;
  //               sendBankId?: number | null;
  //               date: string;
  //               enteredBy: number;
  //               dateOfEntry: string;
  //               voucherId?: string | null;

  //             };
  //             createChequeHistory.push(tempObj);
  //           }
  //         }

  //         // create chequeAWBPayment-Process Model moddhei jeita open, Bairerta
  //         if (!chequeDetailPaymentRowsSelected[i].taxRowId) {
  //           const tempObj: ICreateChequeAWBPaymentCommand = {
  //             chequeDetailPaymentId: chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
  //             taxId: 1,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].taxAmount || 0,
  //           };
  //           createChequeAWBPayment.push(tempObj);
  //         }

  //         if (!chequeDetailPaymentRowsSelected[i].vatRowId) {
  //           const tempObj: ICreateChequeAWBPaymentCommand = {
  //             chequeDetailPaymentId: chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
  //             taxId: 2,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].vatAmount || 0,
  //           };
  //           createChequeAWBPayment.push(tempObj);
  //         }
  //         // create chequeAWBPayment-Process Model moddhei jeita open, Bairerta---ENDS---

  //         // update chequeAWBPayment-Process Model moddhei jeita open, Bairerta
  //         if (chequeDetailPaymentRowsSelected[i].taxRowId) {
  //           const tempObj: IUpdateChequeAWBPaymentCommand = {
  //             chequeAWBPaymentId: chequeDetailPaymentRowsSelected[i].taxRowId,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].taxAmount || 0,
  //           };
  //           updateChequeAWBPayment.push(tempObj);
  //         }

  //         if (chequeDetailPaymentRowsSelected[i].vatRowId) {
  //           const tempObj: IUpdateChequeAWBPaymentCommand = {
  //             chequeAWBPaymentId: chequeDetailPaymentRowsSelected[i].vatRowId,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].vatAmount || 0,
  //           };
  //           updateChequeAWBPayment.push(tempObj);
  //         }
  //         // update chequeAWBPayment-Process Model moddhei jeita open, Bairerta----ENDS---

  //         updateChequeDetailPayment.push(obj);
  //       }

  //       // create ChequeDetailPayment
  //       if (!chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId) {
  //         const obj: ICreateChequeDetailPaymentCommand = {
  //           paymentId: chequeDetailPaymentRowsSelected[i].paymentId,
  //           productId: chequeDetailPaymentRowsSelected[i].productId,
  //           quantity: chequeDetailPaymentRowsSelected[i].quantity,
  //           price: chequeDetailPaymentRowsSelected[i].price,
  //           createChequeHistoryCommand: [],
  //           createChequeDetailPayment_TaxCommand: [],
  //           unitTypeId: chequeDetailPaymentRowsSelected[i].unitTypeId,
  //           companyId: userInfo?.companyId,
  //           locationId: userInfo?.locationId,
  //           discount: chequeDetailPaymentRowsSelected[i].discount || 0,
  //         };

  //         // create chequeHistory(serial) vitorer ta, chequeDetailPaymentCreate er moddhe
  //         for (
  //           let j = 0;
  //           j < chequeDetailPaymentRowsSelected[i].chequeHistoryInfoDto.length;
  //           j++
  //         ) {
  //           const tempObj: ICreateChequeHistoryCommand = {
  //             chequeDetailPaymentId: null,
  //             paymentId:
  //               chequeDetailPaymentRowsSelected[i].chequeHistoryInfoDto[j]
  //                 .paymentId || '',
  //             serialNo:
  //               chequeDetailPaymentRowsSelected[i].chequeHistoryInfoDto[j].serialNo,
  //           };
  //           obj.createChequeHistoryCommand?.push(tempObj);
  //         }

  //         // create chequeAWBPayment-Process Model er chequeDetailPayment er moddhe jeita, peter vetorerta
  //         if (
  //           !chequeDetailPaymentRowsSelected[i].taxRowId &&
  //           !chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId
  //         ) {
  //           const tempObj: ICreateChequeAWBPaymentCommand = {
  //             chequeDetailPaymentId: null,
  //             taxId: 1,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].taxAmount || 0,
  //           };
  //           obj.createChequeDetailPayment_TaxCommand?.push(tempObj);
  //         }

  //         if (
  //           !chequeDetailPaymentRowsSelected[i].vatRowId &&
  //           !chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId
  //         ) {
  //           const tempObj: ICreateChequeAWBPaymentCommand = {
  //             chequeDetailPaymentId: null,
  //             taxId: 2,
  //             taxAmount: chequeDetailPaymentRowsSelected[i].vatAmount || 0,
  //           };
  //           obj.createChequeDetailPayment_TaxCommand?.push(tempObj);
  //         }
  //         // create chequeAWBPayment-Process Model er chequeDetailPayment er moddhe jeita, peter vetorerta---ENDS---

  //         createChequeDetailPayment.push(obj);
  //       }
  //     }

  //     // delete chequeDetailPayment, selected ones
  //     if (deletedChequeDetailPaymentRows.length) {
  //       const deletedChequeDetailPaymentRowsSelected: IDeleteChequeDetailPaymentCommand[] =
  //         deletedChequeDetailPaymentRows.filter(
  //           (w) => w.paymentId === paymentId
  //         );

  //       for (let i = 0; i < deletedChequeDetailPaymentRowsSelected.length; i++) {
  //         const obj: IDeleteChequeDetailPaymentCommand = {
  //           chequeDetailPaymentId: deletedChequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
  //         };
  //         deleteChequeDetailPayment.push(obj);
  //       }
  //     }
  //     // delete chequeHistory, selected ones
  //     if (deletedChequeHistoryRows.length) {
  //       const deletedChequeHistoryRowsSelected: IDeleteChequeHistoryCommand[] =
  //         deletedChequeHistoryRows.filter(
  //           (w) => w.paymentId === paymentId
  //         );

  //       for (let i = 0; i < deletedChequeHistoryRowsSelected.length; i++) {
  //         const obj: IDeleteChequeHistoryCommand = {
  //           chequeHistoryId:
  //             deletedChequeHistoryRowsSelected[i].chequeHistoryId,
  //         };
  //         deleteChequeHistory.push(obj);
  //       }
  //     }

  //     // delete chequeAWBPayment, selected ones
  //     if (deletedChequeAWBPaymentRows.length) {
  //       const deletedChequeAWBPaymentRowsSelected: IDeleteChequeAWBPaymentCommand[] =
  //         deletedChequeAWBPaymentRows.filter((w) => w.paymentId === paymentId);

  //       for (let i = 0; i < deletedChequeAWBPaymentRowsSelected.length; i++) {
  //         const obj: IDeleteChequeAWBPaymentCommand = {
  //           chequeAWBPaymentId: deletedChequeAWBPaymentRowsSelected[i].chequeAWBPaymentId,
  //         };
  //         deleteChequeAWBPayment.push(obj);
  //       }
  //     }
  //   };

  //   // Update payment

  //   for (let i = 0; i < selectedPaymentRows.length; i++) {
  //     const prevRecordPaymentRow = paymentGridPrev.find(
  //       (w) => w.paymentId === selectedPaymentRows[i].paymentId
  //     );

  //     if (prevRecordPaymentRow !== selectedPaymentRows[i]) {
  //       const tempUpdateSO: IUpdatePaymentCommand = {
  //         paymentId: selectedPaymentRows[i].paymentId,
  //         paidAmount: selectedPaymentRows[i].paidAmount,
  //         supplierId: selectedPaymentRows[i].supplierId,
  //         paymentModeId: selectedPaymentRows[i].paymentModeId,
  //         invoiceDiscount: selectedPaymentRows[i].invoiceDiscount,
  //       };
  //       updatePayment.push(tempUpdateSO);
  //     }
  //     processChequeDetailPayment(selectedPaymentRows[i].paymentId);
  //   }

  //   // --------------- The sending Obj to api----------------
  //   const sendingObj: IPaymentProcessCommandsVM = {
  //     updatePaymentCommand: [...updatePayment],
  //     deletePaymentCommand: [],
  //     createChequeDetailPaymentCommand: [...createChequeDetailPayment],
  //     updateChequeDetailPaymentCommand: [...updateChequeDetailPayment],
  //     deleteChequeDetailPaymentCommand: [...deleteChequeDetailPayment],
  //     createPaymentAdditionalCostCommand: [],

  //     updatePaymentAdditionalCostCommand: [],

  //     deletePaymentAdditionalCostCommand: [],
  //     createBiznessEventPCTrackCommand: null,
  //     paymentId: null,
  //     createChequeHistoryCommand: [...createChequeHistory],
  //     deleteChequeHistoryPaymentCommand: [...deleteChequeHistory],
  //     createChequeDetailPayment_TaxCommand: [...createChequeAWBPayment],
  //     updateChequeDetailPayment_TaxCommand: [...updateChequeAWBPayment],
  //     deleteChequeDetailPayment_TaxCommand: [],
  //     // deleteChequeAWBPaymentCommand: [...deleteChequeAWBPayment], // eita lagbena, cz individually tax/vat delete korar option nei, chequeDetailPayment delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
  //   };

  //   console.log('------The ultimate Object to send------');
  //   console.log(sendingObj);

  //   if (
  //     !sendingObj.updatePaymentCommand?.length &&
  //     !sendingObj.createChequeDetailPaymentCommand?.length &&
  //     !sendingObj.updateChequeDetailPaymentCommand?.length &&
  //     !sendingObj.deleteChequeDetailPaymentCommand?.length &&
  //     !sendingObj.createChequeHistoryCommand?.length &&
  //     !sendingObj.deleteChequeHistoryPaymentCommand?.length
  //   ) {
  //     toast.info('No changes to save');
  //   } else {
  //     // API CALL HOBE
  //     processSavePayment(sendingObj);
  //   }
  // };

  // const savePayment = () => {
  //   console.log('paymentGrid');
  //   console.log(paymentGrid);

  //   console.log('chequeDetailPaymentRows');
  //   console.log(chequeDetailPaymentRows);

  //   console.log('deletedChequeDetailPaymentRows');
  //   console.log(deletedChequeDetailPaymentRows);
  // };

  const savePayment = () => {
    console.log(paymentGrid); // eita abar purata ashbena, shudhu selected gula ashbe

    console.log(chequeDetailPaymentRows);
    // console.log(deletedChequeHistoryRows);

    // console.log(deletedChequeHistoryRows);

    /// ----Selected payments--------

    const selectedRows = paymentGridInitializer.getSelectedRowModel().rows;
    const selectedPaymentRows = selectedRows.map((row) => row.original);
    // console.log(selectedData);

    if (selectedPaymentRows.length === 0) {
      toast.warning('Select rows to save!');
      return;
    }

    /// /////////--------Payment Save ---------
    const updatePayment: IUpdatePaymentCommand[] = [];

    const createChequeDetailPayment: ICreateChequeDetailPaymentCommand[] = [];
    const updateChequeDetailPayment: IUpdateChequeDetailPaymentCommand[] = [];
    const deleteChequeDetailPayment: IDeleteChequeDetailPaymentCommand[] = [];

    const deleteChequeHistory: IDeleteChequeHistoryPaymentCommand[] = [];
    const deleteChequeAWBPayment: IDeleteChequeAWBPaymentCommand[] = [];

    const processChequeDetailPayment = (paymentId: number) => {
      /// /////////--------ChequeDetailPayment Save(Also chequeHistory save cz nested) ---------

      const selectedCDRows = chequeDetailPaymentRows.filter(
        (w) => w.paymentId === paymentId
      );

      // alert('selectedCDRows');
      // console.log('selectedCDRows');
      // console.log(selectedCDRows);
      // console.log(chequeDetailPaymentRows);

      const chequeDetailPaymentRowsSelected: IChequeDetailPaymentInfo[] =
        Array.isArray(selectedCDRows) ? selectedCDRows : [];

      for (let i = 0; i < chequeDetailPaymentRowsSelected.length; i++) {
        // update chequeDetailPayment
        if (chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId) {
          const obj: IUpdateChequeDetailPaymentCommand = {
            chequeDetailPaymentId:
              chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
            // paymentId: chequeDetailPaymentRowsSelected[i].paymentId,

            chequeNo: chequeDetailPaymentRowsSelected[i].chequeNo,
            bankId: chequeDetailPaymentRowsSelected[i].bankId || 0,
            chequeDate: chequeDetailPaymentRowsSelected[i].chequeDate,
            chequeAmount: chequeDetailPaymentRowsSelected[i].chequeAmount,
            cqdCollected:
              chequeDetailPaymentRowsSelected[i].cqdCollected &&
              chequeDetailPaymentRowsSelected[i].cqdCollected !== 'F'
                ? chequeDetailPaymentRowsSelected[i].cqdCollected || null
                : null,
            sendDate: chequeDetailPaymentRowsSelected[i].sendDate || null,
            honorDate: chequeDetailPaymentRowsSelected[i].honorDate || null,
            date: chequeDetailPaymentRowsSelected[i].date || null,
            sendBankId: chequeDetailPaymentRowsSelected[i].sendBankId || null,
            // dateofentry: chequeDetailPaymentRowsSelected[i].dateOfEntry;
            disreason: chequeDetailPaymentRowsSelected[i].disreason || null,
            remarks: chequeDetailPaymentRowsSelected[i].remarks || null,
          };

          // // create chequeHistory-Bairerta(serial)
          // for (
          //   let j = 0;
          //   j < (chequeDetailPaymentRowsSelected[i].chequeHistories?.length || 0);
          //   j++
          // ) {
          //   if (
          //     !chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeHistoryId
          //   ) {
          //     const tempObj: ICreateChequeHistoryCommand = {
          //       chequeType:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //           ?.chequeType || 'C',
          //       paymentId:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //           ?.paymentId || '',
          //       chequeNo:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeNo ||
          //         '',
          //       chequeDate:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //           ?.chequeDate || '',
          //       bankId:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.bankId || 0,
          //       treatment:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.treatment ||
          //         '',
          //       treatmentDate:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //           ?.treatmentDate || '',
          //       sendBankId:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.sendBankId,
          //       date:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.date || '',
          //       enteredBy: userInfo?.securityUserId,
          //       dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //       voucherId:
          //         chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.voucherId ||
          //         null,
          //     };
          //     createChequeHistory.push(tempObj);
          //   }
          // }

          // for (
          //   let j = 0;
          //   j < (chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.length ?? 0);
          //   j++
          // ) {
          //   if (!chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeAWBPaymentId) {
          //     const tempObj: ICreateChequeAWBPaymentCommand = {
          //       paymentId:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.paymentId ||
          //         '',
          //       chequeNo:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeNo || '',
          //       chequeAmount:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeAmount ||
          //         0,
          //       chequeDate:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeDate || '',
          //       bankId:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.bankId || 0,
          //       adjustmentDate:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.adjustmentDate ||
          //         '',
          //       supplierId:
          //         chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.supplierId || 0,
          //       enteredBy: userInfo?.securityUserId,
          //       dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //       companyId: userInfo?.companyId,
          //       locationId: userInfo?.locationId,
          //     };
          //     createChequeAWBPayment.push(tempObj);
          //   }
          // }

          updateChequeDetailPayment.push(obj);
        }

        // create ChequeDetailPayment
        if (!chequeDetailPaymentRowsSelected[i].chequeDetailPaymentId) {
          const obj: ICreateChequeDetailPaymentCommand = {
            paymentId: chequeDetailPaymentRowsSelected[i].paymentId,
            chequeNo: chequeDetailPaymentRowsSelected[i].chequeNo,
            bankId: chequeDetailPaymentRowsSelected[i].bankId || 0,
            chequeDate: chequeDetailPaymentRowsSelected[i].chequeDate,
            chequeAmount: chequeDetailPaymentRowsSelected[i].chequeAmount,
            cqdCollected:
              chequeDetailPaymentRowsSelected[i].cqdCollected &&
              chequeDetailPaymentRowsSelected[i].cqdCollected !== 'F'
                ? chequeDetailPaymentRowsSelected[i].cqdCollected || null
                : null,
            sendDate: chequeDetailPaymentRowsSelected[i].sendDate || null,
            honorDate: chequeDetailPaymentRowsSelected[i].honorDate || null,
            date: chequeDetailPaymentRowsSelected[i].date || null,
            sendBankId: chequeDetailPaymentRowsSelected[i].sendBankId || null,
            dateofentry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
            disreason: chequeDetailPaymentRowsSelected[i].disreason || null,
            remarks: chequeDetailPaymentRowsSelected[i].remarks || null,
          };

          // // create chequeHistory(serial) vitorer ta, chequeDetailPaymentCreate er moddhe
          // for (
          //   let j = 0;
          //   j < (chequeDetailPaymentRowsSelected[i].chequeHistories?.length || 0);
          //   j++
          // ) {
          //   // if (
          //   //   !chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeAWBPaymentId
          //   // ) { //if ta bondho kora, new chequeDetailPayment row er moddhe obosshoi history er kono id nei
          //   const tempObj: ICreateChequeHistoryCommand = {
          //     chequeType:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeType ||
          //       'C',
          //     paymentId:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //         ?.paymentId || '',
          //     chequeNo:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeNo ||
          //       '',
          //     chequeDate:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeDate ||
          //       '',
          //     bankId:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.bankId || 0,
          //     treatment:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.treatment ||
          //       '',
          //     treatmentDate:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]
          //         ?.treatmentDate || '',
          //     sendBankId:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.sendBankId,
          //     date:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.date || '',
          //     enteredBy: userInfo?.securityUserId,
          //     dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //     voucherId:
          //       chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.voucherId ||
          //       null,
          //   };
          //   // obj.createChequeDetailPayment_TaxCommand?.push(tempObj);
          //   createChequeHistory.push(tempObj); // kintu vitore likhini, cz dorkar nai, chequeDetailPaymentId lagena save e, cz chequeHistory table ei nei chequeDetailPaymentId
          //   // }
          // }

          // for (
          //   let j = 0;
          //   j < (chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.length || 0);
          //   j++
          // ) {
          //   // if (
          //   //   !chequeDetailPaymentRowsSelected[i].chequeHistories?.[j]?.chequeHistoryId
          //   // ) { //if ta bondho kora, new chequeDetailPayment row er moddhe obosshoi history er kono id nei
          //   const tempObj: ICreateChequeAWBPaymentCommand = {
          //     paymentId:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.paymentId || '',
          //     chequeNo:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeNo || '',
          //     chequeAmount:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeAmount || 0,
          //     chequeDate:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.chequeDate || '',
          //     bankId: chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.bankId || 0,
          //     adjustmentDate:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.adjustmentDate ||
          //       '',
          //     supplierId:
          //       chequeDetailPaymentRowsSelected[i].chequeAWBPayments?.[j]?.supplierId || 0,
          //     enteredBy: userInfo?.securityUserId,
          //     dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //     companyId: userInfo?.companyId,
          //     locationId: userInfo?.locationId,
          //   };
          //   // obj.createChequeDetailPayment_TaxCommand?.push(tempObj);
          //   createChequeAWBPayment.push(tempObj); // kintu vitore likhini, cz dorkar nai, chequeDetailPaymentId lagena save e, cz chequeHistory table ei nei chequeDetailPaymentId
          //   // }
          // }

          createChequeDetailPayment.push(obj);
        }
      }

      // delete chequeDetailPayment, selected ones
      if (deletedChequeDetailPaymentRows.length) {
        const deletedChequeDetailPaymentRowsSelected: IDeleteChequeDetailPaymentCommand[] =
          deletedChequeDetailPaymentRows.filter(
            (w) => w.paymentId === paymentId
          );

        for (
          let i = 0;
          i < deletedChequeDetailPaymentRowsSelected.length;
          i++
        ) {
          const obj: IDeleteChequeDetailPaymentCommand = {
            chequeDetailPaymentId:
              deletedChequeDetailPaymentRowsSelected[i].chequeDetailPaymentId,
            paymentId: deletedChequeDetailPaymentRowsSelected[i].paymentId,
            chequeNo: deletedChequeDetailPaymentRowsSelected[i].chequeNo,
          };
          deleteChequeDetailPayment.push(obj);
        }
      }

      // delete chequeHistory, selected ones
      if (deletedChequeHistoryRows.length) {
        const deletedChequeHistoryRowsSelected: IDeleteChequeHistoryPaymentCommand[] =
          deletedChequeHistoryRows.filter((w) => w.paymentId === paymentId);

        for (let i = 0; i < deletedChequeHistoryRowsSelected.length; i++) {
          const obj: IDeleteChequeHistoryPaymentCommand = {
            chequeHistoryId:
              deletedChequeHistoryRowsSelected[i].chequeHistoryId,
            paymentId: deletedChequeHistoryRowsSelected[i].paymentId,
            chequeNo: deletedChequeHistoryRowsSelected[i].chequeNo,
            supplierId: deletedChequeHistoryRowsSelected[i].supplierId,
            treatment: deletedChequeHistoryRowsSelected[i].treatment,
            bankId: deletedChequeHistoryRowsSelected[i].bankId,
            sendBankId: deletedChequeHistoryRowsSelected[i].sendBankId || null,
          };
          deleteChequeHistory.push(obj);
        }
      }

      // delete chequeAWBPayment, selected ones
      if (deletedChequeAWBPaymentRows.length) {
        const deletedChequeAWBPaymentRowsSelected: IDeleteChequeAWBPaymentCommand[] =
          deletedChequeAWBPaymentRows.filter((w) => w.paymentId === paymentId);

        for (let i = 0; i < deletedChequeAWBPaymentRowsSelected.length; i++) {
          const obj: IDeleteChequeAWBPaymentCommand = {
            chequeAWBPaymentId:
              deletedChequeAWBPaymentRowsSelected[i].chequeAWBPaymentId,
          };
          deleteChequeAWBPayment.push(obj);
        }
      }
    };

    // Update payment

    for (let i = 0; i < selectedPaymentRows.length; i++) {
      const prevRecordPaymentRow = paymentInfoData?.find(
        (w) => w.paymentId === selectedPaymentRows[i].paymentId
      );

      if (
        JSON.stringify(prevRecordPaymentRow) !==
        JSON.stringify(selectedPaymentRows[i])
      ) {
        const tempUpdateSO: IUpdatePaymentCommand = {
          paymentId: selectedPaymentRows[i].paymentId,
          supplierId: selectedPaymentRows[i].supplierId,
          date: selectedPaymentRows[i].paymentDate,
          paymentModeId: selectedPaymentRows[i].paymentModeId,
          paidAmount: selectedPaymentRows[i].paidAmount || 0,
          voucherId: selectedPaymentRows[i].voucherId || null,
        };
        updatePayment.push(tempUpdateSO);
      }
      processChequeDetailPayment(selectedPaymentRows[i].paymentId);
    }

    // --------------- The sending Obj to api----------------
    const sendingObj: IPaymentProcessCommandsVM = {
      updatePaymentCommand: [...updatePayment],
      deletePaymentCommand: [],
      createChequeDetailPaymentCommand: [...createChequeDetailPayment],
      updateChequeDetailPaymentCommand: [...updateChequeDetailPayment],
      deleteChequeDetailPaymentCommand: [...deleteChequeDetailPayment],
      deleteChequeHistoryPaymentCommand: [...deleteChequeHistory],
      deleteChequeAWBPaymentCommand: [...deleteChequeAWBPayment],
      paymentId: null,

      // createChequeHistoryCommand: [...createChequeHistory],

      // createChequeAWBPaymentCommand: [...createChequeAWBPayment],
    };

    console.log('------The ultimate Object to send------');
    console.log(sendingObj);

    if (
      !sendingObj.updatePaymentCommand?.length &&
      !sendingObj.createChequeDetailPaymentCommand?.length &&
      !sendingObj.updateChequeDetailPaymentCommand?.length &&
      !sendingObj.deleteChequeDetailPaymentCommand?.length &&
      !sendingObj.deleteChequeHistoryPaymentCommand?.length &&
      !sendingObj.deleteChequeAWBPaymentCommand?.length
    ) {
      toast.info('No changes to save');
    } else {
      // API CALL HOBE
      processSavePayment(sendingObj);
    }
  };

  const deletePayment = () => {
    const selectedRows = paymentGridInitializer.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log(selectedData);

    const deletedPayments: IDeletePaymentCommand[] = [];
    for (let i = 0; i < selectedData.length; i++) {
      const obj: IDeletePaymentCommand = {
        paymentId: selectedData[i].paymentId,
        supplierId: selectedData[i].supplierId,
      };
      deletedPayments.push(obj);
    }

    const sendingObj: IPaymentProcessCommandsVM = {
      updatePaymentCommand: [],
      deletePaymentCommand: deletedPayments,
      createChequeDetailPaymentCommand: [],
      updateChequeDetailPaymentCommand: [],
      deleteChequeDetailPaymentCommand: [],
      createBiznessEventPCTrackCommand: null,
      paymentId: null,
      deleteChequeHistoryPaymentCommand: [],
      deleteChequeAWBPaymentCommand: [],
    };

    if (deletedPayments.length > 0) {
      processSavePayment(sendingObj);
    }
  };

  const selectPaymentRowByPaymentId = (paymentId: number) => {
    if (!paymentId) return;

    const rows = paymentGridInitializer.getRowModel().rows;
    const target = rows.find((r) => r.original.paymentId === paymentId);
    if (!target) return;

    //  already selected? do nothing
    if (paymentGridInitializer.getState().rowSelection?.[target.id]) return;

    //  not selected -> add it without clearing others
    paymentGridInitializer.setRowSelection((prev) => ({
      ...(prev ?? {}),
      [target.id]: true,
    }));
  };

  // --------FUNCTIONS--------ENDS-----

  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION-------------------------------

  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      // minWidth: string;
      fontSize: string;
    };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      // minWidth: 'inherit',
      fontSize: '12px',
    },
  };

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );
  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION--------------ENDSS-----------------

  // --------------------------------------------excel csv-----------------------------------

  const handleExportData = (gridData: any[], gridColumns: any) => {
    if (!gridData.length) {
      toast.info('No data to download');
      return;
    }

    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    console.log('columnVisibility');
    console.log(columnVisibility);

    // --------[Getting the hidden columns as property names in an array]----------
    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );
    console.log('falsePropertiesArr');
    console.log(falsePropertiesArr);

    console.log('gridColumns');
    console.log(gridColumns);

    // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    console.log('visibleGridDataTbColXcel');
    console.log(visibleGridDataTbColXcel);

    // --------[Getting the data of excel without those columns which are hidden ]----------
    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    console.log('gridDataTbXCEL');
    console.log(gridDataTbXCEL);

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Supplier Number', id: 'SupplierNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, SupplierNumber: 49 },{VoucherNo: 456, SupplierNumber: 60 }]. Unfortunately jodi [{SupplierNumber: 49, VoucherNo: 123,  },{SupplierNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

    console.log('gridDataTbXCELSorted');
    console.log(gridDataTbXCELSorted);

    // ---[csv er settings]---
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: visibleGridDataTbColXcel.map((c: any) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(gridDataTbXCELSorted);
  };

  // ------------------------------------excel csv-----------------END------------------

  const paymentGridColumns = useMemo<MRT_ColumnDef<IPaymentInfo>[]>(
    () => [
      {
        id: 'editDetail', // access nested data with dot notation
        header: 'Edit Detail',
        size: 50, // small column
        grow: false,
        enableSorting: false,
        enableColumnActions: false,
        // enableResizing: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        // Cell: ({ renderedCellValue, row }) => (
        //   <div className="w-full flex justify-center">
        //     <Tooltip
        //       className={row.original.paymentId ? 'visible' : 'invisible'}
        //       arrow
        //       placement="right"
        //       title="Edit Detail"
        //     >
        //       <IconButton
        //         color="error"
        //         onClick={() => {
        //           handleEditDetail(row.index, row.original);
        //         }}
        //       >
        //         <Edit />
        //       </IconButton>
        //     </Tooltip>
        //   </div>
        // ),
        Cell: ({ renderedCellValue, row }) => {
          const isCash = paymentGrid?.[row.index]?.paymentModeName === 'Cash';
          return (
            <div className="w-full flex justify-center">
              <Tooltip
                className={
                  row.original.paymentId && !isCash ? 'visible' : 'invisible'
                }
                arrow
                placement="right"
                title="Edit Detail"
              >
                <IconButton
                  color="error"
                  onClick={() => {
                    handleEditDetail(row.index, row.original);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.paymentNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.paymentNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'paymentNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Payment No',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: 13 },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.paymentModeName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.paymentModeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'paymentModeName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Payment Mode',
        Cell: ({ renderedCellValue, row }) => {
          const currentPaymentMode = {
            paymentModeId: paymentGrid[row.index].paymentModeId || null,
            paymentModeName: paymentGrid[row.index].paymentModeName || '',
          };
          const isDisabled = !paymentGrid[row.index].paymentId;
          return (
            <Controller
              name={`paymentMode_row${row.index}`}
              control={control}
              // rules={{
              //   // required: '*Required',
              //   validate: (value) => validateAccounts(value, row.original),
              // }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  disabled={isDisabled}
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        paymentModeOptionsData?.map((paymentModeOptionRow) => [
                          paymentModeOptionRow.paymentModeId,
                          paymentModeOptionRow,
                        ])
                      ).values()
                    ) || []
                  } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
                  value={currentPaymentMode}
                  onChange={(event, selectedOption: any) => {
                    paymentGrid[row.index].paymentModeId =
                      selectedOption?.paymentModeId || null;
                    paymentGrid[row.index].paymentModeName =
                      selectedOption?.paymentModeName || '';
                    setPaymentGrid([...paymentGrid]);
                    onChange(selectedOption);
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.paymentModeName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.paymentModeId === selectedValue?.paymentModeId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.supplierName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.supplierName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'supplierName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Supplier',
        Cell: ({ renderedCellValue, row }) => {
          const currentSupplier = {
            supplierId: paymentGrid[row.index].supplierId || null,
            supplierName: paymentGrid[row.index].supplierName || '',
          };
          const isDisabled = !paymentGrid[row.index].paymentId;
          return (
            <Controller
              name={`supplierName_row${row.index}`}
              control={control}
              // rules={{
              //   // required: '*Required',
              //   validate: (value) => validateAccounts(value, row.original),
              // }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  disabled={isDisabled}
                  // disableClearable
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        supplierComboForGridOptions?.map(
                          (supplierComboForGridOptionRow) => [
                            supplierComboForGridOptionRow.supplierId,
                            supplierComboForGridOptionRow,
                          ]
                        )
                      ).values()
                    ) || []
                  } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
                  value={currentSupplier}
                  onChange={(event, selectedOption: any) => {
                    if (selectedOption) {
                      paymentGrid[row.index].supplierId =
                        selectedOption?.supplierId || null;
                      paymentGrid[row.index].supplierName =
                        selectedOption?.supplierName || '';
                      // -----------------setting groupName&Id------------
                      paymentGrid[row.index].supplierGroupName =
                        selectedOption?.supplierGroupName || '';
                      paymentGrid[row.index].supplierGroupId =
                        selectedOption?.supplierGroupId || '';

                      setPaymentGrid([...paymentGrid]);

                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.supplierName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.supplierId === selectedValue?.supplierId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },

      // {
      //   accessorFn: (row) => row.supplierGroupName ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.supplierGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'supplierGroupName',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Supplier Group',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },

      // {
      //   accessorFn: (row) => row.paymentAgainst ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.paymentAgainst, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'paymentAgainst',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Payment Against',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.paymentDate ?? '',
        enableGlobalFilter: columnVisibility?.paymentDate,
        id: 'paymentDate',
        header: 'Payment Date',
        Cell: ({ row }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                inputFormat="DD/MM/YYYY"
                value={
                  row.original.paymentDate
                    ? dayjs(row.original.paymentDate)
                    : null
                }
                onChange={(newValue) => {
                  paymentGrid[row.index].paymentDate = newValue
                    ? dayjs(newValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
                    : '';
                  setPaymentGrid([...paymentGrid]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    sx={{
                      width: '100%',
                      mt: 1,

                      // Remove underline
                      '& .MuiInputBase-root:before, & .MuiInputBase-root:after':
                        {
                          borderBottom: 'none',
                        },

                      // Hide placeholder by default
                      '& .MuiInputBase-input::placeholder': {
                        opacity: 0,
                        color: '#bdbdbd', // light grey placeholder
                        transition: 'opacity .2s ease',
                      },

                      // Show placeholder only on hover
                      '&:hover .MuiInputBase-input::placeholder': {
                        opacity: 1,
                      },

                      // Hide icon by default
                      '& .MuiIconButton-root': {
                        opacity: 0,
                        transition: 'opacity .2s ease',
                      },

                      // Show icon on hover
                      '&:hover .MuiIconButton-root': {
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'dd/mm/yyyy', // we override it manually
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          );
        },
      },

      // {
      //   accessorFn: (row) => row.paidAmount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.paidAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'paidAmount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Paid Amount',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.paidAmount ?? '',
        enableGlobalFilter: columnVisibility?.paidAmount,
        id: 'paidAmount',
        header: 'Paid Amount',
        Cell: ({ row }) => {
          const isCash = paymentGrid?.[row.index]?.paymentModeName === 'Cash';

          const setRowPaidAmount = (next: number | 0) => {
            setPaymentGrid((prev) =>
              prev.map((r, i) =>
                i === row.index ? { ...r, paidAmount: next } : r
              )
            );
          };

          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="number"
                sx={{ width: '100%' }}
                variant="standard"
                size="small"
                value={paymentGrid?.[row.index]?.paidAmount ?? ''}
                inputProps={{
                  min: 0, // helps block negative in many browsers
                  step: 0.001, // 3 decimals
                  inputMode: 'decimal',
                }}
                InputProps={{
                  style: { fontSize: 13 },
                  disableUnderline: true,
                  readOnly: !isCash,
                }}
                onChange={(e) => {
                  if (!isCash) return;

                  const v = e.target.value;

                  // block typing negative
                  if (v.startsWith('-')) return;

                  // allow empty while editing
                  if (v === '') return setRowPaidAmount(0);

                  // allow only up to 3 decimals while typing
                  if (!/^\d*(\.\d{0,3})?$/.test(v)) return;

                  const num = Number(v);
                  if (!Number.isFinite(num) || num < 0) return;

                  setRowPaidAmount(num);
                }}
                onBlur={(e) => {
                  if (!isCash) return;

                  const raw = (e.target.value ?? '').trim();
                  if (raw === '') return setRowPaidAmount(0);

                  let num = Number(raw);
                  if (!Number.isFinite(num) || num < 0)
                    return setRowPaidAmount(0);

                  // round to 3 decimals
                  num = Math.round(num * 1000) / 1000;

                  setRowPaidAmount(num);
                }}
              />
            </div>
          );
        },
      },

      // {
      //   accessorFn: (row) => row.invoiceDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.invoiceDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'invoiceDiscount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Invoice Discount',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             // readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           onBlur={(e) => {
      //             const discountTemp = Number.isNaN(parseFloat(e.target.value))
      //               ? null
      //               : Math.abs(parseFloat(e.target.value));
      //             // const paidAmountTemp = Number.isNaN(
      //             //   parseFloat(paymentGrid[row.index]?.paidAmount || 0)
      //             // )
      //             //   ? null
      //             //   : Math.abs(parseFloat(e.target.value));

      //             paymentGrid[row.index].paidAmount =
      //               (paymentGrid[row.index]
      //                 .paidAmountWithoutInvoiceDiscount || 0) -
      //               (discountTemp || 0);
      //             // (paymentGrid[row.index]?.paidAmount || 0) -
      //             // (discountTemp || 0);

      //             setPaymentGrid([...paymentGrid]);
      //           }}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },
    ],
    [PopperMy]
  );

  // ---------- material table virtualization---------

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && tableDataLoading === false) {
  //     // setData(makeData(10_000));
  //     setIsLoading(false);
  //   }
  // }, [tableDataLoading]);   //--------ei code ta getGridData anar j api, oitay ei if er condition ta add koira dite hobe
  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingPaymentGrid]);

  // ---------- material table virtualization---------

  const paymentGridInitializer: MRT_TableInstance<IPaymentInfo> =
    useMaterialReactTable({
      columns: paymentGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: paymentGrid || [],
      state: {
        // isLoading:
        //   supplierSalesRptGridInfoIsFetching || supplierSalesRptGridInfoLoading,
        columnVisibility,
        isLoading:
          isPaymentGridLoading || paymentInfoIsLoading || paymentInfoIsFetching,
        sorting: sortingPaymentGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 30,
      },
      enableRowSelection: (row) => {
        // if (row.original.lastProcessedDate) {
        //   toast.warning(
        //     'You cannot select/calculate commission for this supplier, as this is already processed before'
        //   );
        // }
        return !!row.original.paymentId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
      }, // enable row selection conditionally per row
      // enableRowSelection: true,
      enableRowVirtualization: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false, // disable filter match highlighting
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      initialState: {
        density: 'compact',
      },
      muiTablePaperProps: {
        elevation: 0, // change the mui box shadow
        // customize paper styles
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '13px',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '400px' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />

          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     supplierSalesRptGridState,
                //     paymentGridColumns
                //   );
                // const supplierSalesRptGridInfoWithoutEmpty =
                //   supplierSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(paymentGrid, paymentGridColumns);
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      //   renderTopToolbarCustomActions: ({ table }) => (
      //     <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">

      //     </div>
      //   ),
      onSortingChange: setSortingPaymentGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });
  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          {/* Main Card */}
          {/* <form onSubmit={handleSubmit(downloadReport)}> */}
          <form>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[TransactionEventVoucher experimental place starts here]----- */}
                {biznessEventName
                  ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
                  : 'Payment Edit'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-2 gap-y-1 gap-x-6 mt-5">
                <div className=" grid grid-cols-2 gap-x-4">
                  <Controller
                    name="dateFrom"
                    control={control}
                    rules={{
                      required: '*Required',
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date From"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => {
                            console.log(newValue);
                            onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: 13 },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: 14 },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <Controller
                    name="dateTo"
                    rules={{
                      required: '*Required',
                    }}
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date To"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => {
                            console.log(newValue);
                            onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: 13 },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: 14 },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </div>

                <Controller
                  name="supplierGroup"
                  control={control}
                  // rules={{
                  //   required: '*Required',
                  // }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      id=""
                      size="small"
                      loading={false}
                      options={[
                        { supplierGroupId: 0, supplierGroupName: 'All' },
                        ...(Array.from(
                          new Map(
                            supplierGroupOptionsData?.map(
                              (supplierGroupOption) => [
                                supplierGroupOption.supplierGroupName,
                                supplierGroupOption,
                              ]
                            )
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.supplierGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.supplierGroupName ===
                          selectedValue?.supplierGroupName &&
                        option.supplierGroupId ===
                          selectedValue?.supplierGroupId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier Group"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
                            // endAdornment: (
                            //   <>
                            //     {supplierOptionsAutoCompLoading ? (
                            //       <CircularProgress color="inherit" size={20} />
                            //     ) : null}
                            //     {params.InputProps.endAdornment}
                            //   </>
                            // ),
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="supplier"
                  control={control}
                  // rules={{
                  //   required: '*Required',
                  // }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      id=""
                      size="small"
                      loading={false}
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      options={[
                        { supplierId: 0, supplierName: 'All' },
                        ...(Array.from(
                          new Map(
                            supplierOptionsData?.map((supplierOption) => [
                              supplierOption.supplierName,
                              supplierOption,
                            ])
                          ).values()
                        ) || []),
                      ]} // Make sure tenderComboOptions is defined
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.supplierName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.supplierName === selectedValue?.supplierName &&
                        option.supplierId === selectedValue?.supplierId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
                            // endAdornment: (
                            //   <>
                            //     {supplierOptionsAutoCompLoading ? (
                            //       <CircularProgress color="inherit" size={20} />
                            //     ) : null}
                            //     {params.InputProps.endAdornment}
                            //   </>
                            // ),
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="location"
                  control={control}
                  // rules={{
                  //   required: '*Required',
                  // }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      id=""
                      size="small"
                      loading={false}
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      // options={[
                      //   { locationId: 0, locationName: 'Logged in Location' },
                      //   ...(Array.from(
                      //     new Map(
                      //       locationOptions?.data?.map((locationRow) => [
                      //         locationRow.locationId,
                      //         locationRow,
                      //       ])
                      //     ).values()
                      //   ) || []),
                      // ]} // Make sure it is unique
                      options={[
                        // { locationId: -1, locationName: 'All Location' },
                        { locationId: 0, locationName: 'All Location' },
                        ...(Array.from(
                          new Map(
                            locationOptions?.data
                              ?.map(({ locationId, locationName }) => ({
                                locationId,
                                locationName,
                              }))
                              .map((location) => [
                                location.locationId,
                                location,
                              ]) // ensures uniqueness
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.locationName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.locationName === selectedValue?.locationName &&
                        option.locationId === selectedValue?.locationId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
                            // endAdornment: (
                            //   <>
                            //     {supplierOptionsAutoCompLoading ? (
                            //       <CircularProgress color="inherit" size={20} />
                            //     ) : null}
                            //     {params.InputProps.endAdornment}
                            //   </>
                            // ),
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="paymentMode"
                  control={control}
                  // rules={{
                  //   required: '*Required',
                  // }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      id=""
                      size="small"
                      loading={false}
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      options={[
                        { paymentModeId: 0, paymentModeName: 'All' },
                        ...(Array.from(
                          new Map(
                            paymentModeOptionsData?.map(
                              (paymentModeOptionRow) => [
                                paymentModeOptionRow.paymentModeName,
                                paymentModeOptionRow,
                              ]
                            )
                          ).values()
                        ) || []),
                      ]} // Make sure tenderComboOptions is defined
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.paymentModeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.paymentModeName ===
                          selectedValue?.paymentModeName &&
                        option.paymentModeId === selectedValue?.paymentModeId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Mode"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
                            // endAdornment: (
                            //   <>
                            //     {supplierOptionsAutoCompLoading ? (
                            //       <CircularProgress color="inherit" size={20} />
                            //     ) : null}
                            //     {params.InputProps.endAdornment}
                            //   </>
                            // ),
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-x-4">
                  {/* Amount Under */}
                  <Controller
                    name="amountOver"
                    control={control}
                    rules={{
                      // required: 'Amount Under is required',
                      validate: (value) =>
                        amountUnderTemp === undefined ||
                        value <= amountUnderTemp ||
                        'Amount Over must be less than or equal to Amount Under',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Amount Over"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['amountUnder', 'amountOver']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: 13 } }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />

                  {/* Amount Over */}
                  <Controller
                    name="amountUnder"
                    control={control}
                    rules={{
                      // required: 'Amount Over is required',
                      validate: (value) =>
                        amountOverTemp === undefined ||
                        value >= amountOverTemp ||
                        'Amount Under must be greater than or equal to Amount Over',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Amount Under"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['amountUnder', 'amountOver']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: 13 } }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                <div className="w-full mt-4 mb-5 col-span-2 modifiedEditTable">
                  <MaterialReactTable table={paymentGridInitializer} />
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    disabled={processSavePaymentIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSavePaymentIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg active:bg-blue-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSavePaymentIsLoading) savePayment();
                    }}
                  >
                    {processSavePaymentIsLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Please wait...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    disabled={processSavePaymentIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSavePaymentIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-110 focus:bg-red-700 focus:shadow-lg active:bg-red-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSavePaymentIsLoading) deletePayment();
                    }}
                  >
                    {processSavePaymentIsLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Please wait...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>
      {/* // modals --- out of html normal body/position */}

      <Modal
        open={detailEditModalInfo?.editModalOpen} // leaf view modal
        onClose={handleDetailEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',

          // transition: 'transform 0.9s ease-in',
          // transform: PreviewModalOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw', // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            // backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          {/* <div className="bg-red-500">RUPOM</div> */}
          <IconButton
            aria-label="close"
            onClick={handleDetailEditModalClose}
            sx={{
              position: 'absolute',
              top: { xs: '10%', md: '2%' },
              right: { xs: '4%', md: '1%' },
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* <ChequeBookLeaf
            chequeBookInfo={currentChequeBookRow}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
          /> */}

          <ChequeDetailPayment
            paymentGrid={paymentGrid}
            setPaymentGrid={setPaymentGrid}
            chequeDetailPaymentRows={chequeDetailPaymentRows}
            setChequeDetailPaymentRows={setChequeDetailPaymentRows}
            deletedChequeDetailPaymentRows={deletedChequeDetailPaymentRows}
            setDeletedChequeDetailPaymentRows={
              setDeletedChequeDetailPaymentRows
            }
            deletedChequeHistoryRows={deletedChequeHistoryRows}
            setDeletedChequeHistoryRows={setDeletedChequeHistoryRows}
            deletedChequeAWBPaymentRows={deletedChequeAWBPaymentRows}
            setDeletedChequeAWBPaymentRows={setDeletedChequeAWBPaymentRows}
            detailEditModalInfo={detailEditModalInfo}
            setDetailEditModalInfo={setDetailEditModalInfo}
            selectPaymentRowByPaymentId={selectPaymentRowByPaymentId}
            handleDetailEditModalClose={handleDetailEditModalClose}
          />
        </Box>
      </Modal>
    </div>

    // return wrapper div--/--
  );
};

export default PaymentEdit;
