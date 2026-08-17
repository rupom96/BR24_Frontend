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
  useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
} from '../../../infrastructure/api/BuyerApiSlice';
import { IBuyerGroup } from '../../../domain/interfaces/BuyerGroupInterface';
import { IBuyer } from '../../../domain/interfaces/BuyerInterface';
import { ISalesPersonComboBox } from '../../../domain/interfaces/SalesPersonInterface';
import { IDepartment } from '../../../domain/interfaces/DepartmentInterface';
import {
  ICreateSalesDetailCommand,
  ICreateSalesOrderDetailCommand,
  ICreateSalesOrderDetailTaxCommand,
  IDeleteSalesDetailCommand,
  IDeleteSalesOrderCommand,
  IDeleteSalesOrderDetailCommand,
  IDeleteSalesOrderDetailTaxCommand,
  IGetSalesOrderInfoFilterDto,
  ISalesOrder,
  ISalesOrderDetailInfo,
  ISalesOrderInfo,
  ISalesOrderProcessCommandsVM,
  IUpdateSalesOrderCommand,
  IUpdateSalesOrderDetailCommand,
  IUpdateSalesOrderDetailTaxCommand,
} from '../../../domain/interfaces/SalesOrderInterface';
import { useLazyGetSalesPersonByCompanyLocationBuyerIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';
import { useLazyGetPaymentModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';
import {
  useLazyGetSalesOrderInfoQuery,
  useProcessSaveSalesOrderMutation,
} from '../../../infrastructure/api/SalesOrderApiSlice';
import SalesOrderDetail from './SalesOrderDetail/SalesOrderDetail';
import {
  useLazyGetBrandByCompanyIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductGroupByCompanyIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';

type Props = {};

const PaymentEditGh = ({
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

  const [salesOrderGrid, setSalesOrderGrid] = useState<ISalesOrderInfo[]>([]);
  const [salesOrderGridPrev, setSalesOrderGridPrev] = useState<
    ISalesOrderInfo[]
  >([]);
  // const [deletedSalesOrderRows, setDeletedSalesOrderRows] = useState<
  //   IDeleteSalesOrderCommand[]
  // >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [salesOrderDetailRows, setSalesOrderDetailRows] = useState<
    ISalesOrderDetailInfo[]
  >([]);
  const [deletedSalesOrderDetailRows, setDeletedSalesOrderDetailRows] =
    useState<IDeleteSalesOrderDetailCommand[]>([]);

  const [deletedSalesDetailRows, setDeletedSalesDetailRows] = useState<
    IDeleteSalesDetailCommand[]
  >([]);

  const [deletedSalesOrderDetailTaxRows, setDeletedSalesOrderDetailTaxRows] =
    useState<IDeleteSalesOrderDetailTaxCommand[]>([]);

  // type FormValues = {
  //   buyerGroup: IBuyerGroup | null;
  //   buyer: IBuyer | null;
  //   salesPerson: ISalesPersonComboBox | null;
  //   department: IDepartment | null;
  //   dateFrom: string | null;
  //   dateTo: string | null;
  // };

  //   grid virtualization states
  const [isSalesOrderGridLoading, setIsSalesOrderGridLoading] = useState(true);
  const [sortingSalesOrderGrid, setSortingSalesOrderGrid] =
    useState<MRT_SortingState>([]);

  const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

  const [deletedSerials, setDeletedSerials] = useState<
    IDeleteSalesDetailCommand[]
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

  const [
    triggerGetBuyerGroup,
    {
      data: buyerGroupOptionsData,
      error: buyerGroupOptionsError,
      isError: buyerGroupOptionsIsError,
      isSuccess: buyerGroupOptionsIsSuccess,
      isLoading: buyerGroupOptionsIsLoading,
      isFetching: buyerGroupOptionsIsFetching,
    },
  ] = useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (buyerGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerGroupOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerGroupOptionsData, see console--->:'
      );
      console.log(buyerGroupOptionsError);
    }
    if (buyerGroupOptionsIsSuccess) {
      console.log('buyerGroupOptionsIsSuccess');
      console.log(buyerGroupOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { buyerGroup } = watchedFields;
      // if (buyerGroupOptionsData && buyerGroup?.buyerGroupId) {
      //   const exists = buyerGroupOptionsData?.some(
      //     (buyerGroupRow) =>
      //       buyerGroupRow.buyerGroupId === buyerGroup.buyerGroupId
      //   );
      //   if (!exists && buyerGroup != null && buyerGroup.buyerGroupId !== 0) {
      //     setValue('buyerGroup', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   buyerGroupOptionsData &&
      //   buyerGroupOptionsData.length === 1 &&
      //   buyerGroupOptionsData?.[0].buyerGroupId !== buyerGroup?.buyerGroupId &&
      //   // buyerGroup != null &&
      //   buyerGroup?.buyerGroupId !== 0
      // ) {
      //   setValue('buyerGroup', buyerGroupOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    buyerGroupOptionsData,
    buyerGroupOptionsIsLoading,
    buyerGroupOptionsError,
    buyerGroupOptionsIsError,
    buyerGroupOptionsIsFetching,
    buyerGroupOptionsIsSuccess,
  ]);

  const [
    triggerGetSalesPerson,
    {
      data: salesPersonOptionsData,
      error: salesPersonOptionsError,
      isError: salesPersonOptionsIsError,
      isSuccess: salesPersonOptionsIsSuccess,
      isLoading: salesPersonOptionsIsLoading,
      isFetching: salesPersonOptionsIsFetching,
    },
  ] = useLazyGetSalesPersonByCompanyLocationBuyerIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (salesPersonOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching salesPersonOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesPersonOptionsData, see console--->:'
      );
      console.log(salesPersonOptionsError);
    }
    if (salesPersonOptionsIsSuccess) {
      console.log('salesPersonOptionsIsSuccess');
      console.log(salesPersonOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { salesPerson } = watchedFields;
      // if (salesPersonOptionsData && salesPerson?.employeeId) {
      //   const exists = salesPersonOptionsData?.some(
      //     (salesPersonRow) =>
      //       salesPersonRow.employeeId === salesPerson.employeeId
      //   );
      //   if (!exists && salesPerson != null && salesPerson.employeeId !== 0) {
      //     setValue('salesPerson', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   salesPersonOptionsData &&
      //   salesPersonOptionsData?.length === 1 &&
      //   salesPersonOptionsData?.[0].employeeId !== salesPerson?.employeeId &&
      //   // salesPerson != null &&
      //   salesPerson?.employeeId !== 0
      // ) {
      //   setValue('salesPerson', salesPersonOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    salesPersonOptionsData,
    salesPersonOptionsIsLoading,
    salesPersonOptionsError,
    salesPersonOptionsIsError,
    salesPersonOptionsIsFetching,
    salesPersonOptionsIsSuccess,
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
    triggerGetSalesOrderInfo,
    {
      data: salesOrderInfoData,
      error: salesOrderInfoError,
      isError: salesOrderInfoIsError,
      isSuccess: salesOrderInfoIsSuccess,
      isLoading: salesOrderInfoIsLoading,
      isFetching: salesOrderInfoIsFetching,
    },
  ] = useLazyGetSalesOrderInfoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (salesOrderInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching salesOrderInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesOrderInfoData, see console--->:'
      );
      console.log(salesOrderInfoError);

      const data: ISalesOrderInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesOrderId: '',
          salesOrderNo: '',
          invoiceNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          paymentModeId: 0,
          paymentModeName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          invoiceDiscount: null,
          totalAmountWithoutInvoiceDiscount: null,
        });
      }
      setSalesOrderGrid([...data]);
      setSalesOrderGridPrev([]);

      setIsSalesOrderGridLoading(false);
    }
    if (
      salesOrderInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !salesOrderInfoIsLoading &&
      !salesOrderInfoIsError &&
      !salesOrderInfoIsFetching
    ) {
      console.log('salesOrderInfoIsSuccess');
      console.log(salesOrderInfoData);

      const data: ISalesOrderInfo[] = JSON.parse(
        JSON.stringify([...(salesOrderInfoData || [])])
      );
      const data2: ISalesOrderInfo[] = JSON.parse(
        JSON.stringify([...(salesOrderInfoData || [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesOrderId: '',
          salesOrderNo: '',
          invoiceNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          paymentModeId: 0,
          paymentModeName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          invoiceDiscount: null,
          totalAmountWithoutInvoiceDiscount: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setSalesOrderGrid([...dataCopy]);
      setSalesOrderGridPrev([...dataCopy2]);
      setIsSalesOrderGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsSalesOrderGridLoading(true);
    }
  }, [
    salesOrderInfoData,
    salesOrderInfoIsLoading,
    salesOrderInfoError,
    salesOrderInfoIsError,
    salesOrderInfoIsFetching,
    salesOrderInfoIsSuccess,
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
    processSaveSalesOrder,
    {
      isLoading: processSaveSalesOrderIsLoading,
      isError: processSaveSalesOrderIsError,
      error: processSaveSalesOrderError,
      isSuccess: processSaveSalesOrderIsSuccess,
      data: processSaveSalesOrderData,
    },
  ] = useProcessSaveSalesOrderMutation();

  useEffect(() => {
    // if (!processSaveSalesOrderIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveSalesOrderIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Sales Orders have been saved successfully!`,
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
          salesOrderGridInitializer.resetRowSelection();
          console.log(processSaveSalesOrderData);
          setDeletedSalesDetailRows([]);
          setDeletedSalesOrderDetailRows([]);
          setSalesOrderDetailRows([]);
        }
      });
    } else if (processSaveSalesOrderIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving SalesOrder data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving SalesOrder data, see console---->'
      );
      console.log(processSaveSalesOrderError);
      salesOrderGridInitializer.resetRowSelection();
    }
  }, [
    processSaveSalesOrderIsLoading,
    processSaveSalesOrderIsError,
    processSaveSalesOrderData,
    processSaveSalesOrderError,
    processSaveSalesOrderIsSuccess,
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

  // Trigger GetBuyerGroup RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyerGroup({
      companyId: userInfo?.companyId,
      buyerId: buyer?.buyerId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyer,
    watchedFields.salesPerson,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyerGroup,
  ]);

  // Trigger GetBuyer RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyer({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.salesPerson,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  // Trigger GetSalesPerson RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSalesPerson({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      buyerId: buyer?.buyerId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

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

  // Trigger GetProductGroup RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      salesPerson,
      buyerGroup,
      dateFrom,
      dateTo,
      productGroup,
      brand,
      product,
    } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetProductGroup({
      companyId: userInfo?.companyId,
      productId: product?.productId || null,
      brandId: brand?.brandId || null,
    });
  }, [
    watchedFields.product,
    watchedFields.brand,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetProductGroup,
  ]);

  // Trigger GetBrand RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      salesPerson,
      buyerGroup,
      dateFrom,
      dateTo,
      productGroup,
      brand,
      product,
    } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBrand({
      companyId: userInfo?.companyId,
      productGroupId: productGroup?.productGroupId || null,
      productId: product?.productId || null,
    });
  }, [
    watchedFields.productGroup,
    watchedFields.product,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetBrand,
  ]);

  // Trigger GetBrand RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      salesPerson,
      buyerGroup,
      dateFrom,
      dateTo,
      productGroup,
      brand,
      product,
    } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetProduct({
      companyId: userInfo?.companyId,
      productGroupId: productGroup?.productGroupId || null,
      brandId: brand?.brandId || null,
    });
  }, [
    watchedFields.productGroup,
    watchedFields.brand,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetProduct,
  ]);

  // Trigger GetSalesOrderInfo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      salesPerson,
      buyerGroup,
      dateFrom,
      dateTo,
      taxOver,
      taxUnder,
      amountOver,
      amountUnder,
      location,
      salesOrder,
      paymentMode,
      productGroup,
      brand,
      product,
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
      const getParams: IGetSalesOrderInfoFilterDto = {
        paymentModeId: paymentMode?.paymentModeId || null,
        buyerId: buyer?.buyerId || null,
        buyerGroupId: buyerGroup?.buyerGroupId || null,
        fromDate: dayjs(dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        toDate: dayjs(dateTo).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        taxOver: taxOver || null,
        taxUnder: taxUnder || null,
        amountOver: amountOver || null,
        amountUnder: amountUnder || null,
        employeeId: salesPerson?.employeeId || null,
        locationId: location?.locationId || 0,
        salesOrderId: salesOrder?.salesOrderId || null,
        productGroupId: productGroup?.productGroupId || null,
        brandId: brand?.brandId || null,
        productId: product?.productId || null,
      };

      triggerGetSalesOrderInfo({
        filter: getParams,
      });
    } else {
      const data: ISalesOrderInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          salesOrderId: '',
          salesOrderNo: '',
          invoiceNo: '',
          dateOfEntry: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          paymentModeId: 0,
          paymentModeName: '',
          totalAmount: null,
          vat: null,
          tax: null,
          remarks: '',
          invoiceDiscount: null,
          totalAmountWithoutInvoiceDiscount: null,
        });
      }
      setSalesOrderGrid([...data]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.salesPerson,
    watchedFields.amountOver,
    watchedFields.amountUnder,
    watchedFields.taxOver,
    watchedFields.taxUnder,
    watchedFields.location,
    watchedFields.salesOrder, // eita baaki, autocomplete boshano
    watchedFields.paymentMode,
    watchedFields.productGroup,
    watchedFields.brand,
    watchedFields.product,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const handleEditDetail = (index: number, row: ISalesOrderInfo) => {
    const objTemp = {
      salesOrderInfoGridIndex: index,
      salesOrderInfoGridRow: row,
      salesOrderId: row.salesOrderId,
      editModalOpen: true,
    };

    setDetailEditModalInfo(objTemp);
  };

  const handleDetailEditModalClose = () => {
    const objTemp = {
      salesOrderInfoGridIndex: null,
      salesOrderInfoGridRow: null,
      salesOrderId: null,
      editModalOpen: false,
    };

    setDetailEditModalInfo(objTemp);
  };

  const saveSalesOrder = () => {
    console.log(salesOrderGrid); // eita abar purata ashbena, shudhu selected gula ashbe
    console.log(deletedSalesOrderDetailRows);

    console.log(salesOrderDetailRows);
    console.log(deletedSalesDetailRows);

    console.log(deletedSalesDetailRows);

    /// ----Selected SalesOrders--------

    const selectedRows = salesOrderGridInitializer.getSelectedRowModel().rows;
    const selectedSalesOrderRows = selectedRows.map((row) => row.original);
    // console.log(selectedData);

    if (selectedSalesOrderRows.length === 0) {
      toast.warning('Select rows to save!');
      return;
    }

    /// /////////--------SalesOrder Save ---------
    const updateSalesOrder: IUpdateSalesOrderCommand[] = [];

    const createSalesOrderDetail: ICreateSalesOrderDetailCommand[] = [];
    const updateSalesOrderDetail: IUpdateSalesOrderDetailCommand[] = [];
    const deleteSalesOrderDetail: IDeleteSalesOrderDetailCommand[] = [];

    const createSalesDetail: ICreateSalesDetailCommand[] = [];
    const deleteSalesDetail: IDeleteSalesDetailCommand[] = [];
    const createSalesOrderDetailTax: ICreateSalesOrderDetailTaxCommand[] = [];
    const updateSalesOrderDetailTax: IUpdateSalesOrderDetailTaxCommand[] = [];
    const deleteSalesOrderDetailTax: IDeleteSalesOrderDetailTaxCommand[] = [];

    const processSalesOrderDetail = (salesOrderId: string) => {
      /// /////////--------SalesOrderDetail Save(Also salesDetail save cz nested) ---------

      const selectedSODRows = salesOrderDetailRows.filter(
        (w) => w.salesOrderId === salesOrderId
      );

      // alert('selectedSODRows');
      // console.log('selectedSODRows');
      // console.log(selectedSODRows);
      // console.log(salesOrderDetailRows);

      const salesOrderDetailRowsSelected: ISalesOrderDetailInfo[] =
        Array.isArray(selectedSODRows) ? selectedSODRows : [];

      for (let i = 0; i < salesOrderDetailRowsSelected.length; i++) {
        // update salesOrderDetail
        if (salesOrderDetailRowsSelected[i].salesOrderDetailId) {
          const obj: IUpdateSalesOrderDetailCommand = {
            salesOrderDetailId:
              salesOrderDetailRowsSelected[i].salesOrderDetailId,
            salesOrderId: salesOrderDetailRowsSelected[i].salesOrderId,
            productId: salesOrderDetailRowsSelected[i].productId,
            quantity: salesOrderDetailRowsSelected[i].quantity,
            price: salesOrderDetailRowsSelected[i].price,
            unitTypeId: salesOrderDetailRowsSelected[i].unitTypeId,
            discount: salesOrderDetailRowsSelected[i].discount || 0,
          };

          // create salesDetail-Bairerta(serial)
          for (
            let j = 0;
            j < salesOrderDetailRowsSelected[i].salesDetailInfoDto.length;
            j++
          ) {
            if (
              !salesOrderDetailRowsSelected[i].salesDetailInfoDto[j]
                .salesDetailId
            ) {
              const tempObj: ICreateSalesDetailCommand = {
                salesOrderDetailId:
                  salesOrderDetailRowsSelected[i].salesOrderDetailId,
                salesOrderId:
                  salesOrderDetailRowsSelected[i].salesDetailInfoDto[j]
                    .salesOrderId || '',
                serialNo:
                  salesOrderDetailRowsSelected[i].salesDetailInfoDto[j]
                    .serialNo,
              };
              createSalesDetail.push(tempObj);
            }
          }

          // create salesOrderDetailTax-Process Model moddhei jeita open, Bairerta
          if (!salesOrderDetailRowsSelected[i].taxRowId) {
            const tempObj: ICreateSalesOrderDetailTaxCommand = {
              salesOrderDetailId:
                salesOrderDetailRowsSelected[i].salesOrderDetailId,
              taxId: 1,
              taxAmount: salesOrderDetailRowsSelected[i].taxAmount || 0,
            };
            createSalesOrderDetailTax.push(tempObj);
          }

          if (!salesOrderDetailRowsSelected[i].vatRowId) {
            const tempObj: ICreateSalesOrderDetailTaxCommand = {
              salesOrderDetailId:
                salesOrderDetailRowsSelected[i].salesOrderDetailId,
              taxId: 2,
              taxAmount: salesOrderDetailRowsSelected[i].vatAmount || 0,
            };
            createSalesOrderDetailTax.push(tempObj);
          }
          // create salesOrderDetailTax-Process Model moddhei jeita open, Bairerta---ENDS---

          // update salesOrderDetailTax-Process Model moddhei jeita open, Bairerta
          if (salesOrderDetailRowsSelected[i].taxRowId) {
            const tempObj: IUpdateSalesOrderDetailTaxCommand = {
              salesOrderDetailTaxId: salesOrderDetailRowsSelected[i].taxRowId,
              taxAmount: salesOrderDetailRowsSelected[i].taxAmount || 0,
            };
            updateSalesOrderDetailTax.push(tempObj);
          }

          if (salesOrderDetailRowsSelected[i].vatRowId) {
            const tempObj: IUpdateSalesOrderDetailTaxCommand = {
              salesOrderDetailTaxId: salesOrderDetailRowsSelected[i].vatRowId,
              taxAmount: salesOrderDetailRowsSelected[i].vatAmount || 0,
            };
            updateSalesOrderDetailTax.push(tempObj);
          }
          // update salesOrderDetailTax-Process Model moddhei jeita open, Bairerta----ENDS---

          updateSalesOrderDetail.push(obj);
        }

        // create SalesOrderDetail
        if (!salesOrderDetailRowsSelected[i].salesOrderDetailId) {
          const obj: ICreateSalesOrderDetailCommand = {
            salesOrderId: salesOrderDetailRowsSelected[i].salesOrderId,
            productId: salesOrderDetailRowsSelected[i].productId,
            quantity: salesOrderDetailRowsSelected[i].quantity,
            price: salesOrderDetailRowsSelected[i].price,
            createSalesDetailCommand: [],
            createSalesOrderDetail_TaxCommand: [],
            unitTypeId: salesOrderDetailRowsSelected[i].unitTypeId,
            companyId: userInfo?.companyId,
            locationId: userInfo?.locationId,
            discount: salesOrderDetailRowsSelected[i].discount || 0,
          };

          // create salesDetail(serial) vitorer ta, salesOrderDetailCreate er moddhe
          for (
            let j = 0;
            j < salesOrderDetailRowsSelected[i].salesDetailInfoDto.length;
            j++
          ) {
            const tempObj: ICreateSalesDetailCommand = {
              salesOrderDetailId: null,
              salesOrderId:
                salesOrderDetailRowsSelected[i].salesDetailInfoDto[j]
                  .salesOrderId || '',
              serialNo:
                salesOrderDetailRowsSelected[i].salesDetailInfoDto[j].serialNo,
            };
            obj.createSalesDetailCommand?.push(tempObj);
          }

          // create salesOrderDetailTax-Process Model er salesOrderDetail er moddhe jeita, peter vetorerta
          if (
            !salesOrderDetailRowsSelected[i].taxRowId &&
            !salesOrderDetailRowsSelected[i].salesOrderDetailId
          ) {
            const tempObj: ICreateSalesOrderDetailTaxCommand = {
              salesOrderDetailId: null,
              taxId: 1,
              taxAmount: salesOrderDetailRowsSelected[i].taxAmount || 0,
            };
            obj.createSalesOrderDetail_TaxCommand?.push(tempObj);
          }

          if (
            !salesOrderDetailRowsSelected[i].vatRowId &&
            !salesOrderDetailRowsSelected[i].salesOrderDetailId
          ) {
            const tempObj: ICreateSalesOrderDetailTaxCommand = {
              salesOrderDetailId: null,
              taxId: 2,
              taxAmount: salesOrderDetailRowsSelected[i].vatAmount || 0,
            };
            obj.createSalesOrderDetail_TaxCommand?.push(tempObj);
          }
          // create salesOrderDetailTax-Process Model er salesOrderDetail er moddhe jeita, peter vetorerta---ENDS---

          createSalesOrderDetail.push(obj);
        }
      }

      // delete salesOrderDetail, selected ones
      if (deletedSalesOrderDetailRows.length) {
        const deletedSalesOrderDetailRowsSelected: IDeleteSalesOrderDetailCommand[] =
          deletedSalesOrderDetailRows.filter(
            (w) => w.salesOrderId === salesOrderId
          );

        for (let i = 0; i < deletedSalesOrderDetailRowsSelected.length; i++) {
          const obj: IDeleteSalesOrderDetailCommand = {
            salesOrderDetailId:
              deletedSalesOrderDetailRowsSelected[i].salesOrderDetailId,
          };
          deleteSalesOrderDetail.push(obj);
        }
      }
      // delete salesDetail, selected ones
      if (deletedSalesDetailRows.length) {
        const deletedSalesDetailRowsSelected: IDeleteSalesDetailCommand[] =
          deletedSalesDetailRows.filter((w) => w.salesOrderId === salesOrderId);

        for (let i = 0; i < deletedSalesDetailRowsSelected.length; i++) {
          const obj: IDeleteSalesDetailCommand = {
            salesDetailId: deletedSalesDetailRowsSelected[i].salesDetailId,
          };
          deleteSalesDetail.push(obj);
        }
      }

      // delete salesOrderDetailTax, selected ones
      if (deletedSalesOrderDetailTaxRows.length) {
        const deletedSalesOrderDetailTaxRowsSelected: IDeleteSalesOrderDetailTaxCommand[] =
          deletedSalesOrderDetailTaxRows.filter(
            (w) => w.salesOrderId === salesOrderId
          );

        for (
          let i = 0;
          i < deletedSalesOrderDetailTaxRowsSelected.length;
          i++
        ) {
          const obj: IDeleteSalesOrderDetailTaxCommand = {
            salesOrderDetailTaxId:
              deletedSalesOrderDetailTaxRowsSelected[i].salesOrderDetailTaxId,
          };
          deleteSalesOrderDetailTax.push(obj);
        }
      }
    };

    // Update salesOrder

    for (let i = 0; i < selectedSalesOrderRows.length; i++) {
      const prevRecordSalesOrderRow = salesOrderGridPrev.find(
        (w) => w.salesOrderId === selectedSalesOrderRows[i].salesOrderId
      );

      if (prevRecordSalesOrderRow !== selectedSalesOrderRows[i]) {
        const tempUpdateSO: IUpdateSalesOrderCommand = {
          salesOrderId: selectedSalesOrderRows[i].salesOrderId,
          totalAmount: selectedSalesOrderRows[i].totalAmount,
          buyerId: selectedSalesOrderRows[i].buyerId,
          paymentModeId: selectedSalesOrderRows[i].paymentModeId,
          invoiceDiscount: selectedSalesOrderRows[i].invoiceDiscount,
        };
        updateSalesOrder.push(tempUpdateSO);
      }
      processSalesOrderDetail(selectedSalesOrderRows[i].salesOrderId);
    }

    // --------------- The sending Obj to api----------------
    const sendingObj: ISalesOrderProcessCommandsVM = {
      updateSalesOrderCommand: [...updateSalesOrder],
      deleteSalesOrderCommand: [],
      createSalesOrderDetailCommand: [...createSalesOrderDetail],
      updateSalesOrderDetailCommand: [...updateSalesOrderDetail],
      deleteSalesOrderDetailCommand: [...deleteSalesOrderDetail],
      createSalesOrderAdditionalCostCommand: [],

      updateSalesOrderAdditionalCostCommand: [],

      deleteSalesOrderAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      salesOrderId: null,
      createSalesDetailCommand: [...createSalesDetail],
      deleteSalesDetailCommand: [...deleteSalesDetail],
      createSalesOrderDetail_TaxCommand: [...createSalesOrderDetailTax],
      updateSalesOrderDetail_TaxCommand: [...updateSalesOrderDetailTax],
      deleteSalesOrderDetail_TaxCommand: [],
      // deleteSalesOrderDetailTaxCommand: [...deleteSalesOrderDetailTax], // eita lagbena, cz individually tax/vat delete korar option nei, salesOrderDetail delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
    };

    console.log('------The ultimate Object to send------');
    console.log(sendingObj);

    if (
      !sendingObj.updateSalesOrderCommand?.length &&
      !sendingObj.createSalesOrderDetailCommand?.length &&
      !sendingObj.updateSalesOrderDetailCommand?.length &&
      !sendingObj.deleteSalesOrderDetailCommand?.length &&
      !sendingObj.createSalesDetailCommand?.length &&
      !sendingObj.deleteSalesDetailCommand?.length
    ) {
      toast.info('No changes to save');
    } else {
      // API CALL HOBE
      processSaveSalesOrder(sendingObj);
    }
  };

  const deleteSalesOrder = () => {
    const selectedRows = salesOrderGridInitializer.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log(selectedData);

    const deletedSalesOrders: IDeleteSalesOrderCommand[] = [];
    for (let i = 0; i < selectedData.length; i++) {
      const obj: IDeleteSalesOrderCommand = {
        salesOrderId: selectedData[i].salesOrderId,
      };
      deletedSalesOrders.push(obj);
    }

    const sendingObj: ISalesOrderProcessCommandsVM = {
      updateSalesOrderCommand: [],
      deleteSalesOrderCommand: deletedSalesOrders,
      createSalesOrderDetailCommand: [],
      updateSalesOrderDetailCommand: [],
      deleteSalesOrderDetailCommand: [],
      createSalesOrderAdditionalCostCommand: [],

      updateSalesOrderAdditionalCostCommand: [],

      deleteSalesOrderAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      salesOrderId: null,
      createSalesDetailCommand: [],
      deleteSalesDetailCommand: [],
    };

    if (deletedSalesOrders.length > 0) {
      processSaveSalesOrder(sendingObj);
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

  const salesOrderGridColumns = useMemo<MRT_ColumnDef<ISalesOrderInfo>[]>(
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
              className={row.original.salesOrderId ? 'visible' : 'invisible'}
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
        header: 'Supplier',
        Cell: ({ renderedCellValue, row }) => {
          const currentBuyer = {
            buyerId: salesOrderGrid[row.index].buyerId || null,
            buyerName: salesOrderGrid[row.index].buyerName || '',
          };
          const isDisabled = !salesOrderGrid[row.index].salesOrderId;
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
                      salesOrderGrid[row.index].buyerId =
                        selectedOption?.buyerId || null;
                      salesOrderGrid[row.index].buyerName =
                        selectedOption?.buyerName || '';
                      // -----------------setting groupName&Id------------
                      salesOrderGrid[row.index].buyerGroupName =
                        selectedOption?.buyerGroupName || '';
                      salesOrderGrid[row.index].buyerGroupId =
                        selectedOption?.buyerGroupId || '';

                      setSalesOrderGrid([...salesOrderGrid]);

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
        accessorFn: (row) => row.buyerGroupName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerGroupName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Com.Invoice No',
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
        accessorFn: (row) => row.invoiceNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.invoiceNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'invoiceNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Date',
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
        header: 'Mode',
        Cell: ({ renderedCellValue, row }) => {
          const currentPaymentMode = {
            paymentModeId: salesOrderGrid[row.index].paymentModeId || null,
            paymentModeName: salesOrderGrid[row.index].paymentModeName || '',
          };
          const isDisabled = !salesOrderGrid[row.index].salesOrderId;
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
                  } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
                  value={currentPaymentMode}
                  onChange={(event, selectedOption: any) => {
                    salesOrderGrid[row.index].paymentModeId =
                      selectedOption?.paymentModeId || null;
                    salesOrderGrid[row.index].paymentModeName =
                      selectedOption?.paymentModeName || '';
                    setSalesOrderGrid([...salesOrderGrid]);
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
        accessorFn: (row) => row.vat ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.vat, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'vat',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Supplier Group',
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
        accessorFn: (row) => row.tax ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.tax, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'tax',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'VAT',
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
        accessorFn: (row) => row.invoiceDiscount ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.invoiceDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'invoiceDiscount',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'TAX',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: 13 },
                  disableUnderline: true,
                  // readOnly: true,
                }}
                //   onBlur={(e) => {}}
                onBlur={(e) => {
                  const discountTemp = Number.isNaN(
                    parseInt(e.target.value, 10)
                  )
                    ? null
                    : Math.abs(parseInt(e.target.value, 10));
                  salesOrderGrid[row.index].invoiceDiscount = discountTemp;
                  setSalesOrderGrid([...salesOrderGrid]);
                }}
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
      //             // const totalAmountTemp = Number.isNaN(
      //             //   parseFloat(salesOrderGrid[row.index]?.totalAmount || 0)
      //             // )
      //             //   ? null
      //             //   : Math.abs(parseFloat(e.target.value));
      //             salesOrderGrid[row.index].invoiceDiscount = discountTemp || 0;
      //             salesOrderGrid[row.index].totalAmount =
      //               (salesOrderGrid[row.index]
      //                 .totalAmountWithoutInvoiceDiscount || 0) -
      //               (discountTemp || 0);
      //             // (salesOrderGrid[row.index]?.totalAmount || 0) -
      //             // (discountTemp || 0);

      //             setSalesOrderGrid([...salesOrderGrid]);
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
  }, [sortingSalesOrderGrid]);

  // ---------- material table virtualization---------

  const salesOrderGridInitializer: MRT_TableInstance<ISalesOrderInfo> =
    useMaterialReactTable({
      columns: salesOrderGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: salesOrderGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading:
          isSalesOrderGridLoading ||
          salesOrderInfoIsLoading ||
          salesOrderInfoIsFetching,
        sorting: sortingSalesOrderGrid,
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
        //     'You cannot select/calculate commission for this buyer, as this is already processed before'
        //   );
        // }
        return !!row.original.salesOrderId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
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
                //     buyerSalesRptGridState,
                //     salesOrderGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(salesOrderGrid, salesOrderGridColumns);
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
      onSortingChange: setSortingSalesOrderGrid,
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
                  : 'Payment Manipulation'}
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
                            buyerGroupOptionsData?.map((buyerGroupOption) => [
                              buyerGroupOption.buyerGroupName,
                              buyerGroupOption,
                            ])
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
                        option.buyerGroupId === selectedValue?.buyerGroupId
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

                <Controller
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
                          label="Purchase Person"
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
                {/* ----------------------New filters adding ---------------STARTs--------------------------------- */}

                <Controller
                  name="productGroup"
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
                        { productGroupId: 0, productGroupName: 'All' },
                        ...(Array.from(
                          new Map(
                            productGroupOptionsData?.map(
                              (productGroupOption) => [
                                productGroupOption.productGroupName,
                                productGroupOption,
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
                        option ? option.productGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.productGroupName ===
                          selectedValue?.productGroupName &&
                        option.productGroupId === selectedValue?.productGroupId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product Group"
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
                            //     {productGroupOptionsAutoCompLoading ? (
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
                  name="brand"
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
                        { brandId: 0, brandName: 'All' },
                        ...(Array.from(
                          new Map(
                            brandOptionsData?.data?.map((brandOption) => [
                              brandOption.brandName,
                              brandOption,
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
                        option ? option.brandName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.brandName === selectedValue?.brandName &&
                        option.brandId === selectedValue?.brandId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Brand"
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
                            //     {brandOptionsAutoCompLoading ? (
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
                  name="product"
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
                        { productId: 0, productName: 'All' },
                        ...(Array.from(
                          new Map(
                            productOptionsData?.map((productOption) => [
                              productOption.productName,
                              productOption,
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
                        option ? option.productName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.productName === selectedValue?.productName &&
                        option.productId === selectedValue?.productId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product"
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
                            //     {productOptionsAutoCompLoading ? (
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

                {/* ----------------------New filters adding ---------------ENDs--------------------------------- */}

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
                        InputProps={{ style: { fontSize: 13 } }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
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
                  <MaterialReactTable table={salesOrderGridInitializer} />
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
                    disabled={processSaveSalesOrderIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveSalesOrderIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg active:bg-blue-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveSalesOrderIsLoading) saveSalesOrder();
                    }}
                  >
                    {processSaveSalesOrderIsLoading ? (
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
                    disabled={processSaveSalesOrderIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveSalesOrderIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-110 focus:bg-red-700 focus:shadow-lg active:bg-red-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveSalesOrderIsLoading) deleteSalesOrder();
                    }}
                  >
                    {processSaveSalesOrderIsLoading ? (
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

          <SalesOrderDetail
            salesOrderGrid={salesOrderGrid}
            setSalesOrderGrid={setSalesOrderGrid}
            salesOrderDetailRows={salesOrderDetailRows}
            setSalesOrderDetailRows={setSalesOrderDetailRows}
            deletedSalesOrderDetailRows={deletedSalesOrderDetailRows}
            setDeletedSalesOrderDetailRows={setDeletedSalesOrderDetailRows}
            deletedSalesDetailRows={deletedSalesDetailRows}
            setDeletedSalesDetailRows={setDeletedSalesDetailRows}
            deletedSalesOrderDetailTaxRows={deletedSalesOrderDetailTaxRows}
            setDeletedSalesOrderDetailTaxRows={
              setDeletedSalesOrderDetailTaxRows
            }
            detailEditModalInfo={detailEditModalInfo}
            setDetailEditModalInfo={setDetailEditModalInfo}
            handleDetailEditModalClose={handleDetailEditModalClose}
          />
        </Box>
      </Modal>
    </div>

    // return wrapper div--/--
  );
};

export default PaymentEditGh;
