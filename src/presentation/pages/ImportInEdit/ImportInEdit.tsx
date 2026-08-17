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
  // useLazyGetSupplierGroupByCompanySupplierSalesPersonDepartmentIdQuery,
} from '../../../infrastructure/api/SupplierApiSlice';
// import { ISupplierGroup } from '../../../domain/interfaces/SupplierGroupInterface';
import { ISupplier } from '../../../domain/interfaces/SupplierInterface';
import { ISalesPersonComboBox } from '../../../domain/interfaces/SalesPersonInterface';
import { IDepartment } from '../../../domain/interfaces/DepartmentInterface';
import {
  ICreateImportInDetailSerialCommand,
  ICreateImportInDetailCommand,
  // ICreateImportInDetailTaxCommand,
  IDeleteImportInDetailSerialCommand,
  IDeleteImportInCommand,
  IDeleteImportInDetailCommand,
  // IDeleteImportInDetailTaxCommand,
  IGetImportInInfoFilterDto,
  IImportIn,
  IImportInDetailInfo,
  IImportInInfo,
  IImportInProcessCommandsVM,
  IUpdateImportInCommand,
  IUpdateImportInDetailCommand,
  IGetImportInLCNoOptionsFilterDto,
  // IUpdateImportInDetailTaxCommand,
} from '../../../domain/interfaces/ImportInInterface';
// import { useLazyGetSalesPersonByCompanyLocationSupplierIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';
import { useLazyGetPaymentModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';
import {
  useLazyGetImportInInfoQuery,
  useLazyGetImportInLCNoQuery,
  useProcessSaveImportInMutation,
} from '../../../infrastructure/api/ImportInApiSlice';
import ImportInDetail from './ImportInDetail/ImportInDetail';
import {
  useLazyGetBrandByCompanyIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductGroupByCompanyIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';
import { useLazyGetBanksComboOptionsQuery } from '../../../infrastructure/api/GetBanksForChequeBookApiSlice';

type Props = {};

const ImportInEdit = ({
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
  //     supplier: null,
  //     salesPerson: null,
  //     supplierGroup: null,
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

  //   const [selectedSupplier, setSelectedSupplier] = useState();
  //   const [selectedSupplierGroup, setSelectedSupplierGroup] = useState();
  //   const [selectedDepartment, setSelectedDepartment] = useState();
  //   const [selectedSalesPerson, setSelectedSalesPerson] = useState();
  //   const [dateFrom, setDateFrom] = useState();
  //   const [dateTo, setDateTo] = useState();

  const [importInGrid, setImportInGrid] = useState<IImportInInfo[]>([]);
  const [importInGridPrev, setImportInGridPrev] = useState<IImportInInfo[]>([]);
  // const [deletedImportInRows, setDeletedImportInRows] = useState<
  //   IDeleteImportInCommand[]
  // >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [importInDetailRows, setImportInDetailRows] = useState<
    IImportInDetailInfo[]
  >([]);
  const [deletedImportInDetailRows, setDeletedImportInDetailRows] = useState<
    IDeleteImportInDetailCommand[]
  >([]);

  const [deletedImportInDetailSerialRows, setDeletedImportInDetailSerialRows] =
    useState<IDeleteImportInDetailSerialCommand[]>([]);

  // const [deletedImportInDetailTaxRows, setDeletedImportInDetailTaxRows] =
  //   useState<IDeleteImportInDetailTaxCommand[]>([]);

  // type FormValues = {
  //   supplierGroup: ISupplierGroup | null;
  //   supplier: ISupplier | null;
  //   salesPerson: ISalesPersonComboBox | null;
  //   department: IDepartment | null;
  //   dateFrom: string | null;
  //   dateTo: string | null;
  // };

  //   grid virtualization states
  const [isImportInGridLoading, setIsImportInGridLoading] = useState(true);
  const [sortingImportInGrid, setSortingImportInGrid] =
    useState<MRT_SortingState>([]);

  const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

  const [deletedSerials, setDeletedSerials] = useState<
    IDeleteImportInDetailSerialCommand[]
  >([]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const taxOverTemp = useWatch({ control, name: 'taxOver' });
  const taxUnderTemp = useWatch({ control, name: 'taxUnder' });
  const amountOverTemp = useWatch({ control, name: 'amountOver' });
  const amountUnderTemp = useWatch({ control, name: 'amountUnder' });
  const profitabilityTemp = useWatch({ control, name: 'profitability' });

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
    triggerGetBank,
    {
      data: bankOptionsData,
      error: bankOptionsError,
      isError: bankOptionsIsError,
      isSuccess: bankOptionsIsSuccess,
      isLoading: bankOptionsIsLoading,
      isFetching: bankOptionsIsFetching,
    },
  ] = useLazyGetBanksComboOptionsQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (bankOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching bankOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching bankOptionsData, see console--->:'
      );
      console.log(bankOptionsError);
    }
    if (bankOptionsIsSuccess) {
      console.log('bankOptionsIsSuccess');
      console.log(bankOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { bank } = watchedFields;
      // if (bankOptionsData && bank?.bankId) {
      //   const exists = bankOptionsData?.some(
      //     (bankRow) =>
      //       bankRow.bankId === bank.bankId
      //   );
      //   if (!exists && bank != null && bank.bankId !== 0) {
      //     setValue('bank', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   bankOptionsData &&
      //   bankOptionsData.length === 1 &&
      //   bankOptionsData?.[0].bankId !== bank?.bankId &&
      //   // bank != null &&
      //   bank?.bankId !== 0
      // ) {
      //   setValue('bank', bankOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    bankOptionsData,
    bankOptionsIsLoading,
    bankOptionsError,
    bankOptionsIsError,
    bankOptionsIsFetching,
    bankOptionsIsSuccess,
  ]);

  const [
    triggerLCNo,
    {
      data: lcNoOptionsData,
      error: lcNoOptionsError,
      isError: lcNoOptionsIsError,
      isSuccess: lcNoOptionsIsSuccess,
      isLoading: lcNoOptionsIsLoading,
      isFetching: lcNoOptionsIsFetching,
    },
  ] = useLazyGetImportInLCNoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (lcNoOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching lcNoOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching lcNoOptionsData, see console--->:'
      );
      console.log(lcNoOptionsError);
    }
    if (lcNoOptionsIsSuccess) {
      console.log('lcNoOptionsIsSuccess');
      console.log(lcNoOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { lcNo } = watchedFields;
      // if (lcNoOptionsData && lcNo?.lcNoId) {
      //   const exists = lcNoOptionsData?.some(
      //     (lcNoRow) =>
      //       lcNoRow.lcNoId === lcNo.lcNoId
      //   );
      //   if (!exists && lcNo != null && lcNo.lcNoId !== 0) {
      //     setValue('lcNo', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   lcNoOptionsData &&
      //   lcNoOptionsData.length === 1 &&
      //   lcNoOptionsData?.[0].lcNo !== lcNo?.lcNo &&
      //   // lcNo != null &&
      //   lcNo?.lcNo !== 0
      // ) {
      //   setValue('lcNo', lcNoOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    lcNoOptionsData,
    lcNoOptionsIsLoading,
    lcNoOptionsError,
    lcNoOptionsIsError,
    lcNoOptionsIsFetching,
    lcNoOptionsIsSuccess,
  ]);

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
  // ] = useLazyGetSalesPersonByCompanyLocationSupplierIdQuery(); // RTK Query lazy fetch

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

  const [
    triggerGetImportInInfo,
    {
      data: importInInfoData,
      error: importInInfoError,
      isError: importInInfoIsError,
      isSuccess: importInInfoIsSuccess,
      isLoading: importInInfoIsLoading,
      isFetching: importInInfoIsFetching,
    },
  ] = useLazyGetImportInInfoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (importInInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching importInInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching importInInfoData, see console--->:'
      );
      console.log(importInInfoError);

      const data: IImportInInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInNo: '',
          lcNo: '',
          date: '',
          supplierId: 0,
          supplierName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          totalAmount: null,
          remarks: '',
        });
      }
      setImportInGrid([...data]);
      setImportInGridPrev([]);

      setIsImportInGridLoading(false);
    }
    if (
      importInInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !importInInfoIsLoading &&
      !importInInfoIsError &&
      !importInInfoIsFetching
    ) {
      console.log('importInInfoIsSuccess');
      console.log(importInInfoData);

      const data: IImportInInfo[] = JSON.parse(
        JSON.stringify([...(importInInfoData || [])])
      );
      const data2: IImportInInfo[] = JSON.parse(
        JSON.stringify([...(importInInfoData || [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInNo: '',
          lcNo: '',
          date: '',
          supplierId: 0,
          supplierName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          // referenceNo: '',
          // paymentTermsId: null,
          // paymentTermsName: '',
          // supplierGroupId: 0,
          // supplierGroupName: '',
          // paymentModeId: 0,
          // paymentModeName: '',
          totalAmount: null,
          // totalVat: null,
          // totalTax: null,
          remarks: '',
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setImportInGrid([...dataCopy]);
      setImportInGridPrev([...dataCopy2]);
      setIsImportInGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsImportInGridLoading(true);
    }
  }, [
    importInInfoData,
    importInInfoIsLoading,
    importInInfoError,
    importInInfoIsError,
    importInInfoIsFetching,
    importInInfoIsSuccess,
  ]);

  // const {
  //   data: locationOptions,
  //   isLoading: locationOptionsLoading,
  //   error: locationOptionsError,
  //   isSuccess: locationOptionsIsSuccess,
  //   isError: locationOptionsIsError,
  //   isFetching: locationOptionsIsFetching,
  //   refetch: locationOptionsRefetch,
  // } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

  // useEffect(() => {
  //   if (locationOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
  //     );
  //     console.log(locationOptionsError);
  //   }
  //   if (locationOptionsIsSuccess) {
  //     console.log('locationOptions');
  //     console.log(locationOptions);
  //   }
  // }, [
  //   locationOptionsLoading,
  //   locationOptionsIsFetching,
  //   locationOptionsError,
  //   locationOptionsIsError,
  //   locationOptions,
  //   locationOptionsIsSuccess,
  // ]);

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
    processSaveImportIn,
    {
      isLoading: processSaveImportInIsLoading,
      isError: processSaveImportInIsError,
      error: processSaveImportInError,
      isSuccess: processSaveImportInIsSuccess,
      data: processSaveImportInData,
    },
  ] = useProcessSaveImportInMutation();

  useEffect(() => {
    // if (!processSaveImportInIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveImportInIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Import In have been saved successfully!`,
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
          importInGridInitializer.resetRowSelection();
          console.log(processSaveImportInData);
          setDeletedImportInDetailSerialRows([]);
          setDeletedImportInDetailRows([]);
          setImportInDetailRows([]);
        }
      });
    } else if (processSaveImportInIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving ImportIn data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving ImportIn data, see console---->'
      );
      console.log(processSaveImportInError);
      importInGridInitializer.resetRowSelection();
    }
  }, [
    processSaveImportInIsLoading,
    processSaveImportInIsError,
    processSaveImportInData,
    processSaveImportInError,
    processSaveImportInIsSuccess,
  ]);

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

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

  // Trigger GetSupplierGroup RTK Query whenever a form field changes
  useEffect(() => {
    const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSupplierGroup({
      companyId: userInfo?.companyId,
      supplierId: supplier?.supplierId || null,
      // salesPersonId: salesPerson?.employeeId || null,
      //   supplierGroupId: supplierGroup?.supplierGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.supplier,
    // watchedFields.salesPerson,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetSupplierGroup,
  ]);

  // Trigger GetSupplier RTK Query whenever a form field changes
  useEffect(() => {
    const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSupplier({
      companyId: userInfo?.companyId,
      supplierGroupId: supplierGroup?.supplierGroupId || null,
      // salesPersonId: salesPerson?.employeeId || null,
      //   supplierGroupId: supplierGroup?.supplierGroupId || null,
      // departmentId: department?.departmentId || null,

      // importInId: importIn?.importInId || null,
    });
    // triggerGetSupplierGroup({
    //   companyId: userInfo?.companyId,
    //   supplierId: supplier?.supplierId || null,
    //   // salesPersonId: salesPerson?.employeeId || null,
    //   //   supplierGroupId: supplierGroup?.supplierGroupId || null,
    //   // departmentId: department?.departmentId || null,

    //   // importInId: importIn?.importInId || null,
    // });
  }, [
    watchedFields.supplierGroup,
    // watchedFields.salesPerson,
    // watchedFields.department,
    userInfo?.companyId,
    triggerGetSupplier,
  ]);

  // Trigger GetBank RTK Query whenever a form field changes
  useEffect(() => {
    const { supplier, supplierGroup, dateFrom, dateTo, bank } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBank({
      companyId: userInfo?.companyId,
      // supplierGroupId: supplierGroup?.supplierGroupId || null,
      // salesPersonId: salesPerson?.employeeId || null,
      //   supplierGroupId: supplierGroup?.supplierGroupId || null,
      // departmentId: department?.departmentId || null,

      // importInId: importIn?.importInId || null,
    });
    // triggerGetSupplierGroup({
    //   companyId: userInfo?.companyId,
    //   supplierId: supplier?.supplierId || null,
    //   // salesPersonId: salesPerson?.employeeId || null,
    //   //   supplierGroupId: supplierGroup?.supplierGroupId || null,
    //   // departmentId: department?.departmentId || null,

    //   // importInId: importIn?.importInId || null,
    // });
  }, [
    // watchedFields.supplierGroup,
    userInfo?.companyId,
    triggerGetBank,
  ]);

  // Trigger GetLCNo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      supplier,
      supplierGroup,
      dateFrom,
      dateTo,
      bank,
      lcNo,
      lcNoLength,
    } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    const getParams: IGetImportInLCNoOptionsFilterDto = {
      companyId: userInfo?.companyId,
      supplierId: supplier?.supplierId || null,
      supplierGroupId: supplierGroup?.supplierGroupId || null,
      fromDate: dayjs(dateFrom)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSS'),
      toDate: dayjs(dateTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      bank: bank?.bankId || null,
      lcNoLength: lcNoLength || null,
      // lcNo: lcNo?.lcNo === 'ALL' ? null : lcNo?.lcNo || null,
    };

    triggerLCNo({
      filter: getParams,
    });

    // Trigger your RTK Query
    // triggerLCNo({
    //   lcNoLength: lcNoLength || null,
    //   dateTo: dateTo || null,
    //   dateFrom: dateFrom || null,
    //   supplierId: supplier?.supplierId || null,
    //   supplierGroup: supplierGroup?.supplierGroupId || null,
    //   bank: bank?.bankId || null,
    //   companyId: userInfo?.companyId,
    // });
    // triggerGetSupplierGroup({
    //   companyId: userInfo?.companyId,
    //   supplierId: supplier?.supplierId || null,
    //   // salesPersonId: salesPerson?.employeeId || null,
    //   //   supplierGroupId: supplierGroup?.supplierGroupId || null,
    //   // departmentId: department?.departmentId || null,

    //   // importInId: importIn?.importInId || null,
    // });
  }, [
    watchedFields.supplier,
    watchedFields.supplierGroup,
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.bank,
    watchedFields.lcNoLength,
    // watchedFields.lcNo,
    userInfo?.companyId,
    watchedFields,
    triggerLCNo,
  ]);

  // Trigger GetSalesPerson RTK Query whenever a form field changes
  // useEffect(() => {
  //   const { supplier, salesPerson, supplierGroup, dateFrom, dateTo } =
  //     watchedFields;

  //   console.log('watchedFields');
  //   console.log(watchedFields);

  //   // Trigger your RTK Query
  //   triggerGetSalesPerson({
  //     companyId: userInfo?.companyId,
  //     supplierGroupId: supplierGroup?.supplierGroupId || null,
  //     supplierId: supplier?.supplierId || null,
  //     // departmentId: department?.departmentId || null,
  //   });
  // }, [
  //   watchedFields.supplierGroup,
  //   watchedFields.supplier,
  //   watchedFields.department,
  //   userInfo?.companyId,
  //   triggerGetSupplier,
  // ]);

  // Trigger GetPaymentModeOptions RTK Query whenever a form field changes
  // useEffect(() => {
  //   const { location, paymentMode } = watchedFields;

  //   console.log('watchedFields');
  //   console.log(watchedFields);

  //   // Trigger your RTK Query
  //   triggerGetPaymentModeOptions({
  //     companyId: userInfo?.companyId,
  //     locationId: location?.locationId || userInfo?.locationId,
  //   });
  // }, [watchedFields.location, userInfo?.companyId]);

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
      // salesPerson,
      // buyerGroup,
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
      // salesPerson,
      // buyerGroup,
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

  // Trigger GetImportInInfo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      supplier,
      supplierGroup,
      dateFrom,
      dateTo,
      amountOver,
      amountUnder,
      bank,
      lcNo,
      lcNoLength,
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
      const getParams: IGetImportInInfoFilterDto = {
        // paymentModeId: paymentMode?.paymentModeId || null,
        supplierId: supplier?.supplierId || null,
        supplierGroupId: supplierGroup?.supplierGroupId || null,
        fromDate: dayjs(dateFrom)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS'),
        toDate: dayjs(dateTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
        // taxOver: taxOver || null,
        // taxUnder: taxUnder || null,
        amountOver: amountOver || null,
        amountUnder: amountUnder || null,
        bank: bank?.bankId || null,
        lcNo: (lcNo?.lcNo === 'ALL' ? null : lcNo?.lcNo) || null,
        lcNoLength: lcNoLength || null,
        // employeeId: salesPerson?.employeeId || null,
        // locationId: location?.locationId || 0,
        // importInId: importIn?.importInId || null,
        productGroupId: productGroup?.productGroupId || null,
        brandId: brand?.brandId || null,
        productId: product?.productId || null,
      };

      triggerGetImportInInfo({
        filter: getParams,
      });
    } else {
      const data: IImportInInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInNo: '',
          lcNo: '',
          date: '',
          supplierId: 0,
          supplierName: '',
          // referenceNo: '',
          // paymentTermsId: null,
          // paymentTermsName: '',
          supplierGroupId: 0,
          supplierGroupName: '',
          // paymentModeId: 0,
          // paymentModeName: '',
          totalAmount: null,
          // totalVat: null,
          // totalTax: null,
          remarks: '',
          // purchaseDiscount: null,
          // totalAmountWithoutPurchaseDiscount: null,
        });
      }
      setImportInGrid([...data]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.supplierGroup,
    watchedFields.supplier,
    watchedFields.amountOver,
    watchedFields.amountUnder,
    watchedFields.lcNo,
    watchedFields.lcNoLength,
    watchedFields.bank,
    // watchedFields.taxOver,
    // watchedFields.taxUnder,
    watchedFields.productGroup,
    watchedFields.brand,
    watchedFields.product,
    triggerGetImportInInfo,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const handleEditDetail = (index: number, row: IImportInInfo) => {
    const objTemp = {
      importInInfoGridIndex: index,
      importInInfoGridRow: row,
      importInId: row.importInId,
      editModalOpen: true,
    };

    setDetailEditModalInfo(objTemp);
  };

  const handleDetailEditModalClose = () => {
    const objTemp = {
      importInInfoGridIndex: null,
      importInInfoGridRow: null,
      importInId: null,
      editModalOpen: false,
    };

    setDetailEditModalInfo(objTemp);
  };

  const getSelectedRowId = () =>
    Object.keys(rowSelection).find((key) => rowSelection[key]) || null;

  const clearUnsavedEditedData = () => {
    setDeletedImportInDetailSerialRows([]);
    setDeletedImportInDetailRows([]);
    setImportInDetailRows([]);
    handleDetailEditModalClose();
  };

  const confirmRowChange = async () => {
    const result = await Swal.fire({
      title: 'Warning',
      text: 'Selecting another row will remove your unsaved edited data, are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    return result.isConfirmed;
  };

  const handleSingleRowSelection = async (
    nextRowId: string | null,
    onConfirmed?: () => void
  ) => {
    const currentRowId = getSelectedRowId();

    // unselect case
    if (!nextRowId) {
      setRowSelection({});
      return;
    }

    // first selection or same row selection
    if (!currentRowId || currentRowId === nextRowId) {
      setRowSelection({ [nextRowId]: true });
      if (onConfirmed) onConfirmed();
      return;
    }

    // different row selected
    const isConfirmed = await confirmRowChange();

    if (!isConfirmed) return;

    clearUnsavedEditedData();
    setRowSelection({ [nextRowId]: true });

    if (onConfirmed) onConfirmed();
  };

  const saveImportIn = () => {
    console.log(importInGrid); // eita abar purata ashbena, shudhu selected gula ashbe
    console.log(deletedImportInDetailRows);

    console.log(importInDetailRows);
    console.log(deletedImportInDetailSerialRows);

    console.log(deletedImportInDetailSerialRows);

    /// ----Selected ImportIns--------

    const selectedRows = importInGridInitializer.getSelectedRowModel().rows;
    const selectedImportInRows = selectedRows.map((row) => row.original);
    // console.log(selectedData);

    if (selectedImportInRows.length === 0) {
      toast.warning('Select rows to save!');
      return;
    }

    /// /////////--------ImportIn Save ---------
    // const updateImportIn: IUpdateImportInCommand[] = [];

    const createImportInDetail: ICreateImportInDetailCommand[] = [];
    const updateImportInDetail: IUpdateImportInDetailCommand[] = [];
    const deleteImportInDetail: IDeleteImportInDetailCommand[] = [];

    const createImportInDetailSerial: ICreateImportInDetailSerialCommand[] = [];
    const deleteImportInDetailSerial: IDeleteImportInDetailSerialCommand[] = [];
    // const createImportInDetailTax: ICreateImportInDetailTaxCommand[] = [];
    // const updateImportInDetailTax: IUpdateImportInDetailTaxCommand[] = [];
    // const deleteImportInDetailTax: IDeleteImportInDetailTaxCommand[] = [];

    const processImportInDetail = (importInId: string) => {
      /// /////////--------ImportInDetail Save(Also importInDetailSerial save cz nested) ---------

      const selectedSODRows = importInDetailRows.filter(
        (w) => w.importInId === importInId
      );

      // alert('selectedSODRows');
      // console.log('selectedSODRows');
      // console.log(selectedSODRows);
      // console.log(importInDetailRows);

      const importInDetailRowsSelected: IImportInDetailInfo[] = Array.isArray(
        selectedSODRows
      )
        ? selectedSODRows
        : [];

      for (let i = 0; i < importInDetailRowsSelected.length; i++) {
        // update importInDetail
        if (importInDetailRowsSelected[i].importInDetailId) {
          const obj: IUpdateImportInDetailCommand = {
            importInDetailId: importInDetailRowsSelected[i].importInDetailId,
            importInId: importInDetailRowsSelected[i].importInId,
            productId: importInDetailRowsSelected[i].productId,
            quantity: importInDetailRowsSelected[i].quantity,
            cost: importInDetailRowsSelected[i].cost,
            unitTypeId: importInDetailRowsSelected[i].unitTypeId,
            // discountAmount: importInDetailRowsSelected[i].discountAmount || 0,
            locationId:
              importInDetailRowsSelected[i].locationId ||
              userInfo?.locationId ||
              null,
          };

          // create importInDetailSerial-Bairerta(serial)
          for (
            let j = 0;
            j <
              importInDetailRowsSelected[i]?.importInDetailSerialInfoDto
                ?.length || 0;
            j++
          ) {
            if (
              !importInDetailRowsSelected[i].importInDetailSerialInfoDto[j]
                .importInDetailSerialId
            ) {
              const tempObj: ICreateImportInDetailSerialCommand = {
                importInDetailId:
                  importInDetailRowsSelected[i].importInDetailId,
                importInId:
                  importInDetailRowsSelected[i].importInDetailSerialInfoDto[j]
                    .importInId || '',
                serialNo:
                  importInDetailRowsSelected[i].importInDetailSerialInfoDto[j]
                    .serialNo,
              };
              createImportInDetailSerial.push(tempObj);
            }
          }

          // create importInDetailTax-Process Model moddhei jeita open, Bairerta
          // if (!importInDetailRowsSelected[i].taxRowId) {
          //   const tempObj: ICreateImportInDetailTaxCommand = {
          //     importInDetailId: importInDetailRowsSelected[i].importInDetailId,
          //     taxId: 1,
          //     taxAmount: importInDetailRowsSelected[i].taxAmount || 0,
          //   };
          //   createImportInDetailTax.push(tempObj);
          // }

          // if (!importInDetailRowsSelected[i].vatRowId) {
          //   const tempObj: ICreateImportInDetailTaxCommand = {
          //     importInDetailId: importInDetailRowsSelected[i].importInDetailId,
          //     taxId: 2,
          //     taxAmount: importInDetailRowsSelected[i].vatAmount || 0,
          //   };
          //   createImportInDetailTax.push(tempObj);
          // }
          // create importInDetailTax-Process Model moddhei jeita open, Bairerta---ENDS---

          // update importInDetailTax-Process Model moddhei jeita open, Bairerta
          // if (importInDetailRowsSelected[i].taxRowId) {
          //   const tempObj: IUpdateImportInDetailTaxCommand = {
          //     importInDetailTaxId: importInDetailRowsSelected[i].taxRowId,
          //     taxAmount: importInDetailRowsSelected[i].taxAmount || 0,
          //   };
          //   updateImportInDetailTax.push(tempObj);
          // }

          // if (importInDetailRowsSelected[i].vatRowId) {
          //   const tempObj: IUpdateImportInDetailTaxCommand = {
          //     importInDetailTaxId: importInDetailRowsSelected[i].vatRowId,
          //     taxAmount: importInDetailRowsSelected[i].vatAmount || 0,
          //   };
          //   updateImportInDetailTax.push(tempObj);
          // }
          // update importInDetailTax-Process Model moddhei jeita open, Bairerta----ENDS---

          updateImportInDetail.push(obj);
        }

        // create ImportInDetail
        if (!importInDetailRowsSelected[i].importInDetailId) {
          const obj: ICreateImportInDetailCommand = {
            importInId: importInDetailRowsSelected[i].importInId,
            productId: importInDetailRowsSelected[i].productId,
            quantity: importInDetailRowsSelected[i].quantity,
            cost: importInDetailRowsSelected[i].cost,
            createImportInDetailSerialCommand: [],
            // createImportInDetail_TaxCommand: [],
            unitTypeId: importInDetailRowsSelected[i].unitTypeId,
            companyId: userInfo?.companyId,
            locationId: userInfo?.locationId,
            // discountAmount: importInDetailRowsSelected[i].discountAmount || 0,
          };

          // create importInDetailSerial(serial) vitorer ta, importInDetailCreate er moddhe
          for (
            let j = 0;
            j <
              importInDetailRowsSelected[i].importInDetailSerialInfoDto
                ?.length || 0;
            j++
          ) {
            const tempObj: ICreateImportInDetailSerialCommand = {
              importInDetailId: null,
              importInId:
                importInDetailRowsSelected[i].importInDetailSerialInfoDto[j]
                  .importInId || '',
              serialNo:
                importInDetailRowsSelected[i].importInDetailSerialInfoDto[j]
                  .serialNo,
            };
            obj.createImportInDetailSerialCommand?.push(tempObj);
          }

          // create importInDetailTax-Process Model er importInDetail er moddhe jeita, peter vetorerta
          // if (
          //   !importInDetailRowsSelected[i].taxRowId &&
          //   !importInDetailRowsSelected[i].importInDetailId
          // ) {
          //   const tempObj: ICreateImportInDetailTaxCommand = {
          //     importInDetailId: null,
          //     taxId: 1,
          //     taxAmount: importInDetailRowsSelected[i].taxAmount || 0,
          //   };
          //   obj.createImportInDetail_TaxCommand?.push(tempObj);
          // }

          // if (
          //   !importInDetailRowsSelected[i].vatRowId &&
          //   !importInDetailRowsSelected[i].importInDetailId
          // ) {
          //   const tempObj: ICreateImportInDetailTaxCommand = {
          //     importInDetailId: null,
          //     taxId: 2,
          //     taxAmount: importInDetailRowsSelected[i].vatAmount || 0,
          //   };
          //   obj.createImportInDetail_TaxCommand?.push(tempObj);
          // }
          // create importInDetailTax-Process Model er importInDetail er moddhe jeita, peter vetorerta---ENDS---

          createImportInDetail.push(obj);
        }
      }

      // delete importInDetail, selected ones
      if (deletedImportInDetailRows.length) {
        const deletedImportInDetailRowsSelected: IDeleteImportInDetailCommand[] =
          deletedImportInDetailRows.filter((w) => w.importInId === importInId);

        for (let i = 0; i < deletedImportInDetailRowsSelected.length; i++) {
          const obj: IDeleteImportInDetailCommand = {
            importInDetailId:
              deletedImportInDetailRowsSelected[i].importInDetailId,
          };
          deleteImportInDetail.push(obj);
        }
      }
      // delete importInDetailSerial, selected ones
      if (deletedImportInDetailSerialRows.length) {
        const deletedImportInDetailSerialRowsSelected: IDeleteImportInDetailSerialCommand[] =
          deletedImportInDetailSerialRows.filter(
            (w) => w.importInId === importInId
          );

        for (
          let i = 0;
          i < deletedImportInDetailSerialRowsSelected.length;
          i++
        ) {
          const obj: IDeleteImportInDetailSerialCommand = {
            importInDetailSerialId:
              deletedImportInDetailSerialRowsSelected[i].importInDetailSerialId,
          };
          deleteImportInDetailSerial.push(obj);
        }
      }

      // delete importInDetailTax, selected ones
      // if (deletedImportInDetailTaxRows.length) {
      //   const deletedImportInDetailTaxRowsSelected: IDeleteImportInDetailTaxCommand[] =
      //     deletedImportInDetailTaxRows.filter(
      //       (w) => w.importInId === importInId
      //     );

      //   for (let i = 0; i < deletedImportInDetailTaxRowsSelected.length; i++) {
      //     const obj: IDeleteImportInDetailTaxCommand = {
      //       importInDetailTaxId:
      //         deletedImportInDetailTaxRowsSelected[i].importInDetailTaxId,
      //     };
      //     deleteImportInDetailTax.push(obj);
      //   }
      // }
    };

    // Update importIn

    for (let i = 0; i < selectedImportInRows.length; i++) {
      const prevRecordImportInRow = importInGridPrev.find(
        (w) => w.importInId === selectedImportInRows[i].importInId
      );

      // if (prevRecordImportInRow !== selectedImportInRows[i]) {
      //   const tempUpdateSO: IUpdateImportInCommand = {
      //     importInId: selectedImportInRows[i].importInId,
      //     totalAmount: selectedImportInRows[i].totalAmount,
      //     supplierId: selectedImportInRows[i].supplierId,
      //     // paymentModeId: selectedImportInRows[i].paymentModeId,
      //     // purchaseDiscount: selectedImportInRows[i].purchaseDiscount,
      //   };
      //   updateImportIn.push(tempUpdateSO);
      // }
      processImportInDetail(selectedImportInRows[i].importInId);
    }

    // --------------- The sending Obj to api----------------
    const sendingObj: IImportInProcessCommandsVM = {
      // updateImportInCommand: [...updateImportIn],
      deleteImportInCommand: [],
      createImportInDetailCommand: [...createImportInDetail],
      updateImportInDetailCommand: [...updateImportInDetail],
      deleteImportInDetailCommand: [...deleteImportInDetail],
      // createImportInAdditionalCostCommand: [],

      // updateImportInAdditionalCostCommand: [],

      // deleteImportInAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      importInId: selectedImportInRows[0]?.importInId || null, // ekhn just first row er importInId pathaisi, cz amra ekhn single row select kore edit korte parbo, future e jodi multi select kore edit korte dei, tokhn eikhane logic ta change korte hobe
      createImportInDetailSerialCommand: [...createImportInDetailSerial],
      deleteImportInDetailSerialCommand: [...deleteImportInDetailSerial],
      // createImportInDetail_TaxCommand: [...createImportInDetailTax],
      // updateImportInDetail_TaxCommand: [...updateImportInDetailTax],
      // deleteImportInDetail_TaxCommand: [],
      // deleteImportInDetailTaxCommand: [...deleteImportInDetailTax], // eita lagbena, cz individually tax/vat delete korar option nei, importInDetail delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
    };

    console.log('------The ultimate Object to send------');
    console.log(sendingObj);

    if (
      // !sendingObj.updateImportInCommand?.length &&
      !sendingObj.createImportInDetailCommand?.length &&
      !sendingObj.updateImportInDetailCommand?.length &&
      !sendingObj.deleteImportInDetailCommand?.length &&
      !sendingObj.createImportInDetailSerialCommand?.length &&
      !sendingObj.deleteImportInDetailSerialCommand?.length
    ) {
      toast.info('No changes to save');
    } else {
      // API CALL HOBE
      processSaveImportIn(sendingObj);
    }
  };

  const deleteImportIn = () => {
    const selectedRows = importInGridInitializer.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log(selectedData);

    const deletedImportIns: IDeleteImportInCommand[] = [];
    for (let i = 0; i < selectedData.length; i++) {
      const obj: IDeleteImportInCommand = {
        importInId: selectedData[i].importInId,
      };
      deletedImportIns.push(obj);
    }

    const sendingObj: IImportInProcessCommandsVM = {
      // updateImportInCommand: [],
      deleteImportInCommand: deletedImportIns,
      createImportInDetailCommand: [],
      updateImportInDetailCommand: [],
      deleteImportInDetailCommand: [],
      // createImportInAdditionalCostCommand: [],

      // updateImportInAdditionalCostCommand: [],

      // deleteImportInAdditionalCostCommand: [],
      createBiznessEventPCTrackCommand: null,
      importInId: null,
      createImportInDetailSerialCommand: [],
      deleteImportInDetailSerialCommand: [],
    };

    if (deletedImportIns.length > 0) {
      processSaveImportIn(sendingObj);
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

  const importInGridColumns = useMemo<MRT_ColumnDef<IImportInInfo>[]>(
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
              className={row.original.importInId ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Edit Detail"
            >
              <IconButton
                color="error"
                onClick={() => {
                  handleSingleRowSelection(row.id, () => {
                    handleEditDetail(row.index, row.original);
                  });
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.supplierName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.supplierName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'supplierName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Supplier',
        Cell: ({ renderedCellValue, row }) => {
          const currentSupplier = {
            supplierId: importInGrid[row.index].supplierId || null,
            supplierName: importInGrid[row.index].supplierName || '',
          };
          const isDisabled = !importInGrid[row.index].importInId;
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
                      importInGrid[row.index].supplierId =
                        selectedOption?.supplierId || null;
                      importInGrid[row.index].supplierName =
                        selectedOption?.supplierName || '';
                      // -----------------setting groupName&Id------------
                      // importInGrid[row.index].supplierGroupName =
                      //   selectedOption?.supplierGroupName || '';
                      // importInGrid[row.index].supplierGroupId =
                      //   selectedOption?.supplierGroupId || '';

                      setImportInGrid([...importInGrid]);

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

      {
        accessorFn: (row) => row.importInNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.importInNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'importInNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Import In No',
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
        accessorFn: (row) => row.lcNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.lcNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'lcNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'LC No',
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
      // {
      //   accessorFn: (row) => row.paymentModeName ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.paymentModeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'paymentModeName',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Payment Mode',
      //   Cell: ({ renderedCellValue, row }) => {
      //     const currentPaymentMode = {
      //       paymentModeId: importInGrid[row.index].paymentModeId || null,
      //       paymentModeName: importInGrid[row.index].paymentModeName || '',
      //     };
      //     const isDisabled = !importInGrid[row.index].importInId;
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
      //             } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
      //             value={currentPaymentMode}
      //             onChange={(event, selectedOption: any) => {
      //               importInGrid[row.index].paymentModeId =
      //                 selectedOption?.paymentModeId || null;
      //               importInGrid[row.index].paymentModeName =
      //                 selectedOption?.paymentModeName || '';
      //               setImportInGrid([...importInGrid]);
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
      //                     fontSize: 10, // Set the font size
      //                     marginTop: 0, // Set the margin
      //                     color: 'red', // Set the color (example)
      //                   },
      //                 }}
      //                 InputProps={{
      //                   ...params.InputProps,
      //                   style: { fontSize: 13 },
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
      // {
      //   accessorFn: (row) => row.totalVat ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.totalVat, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'totalVat',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'VAT',
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
      //   accessorFn: (row) => row.totalTax ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.totalTax, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'totalTax',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'TAX',
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
      //   accessorFn: (row) => row.purchaseDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.purchaseDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'purchaseDiscount',
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
      //             const discountTemp = Number.isNaN(
      //               parseInt(e.target.value, 10)
      //             )
      //               ? null
      //               : Math.abs(parseInt(e.target.value, 10));
      //             importInGrid[row.index].purchaseDiscount = discountTemp;
      //             setImportInGrid([...importInGrid]);
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
      //   accessorFn: (row) => row.purchaseDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.purchaseDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'purchaseDiscount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Purchase Discount',
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
      //             //   parseFloat(importInGrid[row.index]?.totalAmount || 0)
      //             // )
      //             //   ? null
      //             //   : Math.abs(parseFloat(e.target.value));
      //             importInGrid[row.index].purchaseDiscount = discountTemp || 0;
      //             importInGrid[row.index].totalAmount =
      //               (importInGrid[row.index]
      //                 .totalAmountWithoutPurchaseDiscount || 0) -
      //               (discountTemp || 0);
      //             // (importInGrid[row.index]?.totalAmount || 0) -
      //             // (discountTemp || 0);

      //             setImportInGrid([...importInGrid]);
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
  }, [sortingImportInGrid]);

  // ---------- material table virtualization---------

  const importInGridInitializer: MRT_TableInstance<IImportInInfo> =
    useMaterialReactTable({
      columns: importInGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: importInGrid || [],
      state: {
        columnVisibility,
        rowSelection,
        isLoading:
          isImportInGridLoading ||
          importInInfoIsLoading ||
          importInInfoIsFetching,
        sorting: sortingImportInGrid,
      },

      onRowSelectionChange: (updaterOrValue) => {
        const nextValue =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(rowSelection)
            : updaterOrValue;

        const nextRowId =
          Object.keys(nextValue).find((key) => nextValue[key]) || null;

        handleSingleRowSelection(nextRowId);
      },
      enableMultiRowSelection: false,
      enableSelectAll: false,
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
        return !!row.original.importInId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
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
                //     importInGridColumns
                //   );
                // const supplierSalesRptGridInfoWithoutEmpty =
                //   supplierSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(importInGrid, importInGridColumns);
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
      onSortingChange: setSortingImportInGrid,
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
                  : 'Import In Edit'}
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

                {/* <Controller
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
                /> */}

                <Controller
                  name="lcNo"
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
                        { lcNo: 'ALL' },
                        ...(Array.from(
                          new Map(
                            lcNoOptionsData?.map((lcNoOption) => [
                              lcNoOption.lcNo,
                              lcNoOption,
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
                      getOptionLabel={(option) => (option ? option.lcNo : '')}
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.lcNo === selectedValue?.lcNo
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="LCNo"
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
                  name="lcNoLength"
                  control={control}
                  // rules={{
                  //   // required: 'Amount Under is required',
                  //   validate: (value) =>
                  //     amountUnderTemp === undefined ||
                  //     value <= amountUnderTemp ||
                  //     'Amount Over must be less than or equal to Amount Under',
                  // }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="LC No Digit Length"
                      type="number"
                      value={value || ''}
                      onChange={onChange}
                      onBlur={() => {
                        onBlur();
                        // trigger(['amountUnder', 'amountOver']); // validate both
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

                <Controller
                  name="bank"
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
                        { bankId: 0, bankName: 'All' },
                        ...(Array.from(
                          new Map(
                            bankOptionsData?.map((bankOption) => [
                              bankOption.bankName,
                              bankOption,
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
                        option ? option.bankName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.bankName === selectedValue?.bankName &&
                        option.bankId === selectedValue?.bankId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bank"
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
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
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
                      ]} // Make sure tenderComboOptions is defined
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
                /> */}

                {/* <Controller
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
                        // { locationId: 0, locationName: 'Logged in Location' },
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
                /> */}

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
                /> */}
                {/* <div className="grid grid-cols-2 gap-x-4">

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
                </div> */}
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

                {/* ------------SLIDER-------------- */}

                {/* <div className="w-full col-span-2 mt-4 grid grid-cols-12 gap-x-3 gap-y-0">
                  <div className="col-span-12 text-start">
                    <p className="text-[13px]">Profitability %:</p>
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
                            style: { fontSize: 13, fontWeight: 'bold' },
                          }}
                        />
                      )}
                    />
                  </div>
                </div> */}
                {/* ------------SLIDER-------ENDS------- */}
                <div className="w-full mt-4 mb-5 col-span-2 modifiedEditTable">
                  <MaterialReactTable table={importInGridInitializer} />
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                {/* <div className="flex gap-x-3">
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      saveImportIn();
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      deleteImportIn();
                    }}
                  >
                    Delete
                  </button>
                </div> */}
                <div className="flex gap-x-3">
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    disabled={processSaveImportInIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                      ${
                        processSaveImportInIsLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg active:bg-blue-900 active:-translate-y-1 active:shadow-lg'
                      }`}
                    onClick={() => {
                      if (!processSaveImportInIsLoading) saveImportIn();
                    }}
                  >
                    {processSaveImportInIsLoading ? (
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
                    disabled={processSaveImportInIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                      ${
                        processSaveImportInIsLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-110 focus:bg-red-700 focus:shadow-lg active:bg-red-900 active:-translate-y-1 active:shadow-lg'
                      }`}
                    onClick={() => {
                      if (!processSaveImportInIsLoading) deleteImportIn();
                    }}
                  >
                    {processSaveImportInIsLoading ? (
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

          <ImportInDetail
            importInGrid={importInGrid}
            setImportInGrid={setImportInGrid}
            importInDetailRows={importInDetailRows}
            setImportInDetailRows={setImportInDetailRows}
            deletedImportInDetailRows={deletedImportInDetailRows}
            setDeletedImportInDetailRows={setDeletedImportInDetailRows}
            deletedImportInDetailSerialRows={deletedImportInDetailSerialRows}
            setDeletedImportInDetailSerialRows={
              setDeletedImportInDetailSerialRows
            }
            // deletedImportInDetailTaxRows={deletedImportInDetailTaxRows}
            // setDeletedImportInDetailTaxRows={setDeletedImportInDetailTaxRows}
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

export default ImportInEdit;
