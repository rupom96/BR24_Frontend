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
  useGetBuyerForComboByCompanyLocationIdQuery,
  useLazyGetBuyerByCompanyLocationIdQuery,
  // useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
} from '../../../infrastructure/api/BuyerApiSlice';
// import { IBuyerGroup } from '../../../domain/interfaces/BuyerGroupInterface';
import { IBuyer } from '../../../domain/interfaces/BuyerInterface';
import { ISalesPersonComboBox } from '../../../domain/interfaces/SalesPersonInterface';
import { IDepartment } from '../../../domain/interfaces/DepartmentInterface';
import {
  ICreateSalesReturnDetailSerialCommand,
  ICreateSalesReturnDetailCommand,
  ICreateSalesReturnDetailTaxCommand,
  IDeleteSalesReturnDetailSerialCommand,
  IDeleteSalesReturnCommand,
  IDeleteSalesReturnDetailCommand,
  IDeleteSalesReturnDetailTaxCommand,
  IGetSalesReturnInfoFilterDto,
  ISalesReturn,
  ISalesReturnDetailInfo,
  ISalesReturnInfo,
  ISalesReturnProcessCommandsVM,
  IUpdateSalesReturnCommand,
  IUpdateSalesReturnDetailCommand,
  IUpdateSalesReturnDetailTaxCommand,
} from '../../../domain/interfaces/SalesReturnInterface';
// import { useLazyGetSalesPersonByCompanyLocationBuyerIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';
import { useLazyGetPaymentModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';
import {
  useLazyGetSalesReturnInfoQuery,
  useProcessSaveSalesReturnMutation,
} from '../../../infrastructure/api/SalesReturnApiSlice';
import SalesReturnDetail from './SalesReturnDetail/SalesReturnDetail';

type Props = {};

const SalesReturnEdit = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  // const {
  //   register,
  //   getValues,
  //   reset,
  //   control,
  //   watch,
  //   setValue,
  //   setError,
  //   clearErrors,
  //   handleSubmit,
  //   trigger,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   mode: 'onChange', // Validation will trigger on blur
  //   defaultValues: {
  //     buyer: null,
  //     salesPerson: null,
  //     buyerGroup: null,
  //     department: null,
  //     dateFrom: dayjs().format(),
  //     dateTo: dayjs().format(),
  //   },
  // });
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

  //   const [selectedBuyer, setSelectedBuyer] = useState();
  //   const [selectedBuyerGroup, setSelectedBuyerGroup] = useState();
  //   const [selectedDepartment, setSelectedDepartment] = useState();
  //   const [selectedSalesPerson, setSelectedSalesPerson] = useState();
  //   const [dateFrom, setDateFrom] = useState();
  //   const [dateTo, setDateTo] = useState();

  const [salesReturnGrid, setSalesReturnGrid] = useState<ISalesReturnInfo[]>(
    []
  );
  const [salesReturnGridPrev, setSalesReturnGridPrev] = useState<
    ISalesReturnInfo[]
  >([]);
  // const [deletedSalesReturnRows, setDeletedSalesReturnRows] = useState<
  //   IDeleteSalesReturnCommand[]
  // >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [salesReturnDetailRows, setSalesReturnDetailRows] = useState<
    ISalesReturnDetailInfo[]
  >([]);
  const [deletedSalesReturnDetailRows, setDeletedSalesReturnDetailRows] =
    useState<IDeleteSalesReturnDetailCommand[]>([]);

  const [
    deletedSalesReturnDetailSerialRows,
    setDeletedSalesReturnDetailSerialRows,
  ] = useState<IDeleteSalesReturnDetailSerialCommand[]>([]);

  const [deletedSalesReturnDetailTaxRows, setDeletedSalesReturnDetailTaxRows] =
    useState<IDeleteSalesReturnDetailTaxCommand[]>([]);

  // type FormValues = {
  //   buyerGroup: IBuyerGroup | null;
  //   buyer: IBuyer | null;
  //   salesPerson: ISalesPersonComboBox | null;
  //   department: IDepartment | null;
  //   dateFrom: string | null;
  //   dateTo: string | null;
  // };

  //   grid virtualization states
  const [isSalesReturnGridLoading, setIsSalesReturnGridLoading] =
    useState(true);
  const [sortingSalesReturnGrid, setSortingSalesReturnGrid] =
    useState<MRT_SortingState>([]);

  const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

  const [deletedSerials, setDeletedSerials] = useState<
    IDeleteSalesReturnDetailSerialCommand[]
  >([]);

  const taxOverTemp = useWatch({ control, name: 'taxOver' });
  const taxUnderTemp = useWatch({ control, name: 'taxUnder' });
  const amountOverTemp = useWatch({ control, name: 'amountOver' });
  const amountUnderTemp = useWatch({ control, name: 'amountUnder' });
  const profitabilityTemp = useWatch({ control, name: 'profitability' });

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetBuyer,
    {
      data: buyerOptionsData,
      error: buyerOptionsError,
      isError: buyerOptionsIsError,
      isSuccess: buyerOptionsIsSuccess,
      isLoading: buyerOptionsIsLoading,
      isFetching: buyerOptionsIsFetching,
    },
  ] = useLazyGetBuyerByCompanyLocationIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (buyerOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerOptionsData, see console--->:'
      );
      console.log(buyerOptionsError);
    }
    if (buyerOptionsIsSuccess) {
      console.log('buyerOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { buyer } = watchedFields;
      // if (buyer?.buyerId) {
      //   const exists = buyerOptionsData?.some(
      //     (buyerRow) => buyerRow.buyerId === buyer.buyerId
      //   );
      //   if (!exists && buyer != null && buyer.buyerId !== 0) {
      //     setValue('buyer', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   buyerOptionsData &&
      //   buyerOptionsData?.length === 1 &&
      //   buyerOptionsData?.[0].buyerId !== buyer?.buyerId &&
      //   // buyer != null &&
      //   buyer?.buyerId !== 0
      // ) {
      //   setValue('buyer', buyerOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(buyerOptionsData);
    }
  }, [
    buyerOptionsData,
    buyerOptionsIsLoading,
    buyerOptionsError,
    buyerOptionsIsError,
    buyerOptionsIsFetching,
    buyerOptionsIsSuccess,
  ]);

  // const [
  //   triggerGetBuyerGroup,
  //   {
  //     data: buyerGroupOptionsData,
  //     error: buyerGroupOptionsError,
  //     isError: buyerGroupOptionsIsError,
  //     isSuccess: buyerGroupOptionsIsSuccess,
  //     isLoading: buyerGroupOptionsIsLoading,
  //     isFetching: buyerGroupOptionsIsFetching,
  //   },
  // ] = useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (buyerGroupOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching buyerGroupOptionsData, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching buyerGroupOptionsData, see console--->:'
  //     );
  //     console.log(buyerGroupOptionsError);
  //   }
  //   if (buyerGroupOptionsIsSuccess) {
  //     console.log('buyerGroupOptionsIsSuccess');
  //     console.log(buyerGroupOptionsData);
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
  //     // const { buyerGroup } = watchedFields;
  //     // if (buyerGroupOptionsData && buyerGroup?.buyerGroupId) {
  //     //   const exists = buyerGroupOptionsData?.some(
  //     //     (buyerGroupRow) =>
  //     //       buyerGroupRow.buyerGroupId === buyerGroup.buyerGroupId
  //     //   );
  //     //   if (!exists && buyerGroup != null && buyerGroup.buyerGroupId !== 0) {
  //     //     setValue('buyerGroup', null);
  //     //   }
  //     // }
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
  //     // // ---- here if the result only contains one result, autoSet.......
  //     // if (
  //     //   buyerGroupOptionsData &&
  //     //   buyerGroupOptionsData.length === 1 &&
  //     //   buyerGroupOptionsData?.[0].buyerGroupId !== buyerGroup?.buyerGroupId &&
  //     //   // buyerGroup != null &&
  //     //   buyerGroup?.buyerGroupId !== 0
  //     // ) {
  //     //   setValue('buyerGroup', buyerGroupOptionsData?.[0]);
  //     // }
  //     // // ---- here if the result only contains one result, autoSet----- ENDS...
  //   }
  // }, [
  //   buyerGroupOptionsData,
  //   buyerGroupOptionsIsLoading,
  //   buyerGroupOptionsError,
  //   buyerGroupOptionsIsError,
  //   buyerGroupOptionsIsFetching,
  //   buyerGroupOptionsIsSuccess,
  // ]);

  // const [
  //   triggerGetSalesPerson,
  //   {
  //     data: salesPersonOptionsData,
  //     error: salesPersonOptionsError,
  //     isError: salesPersonOptionsIsError,
  //     isSuccess: salesPersonOptionsIsSuccess,
  //     isLoading: salesPersonOptionsIsLoading,
  //     isFetching: salesPersonOptionsIsFetching,
  //   },
  // ] = useLazyGetSalesPersonByCompanyLocationBuyerIdQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (salesPersonOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching salesPersonOptionsData, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching salesPersonOptionsData, see console--->:'
  //     );
  //     console.log(salesPersonOptionsError);
  //   }
  //   if (salesPersonOptionsIsSuccess) {
  //     console.log('salesPersonOptionsIsSuccess');
  //     console.log(salesPersonOptionsData);
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
  //     // const { salesPerson } = watchedFields;
  //     // if (salesPersonOptionsData && salesPerson?.employeeId) {
  //     //   const exists = salesPersonOptionsData?.some(
  //     //     (salesPersonRow) =>
  //     //       salesPersonRow.employeeId === salesPerson.employeeId
  //     //   );
  //     //   if (!exists && salesPerson != null && salesPerson.employeeId !== 0) {
  //     //     setValue('salesPerson', null);
  //     //   }
  //     // }
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
  //     // // ---- here if the result only contains one result, autoSet.......
  //     // if (
  //     //   salesPersonOptionsData &&
  //     //   salesPersonOptionsData?.length === 1 &&
  //     //   salesPersonOptionsData?.[0].employeeId !== salesPerson?.employeeId &&
  //     //   // salesPerson != null &&
  //     //   salesPerson?.employeeId !== 0
  //     // ) {
  //     //   setValue('salesPerson', salesPersonOptionsData?.[0]);
  //     // }
  //     // // ---- here if the result only contains one result, autoSet----- ENDS...
  //   }
  // }, [
  //   salesPersonOptionsData,
  //   salesPersonOptionsIsLoading,
  //   salesPersonOptionsError,
  //   salesPersonOptionsIsError,
  //   salesPersonOptionsIsFetching,
  //   salesPersonOptionsIsSuccess,
  // ]);

  // const [
  //   triggerGetPaymentModeOptions,
  //   {
  //     data: paymentModeOptionsData,
  //     error: paymentModeOptionsError,
  //     isError: paymentModeOptionsIsError,
  //     isSuccess: paymentModeOptionsIsSuccess,
  //     isLoading: paymentModeOptionsIsLoading,
  //     isFetching: paymentModeOptionsIsFetching,
  //   },
  // ] = useLazyGetPaymentModeQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (paymentModeOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching paymentModeOptionsData, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching paymentModeOptionsData, see console--->:'
  //     );
  //     console.log(paymentModeOptionsError);
  //   }
  //   if (paymentModeOptionsIsSuccess) {
  //     console.log('paymentModeOptionsIsSuccess');
  //     console.log(paymentModeOptionsData);
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null.......
  //     // const { paymentMode } = watchedFields;
  //     // if (paymentModeOptionsData && paymentMode?.employeeId) {
  //     //   const exists = paymentModeOptionsData?.some(
  //     //     (paymentModeRow) =>
  //     //       paymentModeRow.employeeId === paymentMode.employeeId
  //     //   );
  //     //   if (!exists && paymentMode != null && paymentMode.employeeId !== 0) {
  //     //     setValue('paymentMode', null);
  //     //   }
  //     // }
  //     // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
  //     // // ---- here if the result only contains one result, autoSet.......
  //     // if (
  //     //   paymentModeOptionsData &&
  //     //   paymentModeOptionsData?.length === 1 &&
  //     //   paymentModeOptionsData?.[0].employeeId !== paymentMode?.employeeId &&
  //     //   // paymentMode != null &&
  //     //   paymentMode?.employeeId !== 0
  //     // ) {
  //     //   setValue('paymentMode', paymentModeOptionsData?.[0]);
  //     // }
  //     // // ---- here if the result only contains one result, autoSet----- ENDS...
  //   }
  // }, [
  //   paymentModeOptionsData,
  //   paymentModeOptionsIsLoading,
  //   paymentModeOptionsError,
  //   paymentModeOptionsIsError,
  //   paymentModeOptionsIsFetching,
  //   paymentModeOptionsIsSuccess,
  // ]);

  const [
    triggerGetSalesReturnInfo,
    {
      data: salesReturnInfoData,
      error: salesReturnInfoError,
      isError: salesReturnInfoIsError,
      isSuccess: salesReturnInfoIsSuccess,
      isLoading: salesReturnInfoIsLoading,
      isFetching: salesReturnInfoIsFetching,
    },
  ] = useLazyGetSalesReturnInfoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (salesReturnInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching salesReturnInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesReturnInfoData, see console--->:'
      );
      console.log(salesReturnInfoError);

      const data: ISalesReturnInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesReturnId: '',
          salesReturnNo: '',
          // salesOrderNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          // buyerGroupId: 0,
          // buyerGroupName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          locationId: null,
          voucherId: null,
        });
      }
      setSalesReturnGrid([...data]);
      setSalesReturnGridPrev([]);

      setIsSalesReturnGridLoading(false);
    }
    if (
      salesReturnInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !salesReturnInfoIsLoading &&
      !salesReturnInfoIsError &&
      !salesReturnInfoIsFetching
    ) {
      console.log('salesReturnInfoIsSuccess');
      console.log(salesReturnInfoData);

      const data: ISalesReturnInfo[] = JSON.parse(
        JSON.stringify([...(salesReturnInfoData || [])])
      );
      const data2: ISalesReturnInfo[] = JSON.parse(
        JSON.stringify([...(salesReturnInfoData || [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesReturnId: '',
          salesReturnNo: '',
          // salesOrderNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          // buyerGroupId: 0,
          // buyerGroupName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          locationId: null,
          voucherId: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setSalesReturnGrid([...dataCopy]);
      setSalesReturnGridPrev([...dataCopy2]);
      setIsSalesReturnGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsSalesReturnGridLoading(true);
    }
  }, [
    salesReturnInfoData,
    salesReturnInfoIsLoading,
    salesReturnInfoError,
    salesReturnInfoIsError,
    salesReturnInfoIsFetching,
    salesReturnInfoIsSuccess,
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
    data: buyerComboForGridOptions,
    isLoading: buyerComboForGridOptionsLoading,
    error: buyerComboForGridOptionsError,
    isSuccess: buyerComboForGridOptionsIsSuccess,
    isError: buyerComboForGridOptionsIsError,
    isFetching: buyerComboForGridOptionsIsFetching,
    refetch: buyerComboForGridOptionsRefetch,
  } = useGetBuyerForComboByCompanyLocationIdQuery({
    companyId: userInfo?.companyId,
    locationId: userInfo?.locationId,
  });

  useEffect(() => {
    if (buyerComboForGridOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerComboForGridOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerComboForGridOptions for autocomplete, see console--->:'
      );
      console.log(buyerComboForGridOptionsError);
    }
    if (buyerComboForGridOptionsIsSuccess) {
      console.log('buyerComboForGridOptions');
      console.log(buyerComboForGridOptions);
    }
  }, [
    buyerComboForGridOptionsLoading,
    buyerComboForGridOptionsIsFetching,
    buyerComboForGridOptionsError,
    buyerComboForGridOptionsIsError,
    buyerComboForGridOptions,
    buyerComboForGridOptionsIsSuccess,
  ]);

  const [
    processSaveSalesReturn,
    {
      isLoading: processSaveSalesReturnIsLoading,
      isError: processSaveSalesReturnIsError,
      error: processSaveSalesReturnError,
      isSuccess: processSaveSalesReturnIsSuccess,
      data: processSaveSalesReturnData,
    },
  ] = useProcessSaveSalesReturnMutation();

  useEffect(() => {
    // if (!processSaveSalesReturnIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveSalesReturnIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Sales Returns have been saved successfully!`,
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
          salesReturnGridInitializer.resetRowSelection();
          console.log(processSaveSalesReturnData);
          setDeletedSalesReturnDetailSerialRows([]);
          setDeletedSalesReturnDetailRows([]);
          setSalesReturnDetailRows([]);
        }
      });
    } else if (processSaveSalesReturnIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving SalesReturn data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving SalesReturn data, see console---->'
      );
      console.log(processSaveSalesReturnError);
      salesReturnGridInitializer.resetRowSelection();
    }
  }, [
    processSaveSalesReturnIsLoading,
    processSaveSalesReturnIsError,
    processSaveSalesReturnData,
    processSaveSalesReturnError,
    processSaveSalesReturnIsSuccess,
  ]);

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  // Trigger GetBuyerGroup RTK Query whenever a form field changes
  // useEffect(() => {
  //   const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } =
  //     watchedFields;

  //   console.log('watchedFields');
  //   console.log(watchedFields);

  //   // Trigger your RTK Query
  //   triggerGetBuyerGroup({
  //     companyId: userInfo?.companyId,
  //     buyerId: buyer?.buyerId || null,
  //     salesPersonId: salesPerson?.employeeId || null,
  //     //   buyerGroupId: buyerGroup?.buyerGroupId || null,
  //     // departmentId: department?.departmentId || null,
  //   });
  // }, [
  //   watchedFields.buyer,
  //   watchedFields.salesPerson,
  //   watchedFields.department,
  //   userInfo?.companyId,
  //   triggerGetBuyerGroup,
  // ]);

  // Trigger GetBuyer RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyer({
      companyId: userInfo?.companyId,
      locationId: userInfo?.locationId,
      // buyerGroupId: buyerGroup?.buyerGroupId || null,
      // salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,

      // salesReturnId: salesReturn?.salesReturnId || null,
    });
  }, [
    // watchedFields.buyerGroup,
    // watchedFields.salesPerson,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  // Trigger GetSalesPerson RTK Query whenever a form field changes
  // useEffect(() => {
  //   const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } =
  //     watchedFields;

  //   console.log('watchedFields');
  //   console.log(watchedFields);

  //   // Trigger your RTK Query
  //   triggerGetSalesPerson({
  //     companyId: userInfo?.companyId,
  //     buyerGroupId: buyerGroup?.buyerGroupId || null,
  //     buyerId: buyer?.buyerId || null,
  //     // departmentId: department?.departmentId || null,
  //   });
  // }, [
  //   watchedFields.buyerGroup,
  //   watchedFields.buyer,
  //   watchedFields.department,
  //   userInfo?.companyId,
  //   triggerGetBuyer,
  // ]);

  // Trigger GetPaymentModeOptions RTK Query whenever a form field changes
  // useEffect(() => {
  //   const { location, paymentMode } = watchedFields;

  //   console.log('watchedFields');
  //   console.log(watchedFields);

  //   // Trigger your RTK Query
  //   triggerGetPaymentModeOptions({
  //     companyId: userInfo?.companyId,
  //     locationId: location?.locationId || userInfo?.companyId,
  //   });
  // }, [watchedFields.location, userInfo?.companyId]);

  // Trigger GetSalesReturnInfo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      // salesPerson,
      // buyerGroup,
      dateFrom,
      dateTo,
      taxOver,
      taxUnder,
      amountOver,
      amountUnder,
      location,
      salesReturn,
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
      const getParams: IGetSalesReturnInfoFilterDto = {
        buyerId: buyer?.buyerId || null,
        // buyerGroupId: buyerGroup?.buyerGroupId || null,
        fromDate: dayjs(dateFrom)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS'),
        toDate: dayjs(dateTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
        taxOver: taxOver || null,
        taxUnder: taxUnder || null,
        amountOver: amountOver || null,
        amountUnder: amountUnder || null,
        // employeeId: salesPerson?.employeeId || null,
        locationId: location?.locationId || userInfo?.locationId || null,
        salesReturnId: salesReturn?.salesReturnId || null,
      };

      triggerGetSalesReturnInfo({
        filter: getParams,
      });
    } else {
      const data: ISalesReturnInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesReturnId: '',
          salesReturnNo: '',
          // salesOrderNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          // buyerGroupId: 0,
          // buyerGroupName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          locationId: null,
          voucherId: null,
        });
      }
      setSalesReturnGrid([...data]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    // watchedFields.buyerGroup,
    watchedFields.buyer,
    // watchedFields.salesPerson,
    watchedFields.amountOver,
    watchedFields.amountUnder,
    watchedFields.taxOver,
    watchedFields.taxUnder,
    watchedFields.location,
    watchedFields.salesReturn, // eita baaki, autocomplete boshano
    // watchedFields.paymentMode,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const handleEditDetail = (index: number, row: ISalesReturnInfo) => {
    const objTemp = {
      salesReturnInfoGridIndex: index,
      salesReturnInfoGridRow: row,
      salesReturnId: row.salesReturnId,
      editModalOpen: true,
    };

    setDetailEditModalInfo(objTemp);
  };

  const handleDetailEditModalClose = () => {
    const objTemp = {
      salesReturnInfoGridIndex: null,
      salesReturnInfoGridRow: null,
      salesReturnId: null,
      editModalOpen: false,
    };

    setDetailEditModalInfo(objTemp);
  };

  const saveSalesReturn = () => {
    console.log(salesReturnGrid); // eita abar purata ashbena, shudhu selected gula ashbe
    console.log(deletedSalesReturnDetailRows);

    console.log(salesReturnDetailRows);
    console.log(deletedSalesReturnDetailSerialRows);

    console.log(deletedSalesReturnDetailSerialRows);

    /// ----Selected SalesReturns--------

    const selectedRows = salesReturnGridInitializer.getSelectedRowModel().rows;
    const selectedSalesReturnRows = selectedRows.map((row) => row.original);
    // console.log(selectedData);

    if (selectedSalesReturnRows.length === 0) {
      toast.warning('Select rows to save!');
      return;
    }

    /// /////////--------SalesReturn Save ---------
    const updateSalesReturn: IUpdateSalesReturnCommand[] = [];

    const createSalesReturnDetail: ICreateSalesReturnDetailCommand[] = [];
    const updateSalesReturnDetail: IUpdateSalesReturnDetailCommand[] = [];
    const deleteSalesReturnDetail: IDeleteSalesReturnDetailCommand[] = [];

    const createSalesReturnDetailSerial: ICreateSalesReturnDetailSerialCommand[] =
      [];
    const deleteSalesReturnDetailSerial: IDeleteSalesReturnDetailSerialCommand[] =
      [];
    const createSalesReturnDetailTax: ICreateSalesReturnDetailTaxCommand[] = [];
    const updateSalesReturnDetailTax: IUpdateSalesReturnDetailTaxCommand[] = [];
    const deleteSalesReturnDetailTax: IDeleteSalesReturnDetailTaxCommand[] = [];

    const processSalesReturnDetail = (salesReturnId: string) => {
      /// /////////--------SalesReturnDetail Save(Also salesReturnDetailSerial save cz nested) ---------

      const selectedPRDRows = salesReturnDetailRows.filter(
        (w) => w.salesReturnId === salesReturnId
      );

      // alert('selectedPRDRows');
      // console.log('selectedPRDRows');
      // console.log(selectedPRDRows);
      // console.log(salesReturnDetailRows);

      const salesReturnDetailRowsSelected: ISalesReturnDetailInfo[] =
        Array.isArray(selectedPRDRows) ? selectedPRDRows : [];

      for (let i = 0; i < salesReturnDetailRowsSelected.length; i++) {
        // update salesReturnDetail
        if (salesReturnDetailRowsSelected[i].salesReturnDetailId) {
          const obj: IUpdateSalesReturnDetailCommand = {
            salesReturnDetailId:
              salesReturnDetailRowsSelected[i].salesReturnDetailId,
            // salesReturnId:
            //   salesReturnDetailRowsSelected[i].salesReturnId,
            // lSalesId: salesReturnDetailRowsSelected[i].lSalesId,
            productId: salesReturnDetailRowsSelected[i].productId,
            quantity: salesReturnDetailRowsSelected[i].quantity,
            price: salesReturnDetailRowsSelected[i].price,
            unitTypeId: salesReturnDetailRowsSelected[i].unitTypeId,
            // discount: salesReturnDetailRowsSelected[i].discount || 0,
            // locationId:
            //   salesReturnDetailRowsSelected[i].locationId ||
            //   userInfo?.locationId ||
            //   null,
          };

          // create salesReturnDetailSerial-Bairerta(serial)
          for (
            let j = 0;
            j <
            salesReturnDetailRowsSelected[i].salesReturnDetailSerialInfoDto
              .length;
            j++
          ) {
            if (
              !salesReturnDetailRowsSelected[i].salesReturnDetailSerialInfoDto[
                j
              ].salesReturnDetailSerialId
            ) {
              const tempObj: ICreateSalesReturnDetailSerialCommand = {
                salesReturnDetailId:
                  salesReturnDetailRowsSelected[i].salesReturnDetailId,
                salesReturnId:
                  salesReturnDetailRowsSelected[i]
                    .salesReturnDetailSerialInfoDto[j].salesReturnId || '',
                serialNo:
                  salesReturnDetailRowsSelected[i]
                    .salesReturnDetailSerialInfoDto[j].serialNo,
              };
              createSalesReturnDetailSerial.push(tempObj);
            }
          }

          // create salesReturnDetailTax-Process Model moddhei jeita open, Bairerta
          if (!salesReturnDetailRowsSelected[i].taxRowId) {
            const tempObj: ICreateSalesReturnDetailTaxCommand = {
              salesReturnDetailId:
                salesReturnDetailRowsSelected[i].salesReturnDetailId,
              taxId: 1,
              taxAmount: salesReturnDetailRowsSelected[i].taxAmount || 0,
            };
            createSalesReturnDetailTax.push(tempObj);
          }

          if (!salesReturnDetailRowsSelected[i].vatRowId) {
            const tempObj: ICreateSalesReturnDetailTaxCommand = {
              salesReturnDetailId:
                salesReturnDetailRowsSelected[i].salesReturnDetailId,
              taxId: 2,
              taxAmount: salesReturnDetailRowsSelected[i].vatAmount || 0,
            };
            createSalesReturnDetailTax.push(tempObj);
          }
          // create salesReturnDetailTax-Process Model moddhei jeita open, Bairerta---ENDS---

          // update salesReturnDetailTax-Process Model moddhei jeita open, Bairerta
          if (salesReturnDetailRowsSelected[i].taxRowId) {
            const tempObj: IUpdateSalesReturnDetailTaxCommand = {
              salesReturnDetail_TaxId:
                salesReturnDetailRowsSelected[i].taxRowId,
              taxAmount: salesReturnDetailRowsSelected[i].taxAmount || 0,
            };
            updateSalesReturnDetailTax.push(tempObj);
          }

          if (salesReturnDetailRowsSelected[i].vatRowId) {
            const tempObj: IUpdateSalesReturnDetailTaxCommand = {
              salesReturnDetail_TaxId:
                salesReturnDetailRowsSelected[i].vatRowId,
              taxAmount: salesReturnDetailRowsSelected[i].vatAmount || 0,
            };
            updateSalesReturnDetailTax.push(tempObj);
          }
          // update salesReturnDetailTax-Process Model moddhei jeita open, Bairerta----ENDS---

          updateSalesReturnDetail.push(obj);
        }

        // create SalesReturnDetail
        if (!salesReturnDetailRowsSelected[i].salesReturnDetailId) {
          const obj: ICreateSalesReturnDetailCommand = {
            salesReturnId: salesReturnDetailRowsSelected[i].salesReturnId,
            productId: salesReturnDetailRowsSelected[i].productId,
            quantity: salesReturnDetailRowsSelected[i].quantity,
            salesOrderId: salesReturnDetailRowsSelected[i].salesOrderId,
            price: salesReturnDetailRowsSelected[i].price,
            createSalesReturnDetailSerialCommand: [],
            createSalesReturnDetail_TaxCommand: [],
            unitTypeId: salesReturnDetailRowsSelected[i].unitTypeId,
            // companyId: userInfo?.companyId,
            locationId: userInfo?.locationId,
            // discount: salesReturnDetailRowsSelected[i].discount || 0,
          };

          // create salesReturnDetailSerial(serial) vitorer ta, salesReturnDetailCreate er moddhe
          for (
            let j = 0;
            j <
            salesReturnDetailRowsSelected[i].salesReturnDetailSerialInfoDto
              .length;
            j++
          ) {
            const tempObj: ICreateSalesReturnDetailSerialCommand = {
              salesReturnDetailId: null,
              salesReturnId:
                salesReturnDetailRowsSelected[i].salesReturnDetailSerialInfoDto[
                  j
                ].salesReturnId || '',
              serialNo:
                salesReturnDetailRowsSelected[i].salesReturnDetailSerialInfoDto[
                  j
                ].serialNo,
            };
            obj.createSalesReturnDetailSerialCommand?.push(tempObj);
          }

          // create salesReturnDetailTax-Process Model er salesReturnDetail er moddhe jeita, peter vetorerta
          if (
            !salesReturnDetailRowsSelected[i].taxRowId &&
            !salesReturnDetailRowsSelected[i].salesReturnDetailId
          ) {
            const tempObj: ICreateSalesReturnDetailTaxCommand = {
              salesReturnDetailId: null,
              taxId: 2,
              taxAmount: salesReturnDetailRowsSelected[i].taxAmount || 0,
            };
            obj.createSalesReturnDetail_TaxCommand?.push(tempObj);
          }

          if (
            !salesReturnDetailRowsSelected[i].vatRowId &&
            !salesReturnDetailRowsSelected[i].salesReturnDetailId
          ) {
            const tempObj: ICreateSalesReturnDetailTaxCommand = {
              salesReturnDetailId: null,
              taxId: 1,
              taxAmount: salesReturnDetailRowsSelected[i].vatAmount || 0,
            };
            obj.createSalesReturnDetail_TaxCommand?.push(tempObj);
          }
          // create salesReturnDetailTax-Process Model er salesReturnDetail er moddhe jeita, peter vetorerta---ENDS---

          createSalesReturnDetail.push(obj);
        }
      }

      // delete salesReturnDetail, selected ones
      if (deletedSalesReturnDetailRows.length) {
        const deletedSalesReturnDetailRowsSelected: IDeleteSalesReturnDetailCommand[] =
          deletedSalesReturnDetailRows.filter(
            (w) => w.salesReturnId === salesReturnId
          );

        for (let i = 0; i < deletedSalesReturnDetailRowsSelected.length; i++) {
          const obj: IDeleteSalesReturnDetailCommand = {
            salesReturnDetailId:
              deletedSalesReturnDetailRowsSelected[i].salesReturnDetailId,
          };
          deleteSalesReturnDetail.push(obj);
        }
      }
      // delete salesReturnDetailSerial, selected ones
      if (deletedSalesReturnDetailSerialRows.length) {
        const deletedSalesReturnDetailSerialRowsSelected: IDeleteSalesReturnDetailSerialCommand[] =
          deletedSalesReturnDetailSerialRows.filter(
            (w) => w.salesReturnId === salesReturnId
          );

        for (
          let i = 0;
          i < deletedSalesReturnDetailSerialRowsSelected.length;
          i++
        ) {
          const obj: IDeleteSalesReturnDetailSerialCommand = {
            salesReturnDetailSerialId:
              deletedSalesReturnDetailSerialRowsSelected[i]
                .salesReturnDetailSerialId,
          };
          deleteSalesReturnDetailSerial.push(obj);
        }
      }

      // delete salesReturnDetailTax, selected ones
      if (deletedSalesReturnDetailTaxRows.length) {
        const deletedSalesReturnDetailTaxRowsSelected: IDeleteSalesReturnDetailTaxCommand[] =
          deletedSalesReturnDetailTaxRows.filter(
            (w) => w.salesReturnId === salesReturnId
          );

        for (
          let i = 0;
          i < deletedSalesReturnDetailTaxRowsSelected.length;
          i++
        ) {
          const obj: IDeleteSalesReturnDetailTaxCommand = {
            salesReturnDetail_TaxId:
              deletedSalesReturnDetailTaxRowsSelected[i]
                .salesReturnDetail_TaxId,
          };
          deleteSalesReturnDetailTax.push(obj);
        }
      }
    };

    // Update salesReturn

    for (let i = 0; i < selectedSalesReturnRows.length; i++) {
      const prevRecordSalesReturnRow = salesReturnGridPrev.find(
        (w) => w.salesReturnId === selectedSalesReturnRows[i].salesReturnId
      );

      if (prevRecordSalesReturnRow !== selectedSalesReturnRows[i]) {
        const tempUpdateSR: IUpdateSalesReturnCommand = {
          salesReturnId: selectedSalesReturnRows[i].salesReturnId,
          totalAmount: selectedSalesReturnRows[i].totalAmount,
          buyerId: selectedSalesReturnRows[i].buyerId,
          voucherId: selectedSalesReturnRows[i].voucherId,
          // paymentModeId: selectedSalesReturnRows[i].paymentModeId,
          // salesDiscount: selectedSalesReturnRows[i].salesDiscount,
        };
        updateSalesReturn.push(tempUpdateSR);
      }
      processSalesReturnDetail(selectedSalesReturnRows[i].salesReturnId);
    }

    // --------------- The sending Obj to api----------------
    const sendingObj: ISalesReturnProcessCommandsVM = {
      updateSalesReturnCommand: [...updateSalesReturn],
      deleteSalesReturnCommand: [],
      createSalesReturnDetailCommand: [...createSalesReturnDetail],
      updateSalesReturnDetailCommand: [...updateSalesReturnDetail],
      deleteSalesReturnDetailCommand: [...deleteSalesReturnDetail],
      // createSalesReturnAdditionalCostCommand: [],

      //  updateSalesReturnAdditionalCostCommand: [],

      // deleteSalesReturnAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      salesReturnId: null,
      createSalesReturnDetailSerialCommand: [...createSalesReturnDetailSerial],
      deleteSalesReturnDetailSerialCommand: [...deleteSalesReturnDetailSerial],
      createSalesReturnDetail_TaxCommand: [...createSalesReturnDetailTax],
      updateSalesReturnDetail_TaxCommand: [...updateSalesReturnDetailTax],
      deleteSalesReturnDetail_TaxCommand: [],
      // deleteSalesReturnDetailTaxCommand: [...deleteSalesReturnDetailTax], // eita lagbena, cz individually tax/vat delete korar option nei, salesReturnDetail delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
    };

    console.log('------The ultimate Object to send------');
    console.log(sendingObj);

    if (
      !sendingObj.updateSalesReturnCommand?.length &&
      !sendingObj.createSalesReturnDetailCommand?.length &&
      !sendingObj.updateSalesReturnDetailCommand?.length &&
      !sendingObj.deleteSalesReturnDetailCommand?.length &&
      !sendingObj.createSalesReturnDetailSerialCommand?.length &&
      !sendingObj.deleteSalesReturnDetailSerialCommand?.length
    ) {
      toast.info('No changes to save');
    } else {
      // API CALL HOBE
      processSaveSalesReturn(sendingObj);
    }
  };

  const deleteSalesReturn = () => {
    const selectedRows = salesReturnGridInitializer.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log(selectedData);

    const deletedSalesReturns: IDeleteSalesReturnCommand[] = [];
    for (let i = 0; i < selectedData.length; i++) {
      const obj: IDeleteSalesReturnCommand = {
        salesReturnId: selectedData[i].salesReturnId,
      };
      deletedSalesReturns.push(obj);
    }

    const sendingObj: ISalesReturnProcessCommandsVM = {
      updateSalesReturnCommand: [],
      deleteSalesReturnCommand: deletedSalesReturns,
      createSalesReturnDetailCommand: [],
      updateSalesReturnDetailCommand: [],
      deleteSalesReturnDetailCommand: [],
      // createSalesReturnAdditionalCostCommand: [],

      // updateSalesReturnAdditionalCostCommand: [],

      // deleteSalesReturnAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      salesReturnId: null,
      createSalesReturnDetailSerialCommand: [],
      deleteSalesReturnDetailSerialCommand: [],
    };

    if (deletedSalesReturns.length > 0) {
      processSaveSalesReturn(sendingObj);
    }
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
      fontSize: '0.75rem',
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

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

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

  const salesReturnGridColumns = useMemo<MRT_ColumnDef<ISalesReturnInfo>[]>(
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
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.salesReturnId ? 'visible' : 'invisible'}
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
        ),
      },
      {
        accessorFn: (row) => row.buyerName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Buyer',
        Cell: ({ renderedCellValue, row }) => {
          const currentBuyer = {
            buyerId: salesReturnGrid[row.index].buyerId || null,
            buyerName: salesReturnGrid[row.index].buyerName || '',
          };
          const isDisabled = !salesReturnGrid[row.index].salesReturnId;
          return (
            <Controller
              name={`buyerName_row${row.index}`}
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
                        buyerComboForGridOptions?.map(
                          (buyerComboForGridOptionRow) => [
                            buyerComboForGridOptionRow.buyerId,
                            buyerComboForGridOptionRow,
                          ]
                        )
                      ).values()
                    ) || []
                  } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
                  value={currentBuyer}
                  onChange={(event, selectedOption: any) => {
                    if (selectedOption) {
                      salesReturnGrid[row.index].buyerId =
                        selectedOption?.buyerId || null;
                      salesReturnGrid[row.index].buyerName =
                        selectedOption?.buyerName || '';
                      // -----------------setting groupName&Id------------
                      // salesReturnGrid[row.index].buyerGroupName =
                      //   selectedOption?.buyerGroupName || '';
                      // salesReturnGrid[row.index].buyerGroupId =
                      //   selectedOption?.buyerGroupId || '';

                      setSalesReturnGrid([...salesReturnGrid]);

                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.buyerName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.buyerId === selectedValue?.buyerId
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
                          fontSize: '0.625rem', // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: '0.8125rem' },
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
      //   accessorFn: (row) => row.buyerGroupName ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.buyerGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'buyerGroupName',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Buyer Group',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: '0.8125rem' },
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
        accessorFn: (row) => row.salesReturnNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.salesReturnNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'salesReturnNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Sales Return No',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
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
        accessorFn: (row) => row.totalAmount ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.totalAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'totalAmount',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Amount',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
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
      // {
      //   accessorFn: (row) => row.paymentModeName ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.paymentModeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'paymentModeName',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Payment Mode',
      //   Cell: ({ renderedCellValue, row }) => {
      //     const currentPaymentMode = {
      //       paymentModeId: salesReturnGrid[row.index].paymentModeId || null,
      //       paymentModeName:
      //         salesReturnGrid[row.index].paymentModeName || '',
      //     };
      //     const isDisabled = !salesReturnGrid[row.index].salesReturnId;
      //     return (
      //       <Controller
      //         name={`paymentMode_row${row.index}`}
      //         control={control}
      //         // rules={{
      //         //   // required: '*Required',
      //         //   validate: (value) => validateAccounts(value, row.original),
      //         // }}
      //         render={({
      //           field: { onChange, onBlur, value, ref },
      //           fieldState: { error },
      //         }) => (
      //           <Autocomplete
      //             id=""
      //             size="small"
      //             sx={{ width: '100%' }}
      //             PopperComponent={PopperMy}
      //             clearOnEscape
      //             // disableClearable
      //             disabled={isDisabled}
      //             freeSolo
      //             // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
      //             options={
      //               Array.from(
      //                 new Map(
      //                   paymentModeOptionsData?.map((paymentModeOptionRow) => [
      //                     paymentModeOptionRow.paymentModeId,
      //                     paymentModeOptionRow,
      //                   ])
      //                 ).values()
      //               ) || []
      //             } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
      //             value={currentPaymentMode}
      //             onChange={(event, selectedOption: any) => {
      //               salesReturnGrid[row.index].paymentModeId =
      //                 selectedOption?.paymentModeId || null;
      //               salesReturnGrid[row.index].paymentModeName =
      //                 selectedOption?.paymentModeName || '';
      //               setSalesReturnGrid([...salesReturnGrid]);
      //               onChange(selectedOption);
      //             }} // React-hook-form manages the state
      //             onBlur={onBlur} // Trigger validation on blur
      //             getOptionLabel={(option: any) =>
      //               option ? option.paymentModeName : ''
      //             }
      //             isOptionEqualToValue={(option, selectedValue) =>
      //               option.paymentModeId === selectedValue?.paymentModeId
      //             }
      //             renderInput={(params) => (
      //               <TextField
      //                 {...params}
      //                 variant="standard"
      //                 size="small"
      //                 error={!!error}
      //                 helperText={error ? error.message : null}
      //                 FormHelperTextProps={{
      //                   sx: {
      //                     fontSize: '0.625rem', // Set the font size
      //                     marginTop: 0, // Set the margin
      //                     color: 'red', // Set the color (example)
      //                   },
      //                 }}
      //                 InputProps={{
      //                   ...params.InputProps,
      //                   style: { fontSize: '0.8125rem' },
      //                   disableUnderline: true,
      //                 }}
      //                 sx={{ width: '100%' }}
      //                 // inputRef={ref}
      //                 inputRef={(node) => {
      //                   if (node) {
      //                     // eslint-disable-next-line no-param-reassign
      //                     node.value = renderedCellValue;
      //                   }
      //                 }}
      //                 // onBlur={() => { console.log(this) }}
      //               />
      //             )}
      //           />
      //         )}
      //       />
      //     );
      //   },
      // },
      {
        accessorFn: (row) => row.vat ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.vat, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'vat',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'VAT',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
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
        accessorFn: (row) => row.tax ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.tax, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'tax',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'TAX',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
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
      // {
      //   accessorFn: (row) => row.salesDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.salesDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'salesDiscount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Invoice Discount',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: '0.8125rem' },
      //             disableUnderline: true,
      //             // readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           onBlur={(e) => {
      //             const discountTemp = Number.isNaN(
      //               parseInt(e.target.value, 10)
      //             )
      //               ? null
      //               : Math.abs(parseInt(e.target.value, 10));
      //             salesReturnGrid[row.index].salesDiscount = discountTemp;
      //             setSalesReturnGrid([...salesReturnGrid]);
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
      // {
      //   accessorFn: (row) => row.salesDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.salesDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'salesDiscount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Sales Discount',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: '0.8125rem' },
      //             disableUnderline: true,
      //             // readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           onBlur={(e) => {
      //             const discountTemp = Number.isNaN(parseFloat(e.target.value))
      //               ? null
      //               : Math.abs(parseFloat(e.target.value));
      //             // const totalAmountTemp = Number.isNaN(
      //             //   parseFloat(salesReturnGrid[row.index]?.totalAmount || 0)
      //             // )
      //             //   ? null
      //             //   : Math.abs(parseFloat(e.target.value));
      //             salesReturnGrid[row.index].salesDiscount =
      //               discountTemp || 0;
      //             salesReturnGrid[row.index].totalAmount =
      //               (salesReturnGrid[row.index]
      //                 .totalAmountWithoutSalesDiscount || 0) -
      //               (discountTemp || 0);
      //             // (salesReturnGrid[row.index]?.totalAmount || 0) -
      //             // (discountTemp || 0);

      //             setSalesReturnGrid([...salesReturnGrid]);
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

  const selectSalesReturnRowBySalesReturnId = (salesReturnId: string) => {
    if (!salesReturnId) return;

    const rows = salesReturnGridInitializer.getRowModel().rows;
    const target = rows.find((r) => r.original.salesReturnId === salesReturnId);
    if (!target) return;

    //  already selected? do nothing
    if (salesReturnGridInitializer.getState().rowSelection?.[target.id]) return;

    //  not selected -> add it without clearing others
    salesReturnGridInitializer.setRowSelection((prev) => ({
      ...(prev ?? {}),
      [target.id]: true,
    }));
  };

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
  }, [sortingSalesReturnGrid]);

  // ---------- material table virtualization---------

  const salesReturnGridInitializer: MRT_TableInstance<ISalesReturnInfo> =
    useMaterialReactTable({
      columns: salesReturnGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: salesReturnGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading:
          isSalesReturnGridLoading ||
          salesReturnInfoIsLoading ||
          salesReturnInfoIsFetching,
        sorting: sortingSalesReturnGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '1.875rem',
      },
      enableRowSelection: (row) => {
        // if (row.original.lastProcessedDate) {
        //   toast.warning(
        //     'You cannot select/calculate commission for this buyer, as this is already processed before'
        //   );
        // }
        return !!row.original.salesReturnId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
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
          fontSize: '0.8125rem',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '25rem' } },
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
              className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     buyerSalesRptGridState,
                //     salesReturnGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(salesReturnGrid, salesReturnGridColumns);
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
      onSortingChange: setSortingSalesReturnGrid,
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
                  : 'Sales Return Edit'}
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
                      </LocalizationProvider>
                    )}
                  />
                </div>

                {/* <Controller
                  name="buyerGroup"
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
                        { buyerGroupId: 0, buyerGroupName: 'All' },
                        ...(Array.from(
                          new Map(
                            buyerGroupOptionsData?.map(
                              (buyerGroupOption) => [
                                buyerGroupOption.buyerGroupName,
                                buyerGroupOption,
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
                        option ? option.buyerGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.buyerGroupName ===
                          selectedValue?.buyerGroupName &&
                        option.buyerGroupId ===
                          selectedValue?.buyerGroupId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buyer Group"
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
                            // endAdornment: (
                            //   <>
                            //     {buyerOptionsAutoCompLoading ? (
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
                /> */}

                <Controller
                  name="buyer"
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
                        { buyerId: 0, buyerName: 'All' },
                        ...(Array.from(
                          new Map(
                            buyerOptionsData?.map((buyerOption) => [
                              buyerOption.buyerName,
                              buyerOption,
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
                        option ? option.buyerName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.buyerName === selectedValue?.buyerName &&
                        option.buyerId === selectedValue?.buyerId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buyer"
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
                            // endAdornment: (
                            //   <>
                            //     {buyerOptionsAutoCompLoading ? (
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

                {/* <Controller
                  name="salesPerson"
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
                        { employeeId: 0, employeeName: 'All' },
                        ...(Array.from(
                          new Map(
                            salesPersonOptionsData?.map((salesPerson) => [
                              salesPerson.employeeName,
                              salesPerson,
                            ])
                          ).values()
                        ) || []),
                      ]} // Make sure it is unique
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.employeeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.employeeName === selectedValue?.employeeName &&
                        option.employeeId === selectedValue?.employeeId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Person"
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
                            // endAdornment: (
                            //   <>
                            //     {buyerOptionsAutoCompLoading ? (
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
                /> */}

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
                        { locationId: 0, locationName: 'Logged in Location' },
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
                            style: { fontSize: '0.875rem' },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: '0.8125rem' },
                            // endAdornment: (
                            //   <>
                            //     {buyerOptionsAutoCompLoading ? (
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

                {/* <Controller
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
                            style: { fontSize: '0.875rem' },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: '0.8125rem' },
                            // endAdornment: (
                            //   <>
                            //     {buyerOptionsAutoCompLoading ? (
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
                /> */}

                <div className="grid grid-cols-2 gap-x-4">
                  {/* Tax Over */}
                  <Controller
                    name="taxOver"
                    control={control}
                    rules={{
                      // required: 'Tax Over is required',
                      validate: (value) =>
                        taxUnderTemp === undefined ||
                        value <= taxUnderTemp ||
                        'Tax Over must be less than or equal to Tax Under',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Tax Over"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['taxOver', 'taxUnder']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: '0.8125rem' } }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />

                  {/* Tax Under */}
                  <Controller
                    name="taxUnder"
                    control={control}
                    rules={{
                      // required: 'Tax Under is required',
                      validate: (value) =>
                        taxOverTemp === undefined ||
                        value >= taxOverTemp ||
                        'Tax Under must be greater than or equal to Tax Over',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Tax Under"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['taxUnder', 'taxOver']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: '0.8125rem' } }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  {/* Amount Under */}
                  <Controller
                    name="amountOver"
                    control={control}
                    rules={{
                      // required: 'Amount Under is required',
                      validate: (value) =>
                        amountUnderTemp === undefined ||
                        value >= amountUnderTemp ||
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
                        InputProps={{ style: { fontSize: '0.8125rem' } }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
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
                        value <= amountOverTemp ||
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
                        InputProps={{ style: { fontSize: '0.8125rem' } }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                {/* ------------SLIDER-------------- */}

                {/* <div className="w-full col-span-2 mt-4 grid grid-cols-12 gap-x-3 gap-y-0">
                  <div className="col-span-12 text-start">
                    <p className="text-[0.8125rem]">Profitability %:</p>
                  </div>

                  <div className="md:col-span-10 col-span-9">
                    <Slider
                      value={(profitability as number) ?? 0} // use ?? to handle undefined/null safely
                      onChange={(_, val: number | number[]) => {
                        // val can be number or array (range slider), but you have single value slider
                        setValue('profitability', val as number);
                      }}
                      min={0}
                      max={100}
                      step={1}
                      aria-labelledby="input-slider"
                    />
                  </div>


                  <div className="md:col-span-2 col-span-3">
                    <Controller
                      name="profitability"
                      control={control}
                      rules={{
                        // required: 'Profitability is required',
                        min: { value: 0, message: 'Minimum is 0%' },
                        max: { value: 100, message: 'Maximum is 100%' },
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <Input
                          value={value ?? ''}
                          size="small"
                          onChange={(e) => onChange(Number(e.target.value))}
                          onBlur={() => {
                            const corrected = Math.max(
                              0,
                              Math.min(100, Number(value))
                            );
                            setValue('profitability', corrected);
                            trigger('profitability');
                            onBlur();
                          }}
                          error={!!error}
                          endAdornment={
                            <InputAdornment position="end">
                              <span className="font-extrabold">%</span>
                            </InputAdornment>
                          }
                          inputProps={{
                            step: 1,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                            style: { fontSize: '0.8125rem', fontWeight: 'bold' },
                          }}
                        />
                      )}
                    />
                  </div>
                </div> */}
                {/* ------------SLIDER-------ENDS------- */}
                <div className="w-full mt-4 mb-5 col-span-2 modifiedEditTable">
                  <MaterialReactTable table={salesReturnGridInitializer} />
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
                    disabled={processSaveSalesReturnIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveSalesReturnIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg active:bg-blue-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveSalesReturnIsLoading) saveSalesReturn();
                    }}
                  >
                    {processSaveSalesReturnIsLoading ? (
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
                    disabled={processSaveSalesReturnIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveSalesReturnIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-110 focus:bg-red-700 focus:shadow-lg active:bg-red-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveSalesReturnIsLoading) deleteSalesReturn();
                    }}
                  >
                    {processSaveSalesReturnIsLoading ? (
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

          <SalesReturnDetail
            salesReturnGrid={salesReturnGrid}
            setSalesReturnGrid={setSalesReturnGrid}
            salesReturnDetailRows={salesReturnDetailRows}
            setSalesReturnDetailRows={setSalesReturnDetailRows}
            deletedSalesReturnDetailRows={deletedSalesReturnDetailRows}
            setDeletedSalesReturnDetailRows={setDeletedSalesReturnDetailRows}
            deletedSalesReturnDetailSerialRows={
              deletedSalesReturnDetailSerialRows
            }
            setDeletedSalesReturnDetailSerialRows={
              setDeletedSalesReturnDetailSerialRows
            }
            deletedSalesReturnDetailTaxRows={deletedSalesReturnDetailTaxRows}
            setDeletedSalesReturnDetailTaxRows={
              setDeletedSalesReturnDetailTaxRows
            }
            detailEditModalInfo={detailEditModalInfo}
            setDetailEditModalInfo={setDetailEditModalInfo}
            handleDetailEditModalClose={handleDetailEditModalClose}
            selectSalesReturnRowBySalesReturnId={
              selectSalesReturnRowBySalesReturnId
            }
          />
        </Box>
      </Modal>
    </div>

    // return wrapper div--/--
  );
};

export default SalesReturnEdit;
